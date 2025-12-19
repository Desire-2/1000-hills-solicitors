# Render Deployment Guide for Backend

This guide will help you deploy the 1000 Hills Solicitors backend API to Render.

## 🚀 Prerequisites

- Render account (free tier available at [render.com](https://render.com))
- GitHub repository connected to Render
- All backend code pushed to your repository

## 📋 Deployment Methods

### Method 1: Using render.yaml (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create New Blueprint Instance**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository: `1000-hills-solicitors`
   - Render will automatically detect `render.yaml`
   - Click "Apply" to create services

3. **Configure Environment Variables** (if not auto-generated)
   - `SECRET_KEY`: Auto-generated or set manually
   - `JWT_SECRET_KEY`: Auto-generated or set manually
   - `FRONTEND_URL`: Your frontend URL (e.g., https://your-app.vercel.app)
   - `DATABASE_URL`: Auto-configured from PostgreSQL service
   - `FLASK_ENV`: production

### Method 2: Manual Setup

#### Step 1: Create PostgreSQL Database

1. From Render Dashboard, click "New" → "PostgreSQL"
2. Configure:
   - **Name**: `1000-hills-solicitors-db`
   - **Database**: `legal_cms`
   - **User**: `legal_cms_user`
   - **Region**: Oregon (or closest to you)
   - **Plan**: Free
3. Click "Create Database"
4. Copy the **Internal Database URL** (will be used later)

#### Step 2: Create Web Service

1. From Render Dashboard, click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:

   **Basic Settings:**
   - **Name**: `1000-hills-solicitors-api`
   - **Region**: Oregon (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python setup_db.py`
   - **Start Command**: `gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app`

   **Environment Variables:**
   ```
   PYTHON_VERSION=3.11.0
   FLASK_ENV=production
   SECRET_KEY=[Click "Generate" button]
   JWT_SECRET_KEY=[Click "Generate" button]
   DATABASE_URL=[Paste Internal Database URL from Step 1]
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   PORT=10000
   ```

4. **Plan**: Free
5. Click "Create Web Service"

## 🔧 Configuration Files

The following files are included for Render deployment:

- **render.yaml**: Infrastructure as Code configuration
- **Procfile**: Process file for worker definition
- **build.sh**: Build script for database setup
- **requirements.txt**: Updated with `gunicorn` and `psycopg2-binary`

## 🌍 Environment Variables

Required environment variables for production:

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key | Auto-generate on Render |
| `JWT_SECRET_KEY` | JWT signing key | Auto-generate on Render |
| `DATABASE_URL` | PostgreSQL connection string | From Render PostgreSQL service |
| `FRONTEND_URL` | Frontend domain for CORS | https://yourapp.vercel.app |
| `FLASK_ENV` | Environment mode | production |
| `PORT` | Server port (auto-set by Render) | 10000 |

## 🔗 Connecting Frontend to Backend

Once deployed, update your frontend environment variables:

```env
# frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api
NEXT_PUBLIC_WS_URL=https://your-app.onrender.com
```

## 📊 Post-Deployment

### Verify Deployment

1. **Check Health Endpoint**
   ```bash
   curl https://your-app.onrender.com/health
   ```
   Should return: `{"status": "healthy"}`

2. **Test API Root**
   ```bash
   curl https://your-app.onrender.com/
   ```
   Should return welcome message

3. **Test Authentication**
   ```bash
   curl -X POST https://your-app.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@1000hills.com","password":"admin123"}'
   ```

### View Logs

1. Go to your service in Render Dashboard
2. Click "Logs" tab
3. Monitor for errors or issues

### Database Management

Access your database:
```bash
# Get connection string from Render Dashboard
psql [External-Database-URL]
```

## 🐛 Troubleshooting

### Common Issues

**1. Build Failed**
- Check `build.sh` has execute permissions
- Verify all dependencies in `requirements.txt`
- Check Python version compatibility

**2. Application Crashes**
- Check logs for error messages
- Verify all environment variables are set
- Ensure DATABASE_URL is correct

**3. CORS Errors**
- Update `FRONTEND_URL` to match your actual frontend domain
- Clear browser cache
- Check CORS configuration in `app.py`

**4. Database Connection Failed**
- Verify DATABASE_URL is the **Internal** URL
- Ensure database service is running
- Check if database tables exist

**5. 502 Bad Gateway**
- Check if app is binding to `0.0.0.0:$PORT`
- Verify gunicorn is starting correctly
- Check logs for startup errors

## 🔄 Updating Deployment

### Automatic Deployment

Render auto-deploys when you push to the main branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

### Manual Deployment

1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

## 📈 Monitoring

### Health Checks

Render automatically monitors your service health:
- Endpoint: `/health`
- Frequency: Every 5 minutes
- Auto-restart on failure

### Metrics

View in Render Dashboard:
- CPU usage
- Memory usage
- Request rates
- Response times
- Error rates

## 💰 Pricing

**Free Tier Includes:**
- 750 hours/month runtime
- 512 MB RAM
- Automatic SSL
- Custom domains
- Auto-deploy from Git

**Limitations:**
- Services spin down after 15 minutes of inactivity
- Cold starts (15-30 seconds)
- Limited concurrent connections

**Paid Plans:**
- Start at $7/month
- No spin-down
- More resources
- Faster performance

## 🔒 Security Best Practices

1. **Never commit secrets**
   - Use Render's environment variables
   - Use auto-generated secrets

2. **Enable HTTPS**
   - Automatically enabled on Render
   - Enforce HTTPS in production

3. **Restrict CORS**
   - Only allow your frontend domain
   - Don't use wildcards in production

4. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

5. **Database Backups**
   - Render provides daily backups (paid plans)
   - Export data regularly for free tier

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Status**: https://status.render.com

## 🎯 Next Steps

1. Deploy backend to Render
2. Deploy frontend to Vercel (see frontend README)
3. Update frontend with backend URL
4. Test all functionality
5. Set up custom domain (optional)
6. Configure monitoring and alerts

---

**Deployment Status**: Ready to deploy! 🚀
