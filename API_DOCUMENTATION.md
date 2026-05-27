# KleverKlues API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get the token from the `/auth/login` or `/auth/register` response.

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

---

### Login
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "demo@kleverklues.com",
  "password": "Demo@123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "demo@kleverklues.com",
      "firstName": "Demo",
      "lastName": "User",
      "role": "USER",
      "status": "ACTIVE",
      "profile": { ... }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

### Get Current User
**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "email": "demo@kleverklues.com",
    "firstName": "Demo",
    "lastName": "User",
    "role": "USER",
    "profile": { ... }
  }
}
```

---

### Logout
**POST** `/auth/logout`

Invalidate the current session token.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 📊 Assessment Endpoints

### Get User Assessments
**GET** `/assessments`

Retrieve all assessment results for the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "assessmentType": "ANXIETY_INDEX",
      "score": 12,
      "maxScore": 16,
      "percentage": 75,
      "level": "High",
      "insights": {
        "level": "High",
        "recommendations": [...],
        "nextSteps": [...]
      },
      "completedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Submit Assessment
**POST** `/assessments`

Submit a completed assessment.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "assessmentType": "ANXIETY_INDEX",
  "answers": {
    "q1": { "text": "Frequently", "score": 3 },
    "q2": { "text": "Moderately intense", "score": 3 },
    "q3": { "text": "Difficult", "score": 3 },
    "q4": { "text": "3 to 4 times a week", "score": 3 }
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "assessmentType": "ANXIETY_INDEX",
    "score": 12,
    "maxScore": 16,
    "percentage": 75,
    "level": "High",
    "insights": { ... },
    "completedAt": "2025-01-15T10:00:00.000Z"
  },
  "message": "Assessment submitted successfully"
}
```

---

## 🎯 Program Endpoints

### Get User Programs
**GET** `/programs`

Get all program enrollments for the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "programType": "ANXIETY_RESET",
      "status": "ACTIVE",
      "currentWeek": 2,
      "completedWeeks": 1,
      "progressPercent": 25,
      "startedAt": "2025-01-10T10:00:00.000Z",
      "activities": [...]
    }
  ]
}
```

---

### Enroll in Program
**POST** `/programs`

Enroll the user in a wellbeing program.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "programType": "ANXIETY_RESET"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "programType": "ANXIETY_RESET",
    "status": "ACTIVE",
    "currentWeek": 1,
    "progressPercent": 0,
    "startedAt": "2025-01-15T10:00:00.000Z"
  },
  "message": "Enrolled successfully"
}
```

---

## 😊 Mood Tracking Endpoints

### Get Mood Logs
**GET** `/mood?days=30`

Get mood logs for the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `days` (optional): Number of days to retrieve (default: 30)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "mood": "anxious",
      "intensity": 7,
      "notes": "Feeling anxious about work",
      "triggers": ["work", "deadline"],
      "activities": ["meditation"],
      "loggedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Log Mood
**POST** `/mood`

Create a new mood log entry.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "mood": "anxious",
  "intensity": 7,
  "notes": "Feeling anxious about work presentation",
  "triggers": ["work", "public speaking"],
  "activities": ["breathing exercises", "meditation"]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "mood": "anxious",
    "intensity": 7,
    "notes": "Feeling anxious about work presentation",
    "triggers": ["work", "public speaking"],
    "activities": ["breathing exercises", "meditation"],
    "loggedAt": "2025-01-15T10:00:00.000Z"
  },
  "message": "Mood logged successfully"
}
```

---

## 📝 Journal Endpoints

### Get Journal Entries
**GET** `/journal?limit=20&offset=0`

Get journal entries for the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `limit` (optional): Number of entries to retrieve (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "clx...",
        "title": "Today's Reflection",
        "content": "I felt much better today after...",
        "mood": "hopeful",
        "tags": ["progress", "gratitude"],
        "isPrivate": true,
        "createdAt": "2025-01-15T10:00:00.000Z"
      }
    ],
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

---

### Create Journal Entry
**POST** `/journal`

Create a new journal entry.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "title": "Today's Reflection",
  "content": "I felt much better today after practicing mindfulness...",
  "mood": "hopeful",
  "tags": ["progress", "gratitude"],
  "isPrivate": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "Today's Reflection",
    "content": "I felt much better today after...",
    "mood": "hopeful",
    "tags": ["progress", "gratitude"],
    "isPrivate": true,
    "createdAt": "2025-01-15T10:00:00.000Z"
  },
  "message": "Journal entry created"
}
```

---

## 🤖 AI Chat Endpoint

### Chat with AI Companion
**POST** `/chat`

Send a message to the AI companion.

**Request Body:**
```json
{
  "message": "I'm feeling anxious today",
  "context": {
    "mood": "anxious",
    "recentAssessments": [...]
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "response": "I understand you're feeling anxious...",
    "suggestions": [...]
  }
}
```

---

## ❌ Error Responses

All endpoints may return error responses in this format:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid input data"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📋 Enum Values

### UserRole
- `USER` - Regular user
- `PROFESSIONAL` - Therapist/counselor
- `ADMIN` - Platform administrator
- `ENTERPRISE` - Organization account

### AssessmentType
- `ANXIETY_INDEX`
- `BURNOUT_METER`
- `RELATIONSHIP_WELLNESS`
- `LEADERSHIP_EQ`
- `EMOTIONAL_WELLNESS`
- `WORKPLACE_WELLNESS`
- `STUDENT_WELLNESS`

### ProgramType
- `BURNOUT_RECOVERY`
- `ANXIETY_RESET`
- `SLEEP_RECOVERY`
- `EMOTIONAL_HEALING`
- `CONFIDENCE_REBUILD`
- `PARENTING_CONFIDENCE`
- `FOCUS_IMPROVEMENT`
- `RELATIONSHIP_HEALING`

---

## 🔧 Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## 🚀 Next Steps

1. Implement booking endpoints
2. Add community post endpoints
3. Add messaging endpoints
4. Add notification endpoints
5. Implement WebSocket for real-time features
6. Add file upload for avatars
7. Implement email verification
8. Add password reset functionality

---

## 📞 Support

For API issues or questions, contact the development team.
