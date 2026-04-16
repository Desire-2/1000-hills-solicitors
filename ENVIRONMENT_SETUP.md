# Environment Configuration Guide

## Backend (Render Deployment)

### Required Environment Variables on Render

Set these in your Render service settings under Environment:

```
FLASK_ENV=production
SECRET_KEY=<strong-random-secret-key>
JWT_SECRET_KEY=<strong-random-jwt-secret>
DATABASE_URL=<your-postgresql-connection-string>
CORS_ORIGINS=https://1000-hills-solicitors.vercel.app,http://localhost:3000
FRONTEND_URL=https://1000-hills-solicitors.vercel.app
```

### Environment Variable Descriptions

| Variable | Purpose | Example |
|----------|---------|---------|
| `FLASK_ENV` | Flask environment | `production` |
| `SECRET_KEY` | Flask secret key for session security | Generated secure string |
| `JWT_SECRET_KEY` | Secret for JWT token signing | Generated secure string |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/dbname` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `https://your-frontend.com,http://localhost:3000` |
| `FRONTEND_URL` | Primary frontend URL (added to CORS_ORIGINS) | `https://your-frontend.com` |

## Frontend (Vercel Deployment)

### Required Environment Variables on Vercel

Set this in your Vercel project settings under Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.onrender.com
```

**Important:** 
- Variable name must start with `NEXT_PUBLIC_` to be accessible in the browser
- Use the correct backend Render URL (no typo)
- Example: `https://1000-hills-solicitors.onrender.com` (not "one000")

### For Local Development

Create/update `.env.local` files:

**Backend** (`backend/.env`):
```
FLASK_ENV=development
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-key
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Troubleshooting CORS Errors

### Error: "No 'Access-Control-Allow-Origin' header"

1. **Check backend URL**: Ensure `NEXT_PUBLIC_API_URL` matches the actual backend domain
2. **Update CORS_ORIGINS**: Add the frontend URL to backend's `CORS_ORIGINS` environment variable
3. **Restart services**: 
   - Redeploy backend on Render
   - Trigger rebuild on Vercel
4. **Verify migrations**: Ensure backend migrations folder exists

### Error: "Path doesn't exist: migrations"

1. Ensure `/backend/migrations/` folder is committed to git
2. Run locally: `source venv/bin/activate && flask db init` (if needed)
3. Commit and push migrations folder

## Database Migrations

Migrations are automatically applied during backend deployment. To create new migrations locally:

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
flask db migrate -m "Description of changes"
flask db upgrade  # Test locally
git add migrations/
git commit -m "Add migration: description"
git push origin main
```

## Testing CORS Configuration

Test backend CORS headers using curl:

```bash
curl -H "Origin: https://your-frontend.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.onrender.com/auth/login -v
```

Look for `Access-Control-Allow-Origin` in the response headers.
