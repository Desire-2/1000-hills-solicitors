# Authentication Implementation Guide

## Overview

This document describes the complete authentication system implemented for the 1000 Hills Solicitors application. The system uses JWT (JSON Web Tokens) for secure authentication between the React/Next.js frontend and Flask backend.

## Backend Authentication

### Architecture

The backend authentication is built with:
- **Flask-JWT-Extended**: JWT token management
- **Flask-Bcrypt**: Password hashing
- **SQLAlchemy**: User model and database operations

### User Model (`backend/models/user.py`)

```python
class User(Base):
    id: Integer (Primary Key)
    email: String (Unique, Required)
    password_hash: String (Required)
    name: String (Required)
    phone: String (Optional)
    role: Enum(Role) - CLIENT, CASE_MANAGER, CONTENT_EDITOR, SUPER_ADMIN, VIEWER
    email_verified: Boolean (Default: False)
    created_at: DateTime
    updated_at: DateTime
```

### Authentication Endpoints

#### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }
  ```
- **Response**: 
  ```json
  {
    "msg": "User created successfully",
    "user_id": 1
  }
  ```

#### 2. Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user_role": "CLIENT",
    "user_id": 1,
    "user_name": "John Doe"
  }
  ```

#### 3. Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT",
    "email_verified": false,
    "created_at": "2025-01-15T10:30:00"
  }
  ```

#### 4. Protected Route (Test)
- **Endpoint**: `GET /auth/protected`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "logged_in_as": "user@example.com",
    "role": "CLIENT"
  }
  ```

### Authentication Service (`backend/services/auth_service.py`)

Key methods:
- `register_user(email, password, name, role)`: Creates new user with hashed password
- `authenticate_user(email, password)`: Validates credentials and returns JWT token
- `get_user_by_id(user_id)`: Retrieves user by ID
- `get_all_users()`: Gets all users (admin only)

## Frontend Authentication

### Architecture

The frontend uses:
- **React Context API**: Global auth state management
- **Next.js 14 App Router**: Client-side routing with protection
- **LocalStorage**: Token persistence

### Core Components

#### 1. Auth Context (`src/lib/auth-context.tsx`)

Provides global authentication state and methods:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Result>;
  register: (email: string, password: string, name: string) => Promise<Result>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
```

**Usage**:
```typescript
const { user, loading, login, logout } = useAuth();
```

#### 2. API Service (`src/lib/api.ts`)

Centralized API communication with automatic token management:

```typescript
// Login
await apiService.login(email, password);

// Get current user
await apiService.getCurrentUser();

// Any authenticated request automatically includes token
await apiService.getCases();
```

#### 3. Protected Route Component (`src/components/auth/ProtectedRoute.tsx`)

Wrapper component for routes requiring authentication:

```typescript
// Protect any route
<ProtectedRoute>
  <DashboardContent />
</ProtectedRoute>

// Protect with role requirement
<ProtectedRoute requiredRole={Role.SUPER_ADMIN}>
  <AdminContent />
</ProtectedRoute>
```

**Features**:
- Automatic redirect to login if not authenticated
- Role-based access control
- Loading state handling
- Redirect to dashboard if insufficient permissions

### UI Components

#### 1. LoginForm (`src/components/auth/LoginForm.tsx`)

Features:
- Email and password validation
- Remember me checkbox
- Error display
- Loading states
- Link to registration and password reset

#### 2. RegisterForm (`src/components/auth/RegisterForm.tsx`)

Features:
- Full name, email, password fields
- Password confirmation
- Client-side validation (min 6 characters, email format, etc.)
- Terms of service acceptance
- Automatic login after successful registration

#### 3. Updated Navigation (`src/components/Navigation.tsx`)

Features:
- Shows login/register buttons when not authenticated
- Displays user menu with profile and logout when authenticated
- Role-based admin panel link for SUPER_ADMIN
- Mobile-responsive menu with user info

### Pages

#### 1. Login Page (`/login`)
- Clean, centered login form
- Gradient background
- Link to home and registration

#### 2. Register Page (`/register`)
- Registration form with validation
- Link to login if already have account
- Terms and privacy policy links

#### 3. Profile Page (`/profile`)
- Protected route
- Displays user information
- Account details (email, role, member since)
- Placeholder for future features (password change, 2FA)

#### 4. Dashboard (`/dashboard`)
- Protected route
- Personalized welcome with user name
- Case statistics
- Quick actions

#### 5. Admin Dashboard (`/admin`)
- Protected route with SUPER_ADMIN role requirement
- Admin-specific analytics and management

## Authentication Flow

### 1. Registration Flow

```
User fills registration form
    ↓
Frontend validates input
    ↓
POST /auth/register
    ↓
Backend validates & hashes password
    ↓
Creates user in database
    ↓
Auto-login (calls login endpoint)
    ↓
