from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import decode_token
from flask import request
from extensions import db, socketio
from models import Message, Case, User, Role
from sqlalchemy import select

# Helper function to get user ID from token
def get_user_id_from_token(token):
    try:
        decoded_token = decode_token(token)
        return decoded_token['sub']
    except Exception:
        return None

@socketio.on('connect')
def handle_connect(auth):
    """Handles new WebSocket connections and authenticates the user."""
    if auth and 'token' in auth:
        user_id = get_user_id_from_token(auth['token'])
        if user_id:
            # Store user ID in the session for later use
            # request.sid is the session ID for the connection
            # In a real app, you'd map user_id to request.sid in a database/cache
            print(f"User {user_id} connected with SID {request.sid}")
            emit('status', {'msg': 'Connected and authenticated'}, room=request.sid)
            return
    
    print("Unauthenticated connection rejected")
    return False # Reject connection

@socketio.on('join_case')
def on_join_case(data):
    """Allows a user (client or staff) to join a specific case room."""
    token = data.get('token')
    case_id = data.get('case_id')
    user_id = get_user_id_from_token(token)
    
    if not user_id or not case_id:
        return

    # Verify user is part of the case (client or assigned staff)
    case = db.session.execute(select(Case).filter_by(id=case_id)).scalar_one_or_none()
    user = db.session.execute(select(User).filter_by(id=user_id)).scalar_one_or_none()

    if not case or not user:
        return

    is_client = case.client_id == user_id
    is_staff = user.role in [Role.CASE_MANAGER, Role.SUPER_ADMIN]
    is_assigned_staff = case.assigned_to_id == user_id

    if is_client or is_staff:
        room = f"case_{case_id}"
        join_room(room)
        print(f"User {user_id} joined room {room}")
        emit('status', {'msg': f'Joined case room {case_id}'}, room=request.sid)
    else:
        emit('error', {'msg': 'Unauthorized to join this case room'}, room=request.sid)

@socketio.on('send_message')
def handle_send_message(data):
    """Handles a new message sent within a case."""
    token = data.get('token')
    case_id = data.get('case_id')
    content = data.get('content')
    user_id = get_user_id_from_token(token)

    if not user_id or not case_id or not content:
        return

    case = db.session.execute(select(Case).filter_by(id=case_id)).scalar_one_or_none()
    sender = db.session.execute(select(User).filter_by(id=user_id)).scalar_one_or_none()

    if not case or not sender:
        return

    # Determine recipient (the other party in the case)
    if sender.role == Role.CLIENT:
        recipient_id = case.assigned_to_id
    else:
        recipient_id = case.client_id

    if not recipient_id:
        # Case not yet assigned, send to a general staff room or notify admin
        # For now, we'll just skip saving if no recipient is set
        print(f"Message in case {case_id} not saved: No assigned lawyer.")
        return

    # Save message to database
    new_message = Message(
        content=content,
        case_id=case_id,
        sender_id=user_id,
        recipient_id=recipient_id
    )
    db.session.add(new_message)
    db.session.commit()

    # Broadcast message to the case room
    room = f"case_{case_id}"
    message_data = {
        'id': new_message.id,
        'case_id': case_id,
        'content': content,
        'sender_id': user_id,
        'sender_name': sender.name,
        'created_at': new_message.created_at.isoformat()
    }
    emit('new_message', message_data, room=room)
    
    # Emit a notification event for the recipient (handled in the next phase)
    # emit('notification', {'type': 'new_message', 'case_id': case_id}, room=f"user_{recipient_id}")

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

# Function to emit a case status update (called from case_management.py)
def emit_case_status_update(case_id, new_status):
    room = f"case_{case_id}"
    socketio.emit('case_update', {'case_id': case_id, 'status': new_status}, room=room)

# Function to emit a general notification (called from notification system)
def emit_notification(user_id, notification_data):
    room = f"user_{user_id}"
    socketio.emit('notification', notification_data, room=room)
