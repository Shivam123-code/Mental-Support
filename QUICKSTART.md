# 🚀 KleverKlues Quick Start Guide

Get your KleverKlues platform up and running in 5 minutes!

## ⚡ Prerequisites

- ✅ Node.js 18+ installed
- ✅ PostgreSQL 14+ installed
- ✅ Git installed

## 📦 Step 1: Install PostgreSQL

### Windows (Recommended Method):

**Option A: Official Installer**
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Set password for `postgres` user (remember this!)
4. Keep default port: `5432`
5. Complete installation

**Option B: Using Chocolatey**
```bash
choco install postgresql
```

### Verify Installation:
```bash
psql --version
# Should show: psql (PostgreSQL) 14.x or higher
```

## 🗄️ Step 2: Create Database

Open Command Prompt and run:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kleverklues;

# Exit
\q
```

## 🔧 Step 3: Configure Environment

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Open `.env.local` and update the `DATABASE_URL`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/kleverklues?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

## 📥 Step 4: Install Dependencies

```bash
npm install
```

This installs all required packages including Prisma, bcrypt, JWT, etc.

## 🏗️ Step 5: Setup Database

Run these commands in order:

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Seed with demo data
npm run db:seed
```

## ✅ Step 6: Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

## 🎉 You're Done!

### Demo Accounts:

**Regular User:**
- Email: `demo@kleverklues.com`
- Password: `Demo@123`

**Professional:**
- Email: `professional@kleverklues.com`
- Password: `Prof@123`

**Admin:**
- Email: `admin@kleverklues.com`
- Password: `Admin@123`

## 🧪 Test the API

### Using cURL:

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"demo@kleverklues.com\",\"password\":\"Demo@123\"}"
```

**Get Current User:**
```bash
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Browser:

1. Go to http://localhost:3000
2. Click "Sign In"
3. Use demo credentials
4. Explore the platform!

## 🛠️ Useful Commands

```bash
# Start dev server
npm run dev

# View database in GUI
npm run db:studio

# Reset database
npm run db:push --force-reset

# Re-seed database
npm run db:seed
```

## 📊 Prisma Studio

View and edit your database visually:

```bash
npm run db:studio
```

Opens at: **http://localhost:5555**

## 🐛 Troubleshooting

### "Can't reach database server"
- ✅ Check if PostgreSQL is running
- ✅ Verify password in `.env.local`
- ✅ Ensure database `kleverklues` exists

### "Port 3000 already in use"
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or change port
PORT=3001 npm run dev
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. ✅ Explore the frontend pages
2. ✅ Test API endpoints (see API_DOCUMENTATION.md)
3. ✅ View database in Prisma Studio
4. 🔄 Integrate frontend with backend APIs
5. 🔄 Customize and extend features

## 📖 Documentation

- **Backend Setup:** See `BACKEND_SETUP.md`
- **API Documentation:** See `API_DOCUMENTATION.md`
- **Design System:** See `DESIGN.md`

## 🎯 Project Structure

```
KLEVERKLUES/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages & API routes
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities (auth, db, validation)
│   │   └── middleware/       # Auth middleware
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   ├── public/               # Static assets
│   └── .env.local            # Environment variables
├── BACKEND_SETUP.md          # Detailed backend guide
├── API_DOCUMENTATION.md      # API reference
└── QUICKSTART.md             # This file
```

## 🤝 Need Help?

- Check the documentation files
- Review Prisma docs: https://www.prisma.io/docs
- Check Next.js docs: https://nextjs.org/docs

## 🎊 Happy Building!

Your KleverKlues platform is ready for development. Start building amazing wellbeing features! 🚀
