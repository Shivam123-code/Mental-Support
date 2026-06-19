'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Truck, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Direct fetch so we can validate the role before storing auth state
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || data.message || 'Login failed');
      if (data.data?.user?.role !== 'VENDOR') {
        throw new Error('This is not a vendor account. Please use the correct login page.');
      }
      localStorage.setItem('auth_token', data.data.token);
      // Full page reload so AuthContext.initAuth() picks up the new token
      window.location.replace('/dashboard/vendor');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center">
              <Truck size={32} className="text-orange-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[var(--on-surface)] text-center mb-1">Vendor Sign In</h1>
          <p className="text-sm text-[var(--on-surface-variant)] text-center mb-8">
            Access your dispatch dashboard
          </p>

          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl mb-5">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                placeholder="vendor@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right -mt-1">
              <Link href="/forgot-password" className="text-xs text-orange-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--on-surface-variant)]">
            New vendor?{' '}
            <Link href="/signup/vendor" className="text-orange-600 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/role-selection" className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">
            ← Back to role selection
          </Link>
        </div>
      </div>
    </div>
  );
}
