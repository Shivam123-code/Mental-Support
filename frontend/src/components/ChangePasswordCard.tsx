'use client';

import { useState, FormEvent } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ChangePasswordCardProps {
  /** Optional extra CSS classes on the outer container */
  className?: string;
}

export default function ChangePasswordCard({ className = '' }: ChangePasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password strength
  const strength =
    newPassword.length === 0 ? 0
    : newPassword.length < 8 ? 1
    : newPassword.length >= 12 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 4
    : newPassword.length >= 10 ? 3
    : 2;
  const strengthLabel = ['', 'Too short', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || data.message || 'Failed to change password.');
      } else {
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-2xl p-6 ${className}`}>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[var(--on-surface)] flex items-center gap-2">
          <Lock size={16} className="text-[var(--primary)]" />
          Change Password
        </h3>
        <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
          Update your account password. You'll stay logged in after changing it.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg mb-4">
          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-[var(--error-container)] border border-[var(--error)] rounded-lg mb-4">
          <AlertCircle size={16} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--on-error-container)]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
              placeholder="Enter current password"
            />
            <button type="button" onClick={() => setShowCurrent(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
              placeholder="Min. 8 characters"
            />
            <button type="button" onClick={() => setShowNew(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {newPassword.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-[var(--outline-variant)]'}`} />
                ))}
              </div>
              <p className="text-[11px] text-[var(--on-surface-variant)]">{strengthLabel[strength]}</p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[var(--on-surface)] mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)]" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-[var(--outline-variant)] rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
              placeholder="Repeat new password"
            />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmPassword && (
            <p className={`text-[11px] mt-1 ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
              {newPassword === confirmPassword ? '✓ Passwords match' : "Passwords don't match"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || newPassword !== confirmPassword || newPassword.length < 8 || !currentPassword}
          className="w-full btn-primary !py-2.5 !text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 size={15} className="animate-spin" /> Updating...</> : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
