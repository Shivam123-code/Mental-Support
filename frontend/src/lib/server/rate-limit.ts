/**
 * Simple in-memory IP-based rate limiter.
 * No external dependencies required — works out of the box.
 * Uses a sliding-window approach per IP address.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

// ponytail: process-local store. Ceiling — limits are per-instance, so the
// effective cap is max × instance_count and every cold start resets counters.
// Upgrade path: swap this Map for Redis/Upstash (same rateLimit signature)
// before running more than one instance.
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

/**
 * Check if an IP is within its allowed rate limit.
 * @param key      Unique key: combine route + IP (e.g. "login:1.2.3.4")
 * @param max      Maximum allowed requests in the window
 * @param windowMs Window duration in milliseconds
 * @returns { allowed: boolean, retryAfterSeconds: number }
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request in window, or window has expired — reset
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= max) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
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
