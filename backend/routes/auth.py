"""
Authentication routes.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services import AuthService
from utils import user_to_dict, get_current_user

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"msg": "Missing email, password, or name"}), 400

    user, error = AuthService.register_user(email, password, name)
    
    if error:
        return jsonify({"msg": error}), 409
    
    return jsonify({
        "msg": "User created successfully",
        "user_id": user.id
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    result, error = AuthService.authenticate_user(email, password)
    
    if error:
        return jsonify({"msg": error}), 401
    
    return jsonify(result), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user_info():
    """Get current user information."""
    try:
        from flask import request as flask_request
        print(f"[DEBUG] Headers: {dict(flask_request.headers)}")
        print(f"[DEBUG] Auth header: {flask_request.headers.get('Authorization')}")
        
        user_id = get_jwt_identity()
        print(f"[DEBUG] JWT Identity: {user_id}")
        
        user = get_current_user()
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        return jsonify(user_to_dict(user)), 200
    except Exception as e:
        print(f"Error in /me endpoint: {str(e)}")
        return jsonify({"msg": "Internal server error", "error": str(e)}), 500


@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Protected route for testing authentication."""
    user = get_current_user()
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(
        logged_in_as=user.email,
        role=user.role.value
    ), 200
