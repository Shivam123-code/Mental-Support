'use client';

/**
 * Checkout.
 *
 * Stands where the gateway's hosted page will stand. When real keys arrive the
 * intent's checkoutUrl becomes an external address and the browser leaves for
 * it instead — everything after that (the webhook, the polling below, the
 * return trip) is unchanged, which is the point of building it this way.
 *
 * Nothing here decides whether the payment succeeded. The buttons ask the test
 * gateway to act, and then this page polls the server for the answer, because
 * that is the only place the answer can come from.
 */

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Loader2, CheckCircle2, XCircle, ArrowLeft, CreditCard } from 'lucide-react';

interface Intent {
  id: string;
  purpose: string;
  amountLabel: string;
  status: 'CREATED' | 'PAID' | 'FAILED' | 'REFUNDED';
  failureReason?: string | null;
}

const PURPOSE_LABEL: Record<string, string> = {
  AUTOMATCH: 'Auto-match with a professional',
  BOOKING: 'Therapy session',
};

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const search = useSearchParams();
  // Where to send the payer afterwards. Same-origin paths only — an open
  // redirect on a payment page is a ready-made phishing hop.
  const rawReturn = search.get('return') || '/dashboard/user';
  const returnTo = rawReturn.startsWith('/') && !rawReturn.startsWith('//') ? rawReturn : '/dashboard/user';

  const [intent, setIntent] = useState<Intent | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);

  const load = async (): Promise<Intent | null> => {
    const res = await fetch(`/api/payments/intents/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Payment not found');
    setIntent(json.data);
    return json.data;
  };

  useEffect(() => {
    load()
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const pay = async (outcome: 'succeed' | 'fail') => {
    setPaying(true);
    setError('');
    try {
      const res = await fetch('/api/payments/dummy/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ intentId: id, outcome: outcome === 'fail' ? 'fail' : 'succeed' }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Payment failed');

      // Read the outcome back from the server rather than believing the button.
      // A real gateway's webhook can land after the redirect, so this polls
      // instead of assuming it has already arrived.
      for (let i = 0; i < 10; i++) {
        const fresh = await load();
        if (fresh && fresh.status !== 'CREATED') break;
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary)]" size={28} />
      </div>
    );
  }

  if (error && !intent) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <XCircle size={36} className="text-rose-500" />
        <p className="text-sm font-bold text-[var(--on-surface)]">{error}</p>
        <Link href={returnTo} className="text-xs font-semibold text-[var(--primary)] hover:underline">Go back</Link>
      </div>
    );
  }

  const paid = intent?.status === 'PAID';
  const failed = intent?.status === 'FAILED';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-xl border border-[var(--outline-variant)]/20 overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--outline-variant)]/20 bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center">
              <CreditCard size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--on-surface)]">Checkout</h1>
              <p className="text-[10px] text-[var(--on-surface-variant)]">Secure payment</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--on-surface)]">
                {PURPOSE_LABEL[intent!.purpose] ?? intent!.purpose}
              </p>
              <p className="text-[10px] text-[var(--on-surface-variant)] mt-0.5">One-time payment</p>
            </div>
            <p className="text-lg font-bold text-[var(--on-surface)] whitespace-nowrap">{intent!.amountLabel}</p>
          </div>

          {paid ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={38} className="text-emerald-500" />
              <p className="text-sm font-bold text-[var(--on-surface)]">Payment successful</p>
              <p className="text-[11px] text-[var(--on-surface-variant)] text-center">
                Your auto-match is unlocked. Head back and pick your professional.
              </p>
              <button
                onClick={() => router.push(returnTo)}
                className="mt-1 w-full py-2.5 bg-[var(--primary)] hover:bg-[#00685c] text-white text-xs font-bold rounded-xl transition-all"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              {failed && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <XCircle size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-rose-700">
                    {intent!.failureReason || 'The payment did not go through.'} Start a new payment to try again.
                  </p>
                </div>
              )}

              {/* Test mode is stated, not implied. Somebody has to be able to tell
                  at a glance whether real money is involved. */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <ShieldCheck size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-amber-800">Test mode</p>
                  <p className="text-[10px] text-amber-700">
                    No card is charged. The live gateway plugs in here without changing anything else.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700">{error}</div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => pay('succeed')}
                  disabled={paying || failed}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--primary)] hover:bg-[#00685c] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all"
                >
                  {paying ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
                  {paying ? 'Processing…' : `Pay ${intent!.amountLabel}`}
                </button>
                <button
                  onClick={() => pay('fail')}
                  disabled={paying || failed}
                  className="w-full py-2 text-[11px] font-semibold text-[var(--on-surface-variant)] hover:text-rose-600 disabled:opacity-40 transition-colors"
                >
                  Simulate a declined card
                </button>
              </div>
            </>
          )}

          <Link
            href={returnTo}
            className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] font-semibold transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </Link>
        </div>
      </div>
    </div>
  );
}
