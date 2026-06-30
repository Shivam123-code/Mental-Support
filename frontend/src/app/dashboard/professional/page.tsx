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
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Crisis Escalation Alert', message: 'Client Amit K. triggered emergency resources recommendations. Immediate follow-up advised.', date: '10 mins ago', read: false, type: 'critical' },
    { id: '2', title: 'New Booking Confirmed', message: 'Rahul S. scheduled an Anxiety Support session for tomorrow 10:00 AM.', date: '2 hours ago', read: false, type: 'booking' },
    { id: '3', title: 'Program Milestone Reached', message: 'Priya M. completed Module 4 of the Burnout Recovery Program.', date: '4 hours ago', read: true, type: 'info' },
    { id: '4', title: 'Community Participant Joined', message: '5 new participants registered for your Student Burnout Workshop tonight.', date: '5 hours ago', read: true, type: 'community' },
  ]);

  // Session Notes & Management State
  const [sessions, setSessions] = useState([
    { id: 's1', clientName: 'Rahul S.', initials: 'RS', time: '10:00 AM', type: 'Video call', category: 'Anxiety Support Session', duration: '50 mins', goal: 'Establish daily boundary markers', notes: '', nextStep: '', priority: 'Medium', status: 'Scheduled' },
    { id: 's2', clientName: 'Priya M.', initials: 'PM', time: '11:30 AM', type: 'Video call', category: 'Burnout Follow-Up', duration: '50 mins', goal: 'Design work-life buffer periods', notes: 'Discussed workplace workload dynamics. Reported high fatigue.', nextStep: 'Complete burnout scale, practice box breathing', priority: 'High', status: 'Scheduled' },
    { id: 's3', clientName: 'Amit K.', initials: 'AK', time: '4:00 PM', type: 'Chat session', category: 'Parenting Guidance', duration: '30 mins', goal: 'Co-regulation techniques for bedtime anxiety', notes: '', nextStep: '', priority: 'Low', status: 'Scheduled' }
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('s1');

  // Client list data
  const [clients, setClients] = useState([
    { id: 'c1', name: 'Rahul S.', initials: 'RS', area: 'Anxiety', stressTrend: 'Improving', burnoutRisk: 'Moderate', progress: 72, mood: 'Calm', lastSession: 'May 28' },
    { id: 'c2', name: 'Priya M.', initials: 'PM', area: 'Burnout', stressTrend: 'Elevating', burnoutRisk: 'High', progress: 45, mood: 'Anxious', lastSession: 'May 30' },
    { id: 'c3', name: 'Amit K.', initials: 'AK', area: 'Family Guidance', stressTrend: 'Stable', burnoutRisk: 'Low', progress: 90, mood: 'Tired', lastSession: 'May 25' },
    { id: 'c4', name: 'Kavita R.', initials: 'KR', area: 'Stress', stressTrend: 'Improving', burnoutRisk: 'Low', progress: 60, mood: 'Content', lastSession: 'May 24' },
  ]);

  // Circles / Workshops State
  const [circles, setCircles] = useState([
    { id: 'cr1', title: 'Anxiety Support Circle', description: 'Safe space discussion on work-related anxiety and shared coping tools.', time: 'Wednesdays at 7:00 PM', capacity: 15, joined: 12, type: 'Support Circle' },
    { id: 'cr2', title: 'Emotional Healing Group', description: 'Shared reflection circle focusing on grief, life transitions, and somatic grounding.', time: 'Fridays at 6:00 PM', capacity: 10, joined: 8, type: 'Healing Group' },
    { id: 'cr3', title: 'Student Burnout Workshop', description: 'Actionable strategies for academic load mitigation, time management, and self-compassion.', time: 'Tonight at 8:00 PM', capacity: 30, joined: 24, type: 'Workshop' },
  ]);

  // Create Circle Form State
  const [newCircleTitle, setNewCircleTitle] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');
  const [newCircleTime, setNewCircleTime] = useState('');
  const [newCircleCap, setNewCircleCap] = useState(15);
  const [newCircleType, setNewCircleType] = useState('Support Circle');

  // Resources State
  const [resources, setResources] = useState([
    { id: 'r1', title: 'Building Emotional Boundaries Cheat Sheet', category: 'Boundaries', type: 'PDF Guide', downloads: 34 },
    { id: 'r2', title: '5-Minute Calm Box Breathing Instructions', category: 'Breathwork', type: 'Audio Sheet', downloads: 58 },
    { id: 'r3', title: 'Overcoming Work Anxiety Log Sheets', category: 'Cognitive reframing', type: 'Interactive PDF', downloads: 22 },
  ]);

  // Add Resource Form State
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('Boundaries');
  const [resType, setResType] = useState('PDF Guide');

  // AI Assistant insights
  const [aiInsights, setAiInsights] = useState([
    { client: 'Priya M.', text: 'Client stress levels appear elevated after work-related interactions. Consider recommending emotional boundary exercises and introducing Module 5 of the Burnout recovery program.', status: 'unread', category: 'burnout pattern alert' },
    { client: 'Rahul S.', text: 'Noticeable improvement in mood stability after starting daily journal entries. Continue monitoring consistency.', status: 'read', category: 'trend insight' },
    { client: 'Amit K.', text: 'High correlation between poor sleep rating and parenting distress logs. Consider recommending the Sleep Reset sheets.', status: 'unread', category: 'follow-up suggestion' }
  ]);

  // Settings State
  const [pricing, setPricing] = useState(120);
  const [languages, setLanguages] = useState(['English', 'Spanish']);
  const [specialties, setSpecialties] = useState(['Anxiety Support', 'Burnout Recovery', 'Parenting Guidance', 'Stress Mitigation']);
  const [newSpecialty, setNewSpecialty] = useState('');

  // Handle toast notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper for notification colors
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50 text-red-700';
      case 'booking': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      default: return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  // Handle saving session notes
  const handleSaveNotes = (id: string, notes: string, nextStep: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, notes, nextStep } : s));
    triggerToast('Session notes saved successfully 💚');
  };

  // Handle creating a support circle
  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleTitle || !newCircleDesc) return;
    const newCircle = {
      id: `cr-${Date.now()}`,
      title: newCircleTitle,
      description: newCircleDesc,
      time: newCircleTime || 'TBD',
      capacity: newCircleCap,
      joined: 0,
      type: newCircleType
    };
    setCircles(prev => [newCircle, ...prev]);
    setNewCircleTitle('');
    setNewCircleDesc('');
    setNewCircleTime('');
    triggerToast('New Support Circle created! 🌐');
  };

  // Handle adding a resource
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle) return;
    const newRes = {
      id: `r-${Date.now()}`,
      title: resTitle,
      category: resCategory,
      type: resType,
      downloads: 0
    };
    setResources(prev => [newRes, ...prev]);
    setResTitle('');
    triggerToast('Wellbeing resource uploaded! 📄');
  };

  // Handle adding a specialty
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties(prev => [...prev, newSpecialty.trim()]);
      setNewSpecialty('');
      triggerToast('Specialization added 🛡️');
    }
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
    { label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length.toString() },
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
                        {sessions.map((session) => (
                          <div key={session.id} className="p-3 bg-white border border-slate-100 rounded-2xl hover:border-[var(--primary)]/20 transition-all space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-[var(--on-surface-variant)]">
                                  {session.initials}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold">{session.clientName} <span className="text-[10px] text-slate-400 font-normal">({session.time})</span></h4>
                                  <p className="text-[9px] text-[var(--on-surface-variant)]">{session.category}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                session.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                session.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                'bg-slate-50 text-slate-600 border border-slate-100'
                              }`}>
                                {session.priority} Stress
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

                      <div className="space-y-3">
                        {clients.map((c) => (
                          <div key={c.id} className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-emerald-50 text-[var(--primary)] flex items-center justify-center font-bold text-xs">
                                {c.initials}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold">{c.name}</h4>
                                <p className="text-[9px] text-[var(--on-surface-variant)]">Last Session: {c.lastSession}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-right">
                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[var(--outline)] block uppercase font-semibold">Stress Trend</span>
                                <span className={`text-[10px] font-bold ${c.stressTrend === 'Improving' ? 'text-emerald-600' : c.stressTrend === 'Elevating' ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`}>
                                  {c.stressTrend}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[var(--outline)] block uppercase font-semibold">Risk Level</span>
                                <span className={`text-[10px] font-bold ${c.burnoutRisk === 'High' ? 'text-rose-600' : c.burnoutRisk === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                  {c.burnoutRisk}
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[8px] text-[var(--outline)] block uppercase font-semibold">Program</span>
                                <span className="text-[10px] font-bold text-[var(--on-surface)]">
                                  {c.progress}%
                                </span>
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
                        "<strong>Priya M.</strong> stress levels appear elevated after work-related interactions. Consider recommending emotional boundary exercises and introducing Module 5 of the recovery program."
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
                              <span className="text-[10px] text-slate-400 font-semibold">{s.time} ({s.duration})</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                s.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {s.priority} Priority
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
                              <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-[var(--primary-bright)] hover:bg-[var(--primary)] text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                                  Join Call
                                </button>
                                <button className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
                                  Reschedule
                                </button>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 text-xs">
                              <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="text-[8px] font-bold text-[var(--outline)] uppercase block">Session Target Goal</span>
                                <p className="font-semibold text-slate-700 mt-1">{activeSession.goal}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="text-[8px] font-bold text-[var(--outline)] uppercase block">Verification Mode</span>
                                <p className="font-semibold text-slate-700 mt-1">Secure & Privacy-First 🛡️</p>
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
                          <th className="py-3 px-4">Client Initials</th>
                          <th className="py-3 px-4">Specialization Focus</th>
                          <th className="py-3 px-4">Stress Trend</th>
                          <th className="py-3 px-4">Burnout Risk</th>
                          <th className="py-3 px-4">Program Completion</th>
                          <th className="py-3 px-4">Current Mood</th>
                          <th className="py-3 px-4">Last Check-In</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {clients.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-teal-50 text-[var(--primary)] flex items-center justify-center font-bold text-[10px]">
                                {c.initials}
                              </div>
                              {c.name}
                            </td>
                            <td className="py-3.5 px-4 text-[var(--on-surface-variant)]">{c.area}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                c.stressTrend === 'Improving' ? 'bg-emerald-50 text-emerald-700' :
                                c.stressTrend === 'Elevating' ? 'bg-rose-50 text-rose-700 font-semibold animate-pulse' :
                                'bg-slate-50 text-slate-600'
                              }`}>
                                {c.stressTrend}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold">
                              <span className={`text-[10px] ${
                                c.burnoutRisk === 'High' ? 'text-rose-600' :
                                c.burnoutRisk === 'Moderate' ? 'text-amber-500' :
                                'text-emerald-500'
                              }`}>
                                {c.burnoutRisk} Risk
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold">{c.progress}% Finished</td>
                            <td className="py-3.5 px-4 font-semibold text-slate-600">{c.mood}</td>
                            <td className="py-3.5 px-4 text-slate-400">{c.lastSession}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedSessionId(sessions.find(s => s.initials === c.initials)?.id || 's1');
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="card space-y-4 bg-white">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Burnout Recovery Program</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Active Clients enrolled:</span>
                          <span className="text-xs font-bold text-[var(--on-surface)]">Rahul S., Priya M.</span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] text-[var(--on-surface-variant)]">
                            <span>Engagement Rate</span>
                            <span className="font-bold">88%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[var(--primary)] h-full" style={{ width: '88%' }} />
                          </div>
                        </div>

                        <div className="space-y-2 border-t pt-3">
                          <h4 className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)]">Recovery Milestones reached this week</h4>
                          <ul className="text-[10px] text-slate-600 space-y-1.5 list-disc pl-4">
                            <li>Rahul S. completed boundaries assessment (Score: Improving)</li>
                            <li>Priya M. established weekly workload log sheet</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="card space-y-4 bg-white">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Anxiety Reset Course</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Active Clients enrolled:</span>
                          <span className="text-xs font-bold text-[var(--on-surface)]">Kavita R.</span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] text-[var(--on-surface-variant)]">
                            <span>Engagement Rate</span>
                            <span className="font-bold">62%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full" style={{ width: '62%' }} />
                          </div>
                        </div>

                        <div className="space-y-2 border-t pt-3">
                          <h4 className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)]">Habit Milestones reached this week</h4>
                          <ul className="text-[10px] text-slate-600 space-y-1.5 list-disc pl-4">
                            <li>Kavita R. completed 5 consecutive daily check-ins 💚</li>
                            <li>Weekly reflection journal entries logged: 4 entries</li>
                          </ul>
                        </div>
                      </div>
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
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        {circles.map(c => (
                          <div key={c.id} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-2.5 shadow-sm">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] uppercase font-bold text-[var(--primary)] bg-[var(--primary-fixed)] px-2 py-0.5 rounded-full">{c.type}</span>
                              <span className="text-[9px] text-slate-400 font-semibold">{c.joined}/{c.capacity} Registered</span>
                            </div>
                            <h4 className="text-xs font-bold">{c.title}</h4>
                            <p className="text-[10px] text-[var(--on-surface-variant)] leading-relaxed">{c.description}</p>
                            <div className="text-[10px] font-semibold text-[var(--primary)] pt-1.5 border-t border-slate-50 flex justify-between items-center">
                              <span>📅 {c.time}</span>
                              <span className="underline cursor-pointer">Manage circle</span>
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
                              <span className="text-[10px] font-bold text-slate-600 block">{r.downloads} Uses</span>
                              <span className="text-[9px] text-[var(--primary)] font-bold hover:underline cursor-pointer">Recommend file</span>
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

                        <button type="submit" className="w-full py-2.5 bg-[var(--primary)] hover:bg-[#00685c] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1">
                          <Plus size={14} /> Upload Sheet
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
                      <p className="text-4xl font-display font-bold text-[var(--primary)] flex items-center justify-center gap-1">
                        4.9 <Star size={24} className="fill-[var(--primary)] text-[var(--primary)]" />
                      </p>
                      <span className="text-[10px] text-slate-400">Calculated over 42 reviews</span>
                    </div>

                    <div className="card text-center p-6 space-y-2 bg-[#f4faf6] border-[#089D8C]/20">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)]">Clinical Verification Status</span>
                      <p className="text-base font-bold text-[var(--primary)] flex items-center justify-center gap-1.5 mt-2">
                        <CheckCircle size={16} /> Verified Specialist
                      </p>
                      <span className="text-[9px] text-[var(--on-surface-variant)] font-semibold uppercase">Verification Active ✓</span>
                    </div>

                    <div className="card text-center p-6 space-y-2 bg-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--outline)]">Quality Response Score</span>
                      <p className="text-4xl font-display font-bold text-slate-700">98%</p>
                      <span className="text-[10px] text-slate-400">Excellent follow-up feedback</span>
                    </div>

                  </div>

                  {/* Testimonial logs */}
                  <div className="card space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Testimonials & Client Feedback</h3>
                    
                    <div className="space-y-4">
                      {[
                        { text: "Dr. Sarah's session felt incredibly safe. I didn't feel judged at all. The boundary exercises changed how I view work.", author: "Verified Client (Anonymous)" },
                        { text: "The Student Burnout workshop was extremely practical. Highly recommend the worksheets.", author: "Workshop Participant" }
                      ].map((t, idx) => (
                        <div key={idx} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2">
                          <p className="text-xs text-slate-600 italic">"{t.text}"</p>
                          <span className="text-[9px] font-bold text-[var(--outline)] block text-right">— {t.author}</span>
                        </div>
                      ))}
                    </div>
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
                      
                      <div className="space-y-3">
                        {aiInsights.map((insight, idx) => (
                          <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-600" />
                                <span className="text-[10px] font-bold text-indigo-950 uppercase">{insight.category}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                insight.status === 'unread' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {insight.status}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                              <strong>Client {insight.client}:</strong> {insight.text}
                            </p>

                            <div className="flex gap-2 pt-1 border-t border-slate-50 justify-end">
                              <button 
                                onClick={() => {
                                  triggerToast(`Recommendation copied to notes for ${insight.client}`);
                                  setAiInsights(prev => prev.map((item, i) => i === idx ? { ...item, status: 'read' } : item));
                                }}
                                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg transition-all"
                              >
                                Accept & Draft Follow-Up
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
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
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        triggerToast('All notifications marked as read');
                      }}
                      className="text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="card space-y-3 bg-white">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 border rounded-2xl flex items-start gap-3 transition-all ${getNotificationColor(n.type)}`}>
                        <div className="shrink-0 mt-0.5">
                          {n.type === 'critical' ? <AlertCircle size={16} className="text-red-500 animate-ping" /> : <Bell size={16} className="text-slate-500" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold leading-tight">{n.title}</h4>
                            <span className="text-[9px] opacity-75 font-semibold">{n.date}</span>
                          </div>
                          <p className="text-[10px] opacity-90 leading-relaxed font-normal">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Specialties & languages */}
                    <div className="card lg:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b pb-3">Specializations & Languages</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-slate-500 block">Your Specializations</label>
                          <div className="flex flex-wrap gap-2">
                            {specialties.map((spec, index) => (
                              <span key={index} className="chip text-[10px] flex items-center gap-1.5 py-1 px-3 bg-emerald-50 rounded-full font-bold">
                                {spec} 
                                <button 
                                  onClick={() => setSpecialties(prev => prev.filter((_, idx) => idx !== index))}
                                  className="text-red-500 hover:text-red-700 font-bold"
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
                          <div className="flex flex-wrap gap-2 text-xs">
                            {languages.map((lang, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-semibold">{lang}</span>
                            ))}
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
                            <span className="text-sm font-bold text-slate-500">$</span>
                            <input 
                              type="number"
                              value={pricing}
                              onChange={(e) => setPricing(parseInt(e.target.value))}
                              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => triggerToast(`Consultation price set to $${pricing}/hr 💰`)}
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
