"""
Authentication service for user management.
"""
from extensions import db, bcrypt
from models import User, Role
from flask_jwt_extended import create_access_token


class AuthService:
    """Service class for authentication operations."""
    
    @staticmethod
    def register_user(email, password, name, role=Role.CLIENT):
        """Register a new user."""
        # Check if user already exists
        existing_user = db.session.execute(
            db.select(User).filter_by(email=email)
        ).scalar_one_or_none()
        
        if existing_user:
            return None, "User already exists"
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Create new user
        new_user = User(
            email=email,
            password_hash=hashed_password,
            name=name,
            role=role,
            email_verified=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user, None
    
    @staticmethod
    def authenticate_user(email, password):
        """Authenticate a user and return access token."""
        user = db.session.execute(
            db.select(User).filter_by(email=email)
        ).scalar_one_or_none()
        
        if not user:
            return None, "Invalid credentials"
        
        if not bcrypt.check_password_hash(user.password_hash, password):
            return None, "Invalid credentials"
        
        # Create access token (identity must be a string)
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role.value}
        )
        
        return {
            "access_token": access_token,
            "user_role": user.role.value,
            "user_id": user.id,
            "user_name": user.name
        }, None
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get a user by ID."""
        return db.session.execute(
            db.select(User).filter_by(id=user_id)
        ).scalar_one_or_none()
    
    @staticmethod
    def get_all_users():
        """Get all users."""
        return db.session.execute(db.select(User)).scalars().all()
