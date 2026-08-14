/**
 * Payment provider seam.
 *
 * The gateway is not wired up yet, but the flow around it has to be built and
 * tested now — so the dummy provider is not a stub that returns success. It
 * issues a reference, hands back a checkout URL, and when that checkout is
 * completed it POSTs a signed webhook to this app exactly as Razorpay or Stripe
 * would. Every line of code that will run in production runs today; only this
 * file changes when the real keys arrive.
 *
 * The one rule the whole design rests on: the browser can never move a payment
 * to PAID. A client that can mark itself paid is a client that never pays.
 */

import crypto from 'node:crypto';

export type WebhookOutcome = 'PAID' | 'FAILED';

export interface WebhookEvent {
  /** The provider's own id for the payment, matched against PaymentIntent.providerRef. */
  providerRef: string;
  outcome: WebhookOutcome;
  /** Smallest currency unit, echoed back so a tampered amount can be caught. */
  amount: number;
  currency: string;
  reason?: string;
}

export interface CheckoutRequest {
  intentId: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
}

export interface PaymentProvider {
  readonly name: string;
  /** Open a payment on the provider's side and return where to send the payer. */
  createCheckout(req: CheckoutRequest): Promise<{ providerRef: string; checkoutUrl: string }>;
  /**
   * Verify a webhook came from the provider and decode it. Returns null when the
   * signature does not check out — the caller must treat that as a forgery and
   * never look at the body.
   */
  parseWebhook(rawBody: string, headers: Headers): WebhookEvent | null;
}

/** Header the signature travels in. Razorpay uses x-razorpay-signature. */
export const SIGNATURE_HEADER = 'x-payment-signature';

export function webhookSecret(): string {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) throw new Error('PAYMENT_WEBHOOK_SECRET is not set');
  return secret;
}

export function sign(rawBody: string, secret = webhookSecret()): string {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

/**
 * Constant-time comparison. A plain `===` on a signature leaks how many leading
 * bytes were right through response timing, which is enough to forge one.
 */
function signatureMatches(expected: string, given: string): boolean {
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(given, 'utf8');
  // timingSafeEqual throws on a length mismatch, so that has to be checked
  // first — but length alone tells an attacker nothing here.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dummy provider
// ─────────────────────────────────────────────────────────────────────────────

const dummy: PaymentProvider = {
  name: 'dummy',

  async createCheckout(req) {
    return {
      // Prefixed like a real one so a reference is recognisable in the logs and
      // in the database long after the provider is swapped.
      providerRef: `dummy_${crypto.randomBytes(12).toString('hex')}`,
      checkoutUrl: `/checkout/${req.intentId}`,
    };
  },

  parseWebhook(rawBody, headers) {
    const given = headers.get(SIGNATURE_HEADER);
    if (!given) return null;
    if (!signatureMatches(sign(rawBody), given)) return null;

    let body: any;
    try { body = JSON.parse(rawBody); } catch { return null; }

    const outcome: WebhookOutcome | null =
      body?.event === 'payment.captured' ? 'PAID' :
      body?.event === 'payment.failed' ? 'FAILED' : null;

    if (!outcome) return null;
    if (typeof body.providerRef !== 'string' || !body.providerRef) return null;
    if (!Number.isInteger(body.amount)) return null;
    if (typeof body.currency !== 'string') return null;

    return {
      providerRef: body.providerRef,
      outcome,
      amount: body.amount,
      currency: body.currency,
      reason: typeof body.reason === 'string' ? body.reason : undefined,
    };
  },
};

const PROVIDERS: Record<string, PaymentProvider> = { dummy };

export function getProvider(): PaymentProvider {
  const name = process.env.PAYMENT_PROVIDER || 'dummy';
  const provider = PROVIDERS[name];
  if (!provider) throw new Error(`Unknown PAYMENT_PROVIDER "${name}"`);
  return provider;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────────────────────

/** Everything is held in the smallest unit — paise, not rupees. */
export const CURRENCY = process.env.PAYMENT_CURRENCY || 'INR';

/** What one auto-match costs, in the smallest unit. */
export function automatchPrice(): number {
  const raw = Number(process.env.AUTOMATCH_PRICE_MINOR);
  return Number.isInteger(raw) && raw > 0 ? raw : 49900; // ₹499
}

/** Whether matching is behind the paywall at all. Off unless explicitly on. */
export function automatchRequiresPayment(): boolean {
  return process.env.AUTOMATCH_REQUIRES_PAYMENT === 'true';
}

/** ₹499.00 from 49900, for anything shown to a human. */
export function formatMinor(minor: number, currency = CURRENCY): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(minor / 100);
}
