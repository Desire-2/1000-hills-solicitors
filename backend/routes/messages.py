"""
Message routes for 1000 Hills Solicitors
Handles message-related API endpoints
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Message, Case, User
from extensions import db
from datetime import datetime
from utils.decorators import role_required
from models.enums import Role

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/cases/<int:case_id>/messages', methods=['POST', 'OPTIONS'])
def send_message(case_id):
    """Send a message to a client about a case"""
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    # Apply JWT and role checks for POST requests
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()
    
    current_user_id = get_jwt_identity()
    from models import User
    user = User.query.get(current_user_id)
    
    if not user or user.role not in [Role.CASE_MANAGER, Role.SUPER_ADMIN]:
        return jsonify({'error': 'Access denied'}), 403
    
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        recipient_id = data.get('recipient_id')
        content = data.get('content')
        
        if not content or not content.strip():
            return jsonify({'error': 'Message content is required'}), 400
        
        # Verify case exists
        case = Case.query.get(case_id)
        if not case:
            return jsonify({'error': 'Case not found'}), 404
        
        # Verify recipient exists
        recipient = User.query.get(recipient_id)
        if not recipient:
            return jsonify({'error': 'Recipient not found'}), 404
        
        # Verify recipient is the client of this case
        if case.client_id != recipient_id:
            return jsonify({'error': 'Can only send messages to the case client'}), 403
        
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
