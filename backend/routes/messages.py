"""
Message routes for 1000 Hills Solicitors
Handles message-related API endpoints
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Message, Case, User
from extensions import db
from models.enums import Role

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/cases/<int:case_id>/messages', methods=['POST', 'OPTIONS'])
def send_message(case_id):
    """Send a message for a case conversation."""
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Apply JWT and role checks for POST requests
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()
    
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        data = request.get_json() or {}
        requested_recipient_id = data.get('recipient_id')
        content = data.get('content')
        
        if not content or not content.strip():
            return jsonify({'error': 'Message content is required'}), 400
        
        # Verify case exists
        case = Case.query.get(case_id)
        if not case:
            return jsonify({'error': 'Case not found'}), 404

        # Ensure sender can participate in this case conversation.
        has_access = (
            user.role == Role.SUPER_ADMIN or
            case.client_id == current_user_id or
            case.assigned_to_id == current_user_id
        )
        if not has_access:
            return jsonify({'error': 'Access denied for this case'}), 403

        # Route recipient by case role to avoid wrong-target messages.
        if user.role == Role.CLIENT:
            if not case.assigned_to_id:
                return jsonify({'error': 'This case is not assigned to a case manager yet'}), 400
            recipient_id = case.assigned_to_id
            expected_error = 'Client messages must be sent to the assigned case manager'
        else:
            recipient_id = case.client_id
            expected_error = 'Staff messages must be sent to the case client'

        if requested_recipient_id is not None:
            try:
                if int(requested_recipient_id) != int(recipient_id):
                    return jsonify({'error': expected_error}), 400
            except (TypeError, ValueError):
                return jsonify({'error': 'Invalid recipient ID'}), 400
        
        # Verify recipient exists
        recipient = User.query.get(recipient_id)
        if not recipient:
            return jsonify({'error': 'Recipient not found'}), 404
        
        # Prevent self-targeting in malformed case assignments.
        if int(recipient_id) == int(current_user_id):
            return jsonify({'error': 'Cannot send message to yourself for this case'}), 400
        
        # Create message
        message = Message(
            case_id=case_id,
            sender_id=current_user_id,
            recipient_id=recipient_id,
            content=content.strip(),
            read=False
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'message': 'Message sent successfully',
            'data': {
                'id': message.id,
                'case_id': message.case_id,
                'sender_id': message.sender_id,
                'recipient_id': message.recipient_id,
                'content': message.content,
                'read': message.read,
                'created_at': message.created_at.isoformat() if message.created_at else None
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error sending message: {str(e)}")
        return jsonify({'error': 'Failed to send message', 'details': str(e)}), 500

@messages_bp.route('/cases/<int:case_id>/messages', methods=['GET', 'OPTIONS'])
def get_case_messages(case_id):
    """Get all messages for a case"""
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Apply JWT check for GET requests
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()
    
    try:
        current_user_id = get_jwt_identity()
        
        # Verify case exists and user has access
        case = Case.query.get(case_id)
        if not case:
            return jsonify({'error': 'Case not found'}), 404
        
        # Get user to check permissions
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user has access to this case
        has_access = (
            user.role in [Role.SUPER_ADMIN, Role.CASE_MANAGER] or
            case.client_id == current_user_id or
            case.assigned_to_id == current_user_id
        )
        
        if not has_access:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get messages
        messages = Message.query.filter_by(case_id=case_id).order_by(Message.created_at.desc()).all()
        
        messages_data = []
        for msg in messages:
            sender = User.query.get(msg.sender_id)
            recipient = User.query.get(msg.recipient_id)
            
            messages_data.append({
                'id': msg.id,
                'case_id': msg.case_id,
                'content': msg.content,
                'read': msg.read,
                'created_at': msg.created_at.isoformat() if msg.created_at else None,
                'sender': {
                    'id': sender.id,
                    'name': sender.name,
                    'email': sender.email
                } if sender else None,
                'recipient': {
                    'id': recipient.id,
                    'name': recipient.name,
                    'email': recipient.email
                } if recipient else None
            })
        
        return jsonify({
            'messages': messages_data,
            'total': len(messages_data)
        }), 200
        
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        return jsonify({'error': 'Failed to fetch messages', 'details': str(e)}), 500

@messages_bp.route('/messages/<int:message_id>/read', methods=['PUT', 'OPTIONS'])
def mark_message_read(message_id):
    """Mark a message as read"""
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Apply JWT check for PUT requests
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()
    
    try:
        current_user_id = get_jwt_identity()
        
        message = Message.query.get(message_id)
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        # Only the recipient can mark a message as read
        if message.recipient_id != current_user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        message.read = True
        db.session.commit()
        
        return jsonify({'message': 'Message marked as read'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error marking message as read: {str(e)}")
        return jsonify({'error': 'Failed to mark message as read'}), 500

@messages_bp.route('/messages/all', methods=['GET', 'OPTIONS'])
def get_all_messages():
    """Get all messages in the system (Admin only)"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()
    
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != Role.SUPER_ADMIN:
            return jsonify({'error': 'Access denied. Admin only.'}), 403
        
        # Get query parameters for filtering
        case_id = request.args.get('case_id', type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Build query
        query = Message.query
        
        if case_id:
            query = query.filter_by(case_id=case_id)
        
        if unread_only:
            query = query.filter_by(read=False)
        
        # Order by most recent first
        query = query.order_by(Message.created_at.desc())
        
        # Apply pagination
        total = query.count()
        messages = query.limit(limit).offset(offset).all()
        
        messages_data = []
        for msg in messages:
            sender = User.query.get(msg.sender_id)
            recipient = User.query.get(msg.recipient_id)
            case = Case.query.get(msg.case_id)
            
            messages_data.append({
                'id': msg.id,
                'case_id': msg.case_id,
                'case_title': case.title if case else None,
                'case_reference': f'CASE-{str(msg.case_id).zfill(4)}',
                'content': msg.content,
                'read': msg.read,
                'created_at': msg.created_at.isoformat() if msg.created_at else None,
                'sender': {
                    'id': sender.id,
                    'name': sender.name,
                    'email': sender.email,
                    'role': sender.role.value if sender.role else None
                } if sender else None,
                'recipient': {
                    'id': recipient.id,
                    'name': recipient.name,
                    'email': recipient.email,
                    'role': recipient.role.value if recipient.role else None
                } if recipient else None
            })
        
        return jsonify({
            'messages': messages_data,
            'total': total,
            'limit': limit,
            'offset': offset
        }), 200
        
    except Exception as e:
        print(f"Error fetching all messages: {str(e)}")
        return jsonify({'error': 'Failed to fetch messages', 'details': str(e)}), 500

@messages_bp.route('/messages/unread-count', methods=['GET', 'OPTIONS'])
def get_unread_count():
    """Get count of unread messages for the current user"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()
    
    try:
        current_user_id = get_jwt_identity()
        
        unread_count = Message.query.filter_by(
            recipient_id=current_user_id,
            read=False
        ).count()
        
        return jsonify({'unread_count': unread_count}), 200
        
    except Exception as e:
        print(f"Error fetching unread count: {str(e)}")
        return jsonify({'error': 'Failed to fetch unread count'}), 500

@messages_bp.route('/messages/conversations', methods=['GET', 'OPTIONS'])
def get_conversations():
    """Get all conversations for the current user grouped by case"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()
    
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get all cases user is involved in
        if user.role == Role.CLIENT:
            cases = Case.query.filter_by(client_id=current_user_id).all()
        elif user.role in [Role.CASE_MANAGER, Role.SUPER_ADMIN]:
            # Managers and admins see all cases they're assigned to or all cases for admins
            if user.role == Role.SUPER_ADMIN:
                cases = Case.query.all()
            else:
                cases = Case.query.filter_by(assigned_to_id=current_user_id).all()
        else:
            cases = []
        
        conversations = []
        for case in cases:
            # Get messages for this case
            messages = Message.query.filter_by(case_id=case.id).order_by(Message.created_at.desc()).all()
            
            # Determine the other party based on user role
            if user.role == Role.CLIENT:
                other_user = User.query.get(case.assigned_to_id) if case.assigned_to_id else None
            else:
                other_user = User.query.get(case.client_id)
            
            # Get unread count for this conversation
            unread_count = sum(1 for m in messages if m.recipient_id == current_user_id and not m.read) if messages else 0
            
            # Include all cases, even those with no messages yet
            last_message = messages[0] if messages else None
            
            conversations.append({
                'case_id': case.id,
                'case_title': case.title,
                'case_reference': f'CASE-{str(case.id).zfill(4)}',
                'case_status': case.status.value if case.status else None,
                'unread_count': unread_count,
                'message_count': len(messages),
                'last_message': {
                    'id': last_message.id,
                    'content': last_message.content,
                    'created_at': last_message.created_at.isoformat() if last_message.created_at else None,
                    'sender_id': last_message.sender_id,
                    'read': last_message.read
                } if last_message else None,
                'other_party': {
                    'id': other_user.id,
                    'name': other_user.name,
                    'email': other_user.email,
                    'role': other_user.role.value if other_user.role else None
                } if other_user else None
            })
        
        # Sort by last message time (newest first), with cases without messages at the end
        conversations.sort(key=lambda x: (
            x['last_message']['created_at'] if x['last_message'] else '0000-01-01'
        ), reverse=True)
        
        return jsonify({
            'conversations': conversations,
            'total': len(conversations)
        }), 200
        
    except Exception as e:
        print(f"Error fetching conversations: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch conversations', 'details': str(e)}), 500
