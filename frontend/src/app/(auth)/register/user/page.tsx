'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function UserRegisterPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        role: 'USER'
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <Link href="/role-selection" className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-semibold hover:gap-2 transition-all">
            <ArrowLeft size={12} /> Back to Role Selection
          </Link>
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-2">
            Create User Account
          </h1>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            Join KleverKlues&trade; to start your wellbeing journey
          </p>
        </div>

        {/* Register Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-[var(--error-container)] border border-[var(--error)] rounded-lg">
                <AlertCircle size={20} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--on-error-container)]">{error}</p>
              </div>
            )}

            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full pl-11 pr-3 py-2.5 text-xs border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-all"
                    placeholder="John"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full pl-11 pr-3 py-2.5 text-xs border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-all"
                    placeholder="Doe"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 text-xs border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">
                Password (min 8 characters)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 text-xs border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-all"
                  placeholder="Choose a password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 !py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login/user"
            className="block w-full text-center btn-secondary !py-2.5"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
