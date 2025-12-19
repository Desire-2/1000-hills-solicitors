# 1000 Hills Solicitors Platform

A complete, production-ready website platform for 1000 Hills Solicitors, featuring a public website, a secure client dashboard, and a comprehensive admin/staff dashboard with a Case Management System (CMS).

## 🚀 Technology Stack

| Component | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** (App Router) | TypeScript, React, Tailwind CSS, Shadcn/UI, Recharts |
| **Backend** | **Flask** (Python) | REST API, Flask-JWT-Extended for Authentication, Flask-SocketIO for Real-time |
| **Database** | **PostgreSQL** (Mocked with SQLite) | SQLAlchemy ORM, Flask-Migrate for schema management |
| **Authentication** | **JWT** & **Bcrypt** | Role-Based Access Control (RBAC) for Admin/Client separation |
| **Real-time** | **WebSockets** | Implemented with Flask-SocketIO for live chat and notifications |

## ⚙️ Project Structure

The project is divided into two main directories:

-   `frontend/`: Contains the Next.js application.
-   `backend/`: Contains the Flask REST API and WebSocket server.

## 🛠️ Setup and Installation

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd 1000-hills-solicitors/backend
    ```

2.  **Install Python dependencies:**
    ```bash
    # The following command installs all necessary packages:
    sudo pip3 install Flask Flask-SQLAlchemy Flask-Migrate Flask-CORS python-dotenv psycopg2-binary Flask-Bcrypt Flask-JWT-Extended Flask-SocketIO eventlet
    ```

3.  **Configure Environment Variables:**
    The `.env` file is already created with development defaults. For production, ensure you update the `DATABASE_URL` to a PostgreSQL connection string.

4.  **Initialize Database and Create Users:**
    Run the setup script to create the database schema and initial admin/client users.
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
