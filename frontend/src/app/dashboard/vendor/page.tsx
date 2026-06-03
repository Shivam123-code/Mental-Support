'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Truck, MapPin, Power, PowerOff, Bell, BellOff, CheckCircle,
  XCircle, Clock, AlertTriangle, Navigation, Phone, User,
  Loader2, RefreshCw, LogOut, ChevronRight, Shield, Map
} from 'lucide-react';

type DispatchStatus = 'VENDOR_ALERTED' | 'VENDOR_ACCEPTED' | 'EN_ROUTE' | 'RESOLVED' | 'PENDING';

interface Assignment {
  id: string;
  latitude: number;
  longitude: number;
  severity: string;
  message: string;
  dispatchStatus: DispatchStatus;
  vendorAssignedAt: string;
  vendorAcceptedAt?: string;
  createdAt: string;
  user?: { firstName?: string; lastName?: string; email?: string; phone?: string };
}

interface VendorProfile {
  businessName: string;
  serviceType: string;
  phone: string;
  isOnline: boolean;
  isAvailable: boolean;
  latitude?: number;
  longitude?: number;
  locationUpdatedAt?: string;
}

// ── Incoming dispatch alert (WebSocket push) ─────────────────────────────────
interface IncomingDispatch {
  alertId: string;
  latitude: number;
  longitude: number;
  severity: string;
  message: string;
  timeoutSeconds: number;
}

export default function VendorDashboard() {
  return (
    <ProtectedRoute allowedRoles={['VENDOR']}>
      <VendorDashboardContent />
    </ProtectedRoute>
  );
}

