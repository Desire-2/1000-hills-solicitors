# Docker Deployment Guide

Complete guide for deploying 1000 Hills Solicitors using Docker and Docker Compose.

## 🐳 Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For cloning the repository

### Install Docker

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**macOS:**
- Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)

**Windows:**
- Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/Desire-2/1000-hills-solicitors.git
cd 1000-hills-solicitors
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

**Required environment variables:**
```env
SECRET_KEY=your-very-secure-secret-key-change-this
JWT_SECRET_KEY=your-very-secure-jwt-secret-key-change-this
DB_PASSWORD=your-secure-database-password
FRONTEND_URL=http://localhost:3000
```

### 3. Build and Start Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Verify Deployment

**Check backend health:**
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{"status": "healthy"}
```

**Check database:**
```bash
docker-compose exec db psql -U legal_cms_user -d legal_cms -c "\dt"
```

### 5. Access Application

- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/
- **Database**: localhost:5432

**Test Users** (created automatically):
- **Admin**: admin@1000hills.com / admin123
- **Manager**: manager@1000hills.com / manager123
- **Client**: client@example.com / client123

## 📁 Docker Files Structure

```
1000-hills-solicitors/
├── docker-compose.yml           # Multi-container orchestration
├── .env.example                # Environment template
├── .env                        # Your environment (create from .env.example)
│
└── backend/
    ├── Dockerfile              # Backend container definition
    ├── .dockerignore          # Files to exclude from build
    └── requirements.txt       # Python dependencies
```

## 🔧 Docker Commands

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# View logs
docker-compose logs -f backend
docker-compose logs -f db

# Execute commands in container
docker-compose exec backend python setup_db.py
docker-compose exec db psql -U legal_cms_user -d legal_cms
```

### Building and Updating

```bash
# Rebuild backend after code changes
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build

# Pull latest images
docker-compose pull

# View images
docker images | grep legal_cms
```

### Database Operations

```bash
# Access PostgreSQL shell
docker-compose exec db psql -U legal_cms_user -d legal_cms

# Create database backup
docker-compose exec db pg_dump -U legal_cms_user legal_cms > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U legal_cms_user -d legal_cms

# Reset database
docker-compose exec backend python setup_db.py
```

## 🌐 Production Deployment

### 1. Update Environment Variables

```env
# Production .env
FLASK_ENV=production
SECRET_KEY=<generate-strong-secret>
JWT_SECRET_KEY=<generate-strong-jwt-secret>
DB_PASSWORD=<generate-strong-password>
FRONTEND_URL=https://your-production-domain.com
```

**Generate secure secrets:**
```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Generate DB_PASSWORD
openssl rand -base64 32
```

### 2. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: legal_cms
      POSTGRES_USER: legal_cms_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - legal_cms_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=${SECRET_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - DATABASE_URL=postgresql://legal_cms_user:${DB_PASSWORD}@db:5432/legal_cms
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - db
    networks:
      - legal_cms_network
    volumes:
      - backend_uploads:/app/uploads
      - backend_logs:/app/logs

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
    networks:
      - legal_cms_network

volumes:
  postgres_data:
  backend_uploads:
  backend_logs:

networks:
  legal_cms_network:
    driver: bridge
```

**Deploy:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /socket.io {
            proxy_pass http://backend/socket.io;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

### 4. SSL/HTTPS Setup

**Using Let's Encrypt:**
```bash
# Install certbot
docker run -it --rm \
  -v ./ssl:/etc/letsencrypt \
  certbot/certbot certonly \
  --standalone \
  -d your-domain.com
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Database health
docker-compose exec db pg_isready -U legal_cms_user
```

### Resource Usage

```bash
# View resource usage
docker stats

# View disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

### Logs

```bash
# Follow all logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Export logs
docker-compose logs > application.log
```

## 🔒 Security Best Practices

1. **Use strong secrets**
   - Generate random keys for production
   - Never commit `.env` to Git

2. **Regular updates**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

3. **Database backups**
   ```bash
   # Daily backup script
   docker-compose exec db pg_dump -U legal_cms_user legal_cms > backup_$(date +%Y%m%d).sql
   ```

4. **Network security**
   - Use internal networks
   - Only expose necessary ports
   - Use HTTPS in production

5. **Container security**
   - Run as non-root user
   - Use minimal base images
   - Scan for vulnerabilities

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose build --no-cache backend
docker-compose up -d

# Check if port is available
lsof -i :5000
```

### Database Connection Failed

```bash
# Check database status
docker-compose ps db

# Check database logs
docker-compose logs db

# Verify connection string
docker-compose exec backend env | grep DATABASE_URL

# Test connection
docker-compose exec backend python -c "from extensions import db; from app import app; app.app_context().push(); print(db.engine.url)"
```

### Container Crashes

```bash
# View exit code
docker-compose ps

# Check resource limits
docker stats

# Inspect container
docker inspect legal_cms_backend
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "5001:5000"
```

### Permission Denied

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix volume permissions
docker-compose exec backend chown -R www-data:www-data /app/uploads
```

## 📈 Performance Optimization

### 1. Multi-stage Builds

Update `Dockerfile`:
```dockerfile
# Build stage
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--bind", "0.0.0.0:5000", "app:app"]
```

### 2. Resource Limits

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M
```

### 3. Caching

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Use cache from registry
docker-compose build --pull
```

## 🔄 CI/CD Integration

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Copy files to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "."
          target: "/app"
      
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app
            docker-compose pull
            docker-compose up -d --build
```

## 📞 Support

- **Docker Docs**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **PostgreSQL**: https://www.postgresql.org/docs

## 🎯 Next Steps

1. ✅ Set up Docker environment
2. ✅ Configure `.env` file
3. ✅ Start services with `docker-compose up -d`
4. ✅ Verify deployment
5. ⏭️ Deploy frontend (see frontend README)
6. ⏭️ Set up domain and SSL
7. ⏭️ Configure monitoring
8. ⏭️ Set up automated backups

---

**Deployment Status**: Ready to deploy with Docker! 🐳
