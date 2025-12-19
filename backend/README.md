# 1000 Hills Solicitors - Backend API

A robust Flask-based REST API for the 1000 Hills Solicitors case management system with JWT authentication, role-based access control, and real-time WebSocket support.

## 🚀 Tech Stack

- **Framework**: Flask 3.1.0
- **Database**: SQLAlchemy ORM with SQLite (configurable for PostgreSQL/MySQL)
- **Authentication**: Flask-JWT-Extended with bcrypt password hashing
- **Real-time**: Flask-SocketIO for WebSocket connections
- **CORS**: Flask-CORS for cross-origin requests
- **Testing**: pytest for unit and integration tests

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Desire-2/1000-hills-solicitors.git
cd 1000-hills-solicitors/backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# On Linux/Mac
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES=3600  # 1 hour in seconds

# Database Configuration
DATABASE_URL=sqlite:///instance/legal_cms.db
# For PostgreSQL: postgresql://user:password@localhost/dbname
# For MySQL: mysql://user:password@localhost/dbname

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Server Configuration
HOST=0.0.0.0
PORT=5000
DEBUG=True
```

### 5. Initialize Database

```bash
python setup_db.py
```

This will create:
- Database tables based on SQLAlchemy models
- Three test users with different roles:
  - **Super Admin**: admin@1000hills.com (password: admin123)
  - **Case Manager**: manager@1000hills.com (password: manager123)
  - **Client**: client@example.com (password: client123)

## 🏃 Running the Server

### Development Mode

```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Production Mode

```bash
# Using Gunicorn (recommended)
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app

# With WebSocket support
gunicorn --bind 0.0.0.0:5000 --workers 4 --worker-class eventlet app:app
```

## 📁 Project Structure

```
backend/
├── app.py                      # Main application entry point
├── extensions.py               # Flask extensions initialization
├── requirements.txt            # Python dependencies
├── setup_db.py                # Database initialization script
├── test_backend.py            # Backend API tests
├── test_jwt.py                # JWT authentication tests
│
├── config/
│   ├── __init__.py
│   └── settings.py            # Application configuration
│
├── models/                    # SQLAlchemy models
│   ├── __init__.py
│   ├── base.py               # Base model class
│   ├── user.py               # User model
│   ├── case.py               # Case model
│   ├── case_note.py          # Case note model
│   ├── document.py           # Document model
│   ├── message.py            # Message model
│   ├── deadline.py           # Deadline model
│   ├── cms.py                # CMS content model
│   └── enums.py              # Enum definitions
│
├── routes/                    # API route blueprints
│   ├── __init__.py
│   ├── auth.py               # Authentication endpoints
│   └── cases.py              # Case management endpoints
│
├── services/                  # Business logic layer
│   ├── __init__.py
│   ├── auth_service.py       # Authentication service
│   └── case_service.py       # Case management service
│
├── utils/                     # Utility functions
│   ├── __init__.py
│   ├── decorators.py         # Custom decorators
│   ├── helpers.py            # Helper functions
│   └── serializers.py        # Model serializers
│
├── websockets/                # WebSocket handlers
│   ├── __init__.py
│   └── handlers.py           # Socket event handlers
│
└── instance/                  # Instance-specific files
    └── legal_cms.db          # SQLite database (created after setup)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid JWT token in the Authorization header.

### Login Flow

1. **Register/Login**: POST to `/api/auth/register` or `/api/auth/login`
2. **Receive Token**: Get `access_token` in response
3. **Use Token**: Include in headers: `Authorization: Bearer <token>`
4. **Refresh Token**: POST to `/api/auth/refresh` to get a new token

### User Roles

- **SUPER_ADMIN**: Full system access, user management, analytics
- **CASE_MANAGER**: Case management, client management, document handling
- **CLIENT**: View own cases, messages, documents, appointments

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | Yes |
| GET | `/me` | Get current user | Yes |
| POST | `/refresh` | Refresh access token | Yes |

### Cases (`/api/cases`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/` | Get all cases | Yes | All |
| POST | `/` | Create new case | Yes | Manager, Admin |
| GET | `/:id` | Get case details | Yes | All |
| PUT | `/:id` | Update case | Yes | Manager, Admin |
| DELETE | `/:id` | Delete case | Yes | Admin |
| GET | `/:id/notes` | Get case notes | Yes | All |
| POST | `/:id/notes` | Add case note | Yes | Manager, Admin |
| GET | `/:id/documents` | Get case documents | Yes | All |
| POST | `/:id/documents` | Upload document | Yes | Manager, Admin |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/users` | Get all users | Yes | Admin |
| POST | `/users` | Create user | Yes | Admin |
| PUT | `/users/:id` | Update user | Yes | Admin |
| DELETE | `/users/:id` | Delete user | Yes | Admin |
| GET | `/analytics` | Get system analytics | Yes | Admin |
| GET | `/activity` | Get activity log | Yes | Admin |

### Example Request

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@1000hills.com", "password": "admin123"}'

# Get cases (with token)
curl -X GET http://localhost:5000/api/cases \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🧪 Testing

### Run All Tests

```bash
pytest
```

### Run Specific Tests

```bash
# Test authentication
python test_jwt.py

