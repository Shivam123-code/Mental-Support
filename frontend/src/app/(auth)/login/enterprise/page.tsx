'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function EnterpriseLoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !justLoggedIn) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading, justLoggedIn, router]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      setJustLoggedIn(true);
      await login(email, password, 'ENTERPRISE');
    } catch (err: any) {
      setJustLoggedIn(false);
      setError(err.message || 'Login failed. Please verify your credentials and approval status.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <Link href="/role-selection" className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-semibold hover:gap-2 transition-all">
            <ArrowLeft size={12} /> Back to Role Selection
          </Link>
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-2">
            Enterprise Sign In
          </h1>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            Log in to manage workplace wellbeing accounts
          </p>
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
                Official Work Email Address
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
                  placeholder="name@company.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--on-surface)] mb-2">
                Security Password
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

            {/* Forgot Password */}
            <div className="text-right -mt-2">
              <Link href="/forgot-password" className="text-xs text-[var(--primary)] hover:underline font-medium">
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
                  Verifying Account...
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
                New organization applicant?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            href="/apply-organization"
            className="block w-full text-center btn-secondary !py-3"
          >
            Apply as an Organization
          </Link>
        </div>
      </div>
    </div>
  );
}
