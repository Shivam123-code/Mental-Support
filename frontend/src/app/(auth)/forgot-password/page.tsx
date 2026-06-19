'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || data.message || 'Something went wrong.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/role-selection"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-semibold hover:gap-2 transition-all mb-6"
          >
            <ArrowLeft size={12} /> Back to Sign In
          </Link>
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-2">
            Forgot Password?
          </h1>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            No worries — enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="card">
          {success ? (
            /* ── Success State ── */
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-2">
                Check your inbox!
              </h2>
              <p className="text-sm text-[var(--on-surface-variant)] mb-6 leading-relaxed">
                If <span className="font-semibold text-[var(--on-surface)]">{email}</span> is
                registered, we've sent a password reset link. Check your spam folder too.
              </p>
              <p className="text-xs text-[var(--on-surface-variant)] mb-4">
                Didn't receive it?
              </p>
              <button
                onClick={() => { setSuccess(false); setEmail(''); }}
                className="text-sm text-[var(--primary)] font-semibold hover:underline"
              >
                Try a different email
              </button>
              <div className="mt-6 pt-6 border-t border-[var(--outline-variant)]">
                <Link
                  href="/role-selection"
                  className="block w-full text-center btn-secondary !py-3"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form State ── */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-[var(--error-container)] border border-[var(--error)] rounded-lg">
                  <AlertCircle size={18} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--on-error-container)]">{error}</p>
                </div>
              )}

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
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/role-selection"
                  className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors"
                >
                  Remember your password? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
