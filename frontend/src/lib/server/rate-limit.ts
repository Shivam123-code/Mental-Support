/**
 * Rate limiting, shared across instances when Redis is available.
 *
 * This used to be a process-local Map, which meant the effective cap was
 * max × instance_count and every cold start reset the counters. On a serverless
 * or multi-instance deployment that is not a slightly weaker limit — it is
 * close to no limit at all, and the limit this exists for is login brute-force
 * protection.
 *
 * Opt-in via REDIS_URL, the same variable and the same shape as the socket
 * server's adapter. Unset (the normal local setup) keeps the in-process Map and
 * behaves exactly as before, so development needs no Redis. In production
 * leaving it unset is a silent per-instance ceiling, so it says so once at
 * first use rather than letting it be discovered from an audit log.
 */

import type { RedisClientType } from 'redis';

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Local fallback store
// ─────────────────────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks.
// unref() so this timer never by itself keeps the Node process alive — without
// it, importing this module hangs any short-lived script (scripts, checks, CLI).
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);
sweeper.unref?.();

function localRateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// Redis backend
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Increment and read the remaining window in one atomic round trip.
 *
 * INCR followed by a separate EXPIRE is the usual way to write this and it is
 * wrong: if the process dies between the two, the key has no TTL and that
 * caller is limited forever. Setting the expiry inside the same script makes
 * the pair indivisible.
 */
const WINDOW_SCRIPT = `
local hits = redis.call('INCR', KEYS[1])
if hits == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
return { hits, redis.call('PTTL', KEYS[1]) }
`;

const globalForRedis = globalThis as unknown as {
  rateLimitRedis?: Promise<RedisClientType | null>;
  rateLimitWarned?: boolean;
  rateLimitRetryAt?: number;
};

/** How long to keep using the local store before trying Redis again. */
const RECONNECT_COOLDOWN_MS = 30_000;
const CONNECT_TIMEOUT_MS = 2_000;

async function connect(): Promise<RedisClientType | null> {
  const url = process.env.REDIS_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'production' && !globalForRedis.rateLimitWarned) {
      globalForRedis.rateLimitWarned = true;
      console.warn(
        '⚠️  REDIS_URL is not set. Rate limits are per-instance: the effective ' +
        'cap is max × instance_count, and a restart resets every counter. Set it ' +
        'before running more than one instance.'
      );
    }
    return null;
  }

  try {
    const { createClient } = await import('redis');
    const client = createClient({
      url,
      socket: {
        connectTimeout: CONNECT_TIMEOUT_MS,
        // node-redis retries an unreachable host forever by default, and
        // connect() does not settle while it does — which would hang every
        // request behind a misconfigured REDIS_URL. Give up and let the caller
        // fall back; the cooldown below is what tries again later.
        reconnectStrategy: retries => (retries > 3 ? false : Math.min(retries * 200, 1000)),
      },
    }) as RedisClientType;

    // A dropped connection must not take request handling down with it. Without
    // an error listener node-redis throws these as unhandled and kills the
    // process.
    client.on('error', err => console.error('[rate-limit redis]', err?.message));

    // Belt and braces: even with connectTimeout, a hung DNS lookup can stall
    // longer than any request should wait.
    await Promise.race([
      client.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('connect timed out')), CONNECT_TIMEOUT_MS + 500)
      ),
    ]);

    console.log('🔗 Rate limiter using Redis — limits span instances');
    return client;
  } catch (err: any) {
    console.error('[rate-limit] Redis unavailable, using the local store:', err?.message);
    return null;
  }
}

/**
 * One client per process, memoised on globalThis so dev hot-reload reuses it.
 *
 * A failed connection is memoised too, otherwise every request would pay the
 * timeout again — but only until the cooldown passes, so a Redis that comes
 * back is picked up rather than the process being stuck on the local store
 * until someone restarts it.
 */
function client(): Promise<RedisClientType | null> {
  const now = Date.now();
  if (globalForRedis.rateLimitRedis && (globalForRedis.rateLimitRetryAt ?? 0) > now) {
    return globalForRedis.rateLimitRedis;
  }
  if (!globalForRedis.rateLimitRedis) {
    globalForRedis.rateLimitRetryAt = Infinity; // assume success until told otherwise
    globalForRedis.rateLimitRedis = connect().then(c => {
      globalForRedis.rateLimitRetryAt = c ? Infinity : now + RECONNECT_COOLDOWN_MS;
      return c;
    });
    return globalForRedis.rateLimitRedis;
  }
  // Cooldown has passed on a previously failed connection — try once more.
  globalForRedis.rateLimitRedis = undefined;
  return client();
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether a caller is within its allowed rate.
 *
 * @param key      Unique key: combine route + IP or user id (e.g. "login:1.2.3.4")
 * @param max      Maximum allowed requests in the window
 * @param windowMs Window duration in milliseconds
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  // Disabled on the local dev server. Testing a login means mistyping a password
  // a few times, and a 15-minute lockout on your own machine only ever blocks
  // you. Gated on 'development', which `next dev` sets and `next start` does not,
  // so a real deployment keeps every limit — including the login brute-force
  // protection this exists for.
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const redis = await client();
  if (!redis) return localRateLimit(key, max, windowMs);

  try {
    const [hits, ttlMs] = (await redis.eval(WINDOW_SCRIPT, {
      keys: [`rl:${key}`],
      arguments: [String(windowMs)],
    })) as [number, number];

    if (hits > max) {
      // A negative TTL means no expiry was set — treat it as a full window
      // rather than reporting "retry in -1 seconds".
      return { allowed: false, retryAfterSeconds: Math.ceil((ttlMs > 0 ? ttlMs : windowMs) / 1000) };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  } catch (err: any) {
    // Redis is down. Fall back to the local store rather than failing the
    // request: locking every caller out of login because a cache is unreachable
    // is a worse outcome than a per-instance limit, and this is still a limit.
    console.error('[rate-limit] Redis check failed, using the local store:', err?.message);
    return localRateLimit(key, max, windowMs);
  }
}

/**
 * Number of reverse proxies between the public internet and this app
 * (e.g. 1 for a single nginx/Vercel edge). Override with TRUSTED_PROXY_COUNT.
 */
const TRUSTED_PROXY_COUNT = Math.max(1, Number(process.env.TRUSTED_PROXY_COUNT) || 1);

/**
 * Extract the client IP from a Next.js request.
 *
 * X-Forwarded-For is append-only: each proxy appends the address that connected
 * to it, so entries are [spoofable..., real client, our proxies...]. Reading the
 * LEFTMOST entry — as this previously did — reads whatever the caller invented,
 * letting anyone mint a fresh rate-limit bucket per request and bypass every
 * limit including login brute-force protection.
 *
 * We instead index back from the right by the number of proxies we actually
 * operate; everything to the left of that is attacker-controlled and ignored.
 */
export function getClientIp(request: Request): string {
  const forwarded = (request.headers as Headers).get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map(p => p.trim()).filter(Boolean);
    // With N trusted proxies the real client sits at index length - N.
    const ip = parts[parts.length - TRUSTED_PROXY_COUNT];
    if (ip) return ip;
  }
  return (request.headers as Headers).get('x-real-ip') ?? 'unknown';
}
