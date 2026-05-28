# KleverKlues - Healthcare & Wellbeing Platform

A comprehensive healthcare platform with real-time emergency SOS system and geospatial hospital search.

## 🏗️ Project Structure

```
KLEVERKLUES/
├── ecosystem.config.js               # PM2 configuration for production
├── README.md                         # This file
│
├── frontend/                         # 🟢 Next.js App (Port 3000)
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema (20+ tables)
│   │   ├── seed.ts                   # Demo data generator
│   │   └── migrations/               # Database migrations
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/             # Public pages (no auth)
│   │   │   ├── (auth)/               # Authentication flows
│   │   │   ├── (app)/                # Authenticated features
│   │   │   ├── dashboard/            # Role-based dashboards
│   │   │   │   ├── user/             # Patient/Client UI
│   │   │   │   ├── professional/     # Therapist UI
│   │   │   │   ├── enterprise/       # Organization UI
│   │   │   │   └── admin/            # Admin UI
│   │   │   ├── api/                  # REST API endpoints
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── components/               # React components
│   │   │   ├── layout/               # Layout components
│   │   │   ├── ui/                   # UI components
│   │   │   └── shared/               # Shared components
│   │   │
│   │   ├── lib/                      # Core utilities
│   │   │   ├── db.ts                 # Prisma client
│   │   │   ├── api-client.ts         # API wrapper
│   │   │   ├── geospatial.ts         # PostGIS queries
│   │   │   └── auth.ts               # Auth utilities
│   │   │
│   │   ├── hooks/                    # React hooks
│   │   ├── contexts/                 # React contexts
│   │   └── middleware.ts             # Route protection
│   │
│   ├── public/                       # Static assets
│   ├── .env.local                    # Environment variables
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── socket-server/                    # 🔴 WebSocket Microservice (Port 3001)
    ├── src/
    │   ├── index.ts                  # Express + Socket.io server
    │   ├── events/
    │   │   └── sosHandler.ts         # Emergency SOS logic
    │   └── utils/
    │       └── jwtValidator.ts       # JWT validation
    │
    ├── .env                          # Socket server config
    ├── tsconfig.json
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ with PostGIS extension
- npm or yarn

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Socket Server
cd ../socket-server
npm install
```

### 2. Setup Database

```bash
# Enable PostGIS
psql -U postgres -d kleverklues
CREATE EXTENSION IF NOT EXISTS postgis;

# Run migrations
cd frontend
npm run db:migrate
npm run db:seed
```

### 3. Configure Environment

**frontend/.env.local:**
```env
DATABASE_URL="postgresql://postgres:kleverklues2024@localhost:5432/kleverklues?schema=public"
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**socket-server/.env:**
```env
PORT=3001
DATABASE_URL="postgresql://postgres:kleverklues2024@localhost:5432/kleverklues?schema=public"
JWT_SECRET=your-super-secret-jwt-key
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Start Development Servers

```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Socket Server
cd socket-server
npm run dev
```

Or use concurrently (from frontend directory):
```bash
npm run dev:all
```

## 📡 Architecture

### Two-Service Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Your Server                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐      ┌──────────────────┐   │
│  │   Next.js App    │      │  Socket.io       │   │
│  │   Port 3000      │      │  Port 3001       │   │
│  │                  │      │                  │   │
│  │  • App Router    │◄────►│  • Express.js    │   │
│  │  • API Routes    │      │  • WebSocket     │   │
│  │  • SSR/SSG       │      │  • Real-time     │   │
│  └──────────────────┘      └──────────────────┘   │
│           │                         │              │
│           └─────────┬───────────────┘              │
│                     │                              │
│           ┌─────────▼─────────┐                    │
│           │   PostgreSQL      │                    │
│           │   + PostGIS       │                    │
│           └───────────────────┘                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Why Separate Services?

✅ **Better Performance** - Dedicated process for WebSocket connections
✅ **Independent Scaling** - Scale each service separately
✅ **Easier Debugging** - Separate logs and monitoring
✅ **Production Stability** - No interference between services
✅ **Future-Proof** - Easy to migrate or upgrade

## 🔥 Key Features

### 1. Emergency SOS System
- Sub-second real-time alerts
- WebSocket-based broadcasting
- Admin dashboard notifications
- Geolocation tracking

### 2. Geospatial Hospital Search
- PostGIS K-Nearest Neighbor queries
- Millisecond response times
- Distance calculations
- Emergency room filtering

### 3. Role-Based Dashboards
- **User**: Wellbeing companion dashboard
- **Professional**: Client management
- **Enterprise**: Organization analytics
- **Admin**: Platform control center

### 4. Authentication & Security
- JWT-based authentication
- Role-based access control
- Protected routes
- Secure WebSocket connections

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
```

**Socket Server:**
```bash
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| User | demo@kleverklues.com | Demo@123 |
| Professional | professional@kleverklues.com | Prof@123 |
| Admin | admin@kleverklues.com | Admin@123 |

## 🚀 Production Deployment

### Using PM2

```bash
# Build both services
cd frontend && npm run build
cd ../socket-server && npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

### Nginx Configuration

```nginx
# WebSocket proxy
location /socket.io/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;
}

# Next.js app
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## 📊 API Endpoints

### REST API (Port 3000)

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/hospitals/nearest` - Find nearest hospitals
- `GET /api/assessments` - List assessments
- `GET /api/programs` - List programs
- `POST /api/mood` - Log mood
- `POST /api/journal` - Create journal entry

### WebSocket API (Port 3001)

- `authenticate` - Authenticate socket connection
- `emergency:sos` - Send emergency alert
- `emergency:acknowledge` - Acknowledge alert (admin)
- `emergency:resolve` - Resolve alert (admin)

## 🔒 Security

- JWT authentication for all protected routes
- Token validation on WebSocket connections
- Role-based access control
- SQL injection protection via Prisma
- CORS configuration
- Environment variable protection

## 📚 Documentation

- [Architecture Guide](./ARCHITECTURE_GUIDE.md) - Detailed architecture
- [Expert Recommendations](./EXPERT_RECOMMENDATIONS.md) - Best practices
- [WebSocket Quick Start](./WEBSOCKET_POSTGIS_QUICKSTART.md) - Quick setup

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ for better mental health and wellbeing**
