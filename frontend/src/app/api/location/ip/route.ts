// GET /api/location/ip
// Server-side IP geolocation proxy — no CORS, no browser restrictions.
// Tries multiple services so one rate-limit never breaks the whole flow.

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Grab real client IP; on localhost this is ::1 — don't forward it to services
  const forwarded = request.headers.get('x-forwarded-for');
  const rawIp = forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || '';
  const isLocalOrPrivate =
    !rawIp || rawIp === '::1' || rawIp === '127.0.0.1' || rawIp.startsWith('192.168.') || rawIp.startsWith('10.');
  // On localhost / private network: omit IP so the service auto-detects via the outgoing request
  const ip = isLocalOrPrivate ? '' : rawIp;

  // ── 1. ipinfo.io — 50 000 req/month free, HTTPS, reliable ────────────────
  try {
    const url = ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json';
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KleverKlues-SOS/1.0' },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    // ipinfo.io returns loc as "lat,lon"
    if (data.loc) {
      const [lat, lon] = data.loc.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lon)) {
        const label = [data.city, data.region, data.country].filter(Boolean).join(', ');
        return Response.json({
          success: true,
          latitude:  lat,
          longitude: lon,
          label:     label || 'Your approximate location',
        });
      }
    }
  } catch (err) {
    console.warn('[location/ip] ipinfo.io failed:', err);
  }

  // ── 2. ip-api.com — 45 req/min free, HTTP-only but fine server-side ──────
  try {
    const url = ip
      ? `http://ip-api.com/json/${ip}?fields=lat,lon,city,regionName,country`
      : 'http://ip-api.com/json/?fields=lat,lon,city,regionName,country';
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    if (data.lat && data.lon) {
      const label = [data.city, data.regionName, data.country].filter(Boolean).join(', ');
      return Response.json({
        success: true,
        latitude:  data.lat,
        longitude: data.lon,
        label:     label || 'Your approximate location',
      });
    }
  } catch (err) {
    console.warn('[location/ip] ip-api.com failed:', err);
  }

  // ── 3. ipapi.co — 1 000/day free, HTTPS ──────────────────────────────────
  try {
    const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KleverKlues-SOS/1.0' },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (data.latitude && data.longitude) {
      const label = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
      return Response.json({
        success: true,
        latitude:  data.latitude,
        longitude: data.longitude,
        label:     label || 'Your approximate location',
      });
    }
  } catch (err) {
    console.warn('[location/ip] ipapi.co failed:', err);
  }

  return Response.json({ success: false, error: 'All location services unavailable' }, { status: 503 });
}
