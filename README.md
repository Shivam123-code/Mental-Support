# KleverKlues™

**"You're Not Alone."**

The World's Most Trusted Human Wellbeing & Emotional Support Ecosystem.

---

## 🌟 About

KleverKlues is a Human Wellbeing Infrastructure Platform — a connected ecosystem where people can heal emotionally, grow mentally, connect safely, contribute meaningfully, learn continuously, support humanity, and build emotionally resilient lives.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup (5 minutes)

```bash
# 1. Install PostgreSQL and create database
psql -U postgres
CREATE DATABASE kleverklues;
\q

# 2. Clone and navigate
cd frontend

# 3. Configure environment
# Edit .env.local with your PostgreSQL password

# 4. Install dependencies
npm install

# 5. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 6. Start development server
npm run dev
```

Visit **http://localhost:3000**

### Demo Credentials
- **User:** demo@kleverklues.com / Demo@123
- **Professional:** professional@kleverklues.com / Prof@123
- **Admin:** admin@kleverklues.com / Admin@123

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Newsreader (serif) + Manrope (sans-serif)

### Backend
- **Database:** PostgreSQL 14+
- **ORM:** Prisma 6.2
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **API:** Next.js API Routes

### AI Features
- **Provider:** OpenRouter API
- **Models:** Multiple LLM support

---

## 📁 Project Structure

```
KLEVERKLUES/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages & API routes
│   │   │   ├── (app)/        # Protected app pages
│   │   │   ├── (auth)/       # Authentication pages
│   │   │   ├── (public)/     # Public pages
│   │   │   ├── api/          # Backend API routes
│   │   │   └── dashboard/    # Role-based dashboards
│   │   ├── components/       # React components
│   │   │   ├── layout/       # Header, Footer, etc.
│   │   │   └── ui/           # Reusable UI components
│   │   ├── lib/              # Utilities
│   │   │   ├── db.ts         # Database client
│   │   │   ├── auth.ts       # Authentication
│   │   │   ├── validation.ts # Zod schemas
│   │   │   └── api-response.ts # API helpers
│   │   ├── data/             # Static data
│   │   └── middleware/       # Auth middleware
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   ├── public/               # Static assets
│   └── .env.local            # Environment variables
├── QUICKSTART.md             # 5-minute setup guide
├── BACKEND_SETUP.md          # Detailed backend guide
├── API_DOCUMENTATION.md      # API reference
├── DESIGN.md                 # Design system
└── README.md                 # This file
```

---

## 🎨 Design System

**Theme:** "Serene Assurance" - Modern Corporate with Organic Minimalist influences

### Colors
- **Primary:** Seafoam Teal (#089D8C) - Clarity, renewal, stability
- **Secondary:** Muted Sage (#567F77) - Calm endurance
- **Tertiary:** Soft Peach (#FFB470) - Warmth, human touch
- **Neutral:** Slate Grey (#727876) - High legibility

### Typography
- **Display/Headlines:** Newsreader (serif) - Editorial, trustworthy
- **Body/UI:** Manrope (sans-serif) - Modern, clear

### Philosophy
- Generous whitespace for breathing room
- Soft edges and organic motifs
- Privacy-first, emotionally safe design
- Accessibility compliant

---

## 📊 Features

### For Users
- ✅ **Assessments** - Anxiety, burnout, relationships, leadership EQ
- ✅ **Programs** - Guided 4-8 week wellbeing journeys
- ✅ **Mood Tracking** - Daily mood logs with insights
- ✅ **Journal** - Private emotional journaling
- ✅ **AI Companion** - 24/7 AI-powered support
- ✅ **Book Sessions** - Connect with verified professionals
- ✅ **Community** - Support circles and peer groups
- ✅ **Resources** - Articles, videos, meditations
- ✅ **SOS Support** - 24/7 crisis support access

### For Professionals
- ✅ **Profile Management** - Showcase qualifications
- ✅ **Availability Calendar** - Manage schedule
- ✅ **Client Bookings** - Session management
- ✅ **Reviews & Ratings** - Build reputation
- ✅ **Dashboard** - Client insights and analytics

### For Enterprises
- ✅ **Workplace Wellness** - Employee wellbeing programs
- ✅ **Analytics Dashboard** - Team health metrics
- ✅ **EAP Integration** - Employee assistance programs
- ✅ **Burnout Prevention** - Proactive monitoring

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Core Features
- `GET/POST /api/assessments` - Assessment management
- `GET/POST /api/programs` - Program enrollment
- `GET/POST /api/mood` - Mood tracking
- `GET/POST /api/journal` - Journal entries
- `POST /api/chat` - AI companion chat

See **API_DOCUMENTATION.md** for complete reference.

---

## 🗄️ Database Schema

20+ tables covering:
- User management & authentication
- Professional profiles & verification
- Assessments & results
- Program enrollments & progress
- Mood tracking & journaling
- Bookings & sessions
- Community & messaging
- Notifications & subscriptions
- Analytics & activity logs

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/kleverklues"

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret

# AI Features
OPENROUTER_API_KEY=your-openrouter-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🧪 Testing

### Test API with cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@kleverklues.com","password":"Demo@123"}'

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Database

```bash
npm run db:studio
```

Opens at `http://localhost:5555`

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Detailed backend setup
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[DESIGN.md](DESIGN.md)** - Design system guide
- **[BACKEND_INTEGRATION_SUMMARY.md](BACKEND_INTEGRATION_SUMMARY.md)** - Integration overview

---

## 🔒 Security

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT token authentication
- ✅ Session management
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (Next.js built-in)
- ✅ HTTPS ready
- ✅ DPDP compliance ready

---

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Frontend UI complete
- ✅ Database schema
- ✅ Authentication system
- ✅ Core API endpoints
- ⏳ Frontend-backend integration

### Phase 2 (Next)
- [ ] Booking system
- [ ] Community features
- [ ] Messaging system
- [ ] Email notifications
- [ ] Payment integration

### Phase 3 (Future)
- [ ] Real-time chat (WebSocket)
- [ ] Video sessions
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] AI recommendations

---

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the development team.

---

## 📄 License

© 2025 KleverKlues™. All rights reserved.

---

## 🎯 Mission

**"Better Humans. Better World."**

Building a world where emotional wellbeing is accessible, affordable, and stigma-free for everyone.

---

## 📞 Support

For technical support or questions:
- Check the documentation files
- Review the API documentation
- Explore Prisma Studio for database insights

---

**Made with ❤️ for Humanity**
