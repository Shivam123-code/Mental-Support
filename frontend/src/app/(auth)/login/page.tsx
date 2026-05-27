'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick fill demo credentials
  const fillDemo = (role: 'user' | 'professional' | 'admin') => {
    const credentials = {
      user: { email: 'demo@kleverklues.com', password: 'Demo@123' },
      professional: { email: 'professional@kleverklues.com', password: 'Prof@123' },
      admin: { email: 'admin@kleverklues.com', password: 'Admin@123' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect is handled by AuthContext
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-2">
            Welcome Back
          </h1>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            Sign in to continue your wellbeing journey
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="card mb-6 !p-4 bg-[var(--primary-fixed)]/20 border-[var(--primary)]">
          <p className="text-sm font-semibold text-[var(--on-surface)] mb-3">
            🎯 Quick Demo Login:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemo('user')}
              className="px-3 py-1.5 text-xs bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-container)] transition-colors"
            >
              User Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo('professional')}
              className="px-3 py-1.5 text-xs bg-[var(--secondary)] text-white rounded hover:bg-[var(--secondary-container)] transition-colors"
            >
              Professional Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="px-3 py-1.5 text-xs bg-[var(--tertiary)] text-white rounded hover:bg-[var(--tertiary-container)] transition-colors"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-[var(--error-container)] border border-[var(--error)] rounded-lg">
                <AlertCircle size={20} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--on-error-container)]">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--on-surface)] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--on-surface)] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--outline-variant)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--on-surface-variant)]">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[var(--primary)] hover:text-[var(--primary-container)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--outline-variant)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)]">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/role-selection"
            className="block w-full text-center btn-secondary !py-3"
          >
            Create Account
          </Link>
        </div>

        {/* Privacy Notice */}
        <p className="text-center text-xs text-[var(--on-surface-variant)] mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-[var(--primary)] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="text-[var(--primary)] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
