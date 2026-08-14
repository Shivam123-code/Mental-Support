import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Default-deny gate for the API surface.
 *
 * The audit found there was no central gate at all: every one of the ~37 route
 * handlers self-enforced, so a route added without an auth check was public by
 * default with nothing to catch it. This closes that gap — anything under /api
 * that is not explicitly listed as public must at least present a bearer token.
 *
 * DEFENSE IN DEPTH ONLY. This deliberately does NOT verify the signature: proxy
 * runs on the edge runtime where `jsonwebtoken` is unavailable, and Next's own
 * docs warn that proxy "should not be used as a full session management or
 * authorization solution". Real verification, session lookup, status and role
 * checks all still happen in the route via getUserFromToken/requireAdmin. The
 * value here is that an unauthenticated request to a forgotten route is rejected
 * before it reaches a handler that forgot to check.
 *
 * NOTE: in Next.js 16 this file must be named `proxy.ts`, not `middleware.ts`.
 * A file named `middleware.ts` is silently ignored.
 */

/**
 * Routes intentionally reachable without a token.
 * Exact matches, not prefixes — `/api/professionals` is public but
 * `/api/professionals/match` is not, and a prefix rule would wrongly open it.
 */
const PUBLIC_API_ROUTES = new Set([
  // Authentication entry points
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/vendor/register',
  // Unauthenticated application forms
  '/api/apply/professional',
  '/api/apply/organization',
  '/api/validate-email',
  // Public directory listing
  '/api/professionals',
  // Reviews are shown on public professional profiles, so reading them cannot
  // need an account. Writing one, and the ?pending / ?mine views, check the
  // token in the handler.
  '/api/reviews',
  // The gratitude wall is a public page. Posting to it, and the ?mine view,
  // check the token in the handler.
  '/api/gratitude',
  // Public by design: someone in crisis must reach these without an account.
  // Both read the bearer token when present, and are rate limited.
  '/api/sos',
  '/api/chat',
  '/api/location/ip',
  '/api/location/geocode',
  // A payment gateway has no account to log in with. Its HMAC signature is the
  // authentication, checked in the handler.
  '/api/payments/webhook',
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CORS preflight carries no credentials by design.
  if (request.method === 'OPTIONS') return NextResponse.next();

  // Normalise a trailing slash so "/api/sos/" cannot sidestep the allowlist.
  const path = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  if (PUBLIC_API_ROUTES.has(path)) return NextResponse.next();

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
