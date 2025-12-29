# Manager & Admin Appointment Management Pages

## Overview
Created dedicated appointment management interfaces for Case Managers and Super Admins to oversee and manage all appointments in the system.

## Features Implemented

### Manager Appointments Page (`/manager/appointments`)

**Capabilities:**
- ✅ View all appointments in the system (not just their own)
- ✅ Confirm pending appointments (triggers Google Meet link generation)
- ✅ Edit appointment details (location, notes, status)
- ✅ Cancel appointments
- ✅ Search and filter appointments
- ✅ Real-time statistics dashboard

**Key Actions:**
1. **Confirm** - Changes pending appointments to confirmed status
   - Auto-generates Google Meet link for video appointments
   - One-click confirmation with dialog
   
2. **Edit** - Opens modal to update:
   - Status (pending/confirmed/completed/cancelled)
   - Location (for in-person appointments)
   - Notes
   
3. **Cancel** - Soft delete (changes status to cancelled)

**UI Features:**
- Stats cards: Pending, Upcoming, This Month, Completed
- Search by: client name, attorney name, case reference, title
- Filter by status: all, pending, confirmed, completed, cancelled
- Detailed appointment cards showing:
  - Client and attorney names
  - Date, time, and duration
  - Appointment type with icons
  - Location (for in-person)
  - Meeting link (for video)
  - Case reference
  - Notes

### Admin Appointments Page (`/admin/appointments`)

**Enhanced Capabilities (All Manager features plus):**
- ✅ **Delete appointments** permanently (hard delete)
- ✅ Full system oversight
- ✅ Advanced management controls

**Key Actions:**
1. **Confirm** - Same as manager
2. **Edit** - Same as manager
3. **Cancel** - Soft cancel (orange button)
4. **Delete** - **Permanent deletion** (red button with Trash icon)
   - Confirmation dialog warns it's irreversible
   - Removes appointment from database entirely

**UI Differences from Manager:**
- Additional "Delete" button with Trash2 icon
- Different color scheme for cancel (orange) vs delete (red)
- More authoritative language ("Manage All Appointments")
- "Complete oversight" subtitle

## Technical Implementation

### Manager Page Structure
```typescript
/manager/appointments/page.tsx
├── ManagerAppointmentsContent (main component)
│   ├── State Management
│   │   ├── appointments (all appointments)
│   │   ├── filteredAppointments (search/filter results)
│   │   ├── stats (dashboard metrics)
│   │   ├── selectedAppointment (for editing)
│   │   └── editForm (modal state)
│   ├── API Calls
│   │   ├── fetchAppointments()
│   │   ├── fetchStats()
│   │   ├── handleConfirmAppointment()
│   │   ├── handleCancelAppointment()
│   │   └── handleUpdateAppointment()
│   └── UI Components
│       ├── Stats Dashboard (4 cards)
│       ├── Search & Filter Bar
│       ├── Appointments List
│       └── Edit Modal
└── ProtectedRoute wrapper (CASE_MANAGER role)
```

### Admin Page Structure
```typescript
/admin/appointments/page.tsx
├── AdminAppointmentsContent (main component)
│   ├── Same as Manager plus:
│   │   └── handleDeleteAppointment() - NEW
│   └── UI Components
│       └── Delete button in action menu - NEW
└── ProtectedRoute wrapper (SUPER_ADMIN role)
```

### API Methods Used
```typescript
// From frontend/src/lib/api.ts
api.getAppointments()           // Fetch all appointments
api.getAppointmentStats()       // Get dashboard stats
api.updateAppointment(id, data) // Update appointment details
api.cancelAppointment(id)       // Soft cancel (status change)
api.deleteAppointment(id)       // Hard delete (admin only)
```

### Backend Endpoints
```python
# From backend/routes/appointments.py
GET    /api/appointments          # List all (filtered by user role)
PUT    /api/appointments/<id>     # Update appointment
POST   /api/appointments/<id>/cancel  # Cancel appointment
DELETE /api/appointments/<id>     # Delete permanently
GET    /api/appointments/stats    # Get statistics
```

