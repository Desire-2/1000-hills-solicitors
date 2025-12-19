# Client Dashboard Guide

## Overview
The Client Dashboard provides a comprehensive portal for clients to manage their legal cases, communicate with their legal team, access documents, and schedule appointments.

## Architecture

### Layout Component
- **Location**: `/frontend/src/components/client/ClientLayout.tsx`
- **Features**:
  - Responsive sidebar navigation
  - Mobile-friendly overlay menu
  - Top navigation bar with search and notifications
  - User profile menu
  - Help section widget

### Navigation Structure
```
Dashboard
├── Dashboard (Overview)
├── Cases (Case Management)
├── Messages (Communication)
├── Appointments (Scheduling)
├── Documents (File Management)
└── Help & Support (Resources)
```

## Pages

### 1. Dashboard (Main)
**Location**: `/frontend/src/app/dashboard/page.tsx`

**Features**:
- **Statistics Cards**:
  - Active Cases count
  - Pending Documents count
  - Upcoming Appointments count
  - Unread Messages count
  
- **Active Cases Section**:
  - Quick view of current cases
  - Status badges (In Progress, Under Review)
  - Attorney assignments
  - Priority indicators
  - Quick action buttons

- **Upcoming Appointments**:
  - Next scheduled meetings
  - Date, time, and attorney information
  - Meeting type (video/in-person)
  - Quick join/view buttons

- **Recent Activity Timeline**:
  - Case updates
  - Document uploads
  - Message notifications
  - Appointment confirmations

- **Quick Actions Panel**:
  - Submit New Case
  - Upload Document
  - Schedule Appointment
  - Send Message

**Access**: Protected route requiring `Role.CLIENT`

### 2. Cases Page
**Location**: `/frontend/src/app/dashboard/cases/page.tsx`

**Features**:
- **Stats Cards**:
  - In Progress cases
  - New cases
  - Resolved cases

- **Search and Filters**:
  - Text search across case names/IDs
  - Filter by status (All, In Progress, New, Under Review, Resolved, Closed)

- **Case Cards Display**:
  - Case ID and title
  - Status badge with color coding
  - Priority badge (High, Medium, Low)
  - Assigned attorney with avatar
  - Last update timestamp
  - Quick view/message buttons

**Status Badges**:
- In Progress: Blue
- New: Green
- Under Review: Yellow
- Resolved: Green
- Closed: Gray

**Priority Badges**:
- High: Red background
- Medium: Yellow background
- Low: Green background

### 3. Messages Page
**Location**: `/frontend/src/app/dashboard/messages/page.tsx`

**Features**:
- **Three-Column Layout**:
  1. Conversations sidebar
  2. Message thread view
  3. Message input area

- **Conversations List**:
  - Contact name and role
  - Last message preview
  - Timestamp
  - Unread message count badge
  - Associated case ID
  - Search conversations

- **Message Thread**:
  - Real-time chat interface
  - Message bubbles (sent/received)
  - Timestamps
  - Contact header with avatar
  - Case context

- **Message Composer**:
  - Text input field
  - File attachment button
  - Send button
  - Enter key support

**Current Data**: 2 unread messages from Sarah Johnson (Case Manager)

### 4. Appointments Page
**Location**: `/frontend/src/app/dashboard/appointments/page.tsx`

**Features**:
- **View Modes**:
  - List View (default)
  - Calendar View

- **Stats Cards**:
  - Upcoming appointments (3)
  - This Month total (5)
  - Completed appointments (12)

- **List View Components**:
  - Appointment title
  - Attorney name with avatar
  - Date, time, and duration
  - Meeting type (Video/In-Person)
  - Location information
  - Status badge (Confirmed, Pending, Cancelled)
  - Associated case ID
  - Action buttons (Reschedule, Join)

- **Calendar View**:
  - Month navigation
  - Day grid
  - Today button
  - Appointment markers

**Meeting Types**:
- Video: Includes "Join" button for Zoom/video calls
- In-Person: Shows office location

### 5. Documents Page
**Location**: `/frontend/src/app/dashboard/documents/page.tsx`

**Features**:
- **Stats Dashboard**:
  - Total Documents (12)
  - Pending Review (3)
  - Storage Used (45 MB / 5 GB)

- **Category Sidebar**:
  - All Documents (12)
  - Contracts (4)
  - Legal Documents (3)
  - Evidence (2)
  - Correspondence (3)

- **Document Table**:
  - File name and icon
  - Category
  - File size
  - Upload date and user
  - Status badge
  - Action buttons (View, Download, Delete)

- **Search and Filter**:
  - Text search across filenames
  - Filter by category
  - Sort options

- **Storage Visualization**:
  - Progress bar showing usage
  - Percentage indicator
  - Remaining space

**Document Statuses**:
- Signed: Green
- Pending: Yellow
- Review: Blue
- Approved: Green
- Rejected: Red

