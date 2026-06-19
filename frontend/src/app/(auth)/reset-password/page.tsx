'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="card text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center">
            <XCircle size={36} className="text-red-500" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-2">Invalid Reset Link</h2>
        <p className="text-sm text-[var(--on-surface-variant)] mb-6">
          This link is missing or malformed. Please request a new password reset.
        </p>
        <Link href="/forgot-password" className="btn-primary !py-3 block text-center">
          Request New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || data.message || 'Reset failed. The link may have expired.');
      } else {
        setSuccess(true);
        // Redirect to role selection after 3 seconds
        setTimeout(() => router.push('/role-selection'), 3000);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const strength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 && !/[A-Z]/.test(password) ? 2
    : password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3;
  const strengthLabels = ['', 'Too short', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

  return (
    <div className="card">
      {success ? (
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center">
              <CheckCircle size={36} className="text-green-500" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-2">Password Reset!</h2>
          <p className="text-sm text-[var(--on-surface-variant)] mb-2">
            Your password has been updated successfully.
          </p>
          <p className="text-xs text-[var(--on-surface-variant)]">
            Redirecting to sign in...
          </p>
          <div className="mt-6 pt-6 border-t border-[var(--outline-variant)]">
            <Link href="/role-selection" className="btn-primary !py-3 block text-center">
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-[var(--error-container)] border border-[var(--error)] rounded-lg">
              <AlertCircle size={18} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[var(--on-error-container)]">{error}</p>
                {(error.includes('expired') || error.includes('Invalid')) && (
                  <Link href="/forgot-password" className="text-xs font-semibold underline text-[var(--error)] mt-1 inline-block">
                    Request a new reset link →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--on-surface)] mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full pl-12 pr-11 py-3 border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
                placeholder="Min. 8 characters"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-[var(--outline-variant)]'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[var(--on-surface-variant)]">{strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-[var(--on-surface)] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-12 pr-11 py-3 border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
                placeholder="Repeat your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
            )}
            {confirmPassword && password === confirmPassword && password.length >= 8 && (
              <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || password !== confirmPassword || password.length < 8}
            className="w-full btn-primary flex items-center justify-center gap-2 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating password...
              </>
            ) : (
              'Set New Password'
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-2">Set New Password</h1>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            Enter a strong new password for your account.
          </p>
        </div>
        <Suspense fallback={
          <div className="card flex justify-center py-8">
            <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
