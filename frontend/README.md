# 1000 Hills Solicitors - Frontend

A modern, responsive Next.js application for legal case management with role-based dashboards, real-time messaging, and comprehensive analytics.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Custom components with Radix UI primitives
- **Charts**: Recharts 2.15.0
- **Icons**: Lucide React 0.469.0
- **HTTP Client**: Fetch API with custom wrapper
- **Real-time**: Socket.IO Client 4.8.1
- **Build Tool**: Turbopack (Next.js native)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or pnpm package manager
- Backend API running (see backend README)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Desire-2/1000-hills-solicitors.git
cd 1000-hills-solicitors/frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm (recommended):
```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000

# Application Configuration
NEXT_PUBLIC_APP_NAME=1000 Hills Solicitors
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_TOKEN_KEY=auth_token
NEXT_PUBLIC_USER_KEY=user_data

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── globals.css              # Global styles
│   │   │
│   │   ├── login/                   # Authentication
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/                   # Super Admin Dashboard
│   │   │   ├── page.tsx            # Admin home
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Analytics dashboard
│   │   │   ├── users/
│   │   │   │   └── page.tsx        # User management
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx        # System analytics
│   │   │   ├── settings/
│   │   │   │   └── page.tsx        # System settings
│   │   │   ├── activity/
│   │   │   │   └── page.tsx        # Activity log
│   │   │   └── cases/
│   │   │       └── page.tsx        # All cases view
│   │   │
│   │   ├── manager/                 # Case Manager Dashboard
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Manager overview
│   │   │   ├── cases/
│   │   │   │   └── page.tsx        # Case management
│   │   │   ├── clients/
│   │   │   │   └── page.tsx        # Client management
│   │   │   └── tasks/
│   │   │       └── page.tsx        # Task management
│   │   │
│   │   ├── dashboard/               # Client Dashboard
│   │   │   ├── page.tsx            # Client overview
│   │   │   ├── cases/
│   │   │   │   └── page.tsx        # My cases
│   │   │   ├── messages/
│   │   │   │   └── page.tsx        # Messaging
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx        # Appointments
│   │   │   ├── documents/
│   │   │   │   └── page.tsx        # Documents
│   │   │   └── help/
│   │   │       └── page.tsx        # Help & support
│   │   │
│   │   └── [public pages]/          # Static pages
│   │       ├── about/
│   │       ├── services/
│   │       ├── contact/
│   │       ├── careers/
│   │       ├── team/
│   │       ├── privacy/
│   │       └── terms/
│   │
│   ├── components/                   # React components
│   │   ├── admin/
│   │   │   └── AdminLayout.tsx      # Admin layout wrapper
│   │   ├── manager/
│   │   │   └── ManagerLayout.tsx    # Manager layout wrapper
│   │   ├── client/
│   │   │   └── ClientLayout.tsx     # Client layout wrapper
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx        # Login component
│   │   │   ├── RegisterForm.tsx     # Registration component
│   │   │   ├── ProtectedRoute.tsx   # Route guard
│   │   │   └── index.ts
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   └── Cards.tsx
│   │   ├── Navigation.tsx           # Main navigation
│   │   ├── Footer.tsx               # Footer component
│   │   └── NotificationProvider.tsx # Notifications
│   │
│   └── lib/                          # Utility libraries
│       ├── api.ts                   # API service layer
│       ├── auth-context.tsx         # Auth context provider
│       ├── types.ts                 # TypeScript types
│       ├── utils.ts                 # Helper functions
│       ├── role-utils.ts            # Role-based utilities
│       └── socket.ts                # WebSocket client
│
├── public/                           # Static assets
│   ├── next.svg
│   ├── vercel.svg
│   └── [other assets]
│
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── postcss.config.mjs               # PostCSS configuration
├── eslint.config.mjs                # ESLint configuration
└── package.json                     # Dependencies and scripts
```

## 🎨 Design System

### Color Palette

The application uses a custom color palette defined in `tailwind.config.ts`:

