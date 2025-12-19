import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db, migrate, jwt, bcrypt, socketio

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# --- Configuration ---
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key_for_dev')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key_for_dev')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour

# --- Extensions Initialization ---
db.init_app(app)
migrate.init_app(app, db)
CORS(app)
jwt.init_app(app)
bcrypt.init_app(app)
socketio.init_app(app)

# Import and register blueprints
from auth import auth_bp
from case_management import case_bp
app.register_blueprint(auth_bp)
app.register_blueprint(case_bp)

# Import models after db initialization to avoid circular imports
from models import *

# Import websocket handlers after all other initializations
import websocket

# --- Routes ---

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the 1000 Hills Solicitors Backend API", "status": "running"})

# Example route to test database connection and model
@app.route('/users', methods=['GET'])
def get_users():
    try:
        # Simple query to test connection
        users = db.session.execute(db.select(User)).scalars().all()
        return jsonify([{"id": user.id, "name": user.name, "email": user.email, "role": user.role.value} for user in users])
    except Exception as e:
        return jsonify({"error": str(e), "message": "Database connection or query failed"}), 500

# --- Main Execution ---
if __name__ == '__main__':
    # Create database tables if they don't exist (for SQLite only, migrations preferred for PostgreSQL)
    with app.app_context():
        db.create_all()
    
    # Run with SocketIO
    socketio.run(app, debug=True, port=5001)
