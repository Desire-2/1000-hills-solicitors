"""
Admin and user management routes.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils import role_required, user_to_dict, get_current_user
from models import Role, User
from extensions import db
from werkzeug.security import generate_password_hash

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route('/case-managers', methods=['GET'])
@role_required(Role.SUPER_ADMIN, Role.CASE_MANAGER)
def get_case_managers():
    """Get all case managers (accessible by managers and admins)."""
    managers = User.query.filter(User.role == Role.CASE_MANAGER).all()
    return jsonify([user_to_dict(user) for user in managers]), 200


@admin_bp.route('/users', methods=['GET'])
@role_required(Role.SUPER_ADMIN)
def get_all_users():
    """Get all users with optional filtering."""
    role_filter = request.args.get('role')
    status_filter = request.args.get('status')
    search = request.args.get('search', '').lower()
    
    query = User.query
    
    # Apply filters
    if role_filter and role_filter != 'ALL':
        try:
            role_enum = Role[role_filter]
            query = query.filter(User.role == role_enum)
        except KeyError:
            return jsonify({"msg": "Invalid role filter"}), 400
    
    users = query.all()
    
    # Apply search filter
    if search:
        users = [u for u in users if search in u.name.lower() or search in u.email.lower()]
    
    return jsonify([user_to_dict(user) for user in users]), 200


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@role_required(Role.SUPER_ADMIN)
def get_user(user_id):
    """Get a specific user by ID."""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(user_to_dict(user)), 200


@admin_bp.route('/users', methods=['POST'])
@role_required(Role.SUPER_ADMIN)
def create_user():
    """Create a new user."""
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'CLIENT')
    
    if not email or not password or not name:
        return jsonify({"msg": "Missing required fields"}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User with this email already exists"}), 409
    
    try:
        role_enum = Role[role]
    except KeyError:
        return jsonify({"msg": "Invalid role"}), 400
    
    # Create new user
    new_user = User(
        email=email,
        name=name,
        role=role_enum,
        password_hash=generate_password_hash(password)
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "msg": "User created successfully",
        "user": user_to_dict(new_user)
    }), 201


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@role_required(Role.SUPER_ADMIN)
def update_user(user_id):
    """Update a user's information."""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json()
    
    # Update fields if provided
    if 'name' in data:
        user.name = data['name']
    
    if 'email' in data:
        # Check if email is already taken by another user
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({"msg": "Email already in use"}), 409
        user.email = data['email']
    
    if 'role' in data:
        try:
            role_enum = Role[data['role']]
            user.role = role_enum
        except KeyError:
            return jsonify({"msg": "Invalid role"}), 400
    
    if 'password' in data and data['password']:
        user.password_hash = generate_password_hash(data['password'])
    
    db.session.commit()
    
    return jsonify({
        "msg": "User updated successfully",
        "user": user_to_dict(user)
    }), 200


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@role_required(Role.SUPER_ADMIN)
def delete_user(user_id):
    """Delete a user."""
    current_user = get_current_user()
    
    # Prevent deleting yourself
    if current_user.id == user_id:
        return jsonify({"msg": "Cannot delete your own account"}), 400
    
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"msg": "User deleted successfully"}), 200


@admin_bp.route('/stats', methods=['GET'])
@role_required(Role.SUPER_ADMIN)
def get_stats():
    """Get system statistics."""
    from models import Case
    
    total_users = User.query.count()
    total_cases = Case.query.count()
    
    # Count users by role
    role_counts = {}
    for role in Role:
        count = User.query.filter_by(role=role).count()
        role_counts[role.value] = count
    
    # Count cases by status
    from models import CaseStatus
    status_counts = {}
    for status in CaseStatus:
        count = Case.query.filter_by(status=status).count()
        status_counts[status.value] = count
    
    return jsonify({
        "total_users": total_users,
        "total_cases": total_cases,
        "users_by_role": role_counts,
        "cases_by_status": status_counts
    }), 200


@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['POST'])
@role_required(Role.SUPER_ADMIN)
def toggle_user_status(user_id):
    """Toggle user active/inactive status."""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    # Toggle the email_verified field as a proxy for active status
    user.email_verified = not user.email_verified
    db.session.commit()
    
    status = "active" if user.email_verified else "inactive"
    
    return jsonify({
        "msg": f"User status changed to {status}",
        "user": user_to_dict(user)
    }), 200


@admin_bp.route('/activity-log', methods=['GET'])
@role_required(Role.SUPER_ADMIN)
def get_activity_log():
    """Get recent system activity."""
    # Placeholder for activity log functionality
    # In a real implementation, this would query an activity log table
    
    activities = [
        {
            "id": 1,
            "user": "John Smith",
            "action": "Created new case",
            "details": "Property Dispute",
            "timestamp": "2025-12-19T10:30:00Z"
        },
        {
            "id": 2,
            "user": "Sarah Johnson",
            "action": "Updated case status",
            "details": "Contract Review",
            "timestamp": "2025-12-19T10:25:00Z"
        }
    ]
    
    return jsonify(activities), 200
