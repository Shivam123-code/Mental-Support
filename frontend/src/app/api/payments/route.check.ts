// Self-check for payments and paid auto-match.
//   npx tsx --env-file=.env.local src/app/api/payments/route.check.ts
//
// Three properties carry this feature, and all three are the kind that look
// fine until money is involved:
//
//   1. The browser cannot mark itself paid. Only a signed webhook can.
//   2. A redelivered webhook changes nothing. Gateways always redeliver.
//   3. One payment buys exactly one match, even under concurrent clicks.

import assert from 'node:assert';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const BASE = process.env.CHECK_BASE_URL ?? 'http://localhost:3000';
const USER = { email: 'paneluser@kleverklues.com', password: 'Panel@1234' };
const PRO = { email: 'panelpro@kleverklues.com', password: 'Panel@1234' };
const SECRET = process.env.PAYMENT_WEBHOOK_SECRET!;

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

let failures = 0;
const check = (ok: boolean, label: string, detail = '') => {
  console.log(`${ok ? '  ok  ' : 'FAIL  '}${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
};

async function login(w: { email: string; password: string }) {
  const j = await (await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(w),
  })).json();
  assert.ok(j.success, `${w.email}: ${j.error}`);
  return { token: j.data.token as string, id: j.data.user.id as string };
}
const H = (t: string) => ({ Authorization: `Bearer ${t}` });
const JH = (t: string) => ({ 'Content-Type': 'application/json', ...H(t) });

const sign = (body: string) => crypto.createHmac('sha256', SECRET).update(body).digest('hex');

/** Post a webhook the way the gateway will, raw bytes and all. */
async function webhook(body: string, signature = sign(body)) {
  return fetch(`${BASE}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-payment-signature': signature },
    body,
  });
}

/**
 * The webhook's own report, unwrapped from the API envelope. Reading `.actioned`
 * off the envelope silently yields undefined, which is falsy — so every
 * "nothing was actioned" assertion would pass without testing anything.
 */
async function webhookResult(body: string, signature = sign(body)) {
  const json = await (await webhook(body, signature)).json();
  return (json.data ?? {}) as { received?: boolean; actioned?: boolean; reason?: string };
}

async function createIntent(token: string) {
  const j = await (await fetch(`${BASE}/api/payments/intents`, {
    method: 'POST', headers: JH(token), body: JSON.stringify({ purpose: 'AUTOMATCH' }),
  })).json();
  assert.ok(j.success, `intent: ${j.error}`);
  return j.data;
}

const QUIZ = {
  concerns: ['Anxiety'],
  preferredLanguages: ['English'],
  region: 'West India',
};

