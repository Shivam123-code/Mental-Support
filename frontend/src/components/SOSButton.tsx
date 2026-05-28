'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmergencySOS } from '@/hooks/useSocket';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGeoErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission denied. Please allow location access in your browser settings, then try again.';
    case error.POSITION_UNAVAILABLE:
      return 'Your location could not be determined. Please enter your location manually or try again.';
    case error.TIMEOUT:
      return 'Location request timed out. Please check your GPS signal and try again.';
    default:
      return 'Could not get your location. Please try again.';
  }
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  // GeolocationPositionError — has .code and .message
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in (error as object)
  ) {
    return new Error(getGeoErrorMessage(error as GeolocationPositionError));
  }
  // Socket server error objects: { error: string, details: string }
  if (error && typeof error === 'object' && 'error' in error) {
    const e = error as { error: string; details?: string };
    return new Error(e.details || e.error || 'Unknown error from server');
  }
  if (typeof error === 'string') return new Error(error);
  return new Error('An unexpected error occurred. Please call emergency services directly.');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SOSButton() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'locating' | 'sending' | 'success' | 'error'>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  // Fallback manual coordinates if GPS fails
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const { sendSOS, isConnected, isAuthenticated: socketAuth } = useEmergencySOS(
    user?.id,
    user?.role,
    token || undefined
  );

  const resetModal = useCallback(() => {
    setStep('form');
    setErrorMsg('');
    setMessage('');
    setSeverity('CRITICAL');
    setUseManualLocation(false);
    setManualLat('');
    setManualLng('');
  }, []);

  const handleClose = useCallback(() => {
    if (step === 'locating' || step === 'sending') return; // don't close mid-send
    setIsOpen(false);
    resetModal();
  }, [step, resetModal]);

  if (!isAuthenticated) return null;

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => reject(err),          // GeolocationPositionError — handled by normalizeError
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleSendSOS = async () => {
    try {
      // ── Step 1: Get location ──
      let coords: { latitude: number; longitude: number };

      if (useManualLocation) {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);
        if (isNaN(lat) || isNaN(lng)) {
          setErrorMsg('Please enter valid latitude and longitude coordinates.');
          setStep('error');
          return;
        }
        coords = { latitude: lat, longitude: lng };
      } else {
        setStep('locating');
        try {
          coords = await getLocation();
        } catch (geoErr) {
          // GPS failed → show error but offer manual fallback
          const msg = normalizeError(geoErr).message;
          setErrorMsg(msg);
          setStep('error');
          setUseManualLocation(true); // offer manual next time
          return;
        }
      }

      // ── Step 2: Send SOS ──
      setStep('sending');

      if (!isConnected || !socketAuth) {
        throw new Error(
          'Emergency server is not connected. Please ensure you are online and try again, or call emergency services directly.'
        );
      }

      await sendSOS({
        latitude: coords.latitude,
        longitude: coords.longitude,
        message: message || 'Emergency SOS activated',
        severity,
      });

      // ── Step 3: Success ──
      setStep('success');
      setTimeout(() => {
        setIsOpen(false);
        resetModal();
      }, 3000);

    } catch (error) {
      const normalized = normalizeError(error);
      console.error('SOS Error:', normalized.message, error);
      setErrorMsg(normalized.message);
      setStep('error');
    }
  };

  const severityConfig = {
    CRITICAL: { label: 'Critical', activeClass: 'bg-red-600 text-white', icon: '🔴' },
    HIGH:     { label: 'High',     activeClass: 'bg-orange-500 text-white', icon: '🟠' },
    MEDIUM:   { label: 'Medium',   activeClass: 'bg-yellow-500 text-white', icon: '🟡' },
  } as const;

  const isBusy = step === 'locating' || step === 'sending';

  return (
    <>
      {/* ── Floating SOS Button ── */}
      <button
        id="sos-floating-btn"
        onClick={() => { resetModal(); setIsOpen(true); }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-lg transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse-slow"
        style={{ boxShadow: '0 0 0 0 rgba(220,38,38,0.4)', animation: 'sos-pulse 2s infinite' }}
        title="Emergency SOS"
        aria-label="Emergency SOS"
      >
        SOS
      </button>

      <style>{`
        @keyframes sos-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(220,38,38,0.5); }
          70%  { box-shadow: 0 0 0 12px rgba(220,38,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
        }
      `}</style>

      {/* ── Modal ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🚨</span>
                <div>
                  <h2 className="text-xl font-bold">Emergency SOS</h2>
                  <p className="text-red-100 text-xs mt-0.5">
                    Your location & message will reach our response team instantly
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">

              {/* ── SUCCESS state ── */}
              {step === 'success' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Alert Sent!</h3>
                  <p className="text-gray-600">
                    Your emergency alert has been received. Our team is responding now.
                  </p>
                  <p className="text-sm text-gray-400 mt-3">This window will close automatically…</p>
                </div>
              )}

              {/* ── LOCATING state ── */}
              {step === 'locating' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Your Location…</h3>
                  <p className="text-gray-500 text-sm">Please allow location access if prompted</p>
                </div>
              )}

              {/* ── SENDING state ── */}
              {step === 'sending' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sending Emergency Alert…</h3>
                  <p className="text-gray-500 text-sm">Notifying emergency response team</p>
                </div>
              )}

              {/* ── ERROR state ── */}
              {step === 'error' && (
                <div className="py-2">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <div className="flex gap-3">
                      <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
                      <div>
                        <p className="font-semibold text-red-800 text-sm mb-1">Could not send alert</p>
                        <p className="text-red-700 text-sm">{errorMsg}</p>
                      </div>
                    </div>
                  </div>

                  {/* Manual location fallback */}
                  {useManualLocation && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        📍 Enter your location manually to send SOS:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            placeholder="e.g. 28.6139"
                            value={manualLat}
                            onChange={(e) => setManualLat(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            placeholder="e.g. 77.2090"
                            value={manualLng}
                            onChange={(e) => setManualLng(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Find your coordinates at{' '}
                        <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">
                          maps.google.com
                        </a>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setStep('form'); setUseManualLocation(false); }}
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                    >
                      Try GPS Again
                    </button>
                    {useManualLocation && (
                      <button
                        onClick={handleSendSOS}
                        disabled={!manualLat || !manualLng}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                      >
                        Send with Manual Location
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── FORM state ── */}
              {step === 'form' && (
                <>
                  {/* Connection status */}
                  <div className={`mb-4 p-3 rounded-xl flex items-center justify-between text-sm ${
                    isConnected && socketAuth
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <span className="text-gray-600 font-medium">Emergency Server</span>
                    <span className={`flex items-center gap-1.5 font-semibold ${
                      isConnected && socketAuth ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isConnected && socketAuth ? 'bg-green-500 animate-pulse' : 'bg-amber-400'
                      }`} />
                      {isConnected && socketAuth ? 'Connected' : isConnected ? 'Authenticating…' : 'Connecting…'}
                    </span>
                  </div>

                  {/* Severity */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Severity Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(severityConfig) as Array<keyof typeof severityConfig>).map((key) => {
                        const cfg = severityConfig[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setSeverity(key)}
                            className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-1 ${
                              severity === key
                                ? cfg.activeClass + ' shadow-md scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {cfg.icon} {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Details <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your situation (e.g. 'panic attack', 'chest pain', 'unsafe situation')…"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                      rows={3}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      disabled={isBusy}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      id="sos-send-btn"
                      onClick={handleSendSOS}
                      disabled={isBusy}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      🚨 Send SOS Alert
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    For life-threatening emergencies, also call{' '}
                    <a href="tel:112" className="text-red-500 font-semibold">112</a>{' '}
                    or{' '}
                    <a href="tel:1800-599-0019" className="text-red-500 font-semibold">iCall</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
