# KleverKlues Backend Setup Guide

## 🎯 Overview

This guide will help you set up the PostgreSQL database and backend infrastructure for KleverKlues.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**After installation:**
- PostgreSQL will run on `localhost:5432` by default
- Default username: `postgres`
- Set a password during installation

### 2. Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE kleverklues;
```

### 3. Configure Environment Variables

Update `frontend/.env.local` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/kleverklues?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

#### Payments

`.env.local` is gitignored, so these have to be set on every machine. Without
them auto-match stays free and the payments API refuses to sign anything.

```env
# "dummy" runs the whole flow locally with a signed webhook, no real money.
# Swap for a real adapter name once gateway keys exist — nothing else changes.
PAYMENT_PROVIDER=dummy
# Any long random string. Generate one with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# This is what webhook signatures are checked against, so it must NOT be shared
# or committed. A leaked secret lets anyone mark any payment as paid.
PAYMENT_WEBHOOK_SECRET=
PAYMENT_CURRENCY=INR
# Price in the smallest unit: 49900 paise = ₹499.00
AUTOMATCH_PRICE_MINOR=49900
# Auto-match stays free unless this is exactly the string "true".
AUTOMATCH_REQUIRES_PAYMENT=true
```

#### Shared rate limiting (optional, but required for more than one instance)

```env
# Unset locally: limits are per-process, which is correct for a single instance.
# Set it in production BEFORE running a second instance — otherwise the real cap
# is max x instance_count and login brute-force protection is close to absent.
# The socket server uses the same variable for its room adapter.
REDIS_URL=redis://localhost:6379
```

If Redis is unreachable the app keeps serving and falls back to per-process
limits rather than locking everybody out, and retries the connection every 30
seconds.

### 4. Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- `@prisma/client` - Database client
- `prisma` - Database toolkit
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `zod` - Schema validation

### 5. Generate Prisma Client

```bash
npm run db:generate
```

This generates TypeScript types from your Prisma schema.

### 6. Push Database Schema

```bash
npm run db:push
```

This creates all tables in your PostgreSQL database.

### 7. Seed Database with Demo Data

```bash
npm run db:seed
```

This creates demo users and sample data.

## 🔐 Demo Credentials

After seeding, you can use these accounts:

**Regular User:**
- Email: `demo@kleverklues.com`
- Password: `Demo@123`

**Professional:**
- Email: `professional@kleverklues.com`
- Password: `Prof@123`

**Admin:**
- Email: `admin@kleverklues.com`
- Password: `Admin@123`

## 📊 Database Schema

The database includes:

### Core Tables
- **User** - User accounts and authentication
- **UserProfile** - Extended user information
- **Session** - Active user sessions
- **Professional** - Professional profiles
- **ProfessionalAvailability** - Professional schedules

### Wellbeing Features
- **AssessmentResult** - Assessment submissions and scores
- **ProgramEnrollment** - Program enrollments and progress
- **ProgramActivity** - Individual program activities
- **JournalEntry** - User journal entries
- **MoodLog** - Daily mood tracking

### Booking & Sessions
- **Booking** - Session bookings with professionals
- **Review** - Professional reviews and ratings

### Community
- **CommunityPost** - Community discussions and stories
- **Comment** - Post comments
- **Message** - Direct messages

### System
- **Notification** - User notifications
- **Subscription** - Subscription plans
- **ActivityLog** - System activity tracking

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Generate Prisma Client
npm run db:generate

# Push schema to database (no migrations)
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with demo data
npm run db:seed
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Assessments
- `GET /api/assessments` - Get user's assessments
- `POST /api/assessments` - Submit assessment

### Programs
- `GET /api/programs` - Get user's program enrollments
- `POST /api/programs` - Enroll in program

### Mood Tracking
- `GET /api/mood` - Get mood logs
- `POST /api/mood` - Log mood

### Journal
- `GET /api/journal` - Get journal entries
- `POST /api/journal` - Create journal entry

### AI Chat
- `POST /api/chat` - AI companion chat (already exists)

## 🔒 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get the token from the login/register response.

## 🧪 Testing the API

### Using cURL:

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","firstName":"Test","lastName":"User"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@kleverklues.com","password":"Demo@123"}'
```

**Get Current User:**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman or Thunder Client:

1. Import the endpoints
2. Set Authorization header with Bearer token
3. Test each endpoint

## 🗄️ Prisma Studio

View and edit your database visually:

```bash
npm run db:studio
```

Opens at `http://localhost:5555`

## 🔄 Database Migrations

For production, use migrations instead of `db:push`:

```bash
# Create a new migration
npm run db:migrate

# Name your migration when prompted
# Example: "add_user_preferences"
```

## 🐛 Troubleshooting

### Connection Error
```
Error: Can't reach database server
```
**Solution:** Ensure PostgreSQL is running and credentials are correct.

### Port Already in Use
```
Error: Port 5432 is already in use
```
**Solution:** PostgreSQL is already running or another service is using the port.

### Permission Denied
```
Error: permission denied for database
```
**Solution:** Ensure your PostgreSQL user has proper permissions.

## 📚 Next Steps

1. ✅ Set up PostgreSQL
2. ✅ Configure environment variables
3. ✅ Run migrations
4. ✅ Seed database
5. ✅ Test API endpoints
6. 🔄 Integrate with frontend components
7. 🔄 Add more API endpoints as needed
8. 🔄 Implement real-time features (WebSockets)
9. 🔄 Add file upload for avatars
10. 🔄 Set up email notifications

## 🤝 Support

For issues or questions:
- Check the Prisma docs: https://www.prisma.io/docs
- Check PostgreSQL docs: https://www.postgresql.org/docs/

## 🎉 You're Ready!

Your backend is now set up and ready for development. Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` and start building!
