# Backend Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                   (Frontend / Mobile App)                    │
└───────────────┬────────────────────────┬────────────────────┘
                │                        │
                │ HTTP/REST              │ WebSocket
                │                        │
┌───────────────▼────────────────────────▼────────────────────┐
│                      FLASK APP                               │
│                    (app_new.py)                             │
└──────┬────────────────────┬─────────────────┬──────────────┘
       │                    │                 │
       │                    │                 │
┌──────▼──────┐    ┌───────▼────────┐   ┌───▼────────────┐
│   ROUTES    │    │   WEBSOCKETS   │   │   EXTENSIONS   │
│             │    │                │   │                │
│ • auth.py   │    │ • handlers.py  │   │ • db           │
│ • cases.py  │    │                │   │ • jwt          │
│             │    │                │   │ • socketio     │
└──────┬──────┘    └────────────────┘   │ • bcrypt       │
       │                                 └────────────────┘
       │
┌──────▼──────────────────────────┐
│          SERVICES               │
│     (Business Logic)            │
│                                 │
│  • AuthService                  │
│    - register_user()            │
│    - authenticate_user()        │
│    - get_user_by_id()           │
│                                 │
│  • CaseService                  │
│    - create_case()              │
│    - get_cases_by_client()      │
│    - update_case()              │
│                                 │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│          MODELS                 │
│     (Data Layer)                │
│                                 │
│  • User                         │
│  • Case                         │
│  • Message                      │
│  • Document                     │
│  • CaseNote                     │
│  • Deadline                     │
│  • Service, TeamMember, Blog    │
│                                 │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│        DATABASE                 │
│      (PostgreSQL/SQLite)        │
└─────────────────────────────────┘
```

## Request Flow

### HTTP Request Flow
```
1. Client Request
   │
   ▼
2. Route (routes/*.py)
   │ - Validates input
   │ - Checks authentication (@jwt_required)
   │ - Checks authorization (@role_required)
   │
   ▼
3. Service (services/*.py)
   │ - Business logic
   │ - Data validation
   │ - Database operations
   │
   ▼
4. Model (models/*.py)
   │ - Data structure
   │ - Relationships
   │
   ▼
5. Database
   │
   ▼
6. Response back through layers
   │
   ▼
7. Client receives JSON response
```

### WebSocket Flow
```
1. Client connects with JWT token
   │
   ▼
2. WebSocket Handler (websockets/handlers.py)
   │ - Authenticates token
   │ - Joins appropriate rooms
   │
   ▼
3. Real-time event handling
   │ - send_message
   │ - join_case
   │ - disconnect
   │
   ▼
4. Database operations (if needed)
   │
   ▼
5. Broadcast to room participants
```

## Directory Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│ config/          Configuration Management                   │
│ ├── settings.py  • Development, Production, Testing configs │
│                  • Environment variable loading              │
│                  • Application settings                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ models/          Data Models & Database Schema              │
│ ├── user.py      • User authentication & authorization      │
│ ├── case.py      • Legal case management                    │
│ ├── message.py   • Case messaging                           │
│ ├── document.py  • File attachments                         │
│ ├── case_note.py • Internal notes                           │
│ ├── deadline.py  • Case deadlines                           │
│ ├── cms.py       • Content management (Service, Team, Blog) │
│ ├── enums.py     • Enumerations (Role, Status, Priority)    │
│ └── base.py      • SQLAlchemy base configuration            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ services/        Business Logic Layer                       │
│ ├── auth_service.py    • User registration                  │
│ │                      • Authentication                      │
│ │                      • User management                     │
│ ├── case_service.py    • Case creation                      │
│                        • Case retrieval                      │
│                        • Case updates                        │
│                        • Status management                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ routes/          API Endpoints (HTTP)                       │
│ ├── auth.py      • POST /auth/register                      │
│ │                • POST /auth/login                         │
│ │                • GET /auth/me                             │
│ ├── cases.py     • POST /cases/                             │
│                  • GET /cases/                               │
│                  • GET /cases/<id>                           │
│                  • GET /cases/admin                          │
│                  • PUT /cases/admin/<id>                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ websockets/      Real-time Communication                    │
│ └── handlers.py  • connect event                            │
│                  • join_case event                           │
│                  • send_message event                        │
│                  • disconnect event                          │
│                  • Helper broadcast functions                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ utils/           Helper Functions & Decorators              │
│ ├── decorators.py     • @role_required                      │
│ │                     • get_current_user()                  │
│ ├── serializers.py    • case_to_dict()                      │
│ │                     • user_to_dict()                      │
│ │                     • message_to_dict()                   │
│ └── helpers.py        • generate_case_id()                  │
│                       • validate_required_fields()          │
└─────────────────────────────────────────────────────────────┘
```

## Module Dependencies

```
app_new.py
  ├── config (settings)
  ├── extensions (db, jwt, socketio, etc.)
  ├── routes
  │   ├── auth_bp
  │   └── case_bp
  ├── models (all models)
  └── websockets (handlers)

routes/
  ├── services (business logic)
  ├── utils (decorators, serializers)
  └── models (enums for role checks)

services/
  ├── extensions (db, bcrypt)
  ├── models (User, Case, etc.)
  └── utils (helpers)

utils/
  ├── extensions (db)
  └── models (User, Role)

websockets/
  ├── extensions (db, socketio)
  └── models (Message, Case, User, Role)
```

## Design Patterns Used

1. **Application Factory Pattern**
   - `create_app()` function for flexible initialization
   - Easy configuration switching
   - Better for testing

2. **Service Layer Pattern**
   - Business logic separated from routes
   - Reusable across different endpoints
   - Easier to test

3. **Repository Pattern** (Implicit)
   - Database operations in services
   - Abstracted from routes

4. **Decorator Pattern**
   - `@jwt_required` for authentication
   - `@role_required` for authorization

5. **Blueprint Pattern**
   - Modular route organization
   - Separate namespaces

## Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Login Request                                       │
│    POST /auth/login                                         │
│    { "email": "...", "password": "..." }                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Route Handler (routes/auth.py)                           │
│    - Receives request                                       │
│    - Calls AuthService                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. AuthService (services/auth_service.py)                   │
│    - Validates credentials                                  │
│    - Checks password hash (bcrypt)                          │
│    - Creates JWT token                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Returns JWT Token                                        │
│    { "access_token": "...", "user_role": "..." }            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 5. Protected Request                                        │
│    GET /cases/admin                                         │
│    Headers: { "Authorization": "Bearer <token>" }           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Decorators Check (utils/decorators.py)                   │
│    @jwt_required - Verifies token                           │
│    @role_required - Checks user role                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Route Handler Executes                                   │
│    - Only if authentication & authorization pass            │
└─────────────────────────────────────────────────────────────┘
```

## Benefits of This Architecture

✅ **Separation of Concerns**: Each layer has a specific responsibility
✅ **Testability**: Services and utils can be unit tested independently
✅ **Maintainability**: Easy to locate and modify code
✅ **Scalability**: Easy to add new features without affecting existing code
✅ **Reusability**: Utils and services can be reused across the application
✅ **Team Collaboration**: Multiple developers can work on different modules
✅ **Type Safety**: Clear interfaces between layers
✅ **Security**: Centralized authentication and authorization