```typescript
colors: {
  '1000-blue': '#1e40af',      // Primary blue
  '1000-green': '#059669',     // Success green
  '1000-gold': '#d97706',      // Accent gold
  '1000-charcoal': '#1f2937',  // Dark text
}
```

### Typography

- **Font**: Inter (loaded via next/font/google)
- **Headings**: Bold weights (600-800)
- **Body**: Regular (400) and Medium (500)

## 🔐 Authentication

### User Roles & Access

| Role | Description | Access Level |
|------|-------------|--------------|
| **SUPER_ADMIN** | System administrator | Full system access, user management, analytics |
| **CASE_MANAGER** | Legal professional | Case management, client management, document handling |
| **CLIENT** | Service user | View own cases, messages, documents, appointments |

### Protected Routes

All dashboard routes are protected using the `ProtectedRoute` component:

```tsx
<ProtectedRoute requiredRole={[Role.CASE_MANAGER]}>
  <ManagerDashboardContent />
</ProtectedRoute>
```

### Login Flow

1. Navigate to `/login`
2. Enter credentials (test accounts in backend README)
3. Receive JWT token stored in localStorage
4. Redirect to role-specific dashboard
5. Token auto-refreshes before expiry

## 📊 Dashboard Features

### Super Admin Dashboard

- **Overview**: System KPIs, active cases, user metrics
- **User Management**: CRUD operations, role assignment, status management
- **Analytics**: 
  - Monthly trends (Area chart)
  - Case distribution (Pie chart)
  - User roles breakdown (Bar chart)
  - Team performance (Radar chart)
- **Settings**: System configuration across 6 tabs
  - General, Security, Email, Notifications, Database, Appearance
- **Activity Log**: Timeline view with filters and severity indicators
- **Cases**: Comprehensive case list with advanced filters

### Manager Dashboard

- **Overview**: Active cases, deadlines, recent messages
- **Cases**: 
  - Case list with status filters
  - Progress tracking
  - Assignment management
- **Clients**: 
  - Client cards with contact info
  - Active cases count
  - Quick actions
- **Tasks**: 
  - Smart deadline highlighting
  - Status filtering (pending/in-progress/completed)
  - Case associations

### Client Dashboard

- **Overview**: Case summary, upcoming appointments, recent activity
- **Cases**: 
  - My cases with priority badges
  - Status tracking
  - Quick access to details
- **Messages**: 
  - Three-column chat interface
  - Conversation list
  - Message composer with attachments
- **Appointments**: 
  - List and calendar views
  - Virtual/physical meeting details
- **Documents**: 
  - Category sidebar
  - File preview
  - Download functionality
- **Help**: 
  - FAQ sections
  - Contact support form
  - Resource links

## 🔌 API Integration

### API Service Layer

Located in `src/lib/api.ts`:

```typescript
// Example usage
import apiService from '@/lib/api';

// Get cases
const cases = await apiService.getCases();

// Create case
const newCase = await apiService.post('/cases', caseData);

// Upload document
const doc = await apiService.uploadDocument(caseId, file);
```

### Authentication Headers

The API service automatically includes JWT token in all requests:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 🎯 Key Components

### ProtectedRoute

Route protection with role-based access control:

```tsx
<ProtectedRoute requiredRole={[Role.SUPER_ADMIN]}>
  <AdminContent />
</ProtectedRoute>
```

### Layout Components

Reusable layouts with sidebars:

- `AdminLayout`: Super Admin pages
- `ManagerLayout`: Case Manager pages
- `ClientLayout`: Client portal pages

Each includes:
- Collapsible sidebar navigation
- Search functionality
- Notification center
- User profile menu
- Mobile responsive design

### Chart Components

Using Recharts for data visualization:

```tsx
import { AreaChart, BarChart, PieChart, LineChart, RadarChart } from 'recharts';

<AreaChart data={data} width={600} height={300}>
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="value" fill="#1e40af" />
</AreaChart>
```

## 🌐 Available Routes

