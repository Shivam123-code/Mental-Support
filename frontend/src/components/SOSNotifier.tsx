'use client';

// Site-wide SOS notifications.
//
// Dispatch updates used to surface only on the dashboards: a caller who pressed
// SOS and then browsed to any other page stopped hearing anything, and an admin
// away from /dashboard/admin missed alerts entirely. The socket server already
// emits everything needed — nobody was listening outside those two pages.
//
// Mounted once in the root layout, inside AuthProvider.

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/useSocket';

interface Toast {
  id: number;
  title: string;
  body?: string;
  tone: 'info' | 'good' | 'warn' | 'critical';
  href?: string;
}

const TONES: Record<Toast['tone'], string> = {
  info:     'bg-blue-50 border-blue-300 text-blue-900',
  good:     'bg-green-50 border-green-400 text-green-900',
  warn:     'bg-amber-50 border-amber-400 text-amber-900',
  critical: 'bg-red-50 border-red-500 text-red-900',
};

/** Caller-facing labels, mirroring the SOS modal so the wording never diverges. */
const CALLER_STATUS: Record<string, { title: string; tone: Toast['tone'] }> = {
  SEARCHING:       { title: '🔍 Finding your nearest responder…', tone: 'info' },
  VENDOR_ALERTED:  { title: '📡 Responders alerted',              tone: 'info' },
  VENDOR_ACCEPTED: { title: '✅ A responder is on the way',        tone: 'good' },
  EN_ROUTE:        { title: '🚗 Your responder is heading to you', tone: 'good' },
  NEARBY:          { title: '📍 Your responder is very close',     tone: 'good' },
  ARRIVED:         { title: '🟢 Your responder has arrived',       tone: 'good' },
  RESOLVED:        { title: '✅ Case resolved — you are safe',     tone: 'good' },
  ESCALATED:       { title: '⚠️ No responder confirmed yet',       tone: 'critical' },
  CANCELLED:       { title: 'Alert cancelled',                    tone: 'info' },
};

// Auto-dismiss. Critical notices stay until dismissed — an escalation telling
// someone to call 112 must not disappear on its own.
const DISMISS_MS = 9000;

export default function SOSNotifier() {
  const { user, isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setToken(typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  }, [isAuthenticated]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-3), { ...t, id }]);
    if (t.tone !== 'critical') {
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), DISMISS_MS);
    }
  }, []);

  const { socket } = useSocket(user?.id, user?.role, token || undefined, !!token && !!user?.id);

  useEffect(() => {
    if (!socket || !user) return;
    const isAdmin = user.role === 'ADMIN';

    // ── Caller side: their own emergency, on whatever page they are on ──────
    const onCallerStatus = (u: any) => {
      const ui = CALLER_STATUS[u?.dispatchStatus] ?? { title: 'Emergency update', tone: 'info' as const };
      push({ title: ui.title, body: u?.vendorName ? `Responder: ${u.vendorName}` : u?.message, tone: ui.tone });
    };

    // ── Admin side: the whole board, not just /dashboard/admin ──────────────
    const onNewAlert = (a: any) => push({
      title: `🚨 New ${a?.severity ?? 'CRITICAL'} SOS`,
      body: a?.message, tone: 'critical', href: '/dashboard/admin',
    });
    const onVendorStatus = (a: any) => push({
      title: `🚐 Responder update — ${a?.dispatchStatus ?? ''}`,
      body: a?.message, tone: 'info', href: '/dashboard/admin',
    });
    const onVendorAssigned = (a: any) => push({
      title: '📡 Responders alerted',
      body: `Alert ${String(a?.alertId ?? '').slice(-6)} — round ${a?.round ?? 1}`,
      tone: 'info', href: '/dashboard/admin',
    });
    const onEscalated = (a: any) => push({
      title: '⚠️ Alert ESCALATED — no responder',
      body: a?.reason, tone: 'critical', href: '/dashboard/admin',
    });
    const onResolved = (a: any) => push({
      title: '✅ Alert resolved',
      body: `Alert ${String(a?.alertId ?? '').slice(-6)}`, tone: 'good', href: '/dashboard/admin',
    });
    const onCancelled = () => push({ title: 'Alert cancelled by caller', tone: 'warn', href: '/dashboard/admin' });

    socket.on('sos:status_update', onCallerStatus);
    if (isAdmin) {
      socket.on('emergency:alert', onNewAlert);
      socket.on('sos:vendor_status_update', onVendorStatus);
      socket.on('sos:vendor_assigned', onVendorAssigned);
      socket.on('emergency:escalated', onEscalated);
      socket.on('emergency:resolved', onResolved);
      socket.on('emergency:cancelled', onCancelled);
    }

    return () => {
      socket.off('sos:status_update', onCallerStatus);
      socket.off('emergency:alert', onNewAlert);
      socket.off('sos:vendor_status_update', onVendorStatus);
      socket.off('sos:vendor_assigned', onVendorAssigned);
      socket.off('emergency:escalated', onEscalated);
      socket.off('emergency:resolved', onResolved);
      socket.off('emergency:cancelled', onCancelled);
    };
  }, [socket, user, push]);

  if (!toasts.length) return null;

  return (
    // Top-right: the SOS button owns bottom-right, and must never be covered.
    <div
      className="fixed top-20 right-4 z-[90] flex flex-col gap-2 w-[min(22rem,calc(100vw-2rem))]"
      role="status"
      aria-live="polite"
    >
      {toasts.map(t => (
        <div key={t.id} className={`border rounded-xl shadow-lg p-3 text-sm ${TONES[t.tone]}`}>
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-snug">{t.title}</p>
              {t.body && <p className="text-xs opacity-80 mt-0.5 break-words">{t.body}</p>}
              {t.href && (
                <a href={t.href} className="text-xs font-semibold underline mt-1 inline-block">
                  Open dashboard
                </a>
              )}
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="shrink-0 opacity-60 hover:opacity-100 font-bold px-1"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
