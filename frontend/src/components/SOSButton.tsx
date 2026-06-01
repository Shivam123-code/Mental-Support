'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmergencySOS } from '@/hooks/useSocket';

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 'form' | 'sending' | 'success' | 'error';
type LocationAccuracy = 'detecting' | 'precise' | 'approximate' | 'address' | 'none';

interface LocationData {
  latitude: number;
  longitude: number;
  label: string;
  accuracy: LocationAccuracy;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (error && typeof error === 'object' && 'code' in error) {
    const e = error as GeolocationPositionError;
    if (e.code === 1) return new Error('Location permission denied — using approximate location instead.');
    if (e.code === 2) return new Error('Position unavailable.');
    if (e.code === 3) return new Error('Location request timed out.');
  }
  if (error && typeof error === 'object' && 'error' in error) {
    const e = error as { error: string; details?: string };
    return new Error(e.details || e.error || 'Unknown server error');
  }
  if (typeof error === 'string') return new Error(error);
  return new Error('An unexpected error occurred. Please call emergency services directly.');
}

// ─── IP Geolocation (no permission needed, always works) ──────────────────────
async function getIPLocation(): Promise<LocationData> {
  const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(8000) });
  const data = await res.json();
  if (!data.latitude || !data.longitude) throw new Error('IP location unavailable');
  const label = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    label: label || 'Your approximate location',
    accuracy: 'approximate',
  };
}

// ─── Browser GPS / WiFi geolocation ──────────────────────────────────────────
function getBrowserLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode to get a human-readable label
        let label = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const a = data.address || {};
          label = [a.suburb || a.neighbourhood, a.city || a.town || a.village, a.state]
            .filter(Boolean)
            .join(', ');
        } catch { /* keep coords as label */ }
        resolve({ latitude, longitude, label, accuracy: 'precise' });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });
}

// ─── Geocode a typed address via Nominatim ────────────────────────────────────
async function geocodeAddress(address: string): Promise<LocationData> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const data = await res.json();
  if (!data || data.length === 0) throw new Error('Address not found. Please try a different address.');
  const { lat, lon, display_name } = data[0];
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    label: display_name.split(',').slice(0, 3).join(','),
    accuracy: 'address',
  };
}

