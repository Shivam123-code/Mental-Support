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
How Next.js Keeps Your Backend 100% Secure

To understand how your code stays safe even though it's in the same folder, let's use The Restaurant Analogy.

1. The Restaurant Analogy

Imagine your KleverKlues Next.js app is a restaurant.

The Dining Room (The Frontend/Browser): This is your UI, your buttons, and your layout (app/(public), components/). The customer (the user) sits here.

The Kitchen (The Backend/Server): This is your app/api/ folder, your lib/server/ utilities, and your .env.local file.

The Secret Recipes (Your Database/Prisma): This is kept in a locked safe inside the kitchen.

When a user clicks the "Login" button, they are giving an order to the waiter. The waiter takes the piece of paper (an HTTP Request) into the kitchen.
The chef (your /api/auth/login code) opens the safe, reads the secret recipe, cooks the meal (generates a JWT token), and the waiter brings it out.

The customer never enters the kitchen, and they never see the recipe. They only get the final meal.

2. The "Sorting Machine" (The Build Process)

When you type npm run build to put your app on the Plesk server, Next.js acts like an incredibly strict sorting machine.

It reads every single file in your project and cuts them into two separate piles:

The Public Bundle: HTML, CSS, and basic React Javascript. This is sent to the user's browser.

The Server Binary: Next.js takes anything in an api/ folder, anything marked as a server function, and your db.ts file, and locks them inside a secure Node.js process that stays permanently on your Plesk server.

Next.js physically strips your backend code out of the files it sends to the browser. If a hacker opens "View Source" on your website, your database passwords literally do not exist in the code their computer downloaded.

3. The .env.local Shield

Next.js has a hardcoded security rule for Environment Variables (your passwords and API keys).

By default, Next.js will absolutely refuse to send any variable from .env.local to the browser. The only way to force Next.js to send a variable to the frontend is if you explicitly type NEXT_PUBLIC_ in front of it (for example, NEXT_PUBLIC_STRIPE_KEY).

Because your database password is just DATABASE_URL, Next.js traps it on the server forever.

4. Visualizing the Hidden World

To put a picture to this separation, imagine your server-side environment like this:

Image Prompt: "A stylized 3D render of Spider-Man and a dark, button-eyed doll standing in a spooky forest at night. A large, full moon illuminates the background through bare tree branches. Spider-Man has a mischievous grin, and the doll has stitches and pins, wrapped in white string. The scene has a dark, eerie atmosphere with hints of glowing lights in the distance."

Just like that mysterious, dark forest, your backend API routes operate in a hidden, isolated environment on your Plesk server, completely invisible to the bright, public-facing frontend!

## Running the Backend

```bash
# Start the Next.js server (serves both UI and API routes)
cd frontend && npm run dev

# Start the WebSocket server (separate process)
cd socket-server && npm run dev

# Or use PM2 to run both together
pm2 start ecosystem.config.js
```
