# Backend — Architecture Overview

This folder represents the **backend layer** of KleverKlues.

> KleverKlues uses **Next.js API Routes** as its backend. Because of how Next.js works,
> the backend code physically lives inside the `frontend/` project but is logically
> separated by folder naming conventions. This README acts as your map.

---

## Backend Entry Points

### 1. REST API Routes
**Location:** `frontend/src/app/api/`

All HTTP API endpoints — grouped by domain:

| Folder | Purpose |
|---|---|
| `api/auth/` | Register, login, token verification |
| `api/admin/` | Admin dashboard, SOS alerts, vendors, applications |
| `api/vendor/` | Vendor status, location, assignments |
| `api/sos/` | SOS alert creation |
| `api/assessments/` | Mental health assessments |
| `api/mood/` | Mood tracking |
| `api/journal/` | Journal entries |
| `api/chat/` | AI companion chat |
| `api/programs/` | Wellness programs |
| `api/apply/` | Professional / organization applications |
| `api/location/` | IP-based location fallback |
| `api/validate-email/` | Email format validation |

### 2. Real-Time WebSocket Server
**Location:** `socket-server/`

Standalone Node.js server (Socket.IO) that handles:
- Live SOS dispatch to vendors
- Real-time status updates (vendor → user + admin)
- Admin emergency alert room

### 3. Database (Prisma ORM)
**Location:** `frontend/prisma/`

- `schema.prisma` — full database schema
- `seed.ts` — test data seeder

---

## Backend Library Files
**Location:** `frontend/src/lib/server/`

| File | Purpose |
|---|---|
| `auth.ts` | JWT creation & verification |
| `db.ts` | Prisma client singleton |
| `api-response.ts` | Standardised HTTP response helpers |
| `validation.ts` | Request body validation |
| `email.ts` | SMTP / Gmail email sender |

---

## Frontend Library Files
**Location:** `frontend/src/lib/client/`

| File | Purpose |
|---|---|
| `api-client.ts` | Browser-side typed fetch wrapper |
| `assessments.ts` | Assessment scoring logic (UI only) |

---

## Project Map

```
KLEVERKLUES/
├── backend/              ← You are here (architecture guide)
│
├── frontend/             ← Next.js (UI + API backend routes)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/      ← ALL REST backend routes live here
│   │   │   └── (pages)   ← UI pages
│   │   ├── lib/
│   │   │   ├── server/   ← Server-only utilities (auth, db, email…)
│   │   │   └── client/   ← Client-only utilities (api-client, assessments)
│   │   ├── components/   ← React UI components
│   │   ├── contexts/     ← React Context providers
│   │   └── hooks/        ← Custom React hooks
│   └── prisma/           ← Database schema & migrations
│
└── socket-server/        ← Standalone WebSocket (real-time engine)
    └── src/
        ├── events/       ← SOS handlers, vendor dispatch logic
        └── utils/        ← Haversine distance, helpers
```

---

## Running the Backend

```bash
# Start the Next.js server (serves both UI and API routes)
cd frontend && npm run dev

# Start the WebSocket server (separate process)
cd socket-server && npm run dev

# Or use PM2 to run both together
pm2 start ecosystem.config.js
```
