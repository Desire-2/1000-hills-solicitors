# Appointment System Enhancements - Role-Based Features

## Overview

The appointment system has been enhanced with role-based features that provide different experiences for clients vs. managers/administrators. The system now intelligently handles Google Meet generation, location settings, and phone number management.

## Key Enhancements

### 1. Auto-Generated Google Meet Links (Managers/Admins Only)

**How It Works:**
- Google Meet links are **automatically generated** when an appointment is confirmed
- Only managers (CASE_MANAGER) and super admins (SUPER_ADMIN) can confirm appointments
- Links are generated when:
  - Status changes from any state to "CONFIRMED"
  - Appointment type is "VIDEO"
  
**Backend Implementation:**
```python
# In create_appointment endpoint
if appointment_type == AppointmentType.VIDEO and initial_status == AppointmentStatus.CONFIRMED:
    appointment.meeting_link = generate_google_meet_link(appointment.id)

# In update_appointment endpoint  
if new_status == AppointmentStatus.CONFIRMED and old_status != AppointmentStatus.CONFIRMED:
    if appointment.appointment_type == AppointmentType.VIDEO and not appointment.meeting_link:
        appointment.meeting_link = generate_google_meet_link(appointment.id)
```

**User Experience:**
- Clients book video appointments → Status: PENDING
- Manager/Admin confirms → Google Meet link auto-generated
- Client receives Google Meet link automatically

### 2. Location Management (Managers/Admins Only)

**How It Works:**
- Only managers and admins can set location for in-person appointments
- Clients cannot see or edit location field
- Location is set during appointment confirmation

**Frontend:**
```tsx
{/* Location - Only for managers/admins and in-person appointments */}
{isManagerOrAdmin && bookingForm.appointment_type === 'in_person' && (
  <div>
    <label>Location *</label>
    <input type="text" required value={bookingForm.location} />
  </div>
)}
```

**Client View:**
- Info message: "The location will be provided by the attorney after confirmation"
- No location input field visible

### 3. Phone Number Handling (Smart Detection)

**How It Works:**
- System checks if client has phone number in profile
- If no phone number exists, prompts client to enter it
- Phone number is saved to user profile for future appointments

**Frontend Logic:**
```tsx
// Check for phone appointment without phone number
if (bookingForm.appointment_type === AppointmentType.PHONE && 
    user?.role === Role.CLIENT && 
    !userPhone && 
    !bookingForm.client_phone) {
  setShowPhonePrompt(true);
  return;
}
```

**User Experience:**

**With Existing Phone Number:**
```
┌─────────────────────────────────┐
│ Phone: +27 12 345 6789         │
│ [Use different number]          │
└─────────────────────────────────┘
```

**Without Phone Number:**
```
┌─────────────────────────────────┐
│ Your Phone Number *             │
│ ┌───────────────────────────┐  │
│ │ e.g., +27 12 345 6789     │  │
│ └───────────────────────────┘  │
│ We'll use this number to call  │
│ you for the appointment        │
└─────────────────────────────────┘
```

### 4. Contextual Information Messages

**Client-Side Information:**

**Video Call:**
```
✓ Google Meet link will be generated automatically when your appointment is confirmed
```

**In-Person:**
```
📍 The location will be provided by the attorney after confirmation
```

**Phone Call:**
```
📞 The attorney will call you at the scheduled time
```

## Role-Based Permissions

### CLIENT
- ✅ Can book appointments (all types)
- ✅ Can select appointment type
- ✅ Can provide phone number for calls
- ❌ Cannot set location
- ❌ Cannot see Google Meet generation
- ❌ Cannot directly confirm appointments
- 📊 Creates appointments with status: PENDING

### CASE_MANAGER & SUPER_ADMIN
- ✅ Can book appointments for clients
- ✅ Can confirm appointments
- ✅ Can set location for in-person meetings
- ✅ Can see all appointment details
- ✅ Auto-generates Google Meet on confirmation
- 📊 Creates appointments with status: CONFIRMED

## Backend Changes

### 1. Appointment Routes (`backend/routes/appointments.py`)

**Enhanced Create Endpoint:**
- Determines initial status based on user role
- Clients create PENDING appointments
- Managers/Admins can create CONFIRMED appointments
- Auto-generates Google Meet for confirmed video appointments
- Handles client phone number for phone appointments
- Only managers/admins can set location

**Enhanced Update Endpoint:**
- Auto-generates Google Meet when status changes to CONFIRMED
- Updates client phone number if provided
- Restricts location updates to managers/admins

### 2. User Model (`backend/models/user.py`)

**Added to_dict method:**
```python
def to_dict(self):
    return {
        'id': self.id,
        'email': self.email,
        'name': self.name,
        'phone': self.phone,  # Now exposed in API
        'role': self.role.value,
        'email_verified': self.email_verified,
        'created_at': self.created_at.isoformat(),
    }
```

## Frontend Changes

### 1. Appointments Page (`frontend/src/app/dashboard/appointments/page.tsx`)