## User Workflows

### Workflow 1: Manager Confirms Pending Appointment
1. Manager navigates to `/manager/appointments`
2. Sees "Pending Approval" count on stats dashboard
3. Filters by "Pending" status
4. Reviews appointment details
5. Clicks "Confirm" button
6. Confirms in dialog
7. Backend:
   - Updates status to CONFIRMED
   - Auto-generates Google Meet link (if video appointment)
8. Stats refresh, appointment moves to "Upcoming"

### Workflow 2: Admin Edits Appointment Location
1. Admin navigates to `/admin/appointments`
2. Searches for specific client or case
3. Clicks "Edit" on appointment card
4. Modal opens with current details
5. Updates location field
6. Adds notes about the meeting venue
7. Clicks "Update Appointment"
8. Changes saved and reflected immediately

### Workflow 3: Admin Deletes Spam Appointment
1. Admin sees suspicious/spam appointment
2. Clicks "Delete" button (red with trash icon)
3. Confirmation dialog warns about permanent deletion
4. Confirms deletion
5. Appointment removed from database
6. Stats and list updated

## Status Badge System

**Visual Indicators:**
```typescript
{
  confirmed: { 
    bg: 'bg-green-100', 
    text: 'text-green-800', 
    icon: CheckCircle 
  },
  pending: { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-800', 
    icon: Clock 
  },
  cancelled: { 
    bg: 'bg-red-100', 
    text: 'text-red-800', 
    icon: XCircle 
  },
  completed: { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800', 
    icon: Check 
  },
  rescheduled: { 
    bg: 'bg-purple-100', 
    text: 'text-purple-800', 
    icon: Clock 
  }
}
```

## Appointment Type Icons

```typescript
{
  video: <Video className="w-4 h-4 text-blue-600" />,
  in_person: <MapPin className="w-4 h-4 text-green-600" />,
  phone: <Phone className="w-4 h-4 text-purple-600" />
}
```

## Action Button Hierarchy

### Manager Actions (in order):
1. **Confirm** (green) - Only for pending appointments
2. **Edit** (outline) - Available for all
3. **Cancel** (outline, red text) - Available for non-cancelled

### Admin Actions (in order):
1. **Confirm** (green) - Only for pending appointments
2. **Edit** (outline) - Available for all
3. **Cancel** (outline, orange text) - Available for non-cancelled
4. **Delete** (outline, red text) - Always available

## Edit Modal Features

**Read-Only Section:**
- Appointment title
- Client name
- Date and time

**Editable Fields:**
- **Status dropdown:** pending, confirmed, completed, cancelled
- **Location field:** Only shown for in-person appointments
- **Notes textarea:** Free-form notes about the appointment

**Validation:**
- Status change to CONFIRMED triggers Meet link generation
- Location only required for in-person appointments

## Search Functionality

**Searches across:**
- Appointment title
- Client name
- Attorney name
- Case reference

**Implementation:**
```typescript
filtered = filtered.filter(
  (apt) =>
    apt.title.toLowerCase().includes(query) ||
    apt.client_name?.toLowerCase().includes(query) ||
    apt.attorney_name?.toLowerCase().includes(query) ||
    apt.case_reference?.toLowerCase().includes(query)
);
```

## Filter Options

**Status Filter:**
- All Status (default)
- Pending
- Confirmed
- Completed
- Cancelled

Applied in real-time as user types/selects.

## Statistics Dashboard

**Four Key Metrics:**

1. **Pending Approval** (yellow)
   - Count of appointments awaiting confirmation
   - Most actionable metric for managers

2. **Upcoming** (blue)
   - Confirmed appointments in the future
   - Helps with workload planning

3. **This Month** (green)
   - All appointments this calendar month
   - Activity overview

4. **Completed** (gray)
   - Historical record
   - Success metric

## Responsive Design

**Mobile Optimization:**
- Stats grid: 1 column on mobile, 4 on desktop
- Search/filter: Stack vertically on mobile
- Appointment cards: Single column, optimized spacing
- Action buttons: Stack vertically in cards
- Modal: Full-screen on mobile, centered on desktop

