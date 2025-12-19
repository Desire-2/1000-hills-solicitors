# Role-Based Dashboard System - Implementation Guide

## Overview

The application now features a comprehensive role-based dashboard system that automatically redirects users to their appropriate dashboard after successful login based on their role.

## User Roles & Dashboards

### 1. **CLIENT** → `/dashboard`
**Default user role for clients submitting cases**

Features:
- View own cases
- Track case status
- Submit new cases
- View case history
- Access to notifications

### 2. **CASE_MANAGER** → `/manager/dashboard`
**For staff managing legal cases**

Features:
- Manage all cases
- Assign cases to team members
- View case statistics
- Review new cases
- Generate reports
- Team overview

Dashboard Statistics:
- Total cases
- Active cases
- Pending review
- Resolved today

Quick Actions:
- Review new cases
- View assigned cases
- Generate reports
- Team management

### 3. **CONTENT_EDITOR** → `/editor/dashboard`
**For managing website content and blog posts**

Features:
- Create and edit blog posts
- Manage pages
- Media library access
- Service descriptions
- Content review workflow

Dashboard Statistics:
- Total pages
- Draft posts
- Published posts
- Pending review

Quick Actions:
- New blog post
- Edit pages
- Media library
- Manage services

### 4. **SUPER_ADMIN** → `/admin/dashboard`
**Full system access with administrative privileges**

Features:
- System-wide analytics
- User management
- All case management
- Content management
- System configuration
- Reports and statistics

Dashboard Features:
- Advanced analytics
- Case distribution charts
- User statistics
- System health monitoring

### 5. **VIEWER** → `/viewer/dashboard`
**Read-only access for auditors/observers**

Features:
- View all cases (read-only)
- Search cases and documents
- Download documents
- View reports
- Browse history

Restrictions:
- Cannot create or modify content
- Cannot manage cases
- Cannot access admin functions

## Authentication Flow

### Login Process

```
1. User enters credentials
   ↓
2. Backend validates and returns JWT token
   ↓
3. Frontend fetches user details (including role)
   ↓
4. System determines appropriate dashboard
   ↓
5. User redirected to role-specific dashboard
```

### Registration Process

```
1. User fills registration form
   ↓
2. Backend creates user (default role: CLIENT)
   ↓
3. Auto-login with new credentials
   ↓
4. Redirect to appropriate dashboard
```

## Technical Implementation

### Files Created/Modified

#### New Files:
1. **`src/lib/role-utils.ts`**
   - `getDashboardUrl(role)` - Returns dashboard URL for role
   - `getRoleName(role)` - Returns display name
   - `isAdmin(role)` - Checks admin access
   - `canManageCases(role)` - Checks case management permission
   - `canEditContent(role)` - Checks content editing permission

2. **Dashboard Pages:**
   - `/dashboard/page.tsx` - Client dashboard (existing, updated)
   - `/manager/dashboard/page.tsx` - Case Manager dashboard (new)
   - `/editor/dashboard/page.tsx` - Content Editor dashboard (new)
   - `/viewer/dashboard/page.tsx` - Viewer dashboard (new)
   - `/admin/dashboard/page.tsx` - Super Admin dashboard (copied)

#### Modified Files:
1. **`src/lib/auth-context.tsx`**
   - Updated to return user data after login/register
   - Enhanced type definitions

2. **`src/lib/types.ts`**
   - Added CONTENT_EDITOR and VIEWER roles

3. **`src/components/auth/LoginForm.tsx`**
   - Implements role-based redirection after login

4. **`src/components/auth/RegisterForm.tsx`**
   - Implements role-based redirection after registration

5. **`src/components/auth/ProtectedRoute.tsx`**
   - Enhanced to support multiple roles
   - Redirects to appropriate dashboard if wrong role

6. **`src/components/Navigation.tsx`**
   - Dynamic dashboard links based on user role
   - Shows appropriate menu items per role

## Role Permissions Matrix

| Feature | CLIENT | CASE_MANAGER | CONTENT_EDITOR | SUPER_ADMIN | VIEWER |
|---------|--------|--------------|----------------|-------------|--------|
| View Own Cases | ✅ | ✅ | ❌ | ✅ | ✅ |
| Manage All Cases | ❌ | ✅ | ❌ | ✅ | ❌ |
| Assign Cases | ❌ | ✅ | ❌ | ✅ | ❌ |
| Edit Content | ❌ | ❌ | ✅ | ✅ | ❌ |
| Publish Content | ❌ | ❌ | ✅ | ✅ | ❌ |
| User Management | ❌ | ❌ | ❌ | ✅ | ❌ |
| System Config | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Reports | ❌ | ✅ | ❌ | ✅ | ✅ |
| Download Docs | ✅ | ✅ | ❌ | ✅ | ✅ |

## Usage Examples

### Protecting a Route

```typescript
// Single role requirement
<ProtectedRoute requiredRole={Role.CASE_MANAGER}>
  <CaseManagerContent />
</ProtectedRoute>

// Multiple roles allowed
<ProtectedRoute requiredRole={[Role.SUPER_ADMIN, Role.CASE_MANAGER]}>
  <CaseManagementContent />
</ProtectedRoute>

// Any authenticated user
<ProtectedRoute>
  <DashboardContent />
</ProtectedRoute>
```

### Getting Dashboard URL

```typescript
import { getDashboardUrl } from '@/lib/role-utils';

const user = await getCurrentUser();
const dashboardUrl = getDashboardUrl(user.role);
router.push(dashboardUrl);
```

