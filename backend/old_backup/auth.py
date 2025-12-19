from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, bcrypt, jwt
from models import User, Role
from functools import wraps

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"msg": "Missing email, password, or name"}), 400

    if db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none():
        return jsonify({"msg": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Default role is CLIENT
    new_user = User(
        email=email,
        password_hash=hashed_password,
        name=name,
        role=Role.CLIENT,
        email_verified=False
    )
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully", "user_id": new_user.id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        # Create access token
        access_token = create_access_token(identity=user.id, additional_claims={"role": user.role.value})
        return jsonify(access_token=access_token, user_role=user.role.value)
    
    return jsonify({"msg": "Bad username or password"}), 401

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(id=current_user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(logged_in_as=user.email, role=user.role.value), 200

# Role-based access control decorator
def role_required(role: Role):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = db.session.execute(db.select(User).filter_by(id=current_user_id)).scalar_one_or_none()
            
            if not user or user.role.value != role.value:
                return jsonify({"msg": "Access forbidden: Insufficient permissions"}), 403
            
            return fn(*args, **kwargs)
        return decorated_function
    return wrapper

# Example usage of role_required
@auth_bp.route('/admin-only', methods=['GET'])
@role_required(Role.SUPER_ADMIN)
def admin_only():
    return jsonify({"msg": "Welcome, Super Admin!"}), 200

# Register the blueprint in app.py
# (This will be done in the next step)
