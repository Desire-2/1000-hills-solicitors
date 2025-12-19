# 1000 Hills Solicitors - Legal Case Management System

A comprehensive, production-ready legal case management platform featuring role-based dashboards, real-time communication, document management, and advanced analytics. Built for modern law firms to streamline operations and enhance client service.

## 🌟 Key Features

### 🔐 Role-Based Access Control
- **Super Admin**: Complete system oversight, user management, analytics
- **Case Manager**: Case lifecycle management, client coordination, document handling
- **Client**: Self-service portal with case tracking, messaging, appointments

### 📊 Advanced Dashboards
- Real-time analytics with interactive charts (Recharts)
- KPI tracking and performance metrics
- Activity logs and audit trails
- Customizable widgets and views

### 💬 Real-Time Communication
- Secure attorney-client messaging
- WebSocket-powered notifications
- File attachments and document sharing
- Read receipts and typing indicators

### 📁 Document Management
- Secure file upload and storage
- Category-based organization
- Version control and access logs
- Preview and download capabilities

### 📅 Case Management
- Complete case lifecycle tracking
- Deadline management with smart alerts
- Task assignment and progress monitoring
- Client relationship management

## 🚀 Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend** | Next.js | 16.0.10 | React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS framework |
| **UI Components** | Radix UI + Custom | Latest | Accessible component primitives |
| **Charts** | Recharts | 2.15.0 | Data visualization |
| **Icons** | Lucide React | 0.469.0 | Modern icon library |
| **Backend** | Flask | 3.1.0 | Python web framework |
| **Database** | SQLAlchemy ORM | 2.0.45 | Database abstraction layer |
| **Authentication** | JWT + Bcrypt | Latest | Secure token-based auth |
| **Real-time** | Flask-SocketIO | 5.4.1 | WebSocket support |
| **API** | REST | - | RESTful architecture |

## 📁 Project Structure

```
1000-hills-solicitors/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── admin/         # Super Admin dashboard (6 pages)
│   │   │   ├── manager/       # Case Manager dashboard (4 pages)
│   │   │   ├── dashboard/     # Client portal (6 pages)
│   │   │   └── [public]/      # Public pages
│   │   ├── components/         # React components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── manager/       # Manager-specific components
│   │   │   ├── client/        # Client-specific components
│   │   │   ├── auth/          # Authentication components
│   │   │   └── ui/            # Reusable UI components
│   │   └── lib/               # Utilities and services
│   │       ├── api.ts         # API service layer
│   │       ├── auth-context.tsx # Authentication state
│   │       ├── types.ts       # TypeScript definitions
│   │       └── socket.ts      # WebSocket client
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies
│   ├── README.md             # Frontend documentation
│   └── .gitignore            # Frontend ignore rules
│
├── backend/                    # Flask backend API
│   ├── models/                # SQLAlchemy models
│   │   ├── user.py           # User model with roles
│   │   ├── case.py           # Case management
│   │   ├── document.py       # Document handling
│   │   ├── message.py        # Messaging system
│   │   └── deadline.py       # Task deadlines
│   ├── routes/               # API endpoints
│   │   ├── auth.py          # Authentication routes
│   │   ├── cases.py         # Case management routes
│   │   └── admin.py         # Admin routes
│   ├── services/            # Business logic
│   │   ├── auth_service.py  # Authentication service
│   │   └── case_service.py  # Case management service
│   ├── utils/               # Helper functions
│   ├── websockets/          # WebSocket handlers
│   ├── config/              # Configuration
│   ├── app.py              # Application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── README.md          # Backend documentation
│   └── .gitignore         # Backend ignore rules
│
├── README.md                  # This file
├── SUPER_ADMIN_GUIDE.md      # Admin user guide
├── CLIENT_DASHBOARD_GUIDE.md # Client user guide
├── QUICK_START.md            # Quick start guide
├── RUN_SERVERS.md           # Server setup guide
└── [documentation files]    # Additional guides
```

## � Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.8 or higher
- **npm** or **pnpm** package manager
- **pip** Python package manager

### Backend Setup (5 minutes)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database:**
   ```bash
   python setup_db.py
   ```
   
   This creates three test users:
   - **Admin**: admin@1000hills.com / admin123
   - **Manager**: manager@1000hills.com / manager123
   - **Client**: client@example.com / client123

5. **Start backend server:**
   ```bash
   python app.py
   ```
   Server runs at `http://localhost:5000`

### Frontend Setup (3 minutes)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   Application runs at `http://localhost:3000`

### Access the Application

- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Manager Dashboard**: http://localhost:3000/manager/dashboard
- **Client Dashboard**: http://localhost:3000/dashboard

## 📚 Documentation

Comprehensive documentation is available for each component:

