'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Truck, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const SERVICE_TYPES = [
  'First Responder',
  'Mental Health Support',
  'Security',
  'Medical Aid',
  'General Support',
];

export default function VendorSignup() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    businessName: '', serviceType: 'General Support', phone: '', description: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          businessName: form.businessName,
          serviceType: form.serviceType,
          phone: form.phone,
          description: form.description || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || data.message || 'Registration failed');

      // Store token and redirect
      localStorage.setItem('auth_token', data.data.token);
      // Full page reload so AuthContext.initAuth() picks up the new token
      window.location.replace('/dashboard/vendor');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center">
              <Truck size={32} className="text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[var(--on-surface)] mb-1">Join as a Vendor</h1>
          <p className="text-sm text-[var(--on-surface-variant)]">
            Create your dispatch account and start receiving SOS alerts near you
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl mb-6">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-3 uppercase tracking-wide">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">First Name *</label>
                  <input type="text" value={form.firstName} onChange={set('firstName')} required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Last Name *</label>
                  <input type="text" value={form.lastName} onChange={set('lastName')} required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder="Doe" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={set('email')} required
                className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                placeholder="vendor@example.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} required minLength={8}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder="Min 8 characters" />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Repeat password" />
              </div>
            </div>

            {/* Business Info */}
            <div className="pt-2 border-t border-[var(--outline-variant)]">
              <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-3 mt-3 uppercase tracking-wide">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Business / Unit Name *</label>
                  <input type="text" value={form.businessName} onChange={set('businessName')} required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    placeholder="e.g. City First Responders" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Service Type *</label>
                    <select value={form.serviceType} onChange={set('serviceType')} required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition">
                      {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Phone *</label>
                    <input type="tel" value={form.phone} onChange={set('phone')} required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">Description (optional)</label>
                  <textarea value={form.description} onChange={set('description')} rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
                    placeholder="Briefly describe your service..." />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Vendor Account'}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-sm text-[var(--on-surface-variant)]">
          Already have an account?{' '}
          <Link href="/login/vendor" className="text-orange-600 font-semibold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
