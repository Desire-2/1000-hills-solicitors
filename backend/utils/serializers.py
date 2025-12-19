"""
Serialization helper functions.
"""
from models import Case, User, Message


def case_to_dict(case):
    """Serialize a Case object to dictionary."""
    return {
        "id": case.id,
        "case_id": case.case_id,
        "title": case.title,
        "description": case.description,
        "category": case.category.value,
        "status": case.status.value,
        "priority": case.priority.value,
        "client_id": case.client_id,
        "client_name": case.client.name,
        "assigned_to_id": case.assigned_to_id,
        "assigned_to_name": case.assigned_to.name if case.assigned_to else None,
        "created_at": case.created_at.isoformat(),
        "updated_at": case.updated_at.isoformat(),
    }


def user_to_dict(user, include_sensitive=False):
    """Serialize a User object to dictionary."""
    data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value,
        "phone": user.phone,
        "email_verified": user.email_verified,
        "created_at": user.created_at.isoformat(),
    }
    
    if not include_sensitive:
        # Remove sensitive fields for public viewing
        pass
    
    return data


def message_to_dict(message):
    """Serialize a Message object to dictionary."""
    return {
        "id": message.id,
        "content": message.content,
        "read": message.read,
        "case_id": message.case_id,
        "sender_id": message.sender_id,
        "sender_name": message.sender.name,
        "recipient_id": message.recipient_id,
        "recipient_name": message.recipient.name,
        "created_at": message.created_at.isoformat(),
    }