| Document | Description | Location |
|----------|-------------|----------|
| **Backend README** | API setup, endpoints, models | [backend/README.md](backend/README.md) |
| **Frontend README** | UI setup, components, routes | [frontend/README.md](frontend/README.md) |
| **Super Admin Guide** | Admin dashboard features | [SUPER_ADMIN_GUIDE.md](SUPER_ADMIN_GUIDE.md) |
| **Client Guide** | Client portal features | [CLIENT_DASHBOARD_GUIDE.md](CLIENT_DASHBOARD_GUIDE.md) |
| **Quick Start** | Fast setup guide | [QUICK_START.md](QUICK_START.md) |
| **Server Setup** | Detailed server config | [RUN_SERVERS.md](RUN_SERVERS.md) |

## 🎯 Core Features

### Super Admin Dashboard (6 Pages)

#### Dashboard Overview
- System KPIs and metrics
- Active cases summary
- User statistics
- Monthly trends (Area chart)
- Case distribution (Pie chart)
- Performance radar chart

#### User Management
- Create, read, update, delete users
- Role assignment (Admin, Manager, Client)
- Account status management
- Activity tracking
- Bulk operations

#### Analytics
- Comprehensive system analytics
- 5 chart types (Area, Line, Pie, Bar, Radar)
- Custom date ranges
- Export capabilities
- Real-time updates

#### Settings (6 Tabs)
- General: Company info, branding
- Security: Password policies, 2FA
- Email: SMTP configuration
- Notifications: Alert preferences
- Database: Backup and maintenance
- Appearance: Theme customization

#### Activity Log
- Timeline view of all activities
- Filter by user, action, date
- Severity indicators
- Export to CSV
- Search functionality

### Case Manager Dashboard (4 Pages)

#### Dashboard
- Active cases overview
- Upcoming deadlines
- Recent messages
- Weekly activity chart
- Cases by status chart

#### Cases
- Comprehensive case list
- Status filters (Active, Pending, Closed)
- Progress tracking with bars
- Assignment management
- Quick actions

#### Clients
- Client card grid layout
- Contact information
- Active cases count
- Search and filter
- Quick contact options

#### Tasks
- Task list with deadlines
- Smart deadline alerts:
  - Red: Overdue
  - Orange: Due today
  - Yellow: Due within 2 days
- Status filtering
- Case associations

### Client Portal (6 Pages)

#### Dashboard
- My cases summary
- Upcoming appointments
- Recent activity feed
- Quick action buttons
- Stats cards

#### My Cases
- Card-based layout
- Priority badges
- Status indicators
- Progress tracking
- Details access

#### Messages
- Three-column chat interface
- Conversation list with unread badges
- Message thread
- File attachments
- Real-time updates

#### Appointments
- List and calendar views
- Virtual/physical meeting details
- Reschedule functionality
- Add to calendar
- Meeting links

#### Documents
- Category sidebar
- File preview
- Download functionality
- Storage quota display
- Upload capabilities

#### Help & Support
- FAQ sections
- Contact support form
- Resource library
- Video tutorials
- Live chat (when available)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Role-Based Access**: SUPER_ADMIN, CASE_MANAGER, CLIENT
- **CORS Protection**: Configured allowed origins
- **SQL Injection Prevention**: SQLAlchemy ORM
- **XSS Protection**: Input sanitization
- **HTTPS Support**: SSL/TLS encryption (production)
- **Session Management**: Automatic token refresh

## 🗄️ Database Schema

### Core Models

- **User**: Authentication and profile information
- **Case**: Legal case details and status
- **CaseNote**: Internal and client notes
- **Document**: File storage and metadata
- **Message**: Secure messaging between users
- **Deadline**: Task and deadline tracking
- **CMS**: Content management for public pages

### Relationships

```
User (1) ─────── (N) Case [assigned_to]
User (1) ─────── (N) Case [client_id]
Case (1) ─────── (N) CaseNote
Case (1) ─────── (N) Document
Case (1) ─────── (N) Deadline
User (1) ─────── (N) Message [sender]
User (1) ─────── (N) Message [receiver]
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Cases
- `GET /api/cases` - List all cases
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get case details
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics` - System analytics

*See [backend/README.md](backend/README.md) for complete API documentation.*

## 🌐 Deployment

### Production Checklist

#### Backend
- [ ] Set production environment variables
- [ ] Configure PostgreSQL database
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up error logging (Sentry)
- [ ] Configure backup strategy
- [ ] Set up monitoring

#### Frontend
- [ ] Build production bundle (`npm run build`)
- [ ] Configure environment variables
- [ ] Set up CDN for static assets
- [ ] Enable analytics
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Configure caching headers

### Deployment Platforms

**Backend:**
- Heroku (recommended)
- AWS EC2
- Google Cloud Run
- DigitalOcean App Platform
- Docker container

**Frontend:**
- Vercel (recommended)
- Netlify
- AWS Amplify
- Cloudflare Pages
- Static hosting with Nginx

### Docker Deployment

Both backend and frontend include Docker support. See individual README files for Docker configuration.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest                    # Run all tests
python test_jwt.py       # Test authentication
python test_backend.py   # Test API endpoints
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run component tests
npm run lint            # Check code style
npx tsc --noEmit        # Type checking
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint rules (frontend)
- Follow PEP 8 guidelines (backend)
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📊 Project Statistics