## Performance Considerations

**Optimization Strategies:**
1. **Client-side filtering** - Fast, no network requests
2. **Memoized date formatting** - Prevents recalculation
3. **Conditional rendering** - Only show relevant buttons
4. **Optimistic UI updates** - Immediate feedback
5. **Batch operations** - Fetch all data in one request

## Security & Permissions

**Manager Access:**
- Can view all appointments
- Can confirm/edit/cancel
- Cannot delete permanently
- Protected by CASE_MANAGER role

**Admin Access:**
- Full CRUD permissions
- Can permanently delete
- System-wide oversight
- Protected by SUPER_ADMIN role

**Backend Validation:**
- All role checks done server-side
- Token validation on every request
- Ownership verification for sensitive operations

## Error Handling

**User-Friendly Messages:**
- "Failed to load appointments" - Network/fetch error
- "Failed to confirm appointment" - Update error
- "Failed to cancel appointment" - Cancel error
- "Failed to update appointment" - Edit error
- "Failed to delete appointment" - Delete error (admin only)

**Error Display:**
- Red alert banner at top of page
- Dismissible with X button
- Shows actual error message
- Auto-clears on successful operation

## Future Enhancements

### Potential Additions:
1. **Bulk Actions** - Select multiple, confirm/cancel in batch
2. **Export Functionality** - Download appointments as CSV/PDF
3. **Calendar Integration** - Sync with external calendars
4. **Email Notifications** - Auto-notify on status changes
5. **Audit Log** - Track who changed what and when
6. **Advanced Filters** - Date range, attorney, appointment type
7. **Sorting** - By date, client, status
8. **Pagination** - For users with many appointments
9. **Appointment Templates** - Quick booking for common types
10. **Bulk Reschedule** - Move multiple appointments at once

## Testing Checklist

### Manager Page Tests:
- [ ] View all appointments (including other users')
- [ ] Confirm pending appointment
- [ ] Verify Google Meet link generated after confirmation
- [ ] Edit appointment location
- [ ] Edit appointment notes
- [ ] Change appointment status
- [ ] Cancel appointment
- [ ] Search by client name
- [ ] Search by attorney name
- [ ] Filter by status
- [ ] Stats update after actions
- [ ] Modal opens and closes correctly
- [ ] Responsive layout on mobile

### Admin Page Tests:
- [ ] All manager tests pass
- [ ] Delete appointment permanently
- [ ] Verify appointment removed from database
- [ ] Confirm delete has warning dialog
- [ ] Delete button has red styling
- [ ] Cancel vs Delete buttons distinct

### Integration Tests:
- [ ] Manager cannot delete (no delete button shown)
- [ ] Admin can delete
- [ ] Backend enforces role permissions
- [ ] Stats accurate across all pages
- [ ] Real-time updates work correctly

## File Locations

**Manager Page:**
```
frontend/src/app/manager/appointments/page.tsx
```

**Admin Page:**
```
frontend/src/app/admin/appointments/page.tsx
```

**API Service:**
```
frontend/src/lib/api.ts
- getAppointments()
- updateAppointment()
- cancelAppointment()
- deleteAppointment()
- getAppointmentStats()
```

**Backend Routes:**
```
backend/routes/appointments.py
- GET /api/appointments
- PUT /api/appointments/<id>
- DELETE /api/appointments/<id>
- POST /api/appointments/<id>/cancel
- GET /api/appointments/stats
```

## Navigation

**Manager Dashboard:**
- Main navigation item: "Appointments"
- Icon: CalendarCheck
- Route: `/manager/appointments`

**Admin Dashboard:**
- Location: Management section
- Icon: CalendarCheck
- Route: `/admin/appointments`

## Summary

Both Manager and Admin appointment management pages provide comprehensive oversight of the appointment system with role-appropriate permissions. Managers can confirm, edit, and cancel appointments, while Admins have additional power to permanently delete appointments. The interfaces are intuitive, feature-rich, and optimized for efficient appointment management.
