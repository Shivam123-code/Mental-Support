# 🚀 Frontend-Backend Integration Quick Reference

## ⚡ Quick Start

```bash
cd frontend
npm run dev
# Visit http://localhost:3000/login
# Click "User Demo" → "Sign In"
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| User | demo@kleverklues.com | Demo@123 |
| Professional | professional@kleverklues.com | Prof@123 |
| Admin | admin@kleverklues.com | Admin@123 |

---

## 📦 Core Files

```
src/
├── contexts/
│   └── AuthContext.tsx          # Global auth state
├── lib/
│   └── api-client.ts            # API calls
├── components/
│   └── ProtectedRoute.tsx       # Route protection
└── app/
    ├── (auth)/login/page.tsx    # Login page
    └── dashboard/user/page.tsx  # User dashboard
```

---

## 🎯 Common Patterns

### 1. Use Auth in Component

```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return <div>Welcome {user?.firstName}!</div>;
}
```

### 2. Make API Call

```typescript
import { api } from '@/lib/api-client';

// Get data
const assessments = await api.assessments.list();

// Post data
await api.mood.log({
  mood: 'happy',
  intensity: 8
});
```

### 3. Protect a Route

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <YourContent />
    </ProtectedRoute>
  );
}
```

---

## 🔌 API Endpoints

```typescript
// Auth
api.auth.login({ email, password })
api.auth.register({ email, password, firstName, lastName })
api.auth.logout()
api.auth.me()

// Assessments
api.assessments.list()
api.assessments.submit({ assessmentType, answers })

// Programs
api.programs.list()
api.programs.enroll({ programType })

// Mood
api.mood.list(days)
api.mood.log({ mood, intensity, notes, triggers, activities })

// Journal
api.journal.list(limit, offset)
api.journal.create({ title, content, mood, tags, isPrivate })
```

---

## ✅ What's Working

- ✅ Login/Logout
- ✅ User authentication
- ✅ Protected routes
- ✅ Dashboard with real data
- ✅ Token management
- ✅ Error handling

---

## 🔄 Next Steps

1. Connect assessment submission
2. Connect mood tracker
3. Connect journal CRUD
4. Connect program enrollment

---

## 🐛 Troubleshooting

**Login not working?**
```bash
# Check if backend is running
curl http://localhost:3000/api/auth/login

# Check browser console for errors
# Check Network tab in DevTools
```

**Token not persisting?**
```javascript
// Check localStorage
localStorage.getItem('auth_token')

// Clear and try again
localStorage.clear()
```

**Dashboard not loading?**
```bash
# Check if logged in
# Check browser console
# Verify API endpoints are working
```

---

## 📚 Documentation

- **Full Integration Guide:** `FRONTEND_INTEGRATION_COMPLETE.md`
- **Backend Setup:** `BACKEND_SETUP.md`
- **API Reference:** `API_DOCUMENTATION.md`

---

**🎉 You're ready to build!**
