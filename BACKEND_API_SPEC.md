# Receptionist Dashboard - Backend API Specification

This document outlines the backend API requirements for the clinic/hospital receptionist dashboard system with real-time updates.

## System Architecture

### Frontend to Backend Communication
- **REST API**: All CRUD operations
- **WebSocket**: Real-time updates to receptionist dashboard
- **Database**: Persistent storage of appointments, patients, queue, and waitlist

### Real-time Update Flow
1. Backend processes patient events (check-in, missed, etc.)
2. Backend updates database
3. Backend sends WebSocket updates to:
   - Clinic Dashboard (receptionist)
   - Patient App
   - Any other connected clients

---

## REST API Endpoints

### Appointments

#### GET /api/appointments/today
**Description**: Fetch all appointments for today

**Response**:
```json
[
  {
    "id": "apt-123",
    "patientId": "pat-456",
    "patientName": "John Doe",
    "patientPhone": "+1-555-0123",
    "doctorId": "doc-789",
    "doctorName": "Dr. Sarah Johnson",
    "specialization": "Cardiologist",
    "appointmentTime": "2026-02-14T10:00:00Z",
    "duration": 30,
    "status": "scheduled",
    "checkedInTime": null,
    "notes": "Follow-up consultation"
  }
]
```

#### PATCH /api/appointments/:appointmentId/check-in
**Description**: Mark a patient as checked in

**Request Body**:
```json
{
  "checkedInTime": "2026-02-14T10:05:00Z"
}
```

**Response**:
```json
{
  "id": "apt-123",
  "status": "checked-in",
  "checkedInTime": "2026-02-14T10:05:00Z"
}
```

**Backend Actions**:
1. Update appointment status to "checked-in"
2. Send WebSocket update to clinic dashboard
3. Create queue entry
4. Notify patient app about check-in

#### PATCH /api/appointments/:appointmentId/missed
**Description**: Mark appointment as missed

**Request Body**:
```json
{
  "reason": "Patient did not show up",
  "missedAt": "2026-02-14T10:15:00Z"
}
```

**Response**:
```json
{
  "id": "apt-123",
  "status": "missed",
  "missedAt": "2026-02-14T10:15:00Z"
}
```

**Backend Actions**:
1. Update appointment status to "missed"
2. Create missed patient record
3. Move patient to callback list
4. Send WebSocket notification to clinic dashboard
5. Send notification to patient app

#### PATCH /api/appointments/:appointmentId/status
**Description**: Update appointment status (check-in, in-progress, completed, cancelled)

**Request Body**:
```json
{
  "status": "in-progress"
}
```

**Response**:
```json
{
  "id": "apt-123",
  "status": "in-progress"
}
```

**Backend Actions**:
1. Update appointment status
2. Update queue position
3. Send WebSocket updates

---

### Queue Management

#### GET /api/queue
**Description**: Get current live queue for all doctors/clinics

**Response**:
```json
[
  {
    "id": "queue-123",
    "appointmentId": "apt-123",
    "patientName": "John Doe",
    "doctorName": "Dr. Sarah Johnson",
    "checkedInTime": "2026-02-14T10:05:00Z",
    "estimatedWaitTime": 15,
    "status": "waiting",
    "position": 1
  }
]
```

#### PATCH /api/queue/:appointmentId
**Description**: Update queue status (in-progress, completed)

**Request Body**:
```json
{
  "status": "completed"
}
```

**Backend Actions**:
1. Remove patient from queue
2. Fetch next patient from waitlist if available
3. Update appointment status
4. Broadcast queue update to all connected clients

#### POST /api/queue/refresh
**Description**: Recalculate all queue positions and wait times

**Backend Actions**:
1. Recalculate positions based on check-in time
2. Recalculate estimated wait times
3. Send updated queue to all clients

---

### Waitlist Management

#### GET /api/waitlist
**Description**: Get all patients in waitlist

**Response**:
```json
[
  {
    "id": "wl-123",
    "patientId": "pat-456",
    "patientName": "John Doe",
    "patientPhone": "+1-555-0123",
    "doctorId": "doc-789",
    "doctorName": "Dr. Sarah Johnson",
    "reason": "Consultation for back pain",
    "addedAt": "2026-02-14T09:30:00Z",
    "priority": "high",
    "status": "waiting"
  }
]
```

#### POST /api/waitlist
**Description**: Add a patient to waitlist