async function main() {
  assert.ok(SECRET, 'PAYMENT_WEBHOOK_SECRET must be set to run this check');

  const [user, pro] = await Promise.all([login(USER), login(PRO)]);
  const intentIds: string[] = [];
  const careIds: string[] = [];
  const bookingIds: string[] = [];
  let proProfileId = '';
  let originalRate: number | null = null;
  let rateWasBorrowed = false;

  // Start from a known state: any entitlement left over from a previous run
  // would make "unpaid callers are refused" pass for the wrong reason.
  await prisma.paymentIntent.deleteMany({ where: { userId: user.id } });
  await prisma.careRelationship.deleteMany({ where: { userId: user.id } });

  try {
    const paywalled = process.env.AUTOMATCH_REQUIRES_PAYMENT === 'true';

    // ── The paywall ─────────────────────────────────────────────────────────
    if (paywalled) {
      const gated = await fetch(`${BASE}/api/professionals/match`, {
        method: 'POST', headers: JH(user.token), body: JSON.stringify(QUIZ),
      });
      const gatedBody = await gated.json();
      check(gated.status === 402, 'matching without paying is refused', `got ${gated.status}`);
      check(gatedBody.data?.paymentRequired === true, 'the refusal says payment is what is missing');
      check(typeof gatedBody.data?.amount === 'number' && gatedBody.data.amount > 0,
        'the price comes from the server', String(gatedBody.data?.amount));
    } else {
      console.log('  --  paywall off (AUTOMATCH_REQUIRES_PAYMENT is not "true"); gate checks skipped');
    }

    // ── An intent is created unpaid ─────────────────────────────────────────
    const created = await createIntent(user.token);
    intentIds.push(created.intent.id);
    check(created.intent.status === 'CREATED', 'a new payment starts unpaid', created.intent.status);
    check(!!created.checkoutUrl, 'the caller is given somewhere to pay');
    check(created.intent.amountLabel?.includes('499') ?? false,
      'the amount is shown in major units', created.intent.amountLabel);

    // Paying for it must still be refused until the money actually lands.
    if (paywalled) {
      const stillGated = await fetch(`${BASE}/api/professionals/match`, {
        method: 'POST', headers: JH(user.token), body: JSON.stringify(QUIZ),
      });
      check(stillGated.status === 402, 'an unpaid intent does not unlock anything');
    }

    // ── Only a signed webhook may settle ────────────────────────────────────
    const row = await prisma.paymentIntent.findUnique({ where: { id: created.intent.id } });
    const payload = JSON.stringify({
      event: 'payment.captured', providerRef: row!.providerRef,
      amount: row!.amount, currency: row!.currency,
    });

    check((await webhook(payload, 'not-a-real-signature')).status === 401,
      'a forged signature is rejected');
    check((await fetch(`${BASE}/api/payments/webhook`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload,
    })).status === 401, 'an unsigned webhook is rejected');

    const unchanged = await prisma.paymentIntent.findUnique({ where: { id: created.intent.id } });
    check(unchanged?.status === 'CREATED', 'a rejected webhook changes nothing');

    // A tampered amount, correctly signed. The signature proves who sent it,
    // not that the figure is the one we asked for.
    const tampered = JSON.stringify({
      event: 'payment.captured', providerRef: row!.providerRef, amount: 1, currency: row!.currency,
    });
    const tamperRes = await webhookResult(tampered);
    check(tamperRes.actioned === false, 'a signed webhook for the wrong amount is not actioned', tamperRes.reason);
    check((await prisma.paymentIntent.findUnique({ where: { id: created.intent.id } }))?.status === 'CREATED',
      'the wrong amount leaves the payment open');

    // ── The real thing ──────────────────────────────────────────────────────
    const first = await webhookResult(payload);
    check(first.actioned === true, 'a correctly signed webhook settles the payment');
    const settled = await prisma.paymentIntent.findUnique({ where: { id: created.intent.id } });
    check(settled?.status === 'PAID', 'the payment is marked paid');
    check(!!settled?.paidAt, 'when it was paid is recorded');

    // ── Redelivery ──────────────────────────────────────────────────────────
    const replay = await webhookResult(payload);
    check(replay.received === true && replay.actioned === false, 'a redelivered webhook is a no-op');

    // Concurrent redelivery — the case a read-then-write would get wrong.
    const concurrent = await Promise.all([
      webhookResult(payload), webhookResult(payload), webhookResult(payload),
    ]);
    const actioned = concurrent.filter(r => r.actioned).length;
    check(actioned === 0, 'three simultaneous redeliveries action nothing', `${actioned} actioned`);
    check(concurrent.every(r => r.received === true), 'every redelivery is still acknowledged');

    const notifications = await prisma.notification.count({
      where: { userId: user.id, title: 'Payment received', createdAt: { gte: settled!.paidAt! } },
    });
    check(notifications === 1, 'the payer is told exactly once', `${notifications} notification(s)`);

    // ── The entitlement unlocks matching ────────────────────────────────────
    const matched = await fetch(`${BASE}/api/professionals/match`, {
      method: 'POST', headers: JH(user.token), body: JSON.stringify(QUIZ),
    });
    const matchBody = await matched.json();
    check(matched.status === 200 && matchBody.success, 'a paid caller can match', matchBody.error);

    // Re-running must not cost anything: the payment buys the connection, not
    // the list.
    const again = await fetch(`${BASE}/api/professionals/match`, {
      method: 'POST', headers: JH(user.token), body: JSON.stringify(QUIZ),
    });
    check(again.status === 200, 'the quiz can be re-run on one payment');
    check((await prisma.paymentIntent.findUnique({ where: { id: created.intent.id } }))?.consumedAt === null,
      'matching does not spend the entitlement');

    // A second intent is refused while one is unspent — otherwise an impatient
    // double-click is two charges for one usable thing.
    const dup = await createIntent(user.token);
    check(dup.alreadyPaid === true && dup.intent.id === created.intent.id,
      'a caller with an unspent match is not charged again');

    // ── Spending it ─────────────────────────────────────────────────────────
    const proProfile = await prisma.professional.findUnique({ where: { userId: pro.id } });
    assert.ok(proProfile, 'the professional test account needs a profile');
    proProfileId = proProfile.id;

    // Two clicks at once. Exactly one relationship, exactly one spend.
    const races = await Promise.all([
      fetch(`${BASE}/api/care`, {
        method: 'POST', headers: JH(user.token),
        body: JSON.stringify({ professionalId: proProfile!.id, matchPercent: 88 }),
      }).then(r => r.json()),
      fetch(`${BASE}/api/care`, {
        method: 'POST', headers: JH(user.token),
        body: JSON.stringify({ professionalId: proProfile!.id, matchPercent: 88 }),
      }).then(r => r.json()),
    ]);
    const spends = races.filter(r => r.success && r.data?.entitlementSpent).length;
    check(spends === 1, 'two simultaneous choices spend one payment', `${spends} spent`);

    const rels = await prisma.careRelationship.findMany({ where: { userId: user.id } });
    rels.forEach(r => careIds.push(r.id));
    check(rels.length === 1, 'exactly one care relationship exists', `${rels.length}`);
    check(rels[0]?.matchPercent === 88, 'the match score is kept');

    const spent = await prisma.paymentIntent.findUnique({ where: { id: created.intent.id } });
    check(!!spent?.consumedAt, 'the entitlement is marked spent');

    // ── What the money bought ───────────────────────────────────────────────
    // Messaging previously needed a booking. There is no booking between these
    // two — if this fails, the caller paid to be matched with somebody they
    // cannot reach.
    const msg = await (await fetch(`${BASE}/api/messages`, {
      method: 'POST', headers: JH(user.token),
      body: JSON.stringify({ to: pro.id, content: 'Hello, matched via auto-match check.' }),
    })).json();
    check(msg.success, 'a care relationship alone allows messaging', msg.error);
    if (msg.success) await prisma.message.delete({ where: { id: msg.data.id } }).catch(() => {});

    // ── Spent means spent ───────────────────────────────────────────────────
    const other = await prisma.professional.findFirst({
      where: { verificationStatus: 'VERIFIED', isAcceptingClients: true, id: { not: proProfile!.id } },
    });
    if (other) {
      const second = await fetch(`${BASE}/api/care`, {
        method: 'POST', headers: JH(user.token), body: JSON.stringify({ professionalId: other.id }),
      });
      check(paywalled ? second.status === 402 : second.status === 201,
        paywalled ? 'a spent match cannot buy a second professional' : 'without the paywall a second choice is allowed',
        `got ${second.status}`);
      if (second.status === 201) {
        const j = await second.json();
        careIds.push(j.data.id);
      }
    } else {
      console.log('  --  only one verified professional in the database; second-spend check skipped');
    }

    // ── Someone else's payment ──────────────────────────────────────────────
    const peek = await fetch(`${BASE}/api/payments/intents/${created.intent.id}`, { headers: H(pro.token) });
    check(peek.status === 404, 'another account cannot read this payment', `got ${peek.status}`);

    const stolenPay = await fetch(`${BASE}/api/payments/dummy/pay`, {
      method: 'POST', headers: JH(pro.token), body: JSON.stringify({ intentId: created.intent.id }),
    });
    check(stolenPay.status === 404, 'another account cannot pay it either', `got ${stolenPay.status}`);

    // ── The full round trip through the test gateway ────────────────────────
    // Everything above drove the webhook directly. This drives the button the
    // way a person does, and proves the two ends are actually joined up.
    await prisma.careRelationship.deleteMany({ where: { id: { in: careIds } } });
    careIds.length = 0;

    const fresh = await createIntent(user.token);
    intentIds.push(fresh.intent.id);
    check(fresh.alreadyPaid === false, 'a spent entitlement lets a new payment start');

    const viaGateway = await (await fetch(`${BASE}/api/payments/dummy/pay`, {
      method: 'POST', headers: JH(user.token), body: JSON.stringify({ intentId: fresh.intent.id }),
    })).json();
    check(viaGateway.success && viaGateway.data.status === 'PAID',
      'the test gateway settles a payment end to end', viaGateway.error ?? viaGateway.data?.status);

    // ── A declined card ─────────────────────────────────────────────────────
    await prisma.paymentIntent.updateMany({
      where: { id: fresh.intent.id }, data: { consumedAt: new Date() },
    });
    const failing = await createIntent(user.token);
    intentIds.push(failing.intent.id);
    const declined = await (await fetch(`${BASE}/api/payments/dummy/pay`, {
      method: 'POST', headers: JH(user.token), body: JSON.stringify({ intentId: failing.intent.id, outcome: 'fail' }),
    })).json();
    check(declined.success && declined.data.status === 'FAILED', 'a declined card is recorded as failed');

    if (paywalled) {
      const afterFail = await fetch(`${BASE}/api/care`, {
        method: 'POST', headers: JH(user.token), body: JSON.stringify({ professionalId: proProfile!.id }),
      });
      check(afterFail.status === 402, 'a failed payment unlocks nothing', `got ${afterFail.status}`);
    }

    // ── Paying for a session ────────────────────────────────────────────────
    // The other purpose. Nothing in the UI drives it yet, but it is the path a
    // real gateway will be wired to first, and an untested one is a broken one.
    //
    // A professional with no hourly rate produces a booking with no price, and
    // an unpriced booking is correctly refused a payment — so give this one a
    // rate for the duration, and put it back afterwards.
    originalRate = proProfile!.hourlyRate;
    if (!originalRate) {
      await prisma.professional.update({ where: { id: proProfile!.id }, data: { hourlyRate: 1200 } });
      rateWasBorrowed = true;
    }

    const slot = new Date(Date.now() + 14 * 24 * 3600_000);
    const booked = await (await fetch(`${BASE}/api/bookings`, {
      method: 'POST', headers: JH(user.token),
      body: JSON.stringify({
        professionalId: proProfile!.id, sessionType: 'video',
        scheduledAt: slot.toISOString(), duration: 50,
      }),
    })).json();
    assert.ok(booked.success, `booking: ${booked.error}`);
    bookingIds.push(booked.data.id);

    const bookingPay = await (await fetch(`${BASE}/api/payments/intents`, {
      method: 'POST', headers: JH(user.token),
      body: JSON.stringify({ purpose: 'BOOKING', bookingId: booked.data.id }),
    })).json();
    check(bookingPay.success, 'a session payment can be started', bookingPay.error);
    const bookingIntent = bookingPay.data.intent;
    intentIds.push(bookingIntent.id);

    // The price is the booking's, not one the caller sent.
    check(bookingIntent.amount === Math.round(booked.data.amount * 100),
      'the session price comes from the booking',
      `${bookingIntent.amount} vs ${Math.round(booked.data.amount * 100)}`);

    // Somebody else's booking must not be payable.
    const notYours = await fetch(`${BASE}/api/payments/intents`, {
      method: 'POST', headers: JH(pro.token),
      body: JSON.stringify({ purpose: 'BOOKING', bookingId: booked.data.id }),
    });
    check(notYours.status === 404, 'another account cannot pay for this booking', `got ${notYours.status}`);

    await fetch(`${BASE}/api/payments/dummy/pay`, {
      method: 'POST', headers: JH(user.token), body: JSON.stringify({ intentId: bookingIntent.id }),
    });
    const paidBooking = await prisma.booking.findUnique({ where: { id: booked.data.id } });
    check(paidBooking?.isPaid === true, 'paying marks the session paid');

    const doublePay = await fetch(`${BASE}/api/payments/intents`, {
      method: 'POST', headers: JH(user.token),
      body: JSON.stringify({ purpose: 'BOOKING', bookingId: booked.data.id }),
    });
    check(doublePay.status === 409, 'a paid session cannot be paid for twice', `got ${doublePay.status}`);
  } finally {
    if (rateWasBorrowed && proProfileId) {
      await prisma.professional.update({
        where: { id: proProfileId }, data: { hourlyRate: originalRate },
      }).catch(() => {});
    }
    await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } }).catch(() => {});
    await prisma.careRelationship.deleteMany({ where: { userId: (await login(USER)).id } }).catch(() => {});
    await prisma.paymentIntent.deleteMany({ where: { id: { in: intentIds } } }).catch(() => {});
    await prisma.notification.deleteMany({
      where: { title: { in: ['Payment received', 'New client matched with you'] } },
    }).catch(() => {});
    await prisma.$disconnect();
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