### 6. Help & Support Page
**Location**: `/frontend/src/app/dashboard/help/page.tsx`

**Features**:
- **Quick Contact Cards**:
  - Phone: +27 31 555 1234
  - Email: support@1000hills.co.za
  - Live Chat: Business hours

- **FAQ Section**:
  - Expandable/collapsible questions
  - Search functionality
  - 5 common questions covered

- **Support Ticket Form**:
  - Subject field
  - Category dropdown
  - Message textarea
  - Submit button

**Support Categories**:
- Account & Billing
- Case Management
- Document Upload
- Appointments
- Technical Support
- Other

- **Sidebar Widgets**:
  - Quick Links (Getting Started, Legal Resources, Service Hours)
  - Office Hours card
  - Emergency Contact card

**Office Hours**:
- Monday - Friday: 9AM - 5PM
- Saturday: 9AM - 1PM
- Sunday: Closed
- Emergency: +27 82 555 1234

## Design System

### Color Palette
```css
Primary Blue: #1e40af (1000-blue)
Green: #059669 (1000-green)
Gold: #d97706 (1000-gold)
Charcoal: #1f2937 (1000-charcoal)
```

### Typography
- Headings: Bold, Inter/System font
- Body: Regular, 14-16px
- Labels: Medium weight, 12-14px

### Components
- Cards: White background, gray border, shadow-sm
- Buttons: Blue primary, outline secondary
- Badges: Color-coded by status/priority
- Forms: Border with focus ring
- Avatars: Circular, initials with blue background

## Technical Implementation

### Authentication
- Protected routes using `ProtectedRoute` component
- Role-based access: `Role.CLIENT`
- JWT token validation
- Session management via auth context

### State Management
- React hooks (useState, useEffect)
- Local component state
- Auth context for user data

### Data Flow
**Current**: Mock data in components
**Future**: API integration via `/lib/api.ts`

### Responsive Design
- Mobile: < 768px (collapsible sidebar)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Navigation
- Next.js App Router
- Client-side transitions
- Active link highlighting

## API Integration (TODO)

### Required Endpoints
```typescript
// Cases
GET    /api/cases           - List all cases
GET    /api/cases/:id       - Get case details
POST   /api/cases           - Create new case
PUT    /api/cases/:id       - Update case

// Messages
GET    /api/messages        - Get conversations
GET    /api/messages/:id    - Get thread
POST   /api/messages        - Send message

// Appointments
GET    /api/appointments    - List appointments
POST   /api/appointments    - Book appointment
PUT    /api/appointments/:id - Reschedule
DELETE /api/appointments/:id - Cancel

// Documents
GET    /api/documents       - List documents
POST   /api/documents       - Upload document
GET    /api/documents/:id   - Download
DELETE /api/documents/:id   - Delete

// Support
POST   /api/support/tickets - Submit ticket
GET    /api/support/faq     - Get FAQs
```

## Usage

### For Clients

1. **Login**: Navigate to `/login` with your credentials
2. **Dashboard**: View overview of all your legal matters
3. **Cases**: Check status and details of your cases
4. **Messages**: Communicate securely with your legal team
5. **Appointments**: Schedule and manage meetings
6. **Documents**: Upload and access case-related files
7. **Help**: Find answers and contact support

### For Developers

1. **Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Add New Feature**:
   - Create page in `/src/app/dashboard/[feature]/page.tsx`
   - Wrap with `ClientLayout` and `ProtectedRoute`
   - Add navigation link in `ClientLayout.tsx`

3. **Integrate API**:
   - Add API functions in `/src/lib/api.ts`
   - Replace mock data with API calls
   - Add loading and error states

## Best Practices

### Security
- Always use ProtectedRoute for dashboard pages
- Validate user roles on backend
- Sanitize user inputs
- Use HTTPS for all communications

### Performance
- Lazy load heavy components
- Optimize images and assets
- Implement pagination for large lists
- Cache frequently accessed data

### UX
- Show loading states
- Provide clear error messages
- Enable keyboard navigation
- Ensure mobile responsiveness

## Future Enhancements

1. **Real-time Updates**:
   - WebSocket integration for live notifications
   - Auto-refresh for case status changes

2. **Advanced Search**:
   - Full-text search across all content
   - Filter combinations
   - Saved searches

3. **Document Preview**:
   - In-browser PDF viewer
   - Image gallery
   - Version history

4. **Video Conferencing**:
   - Integrated video calls
   - Screen sharing
   - Call recording

5. **Mobile App**:
   - Native iOS/Android apps
   - Push notifications
   - Offline mode

## Support

For technical issues or questions:
- Email: dev@1000hills.co.za
- Documentation: Internal wiki
- GitHub: Project repository

## Changelog

### Version 1.0.0 (January 2025)
- Initial client dashboard implementation
- All core pages created with mock data
- Responsive design implemented
- Role-based access control added