**Request Body**:
```json
{
  "patientId": "pat-456",
  "patientName": "John Doe",
  "patientPhone": "+1-555-0123",
  "doctorId": "doc-789",
  "doctorName": "Dr. Sarah Johnson",
  "reason": "Walk-in consultation",
  "priority": "medium",
  "addedAt": "2026-02-14T09:30:00Z",
  "status": "waiting"
}
```

**Response**:
```json
{
  "id": "wl-123",
  "patientId": "pat-456",
  ...
}
```

**Backend Actions**:
1. Create waitlist entry
2. Send notification to patient (SMS/Email/App)
3. Send WebSocket update to clinic dashboard

#### POST /api/waitlist/call-next
**Description**: Call the next patient from waitlist and prepare for appointment

**Response**:
```json
{
  "id": "wl-123",
  "patientId": "pat-456",
  "patientName": "John Doe",
  "status": "called"
}
```

**Backend Actions**:
1. Get first patient from waitlist (sorted by priority, then by time)
2. Mark as "called"
3. Send call notification to patient via SMS/phone
4. Send notification to clinic dashboard
5. Register patient in appointment system if needed

#### DELETE /api/waitlist/:waitlistId
**Description**: Remove patient from waitlist

**Backend Actions**:
1. Delete waitlist entry
2. Send WebSocket update to clinic dashboard

---

### Missed Patients Management

#### GET /api/missed-patients
**Description**: Get all missed patients from today

**Response**:
```json
[
  {
    "id": "missed-123",
    "appointmentId": "apt-123",
    "patientId": "pat-456",
    "patientName": "John Doe",
    "patientPhone": "+1-555-0123",
    "doctorName": "Dr. Sarah Johnson",
    "appointmentTime": "2026-02-14T10:00:00Z",
    "missedAt": "2026-02-14T10:15:00Z",
    "reason": "No show",
    "notificationSent": false
  }
]
```

#### POST /api/missed-patients/:missedPatientId/notify
**Description**: Send notification to missed patient

**Request Body**:
```json
{}
```

**Backend Actions**:
1. Send SMS/Email notification to patient
2. Update notificationSent flag
3. Send WebSocket update to clinic dashboard

#### POST /api/missed-patients/:missedPatientId/reschedule
**Description**: Reschedule missed patient to new time

**Request Body**:
```json
{
  "newDateTime": "2026-02-15T10:00:00Z"
}
```

**Response**:
```json
{
  "appointmentId": "apt-456",
  "patientName": "John Doe",
  "newAppointmentTime": "2026-02-15T10:00:00Z"
}
```

**Backend Actions**:
1. Create new appointment
2. Send notification to patient
3. Update original appointment record
4. Update missed patient record
5. Send WebSocket updates to clinic dashboard and patient app

---

### Analytics & Statistics

#### GET /api/stats
**Description**: Get clinic statistics for today

**Response**:
```json
{
  "totalAppointmentsToday": 20,
  "checkedIn": 15,
  "waitingForCheckIn": 3,
  "inProgress": 2,
  "completed": 10,
  "missedCount": 2,
  "waitlistCount": 5,
  "averageWaitTime": 18
}
```

---

## WebSocket Specification

### Connection URL
```
ws://localhost:3000/realtime/receptionist
ws://localhost:3000/realtime/patient/<patientId>
ws://localhost:3000/realtime/clinic-dashboard
```

### Message Format
```json
{
  "type": "APPOINTMENT_UPDATE | QUEUE_UPDATE | PATIENT_MISSED | WAITLIST_UPDATE",
  "payload": { ...data },
  "timestamp": "2026-02-14T10:05:00Z"
}
```

### WebSocket Events (Server to Client)

#### APPOINTMENT_UPDATE
```json
{
  "type": "APPOINTMENT_UPDATE",
  "payload": {
    "id": "apt-123",
    "status": "checked-in",
    "checkedInTime": "2026-02-14T10:05:00Z"
  }
}
```

#### QUEUE_UPDATE
```json
{
  "type": "QUEUE_UPDATE",
  "payload": [
  {
    "id": "queue-123",
    "appointmentId": "apt-123",
    "patientName": "John Doe",
    "position": 1,
    "status": "waiting",
    "estimatedWaitTime": 15
  }
]
}
```