**New State Variables:**
```tsx
const [userPhone, setUserPhone] = useState('');
const [showPhonePrompt, setShowPhonePrompt] = useState(false);
const isManagerOrAdmin = user?.role === Role.SUPER_ADMIN || user?.role === Role.CASE_MANAGER;
```

**New Functions:**
- `fetchUserPhone()` - Gets user's phone number from profile
- Enhanced `handleBookAppointment()` - Validates phone number for phone appointments

**Conditional Rendering:**
- Location field only shows for managers/admins with in-person appointments
- Phone field only shows for clients without saved phone number
- Contextual info messages based on appointment type and role

### 2. API Service (`frontend/src/lib/api.ts`)

**Updated Types:**
```typescript
async createAppointment(appointmentData: {
  // ... existing fields
  client_phone?: string;  // NEW
})

async updateAppointment(appointmentId: number, updates: {
  // ... existing fields
  client_phone?: string;  // NEW
})
```

## Workflow Examples

### Example 1: Client Books Video Call

1. **Client Action:**
   - Fills form (title, date/time, attorney)
   - Selects "Video Call"
   - Sees message: "Google Meet link will be generated automatically when your appointment is confirmed"
   - Submits → Status: PENDING

2. **Manager Action:**
   - Reviews appointment request
   - Changes status to CONFIRMED
   - System automatically generates Google Meet link

3. **Result:**
   - Client can now see "Join Meeting" button
   - Clicking opens Google Meet in new tab

### Example 2: Client Books Phone Call (No Phone Number)

1. **Client Action:**
   - Selects "Phone Call"
   - System detects no phone number in profile
   - Shows phone number input field
   - Client enters: +27 12 345 6789
   - Submits appointment

2. **Backend Action:**
   - Saves appointment
   - Updates user profile with phone number

3. **Future Bookings:**
   - System shows saved phone number
   - Client can use saved number or enter new one

### Example 3: Manager Books In-Person Meeting

1. **Manager Action:**
   - Books appointment for client
   - Selects "In Person"
   - Sets location: "1000 Hills Office, Main Building"
   - Confirms immediately → Status: CONFIRMED

2. **Client View:**
   - Sees confirmed appointment
   - Location is visible: "1000 Hills Office, Main Building"

## Testing Checklist

### Client User Tests
- [ ] Book video appointment (should be PENDING)
- [ ] Book phone appointment without phone number (should prompt)
- [ ] Book phone appointment with phone number (should use saved)
- [ ] Book in-person appointment (no location field visible)
- [ ] Verify info messages appear correctly
- [ ] Cannot confirm own appointments

### Manager/Admin Tests
- [ ] Confirm pending appointment (verify Google Meet generated)
- [ ] Book video appointment directly (should be CONFIRMED with Meet link)
- [ ] Set location for in-person appointment
- [ ] View client's phone number for phone appointments
- [ ] Verify can see all appointment fields

### System Tests
- [ ] Google Meet link generates on confirmation
- [ ] Phone number saves to user profile
- [ ] Location only editable by managers/admins
- [ ] Role-based field visibility works
- [ ] Appointment status changes correctly

## Database Schema

**No new tables needed!** Uses existing:
- `users.phone` - Already exists
- `appointments.meeting_link` - Already exists
- `appointments.location` - Already exists
- `appointments.status` - Already exists

## API Changes Summary

### New Request Parameters

**POST /api/appointments**
```json
{
  "title": "Consultation",
  "start_datetime": "2025-01-20T10:00:00",
  "end_datetime": "2025-01-20T11:00:00",
  "appointment_type": "phone",
  "attorney_id": 2,
  "client_phone": "+27 12 345 6789"  // NEW - Optional
}
```

**PUT /api/appointments/:id**
```json
{
  "status": "confirmed",  // Triggers Google Meet generation
  "client_phone": "+27 12 345 6789"  // NEW - Optional
}
```

### Response Changes

**GET /api/auth/me** (getCurrentUser)
```json
{
  "id": 1,
  "email": "client@example.com",
  "name": "John Doe",
  "phone": "+27 12 345 6789",  // NOW INCLUDED
  "role": "CLIENT"
}
```

## Security Considerations

1. **Role Validation:** Backend validates user role before allowing actions
2. **Location Protection:** Only managers/admins can set location
3. **Status Changes:** Only authorized roles can confirm appointments
4. **Phone Privacy:** Phone numbers only accessible to appointment participants

## Future Enhancements

1. **Email Notifications:**
   - Send email when appointment confirmed with Google Meet link
   - Reminder emails with meeting details

2. **SMS Notifications:**
   - Send SMS for phone appointments
   - Reminder texts before scheduled time

3. **Calendar Integration:**
   - Sync with Google Calendar
   - Send .ics calendar invites

4. **Real Google Meet API:**
   - Replace placeholder with actual Google Calendar API
   - Get real Google Meet conference rooms

---

**Last Updated:** December 19, 2025  
**Version:** 2.0.0
