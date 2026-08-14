'use client';

/**
 * Rate a completed session.
 *
 * Nothing has ever collected a review on this platform, so every professional
 * in the directory sits at 0 stars and the match ranking — which sorts on
 * average rating — has been sorting a column of zeroes. This is the missing
 * half.
 *
 * The button only appears against a COMPLETED session the caller has not
 * already reviewed; the server enforces both of those regardless.
 */

import { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';

interface Props {
  bookingId: string;
  professionalName: string;
  /** Called once the review is saved, so the parent can drop the prompt. */
  onDone: (bookingId: string) => void;
}

export default function ReviewSession({ bookingId, professionalName, onDone }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  /** Star currently under the cursor, so the row previews the click. */
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!rating) return;
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId, rating, comment: comment.trim() || undefined, isAnonymous: anonymous }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not save your review');
      setOpen(false);
      onDone(bookingId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-[10px] font-bold text-[var(--primary)] hover:underline whitespace-nowrap"
      >
        <Star size={11} /> Rate session
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget && !saving) setOpen(false); }}
    >
      <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]/20">
          <div>
            <h3 className="text-sm font-bold text-[var(--on-surface)]">How was your session?</h3>
            <p className="text-[10px] text-[var(--on-surface-variant)]">with {professionalName}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            disabled={saving}
            className="p-1.5 rounded-full hover:bg-[var(--surface-container-low)] disabled:opacity-40 transition-colors"
          >
            <X size={15} className="text-[var(--on-surface-variant)]" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="flex items-center justify-center gap-1.5" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={30}
                  className={n <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Anything you'd like to add? (optional)"
            className="w-full text-xs p-3 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)] resize-none"
          />

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={e => setAnonymous(e.target.checked)}
              className="w-4 h-4 accent-[var(--primary)]"
            />
            <span className="text-[11px] text-[var(--on-surface-variant)]">
              Post anonymously — your name will not be shown
            </span>
          </label>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700">{error}</div>
          )}

          <button
            onClick={submit}
            disabled={!rating || saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--primary)] hover:bg-[#00685c] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {saving ? 'Saving…' : rating ? 'Submit review' : 'Pick a rating'}
          </button>

          <p className="text-[10px] text-[var(--on-surface-variant)] text-center">
            Reviews are public on your professional's profile. You can only review a session once.
          </p>
        </div>
      </div>
    </div>
  );
}