Redirect to dashboard
```

### 2. Login Flow

```
User enters credentials
    ↓
POST /auth/login
    ↓
Backend validates credentials
    ↓
Generates JWT token
    ↓
Frontend stores token in localStorage
    ↓
GET /auth/me to fetch user details
    ↓
Update auth context
    ↓
Redirect to dashboard
```

### 3. Protected Route Access

```
User navigates to protected page
    ↓
ProtectedRoute checks auth state
    ↓
If loading → Show loading spinner
    ↓
If not authenticated → Redirect to /login
    ↓
If wrong role → Redirect to /dashboard
    ↓
If authorized → Render content
```

### 4. Logout Flow

```
User clicks logout
    ↓
Clear token from localStorage
    ↓
Clear auth context
    ↓
Redirect to home page
```

## Security Features

### Backend Security
1. **Password Hashing**: Bcrypt with salt
2. **JWT Tokens**: Signed with secret key, include role claims
3. **Protected Routes**: `@jwt_required()` decorator
4. **Input Validation**: Email format, required fields

### Frontend Security
1. **Token Storage**: LocalStorage (consider HttpOnly cookies for production)
2. **Automatic Token Injection**: Bearer token in Authorization header
3. **Role-Based Access**: Client-side and server-side validation
4. **Secure Password Input**: Type="password", min length validation

## Token Management

### Token Structure
```json
{
  "identity": 1,  // user_id
  "role": "CLIENT",
  "exp": 1234567890  // expiration timestamp
}
```

### Token Expiration
- Tokens expire based on Flask-JWT-Extended configuration
- Frontend automatically includes token in requests
- On 401 errors, user is logged out automatically

## User Roles

### Available Roles
1. **CLIENT**: Regular users who submit cases
2. **CASE_MANAGER**: Staff who manage cases
3. **CONTENT_EDITOR**: Staff who manage CMS content
4. **SUPER_ADMIN**: Full system access
5. **VIEWER**: Read-only access

### Role-Based Features
- **Dashboard**: All authenticated users
- **Admin Panel**: SUPER_ADMIN only
- **Case Management**: CLIENT (own cases), CASE_MANAGER, SUPER_ADMIN
- **Content Management**: CONTENT_EDITOR, SUPER_ADMIN

## Testing the Authentication System

### 1. Test Registration
```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Test Protected Route
```bash
curl -X GET http://localhost:5001/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Setup

### Backend Requirements
```
Flask==3.0.0
Flask-JWT-Extended==4.6.0
Flask-Bcrypt==1.0.1
Flask-SQLAlchemy==3.1.1
```

### Frontend Requirements
```
next: ^15.1.6
react: ^19.0.0
typescript: ^5
```

### Environment Variables

**Backend (.env)**:
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///solicitors.db
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Future Enhancements

1. **Email Verification**: Send verification emails on registration
2. **Password Reset**: Forgot password functionality
3. **Two-Factor Authentication**: SMS or authenticator app
4. **Session Management**: View and revoke active sessions
5. **OAuth Integration**: Google, Microsoft login
6. **Refresh Tokens**: Long-lived sessions with token refresh
7. **Rate Limiting**: Prevent brute force attacks
8. **Account Lockout**: After multiple failed attempts
9. **Password Strength Meter**: Visual feedback on password quality
10. **Activity Log**: Track user login history

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if token is valid
   - Verify token is being sent in Authorization header
   - Ensure backend SECRET_KEY hasn't changed

2. **CORS Errors**
   - Configure CORS in Flask backend
   - Add frontend origin to allowed origins

3. **Token Not Persisting**
   - Check localStorage permissions
   - Verify browser isn't blocking storage

4. **Redirect Loop**
   - Check ProtectedRoute logic
   - Ensure user state is updating correctly

## Best Practices

1. **Always validate on both client and server**
2. **Use HTTPS in production**
3. **Implement rate limiting on auth endpoints**
4. **Log authentication attempts**
5. **Regularly rotate JWT secrets**
6. **Set appropriate token expiration times**
7. **Sanitize user inputs**
8. **Use environment variables for secrets**
9. **Implement proper error handling**
10. **Keep dependencies updated**

## File Structure

```
backend/
├── routes/auth.py           # Auth endpoints
├── services/auth_service.py # Auth business logic
├── models/user.py          # User model
├── models/enums.py         # Role enum
└── utils/decorators.py     # Auth decorators

frontend/
├── src/
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── admin/page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── index.ts
│   │   └── Navigation.tsx
│   └── lib/
│       ├── auth-context.tsx
│       ├── api.ts
│       └── types.ts
```

## Support

For issues or questions:
1. Check this documentation
2. Review backend logs
3. Check browser console for errors
4. Verify API endpoints are accessible
5. Test with tools like Postman or curl

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0
