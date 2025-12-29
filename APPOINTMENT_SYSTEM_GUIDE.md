# Appointment Management System

## Overview

The Appointment Management System is a fully integrated feature for 1000 Hills Solicitors that allows clients to schedule, manage, and join video meetings with attorneys. The system includes backend APIs, Google Meet integration, and a modern React frontend with real-time updates.

## Features

### 🎯 Core Features

1. **Appointment Booking**
   - Schedule meetings with attorneys
   - Select appointment type (Video, In-Person, Phone)
   - Link appointments to cases
   - Add notes and descriptions

2. **Google Meet Integration**
   - Automatic Google Meet link generation for video appointments
   - One-click join meeting button
   - Ready for full Google Calendar API integration

3. **Appointment Management**
   - View upcoming appointments
   - Filter by status (Pending, Confirmed, Completed, Cancelled)
   - Search appointments
   - Reschedule existing appointments
   - Cancel appointments

4. **Multiple Views**
   - **List View**: Detailed appointment cards with all information
   - **Calendar View**: Monthly calendar grid showing appointments

5. **Real-Time Statistics**
   - Upcoming appointments count
   - This month's appointments
   - Pending appointments
   - Completed appointments

### 🔐 Security

- JWT-based authentication
- Role-based access control
- Client can only see their appointments
- Attorney can see their assigned appointments
- Admin can see all appointments

## Backend Architecture

### Models

**Appointment Model** (`backend/models/appointment.py`)
```python
- id: Integer (Primary Key)
- title: String (Required)
- description: Text
- start_datetime: DateTime (Required)
- end_datetime: DateTime (Required)
- duration: Integer (minutes)
- appointment_type: Enum (video, in_person, phone)
- location: String
- meeting_link: String (Google Meet link)
- status: Enum (pending, confirmed, completed, cancelled, rescheduled)
- client_id: Foreign Key to User
- attorney_id: Foreign Key to User
- case_id: Foreign Key to Case (Optional)
- notes: Text
- reminder_sent: DateTime
- created_at: DateTime
- updated_at: DateTime
```

### API Endpoints

**Base URL**: `/api/appointments`

#### GET `/api/appointments`
Get all appointments for the current user
- **Query Parameters**:
  - `status`: Filter by status
  - `start_date`: Filter by start date
  - `end_date`: Filter by end date
- **Returns**: List of appointments with count

#### GET `/api/appointments/<id>`
Get a specific appointment
- **Returns**: Appointment details

#### POST `/api/appointments`
Create a new appointment
- **Body**:
  ```json
  {
    "title": "Initial Consultation",
    "description": "Discuss case details",
    "start_datetime": "2025-01-20T10:00:00",
    "end_datetime": "2025-01-20T11:00:00",
    "appointment_type": "video",
    "attorney_id": 2,
    "case_id": 1,
    "notes": "Prepare documents"
  }
  ```
- **Returns**: Created appointment with Google Meet link (if video)

#### PUT `/api/appointments/<id>`
Update an existing appointment
- **Body**: Partial appointment data
- **Returns**: Updated appointment

#### DELETE `/api/appointments/<id>`
Delete an appointment (Admin/Attorney only)
- **Returns**: Success message

#### POST `/api/appointments/<id>/cancel`
Cancel an appointment
- **Returns**: Updated appointment with cancelled status

#### GET `/api/appointments/stats`
Get appointment statistics for the current user
- **Returns**: 
  ```json
  {
    "upcoming": 3,
    "this_month": 5,
    "completed": 12,
    "pending": 2
  }
  ```

#### GET `/api/appointments/attorneys`
Get list of available attorneys
- **Returns**: List of attorneys (ID, name, email)

### Google Meet Integration

**File**: `backend/utils/google_meet.py`

The Google Meet service provides:
- Meeting link generation
- Google Calendar API integration (ready for production)
- Event creation and management
- Reminder scheduling

**Current Implementation**:
- Generates placeholder Google Meet links
- Format: `https://meet.google.com/hills-{appointment_id}-{unique_code}`

**Production Setup**:
To enable full Google Calendar integration:
1. Install required packages:
   ```bash
   pip install google-auth google-auth-oauthlib google-api-python-client
   ```
2. Set up Google Cloud Console project
3. Enable Google Calendar API
4. Download credentials.json
5. Set environment variables:
   ```
   GOOGLE_CALENDAR_ENABLED=true
   GOOGLE_CREDENTIALS_FILE=/path/to/credentials.json
   ```

## Frontend Architecture

### Components

**Main Component**: `frontend/src/app/dashboard/appointments/page.tsx`

#### Key Features:

1. **State Management**
   - Appointments list
   - Filtered appointments
   - Statistics
   - Available attorneys
   - Loading and error states
   - Modal state for booking

2. **Appointment List View**
   - Detailed cards for each appointment
   - Status badges with icons
   - Date and time formatting
   - Type indicators (Video/In-Person/Phone)
   - Attorney information
   - Case reference links
   - Action buttons (Join, Reschedule, Cancel)

