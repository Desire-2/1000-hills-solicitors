# Quick Start Guide - Running the Application

## Prerequisites
- Python 3.8+ installed
- Node.js 18+ and pnpm installed
- Terminal access

## Step 1: Start the Backend Server (Port 5001)

### Option A: Using the provided terminal
```bash
cd backend
python3 app.py
```

### Option B: Using Flask run
```bash
cd backend
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --port=5001
```

### Option C: Using Python directly
```bash
cd backend
python3 -m flask run --port=5001
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5001
 * Running on http://localhost:5001
```

## Step 2: Start the Frontend Server (Port 3000)

Open a new terminal:

```bash
cd frontend
pnpm install  # First time only
pnpm dev
```

**Expected Output:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in 2.5s
```

## Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/health

## Testing Authentication

### 1. Register a New User
- Navigate to: http://localhost:3000/register
- Fill in the form:
  - Name: Test User
  - Email: test@example.com
  - Password: test123
- Click "Create Account"

### 2. Login
- Navigate to: http://localhost:3000/login
- Enter credentials:
  - Email: test@example.com
  - Password: test123
- Click "Sign In"

### 3. Access Dashboard
- After login, you'll be redirected to: http://localhost:3000/dashboard
- View your profile at: http://localhost:3000/profile

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Ensure backend is running on port 5001
2. Check frontend .env.local has: `NEXT_PUBLIC_API_URL=http://localhost:5001`
3. Restart both servers

### WebSocket Connection Failed
If WebSocket connection fails:
1. Verify backend is running with SocketIO
2. Check browser console for connection attempts
3. Ensure port 5001 is not blocked by firewall

### Database Errors
If you see database errors:
```bash
cd backend
python3 setup_db.py
```

### Frontend Build Errors
If npm/pnpm errors occur:
```bash
cd frontend
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Port Already in Use
If port 5001 or 3000 is already in use:
```bash
# Find process on port 5001
lsof -ti:5001
# Kill the process
kill -9 $(lsof -ti:5001)

# For port 3000
kill -9 $(lsof -ti:3000)
```

## Configuration Files

### Backend Configuration
- **Main App**: `backend/app.py` - Runs on port 5001
- **Config**: `backend/config/settings.py`
- **Extensions**: `backend/extensions.py` - CORS configured

### Frontend Configuration
- **Environment**: `frontend/.env.local` - API_URL set to http://localhost:5001
- **API Service**: `frontend/src/lib/api.ts` - API client
- **Socket Service**: `frontend/src/lib/socket.ts` - WebSocket client

## Common Commands

### Backend
```bash
# Run development server
python3 app.py

# Setup/reset database
python3 setup_db.py

# Check database migration
python3 check_migration.py

# Install dependencies
pip install -r requirements.txt
```

### Frontend
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint code
pnpm lint
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///app.db
FLASK_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user (requires token)
- GET `/auth/protected` - Test protected route

### Cases
- GET `/cases/` - Get user's cases
- POST `/cases/` - Create new case
- GET `/cases/<id>` - Get specific case
- GET `/cases/admin` - Get all cases (admin)
- PUT `/cases/admin/<id>` - Update case (admin)

### General
- GET `/` - API welcome message
- GET `/health` - Health check
- GET `/users` - Get all users (testing)

## Architecture

```
Frontend (React/Next.js)    Backend (Flask/Python)
Port 3000                   Port 5001
     |                           |
     |--- HTTP/REST API ---------|
     |--- WebSocket/Socket.IO ---|
     |                           |
   Browser                   Database
                            (SQLite)
```

## Default Credentials

No default users are created. You must register a new account.

To create an admin user manually:
```python
# In Python console
from app import app
from extensions import db
from models import User, Role
from flask_bcrypt import generate_password_hash

with app.app_context():
    admin = User(
        email='admin@1000hills.rw',
        password_hash=generate_password_hash('admin123').decode('utf-8'),
        name='Admin User',
        role=Role.SUPER_ADMIN,
        email_verified=True
    )
    db.session.add(admin)
    db.session.commit()
```

## Development Workflow

1. Make changes to backend code → Flask auto-reloads
2. Make changes to frontend code → Next.js auto-reloads
3. Test in browser at http://localhost:3000
4. Check API responses at http://localhost:5001

## Production Deployment

For production deployment, update:
1. Backend: Set proper SECRET_KEY and JWT_SECRET_KEY
2. Frontend: Update NEXT_PUBLIC_API_URL to production domain
3. Enable HTTPS for both servers
4. Use production database (PostgreSQL recommended)
5. Set appropriate CORS origins

## Support

For issues or questions, refer to:
- [AUTHENTICATION.md](../AUTHENTICATION.md) - Authentication system details
- [BACKEND_SUMMARY.md](../backend/BACKEND_SUMMARY.md) - Backend architecture
- [README.md](../README.md) - Project overview

---

**Last Updated**: December 19, 2025
