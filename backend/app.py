"""
Application factory and initialization.
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from extensions import db, migrate, jwt, bcrypt, socketio
from config import get_config


def create_app(config_name=None):
    """
    Application factory pattern for creating Flask app.
    
    Args:
        config_name: Configuration name (development, production, testing)
    
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    config_class = get_config(config_name)
    app.config.from_object(config_class)
    
    # Debug: Print JWT configuration
    print("="*60)
    print("JWT Configuration:")
    print(f"JWT_SECRET_KEY: {app.config.get('JWT_SECRET_KEY', 'NOT SET')[:20]}...")
    print(f"JWT_ACCESS_TOKEN_EXPIRES: {app.config.get('JWT_ACCESS_TOKEN_EXPIRES')}")
    print(f"JWT_TOKEN_LOCATION: {app.config.get('JWT_TOKEN_LOCATION')}")
    print(f"JWT_CSRF_METHODS: {app.config.get('JWT_CSRF_METHODS')}")
    print("="*60)
    
    # Debug: Print DATABASE_URL
    print("="*60)
    print("Database Configuration:")
    print(f"DATABASE_URL: {app.config.get('SQLALCHEMY_DATABASE_URI', 'NOT SET')}")
    print("="*60)
    
    # Ensure instance folder exists and is writable (used for sqlite file)
    import os
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except Exception:
        # If instance_path cannot be created, log and continue; DB init may fail later
        print(f"Warning: could not create instance path: {app.instance_path}")

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS with proper settings
    allowed_origins = app.config.get('CORS_ORIGINS', [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ])
    
    # Add FRONTEND_URL from environment if set
    import os
    frontend_url = os.getenv('FRONTEND_URL')
    if frontend_url and frontend_url not in allowed_origins:
        allowed_origins.append(frontend_url)
    
    print("="*60)
    print(f"CORS Allowed Origins: {allowed_origins}")
    print("="*60)
    
    CORS(app, resources={
        r"/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600
        }
    })
    
    jwt.init_app(app)
    bcrypt.init_app(app)
    socketio.init_app(app, cors_allowed_origins=allowed_origins)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "msg": "Token has expired",
            "error": "token_expired"
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "msg": "Invalid token",
            "error": "invalid_token"
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "msg": "Authorization token is missing",
            "error": "authorization_required"
        }), 401
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "msg": "Token has been revoked",
            "error": "token_revoked"
        }), 401
    
    # Register blueprints
    from routes import auth_bp, case_bp, notes_bp, messages_bp, appointments_bp
    from routes.admin import admin_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(case_bp)
    app.register_blueprint(notes_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(messages_bp)
    app.register_blueprint(appointments_bp)
    
    # CORS preflight handler
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
        return response
    
    # Import models (needed for migrations)
    from models import (
        User, Case, Message, Document, CaseNote, 
        Deadline, Service, TeamMember, BlogPost
    )
    
    # Import websocket handlers
    import websockets.handlers
    
    # Register base routes
    @app.route('/')
    def index():
        return jsonify({
            "message": "Welcome to the 1000 Hills Solicitors Backend API",
            "status": "running",
            "version": "2.0"
        })
    
    @app.route('/health')
    def health_check():
        """Health check endpoint."""
        return jsonify({
            "status": "healthy",
            "message": "Backend is running"
        }), 200
    
    @app.route('/users', methods=['GET'])
    def get_users():
        """Get all users (for testing)."""
        try:
            users = db.session.execute(db.select(User)).scalars().all()
            return jsonify([{
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.value
            } for user in users])
        except Exception as e:
            return jsonify({
                "error": str(e),
                "message": "Database connection or query failed"
            }), 500
    
    return app


# Create app instance for running
app = create_app()


if __name__ == '__main__':
    import os
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Use PORT from environment for Render deployment
    port = int(os.environ.get('PORT', 5001))
    
    # Run with SocketIO
    socketio.run(app, host='0.0.0.0', debug=False, port=port)
