# Appointments System Integration - Complete Guide

## Overview
Successfully integrated a full-featured appointment management system accessible from Client, Manager, and Super Admin dashboards with role-based features and Google Meet integration.

## What Was Implemented

### 1. Backend Components

#### Database Model (`backend/models/appointment.py`)
- **Appointment** model with comprehensive fields:
  - Basic info: title, description, start/end datetime
  - Type: VIDEO, IN_PERSON, PHONE
  - Status: PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED
  - Relationships: client_id, attorney_id, case_id (optional)
  - Google Meet: meeting_link field
  - Location: for in-person meetings
  - Duration: auto-calculated from start/end times

#### API Endpoints (`backend/routes/appointments.py`)
All endpoints at `/api/appointments`:

1. **GET /api/appointments** - List appointments with filters
   - Query params: status, type, date_from, date_to
   - Returns all appointments for the authenticated user
   - Includes attorney name, client name, and case reference

2. **POST /api/appointments** - Create appointment
   - Role-based logic:
     - Clients: Create with PENDING status
     - Managers/Admins: Create with CONFIRMED status + auto-generate Google Meet link
   - Validates attorney existence
   - Handles client_phone for phone appointments

3. **PUT /api/appointments/<id>** - Update appointment
   - Can reschedule or confirm appointments
   - Auto-generates Google Meet link when status changed to CONFIRMED
   - Validates ownership/permissions

4. **DELETE /api/appointments/<id>** - Delete appointment
   - Hard delete from database
   - Permission checks for ownership

5. **POST /api/appointments/<id>/cancel** - Cancel appointment
   - Soft cancel (status change to CANCELLED)
   - Preserves appointment history

6. **GET /api/appointments/stats** - Get statistics
   - Returns: upcoming count, this_month count, completed count, pending count
   - User-specific stats

7. **GET /api/appointments/attorneys** - List available attorneys
   - Returns users with CASE_MANAGER or SUPER_ADMIN roles
   - For attorney selection in booking form

#### Google Meet Integration (`backend/utils/google_meet.py`)
- **GoogleMeetService** class with placeholder implementation
- `generate_meet_link()` - Currently generates demo links
- `create_calendar_event()` - Stub for future Google Calendar API integration
- Ready for production Google Calendar API setup

#### User Model Updates (`backend/models/user.py`)
- Added `to_dict()` method
- Exposes phone field for client phone handling

### 2. Frontend Components

#### Appointments Page (`frontend/src/app/dashboard/appointments/page.tsx`)
**Key Features:**
- ✅ **Dynamic Layout** - Automatically uses correct layout based on user role:
  - CLIENT → ClientLayout
  - CASE_MANAGER → ManagerLayout
  - SUPER_ADMIN → AdminLayout

- ✅ **Two View Modes:**
  - List View: Detailed appointment cards with all info
  - Calendar View: Monthly calendar with appointment indicators

- ✅ **Stats Dashboard:**
  - Upcoming appointments
  - This month total
  - Pending count
  - Completed count

- ✅ **Search & Filters:**
  - Text search (title, attorney, location)
  - Status filter (all, pending, confirmed, completed, cancelled)

- ✅ **Booking Modal** with role-based fields:
  - Title, description, date/time range
  - Appointment type selection (Video/In-Person/Phone)
  - Attorney selection
  - Case ID (optional)
  - Notes
  - **Client-specific:**
    - Phone number prompt for phone appointments (if not in profile)
    - Informational messages about Meet link generation and location
  - **Manager/Admin-specific:**
    - Location field for in-person appointments
    - Ability to create confirmed appointments

- ✅ **Appointment Actions:**
  - Join Meeting button (for video calls with Meet links)
  - Reschedule appointment
  - Cancel appointment

- ✅ **Real-time Updates:**
  - Auto-refresh after booking/cancelling
  - Stats update after actions

#### Navigation Integration

**Client Dashboard** (`frontend/src/components/client/ClientLayout.tsx`)
- Already had Appointments link

**Manager Dashboard** (`frontend/src/components/manager/ManagerLayout.tsx`)
- ✅ Added "Appointments" navigation item
- Icon: CalendarCheck from lucide-react
- Route: `/manager/appointments`

