"""
Application factory and initialization.
"""
from flask import Flask, jsonify
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
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    
    # Register blueprints
    from routes import auth_bp, case_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(case_bp)
    
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
        return jsonify({"status": "healthy"}), 200
    
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
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Run with SocketIO
    socketio.run(app, debug=True, port=5001)
