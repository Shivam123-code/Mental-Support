// Self-check for the rate limiter.
//   Local store only:   npx tsx src/lib/server/rate-limit.check.ts
//   With Redis:         REDIS_URL=redis://localhost:6379 npx tsx src/lib/server/rate-limit.check.ts
//
// The limiter used to be a process-local Map, so the real cap was
// max × instance_count and a restart cleared every counter. What has to be true
// now is that with Redis configured the count lives in Redis — where another
// instance sees it — and that the key always carries an expiry, because a key
// without one limits that caller forever.
//
// NODE_ENV is forced away from 'development' below: the limiter is deliberately
// a no-op on a dev server, and a check that ran against that would pass while
// testing nothing.

import assert from 'node:assert';

// Cast because @types/node declares NODE_ENV read-only. It is a plain env var
// at runtime, and this has to be set before ./rate-limit is imported below.
(process.env as Record<string, string>).NODE_ENV = 'test';

const REDIS_URL = process.env.REDIS_URL;

let failures = 0;
const check = (ok: boolean, label: string, detail = '') => {
  console.log(`${ok ? '  ok  ' : 'FAIL  '}${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
};

async function main() {
  const { rateLimit, getClientIp } = await import('./rate-limit');
  const stamp = Date.now();

  // ── The window holds ──────────────────────────────────────────────────────
  const key = `check:basic:${stamp}`;
  for (let i = 1; i <= 3; i++) {
    const r = await rateLimit(key, 3, 60_000);
    check(r.allowed, `request ${i} of 3 is allowed`);
  }
  const blocked = await rateLimit(key, 3, 60_000);
  check(!blocked.allowed, 'the fourth is blocked');
  check(blocked.retryAfterSeconds > 0 && blocked.retryAfterSeconds <= 60,
    'it reports a sane retry-after', `${blocked.retryAfterSeconds}s`);

  // Still blocked on the next call — a limiter that forgets is not a limiter.
  check(!(await rateLimit(key, 3, 60_000)).allowed, 'it stays blocked');

  // ── Keys do not bleed into each other ─────────────────────────────────────
  check((await rateLimit(`check:other:${stamp}`, 3, 60_000)).allowed,
    'a different key has its own budget');

  // ── The window expires ────────────────────────────────────────────────────
  const shortKey = `check:short:${stamp}`;
  await rateLimit(shortKey, 1, 300);
  check(!(await rateLimit(shortKey, 1, 300)).allowed, 'the short window blocks immediately');
  await new Promise(r => setTimeout(r, 450));
  check((await rateLimit(shortKey, 1, 300)).allowed, 'and reopens once it has passed');

  // ── Client IP extraction ──────────────────────────────────────────────────
  // The rightmost entry is ours; everything to its left is caller-supplied.
  const req = new Request('http://localhost/', {
    headers: { 'x-forwarded-for': '9.9.9.9, 203.0.113.7' },
  });
  check(getClientIp(req) === '203.0.113.7',
    'a spoofed leading x-forwarded-for entry is ignored', getClientIp(req));
  check(getClientIp(new Request('http://localhost/')) === 'unknown',
    'a request with no forwarding header is not attributed to anybody');

  // ── The shared backend ────────────────────────────────────────────────────
  // Which mode this run is testing depends on REDIS_URL, so the three cases
  // (unset, reachable, unreachable) are three runs rather than one run trying
  // to re-import the module with different environments — a module that has
  // already memoised a client cannot honestly be re-tested in place.
  let reachable = false;
  if (REDIS_URL) {
    try {
      const { createClient } = await import('redis');
      const probe = createClient({ url: REDIS_URL, socket: { connectTimeout: 1500, reconnectStrategy: false } });
      probe.on('error', () => {});
      await probe.connect();
      reachable = true;

      // The counter has to be visible to a second process. This client is one:
      // it never went through rateLimit(), it just reads the key.
      const stored = await probe.get(`rl:${key}`);
      check(Number(stored) >= 4, 'the count is in Redis, where another instance sees it', String(stored));

      const ttl = await probe.pTTL(`rl:${key}`);
      check(ttl > 0, 'the key carries an expiry', `${ttl}ms`);

      // A counter another instance already advanced must be respected here.
      const sharedKey = `check:shared:${stamp}`;
      await probe.set(`rl:${sharedKey}`, '5', { PX: 60_000 });
      check(!(await rateLimit(sharedKey, 5, 60_000)).allowed,
        'a limit already reached elsewhere blocks here too');

      await probe.del([`rl:${key}`, `rl:${sharedKey}`, `rl:check:other:${stamp}`, `rl:${shortKey}`]);
      await probe.quit();
    } catch {
      reachable = false;
    }
  }

  if (!REDIS_URL) {
    console.log('  --  REDIS_URL not set; this run tested the local store only');
  } else if (!reachable) {
    // Everything above already passed against an unreachable Redis, which is
    // the property that matters: failing the request would take login down
    // because a cache is unavailable. It fell back to the local store, which is
    // still a limit — just a per-instance one.
    console.log('  --  REDIS_URL set but unreachable; the checks above ran on the local fallback');
  }

  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