function VendorDashboardContent() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [history, setHistory] = useState<Assignment[]>([]);
  const [incomingDispatch, setIncomingDispatch] = useState<IncomingDispatch | null>(null);
  const [dispatchCountdown, setDispatchCountdown] = useState(30);
  const [accepting, setAccepting] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  // ── Fetch profile + assignments ───────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [profileRes, assignRes] = await Promise.all([
        fetch('/api/vendor/status', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/vendor/assignments', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const profileData = await profileRes.json();
      const assignData = await assignRes.json();

      if (profileData.success) {
        setProfile(profileData.data);
        setIsOnline(profileData.data.isOnline);
      }
      if (assignData.success) {
        setActiveAssignment(assignData.data.active?.[0] || null);
        setHistory(assignData.data.history || []);
      }
    } catch (err) {
      console.error('Fetch vendor data error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── WebSocket for incoming dispatches ─────────────────────────────────────
  useEffect(() => {
    if (!token || !user?.id) return;
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    let socketInstance: any = null; // track for cleanup

    import('socket.io-client').then(({ io }) => {
      socketInstance = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

      socketInstance.on('connect', () => {
        socketInstance.emit('authenticate', { userId: user.id, role: 'VENDOR', token });
      });

      socketInstance.on('vendor:dispatch', (data: IncomingDispatch) => {
        console.log('🚨 Incoming dispatch:', data);
        setIncomingDispatch(data);
        setDispatchCountdown(data.timeoutSeconds || 30);
      });

      socketInstance.on('vendor:dispatch_expired', () => {
        setIncomingDispatch(null);
      });

      socketInstance.on('vendor:accept_confirmed', () => {
        setAccepting(false);
        setIncomingDispatch(null);
        fetchData();
      });

      socketInstance.on('vendor:case_resolved', () => {
        setActiveAssignment(null);
        fetchData();
      });

      setSocket(socketInstance);
    });

    // Proper cleanup — runs when component unmounts or deps change
    return () => {
      socketInstance?.disconnect();
      setSocket(null);
    };
  }, [token, user?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dispatch countdown timer ──────────────────────────────────────────────
  // Only depends on incomingDispatch — a single interval self-manages the tick
  useEffect(() => {
    if (!incomingDispatch) {
      setDispatchCountdown(30);
      return;
    }
    const t = setInterval(() => {
      setDispatchCountdown(c => {
        if (c <= 1) {
          clearInterval(t);
          setIncomingDispatch(null);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [incomingDispatch]); // ← do NOT add dispatchCountdown here

  // ── Toggle Online/Offline ─────────────────────────────────────────────────
  const toggleOnline = async () => {
    if (!token) return;
    setTogglingOnline(true);
    try {
      const newState = !isOnline;
      const res = await fetch('/api/vendor/status', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: newState }),
      });
      const data = await res.json();
      if (data.success) setIsOnline(data.data.isOnline);
    } catch (err) {
      console.error('Toggle online error:', err);
    } finally {
      setTogglingOnline(false);
    }
  };

  // ── Share Location ─────────────────────────────────────────────────────────
  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch('/api/vendor/location', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token!}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });
          const data = await res.json();
          if (data.success) {
            setProfile(p => p ? { ...p, latitude, longitude, locationUpdatedAt: new Date().toISOString() } : p);
          }
        } catch (err) {
          setLocationError('Failed to save location. Please try again.');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationError('Location access denied. Please allow browser location access.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // ── Accept dispatch ───────────────────────────────────────────────────────
  const acceptDispatch = () => {
    if (!socket || !incomingDispatch || !user?.id) return;
    setAccepting(true);
    socket.emit('vendor:accept', { alertId: incomingDispatch.alertId, vendorId: user.id });
  };

  const declineDispatch = () => {
    if (!socket || !incomingDispatch || !user?.id) return;
    socket.emit('vendor:decline', { alertId: incomingDispatch.alertId, vendorId: user.id });
    setIncomingDispatch(null);
  };

  const severityColors: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-300',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* ── INCOMING DISPATCH MODAL ──────────────────────────────────────── */}
      {incomingDispatch && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Alert header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl animate-bounce">🚨</span>
                <div>
                  <h2 className="text-xl font-bold">EMERGENCY DISPATCH</h2>
                  <p className="text-red-200 text-sm">Someone needs help near you</p>
                </div>
              </div>
              {/* Countdown bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-red-200">Auto-decline in</span>
                  <span className="font-bold text-white text-lg">{dispatchCountdown}s</span>
                </div>
                <div className="w-full bg-red-800 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(dispatchCountdown / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className={`rounded-xl border p-3 text-sm ${severityColors[incomingDispatch.severity] || 'bg-gray-50 border-gray-200'}`}>
                <span className="font-bold uppercase tracking-wide text-xs">Severity: {incomingDispatch.severity}</span>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Location</p>
                  <p className="font-mono text-sm font-semibold">{incomingDispatch.latitude.toFixed(5)}, {incomingDispatch.longitude.toFixed(5)}</p>
                  <a
                    href={`https://maps.google.com/?q=${incomingDispatch.latitude},${incomingDispatch.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"
                  >
                    <Map size={12} /> Open in Google Maps
                  </a>
                </div>
              </div>
              {incomingDispatch.message && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-800">{incomingDispatch.message}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={declineDispatch}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  <XCircle size={16} /> Decline
                </button>
                <button
                  onClick={acceptDispatch}
                  disabled={accepting}
                  className="flex-[2] py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {accepting
                    ? <><Loader2 size={16} className="animate-spin" /> Accepting...</>
                    : <><CheckCircle size={16} /> ACCEPT DISPATCH</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP NAV ───────────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-gray-900 border-b border-[var(--outline-variant)] px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Truck size={20} className="text-orange-600" />
            </div>
            <div>
              <h1 className="font-bold text-[var(--on-surface)] text-sm sm:text-base">
                {profile?.businessName || 'Vendor Dashboard'}
              </h1>
              <p className="text-xs text-[var(--on-surface-variant)]">{profile?.serviceType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Online indicator */}
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <button onClick={logout} className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] p-2 rounded-lg transition">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STATUS + LOCATION CARDS ──────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Online/Offline toggle */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[var(--on-surface)]">Dispatch Status</h2>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                  {isOnline ? 'You are visible to the dispatch system' : 'Go online to receive SOS alerts'}
                </p>
              </div>
              <button
                onClick={toggleOnline}
                disabled={togglingOnline}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 disabled:opacity-60 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${isOnline ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className={`text-center py-4 rounded-xl ${isOnline ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              {isOnline
                ? <><Power size={28} className="text-green-600 mx-auto mb-2" /><p className="text-green-700 font-semibold text-sm">You're Online</p><p className="text-green-600 text-xs">Watching for nearby SOS alerts...</p></>
                : <><PowerOff size={28} className="text-gray-400 mx-auto mb-2" /><p className="text-gray-600 font-semibold text-sm">You're Offline</p><p className="text-gray-500 text-xs">Toggle above to go online</p></>
              }
            </div>
          </div>

          {/* Location card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[var(--on-surface)]">Your Location</h2>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                  {profile?.locationUpdatedAt
                    ? `Updated ${new Date(profile.locationUpdatedAt).toLocaleTimeString()}`
                    : 'Location not shared yet'}
                </p>
              </div>
              <button
                onClick={shareLocation}
                disabled={locationLoading}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition disabled:opacity-60"
              >
                {locationLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                {locationLoading ? 'Locating...' : 'Share Location'}
              </button>
            </div>

            {locationError && (
              <div className="text-xs text-red-600 bg-red-50 rounded-lg p-2 mb-3">{locationError}</div>
            )}

            {profile?.latitude && profile?.longitude ? (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-orange-600" />
                  <span className="text-xs font-semibold text-orange-800">Location Active</span>
                </div>
                <p className="font-mono text-xs text-orange-900">
                  {profile.latitude.toFixed(5)}, {profile.longitude.toFixed(5)}
                </p>
                <a
                  href={`https://maps.google.com/?q=${profile.latitude},${profile.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"
                >
                  <Map size={11} /> View on map
                </a>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
                <MapPin size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No location saved</p>
                <p className="text-xs text-gray-400">Click "Share Location" above</p>
              </div>
            )}
          </div>
        </div>

        {/* ── ACTIVE ASSIGNMENT ─────────────────────────────────────────────── */}
        {activeAssignment && (
          <div className="card border-2 border-orange-400 bg-orange-50/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-orange-600" />
              <h2 className="font-bold text-orange-800">Active Assignment</h2>
              <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full border ${severityColors[activeAssignment.severity] || 'bg-gray-100'}`}>
                {activeAssignment.severity}
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3 flex items-start gap-3">
                <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-mono text-sm font-semibold">{activeAssignment.latitude.toFixed(5)}, {activeAssignment.longitude.toFixed(5)}</p>
                  <a
                    href={`https://maps.google.com/?q=${activeAssignment.latitude},${activeAssignment.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-0.5 flex items-center gap-1"
                  >
                    <Map size={11} /> Navigate
                  </a>
                </div>
              </div>

              {activeAssignment.user && (
                <div className="bg-white rounded-xl p-3 flex items-start gap-3">
                  <User size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Person in need</p>
                    <p className="font-semibold text-sm">
                      {activeAssignment.user.firstName} {activeAssignment.user.lastName}
                    </p>
                    {activeAssignment.user.phone && (
                      <a href={`tel:${activeAssignment.user.phone}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {activeAssignment.user.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {activeAssignment.message && (
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-800">{activeAssignment.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500">Status</p>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">{activeAssignment.dispatchStatus.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY ──────────────────────────────────────────────────────── */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--on-surface)]">Assignment History</h2>
            <button onClick={fetchData} className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] p-1.5 rounded-lg transition">
              <RefreshCw size={16} />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <Shield size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-[var(--on-surface-variant)]">No past assignments yet</p>
              <p className="text-xs text-gray-400 mt-1">Go online and share your location to start receiving SOS alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-[var(--surface-container)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${a.dispatchStatus === 'RESOLVED' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <p className="text-xs font-semibold text-[var(--on-surface)]">{a.severity} Alert</p>
                      <p className="text-xs text-[var(--on-surface-variant)]">{new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--on-surface-variant)] uppercase">{a.dispatchStatus.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
