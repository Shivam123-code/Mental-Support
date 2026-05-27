# 🚀 WebSocket + PostGIS Quick Start Guide

## TL;DR - Get Running in 15 Minutes

### Step 1: Enable PostGIS (2 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres -d kleverklues

# Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

# Verify
SELECT PostGIS_Version();
```

### Step 2: Install Dependencies (1 minute)

```bash
cd frontend
npm install socket.io express cors
npm install -D @types/express @types/cors concurrently
```

### Step 3: Update Prisma Schema (2 minutes)

Add to `prisma/schema.prisma`:

```prisma
model Hospital {
  id          String   @id @default(cuid())
  name        String
  address     String
  phone       String
  latitude    Float
  longitude   Float
  location    Unsupported("geometry(Point, 4326)")?
  hasER       Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  @@index([latitude, longitude])
}

model EmergencyAlert {
  id              String   @id @default(cuid())
  userId          String
  latitude        Float
  longitude       Float
  location        Unsupported("geometry(Point, 4326)")?
  severity        String
  status          String   @default("ACTIVE")
  createdAt       DateTime @default(now())
  
  @@index([status])
}
```

### Step 4: Run Migration (1 minute)

```bash
npm run db:migrate
# Name it: "add_postgis_support"
```

### Step 5: Create Files (5 minutes)

**Copy these 3 files from ARCHITECTURE_GUIDE.md:**

1. `socket-server/index.ts` - WebSocket server
2. `src/lib/geospatial.ts` - PostGIS queries
3. `src/hooks/useSocket.ts` - React hooks

### Step 6: Update package.json (1 minute)

```json
{
  "scripts": {
    "socket:dev": "tsx watch socket-server/index.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run socket:dev\""
  }
}
```

### Step 7: Start Servers (1 minute)

```bash
npm run dev:all
```

### Step 8: Test (2 minutes)

**Test PostGIS:**
```bash
curl "http://localhost:3000/api/hospitals/nearest?latitude=28.6139&longitude=77.2090&limit=5"
```

**Test WebSocket:**
```bash
curl http://localhost:3001/health
```

---

## 🎯 Key Files Created

```
frontend/
├── socket-server/
│   └── index.ts                    # WebSocket server
├── src/
│   ├── lib/
│   │   └── geospatial.ts          # PostGIS queries
│   ├── hooks/
│   │   └── useSocket.ts           # Socket hooks
│   ├── components/
│   │   └── SOSButton.tsx          # SOS button
│   └── app/
│       ├── api/
│       │   └── hospitals/
│       │       └── nearest/
│       │           └── route.ts   # Hospital API
│       └── dashboard/
│           └── admin/
│               └── emergency/
│                   └── page.tsx   # Admin dashboard
└── ecosystem.config.js            # PM2 config
```

---

## 🔑 Environment Variables

Add to `.env.local`:

```env
SOCKET_PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│         Plesk Server                    │
├─────────────────────────────────────────┤
│                                         │
│  Next.js (3000)  ←→  Socket.io (3001)  │
│         ↓                    ↓          │
│         PostgreSQL + PostGIS            │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] PostGIS extension enabled
- [ ] Dependencies installed
- [ ] Prisma schema updated
- [ ] Migration created
- [ ] Files created
- [ ] Servers running
- [ ] Tests passing

---

## 🚨 Quick Troubleshooting

**PostGIS not found?**
```bash
sudo apt-get install postgresql-14-postgis-3
```

**Socket not connecting?**
```bash
# Check if running
curl http://localhost:3001/health

# Check firewall
sudo ufw allow 3001
```

**Slow queries?**
```sql
-- Create spatial index
CREATE INDEX hospital_location_idx ON "Hospital" USING GIST (location);
```

---

## 📚 Full Documentation

See **ARCHITECTURE_GUIDE.md** for complete implementation details.

---

**🎉 You're ready! Start building real-time emergency features!**
