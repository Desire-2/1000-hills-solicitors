"""
Decorators for route protection and authorization.
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Role


def role_required(*allowed_roles):
    """
    Decorator to check if the user has one of the allowed roles.
    
    Usage:
        @role_required(Role.SUPER_ADMIN, Role.CASE_MANAGER)
        def admin_only_route():
            pass
    """
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = db.session.execute(
                db.select(User).filter_by(id=current_user_id)
            ).scalar_one_or_none()
            
            if not user:
                return jsonify({"msg": "User not found"}), 404
            
            if user.role not in allowed_roles:
                return jsonify({
                    "msg": "Access forbidden: Insufficient permissions"
                }), 403
            
            return fn(*args, **kwargs)
        return decorated_function
    return wrapper


def get_current_user():
    """Helper function to get the current authenticated user."""
    current_user_id = get_jwt_identity()
    # Convert string ID back to integer
    user_id = int(current_user_id) if current_user_id else None
    return db.session.execute(
        db.select(User).filter_by(id=user_id)
    ).scalar_one_or_none()
