'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users, Calendar, Wallet, Star, Clock, BookOpen, ArrowRight, Shield,
  Bell, Settings, Sparkles, LayoutDashboard, ShieldAlert, BookCheck,
  Heart, Globe, CheckCircle, Menu, X, Save, Plus, ArrowUpRight,
  MessageSquare, AlertCircle, FileText, ChevronRight, Check, Brain
} from 'lucide-react';
import ChangePasswordCard from '@/components/ChangePasswordCard';
import Chat from '@/components/Chat';
import VideoCall from '@/components/VideoCall';

export default function ProfessionalDashboard() {
  return (
    <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
      <ProfessionalDashboardContent />
    </ProtectedRoute>
  );
}

function ProfessionalDashboardContent() {
  const { user, logout } = useAuth();
  
  // Interactive States
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // Verification Toggle for testing
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [emergencyAvailability, setEmergencyAvailability] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notifications State
  // Real notifications. Bookings, status changes and messages have been writing
  // these rows for a while; nothing read them, so this list was four invented
  // alerts about people who do not exist.
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // ── Sessions and clients, from the database ────────────────────────────────
  // These were fixtures with invented people, so nothing this panel showed or
  // saved existed anywhere. Both now derive from real Booking rows: the same
  // rows the client sees on their own dashboard.
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const initialsOf = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '??';

  /** A Booking as this panel wants to read it. */
  const toSession = (b: any) => {
    const at = new Date(b.scheduledAt);
    const name = b.client?.name ?? 'Client';
    return {
      id: b.id,
      clientId: b.client?.id ?? null,
      clientName: name,
      initials: initialsOf(name),
      time: at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: at.toLocaleDateString(),
      scheduledAt: b.scheduledAt,
      type: b.sessionType === 'video' ? 'Video call' : b.sessionType === 'audio' ? 'Audio call' : 'Chat session',
      category: b.sessionType === 'chat' ? 'Chat session' : 'Session',
      duration: `${b.duration} mins`,
      goal: b.userNotes || '',
      notes: b.professionalNotes || '',
      nextStep: '',
      priority: 'Medium',
      status: b.status,
      meetingLink: b.meetingLink,
      isPaid: b.isPaid,
      amount: b.amount,
      currency: b.currency,
    };
  };

  const loadSessions = async () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t) { setSessionsLoading(false); return; }
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const res = await fetch('/api/bookings?scope=all&limit=100', { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not load sessions');
      const mapped = (data.data.items || []).map(toSession);
      setSessions(mapped);
      // Keep the current selection if it still exists, otherwise pick the
      // soonest upcoming session rather than a hardcoded id.
      setSelectedSessionId(prev =>
        mapped.some((s: any) => s.id === prev) ? prev : (mapped[0]?.id ?? '')
      );
    } catch (err: any) {
      setSessionsError(err?.message ?? 'Could not load sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => { loadSessions(); }, []);

  /**
   * Clients are whoever actually has sessions with this professional — derived,
   * never a separate list that can drift out of step with the bookings.
   */
  const clients = (() => {
    const byClient = new Map<string, any>();
    for (const s of sessions) {
      if (!s.clientId) continue;
      const seen = byClient.get(s.clientId);
      const when = new Date(s.scheduledAt).getTime();
      if (!seen) {
        byClient.set(s.clientId, {
          id: s.clientId, name: s.clientName, initials: s.initials,
          total: 1, completed: s.status === 'COMPLETED' ? 1 : 0,
          lastSession: when, upcoming: s.status === 'PENDING' || s.status === 'CONFIRMED' ? 1 : 0,
        });
      } else {
        seen.total += 1;
        if (s.status === 'COMPLETED') seen.completed += 1;
        if (s.status === 'PENDING' || s.status === 'CONFIRMED') seen.upcoming += 1;
        if (when > seen.lastSession) seen.lastSession = when;
      }
    }
    return [...byClient.values()]
      .sort((a, b) => b.lastSession - a.lastSession)
      .map(c => ({ ...c, lastSessionLabel: new Date(c.lastSession).toLocaleDateString() }));
  })();

  // Circles / Workshops State
  // Circles and resources come from the database. Both were fixtures whose
  // joined counts and download counts no action could ever change.
  const [circles, setCircles] = useState<any[]>([]);
  const [circlesLoading, setCirclesLoading] = useState(true);

  // Create Circle Form State
  const [newCircleTitle, setNewCircleTitle] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');
  const [newCircleTime, setNewCircleTime] = useState('');
  const [newCircleCap, setNewCircleCap] = useState(15);
  const [newCircleType, setNewCircleType] = useState('Support Circle');

  // Resources State
  const [resources, setResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resUrl, setResUrl] = useState('');

  // Add Resource Form State
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('Boundaries');
  const [resType, setResType] = useState('PDF Guide');

  // AI Assistant insights
  // AI insights are switched off. What sat here was three fabricated clinical
  // assessments naming invented clients ("stress levels appear elevated",
  // "burnout pattern alert") — the kind of statement a professional could act
  // on. Nothing generates these, so the tab says so instead of inventing them.
  const [aiInsights] = useState<any[]>([]);

  // Reviews State
  // The tab showed a fixed 4.9 "calculated over 42 reviews" and two invented
  // testimonials, on a platform where no review had ever been collected. These
  // come from the Review table now, and read 0 when there are none.
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingSummary, setRatingSummary] = useState({ average: 0, total: 0 });
  const [verification, setVerification] = useState<string>('');

  // Settings State
  // Settings read from and write to the real profile. These were defaults every
  // professional saw, and nothing edited here reached the directory clients
  // search.
  // The public-facing half of the profile. The API has always accepted these;
  // nothing in the UI ever sent them, so the directory showed placeholders.
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [sessionModes, setSessionModes] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState(0);

  const [pricing, setPricing] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [languages, setLanguages] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [profileSaving, setProfileSaving] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  // Handle toast notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper for notification colors
  // Keyed on the NotificationType enum the database actually stores.
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SYSTEM_ALERT': return 'border-red-200 bg-red-50 text-red-700';
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_REMINDER': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'MESSAGE_RECEIVED': return 'border-indigo-200 bg-indigo-50 text-indigo-700';
      default: return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  /** Relative time, so "2 hours ago" is computed rather than written down. */
  const timeAgo = (iso: string) => {
    const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    return new Date(iso).toLocaleDateString();
  };

  // Save session notes. This used to update local state only, so the note was
  // gone on refresh and the client's side never reflected anything.
  const handleSaveNotes = async (id: string, notes: string, nextStep: string) => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t) return;
    // The next step belongs with the note; there is no separate column for it.
    const body = nextStep ? `${notes}\n\nNext step: ${nextStep}` : notes;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ professionalNotes: body }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Save failed');
      setSessions(prev => prev.map(s => s.id === id ? { ...s, notes: body, nextStep } : s));
      triggerToast('Session notes saved 💚');
    } catch (err: any) {
      // Never claim a save that did not happen.
      triggerToast(`Could not save notes: ${err?.message ?? 'unknown error'}`);
    }
  };

  /** Move a session along. The client is notified server-side. */
  const handleSessionStatus = async (id: string, status: string) => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      setSessions(prev => prev.map(s => s.id === id ? { ...s, status: data.data.status } : s));
      triggerToast(`Session marked ${status.toLowerCase()}`);
    } catch (err: any) {
      triggerToast(`Could not update: ${err?.message ?? 'unknown error'}`);
    }
  };

  // Handle creating a support circle
  const authHeaders = () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return t ? { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` } : null;
  };

  const loadCircles = async () => {
    const h = authHeaders();
    if (!h) { setCirclesLoading(false); return; }
    setCirclesLoading(true);
    try {
      const data = await (await fetch('/api/circles?mine=true', { headers: h })).json();
      if (data.success) setCircles(data.data.items || []);
    } catch { /* leave the list as it is and show the empty state */ }
    finally { setCirclesLoading(false); }
  };

  const loadResources = async () => {
    const h = authHeaders();
    if (!h) { setResourcesLoading(false); return; }
    setResourcesLoading(true);
    try {
      const data = await (await fetch('/api/resources?mine=true', { headers: h })).json();
      if (data.success) setResources(data.data.items || []);
    } catch { /* same */ }
    finally { setResourcesLoading(false); }
  };

  const loadNotifications = async () => {
    const h = authHeaders();
    if (!h) { setNotificationsLoading(false); return; }
    try {
      const data = await (await fetch('/api/notifications?limit=30', { headers: h })).json();
      if (data.success) setNotifications(data.data.items || []);
    } catch { /* the empty state covers it */ }
    finally { setNotificationsLoading(false); }
  };

  const loadProfile = async () => {
    const h = authHeaders();
    if (!h) { setReviewsLoading(false); return; }
    try {
      const data = await (await fetch('/api/professional/profile', { headers: h })).json();
      if (!data.success) { setReviewsLoading(false); return; }
      setPricing(data.data.hourlyRate ?? 0);
      setCurrency(data.data.currency ?? 'USD');
      setLanguages(data.data.languages ?? []);
      setSpecialties(data.data.specializations ?? []);
      setOnlineStatus(data.data.isAcceptingClients ?? true);
      setVerification(data.data.verificationStatus ?? '');
      setDisplayName(data.data.displayName ?? '');
      setBio(data.data.bio ?? '');
      setCity(data.data.city ?? '');
      setRegion(data.data.region ?? '');
      setSessionModes(data.data.sessionModes ?? []);
      setYearsExperience(data.data.yearsOfExperience ?? 0);
      // Reviews hang off the profile id, which is only known once this returns
      // — hence the chain rather than another top-level loader.
      await loadReviews(data.data.id);
    } catch {
      // The form stays on its current values; the reviews tab shows its empty
      // state rather than spinning forever.
      setReviewsLoading(false);
    }
  };

  const loadReviews = async (professionalId: string) => {
    setReviewsLoading(true);
    try {
      const data = await (await fetch(`/api/reviews?professionalId=${professionalId}&limit=50`)).json();
      if (data.success) {
        setReviews(data.data.items || []);
        setRatingSummary({ average: data.data.averageRating ?? 0, total: data.data.totalReviews ?? 0 });
      }
    } catch { /* the empty state covers it */ }
    finally { setReviewsLoading(false); }
  };

  useEffect(() => { loadCircles(); loadResources(); loadNotifications(); loadProfile(); }, []);

  /** Persist whatever changed. Everything here feeds the client-facing directory. */
  const saveProfile = async (patch: Record<string, unknown>) => {
    const h = authHeaders();
    if (!h) return false;
    setProfileSaving(true);
    try {
      const res = await fetch('/api/professional/profile', {
        method: 'PATCH', headers: h, body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Save failed');
      return true;
    } catch (err: any) {
      triggerToast(`Could not save: ${err?.message ?? 'unknown error'}`);
      return false;
    } finally {
      setProfileSaving(false);
    }
  };

  const markAllRead = async () => {
    const h = authHeaders();
    if (!h) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH', headers: h, body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      triggerToast('All notifications marked read');
    } catch (err: any) {
      triggerToast(`Could not update: ${err?.message ?? 'unknown error'}`);
    }
  };

  const markOneRead = async (id: string) => {
    const h = authHeaders();
    if (!h) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    // Optimistic: the badge should drop immediately. A failed write only means
    // it comes back unread on the next load, which is the safe direction.
    await fetch('/api/notifications', { method: 'PATCH', headers: h, body: JSON.stringify({ id }) })
      .catch(() => {});
  };

  // Was local state, so a circle vanished on reload and nobody could join it.
  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleTitle || !newCircleDesc) return;
    const h = authHeaders();
    if (!h) return;
    try {
      const res = await fetch('/api/circles', {
        method: 'POST', headers: h,
        body: JSON.stringify({
          title: newCircleTitle,
          description: newCircleDesc,
          scheduleLabel: newCircleTime || null,
          capacity: newCircleCap,
          type: newCircleType,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not create circle');
      setCircles(prev => [data.data, ...prev]);
      setNewCircleTitle('');
      setNewCircleDesc('');
      setNewCircleTime('');
      triggerToast('Circle created 🌐');
    } catch (err: any) {
      triggerToast(`Could not create circle: ${err?.message ?? 'unknown error'}`);
    }
  };

  // Handle adding a resource
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle) return;
    const h = authHeaders();
    if (!h) return;
    try {
      const res = await fetch('/api/resources', {
        method: 'POST', headers: h,
        body: JSON.stringify({
          title: resTitle,
          category: resCategory,
          type: resType,
          url: resUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not publish');
      setResources(prev => [data.data, ...prev]);
      setResTitle('');
      setResUrl('');
      triggerToast('Resource published 📄');
    } catch (err: any) {
      // The old version always claimed success, even though nothing was stored.
      triggerToast(`Could not publish: ${err?.message ?? 'unknown error'}`);
    }
  };

  // Adding a specialty writes through — it changes what clients can find you by.
  const handleAddSpecialty = async () => {
    const value = newSpecialty.trim();
    if (!value || specialties.includes(value)) return;
    const next = [...specialties, value];
    if (await saveProfile({ specializations: next })) {
      setSpecialties(next);
      setNewSpecialty('');
      triggerToast('Specialization added 🛡️');
    }
  };

  const handleRemoveSpecialty = async (value: string) => {
    const next = specialties.filter(s => s !== value);
    if (await saveProfile({ specializations: next })) setSpecialties(next);
  };

  // Sidebar Items Definition
  const sidebarItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'My Sessions', icon: Calendar, badge: sessions.length.toString() },
    { label: 'Clients', icon: Users },
    { label: 'Programs', icon: BookCheck },
    { label: 'Community', icon: Globe },
    { label: 'Schedule & Availability', icon: Clock },
    { label: 'Assessments Insights', icon: Brain },
    { label: 'Resources', icon: BookOpen },
    { label: 'Earnings', icon: Wallet },
    { label: 'Reviews & Ratings', icon: Star },
    { label: 'AI Assistant', icon: Sparkles, highlight: true },
    { label: 'Trust & Verification', icon: Shield },
    { label: 'Messages', icon: MessageSquare },
    { label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.isRead).length.toString() },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4faf7] via-white to-[#edf7f3] text-[var(--on-surface)] flex font-body">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00685c] text-white px-5 py-3 rounded-2xl shadow-lg border border-[#089D8C]/20 flex items-center gap-3 animate-bounce">
          <CheckCircle size={18} />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-hairline px-4 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-display text-sm font-bold">K</div>
          <span className="font-display font-medium text-sm text-[var(--on-surface)]">KleverKlues Professional</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 flex items-center justify-center hover:bg-[var(--surface-container)] rounded-xl"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#f8fcfb] border-r border-[var(--outline-variant)]/40 flex flex-col z-40 transform transition-transform duration-300 lg:transform-none lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-[var(--outline-variant)]/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--primary-bright)] flex items-center justify-center text-white font-display font-bold text-lg shadow-md">
            K
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[var(--on-surface)] block">KleverKlues</span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--primary-bright)] block">Practice Workspace</span>
          </div>
        </div>

        {/* Sidebar Mock Verification Mode Toggle */}
        <div className="px-4 py-3 mx-4 my-3 bg-[#eff6f3] rounded-2xl border border-[var(--primary)]/10 text-center">
          <div className="text-[10px] text-[var(--on-surface-variant)] font-semibold mb-1.5 flex items-center justify-center gap-1">
            <Shield size={10} className="text-[var(--primary)]" /> System Verification Status
          </div>
          <button
            onClick={() => {
              setIsVerified(!isVerified);
              triggerToast(`Switched mock mode: ${!isVerified ? 'VERIFIED Dashboard' : 'PENDING Verification screen'}`);
            }}
            className={`w-full py-1.5 px-3 rounded-xl text-[10px] font-bold transition-all ${
              isVerified 
                ? 'bg-[var(--primary)] text-white' 
                : 'bg-amber-500 text-white'
            }`}
          >
            {isVerified ? 'Verified ✓ (Toggle Pending)' : 'Pending ⏳ (Toggle Verified)'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isSelected = activeTab === item.label && isVerified;
            return (
              <button
                key={item.label}
                disabled={!isVerified && item.label !== 'Trust & Verification'}
                onClick={() => {
                  setActiveTab(item.label);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#00685c] text-white shadow-sm"
                    : !isVerified && item.label !== 'Trust & Verification'
                      ? "text-slate-300 cursor-not-allowed"
                      : item.highlight
                        ? "text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50"
                        : "text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={15} className={isSelected ? "text-white" : "text-[var(--outline)]"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[var(--surface-container-high)] text-[var(--on-surface)]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--outline-variant)]/30 bg-[#f4faf6] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center font-bold text-xs text-[var(--primary)] shadow-sm">
              {user?.firstName ? user.firstName[0] : 'S'}
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{user?.firstName || 'Dr. Sarah'} {user?.lastName || 'Kaur'}</p>
              <span className="text-[9px] text-[var(--on-surface-variant)] flex items-center gap-1 font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full ${onlineStatus ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {onlineStatus ? 'Accepting Clients' : 'Offline'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pt-16 lg:pt-0">
        
        {/* Top Header */}
        <header className="hidden lg:flex h-16 border-b border-[var(--outline-variant)]/20 bg-white/80 backdrop-blur-md px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
              {isVerified ? `${activeTab} Workspace` : 'Verification Sanctuary'}
            </h2>
            <span className="h-4 w-px bg-[var(--outline-variant)]/50" />
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Verified Practice Mode
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Online Status Toggle */}
            <div className="flex items-center gap-2 bg-[#f4faf6] border border-[#d2ebe1] px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-semibold text-[var(--on-surface-variant)]">Practice Status:</span>
              <button 
                onClick={() => {
                  setOnlineStatus(!onlineStatus);
                  triggerToast(`Status changed to: ${!onlineStatus ? 'Online' : 'Offline'}`);
                }}
                className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold transition-all ${
                  onlineStatus ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                }`}
              >
                {onlineStatus ? 'Online' : 'Offline'}
              </button>
            </div>
            
            {/* Quick Emergency Option */}
            <button 
              onClick={() => {
                setEmergencyAvailability(!emergencyAvailability);
                triggerToast(`Emergency Availability: ${!emergencyAvailability ? 'ACTIVE' : 'INACTIVE'}`);
              }}
              className={`px-3 py-1.5 text-[9px] font-bold rounded-xl transition-all flex items-center gap-1 ${
                emergencyAvailability 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
              }`}
            >
              <AlertCircle size={10} /> {emergencyAvailability ? 'Emergency Active' : 'SOS Emergency Guard'}
            </button>
          </div>
        </header>

        {/* Core Workspace Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 lg:space-y-8 max-w-[1200px] mx-auto w-full">

          {/* ========================================================
              0. SCREEN: MOCK VERIFICATION PENDING (Visible if isVerified === false)
             ======================================================== */}
          {!isVerified ? (
            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-12">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Shield size={32} className="text-amber-500" />
                </div>
                <h1 className="text-display-xl font-display font-medium text-[var(--on-surface)]">
                  Verification Pending
                </h1>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Your credentials and license details are currently undergoing verification by our clinical review board.
                </p>
              </div>

              <div className="card bg-white p-6 space-y-4 border-hairline shadow-ambient">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3 flex items-center gap-2">
                  <Clock size={14} className="text-amber-500" /> Application Checkpoints
                </h3>

                <div className="space-y-6 relative pl-5 border-l-2 border-slate-100">
                  <div className="relative">
                    <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white">✓</span>
                    <h4 className="text-xs font-bold">Personal Profile & Specializations</h4>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Completed on registration</p>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white">✓</span>
                    <h4 className="text-xs font-bold">Clinical Qualification Documents</h4>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">License certificates & degrees uploaded successfully (File Ref: Lic-DrSarah.pdf)</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
                    <h4 className="text-xs font-bold text-amber-600">Clinical Board Review</h4>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Our medical specialists panel is confirming license validity with state authorities. Expected completion: 24-48 hours.</p>
                  </div>

                  <div className="relative opacity-50">
                    <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-200 border-2 border-white" />
                    <h4 className="text-xs font-bold">Account Activation</h4>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Full dashboard credentials and booking calendar activation</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#eff7f4] to-white border border-[var(--primary-bright)]/10 rounded-2xl text-center space-y-2">
                <h4 className="text-xs font-bold text-[var(--primary)]">Need Immediate Verification Demonstration?</h4>
                <p className="text-[10px] text-[var(--on-surface-variant)]">
                  Use the <strong className="text-[var(--primary)]">"System Verification Status"</strong> toggle on the sidebar navigation block to switch to the active workspace view.
                </p>
                <button 
                  onClick={() => setIsVerified(true)} 
                  className="px-4 py-1.5 bg-[#089D8C] text-white text-xs font-semibold rounded-lg hover:bg-[#00685c] transition-colors"
                >
                  Verify Mock User Now
                </button>
              </div>

              <div className="p-4 border border-rose-200 bg-rose-50/50 rounded-2xl space-y-2 text-center">
                <p className="text-[10px] text-rose-700 font-semibold">
                  For inquiries or immediate verification overrides, contact our Clinical Success Desk at <span className="underline">credentials@kleverklues.com</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ========================================================
                  1. TAB: OVERVIEW
                 ======================================================== */}
              {activeTab === 'Overview' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Hero Welcome Section */}
                  <div className="bg-gradient-to-br from-[#eaf4ef] via-white to-[#edf7f3] border border-[#089D8C]/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-ambient">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="chip text-xs"><Shield size={12} /> verified professional workspace</div>
                        <h1 className="text-2xl sm:text-3xl font-display font-medium text-[var(--on-surface)] leading-tight">
                          Good Morning, Dr. Sarah
                        </h1>
                        <p className="text-sm text-[var(--on-surface-variant)] max-w-xl">
                          You supported <strong className="text-[var(--primary-bright)]">12 people</strong> this week 💚 Your dedication makes a meaningful, lasting contribution.
                        </p>
                      </div>
                      <div className="bg-white/80 border border-[#00685c]/10 p-3 rounded-2xl shadow-sm text-center">
                        <span className="text-[9px] font-bold text-[var(--primary)] uppercase block tracking-wider">Human Impact Score</span>
                        <p className="text-2xl font-bold font-display text-[var(--on-surface)]">328</p>
                        <span className="text-[8px] text-[var(--on-surface-variant)] block">+14 this month</span>
                      </div>
                    </div>

                    <div className="border-t border-[var(--outline-variant)]/20 pt-4 flex flex-wrap gap-4 text-xs font-semibold text-[var(--on-surface-variant)]">
                      <div>Today's Focus:</div>
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[var(--primary-bright)] rounded-full" /> 3 Sessions Scheduled</div>
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 2 Follow-Ups Pending</div>
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 1 Community Circle Tonight</div>
                    </div>
                  </div>

                  {/* Main Grid: Schedule & Wellbeing Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Today's Schedule Panel */}
                    <div className="card space-y-4 bg-white/50 backdrop-blur-sm">
                      <div className="flex justify-between items-center border-b pb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] flex items-center gap-2">
                          <Calendar size={14} className="text-[var(--primary)]" /> Today's Schedule
                        </h3>
                        <button onClick={() => setActiveTab('My Sessions')} className="text-[10px] text-[var(--primary)] font-bold hover:underline flex items-center gap-1">
                          View All Sessions <ChevronRight size={10} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {sessionsLoading && <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">Loading your sessions…</p>}
                        {sessionsError && <p className="text-xs text-rose-600 py-6 text-center">{sessionsError}</p>}
                        {!sessionsLoading && !sessionsError && sessions.length === 0 && (
                          <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">
                            No sessions booked yet. They appear here the moment a client books one.
                          </p>
                        )}
                        {sessions.map((session) => (
                          <div key={session.id} className="p-3 bg-white border border-slate-100 rounded-2xl hover:border-[var(--primary)]/20 transition-all space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-[var(--on-surface-variant)]">
                                  {session.initials}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold">{session.clientName} <span className="text-[10px] text-slate-400 font-normal">({session.date} {session.time})</span></h4>
                                  <p className="text-[9px] text-[var(--on-surface-variant)]">{session.category}</p>
                                </div>
                              </div>
                              {/* Was a "stress level" badge invented in the fixture.
                                  Status is what the record actually holds. */}
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                session.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                session.status === 'CONFIRMED' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                session.status === 'CANCELLED' || session.status === 'NO_SHOW' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {session.status}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px] border-t border-slate-50 pt-2">
                              <span className="text-[9px] text-[var(--outline)]">{session.type} • {session.duration}</span>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    setSelectedSessionId(session.id);
                                    setActiveTab('My Sessions');
                                  }}
                                  className="px-2 py-1 bg-[#eff6f3] text-[var(--primary)] font-bold rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all"
                                >
                                  Join / Notes
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Client Wellbeing Overview */}
                    <div className="card space-y-4 bg-white/50 backdrop-blur-sm">
                      <div className="flex justify-between items-center border-b pb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] flex items-center gap-2">
                          <Heart size={14} className="text-rose-500" /> Client Wellbeing Tracker
                        </h3>
                        <button onClick={() => setActiveTab('Clients')} className="text-[10px] text-[var(--primary)] font-bold hover:underline flex items-center gap-1">
                          Manage Clients <ChevronRight size={10} />
                        </button>
                      </div>

                      {/* Stress trend, risk level and programme percentage used to
                          sit here as fixtures. They are clinical inferences with
                          no data behind them, so this shows what is actually
                          recorded: the sessions themselves. */}
                      <div className="space-y-3">
                        {clients.length === 0 ? (
                          <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">
                            No clients yet. They appear here once someone books a session with you.
                          </p>
                        ) : clients.map((c) => (
                          <div key={c.id} className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-emerald-50 text-[var(--primary)] flex items-center justify-center font-bold text-xs">
                                {c.initials}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold">{c.name}</h4>
                                <p className="text-[9px] text-[var(--on-surface-variant)]">Last session: {c.lastSessionLabel}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-right">
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[var(--outline)] block uppercase font-semibold">Sessions</span>
                                <span className="text-[10px] font-bold text-[var(--on-surface)]">{c.total}</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[var(--outline)] block uppercase font-semibold">Completed</span>
                                <span className="text-[10px] font-bold text-emerald-600">{c.completed}</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[var(--outline)] block uppercase font-semibold">Upcoming</span>
                                <span className="text-[10px] font-bold text-indigo-600">{c.upcoming}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
                        <Shield className="text-[var(--primary)] shrink-0 mt-0.5" size={14} />
                        <p className="text-[9px] text-emerald-800 leading-relaxed">
                          <strong>Privacy Safeguard Active:</strong> To align with the wellbeing blueprint, raw medical notes are private. Indicators show high-level trends under human supervision.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Program Monitoring & AI Insights Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Active Programs Overview */}
                    <div className="card space-y-4 md:col-span-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Active Programs Monitoring</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-[#eff7f4] to-white border border-[#d2ebe1] rounded-2xl space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold">Burnout Recovery Program</h4>
                              <p className="text-[9px] text-[var(--on-surface-variant)]">Active Enrollments: 4 clients</p>
                            </div>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-[var(--on-surface-variant)]">
                              <span>Average Completion</span>
                              <span className="font-bold">68%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[var(--primary)] h-full" style={{ width: '68%' }} />
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-500 italic">Mood stability: Improving trend overall</p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-indigo-50/40 to-white border border-indigo-100 rounded-2xl space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold">Anxiety Reset Course</h4>
                              <p className="text-[9px] text-[var(--on-surface-variant)]">Active Enrollments: 3 clients</p>
                            </div>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Active</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-[var(--on-surface-variant)]">
                              <span>Average Completion</span>
                              <span className="font-bold">45%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full" style={{ width: '45%' }} />
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-500 italic">Journaling consistency: 5 days/week average</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Advisor Preview */}
                    <div className="card space-y-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-indigo-600" />
                          <h3 className="text-xs font-bold text-indigo-950">AI Practice Assistant</h3>
                        </div>
                        <span className="text-[8px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">Ethical Guard</span>
                      </div>
                      <p className="text-[10px] text-indigo-900 leading-relaxed bg-white/80 p-3 rounded-2xl border border-indigo-100/50 shadow-sm">
                        Automated client insights are turned off. No analysis of your clients is
                        being run, and nothing on this dashboard is generated from their data.
                      </p>
                      <button 
                        onClick={() => setActiveTab('AI Assistant')}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-sm transition-all"
                      >
                        Review Recommendations &rarr;
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  2. TAB: MY SESSIONS
                 ======================================================== */}
              {activeTab === 'My Sessions' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold">Sessions & Practice Hub</h2>
                      <p className="text-xs text-[var(--on-surface-variant)]">Write clinician notes, join call spaces, and configure session schedules.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Sessions List */}
                    <div className="card space-y-4 lg:col-span-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Active Appointments</h3>
                      
                      <div className="space-y-3">
                        {sessions.map(s => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSessionId(s.id)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all space-y-2 ${
                              selectedSessionId === s.id 
                                ? 'border-[var(--primary)] bg-[#f4faf6]' 
                                : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] text-slate-400 font-semibold">{s.date} {s.time} ({s.duration})</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                s.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                                s.status === 'CONFIRMED' ? 'bg-indigo-50 text-indigo-700' :
                                s.status === 'CANCELLED' || s.status === 'NO_SHOW' ? 'bg-rose-50 text-rose-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {s.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[var(--on-surface)]">{s.clientName}</h4>
                            <p className="text-[10px] text-[var(--on-surface-variant)]">{s.category}</p>
                            <span className="text-[9px] uppercase font-bold text-[var(--primary-bright)] block mt-1">{s.type}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Session Editor */}
                    <div className="card lg:col-span-2 space-y-5 bg-white">
                      {(() => {
                        const activeSession = sessions.find(s => s.id === selectedSessionId);
                        if (!activeSession) return <p className="text-xs text-slate-400 text-center py-12">Select an active session to view details.</p>;
                        return (
                          <div className="space-y-5">
                            <div className="flex justify-between items-start border-b pb-3">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[var(--primary-bright)]">{activeSession.category}</span>
                                <h3 className="text-sm font-bold mt-1">Workspace for {activeSession.clientName}</h3>
                              </div>
                              {/* Real transitions. The API enforces the same rules,
                                  so these only offer what is actually allowed from
                                  the session's current status. */}
                              <div className="flex gap-2 flex-wrap justify-end">
                                {/* A call only makes sense while the session is
                                    still live and is not a chat booking. */}
                                {activeSession.type !== 'Chat session' &&
                                  ['PENDING', 'CONFIRMED'].includes(activeSession.status) && (
                                  <VideoCall
                                    bookingId={activeSession.id}
                                    label="Start call"
                                    onError={(m) => triggerToast(m)}
                                  />
                                )}
                                {activeSession.status === 'PENDING' && (
                                  <button onClick={() => handleSessionStatus(activeSession.id, 'CONFIRMED')}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all">
                                    Confirm
                                  </button>
                                )}
                                {activeSession.status === 'CONFIRMED' && (
                                  <>
                                    <button onClick={() => handleSessionStatus(activeSession.id, 'COMPLETED')}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all">
                                      Mark Completed
                                    </button>
                                    <button onClick={() => handleSessionStatus(activeSession.id, 'NO_SHOW')}
                                      className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
                                      No Show
                                    </button>
                                  </>
                                )}
                                {(activeSession.status === 'PENDING' || activeSession.status === 'CONFIRMED') && (
                                  <button onClick={() => handleSessionStatus(activeSession.id, 'CANCELLED')}
                                    className="px-3 py-1.5 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 transition-all">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 text-xs">
                              <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="text-[8px] font-bold text-[var(--outline)] uppercase block">Client&apos;s Note</span>
                                <p className="font-semibold text-slate-700 mt-1">{activeSession.goal || '—'}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="text-[8px] font-bold text-[var(--outline)] uppercase block">When</span>
                                <p className="font-semibold text-slate-700 mt-1">{activeSession.date} {activeSession.time}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="text-[8px] font-bold text-[var(--outline)] uppercase block">Payment</span>
                                <p className="font-semibold text-slate-700 mt-1">
                                  {activeSession.amount
                                    ? `${activeSession.currency} ${activeSession.amount.toFixed(2)} — ${activeSession.isPaid ? 'paid' : 'unpaid'}`
                                    : 'Not priced'}
                                </p>
                              </div>
                            </div>

                            {/* Live Interactive Notes Form */}
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const n = (form.elements.namedItem('notesText') as HTMLTextAreaElement).value;
                                const step = (form.elements.namedItem('nextStepText') as HTMLInputElement).value;
                                handleSaveNotes(activeSession.id, n, step);
                              }}
                              className="space-y-4"
                            >
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block">Clinical Notes & Supportive Observations</label>
                                <textarea
                                  name="notesText"
                                  defaultValue={activeSession.notes}
                                  placeholder="Write private observations here. Recommended to keep brief and focused on support actions rather than heavy diagnostic overload..."
                                  rows={4}
                                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block">Recommended Next Steps & Exercises</label>
                                <input
                                  type="text"
                                  name="nextStepText"
                                  defaultValue={activeSession.nextStep}
                                  placeholder="e.g. Complete Box Breathing guide, read boundaries article"
                                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                                />
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl hover:bg-[#00685c] flex items-center gap-1.5 transition-all shadow-sm"
                                >
                                  <Save size={12} /> Save Session Record
                                </button>
                              </div>
                            </form>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  3. TAB: CLIENTS
                 ======================================================== */}
              {activeTab === 'Clients' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Client Wellbeing Registry</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Privacy-first monitoring dashboard. Focuses on support patterns, stress trends, and risk indicators.</p>
                  </div>

                  <div className="card overflow-x-auto bg-white/80">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] text-left">
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Total Sessions</th>
                          <th className="py-3 px-4">Completed</th>
                          <th className="py-3 px-4">Upcoming</th>
                          <th className="py-3 px-4">Last Session</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {clients.length === 0 && (
                          <tr><td colSpan={6} className="py-8 px-4 text-center text-[var(--on-surface-variant)]">
                            No clients yet — this fills in as people book sessions with you.
                          </td></tr>
                        )}
                        {clients.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-teal-50 text-[var(--primary)] flex items-center justify-center font-bold text-[10px]">
                                {c.initials}
                              </div>
                              {c.name}
                            </td>
                            <td className="py-3.5 px-4 font-semibold">{c.total}</td>
                            <td className="py-3.5 px-4 font-semibold text-emerald-600">{c.completed}</td>
                            <td className="py-3.5 px-4 font-semibold text-indigo-600">{c.upcoming}</td>
                            <td className="py-3.5 px-4 text-slate-400">{c.lastSessionLabel}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  const theirs = sessions.find(s => s.clientId === c.id);
                                  if (theirs) setSelectedSessionId(theirs.id);
                                  setActiveTab('My Sessions');
                                }}
                                className="px-2.5 py-1 text-[9px] font-bold bg-[#eff6f3] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded-lg transition-all"
                              >
                                View File
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100 flex items-start gap-4">
                    <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-indigo-950">Ethical AI Data Policy Alert</h4>
                      <p className="text-[10px] text-indigo-900 leading-relaxed">
                        To respect the wellbeing and emotional safety of our users, complete clinical journals are private and never exposed to the professional dashboard. Only statistical progress, burnout indicators, and voluntary mood trends are presented to ensure clinical oversight without boundary violation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  4. TAB: PROGRAMS
                 ======================================================== */}
              {activeTab === 'Programs' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Guided Programs & Course Monitoring</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Track your client's module engagement, completion milestones, and consistency.</p>
                  </div>

                  {/* Was two fixture cards naming invented clients with invented
                      engagement rates and milestones. ProgramEnrollment exists in
                      the schema but has no route yet, so there is nothing honest
                      to show here until that is wired. */}
                  <div className="card p-5 bg-white">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs">
                      <p className="font-bold text-amber-900">Not connected yet</p>
                      <p className="text-amber-800 mt-1 leading-relaxed">
                        Programme enrolments and milestones are not yet linked to this dashboard.
                        Nothing is shown here rather than sample figures, so you are never looking
                        at engagement numbers that belong to nobody.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  5. TAB: COMMUNITY
                 ======================================================== */}
              {activeTab === 'Community' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Community Leadership Dashboard</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Host wellbeing circles, moderate anonymous discussions, and direct student/professional recovery circles.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Host Circles List */}
                    <div className="card lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Your Upcoming Leadership Sessions</h3>
                      
                      {circlesLoading && <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">Loading your circles…</p>}
                      {!circlesLoading && circles.length === 0 && (
                        <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">
                          You have not opened any circles yet. Create one below and it appears here for clients to join.
                        </p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {circles.map(c => (
                          <div key={c.id} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-2.5 shadow-sm">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] uppercase font-bold text-[var(--primary)] bg-[var(--primary-fixed)] px-2 py-0.5 rounded-full">{c.type}</span>
                              {/* Real membership count, not a fixed number. */}
                              <span className={`text-[9px] font-semibold ${c.isFull ? 'text-rose-600' : 'text-slate-400'}`}>
                                {c.joined ?? 0}/{c.capacity} joined{c.isFull ? ' — full' : ''}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold">{c.title}</h4>
                            <p className="text-[10px] text-[var(--on-surface-variant)] leading-relaxed">{c.description}</p>
                            <div className="text-[10px] font-semibold text-[var(--primary)] pt-1.5 border-t border-slate-50 flex justify-between items-center">
                              <span>📅 {c.scheduleLabel || (c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : 'Time to be confirmed')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Host Form */}
                    <div className="card lg:col-span-1 bg-white space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Host New Circles / Workshop</h3>
                      
                      <form onSubmit={handleCreateCircle} className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Circle / Workshop Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Student Stress Mitigation Panel"
                            value={newCircleTitle}
                            onChange={e => setNewCircleTitle(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Focus Type</label>
                          <select 
                            value={newCircleType}
                            onChange={e => setNewCircleType(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-white"
                          >
                            <option value="Support Circle">Support Circle</option>
                            <option value="Healing Group">Healing Group</option>
                            <option value="Workshop">Workshop</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Schedule & Frequency</label>
                          <input
                            type="text"
                            placeholder="e.g. Saturday at 2:00 PM"
                            value={newCircleTime}
                            onChange={e => setNewCircleTime(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Capacity Limit</label>
                          <input
                            type="number"
                            min={5}
                            max={100}
                            value={newCircleCap}
                            onChange={e => setNewCircleCap(parseInt(e.target.value))}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Ecosystem Description</label>
                          <textarea
                            required
                            placeholder="Provide details for emotional safety and objectives..."
                            value={newCircleDesc}
                            onChange={e => setNewCircleDesc(e.target.value)}
                            rows={3}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                          />
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-[var(--primary)] hover:bg-[#00685c] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1">
                          <Plus size={14} /> Announce Support Circle
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  6. TAB: SCHEDULE & AVAILABILITY
                 ======================================================== */}
              {activeTab === 'Schedule & Availability' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Availability & Scheduling Slots</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Specify your practice hours, timezone adjustments, and emergency/crisis backups.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Weekly availability slots configuration */}
                    <div className="card lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Weekly Consultation Slots</h3>
                      
                      <div className="space-y-3">
                        {[
                          { day: 'Monday', hours: '09:00 AM — 05:00 PM', active: true },
                          { day: 'Tuesday', hours: '09:00 AM — 05:00 PM', active: true },
                          { day: 'Wednesday', hours: '10:00 AM — 07:00 PM', active: true },
                          { day: 'Thursday', hours: '09:00 AM — 05:00 PM', active: true },
                          { day: 'Friday', hours: '09:00 AM — 04:00 PM', active: true },
                          { day: 'Saturday', hours: '10:00 AM — 02:00 PM (Workshop Circles)', active: false },
                          { day: 'Sunday', hours: 'Closed', active: false },
                        ].map((d, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                defaultChecked={d.active} 
                                className="w-4 h-4 text-[var(--primary)] border-slate-300 rounded focus:ring-[var(--primary)]"
                              />
                              <span className="text-xs font-bold text-slate-700">{d.day}</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">{d.hours}</span>
                            <button className="text-[10px] text-[var(--primary)] hover:underline font-bold">Edit hours</button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button onClick={() => triggerToast('Working hours updated 📅')} className="px-4 py-2 bg-[var(--primary)] hover:bg-[#00685c] text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                          Save Changes
                        </button>
                      </div>
                    </div>

                    {/* Timezone and SOS options panel */}
                    <div className="card lg:col-span-1 space-y-4 bg-white">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Practice Timezone</label>
                          <select className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[var(--primary)]">
                            <option>UTC +05:30 (India Standard Time)</option>
                            <option>UTC -05:00 (Eastern Standard Time)</option>
                            <option>UTC +00:00 (Greenwich Mean Time)</option>
                          </select>
                        </div>

                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-red-800 uppercase flex items-center gap-1">
                              <AlertCircle size={12} /> Emergency Availability
                            </span>
                            <input 
                              type="checkbox" 
                              checked={emergencyAvailability}
                              onChange={(e) => {
                                setEmergencyAvailability(e.target.checked);
                                triggerToast(`Emergency Availability: ${e.target.checked ? 'ACTIVE' : 'INACTIVE'}`);
                              }}
                              className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500"
                            />
                          </div>
                          <p className="text-[9px] text-red-700 leading-relaxed">
                            Activating this toggle signals our automated safety system that you are open to immediate crisis/overwhelm sessions. Keep disabled if you are out of office.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  7. TAB: ASSESSMENTS INSIGHTS
                 ======================================================== */}
              {activeTab === 'Assessments Insights' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Assessment Insights Panel</h2>
                    <p className="text-xs text-[var(--on-surface-variant)] font-normal">
                      Anonymized aggregation of mental health tests taken by registered clients. Focuses on trends, not clinical diagnostic labels.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="card space-y-2 text-center p-6 bg-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Burnout Meter Trend</span>
                      <p className="text-3xl font-display font-medium text-amber-500">Moderate</p>
                      <span className="text-[10px] text-slate-400">Average risk is down 5% this month</span>
                    </div>

                    <div className="card space-y-2 text-center p-6 bg-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Anxiety Index Score</span>
                      <p className="text-3xl font-display font-medium text-emerald-500">Mild</p>
                      <span className="text-[10px] text-slate-400">Reflects stable progress across 4 clients</span>
                    </div>

                    <div className="card space-y-2 text-center p-6 bg-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Total Wellbeing Assessments</span>
                      <p className="text-3xl font-display font-medium text-[var(--primary)]">48</p>
                      <span className="text-[10px] text-slate-400">Taken this month by active registry</span>
                    </div>

                  </div>

                  {/* Summary of pattern insights */}
                  <div className="card space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Clinical Trend Analysis</h3>
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-amber-600 block uppercase">Workplace Boundary Issues</span>
                        <p className="leading-relaxed">
                          Assessments indicate a peak in stress scores on Tuesday evenings. High correlation with workload spikes. Recommended focus: somatic box breathing, task detachment practices.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-emerald-600 block uppercase">Co-Regulation Progress</span>
                        <p className="leading-relaxed">
                          Relationship wellness assessment scores show a 12% improvement post circle meetings, verifying the efficacy of support group guidance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  8. TAB: RESOURCES
                 ======================================================== */}
              {activeTab === 'Resources' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Resource & Content Center</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Upload guided exercises, anxiety logs, and recommend specific wellbeing materials to your clients.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Resources list */}
                    <div className="card lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Available Handouts</h3>
                      
                      <div className="space-y-3">
                        {resourcesLoading && <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">Loading your library…</p>}
                        {!resourcesLoading && resources.length === 0 && (
                          <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">
                            Nothing published yet. Anything you add below becomes visible to clients.
                          </p>
                        )}
                        {resources.map(r => (
                          <div key={r.id} className="p-3.5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center gap-3 hover:border-[var(--primary)]/10 transition-all shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-[var(--primary)] flex items-center justify-center">
                                <FileText size={16} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold">{r.title}</h4>
                                <span className="text-[9px] text-[var(--outline)]">{r.category} • {r.type}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-600 block">{r.downloads ?? 0} downloads</span>
                              {r.url && (
                                <a href={r.url} target="_blank" rel="noopener noreferrer"
                                  className="text-[9px] text-[var(--primary)] font-bold hover:underline">Open file</a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Resource Form */}
                    <div className="card lg:col-span-1 bg-white space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Upload New Resource</h3>
                      
                      <form onSubmit={handleAddResource} className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Resource Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Cognitive Reframing Guide"
                            value={resTitle}
                            onChange={e => setResTitle(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Focus Category</label>
                          <select 
                            value={resCategory}
                            onChange={e => setResCategory(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[var(--primary)]"
                          >
                            <option value="Boundaries">Boundaries</option>
                            <option value="Breathwork">Breathwork</option>
                            <option value="Cognitive reframing">Cognitive reframing</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Document Type</label>
                          <select 
                            value={resType}
                            onChange={e => setResType(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[var(--primary)]"
                          >
                            <option value="PDF Guide">PDF Guide</option>
                            <option value="Audio Sheet">Audio Sheet</option>
                            <option value="Interactive PDF">Interactive PDF</option>
                          </select>
                        </div>

                        {/* There is no file upload yet, so a resource points at a
                            link. https only — the value is rendered as an anchor. */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Link (https, optional)</label>
                          <input
                            type="url"
                            value={resUrl}
                            onChange={e => setResUrl(e.target.value)}
                            placeholder="https://…"
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[var(--primary)]"
                          />
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-[var(--primary)] hover:bg-[#00685c] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1">
                          <Plus size={14} /> Publish Resource
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  9. TAB: EARNINGS
                 ======================================================== */}
              {activeTab === 'Earnings' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Earnings & Contribution Summary</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Track your consulting payout stats, circles revenue, and monthly contributions respectfully.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className="card space-y-2 bg-[#f4faf6] border-[#089D8C]/20 p-6 shadow-sm">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)]">Monthly Contribution Revenue</span>
                      <p className="text-3xl font-display font-bold text-[var(--on-surface)]">$4,090</p>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">✓ payout processed May 31</span>
                    </div>

                    <div className="card space-y-2 p-6 bg-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Individual Sessions Revenue</span>
                      <p className="text-2xl font-display font-medium text-[var(--on-surface)]">$2,840</p>
                      <span className="text-[10px] text-slate-400">Total sessions: 24 this month</span>
                    </div>

                    <div className="card space-y-2 p-6 bg-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Workshops & Group Circle Revenue</span>
                      <p className="text-2xl font-display font-medium text-[var(--on-surface)]">$1,250</p>
                      <span className="text-[10px] text-slate-400">Total workshops hosted: 4 circles</span>
                    </div>

                  </div>

                  {/* Respectful message on contributions */}
                  <div className="card p-6 bg-[#f4faf6] border border-[#089D8C]/15 space-y-3">
                    <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Your Practice Blueprint Contribution</h3>
                    <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                      At KleverKlues, we respect professional expertise and value human connection. Your contribution score represents hours of clinical assistance, community workshops hosted, and peer-to-peer mentorship guidance, ensuring respect and appreciation are at the core of our platform model.
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================
                  10. TAB: REVIEWS & RATINGS
                 ======================================================== */}
              {activeTab === 'Reviews & Ratings' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Reviews & Ratings Panel</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Verify client rating metrics and read feedback while preserving client anonymity.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="card text-center p-6 space-y-2 bg-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Average Satisfaction Rating</span>
                      {ratingSummary.total > 0 ? (
                        <>
                          <p className="text-4xl font-display font-bold text-[var(--primary)] flex items-center justify-center gap-1">
                            {ratingSummary.average.toFixed(1)} <Star size={24} className="fill-[var(--primary)] text-[var(--primary)]" />
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Across {ratingSummary.total} review{ratingSummary.total === 1 ? '' : 's'}
                          </span>
                        </>
                      ) : (
                        <>
                          <p className="text-4xl font-display font-bold text-slate-300">—</p>
                          <span className="text-[10px] text-slate-400">No reviews yet</span>
                        </>
                      )}
                    </div>

                    <div className={`card text-center p-6 space-y-2 ${verification === 'VERIFIED' ? 'bg-[#f4faf6] border-[#089D8C]/20' : 'bg-white'}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${verification === 'VERIFIED' ? 'text-[var(--primary)]' : 'text-[var(--outline)]'}`}>Clinical Verification Status</span>
                      {/* Read from the profile. It used to read "Verified Specialist"
                          for everyone, including accounts still awaiting review. */}
                      <p className={`text-base font-bold flex items-center justify-center gap-1.5 mt-2 ${verification === 'VERIFIED' ? 'text-[var(--primary)]' : 'text-slate-500'}`}>
                        {verification === 'VERIFIED'
                          ? <><CheckCircle size={16} /> Verified Specialist</>
                          : verification === 'REJECTED'
                          ? 'Not verified'
                          : 'Verification pending'}
                      </p>
                      <span className="text-[9px] text-[var(--on-surface-variant)] font-semibold uppercase">
                        {verification === 'VERIFIED' ? 'Verification active ✓' : 'Our team is reviewing your credentials'}
                      </span>
                    </div>

                    <div className="card text-center p-6 space-y-2 bg-white">
                      {/* Was a fixed "Quality Response Score 98%" that nothing
                          computed. Completed sessions is a real number the
                          dashboard already holds. */}
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Sessions Completed</span>
                      <p className="text-4xl font-display font-bold text-slate-700">
                        {sessions.filter(s => s.status === 'COMPLETED').length}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {ratingSummary.total > 0
                          ? `${ratingSummary.total} reviewed`
                          : 'Clients can review once a session is completed'}
                      </span>
                    </div>

                  </div>

                  {/* Client feedback, from the Review table */}
                  <div className="card space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Testimonials & Client Feedback</h3>

                    {reviewsLoading ? (
                      <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">Loading reviews…</p>
                    ) : reviews.length === 0 ? (
                      <div className="py-8 text-center space-y-1">
                        <p className="text-xs font-bold text-[var(--on-surface)]">No reviews yet</p>
                        <p className="text-[11px] text-[var(--on-surface-variant)]">
                          Clients are invited to leave one after you mark a session complete.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((r) => (
                          <div key={r.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(n => (
                                <Star
                                  key={n}
                                  size={12}
                                  className={n <= Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                                />
                              ))}
                              <span className="text-[10px] font-bold text-slate-500 ml-1">{r.rating.toFixed(1)}</span>
                            </div>
                            {r.comment && <p className="text-xs text-slate-600 italic">"{r.comment}"</p>}
                            <span className="text-[9px] font-bold text-[var(--outline)] block text-right">
                              — {r.author} · {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================
                  11. TAB: AI ASSISTANT
                 ======================================================== */}
              {activeTab === 'AI Assistant' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">AI Assistant for Consultants</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">AI acts as an advisor to assist you. All decisions, recommendations, and notes remain under direct human governance.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Insights lists */}
                    <div className="card lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Generated Wellbeing Alerts & Insights</h3>

                      {aiInsights.length === 0 && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs">
                          <p className="font-bold text-amber-900">Turned off</p>
                          <p className="text-amber-800 mt-1 leading-relaxed">
                            Automated client insights are not enabled. Nothing here is generated from
                            client data, and no analysis of your clients is being run.
                          </p>
                        </div>
                      )}

                    </div>

                    {/* Ethical panel */}
                    <div className="card lg:col-span-1 bg-white space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Ethical AI Framework</h3>
                      
                      <div className="space-y-3 text-[10px] text-slate-600 leading-relaxed">
                        <p>
                          <strong>1. Supportive Assistance Only:</strong> The AI model does not write clinical diagnoses. It analyzes statistical assessment trends and flags potential burnout spikes.
                        </p>
                        <p>
                          <strong>2. No Auto-Messaging:</strong> Recommendations must be explicitly approved and modified by you before being sent to clients.
                        </p>
                        <p>
                          <strong>3. Auditable Guardrails:</strong> Users are fully notified that AI assist is active, maintaining total transparent accountability.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  12. TAB: TRUST & VERIFICATION
                 ======================================================== */}
              {activeTab === 'Trust & Verification' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Trust & safety Verification Hub</h2>
                    <p className="text-xs text-[var(--on-surface-variant)] font-normal">
                      Monitor credentials checklist, access crisis escalation rules, and check child safety parameters.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Clinical Credentials */}
                    <div className="card space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Credentials & Badges Status</h3>
                      
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                          <span className="font-semibold text-emerald-800">Verified Professional badge</span>
                          <span className="text-[10px] font-bold text-emerald-600">Active ✓</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                          <span className="font-semibold text-emerald-800">State Medical Council Verification</span>
                          <span className="text-[10px] font-bold text-emerald-600">Active ✓</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                          <span className="font-semibold text-emerald-800">Child Safety Policy Consent</span>
                          <span className="text-[10px] font-bold text-emerald-600">Completed ✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Crisis escalation panel */}
                    <div className="card space-y-4 bg-rose-50/50 border-rose-200">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 border-b border-rose-100 pb-3 flex items-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-600" /> Crisis Escalation Protocols
                      </h3>
                      
                      <div className="space-y-2 text-[10px] text-rose-700 leading-relaxed font-semibold">
                        <p>
                          <strong>1. Active SOS Alert:</strong> If a client expresses immediate intent of self-harm, immediately redirect to their local emergency services using our integrated GPS SOS maps.
                        </p>
                        <p>
                          <strong>2. Escalation Action:</strong> Click the "SOS Emergency Guard" toggle to alert our operations support desk. We will dispatch local wellness responder services.
                        </p>
                        <p>
                          <strong>3. Follow-up:</strong> Submit an incident report to the platform administration board within 4 hours.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  13. TAB: NOTIFICATIONS
                 ======================================================== */}
              {activeTab === 'Notifications' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold">Notifications Center</h2>
                      <p className="text-xs text-[var(--on-surface-variant)] font-normal">Real-time alerts regarding emergency triggers, follow-ups, and bookings.</p>
                    </div>
                    <button 
                      onClick={() => {
                        markAllRead();
                      }}
                      className="text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="card space-y-3 bg-white">
                    {notificationsLoading && (
                      <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">Loading notifications…</p>
                    )}
                    {!notificationsLoading && notifications.length === 0 && (
                      <p className="text-xs text-[var(--on-surface-variant)] py-6 text-center">
                        Nothing yet. Bookings, session updates and messages appear here.
                      </p>
                    )}
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && markOneRead(n.id)}
                        className={`p-4 border rounded-2xl flex items-start gap-3 transition-all ${getNotificationColor(n.type)} ${n.isRead ? 'opacity-60' : 'cursor-pointer'}`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {n.type === 'SYSTEM_ALERT'
                            ? <AlertCircle size={16} className="text-red-500" />
                            : <Bell size={16} className="text-slate-500" />}
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold leading-tight">
                              {!n.isRead && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 align-middle" />}
                              {n.title}
                            </h4>
                            <span className="text-[9px] opacity-75 font-semibold shrink-0">{timeAgo(n.createdAt)}</span>
                          </div>
                          <p className="text-[10px] opacity-90 leading-relaxed font-normal break-words">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Messages' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-lg font-bold">Messages</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      Direct conversations with your clients. A thread opens once a session is booked.
                    </p>
                  </div>
                  <Chat />
                </div>
              )}

              {/* ========================================================
                  14. TAB: SETTINGS
                 ======================================================== */}
              {activeTab === 'Settings' && (
                <div className="space-y-6 animate-fade-in">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">Practice Settings</h2>
                    <p className="text-xs text-[var(--on-surface-variant)]">Update Specializations, pricing structures, languages spoken, and notification channels.</p>
                  </div>

                  {/* Public profile.
                      Without this there was no way to set a display name from
                      the dashboard, so every professional appeared in the client
                      directory as "Professional #c731" with no bio and no
                      location — permanently, since the API accepted these fields
                      and nothing sent them. */}
                  <div className="card space-y-4">
                    <div className="border-b pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Public Profile</h3>
                      <p className="text-[10px] text-[var(--on-surface-variant)] mt-1">
                        This is what clients see in the directory and when they are matched with you.
                      </p>
                    </div>

                    {!displayName && (
                      <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        You have no display name yet, so clients see a placeholder. Add one below.
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase text-slate-500">Display Name</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          maxLength={120}
                          placeholder="e.g. Dr. Anita Sharma"
                          className="w-full text-xs p-2.5 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase text-slate-500">Years of Experience</label>
                        <input
                          type="number"
                          min={0}
                          max={80}
                          value={yearsExperience}
                          onChange={e => setYearsExperience(Number(e.target.value) || 0)}
                          className="w-full text-xs p-2.5 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase text-slate-500">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={e => setCity(e.target.value)}
                          maxLength={80}
                          placeholder="e.g. Mumbai"
                          className="w-full text-xs p-2.5 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase text-slate-500">Region</label>
                        <select
                          value={region}
                          onChange={e => setRegion(e.target.value)}
                          className="w-full text-xs p-2.5 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)]"
                        >
                          <option value="">Select region…</option>
                          {['North India', 'South India', 'East India', 'West India', 'International'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-slate-500">Session Modes</label>
                      <div className="flex flex-wrap gap-2">
                        {['Online', 'In-person'].map(mode => {
                          const on = sessionModes.includes(mode);
                          return (
                            <button
                              key={mode}
                              onClick={() => setSessionModes(on ? sessionModes.filter(m => m !== mode) : [...sessionModes, mode])}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                                on ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-white text-slate-600 border-slate-200'
                              }`}
                            >
                              {on && '✓ '}{mode}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-slate-500">About You</label>
                      <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        placeholder="How you work, who you tend to help, what a first session looks like…"
                        className="w-full text-xs p-2.5 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)] resize-none"
                      />
                      <p className="text-[9px] text-[var(--on-surface-variant)]">{bio.length}/2000</p>
                    </div>

                    <button
                      onClick={async () => {
                        if (await saveProfile({
                          displayName: displayName.trim(),
                          bio: bio.trim(),
                          city: city.trim(),
                          region,
                          sessionModes,
                          yearsOfExperience: yearsExperience,
                        })) {
                          triggerToast('Public profile saved ✅');
                        }
                      }}
                      disabled={profileSaving}
                      className="btn-primary !py-2 !text-xs disabled:opacity-40"
                    >
                      {profileSaving ? 'Saving…' : 'Save public profile'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Specialties & languages */}
                    <div className="card lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Specializations & Languages</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-slate-500 block">Your Specializations</label>
                          <div className="flex flex-wrap gap-2">
                              {specialties.length === 0 && (
                              <span className="text-[10px] text-[var(--on-surface-variant)]">
                                None set — clients search by these, so add at least one.
                              </span>
                            )}
                            {specialties.map((spec, index) => (
                              <span key={index} className="chip text-[10px] flex items-center gap-1.5 py-1 px-3 bg-emerald-50 rounded-full font-bold">
                                {spec} 
                                <button
                                  onClick={() => handleRemoveSpecialty(spec)}
                                  disabled={profileSaving}
                                  className="text-red-500 hover:text-red-700 font-bold disabled:opacity-40"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex gap-2 pt-1.5">
                            <input
                              type="text"
                              placeholder="Add specialty e.g. Stress recovery"
                              value={newSpecialty}
                              onChange={e => setNewSpecialty(e.target.value)}
                              className="text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                            />
                            <button 
                              onClick={handleAddSpecialty}
                              className="px-3.5 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-xl"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                          <label className="text-[10px] font-bold uppercase text-slate-500 block">Supported Languages</label>
                          {/* Was display-only with no way to change it, while the
                              matcher scores heavily on language. */}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {languages.length === 0 && (
                              <span className="text-[10px] text-[var(--on-surface-variant)]">
                                None set — matching scores heavily on language.
                              </span>
                            )}
                            {languages.map((lang) => (
                              <span key={lang} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-semibold flex items-center gap-1.5">
                                {lang}
                                <button
                                  onClick={async () => {
                                    const next = languages.filter(l => l !== lang);
                                    if (next.length === 0) { triggerToast('Keep at least one language'); return; }
                                    if (await saveProfile({ languages: next })) setLanguages(next);
                                  }}
                                  disabled={profileSaving}
                                  className="text-red-500 hover:text-red-700 font-bold disabled:opacity-40"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-1.5">
                            <input
                              type="text"
                              placeholder="Add language e.g. Hindi"
                              value={newLanguage}
                              onChange={e => setNewLanguage(e.target.value)}
                              className="text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] bg-slate-50/50"
                            />
                            <button
                              disabled={profileSaving}
                              onClick={async () => {
                                const value = newLanguage.trim();
                                if (!value || languages.includes(value)) return;
                                const next = [...languages, value];
                                if (await saveProfile({ languages: next })) {
                                  setLanguages(next);
                                  setNewLanguage('');
                                  triggerToast('Language added');
                                }
                              }}
                              className="px-3.5 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-xl disabled:opacity-50"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing configuration panel */}
                    <div className="card lg:col-span-1 bg-white space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Consultation Rates</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase text-slate-500">Hourly Pricing (USD)</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-500">{currency}</span>
                            <input
                              type="number"
                              min={0}
                              value={pricing}
                              // parseInt on an emptied field yields NaN, which
                              // React renders as a blank that never recovers.
                              onChange={(e) => setPricing(Number(e.target.value) || 0)}
                              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                            />
                          </div>
                          <p className="text-[9px] text-[var(--on-surface-variant)] mt-1">
                            Sessions are priced from this rate, pro-rata by duration.
                          </p>
                        </div>

                        <button
                          disabled={profileSaving}
                          onClick={async () => {
                            if (await saveProfile({ hourlyRate: pricing })) {
                              triggerToast(`Rate saved: ${currency} ${pricing}/hr 💰`);
                            }
                          }}
                          className="w-full py-2.5 bg-[var(--primary)] hover:bg-[#00685c] text-white text-xs font-bold rounded-xl transition-all"
                        >
                          Update Rate
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ── Change Password ── */}
                <ChangePasswordCard className="mt-2" />

                </div>
              )}

            </>
          )}

        </main>
      </div>

    </div>
  );
}
