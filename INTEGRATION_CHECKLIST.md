# 🎯 Frontend-Backend Integration Checklist

## ✅ Backend Setup (COMPLETED)

- [x] PostgreSQL database schema designed
- [x] Prisma ORM configured
- [x] Authentication system implemented
- [x] API routes created
- [x] Validation schemas defined
- [x] Database seed data created
- [x] Documentation written

---

## 🔄 Next Steps: Frontend Integration

### 1. **API Client Setup** ⏳

Create a centralized API client utility:

**File:** `frontend/src/lib/api-client.ts`

```typescript
const API_BASE = '/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data.data;
}

// Helper functions
export const api = {
  auth: {
    register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
    me: () => apiRequest('/auth/me'),
  },
  assessments: {
    list: () => apiRequest('/assessments'),
    submit: (data) => apiRequest('/assessments', { method: 'POST', body: JSON.stringify(data) }),
  },
  programs: {
    list: () => apiRequest('/programs'),
    enroll: (data) => apiRequest('/programs', { method: 'POST', body: JSON.stringify(data) }),
  },
  mood: {
    list: (days = 30) => apiRequest(`/mood?days=${days}`),
    log: (data) => apiRequest('/mood', { method: 'POST', body: JSON.stringify(data) }),
  },
  journal: {
    list: (limit = 20, offset = 0) => apiRequest(`/journal?limit=${limit}&offset=${offset}`),
    create: (data) => apiRequest('/journal', { method: 'POST', body: JSON.stringify(data) }),
  },
};
```

---

### 2. **Authentication Context** ⏳

Create a React context for authentication state:

**File:** `frontend/src/contexts/AuthContext.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.auth.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await api.auth.login({ email, password });
    localStorage.setItem('auth_token', token);
    setUser(user);
  };

  const logout = async () => {
    await api.auth.logout();
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const register = async (data: any) => {
    const { user, token } = await api.auth.register(data);
    localStorage.setItem('auth_token', token);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

---

### 3. **Update Root Layout** ⏳

Wrap app with AuthProvider:

**File:** `frontend/src/app/layout.tsx`

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### 4. **Update Login Page** ⏳

**File:** `frontend/src/app/(auth)/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

### 5. **Update Assessment Page** ⏳

**File:** `frontend/src/app/(app)/assessments/[id]/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function AssessmentPage({ params }) {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await api.assessments.submit({
        assessmentType: params.id.toUpperCase().replace('-', '_'),
        answers,
      });
      router.push(`/assessments/results/${result.id}`);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Assessment questions */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Assessment'}
      </button>
    </div>
  );
}
```

---

### 6. **Update Dashboard** ⏳

**File:** `frontend/src/app/dashboard/user/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';

export default function UserDashboard() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [assessmentsData, programsData, moodData] = await Promise.all([
          api.assessments.list(),
          api.programs.list(),
          api.mood.list(7), // Last 7 days
        ]);
        setAssessments(assessmentsData);
        setPrograms(programsData);
        setMoodLogs(moodData);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      
      {/* Recent Assessments */}
      <section>
        <h2>Recent Assessments</h2>
        {assessments.map(assessment => (
          <div key={assessment.id}>
            {assessment.assessmentType}: {assessment.level}
          </div>
        ))}
      </section>

      {/* Active Programs */}
      <section>
        <h2>Active Programs</h2>
        {programs.map(program => (
          <div key={program.id}>
            {program.programType}: Week {program.currentWeek}
          </div>
        ))}
      </section>

      {/* Mood Trend */}
      <section>
        <h2>Mood This Week</h2>
        {moodLogs.map(log => (
          <div key={log.id}>
            {log.mood} - Intensity: {log.intensity}/10
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

### 7. **Protected Route Wrapper** ⏳

**File:** `frontend/src/components/ProtectedRoute.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
```

---

## 📋 Integration Tasks

### Phase 1: Core Authentication
- [ ] Create API client utility
- [ ] Create AuthContext
- [ ] Update root layout with AuthProvider
- [ ] Update login page
- [ ] Update registration page
- [ ] Create protected route wrapper
- [ ] Update header to show user info
- [ ] Add logout functionality

### Phase 2: Assessment Integration
- [ ] Connect assessment submission
- [ ] Display assessment results
- [ ] Show assessment history
- [ ] Display insights and recommendations

### Phase 3: Program Integration
- [ ] Connect program enrollment
- [ ] Display program progress
- [ ] Mark activities as complete
- [ ] Show completion certificates

### Phase 4: Mood & Journal
- [ ] Connect mood logging
- [ ] Display mood charts
- [ ] Connect journal CRUD
- [ ] Add search and filtering

### Phase 5: Dashboard
- [ ] Fetch and display user data
- [ ] Show recent assessments
- [ ] Display program progress
- [ ] Show mood trends
- [ ] Add quick actions

### Phase 6: Professional Features
- [ ] Professional profile management
- [ ] Availability calendar
- [ ] Booking management
- [ ] Client reviews

### Phase 7: Community
- [ ] Post creation
- [ ] Comments
- [ ] Likes and reactions
- [ ] Anonymous posting

### Phase 8: Messaging
- [ ] Direct messaging
- [ ] Notifications
- [ ] Real-time updates

---

## 🧪 Testing Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test token persistence
- [ ] Test protected routes
- [ ] Test assessment submission
- [ ] Test program enrollment
- [ ] Test mood logging
- [ ] Test journal entries
- [ ] Test logout
- [ ] Test error handling

---

## 🚀 Deployment Checklist

- [ ] Set production DATABASE_URL
- [ ] Set secure JWT_SECRET
- [ ] Set secure NEXTAUTH_SECRET
- [ ] Configure SMTP for emails
- [ ] Run database migrations
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS if needed
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test in production

---

## 📚 Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Backend Setup:** See `BACKEND_SETUP.md`
- **Quick Start:** See `QUICKSTART.md`
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Status:** Backend Complete ✅ | Frontend Integration In Progress ⏳
