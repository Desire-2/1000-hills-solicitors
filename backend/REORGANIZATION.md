# Backend Reorganization

## New Project Structure

The backend has been reorganized following best practices for Flask applications:

```
backend/
├── app_new.py              # Main application with factory pattern
├── extensions.py           # Flask extensions initialization
├── requirements.txt        # Python dependencies
├── setup_db_new.py        # Database initialization script
│
├── config/                 # Configuration module
│   ├── __init__.py
│   └── settings.py        # Development, Production, Testing configs
│
├── models/                 # Database models (organized by domain)
│   ├── __init__.py
│   ├── base.py           # SQLAlchemy base
│   ├── enums.py          # Enum definitions (Role, Status, etc.)
│   ├── user.py           # User model
│   ├── case.py           # Case model
│   ├── message.py        # Message model
│   ├── document.py       # Document model
│   ├── case_note.py      # CaseNote model
│   ├── deadline.py       # Deadline model
│   └── cms.py            # CMS models (Service, TeamMember, BlogPost)
│
├── routes/                 # Route blueprints
│   ├── __init__.py
│   ├── auth.py           # Authentication routes
│   └── cases.py          # Case management routes
│
├── services/               # Business logic layer
│   ├── __init__.py
│   ├── auth_service.py   # Authentication service
│   └── case_service.py   # Case management service
│
├── utils/                  # Utility functions and helpers
│   ├── __init__.py
│   ├── decorators.py     # Custom decorators (role_required, etc.)
│   ├── serializers.py    # Model to dict converters
│   └── helpers.py        # Helper functions
│
└── websockets/             # WebSocket handlers
    ├── __init__.py
    └── handlers.py       # Socket.IO event handlers
```

## Key Improvements

### 1. **Separation of Concerns**
- **Models**: Pure data models with relationships
- **Services**: Business logic and database operations
- **Routes**: Request handling and response formatting
- **Utils**: Reusable helper functions and decorators

### 2. **Application Factory Pattern**
- Flexible configuration management
- Easier testing with different configs
- Better organized initialization

### 3. **Organized Models**
- Each model in its own file
- Centralized enums
- Clear relationships and dependencies

### 4. **Service Layer**
- Business logic separated from routes
- Easier to test and maintain
- Reusable across different endpoints

### 5. **Utility Module**
- Reusable decorators (`@role_required`)
- Serialization helpers
- Common validation functions

## Migration Guide

### Running the New Application

1. **Use the new app file:**
   ```bash
   python app_new.py
   ```

2. **Initialize database:**
   ```bash
   python setup_db_new.py
   ```

### Key Changes in Imports

**Old way:**
```python
from models import User, Case, Role
from auth import role_required
```

**New way:**
```python
from models import User, Case, Role
from utils import role_required
```

### API Endpoints (No changes)

All endpoints remain the same:

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info
- `GET /auth/protected` - Protected test route

#### Cases
- `POST /cases/` - Submit new case
- `GET /cases/` - Get client's cases
- `GET /cases/<id>` - Get case details
- `GET /cases/admin` - Get all cases (staff)
- `GET /cases/admin/<id>` - Get case details (staff)
- `PUT /cases/admin/<id>` - Update case (staff)

## Configuration

The new configuration system supports multiple environments:

**Environment variables:**
- `FLASK_ENV`: Set to `development`, `production`, or `testing`
- `SECRET_KEY`: Application secret key
- `DATABASE_URL`: Database connection string

**Example `.env` file:**
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///app.db
```

## Testing the New Structure

1. **Start the server:**
   ```bash
   python app_new.py
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:5001/health
   ```

3. **Login with test user:**
   ```bash
   curl -X POST http://localhost:5001/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@1000hills.com","password":"SuperSecureAdminPassword123"}'
   ```

## Benefits

1. **Maintainability**: Clear separation makes it easier to find and modify code
2. **Scalability**: Easy to add new features and models
3. **Testability**: Services can be tested independently
4. **Reusability**: Utils and services can be reused across the application
5. **Team Collaboration**: Developers can work on different modules without conflicts

## Next Steps

1. Add comprehensive tests for each service
2. Implement additional CMS routes
3. Add document upload/download functionality
4. Implement notification system
5. Add API documentation (Swagger/OpenAPI)

## Notes

- The old files (`app.py`, `auth.py`, `case_management.py`, `models.py`, `websocket.py`, `setup_db.py`) are kept for reference
- Once verified, the old files can be deleted
- Database migrations are handled through Flask-Migrate
- WebSocket functionality remains unchanged in behavior
