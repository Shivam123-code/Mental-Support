'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role: string;
  status: string;
  avatar?: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, expectedRole?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setLoading(false);
        return;
      }

      // ── Step 1: Decode JWT locally (zero network, instant) ─────────────────
      // The JWT payload contains userId, email, role — enough to show the page.
      // We set loading=false immediately so the UI unblocks in ~1ms.
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const isExpired = payload.exp && payload.exp * 1000 < Date.now();

          if (!isExpired && payload.userId && payload.role) {
            // Show the page right away with data from the token
            setUser({
              id: payload.userId,
              email: payload.email || '',
              role: payload.role,
              status: 'ACTIVE',
              firstName: payload.firstName,
              lastName: payload.lastName,
            });
            setLoading(false); // ← page unblocks here instantly

            // ── Step 2: Validate with server in background (non-blocking) ──
            api.auth.me()
              .then(userData => setUser(userData))   // upgrade with full profile
              .catch((error: any) => {
                if (error?.status === 401 || error?.status === 403) {
                  localStorage.removeItem('auth_token');
                  setUser(null);
                }
              });
            return;
          }
        }
      } catch {
        // JWT malformed — fall through to server validation below
      }

      // ── Fallback: JWT decode failed, ask the server ─────────────────────────
      try {
        const userData = await api.auth.me();
        setUser(userData);
      } catch (error: any) {
        if (error?.status !== 401 && error?.status !== 403) {
          console.error('Auth initialization error:', error);
        }
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, expectedRole?: string) => {
    try {
      const { user: userData, token } = await api.auth.login({ email, password });

      // Role check — reject if user logged into the wrong panel
      if (expectedRole && userData.role !== expectedRole) {
        const roleLabel: Record<string, string> = {
          USER: 'user',
          PROFESSIONAL: 'professional',
          ENTERPRISE: 'enterprise',
          ADMIN: 'admin',
          VENDOR: 'vendor',
        };
        const expected = roleLabel[expectedRole] || expectedRole.toLowerCase();
        throw new Error(
          `This is not a ${expected} account. Please use the correct login page for your role.`
        );
      }
      
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Set user
      setUser(userData);
      
      // Redirect based on role
      if (userData.role === 'ADMIN') {
        router.replace('/dashboard/admin');
      } else if (userData.role === 'PROFESSIONAL') {
        router.replace('/dashboard/professional');
      } else if (userData.role === 'ENTERPRISE') {
        router.replace('/dashboard/enterprise');
      } else if (userData.role === 'VENDOR') {
        router.replace('/dashboard/vendor');
      } else {
        router.replace('/dashboard/user');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw error; // re-throw role mismatch errors as-is
    }
  };

  const register = async (data: any) => {
    try {
      const { user: userData, token } = await api.auth.register(data);
      
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Set user
      setUser(userData);
      
      // Redirect to appropriate dashboard
      if (userData.role === 'PROFESSIONAL') {
        router.replace('/apply-professional');
      } else if (userData.role === 'ENTERPRISE') {
        router.replace('/apply-organization');
      } else {
        router.replace('/dashboard/user');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user regardless of API call success
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);
    } catch (error: any) {
      if (error?.status !== 401 && error?.status !== 403) {
        console.error('Refresh user error:', error);
      }
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