- **Total Pages**: 16 (6 Admin + 4 Manager + 6 Client)
- **Components**: 50+ reusable React components
- **API Endpoints**: 30+ RESTful endpoints
- **Database Models**: 7 core models
- **Chart Types**: 5 (Area, Line, Pie, Bar, Radar)
- **Lines of Code**: ~15,000+ (estimated)

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check Python version (3.8+)
- Verify all dependencies installed
- Check database connection
- Review error logs

**Frontend build fails:**
- Clear `.next` cache
- Delete `node_modules` and reinstall
- Check Node.js version (18+)
- Verify TypeScript configuration

**API connection errors:**
- Verify backend is running
- Check CORS configuration
- Verify API URL in frontend `.env.local`
- Check network tab in browser DevTools

**Authentication issues:**
- Clear browser localStorage
- Check JWT token expiry
- Verify backend JWT secret is set
- Check user role permissions

## 📞 Support

- **Email**: support@1000hillssolicitors.com
- **Documentation**: See individual README files
- **Issues**: GitHub Issues (for development)

## 📄 License

This project is proprietary software for 1000 Hills Solicitors.

## 👥 Authors

Developed by the 1000 Hills Solicitors Development Team

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Flask community for robust backend tools
- Tailwind CSS for the utility-first approach
- Recharts for beautiful data visualization
- Open source community for invaluable tools

---

**Version**: 1.0.0  
**Last Updated**: December 19, 2025  
**Repository**: https://github.com/Desire-2/1000-hills-solicitors

**Status**: ✅ Production Ready
    ```bash
    python3 setup_db.py
    ```
    *Default Admin Credentials: `admin@1000hills.com` / `SuperSecureAdminPassword123`*
    *Default Client Credentials: `client@example.com` / `ClientPassword123`*

5.  **Run the Backend Server:**
    The server runs on port `5000` and includes the WebSocket server.
    ```bash
    python3 app.py
    ```

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd 1000-hills-solicitors/frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `frontend/` directory:
    ```ini
    # frontend/.env.local
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
    NEXT_PUBLIC_WS_URL=http://localhost:5000
    ```

4.  **Run the Frontend Development Server:**
    The Next.js application will run on port `3000`.
    ```bash
    pnpm run dev
    ```

## 🌐 Deployment Guide

### Backend (Flask) Deployment

For production, it is recommended to use a robust WSGI server like Gunicorn and a reverse proxy like Nginx.

1.  **Install Gunicorn:** `sudo pip3 install gunicorn`
2.  **Run Gunicorn (with eventlet for SocketIO):**
    ```bash
    gunicorn --worker-class eventlet -w 1 app:app -b 0.0.0.0:5000
    ```
3.  **Database:** Ensure your `DATABASE_URL` points to a managed PostgreSQL instance.
4.  **WebSockets:** Configure your reverse proxy (Nginx/Caddy) to correctly proxy WebSocket traffic (`/socket.io/`) to the Gunicorn/eventlet server.

### Frontend (Next.js) Deployment

Next.js applications are typically deployed to platforms like Vercel, Netlify, or a custom Node.js server.

1.  **Build the application:**
    ```bash
    pnpm run build
    ```
2.  **Start the production server:**
    ```bash
    pnpm run start
    ```
3.  **Environment:** Ensure production environment variables (`NEXT_PUBLIC_API_BASE_URL`, etc.) are set on the hosting platform.

## 🔒 Security Best Practices

-   **Authentication:** JWTs are used for stateless authentication. Tokens should be stored securely (e.g., HTTP-only cookies).
-   **Password Hashing:** Passwords are hashed using **Bcrypt**.
-   **CORS:** Configured to allow communication between the frontend and backend.
-   **RBAC:** Role-Based Access Control is enforced on the backend using the `@role_required` decorator to prevent unauthorized access to admin/staff endpoints.
-   **Document Storage:** The architecture is designed for secure cloud storage (S3/Cloudinary) for documents, not local file system storage.

## 📂 Key Files

-   `backend/models.py`: Database schema definition (SQLAlchemy models).
-   `backend/app.py`: Main Flask application, configuration, and extensions.
-   `backend/auth.py`: Authentication logic (register, login, JWT handling, RBAC decorator).
-   `backend/case_management.py`: Core API for Case Management and CMS operations.
-   `backend/websocket.py`: Real-time communication logic (Flask-SocketIO).
-   `frontend/src/app/page.tsx`: Public website homepage.
-   `frontend/src/app/dashboard/page.tsx`: Client dashboard overview.
-   `frontend/src/app/admin/page.tsx`: Admin dashboard overview with analytics.
-   `frontend/src/app/submit-case/page.tsx`: Multi-step case submission form.
-   `frontend/src/components/NotificationProvider.tsx`: WebSocket client and toast notification system.