# Test backend API
python test_backend.py
```

### Test Coverage

```bash
pytest --cov=. --cov-report=html
```

## 🗄️ Database Models

### User
- id, email, password_hash, first_name, last_name, role
- phone, address, date_joined, last_login, is_active

### Case
- id, title, description, case_number, status, priority
- client_id, assigned_to, created_at, updated_at, deadline

### CaseNote
- id, case_id, user_id, content, created_at, is_internal

### Document
- id, case_id, uploaded_by, filename, file_path, file_type
- file_size, upload_date, description

### Message
- id, sender_id, receiver_id, case_id, subject, content
- created_at, read_at, is_archived

### Deadline
- id, case_id, title, description, due_date, status
- priority, assigned_to, created_at, completed_at

## 🔄 Database Migrations

To modify the database schema:

1. Update model classes in `models/`
2. Run migration (if using Flask-Migrate):
   ```bash
   flask db migrate -m "Description of changes"
   flask db upgrade
   ```
3. Or reinitialize database:
   ```bash
   python setup_db.py
   ```

## 🔌 WebSocket Events

Real-time features using Socket.IO:

### Client → Server Events
- `connect`: Client connection
- `disconnect`: Client disconnection
- `join_room`: Join a case room
- `leave_room`: Leave a case room
- `send_message`: Send chat message

### Server → Client Events
- `message`: New message received
- `case_update`: Case status changed
- `notification`: System notification
- `user_status`: User online/offline status

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **CORS Protection**: Configured allowed origins
- **SQL Injection Prevention**: SQLAlchemy ORM
- **XSS Protection**: Input sanitization
- **Rate Limiting**: (Recommended to add Flask-Limiter)

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_APP` | Flask application entry point | `app.py` |
| `FLASK_ENV` | Environment (development/production) | `development` |
| `SECRET_KEY` | Flask secret key | Required |
| `JWT_SECRET_KEY` | JWT signing key | Required |
| `JWT_ACCESS_TOKEN_EXPIRES` | Token expiry (seconds) | `3600` |
| `DATABASE_URL` | Database connection string | `sqlite:///instance/legal_cms.db` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `5000` |
| `DEBUG` | Debug mode | `True` |

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python setup_db.py

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/legal_cms
      - FRONTEND_URL=https://your-frontend-domain.com
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=legal_cms
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check database file permissions
ls -la instance/

# Recreate database
rm instance/legal_cms.db
python setup_db.py
```

### JWT Token Errors
```bash
# Verify JWT secret key is set
echo $JWT_SECRET_KEY

# Test JWT functionality
python test_jwt.py
```

### CORS Issues
- Verify `FRONTEND_URL` in `.env`
- Check `CORS(app, origins=[...])` in `app.py`

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- [Flask-SocketIO](https://flask-socketio.readthedocs.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for 1000 Hills Solicitors.

## 👥 Support

For support, email: support@1000hillssolicitors.com

---

**Version**: 1.0.0  
**Last Updated**: December 19, 2025
