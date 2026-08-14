'use client';

// The video session itself, embedded in the page.
//
// Backed by Jitsi Meet's hosted service, so there is no media infrastructure to
// run. The room name is derived server-side from the booking and a secret — the
// client never chooses it, because a guessable room would let anyone who tried
// the right string walk into a therapy session.

import { useState } from 'react';
import { Video, X, ExternalLink } from 'lucide-react';

interface Props {
  bookingId: string;
  /** Shown on the button; purely cosmetic. */
  label?: string;
  onError?: (message: string) => void;
}

export default function VideoCall({ bookingId, label = 'Join call', onError }: Props) {
  const [room, setRoom] = useState<{ url: string; isHost: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/meeting`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not open the room');
      setRoom({ url: data.data.url, isHost: data.data.isHost });
    } catch (err: any) {
      onError?.(err?.message ?? 'Could not open the room');
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <button
        onClick={open}
        disabled={loading}
        className="px-3 py-1.5 bg-[var(--primary-bright)] hover:bg-[var(--primary)] text-white text-xs font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
      >
        <Video size={13} /> {loading ? 'Opening…' : label}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[95] bg-black/80 flex flex-col p-2 sm:p-4">
      <div className="flex items-center justify-between text-white pb-2 gap-3">
        <p className="text-xs font-bold">
          Session in progress
          {room.isHost && <span className="ml-2 text-[10px] font-normal opacity-70">You are the host</span>}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          {/* Some browsers restrict devices inside a cross-origin iframe. A way
              out to the real tab means a blocked camera is not a dead end. */}
          <a href={room.url} target="_blank" rel="noopener noreferrer"
            className="text-[10px] underline inline-flex items-center gap-1 opacity-80 hover:opacity-100">
            <ExternalLink size={11} /> Open in a new tab
          </a>
          <button onClick={() => setRoom(null)} aria-label="Leave the call"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">
            <X size={16} />
          </button>
        </div>
      </div>

      <iframe
        src={room.url}
        title="Session video call"
        // Without these the frame loads and then finds no devices.
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="flex-1 w-full rounded-xl bg-black"
        style={{ border: 'none' }}
      />
    </div>
  );
}