### Checking Permissions

```typescript
import { canManageCases, canEditContent, isAdmin } from '@/lib/role-utils';

if (canManageCases(user.role)) {
  // Show case management features
}

if (canEditContent(user.role)) {
  // Show content editing features
}

if (isAdmin(user.role)) {
  // Show admin-only features
}
```

## Navigation Behavior

### Desktop Navigation
- Shows user name with dropdown menu
- Dashboard link goes to role-appropriate dashboard
- Admin panel link only visible for SUPER_ADMIN

### Mobile Navigation
- Shows user info card
- Dashboard button navigates to correct dashboard
- Admin panel button only for SUPER_ADMIN
- Profile and logout options

## Testing Different Roles

### Create Test Users

Use the backend to create users with different roles:

```python
from app import app
from extensions import db
from models import User, Role
from flask_bcrypt import generate_password_hash

with app.app_context():
    # Case Manager
    manager = User(
        email='manager@1000hills.rw',
        password_hash=generate_password_hash('test123').decode('utf-8'),
        name='Case Manager',
        role=Role.CASE_MANAGER,
        email_verified=True
    )
    
    # Content Editor
    editor = User(
        email='editor@1000hills.rw',
        password_hash=generate_password_hash('test123').decode('utf-8'),
        name='Content Editor',
        role=Role.CONTENT_EDITOR,
        email_verified=True
    )
    
    # Viewer
    viewer = User(
        email='viewer@1000hills.rw',
        password_hash=generate_password_hash('test123').decode('utf-8'),
        name='Viewer User',
        role=Role.VIEWER,
        email_verified=True
    )
    
    # Super Admin
    admin = User(
        email='admin@1000hills.rw',
        password_hash=generate_password_hash('admin123').decode('utf-8'),
        name='Super Admin',
        role=Role.SUPER_ADMIN,
        email_verified=True
    )
    
    db.session.add_all([manager, editor, viewer, admin])
    db.session.commit()
```

### Test Login Flows

1. **CLIENT Login:**
   ```
   Email: client@example.com
   Password: test123
   Expected: Redirect to /dashboard
   ```

2. **CASE_MANAGER Login:**
   ```
   Email: manager@1000hills.rw
   Password: test123
   Expected: Redirect to /manager/dashboard
   ```

3. **CONTENT_EDITOR Login:**
   ```
   Email: editor@1000hills.rw
   Password: test123
   Expected: Redirect to /editor/dashboard
   ```

4. **SUPER_ADMIN Login:**
   ```
   Email: admin@1000hills.rw
   Password: admin123
   Expected: Redirect to /admin/dashboard
   ```

5. **VIEWER Login:**
   ```
   Email: viewer@1000hills.rw
   Password: test123
   Expected: Redirect to /viewer/dashboard
   ```

## Security Considerations

### Frontend Protection
- ProtectedRoute wrapper prevents unauthorized access
- Automatic redirection if wrong role
- Loading states prevent flash of protected content

### Backend Validation
- Always validate role on backend
- Don't rely solely on frontend protection
- Use JWT claims for role verification
- Implement proper authorization middleware

### Best Practices
1. Check permissions on every sensitive operation
2. Log authorization failures for security monitoring
3. Implement rate limiting on login attempts
4. Use HTTPS in production
5. Regularly audit user roles and permissions

## Customization Guide

### Adding a New Role

1. **Add to Backend Enum** (`backend/models/enums.py`):
```python
class Role(enum.Enum):
    NEW_ROLE = "NEW_ROLE"
```

2. **Add to Frontend Enum** (`frontend/src/lib/types.ts`):
```typescript
export enum Role {
  NEW_ROLE = 'NEW_ROLE',
}
```

3. **Add Dashboard Mapping** (`frontend/src/lib/role-utils.ts`):
```typescript
case Role.NEW_ROLE:
  return '/new-role/dashboard';
```

4. **Create Dashboard Page:**
```
frontend/src/app/new-role/dashboard/page.tsx
```

5. **Add Permission Checks:**
```typescript
export function canDoNewThing(role: Role): boolean {
  return [Role.SUPER_ADMIN, Role.NEW_ROLE].includes(role);
}
```

### Customizing Dashboard Content

Each dashboard is a standalone component that can be customized:

1. Update statistics in `useEffect`
2. Modify quick action buttons
3. Customize table columns
4. Add charts and analytics
5. Implement real API calls

## Troubleshooting

### User Not Redirecting After Login
- Check browser console for errors
- Verify `getDashboardUrl()` returns correct path
- Ensure role is correctly set in database
- Check that dashboard page exists

### Wrong Dashboard Showing
- Verify user role in profile
- Check ProtectedRoute configuration
- Clear localStorage and re-login
- Verify role in JWT token

### Navigation Links Not Working
- Check Navigation component imports
- Verify `getDashboardUrl` is called with correct role
- Ensure user state is loaded before rendering

## Future Enhancements

1. **Role Hierarchy**
   - Implement inheritance (e.g., SUPER_ADMIN inherits all permissions)
   - Fine-grained permission system

2. **Dashboard Customization**
   - Allow users to customize their dashboard layout
   - Widget-based system

3. **Multi-Role Support**
   - Users can have multiple roles
   - Switch between roles in UI

4. **Activity Logging**
   - Track which dashboards users access
   - Monitor role-based actions

5. **Dynamic Dashboards**
   - Load dashboard configuration from backend
   - A/B testing for different role UIs

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0
