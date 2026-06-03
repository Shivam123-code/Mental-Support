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
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await api.auth.login({ email, password });
      
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
      throw new Error('Login failed. Please try again.');
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