#### PATIENT_MISSED
```json
{
  "type": "PATIENT_MISSED",
  "payload": {
    "appointmentId": "apt-123",
    "patientName": "John Doe",
    "doctorName": "Dr. Sarah Johnson",
    "missedAt": "2026-02-14T10:15:00Z"
  }
}
```

#### WAITLIST_UPDATE
```json
{
  "type": "WAITLIST_UPDATE",
  "payload": [
  {
    "id": "wl-123",
    "patientName": "John Doe",
    "priority": "high",
    "status": "waiting"
  }
]
}
```

---

## Database Schema

### Appointments Table
```sql
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36),
  patientName VARCHAR(255),
  patientPhone VARCHAR(20),
  doctorId VARCHAR(36),
  doctorName VARCHAR(255),
  specialization VARCHAR(100),
  appointmentTime DATETIME,
  duration INT,
  status ENUM('scheduled', 'checked-in', 'in-progress', 'completed', 'missed', 'cancelled'),
  checkedInTime DATETIME NULL,
  notes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME,
  INDEX idx_status (status),
  INDEX idx_appointmentTime (appointmentTime),
  INDEX idx_patientId (patientId),
  INDEX idx_doctorId (doctorId)
);
```

### Waitlist Table
```sql
CREATE TABLE waitlist (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36),
  patientName VARCHAR(255),
  patientPhone VARCHAR(20),
  doctorId VARCHAR(36),
  doctorName VARCHAR(255),
  reason TEXT,
  addedAt DATETIME,
  priority ENUM('low', 'medium', 'high'),
  status ENUM('waiting', 'called', 'seen', 'cancelled'),
  createdAt DATETIME,
  updatedAt DATETIME,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_addedAt (addedAt)
);
```

### Queue Table
```sql
CREATE TABLE queue (
  id VARCHAR(36) PRIMARY KEY,
  appointmentId VARCHAR(36),
  patientName VARCHAR(255),
  doctorName VARCHAR(255),
  checkedInTime DATETIME,
  estimatedWaitTime INT,
  status ENUM('waiting', 'in-progress', 'completed'),
  position INT,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (appointmentId) REFERENCES appointments(id),
  INDEX idx_status (status),
  INDEX idx_position (position)
);
```

### Missed Patients Table
```sql
CREATE TABLE missed_patients (
  id VARCHAR(36) PRIMARY KEY,
  appointmentId VARCHAR(36),
  patientId VARCHAR(36),
  patientName VARCHAR(255),
  patientPhone VARCHAR(20),
  doctorName VARCHAR(255),
  appointmentTime DATETIME,
  missedAt DATETIME,
  reason TEXT,
  notificationSent BOOLEAN DEFAULT FALSE,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (appointmentId) REFERENCES appointments(id),
  FOREIGN KEY (patientId) REFERENCES patients(id),
  INDEX idx_patientId (patientId),
  INDEX idx_missedAt (missedAt)
);
```

---

## Implementation Notes

### Real-time Synchronization
1. Receptionist checks in a patient
2. Backend updates appointment status
3. Backend sends WebSocket update to:
   - Clinic dashboard (receptionist UI)
   - Patient app (patient waits to see their status)
4. Both UIs update in real-time without page refresh

### Auto-refresh Fallback
- If WebSocket is unavailable, frontend falls back to polling
- Polling interval: 30 seconds (configurable)
- This ensures the dashboard updates even without WebSocket support

### Error Handling
- All endpoints should return appropriate HTTP status codes
- 400: Bad Request
- 404: Not Found
- 500: Server Error
- Include error message in response body

### Authentication
- All endpoints should require authentication (Bearer token)
- Token should be included in Authorization header
- Validate user role (receptionist, doctor, admin, patient)

### Rate Limiting
- Implement rate limiting to prevent abuse
- Suggested: 100 requests per minute per user

---

## Testing Checklist

- [ ] Patient can check in before appointment time
- [ ] System automatically marks patient as missed after 15 minutes
- [ ] Receptionist can manually mark patient as missed with reason
- [ ] Missed patient notifications are sent
- [ ] Patients can be rescheduled
- [ ] Waitlist patients can be called
- [ ] Queue updates in real-time as patients move through system
- [ ] Stats update correctly as appointments progress
- [ ] WebSocket updates work for all event types
- [ ] Polling falls back correctly when WebSocket is unavailable
- [ ] System handles concurrent requests correctly
- [ ] Patient app receives real-time updates