**Super Admin Dashboard** (`frontend/src/components/admin/AdminLayout.tsx`)
- ✅ Added "Appointments" navigation item under Management section
- Icon: CalendarCheck from lucide-react
- Route: `/admin/appointments`

#### Route Files

**Manager Route** (`frontend/src/app/manager/appointments/page.tsx`)
- Redirects to `/dashboard/appointments`
- Protected with CASE_MANAGER role
- Dashboard automatically uses ManagerLayout

**Admin Route** (`frontend/src/app/admin/appointments/page.tsx`)
- Redirects to `/dashboard/appointments`
- Protected with SUPER_ADMIN role
- Dashboard automatically uses AdminLayout

#### API Service (`frontend/src/lib/api.ts`)
Added appointment methods:
- `getAppointments(params)` - With optional filters
- `createAppointment(data)` - Including client_phone field
- `updateAppointment(id, data)` - For rescheduling
- `cancelAppointment(id)` - Soft cancel
- `getAppointmentStats()` - For dashboard stats
- `getAvailableAttorneys()` - For booking form
- `getCurrentUser()` - For phone number retrieval

#### Type Definitions (`frontend/src/lib/types.ts`)
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
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  location?: string;
  meeting_link?: string;
  notes?: string;
  client_id: number;
  attorney_id: number;
  case_id?: number;
  duration: number;
  attorney_name?: string;
  client_name?: string;
  case_reference?: string;
  created_at: string;
  updated_at: string;
}
```

## Role-Based Features

### Client Users
1. **Creating Appointments:**
   - Can only create appointments with PENDING status
   - Must wait for manager/admin confirmation
   - Cannot set location (will be provided after confirmation)
   - Cannot see/edit Google Meet link (auto-generated on confirmation)

2. **Phone Appointments:**
   - If no phone number in profile, prompted to enter it
   - Phone number saved with appointment
   - Shows phone number from profile if available

3. **Viewing:**
   - See only their own appointments
   - See appointment status and details
   - Can join video meetings once confirmed

4. **Actions:**
   - Book new appointments
   - Reschedule pending/upcoming appointments
   - Cancel appointments

### Manager/Admin Users
1. **Creating Appointments:**
   - Can create appointments with CONFIRMED status immediately
   - Auto-generates Google Meet link for video appointments
   - Can set location for in-person appointments
   - Full control over all fields

2. **Managing:**
   - See all appointments in the system
   - Can confirm pending appointments (triggers Meet link generation)
   - Can set/edit locations
   - Can reschedule any appointment

3. **Viewing:**
   - Full visibility across all appointments
   - Can see client phone numbers
   - Access to all appointment details

## Workflow Examples

### Example 1: Client Books Video Call
1. Client clicks "Book Appointment"
2. Fills title: "Contract Review"
3. Selects date/time
4. Selects "Video Call" type
5. Selects attorney
6. Sees info message: "Google Meet link will be generated when confirmed"
7. Submits → Status: PENDING
8. Manager confirms → Status: CONFIRMED + Google Meet link auto-generated
9. Client joins meeting via "Join Meeting" button

### Example 2: Manager Books In-Person Meeting
1. Manager clicks "Book Appointment"
2. Fills appointment details
3. Selects "In Person" type
4. Sets location: "1000 Hills Office, Durban"
5. Selects client and attorney
6. Submits → Status: CONFIRMED (immediate)
7. Client sees location in their dashboard

### Example 3: Client Books Phone Call (No Phone in Profile)
1. Client clicks "Book Appointment"
2. Selects "Phone Call" type
3. Form shows phone number field
4. Enters phone: "+27 12 345 6789"
5. Completes other fields
6. Submits with phone number included
7. Attorney can see phone number to make the call

## Database Setup

### Migration Steps
Run the database setup to create the appointments table:

```bash
cd backend
python setup_db_new.py  # Or your migration script
```

### Table Structure
```sql
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    appointment_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    location VARCHAR(500),
    meeting_link VARCHAR(500),
    notes TEXT,
    client_id INTEGER NOT NULL,
    attorney_id INTEGER NOT NULL,
    case_id INTEGER,
    duration INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (attorney_id) REFERENCES users(id),
    FOREIGN KEY (case_id) REFERENCES cases(id)
);
```

## Testing Checklist

### Backend Tests
- [ ] Create appointment as client (PENDING status)
- [ ] Create appointment as manager (CONFIRMED status + Meet link)
- [ ] Update appointment (reschedule)
- [ ] Confirm pending appointment (triggers Meet link)
- [ ] Cancel appointment
- [ ] Get appointments with filters
- [ ] Get stats
- [ ] Get attorneys list
- [ ] Phone number handling for phone appointments

### Frontend Tests
- [ ] Client can access appointments via ClientLayout
- [ ] Manager can access via ManagerLayout
- [ ] Admin can access via AdminLayout
- [ ] Booking modal opens and validates
- [ ] Attorney selection works
- [ ] Date/time selection
- [ ] Appointment type switching shows correct fields
- [ ] Phone prompt appears for clients without phone
- [ ] Location field appears for managers/admins
- [ ] Search filters appointments
- [ ] Status filter works
- [ ] List/Calendar view toggle
- [ ] Join Meeting button opens Google Meet
- [ ] Reschedule populates form correctly
- [ ] Cancel confirmation dialog
- [ ] Stats update after actions

## Future Enhancements

### Google Calendar API Integration
1. Set up Google Cloud Project
2. Enable Calendar API
3. Install packages:
   ```bash
   pip install google-auth google-api-python-client
   ```
4. Update `GoogleMeetService` in `backend/utils/google_meet.py`
5. Add OAuth2 flow for user authentication
6. Create actual Calendar events with real Meet links

### Email Notifications
- Send confirmation emails when appointment confirmed
- Send reminders 24 hours before appointment
- Send cancellation notifications
- Include Meet link in email

### SMS Notifications
- For phone appointments
- Send reminders
- Include dial-in instructions

### Recurring Appointments
- Weekly/monthly appointment support
- Recurring series management

### Availability Management
- Attorney availability calendar
- Prevent double-booking
- Time slot suggestions

### Calendar Sync
- Import from external calendars
- Export to Google Calendar, Outlook, iCal

## File Locations Summary

### Backend
- `backend/models/appointment.py` - Appointment model
- `backend/routes/appointments.py` - API endpoints
- `backend/utils/google_meet.py` - Google Meet service
- `backend/models/user.py` - User model with to_dict()

### Frontend
- `frontend/src/app/dashboard/appointments/page.tsx` - Main appointments page
- `frontend/src/app/manager/appointments/page.tsx` - Manager redirect
- `frontend/src/app/admin/appointments/page.tsx` - Admin redirect
- `frontend/src/components/manager/ManagerLayout.tsx` - Manager nav
- `frontend/src/components/admin/AdminLayout.tsx` - Admin nav
- `frontend/src/lib/api.ts` - API methods
- `frontend/src/lib/types.ts` - Type definitions

## CORS Configuration
Appointments endpoint properly configured in `backend/app_new.py`:
- OPTIONS method handler for preflight requests
- CORS headers on all responses

## Known Issues & Fixes

### Issue 1: Role Enum AttributeError
**Problem:** Code referenced `Role.ADMIN`, `Role.MANAGER`, `Role.ATTORNEY` which don't exist  
**Fix:** Changed all references to:
- `Role.SUPER_ADMIN` (instead of ADMIN)
- `Role.CASE_MANAGER` (instead of MANAGER)
- Removed ATTORNEY references (use CASE_MANAGER)

### Issue 2: Layout Coupling
**Problem:** Original appointments page was hardcoded to ClientLayout  
**Fix:** Implemented dynamic layout selection based on user role in dashboard appointments page

## Support & Maintenance

### Monitoring
- Watch for appointment creation failures
- Monitor Google Meet link generation
- Track cancellation rates
- Review appointment completion rates

### Performance
- Index on client_id, attorney_id, start_datetime
- Cache stats queries
- Paginate appointment lists for users with many appointments

### Security
- Validate appointment ownership on all operations
- Sanitize all input fields
- Rate limit appointment creation
- Validate date/time ranges

## Conclusion
The appointments system is now fully integrated across all dashboards with comprehensive role-based features. Clients, managers, and admins can all manage appointments from their respective dashboards with appropriate permissions and features.
