// Browser-side geocoding. Both calls go through our own /api/location/geocode
// proxy — see that route for why the browser cannot reach Nominatim directly.

export interface GeocodedAddress {
  latitude: number;
  longitude: number;
  label: string;
}

/** Coords → human label. Never throws: falls back to the coordinates themselves. */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  try {
    const res = await fetch(`/api/location/geocode?lat=${latitude}&lon=${longitude}`, {
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    return data.label || fallback;
  } catch {
    return fallback;
  }
}

/** Address → coords. Throws when the address can't be resolved. */
export async function geocodeAddress(address: string): Promise<GeocodedAddress> {
  const res = await fetch(`/api/location/geocode?q=${encodeURIComponent(address)}`, {
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error === 'Address not found'
      ? 'Address not found. Please try a different address.'
      : 'Could not look up that address. Please try again.');
  }
  return { latitude: data.latitude, longitude: data.longitude, label: data.label };
}