3. **Calendar View**
   - Monthly grid layout
   - Day-of-month display
   - Appointment indicators
   - Navigation (Previous/Next/Today)

4. **Booking Modal**
   - Form for creating/editing appointments
   - Title and description
   - Date/time pickers
   - Type selection (visual buttons)
   - Attorney dropdown
   - Case ID linking
   - Notes field

5. **Filters and Search**
   - Search by title, attorney, or location
   - Filter by status
   - View toggle (List/Calendar)

#### API Integration

**File**: `frontend/src/lib/api.ts`

New appointment methods:
- `getAppointments(params?)` - Fetch appointments with filters
- `getAppointment(id)` - Get single appointment
- `createAppointment(data)` - Create new appointment
- `updateAppointment(id, updates)` - Update appointment
- `deleteAppointment(id)` - Delete appointment
- `cancelAppointment(id)` - Cancel appointment
- `getAppointmentStats()` - Get statistics
- `getAvailableAttorneys()` - Get attorney list

### Type Definitions

**File**: `frontend/src/lib/types.ts`

```typescript
enum AppointmentType {
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  PHONE = 'phone',
}

enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

interface Appointment {
  id: number;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  duration: number;
  appointment_type: AppointmentType;
  location?: string;
  meeting_link?: string;
  status: AppointmentStatus;
  client_id: number;
  client_name?: string;
  attorney_id: number;
  attorney_name?: string;
  case_id?: number;
  case_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

## Database Migration

To create the appointments table, run:

```bash
cd backend
source venv/bin/activate
flask db migrate -m "Add appointments table"
flask db upgrade
```

## Usage Examples

### Creating an Appointment (Client)

1. Navigate to `/dashboard/appointments`
2. Click "Book Appointment" button
3. Fill in the form:
   - Title: "Initial Consultation"
   - Select start/end time
   - Choose "Video Call" type
   - Select an attorney
   - Add any notes
4. Click "Book Appointment"
5. System automatically generates Google Meet link for video appointments

### Joining a Video Meeting

1. Go to appointments page
2. Find the confirmed upcoming appointment
3. Click "Join Meeting" button
4. Opens Google Meet in new tab

### Rescheduling an Appointment

1. Find the appointment in the list
2. Click "Reschedule" button
3. Modal opens with current details
4. Update date/time
5. Click "Update Appointment"

## Enhancements & Future Features

### Implemented Enhancements

✅ **Backend**
- Full RESTful API with authentication
- Google Meet link generation
- Statistics and analytics
- Role-based access control
- Relationship with users and cases

✅ **Frontend**
- Modern, responsive UI
- Real-time search and filtering
- Multiple view options
- Detailed appointment cards
- Interactive booking modal
- Status indicators and badges
- One-click meeting join

### Potential Future Enhancements

🔮 **Near Future**
1. **Email Notifications**
   - Appointment confirmation emails
   - Reminder emails (24 hours, 1 hour before)
   - Cancellation notifications

2. **Calendar Sync**
   - Export to iCal/Google Calendar
   - Two-way sync with Google Calendar
   - Outlook integration

3. **Availability Management**
   - Attorney availability calendar
   - Automatic conflict detection
   - Suggested time slots

4. **Video Conferencing**
   - In-app video calls
   - Screen sharing
   - Recording capabilities

5. **Advanced Features**
   - Recurring appointments
   - Appointment templates
   - Bulk scheduling
   - Waiting list management

6. **Analytics**
   - Attorney productivity metrics
   - Client engagement tracking
   - Popular time slots
   - No-show rate tracking

## Testing

### Backend Testing

```bash
cd backend
source venv/bin/activate

# Test appointment creation
curl -X POST http://localhost:5001/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Meeting",
    "start_datetime": "2025-01-20T10:00:00",
    "end_datetime": "2025-01-20T11:00:00",
    "appointment_type": "video",
    "attorney_id": 2
  }'

# Test fetching appointments
curl -X GET http://localhost:5001/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test statistics
curl -X GET http://localhost:5001/api/appointments/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Testing

1. Start the development server
2. Log in as a client
3. Navigate to `/dashboard/appointments`
4. Test booking flow
5. Test filtering and search
6. Test calendar view
7. Test reschedule and cancel

## Deployment Checklist

- [ ] Run database migrations
- [ ] Update environment variables for Google Calendar
- [ ] Configure email service for notifications
- [ ] Set up CORS for production URLs
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test Google Meet link generation
- [ ] Verify frontend deployment
- [ ] Test responsive design
- [ ] Configure monitoring and logging

## Technical Stack

**Backend**:
- Flask (Python web framework)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- PostgreSQL (Database)

**Frontend**:
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Lucide React (Icons)

**Integration**:
- Google Meet (Video conferencing)
- Google Calendar API (Ready for integration)

## Support & Maintenance

For issues or questions:
1. Check the error logs in the browser console
2. Verify backend API responses
3. Ensure JWT token is valid
4. Check database migrations are up to date

## License

This appointment system is part of the 1000 Hills Solicitors case management platform.

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0
