/**
 * Out-of-band notification channels for emergency dispatch.
 *
 * WHY THIS EXISTS
 * A `io.to('vendor-x').emit(...)` only lands if that vendor has a browser tab
 * open and connected. A responder driving, or with their phone in a pocket, gets
 * nothing — so the 30-second dispatch timeout was often just measuring how long
 * we waited for a tab that was never open.
 *
 * Every channel here is best-effort and must never throw into the dispatch path:
 * a failed SMS must not stop the socket ping or the next vendor.
 *
 * WIRING STATUS
 * The SMS and push drivers are interfaces with a logging fallback. Until
 * TWILIO_* / VAPID_* credentials are set, they print exactly what WOULD have
 * been sent and return false. That is deliberate — a silent no-op in an
 * emergency path is far more dangerous than a loud unconfigured warning.
 */

export interface DispatchNotice {
  alertId: string;
  severity: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  message?: string;
  expiresInSeconds?: number;
}

const smsConfigured = Boolean(
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER
);
const pushConfigured = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

let warnedSms = false;
let warnedPush = false;

function mapsLink(lat: number, lon: number): string {
  return `https://maps.google.com/?q=${lat},${lon}`;
}

/**
 * Send an SMS. Returns true only if it was actually handed to a provider.
 *
 * ponytail: logging driver only. Ceiling — no message is delivered until
 * TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER are set and the
 * marked block below is replaced with the Twilio REST call. Kept as an explicit
 * seam so dispatch logic can be built and tested without a paid account.
 */
export async function sendSms(to: string, body: string): Promise<boolean> {
  if (!to) return false;

  if (!smsConfigured) {
    if (!warnedSms) {
      console.warn('⚠️  SMS NOT CONFIGURED — set TWILIO_* env vars. Messages are logged only.');
      warnedSms = true;
    }
    console.warn(`📵 [SMS NOT SENT] → ${to}: ${body}`);
    return false;
  }

  try {
    // Provider call goes here. Kept dependency-free until credentials exist.
    const sid = process.env.TWILIO_ACCOUNT_SID!;
    const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM_NUMBER!, Body: body }),
    });
    if (!res.ok) {
      console.error(`❌ SMS failed (${res.status}) to ${to}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ SMS error:', err);
    return false;
  }
}

/**
 * Web Push to a vendor's registered subscription.
 *
 * ponytail: logging driver only. Ceiling — real delivery needs VAPID keys and a
 * push library (`web-push`); no dependency is added until that is decided.
 */
export async function sendPush(subscriptionJson: string | null, title: string, body: string): Promise<boolean> {
  if (!subscriptionJson) return false;

  if (!pushConfigured) {
    if (!warnedPush) {
      console.warn('⚠️  WEB PUSH NOT CONFIGURED — set VAPID_* env vars. Pushes are logged only.');
      warnedPush = true;
    }
    console.warn(`📵 [PUSH NOT SENT] ${title}: ${body}`);
    return false;
  }

  console.warn(`📵 [PUSH PENDING WIRING] ${title}: ${body}`);
  return false;
}

/**
 * Reach a vendor on every channel at once.
 *
 * Fan out in parallel rather than in sequence — waiting for an SMS round-trip
 * before opening the socket ping would add seconds to a dispatch.
 */
export async function notifyVendor(
  emitSocket: () => void,
  vendor: { phone?: string | null; pushSubscription?: string | null; smsOptOut?: boolean },
  notice: DispatchNotice
): Promise<void> {
  emitSocket();

  const body =
    `🚨 EMERGENCY (${notice.severity}) ${notice.distanceKm?.toFixed(1) ?? '?'}km away. ` +
    `Open the KleverKlues dashboard to accept. ${mapsLink(notice.latitude, notice.longitude)}`;

  await Promise.allSettled([
    sendPush(vendor.pushSubscription ?? null, '🚨 Emergency dispatch', body),
    vendor.smsOptOut ? Promise.resolve(false) : sendSms(vendor.phone ?? '', body),
  ]);
}

/**
 * Page whoever is on call.
 *
 * An admin dashboard nobody has open is not a notification channel. When the
 * vendor chain is exhausted this is the last automated step before a human being
 * in crisis is left with nothing, so it deliberately shouts in the logs even
 * when no provider is configured.
 */
export async function pageOnCallAdmin(notice: DispatchNotice, reason: string): Promise<void> {
  const numbers = (process.env.ONCALL_PHONE_NUMBERS ?? '')
    .split(',')
    .map(n => n.trim())
    .filter(Boolean);

  const body =
    `🚨 SOS ESCALATION (${notice.severity}): ${reason}. ` +
    `Alert ${notice.alertId} at ${mapsLink(notice.latitude, notice.longitude)}. No vendor accepted.`;

  console.error('🚨🚨 ADMIN ESCALATION 🚨🚨', body);

  if (numbers.length === 0) {
    console.error('⚠️  ONCALL_PHONE_NUMBERS is not set — nobody was paged for this escalation.');
    return;
  }

  await Promise.allSettled(numbers.map(n => sendSms(n, body)));
}

/** Notify a caller's emergency contacts. Runs alongside vendor dispatch, not after it. */
export async function notifyEmergencyContacts(
  contacts: { name?: string | null; phone?: string | null }[],
  callerName: string,
  notice: DispatchNotice
): Promise<void> {
  const body =
    `${callerName} triggered an emergency SOS on KleverKlues. ` +
    `Last known location: ${mapsLink(notice.latitude, notice.longitude)}. ` +
    `If you cannot reach them, call emergency services (112).`;

  await Promise.allSettled(
    contacts.filter(c => c.phone).map(c => sendSms(c.phone!, body))
  );
}

export const notificationStatus = {
  sms: smsConfigured,
  push: pushConfigured,
  oncall: Boolean(process.env.ONCALL_PHONE_NUMBERS),
};
