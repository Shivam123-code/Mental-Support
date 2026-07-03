/**
 * Simple in-memory IP-based rate limiter.
 * No external dependencies required — works out of the box.
 * Uses a sliding-window approach per IP address.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

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
 * Extract the best available client IP from a Next.js request.
 */
export function getClientIp(request: Request): string {
  const forwarded = (request.headers as Headers).get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return (request.headers as Headers).get('x-real-ip') ?? 'unknown';
}