### Public Routes

- `/` - Homepage
- `/about` - About page
- `/services` - Services offered
- `/contact` - Contact form
- `/team` - Team members
- `/careers` - Job listings
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/login` - Login page
- `/register` - Registration page

### Protected Routes

**Admin** (`/admin/*` - SUPER_ADMIN only):
- `/admin/dashboard` - Analytics
- `/admin/users` - User management
- `/admin/analytics` - System metrics
- `/admin/settings` - Configuration
- `/admin/activity` - Activity log
- `/admin/cases` - All cases

**Manager** (`/manager/*` - CASE_MANAGER only):
- `/manager/dashboard` - Overview
- `/manager/cases` - Case management
- `/manager/clients` - Client list
- `/manager/tasks` - Task tracking

**Client** (`/dashboard/*` - CLIENT only):
- `/dashboard` - Overview
- `/dashboard/cases` - My cases
- `/dashboard/messages` - Messages
- `/dashboard/appointments` - Appointments
- `/dashboard/documents` - Documents
- `/dashboard/help` - Help & support

## 🎨 Styling Guidelines

### Tailwind Classes

Common utility classes used:

```tsx
// Containers
<div className="container mx-auto px-4 py-8">

// Cards
<div className="bg-white rounded-lg shadow-sm border p-6">

// Buttons
<button className="bg-1000-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Responsive Design

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔄 State Management

### Auth Context

Global authentication state using React Context:

```tsx
const { user, login, logout, isAuthenticated } = useAuth();

// Login
await login(email, password);

// Logout
logout();

// Check authentication
if (isAuthenticated) {
  // User is logged in
}
```

### Local State

Component-level state using React hooks:

```tsx
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## 🧪 Testing

### Component Testing

```bash
# Run tests (when configured)
npm test

# Run with coverage
npm test -- --coverage
```

### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect GitHub repository to Vercel for automatic deployments.

### Environment Variables

Add the following to your deployment platform:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

### Build Optimization

Next.js automatically optimizes:
- Image optimization with next/image
- Font optimization with next/font
- Code splitting
- Tree shaking
- Minification

### Production Checklist

- [ ] Update environment variables
- [ ] Set NODE_ENV=production
- [ ] Enable analytics
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up monitoring
- [ ] Configure CDN
- [ ] Enable caching headers
- [ ] Run security audit: `npm audit`

## 🔧 Configuration Files

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['your-image-domain.com'],
  },
  // Other configurations
};

export default nextConfig;
```

### tailwind.config.ts

Custom colors, fonts, and theme extensions.

### tsconfig.json

TypeScript compiler options with strict mode enabled.

## 📦 Dependencies

### Core Dependencies

```json
{
  "next": "16.0.10",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5",
  "tailwindcss": "^3.4.1"
}
```

### UI & Visualization

```json
{
  "recharts": "^2.15.0",
  "lucide-react": "^0.469.0",
  "@radix-ui/react-slot": "^1.1.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0"
}
```

### Real-time & API

```json
{
  "socket.io-client": "^4.8.1"
}
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Inspect network tab in browser DevTools
4. Check CORS configuration in backend

### TypeScript Errors

```bash
# Check for errors
npx tsc --noEmit

# Update types
npm install --save-dev @types/react @types/node
```

### Styling Issues

```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch
```

## 🔍 Performance Optimization

- Use `next/image` for optimized images
- Implement lazy loading for heavy components
- Use React.memo for expensive renders
- Implement pagination for large lists
- Use dynamic imports for code splitting

```tsx
// Dynamic import example
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Recharts Examples](https://recharts.org/en-US/examples)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow code style guidelines (ESLint)
4. Write meaningful commit messages
5. Push to branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Keep components small and focused

## 📄 License

This project is proprietary software for 1000 Hills Solicitors.

## 👥 Support

For support, email: support@1000hillssolicitors.com

---

**Version**: 1.0.0  
**Last Updated**: December 19, 2025  
**Next.js Version**: 16.0.10