// ─── Accuracy badge config ────────────────────────────────────────────────────
const accuracyBadge: Record<LocationAccuracy, { icon: string; text: string; color: string }> = {
  detecting: { icon: '📡', text: 'Detecting location…', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  precise:   { icon: '🎯', text: 'Precise GPS location', color: 'bg-green-50 border-green-200 text-green-700' },
  approximate: { icon: '📡', text: 'Approximate location (city)', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  address:   { icon: '📍', text: 'Location by address', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  none:      { icon: '❌', text: 'No location', color: 'bg-red-50 border-red-200 text-red-700' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SOSButton() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');

  // ── Location state ──────────────────────────────────────────────────────────
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<LocationAccuracy>('detecting');
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [geoPermission, setGeoPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const gpsAttempted = useRef(false);
  const ipAttempted = useRef(false);

  // Check geolocation permission state on mount and keep it reactive
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      setGeoPermission('unknown');
      return;
    }
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      setGeoPermission(result.state as 'granted' | 'denied' | 'prompt');
      result.onchange = () => setGeoPermission(result.state as 'granted' | 'denied' | 'prompt');
    }).catch(() => setGeoPermission('unknown'));
  }, []);

  // Read token safely on client only — avoids SSR crash
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem('auth_token'));
  }, [isAuthenticated]);

  const { sendSOS, isConnected, isAuthenticated: socketAuth } = useEmergencySOS(
    user?.id,
    user?.role,
    token || undefined
  );

  // ── Start location detection when modal opens ────────────────────────────────
  const startLocationDetection = useCallback(async (permission: 'granted' | 'denied' | 'prompt' | 'unknown') => {
    setLocationAccuracy('detecting');
    gpsAttempted.current = false;
    ipAttempted.current = false;

    if (permission === 'granted') {
      // GPS already allowed — get precise location immediately, no IP needed
      try {
        const loc = await getBrowserLocation();
        setLocation(loc);
        setLocationAccuracy('precise');
      } catch {
        // GPS failed despite permission (e.g. no signal) — fall back to IP
        try {
          const ipLoc = await getIPLocation();
          setLocation(ipLoc);
          setLocationAccuracy('approximate');
        } catch {
          setLocationAccuracy('none');
        }
      }
      return;
    }

    // Permission not yet granted — fire IP immediately (always works)
    // and GPS simultaneously (may show browser prompt)
    const ipPromise = getIPLocation().then((loc) => {
      ipAttempted.current = true;
      setLocation((prev) => {
        if (prev && prev.accuracy === 'precise') return prev;
        setLocationAccuracy('approximate');
        return loc;
      });
    }).catch(() => { ipAttempted.current = true; });

    const gpsPromise = getBrowserLocation().then((loc) => {
      gpsAttempted.current = true;
      setLocation(loc);
      setLocationAccuracy('precise');
    }).catch(() => {
      gpsAttempted.current = true;
      setLocation((prev) => {
        if (!prev) setLocationAccuracy('none');
        return prev;
      });
    });

    await Promise.allSettled([ipPromise, gpsPromise]);
  }, []);

  const resetModal = useCallback(() => {
    setStep('form');
    setErrorMsg('');
    setMessage('');
    setSeverity('CRITICAL');
    setLocation(null);
    setLocationAccuracy('detecting');
    setShowAddressInput(false);
    setAddressInput('');
    setAddressError('');
    gpsAttempted.current = false;
    ipAttempted.current = false;
  }, []);

  const handleOpen = () => {
    resetModal();
    setIsOpen(true);
    // Pass current permission state so GPS-already-granted users skip IP fallback
    startLocationDetection(geoPermission);
  };

  const handleClose = useCallback(() => {
    if (step === 'sending') return;
    setIsOpen(false);
    resetModal();
  }, [step, resetModal]);

  // ── Address search ──────────────────────────────────────────────────────────
  const handleAddressSearch = async () => {
    if (!addressInput.trim()) return;
    setAddressLoading(true);
    setAddressError('');
    try {
      const loc = await geocodeAddress(addressInput.trim());
      setLocation(loc);
      setLocationAccuracy('address');
      setShowAddressInput(false);
    } catch (err) {
      setAddressError(normalizeError(err).message);
    } finally {
      setAddressLoading(false);
    }
  };

  // ── Retry GPS manually ──────────────────────────────────────────────────────
  const retryGPS = useCallback(async () => {
    setLocationAccuracy('detecting');
    try {
      const loc = await getBrowserLocation();
      setLocation(loc);
      setLocationAccuracy('precise');
      // Update permission state since user just allowed
      setGeoPermission('granted');
    } catch {
      setLocationAccuracy(location?.accuracy || 'none');
    }
  }, [location]);

  // ── Send SOS ────────────────────────────────────────────────────────────────
  const handleSendSOS = async () => {
    try {
      let finalCoords: { latitude: number; longitude: number };

      if (!location) {
        setErrorMsg('No location available. Please allow location access or enter your address.');
        setStep('error');
        return;
      }

      finalCoords = { latitude: location.latitude, longitude: location.longitude };
      setStep('sending');

      if (!isConnected || !socketAuth) {
        throw new Error('Emergency server not connected. Please check your internet and try again, or call 112 directly.');
      }

      await sendSOS({
        latitude: finalCoords.latitude,
        longitude: finalCoords.longitude,
        message: message.trim() || 'Emergency SOS activated',
        severity,
      });

      setStep('success');
      setTimeout(() => {
        setIsOpen(false);
        resetModal();
      }, 3500);

    } catch (error) {
      const normalized = normalizeError(error);
      console.error('SOS Error:', normalized.message, error);
      setErrorMsg(normalized.message);
      setStep('error');
    }
  };

  const severityConfig = {
    CRITICAL: { label: 'Critical', cls: 'bg-red-600 text-white', icon: '🔴' },
    HIGH:     { label: 'High',     cls: 'bg-orange-500 text-white', icon: '🟠' },
    MEDIUM:   { label: 'Medium',   cls: 'bg-yellow-500 text-white', icon: '🟡' },
  } as const;

  const badge = accuracyBadge[locationAccuracy];

  return (
    <>
      {/* ── Floating SOS Button ── */}
      <button
        id="sos-floating-btn"
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ animation: 'sos-pulse 2s infinite' }}
        title="Emergency SOS"
        aria-label="Emergency SOS"
      >
        SOS
      </button>

      <style>{`
        @keyframes sos-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(220,38,38,0.5); }
          70%  { box-shadow: 0 0 0 14px rgba(220,38,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
        }
      `}</style>

      {/* ── Modal ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[90vh] overflow-y-auto flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 sm:px-6 sm:py-5 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">🚨</span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Emergency SOS</h2>
                    <p className="text-red-100 text-[11px] sm:text-xs mt-0.5">
                      Alert reaches our response team instantly
                    </p>
                  </div>
                </div>
                {step !== 'sending' && (
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all flex-shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 flex-1">

              {/* ── SUCCESS ── */}
              {step === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl sm:text-4xl">✅</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Alert Sent!</h3>
                  <p className="text-gray-600 text-sm">Your emergency alert has been received. Our team is responding now.</p>
                  <p className="text-xs text-gray-400 mt-3">This window will close automatically…</p>
                </div>
              )}

              {/* ── SENDING ── */}
              {step === 'sending' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sending Emergency Alert…</h3>
                  <p className="text-gray-500 text-sm">Notifying emergency response team</p>
                </div>
              )}

              {/* ── ERROR ── */}
              {step === 'error' && (
                <div className="py-2">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <div className="flex gap-3">
                      <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                      <div>
                        <p className="font-semibold text-red-800 text-sm mb-1">Error sending alert</p>
                        <p className="text-red-700 text-sm">{errorMsg}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep('form')}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleSendSOS}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* ── MAIN FORM ── */}
              {step === 'form' && (
                <div className="space-y-4">

                  {/* ── LOCATION BLOCK ── */}
                  <div className={`rounded-xl border p-3 ${badge.color}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-base flex-shrink-0 mt-0.5">{badge.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wide opacity-70">{badge.text}</p>
                          {location && (
                            <p className="text-sm font-semibold mt-0.5 truncate">{location.label}</p>
                          )}
                          {locationAccuracy === 'detecting' && (
                            <p className="text-xs mt-0.5 opacity-70">Trying GPS & network location…</p>
                          )}
                           {locationAccuracy === 'approximate' && (
                            <p className="text-xs mt-1 opacity-70">
                              Got your city via internet
                              {geoPermission !== 'granted' && (
                                <> · <button onClick={retryGPS} className="underline font-semibold">Allow GPS for precision</button></>
                              )}
                            </p>
                          )}
                          {locationAccuracy === 'none' && (
                            <p className="text-xs mt-1 opacity-80">No location found — enter address below</p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons — only show GPS button if permission not already granted */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        {locationAccuracy === 'detecting' && (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
                        )}
                        {(locationAccuracy === 'approximate' || locationAccuracy === 'none') && geoPermission !== 'granted' && (
                          <button
                            onClick={retryGPS}
                            className="text-[10px] font-bold px-2 py-1 bg-white/60 rounded-lg hover:bg-white/90 transition-all whitespace-nowrap"
                          >
                            📍 Allow GPS
                          </button>
                        )}
                        <button
                          onClick={() => setShowAddressInput(!showAddressInput)}
                          className="text-[10px] font-bold px-2 py-1 bg-white/60 rounded-lg hover:bg-white/90 transition-all whitespace-nowrap"
                        >
                          ✏️ Address
                        </button>
                      </div>
                    </div>

                    {/* Address input */}
                    {showAddressInput && (
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={addressInput}
                            onChange={(e) => setAddressInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                            placeholder="e.g. Connaught Place, New Delhi"
                            className="flex-1 px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-current"
                          />
                          <button
                            onClick={handleAddressSearch}
                            disabled={addressLoading || !addressInput.trim()}
                            className="px-3 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg text-sm font-semibold disabled:opacity-50 whitespace-nowrap"
                          >
                            {addressLoading ? '…' : 'Find'}
                          </button>
                        </div>
                        {addressError && (
                          <p className="text-xs text-red-600 mt-1.5">{addressError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── HOW WE GET LOCATION explainer (only if not precise) ── */}
                  {locationAccuracy !== 'precise' && locationAccuracy !== 'detecting' && (
                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1.5">
                      <p className="font-semibold text-gray-600 text-[11px] uppercase tracking-wide">How we find you:</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-300" />
                        <span>📱 GPS/WiFi — most accurate (needs Allow)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${locationAccuracy === 'approximate' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                        <span>📡 Internet IP — city level (always available)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${locationAccuracy === 'address' ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                        <span>✏️ Address search — type any location</span>
                      </div>
                    </div>
                  )}

                  {/* ── Emergency Server status ── */}
                  <div className={`p-3 rounded-xl flex items-center justify-between text-sm ${
                    isConnected && socketAuth ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <span className="text-gray-600 font-medium text-xs">Emergency Server</span>
                    <span className={`flex items-center gap-1.5 font-semibold text-xs ${isConnected && socketAuth ? 'text-green-700' : 'text-amber-700'}`}>
                      <span className={`w-2 h-2 rounded-full ${isConnected && socketAuth ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
                      {isConnected && socketAuth ? 'Connected' : isConnected ? 'Authenticating…' : 'Connecting…'}
                    </span>
                  </div>

                  {/* ── Severity ── */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Severity Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(severityConfig) as Array<keyof typeof severityConfig>).map((key) => {
                        const cfg = severityConfig[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setSeverity(key)}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                              severity === key ? cfg.cls + ' shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {cfg.icon} {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Message ── */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                      Details <span className="text-gray-400 font-normal normal-case">(optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your situation — panic attack, chest pain, unsafe, etc."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                      rows={2}
                    />
                  </div>

                  {/* ── Buttons ── */}
                  {!isAuthenticated ? (
                    /* Non-logged-in users: show call buttons + sign-in nudge */
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                        <p className="text-sm font-bold text-red-700 mb-1">🚨 Call Emergency Services Now</p>
                        <p className="text-xs text-red-500 mb-3">For a digital alert, sign in first. In immediate danger, call directly:</p>
                        <div className="flex gap-2">
                          <a
                            href="tel:112"
                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm text-center transition-all shadow-lg shadow-red-200"
                          >
                            📞 Call 112
                          </a>
                          <a
                            href="tel:18008914416"
                            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm text-center transition-all"
                          >
                            📞 iCall
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleClose}
                          className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
                        >
                          Close
                        </button>
                        <a
                          href="/role-selection"
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm text-center transition-all"
                        >
                          Sign In to Alert Team
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* Logged-in users: full digital SOS send */
                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        id="sos-send-btn"
                        onClick={handleSendSOS}
                        disabled={!location}
                        className="flex-2 flex-grow py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        🚨 Send SOS Alert
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-gray-400 text-center pb-1">
                    Life-threatening? Also call{' '}
                    <a href="tel:112" className="text-red-500 font-bold">112</a>
                    {' '}or{' '}
                    <a href="tel:18008914416" className="text-red-500 font-bold">Vandrevala (24×7)</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
