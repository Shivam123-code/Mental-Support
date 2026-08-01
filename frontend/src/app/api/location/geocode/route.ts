// GET /api/location/geocode?lat=&lon=  → reverse geocode (coords → label)
// GET /api/location/geocode?q=address  → forward geocode (address → coords)
//
// Server-side Nominatim proxy, same shape as /api/location/ip. The browser
// cannot call Nominatim directly for three reasons:
//   1. CSP connect-src blocks the cross-origin fetch.
//   2. OSM's usage policy requires an identifying User-Agent, which fetch()
//      refuses to set from a page.
//   3. A victim's precise GPS fix would otherwise go to a third party
//      straight from their browser, carrying a Referer header with it.

import { NextRequest } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/server/rate-limit';

const NOMINATIM = 'https://nominatim.openstreetmap.org';
const HEADERS = { 'User-Agent': 'KleverKlues-SOS/1.0' };

// ponytail: unbounded in-process Map — one entry per distinct lookup, never
// evicted, not shared across instances. It exists to collapse the dashboard
// fan-out (N vendors → N identical repeat lookups) under Nominatim's 1 req/s
// policy. Ceiling: a long-lived server with many unique coords grows this
// forever, and each instance keeps its own copy. Upgrade path when that bites:
// self-hosted Nominatim, or Redis with a TTL.
const cache = new Map<string, unknown>();

async function nominatim(path: string): Promise<any> {
  const hit = cache.get(path);
  if (hit !== undefined) return hit;
  const res = await fetch(`${NOMINATIM}${path}`, {
    headers: HEADERS,
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const data = await res.json();
  cache.set(path, data);
  return data;
}

/** Assemble the human label once, so all five call sites agree on the format. */
function toLabel(data: any): string {
  const a = data?.address || {};
  return (
    [
      a.road || a.suburb || a.neighbourhood,
      a.city || a.town || a.village || a.county,
      a.state,
    ]
      .filter(Boolean)
      .join(', ') ||
    data?.display_name?.split(',').slice(0, 3).join(',').trim() ||
    ''
  );
}

export async function GET(request: NextRequest) {
  // Public by design (the SOS flow must work without an account), so this is an
  // open relay to Nominatim unless we cap it. Generous enough for the admin
  // dashboard fan-out, tight enough that nobody proxies a scrape through us.
  const limit = rateLimit(`geocode:${getClientIp(request)}`, 60, 60_000);
  if (!limit.allowed) {
    return Response.json(
      { success: false, error: 'Too many location lookups. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const params = request.nextUrl.searchParams;
  const q = params.get('q');

  // ── Forward: address → coords ───────────────────────────────────────────
  if (q) {
    if (q.length > 200) {
      return Response.json({ success: false, error: 'Address too long' }, { status: 400 });
    }
    try {
      const data = await nominatim(`/search?q=${encodeURIComponent(q)}&format=json&limit=1`);
      if (!Array.isArray(data) || data.length === 0) {
        return Response.json({ success: false, error: 'Address not found' }, { status: 404 });
      }
      const { lat, lon, display_name } = data[0];
      return Response.json({
        success: true,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        label: display_name?.split(',').slice(0, 3).join(',').trim() || q,
      });
    } catch (err) {
      console.warn('[location/geocode] forward lookup failed:', err);
      return Response.json({ success: false, error: 'Geocoding service unavailable' }, { status: 503 });
    }
  }

  // ── Reverse: coords → label ─────────────────────────────────────────────
  // Read as raw strings first: Number(null) is 0, so a missing param would
  // otherwise pass validation and resolve to Null Island.
  const rawLat = params.get('lat');
  const rawLon = params.get('lon');
  const latitude = Number(rawLat);
  const longitude = Number(rawLon);
  if (
    rawLat === null || rawLon === null || rawLat === '' || rawLon === '' ||
    !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 || Math.abs(longitude) > 180
  ) {
    return Response.json({ success: false, error: 'Valid lat/lon or q required' }, { status: 400 });
  }

  const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  try {
    const data = await nominatim(`/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    return Response.json({ success: true, latitude, longitude, label: toLabel(data) || fallback });
  } catch (err) {
    console.warn('[location/geocode] reverse lookup failed:', err);
    // Coordinates still locate the person — degrade to them rather than fail.
    return Response.json({ success: true, latitude, longitude, label: fallback });
  }
}
