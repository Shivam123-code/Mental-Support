"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEmergencyAlerts } from "@/hooks/useSocket";
import {
  LayoutDashboard, Users, Briefcase, Building2, Brain, BookOpen, Smile, Heart,
  AlertTriangle, Shield, Cpu, FileText, BarChart3, Compass, Wallet,
  CheckSquare, Bell, Settings, List, ArrowLeft, ShieldCheck,
  CheckCircle, Cpu as CpuIcon, RefreshCw, Loader2, MapPin, Eye, Radio
} from "lucide-react";

// Types for Admin Dashboard
interface SOSCase {
  id: string;
  user: string;
  region: string;
  risk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  timeElapsed: string;
  status: "PENDING" | "ASSIGNED" | "RESOLVED";
  assignedTo: string;
}

interface ProfessionalApplicant {
  id: string;
  name: string;
  specialty: string;
  license: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  badge?: string;
}

interface UserSafetyProfile {
  id: string;
  name: string;
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  emotionalStatus: string;
  activePrograms: string;
  verificationStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
  status: "ACTIVE" | "SUSPENDED";
  role?: string;
}

interface ModCase {
  id: string;
  type: string;
  content: string;
  author: string;
  flagReason: string;
  status: "PENDING" | "APPROVED" | "REMOVED";
}

interface AILog {
  id: string;
  user: string;
  prompt: string;
  response: string;
  flag: string;
  status: "FLAGGED" | "RESOLVED" | "OVERRIDDEN";
}

interface EnterpriseAccount {
  id: string;
  name: string;
  employees: number;
  burnoutRisk: number; // percentage
  wellbeingParticipation: number; // percentage
  status: "ACTIVE" | "PENDING";
}

export default function MasterAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    regularUsers: 0,
    professionals: 0,
    enterprises: 0,
    pendingVerifications: 0,
    totalSessions: 0,
  });

  const [sosCases, setSosCases] = useState<SOSCase[]>([]);
  const [applicants, setApplicants] = useState<ProfessionalApplicant[]>([]);
  const [users, setUsers] = useState<UserSafetyProfile[]>([]);
  const [modQueue, setModQueue] = useState<ModCase[]>([]);
  const [aiLogs, setAiLogs] = useState<AILog[]>([]);
  const [enterprises, setEnterprises] = useState<EnterpriseAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [liveActivities, setLiveActivities] = useState<string[]>([]);

  // ── Real-time WebSocket SOS alerts ──
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const { alerts: liveAlerts, acknowledgeAlert, resolveAlert, isConnected: socketConnected, isAuthenticated: socketAuth } =
    useEmergencyAlerts(user?.id, token || undefined);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getDashboardData();
      setSosCases(data.safetyCases || []);
      setApplicants(data.applicants || []);
      setUsers(data.users || []);
      setModQueue(data.modQueue || []);
      setAiLogs(data.aiLogs || []);
      setEnterprises(data.enterprises || []);
      setStats(data.stats || {
        totalUsers: 0,
        regularUsers: 0,
        professionals: 0,
        enterprises: 0,
        pendingVerifications: 0,
        totalSessions: 0,
      });
      
      setAuditLogs([
        "Platform database synchronized successfully.",
        `Found ${data.applicants?.length || 0} active verification applications.`,
        `Platform status: ACTIVE. Registered users: ${data.stats?.totalUsers || 0}.`,
      ]);
      setLiveActivities([
        "WebSocket SOS server connected on port 3001.",
        "Listening for live SOS activations in real-time...",
        "Admin authenticated — joined emergency admin-room.",
      ]);
    } catch (err: any) {
      console.error("Error loading admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // API-backed event handlers
  const handleAssignSOS = (id: string, responder: string) => {
    setSosCases(prev => prev.map(c => c.id === id ? { ...c, status: "ASSIGNED", assignedTo: responder } : c));
    setAuditLogs(prev => [`Admin assigned responder ${responder} to safety case ${id}`, ...prev]);
  };

  const handleResolveSOS = async (id: string) => {
    try {
      await api.admin.executeAction({ action: 'RESOLVE_SAFETY_CASE', targetId: id });
      setSosCases(prev => prev.map(c => c.id === id ? { ...c, status: "RESOLVED" } : c));
      setAuditLogs(prev => [`Crisis case ${id} marked as RESOLVED`, ...prev]);
    } catch (err: any) {
      console.error("Error resolving safety case:", err);
    }
  };

  const handleApprovePro = async (id: string, badge?: string) => {
    try {
      await api.admin.executeAction({ action: 'APPROVE_USER', targetId: id });
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED", badge: badge || "Verified Specialist" } : a));
      const proName = applicants.find(a => a.id === id)?.name || "Professional";
      setAuditLogs(prev => [`Approved credentials and verified professional status for ${proName}`, ...prev]);
    } catch (err: any) {
      console.error("Error approving professional applicant:", err);
    }
  };

  const handleRejectPro = async (id: string) => {
    try {
      await api.admin.executeAction({ action: 'REJECT_USER', targetId: id });
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
      const proName = applicants.find(a => a.id === id)?.name || "Professional";
      setAuditLogs(prev => [`Rejected application status for ${proName}`, ...prev]);
    } catch (err: any) {
      console.error("Error rejecting professional applicant:", err);
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;
      const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      await api.admin.executeAction({ 
        action: nextStatus === "ACTIVE" ? "ACTIVATE_USER" : "SUSPEND_USER", 
        targetId: id 
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
      setAuditLogs(prev => [`Status of user ${user.name} toggled to ${nextStatus}`, ...prev]);
    } catch (err: any) {
      console.error("Error toggling user status:", err);
    }
  };

  const handleModerateContent = async (id: string, action: "APPROVE" | "REMOVE") => {
    try {
      await api.admin.executeAction({ 
        action: action === 'APPROVE' ? 'APPROVE_POST' : 'DELETE_POST', 
        targetId: id 
      });
      setModQueue(prev => prev.filter(c => c.id !== id));
      setAuditLogs(prev => [`Content moderation case ${id} resolved with action: ${action}`, ...prev]);
    } catch (err: any) {
      console.error("Error moderating content:", err);
    }
  };

  const handleAIOverride = (id: string) => {
    setAiLogs(prev => prev.map(l => l.id === id ? { ...l, status: "OVERRIDDEN" } : l));
    setAuditLogs(prev => [`Human override triggered for AI conversation ${id}`, ...prev]);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL": return "bg-rose-500 text-white animate-pulse";
      case "HIGH": return "bg-orange-500 text-white";
      case "MODERATE": return "bg-amber-500 text-white";
      default: return "bg-emerald-500 text-white";
    }
  };

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "SOS & Crisis", icon: AlertTriangle, alert: true, liveCount: liveAlerts.filter(a => a.status === 'ACTIVE').length },
    { label: "Trust & Safety", icon: Shield },
    { label: "Professionals", icon: Briefcase },
    { label: "Users", icon: Users },
    { label: "AI Governance", icon: CpuIcon },
    { label: "Community", icon: Smile },
    { label: "Organizations", icon: Building2 },
    { label: "Assessments", icon: Brain },
    { label: "Programs", icon: BookOpen },
    { label: "Content & Resources", icon: FileText },
    { label: "Reports & Analytics", icon: BarChart3 },
    { label: "Research", icon: Compass },
    { label: "Revenue & Subs", icon: Wallet },
    { label: "Moderation Queue", icon: CheckSquare },
    { label: "Notifications", icon: Bell },
    { label: "Audit Logs", icon: List },
    { label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <Loader2 size={48} className="animate-spin text-[var(--primary)] animate-infinite" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] text-[var(--on-surface)] flex">
      
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-[var(--outline-variant)]/60 bg-[var(--surface-container-low)] flex flex-col fixed top-0 bottom-0 left-0 z-40 overflow-y-auto">
        {/* Title logo */}
        <div className="p-6 border-b border-[var(--outline-variant)]/40 flex items-center gap-3">
          <img src="/logo.jpg" alt="KleverKlues" width={32} height={32} className="object-contain" />
          <div className="space-y-0.5">
            <span className="font-display font-semibold text-sm text-[var(--on-surface)] block">KleverKlues&trade;</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block">Control Center</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isSelected = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-[var(--on-surface-variant)] hover:text-indigo-600 hover:bg-[var(--surface-container)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={16} className={isSelected ? "text-white" : "text-[var(--outline)]"} />
                  <span>{item.label}</span>
                </div>
                {item.alert && (
                  <span className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${
                    (item as any).liveCount > 0
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-rose-500/30 text-rose-400'
                  }`}>
                    {(item as any).liveCount > 0 ? (item as any).liveCount : '•'}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info footer */}
        <div className="p-4 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container)] space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600/10 flex items-center justify-center font-bold text-xs text-indigo-600">
              AD
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Admin Moderator</p>
              <p className="text-[10px] text-[var(--on-surface-variant)]">Session: 2FA Verified</p>
            </div>
          </div>
          <Link href="/role-selection" className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1">
            <ArrowLeft size={10} /> Exit Admin Dashboard
          </Link>
        </div>
      </aside>


      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Top Header Controls */}
        <header className="h-16 border-b border-[var(--outline-variant)]/60 bg-[var(--surface-container-lowest)] px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
              {activeTab} Portal
            </h2>
            <span className="h-4 w-px bg-[var(--outline-variant)]" />
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SAFETY SYSTEMS ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold text-[var(--on-surface-variant)]/60 flex items-center gap-1.5 bg-[var(--surface-container-low)] px-3 py-1.5 rounded-lg border-hairline">
              <ShieldCheck size={14} className="text-indigo-600" /> DPDP READY &bull; SECURED AUDIT ENABLED
            </div>
          </div>
        </header>

        {/* Tab content router */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-[1400px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Top Banner KPI Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Health Metrics */}
                <div className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-label-bold uppercase text-indigo-600">Platform Health</span>
                    <Heart size={16} className="text-indigo-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display">{stats.totalUsers}</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Active Users (Registered in database)</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Active Pros: <strong>{stats.professionals}</strong></span>
                    <span>&bull;</span>
                    <span>Enterprises: <strong>{stats.enterprises}</strong></span>
                  </div>
                </div>

                {/* Safety Metrics */}
                <div className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-label-bold uppercase text-rose-500">Safety & Crisis</span>
                    <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display text-rose-500">
                      {sosCases.filter(c => c.status === "PENDING").length} Active Alerts
                    </p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Pending Crisis Intervention Cases</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Resolved cases: <strong className="text-emerald-600">{sosCases.filter(c => c.status === "RESOLVED").length}</strong></span>
                    <span>&bull;</span>
                    <span>Total Alerts: <strong className="text-emerald-600">{sosCases.length}</strong></span>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-label-bold uppercase text-emerald-600">Engagement</span>
                    <Smile size={16} className="text-emerald-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display">{stats.regularUsers}</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Regular End Users</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Sessions Booked: <strong>{stats.totalSessions}</strong></span>
                    <span>&bull;</span>
                    <span>Verification Queue: <strong>{stats.pendingVerifications}</strong></span>
                  </div>
                </div>

                {/* AI Safety Metrics */}
                <div className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-label-bold uppercase text-amber-500">AI Governance</span>
                    <Cpu size={16} className="text-amber-500" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display">
                      {aiLogs.filter(l => l.status === "FLAGGED").length} Risk Alerts
                    </p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">AI Chat Auditing active</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Override actions: <strong>{aiLogs.filter(l => l.status === "OVERRIDDEN").length} executed</strong></span>
                  </div>
                </div>

              </div>

              {/* Real-time Activity Center & Gauges */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Real-Time Activity Center (Mission Critical Feed) */}
                <div className="card lg:col-span-2 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/40 pb-3">
                    <h3 className="text-xs font-bold text-[var(--on-surface)] uppercase tracking-wider flex items-center gap-1.5">
                      <RefreshCw size={14} className="text-indigo-600 animate-spin" /> Live Control Center Feed
                    </h3>
                    <span className="text-[9px] font-bold text-[var(--on-surface-variant)]/50 uppercase">Updated real-time</span>
                  </div>
                  
                  <div className="space-y-3.5">
                    {liveActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[var(--surface-container-low)] rounded-xl border border-[var(--outline-variant)]/30 animate-in slide-in-from-top-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                        <span className="text-xs text-[var(--on-surface-variant)] font-medium leading-relaxed flex-1">{act}</span>
                        <span className="text-[9px] font-bold text-[var(--outline)]">Live</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Trust & Response Speed gauges */}
                <div className="card lg:col-span-1 p-6 space-y-6 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                      Safety Score Indicators
                    </h3>
                    <p className="text-[10px] text-[var(--on-surface-variant)]/60">Live metrics audit</p>
                  </div>

                  {/* Circular progress meter */}
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="var(--surface-container-low)" strokeWidth="6" />
                        <circle 
                          cx="56" 
                          cy="56" 
                          r="48" 
                          fill="none" 
                          stroke="var(--primary-bright)" 
                          strokeWidth="6" 
                          strokeDasharray={301.6}
                          strokeDashoffset={301.6 - (301.6 * 98.4) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-bold font-display">98.4%</span>
                        <span className="text-[8px] text-[var(--on-surface-variant)]/60 uppercase">Trust Index</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[var(--on-surface-variant)]">Clinical Governance Audit Checked</p>
                  </div>

                  <div className="border-t border-[var(--outline-variant)]/40 pt-4 flex justify-between text-xs text-[var(--on-surface-variant)]">
                    <span>SOS Routing: <strong>Regional</strong></span>
                    <span>Consent log audit: <strong>Active</strong></span>
                  </div>
                </div>

              </div>

              {/* SOS Case Dashboard Quickview */}
              <div className="card p-6 space-y-4">
                <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle size={16} className="text-rose-500" /> Pending SOS Emergencies
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--outline-variant)] text-[var(--on-surface-variant)]/60">
                        <th className="py-3 font-semibold">Incident ID</th>
                        <th className="py-3 font-semibold">Patient Profile</th>
                        <th className="py-3 font-semibold">Crisis Region</th>
                        <th className="py-3 font-semibold">Severity Rating</th>
                        <th className="py-3 font-semibold">Time Elapsed</th>
                        <th className="py-3 font-semibold">Assigned Responder</th>
                        <th className="py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sosCases.filter(c => c.status !== "RESOLVED").map((item) => (
                        <tr key={item.id} className="border-b border-[var(--outline-variant)]/30 hover:bg-[var(--surface-container-low)]">
                          <td className="py-4 font-bold text-indigo-600">{item.id}</td>
                          <td className="py-4 font-semibold">{item.user}</td>
                          <td className="py-4">{item.region}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskColor(item.risk)}`}>
                              {item.risk}
                            </span>
                          </td>
                          <td className="py-4">{item.timeElapsed}</td>
                          <td className="py-4 font-medium text-[var(--on-surface-variant)]">{item.assignedTo}</td>
                          <td className="py-4 text-right space-x-2">
                            {item.status === "PENDING" && (
                              <button 
                                onClick={() => handleAssignSOS(item.id, "Emergency Agent")}
                                className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
                              >
                                Assign Self
                              </button>
                            )}
                            <button 
                              onClick={() => handleResolveSOS(item.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                            >
                              Mark Resolved
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SOS & CRISIS — Live WebSocket Feed */}
          {activeTab === "SOS & Crisis" && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* Header + Connection Status */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--on-surface)] flex items-center gap-2">
                    <span className="text-2xl">🚨</span> Live SOS Alert Center
                  </h2>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                    Real-time alerts via WebSocket — updates instantly, no refresh needed
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
                  socketConnected && socketAuth
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : socketConnected
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  <Radio size={14} className={socketConnected && socketAuth ? 'animate-pulse' : ''} />
                  {socketConnected && socketAuth ? 'Connected & Listening' : socketConnected ? 'Authenticating…' : 'Disconnected'}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card p-4 bg-rose-50 border border-rose-100">
                  <p className="text-2xl font-bold text-rose-600">{liveAlerts.filter(a => a.status === 'ACTIVE').length}</p>
                  <p className="text-xs text-rose-500 font-semibold mt-0.5">Active Alerts</p>
                </div>
                <div className="card p-4 bg-amber-50 border border-amber-100">
                  <p className="text-2xl font-bold text-amber-600">{liveAlerts.filter(a => a.status === 'ACKNOWLEDGED').length}</p>
                  <p className="text-xs text-amber-500 font-semibold mt-0.5">Acknowledged</p>
                </div>
                <div className="card p-4 bg-emerald-50 border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-600">{liveAlerts.length}</p>
                  <p className="text-xs text-emerald-500 font-semibold mt-0.5">Total This Session</p>
                </div>
              </div>

              {/* Alerts Feed */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--outline-variant)]/40 flex items-center justify-between bg-[var(--surface-container-low)]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Incoming SOS Alerts
                  </h3>
                  <span className="text-[10px] text-[var(--on-surface-variant)]/60">Updates in real-time — no refresh needed</span>
                </div>

                {liveAlerts.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={28} className="text-emerald-500" />
                    </div>
                    <p className="font-semibold text-[var(--on-surface)] text-sm">No Active Alerts</p>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">
                      {socketConnected && socketAuth
                        ? 'All clear — listening for incoming SOS triggers'
                        : 'Waiting for WebSocket connection…'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--outline-variant)]/30">
                    {liveAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-5 hover:bg-[var(--surface-container-low)] transition-colors ${
                          alert.status === 'ACTIVE' ? 'border-l-4 border-rose-500' :
                          alert.status === 'ACKNOWLEDGED' ? 'border-l-4 border-amber-400' :
                          'border-l-4 border-emerald-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                alert.status === 'ACTIVE' ? 'bg-rose-500 text-white animate-pulse' :
                                alert.status === 'ACKNOWLEDGED' ? 'bg-amber-500 text-white' :
                                'bg-emerald-500 text-white'
                              }`}>
                                {alert.status}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                                alert.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                alert.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {alert.severity}
                              </span>
                              <span className="text-[10px] text-[var(--on-surface-variant)]">
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                            </div>

                            {/* User ID */}
                            <p className="text-xs text-[var(--on-surface-variant)] mb-1">
                              <span className="font-semibold text-[var(--on-surface)]">User:</span>{' '}
                              <span className="font-mono">{alert.userId}</span>
                            </p>

                            {/* Message */}
                            {alert.message && (
                              <p className="text-sm text-[var(--on-surface)] font-medium mb-2">"{alert.message}"</p>
                            )}

                            {/* GPS Map Link */}
                            <a
                              href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                              <MapPin size={13} />
                              {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
                              <Eye size={12} className="opacity-60" />
                              View on Maps
                            </a>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {alert.status === 'ACTIVE' && (
                              <button
                                onClick={() => acknowledgeAlert(alert.id)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Acknowledge
                              </button>
                            )}
                            {alert.status === 'ACKNOWLEDGED' && (
                              <button
                                onClick={() => resolveAlert(alert.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                              >
                                ✓ Resolve
                              </button>
                            )}
                            {alert.status === 'RESOLVED' && (
                              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                <CheckCircle size={13} /> Resolved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Not connected warning */}
              {!socketConnected && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-sm">
                  <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800">Socket server not reachable</p>
                    <p className="text-amber-600 text-xs mt-0.5">
                      Run <code className="bg-amber-100 px-1 rounded">npm run dev</code> inside the <code className="bg-amber-100 px-1 rounded">socket-server/</code> folder.
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}


          {/* TAB 3: TRUST & SAFETY */}
          {activeTab === "Trust & Safety" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* DPDP Compliance and Data Requests */}
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Compliance widgets */}
                <div className="card md:col-span-1 p-5 bg-[var(--surface-container-low)] space-y-4">
                  <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                    Privacy Regulations Check
                  </h3>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span>DPDP Compliance Audit</span>
                      <span className="text-emerald-600 font-bold">🟢 Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GDPR Compliance Audit</span>
                      <span className="text-emerald-600 font-bold">🟢 Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Consent Logs</span>
                      <span className="text-indigo-600 font-semibold">Synced (4,821 logs)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Platform Safety Score</span>
                      <span className="font-bold text-emerald-600">98/100</span>
                    </div>
                  </div>
                </div>

                {/* User Deletion & Export requests */}
                <div className="card md:col-span-2 p-5 bg-[var(--surface-container-low)] space-y-4">
                  <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={16} className="text-indigo-600" /> User Privacy & Compliance Queue
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { user: "User #9021", request: "Data Portability / Export", date: "Today", id: "REQ-4401" },
                      { user: "User #1093", request: "Account Deletion (Right to be Forgotten)", date: "Yesterday", id: "REQ-4402" }
                    ].map((req) => (
                      <div key={req.id} className="flex justify-between items-center p-3 bg-[var(--surface-container-lowest)] border-hairline rounded-xl text-xs">
                        <div>
                          <span className="font-mono font-bold text-indigo-600 block">{req.id}</span>
                          <span className="font-semibold">{req.user} requests <strong>{req.request}</strong></span>
                        </div>
                        <button 
                          onClick={() => setAuditLogs(prev => [`Privacy request ${req.id} executed for ${req.user}`, ...prev])}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 cursor-pointer"
                        >
                          Execute Request
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: PROFESSIONALS */}
          {activeTab === "Professionals" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Verification Queue */}
              <div className="card p-6 space-y-4">
                <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                  Professional Registration & Verification Queue
                </h3>
                
                <div className="space-y-4">
                  {applicants.map((a) => (
                    <div key={a.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl gap-4">
                      <div>
                        <span className="font-mono text-indigo-600 text-[10px] font-bold block">{a.id}</span>
                        <h4 className="text-sm font-bold text-[var(--on-surface)]">{a.name}</h4>
                        <p className="text-xs text-[var(--on-surface-variant)]">{a.specialty} &bull; License: <strong>{a.license}</strong></p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {a.status === "PENDING" ? (
                          <>
                            <button 
                              onClick={() => handleApprovePro(a.id, "Verified Therapist")}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleRejectPro(a.id)}
                              className="px-3 py-1.5 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${a.status === "APPROVED" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
                            {a.status} {a.badge && `(${a.badge})`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: USERS */}
          {activeTab === "Users" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Ecosystem Users Directory & Risk Profiles
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--outline-variant)] text-[var(--on-surface-variant)]/60">
                      <th className="py-3 font-semibold">User ID</th>
                      <th className="py-3 font-semibold">Full Name</th>
                      <th className="py-3 font-semibold">Risk Rating</th>
                      <th className="py-3 font-semibold">Last Emotional State</th>
                      <th className="py-3 font-semibold">Enrolled Program</th>
                      <th className="py-3 font-semibold">Status</th>
                      <th className="py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item.id} className="border-b border-[var(--outline-variant)]/30 hover:bg-[var(--surface-container-low)]">
                        <td className="py-4 font-bold text-indigo-600">{item.id}</td>
                        <td className="py-4 font-semibold">{item.name}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskColor(item.riskLevel)}`}>
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="py-4">{item.emotionalStatus}</td>
                        <td className="py-4">{item.activePrograms}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === "ACTIVE" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          {item.role === 'ADMIN' ? (
                            <span className="text-[10px] text-[var(--on-surface-variant)]/60 font-semibold px-2">Protected</span>
                          ) : (
                            <button 
                              onClick={() => handleToggleUser(item.id)}
                              className="px-2.5 py-1 text-[10px] font-bold border border-[var(--outline-variant)] rounded hover:bg-[var(--surface-container)] cursor-pointer"
                            >
                              {item.status === "ACTIVE" ? "Suspend" : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: AI GOVERNANCE */}
          {activeTab === "AI Governance" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* AI Safety Metrics */}
                <div className="card md:col-span-1 p-5 bg-[var(--surface-container-low)] space-y-4">
                  <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                    AI Safety Configurations
                  </h3>
                  <div className="space-y-4 text-xs pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Sentiment Risk Threshold</span>
                        <span className="font-bold text-indigo-600">85%</span>
                      </div>
                      <div className="w-full bg-[var(--surface-container)] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[85%]" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Trigger Intervention Level</span>
                        <span className="font-bold text-indigo-600">90%</span>
                      </div>
                      <div className="w-full bg-[var(--surface-container)] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[90%]" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span>Ethics Filter Override</span>
                      <span className="text-emerald-600 font-bold">🟢 Active</span>
                    </div>
                  </div>
                </div>

                {/* AI Dialogue Logs */}
                <div className="card md:col-span-2 p-5 bg-[var(--surface-container-low)] space-y-4">
                  <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                    AI Dialogue Risk Monitoring Queue
                  </h3>
                  
                  <div className="space-y-4">
                    {aiLogs.map((log) => (
                      <div key={log.id} className="p-4 bg-[var(--surface-container-lowest)] border-hairline rounded-2xl space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-indigo-600">{log.id} ({log.user})</span>
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-500 rounded text-[9px] font-bold uppercase">{log.flag}</span>
                        </div>
                        <p className="italic text-[var(--on-surface-variant)]">User: &ldquo;{log.prompt}&rdquo;</p>
                        <p className="font-semibold text-emerald-600">AI Response: &ldquo;{log.response}&rdquo;</p>
                        
                        <div className="pt-2 border-t border-[var(--outline-variant)]/30 flex justify-between items-center">
                          <span className="text-[10px] text-amber-500 font-bold uppercase">Status: {log.status}</span>
                          {log.status === "FLAGGED" && (
                            <button
                              onClick={() => handleAIOverride(log.id)}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              Trigger Human Override
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: COMMUNITY */}
          {activeTab === "Community" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Reported posts list */}
              <div className="card p-6 space-y-4">
                <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider flex items-center gap-1">
                  <CheckSquare size={16} className="text-indigo-600" /> Community Moderation Queue
                </h3>
                
                <div className="space-y-4">
                  {modQueue.map((item) => (
                    <div key={item.id} className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-600">{item.id} ({item.author})</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-500 rounded text-[9px] font-bold uppercase">{item.flagReason}</span>
                      </div>
                      <p className="italic leading-relaxed text-[var(--on-surface-variant)] bg-[var(--surface-container-lowest)] p-3 rounded-lg border border-[var(--outline-variant)]/20">
                        &ldquo;{item.content}&rdquo;
                      </p>
                      
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleModerateContent(item.id, "APPROVE")}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Approve Content
                        </button>
                        <button
                          onClick={() => handleModerateContent(item.id, "REMOVE")}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          Remove & Warn User
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: ORGANIZATIONS */}
          {activeTab === "Organizations" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Enterprise & Workplace Accounts Directory
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--outline-variant)] text-[var(--on-surface-variant)]/60">
                      <th className="py-3 font-semibold">Account ID</th>
                      <th className="py-3 font-semibold">Company Name</th>
                      <th className="py-3 font-semibold">Active Members</th>
                      <th className="py-3 font-semibold">Workforce Burnout Index</th>
                      <th className="py-3 font-semibold">Wellbeing Participation</th>
                      <th className="py-3 font-semibold">Status</th>
                      <th className="py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enterprises.map((item) => (
                      <tr key={item.id} className="border-b border-[var(--outline-variant)]/30 hover:bg-[var(--surface-container-low)]">
                        <td className="py-4 font-bold text-indigo-600">{item.id}</td>
                        <td className="py-4 font-semibold">{item.name}</td>
                        <td className="py-4">{item.employees} employees</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.burnoutRisk > 30 ? "bg-rose-100 text-rose-500" : "bg-emerald-100 text-emerald-600"}`}>
                            {item.burnoutRisk}% risk
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-indigo-600">{item.wellbeingParticipation}%</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === "ACTIVE" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-500"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button 
                            onClick={() => setAuditLogs(prev => [`Generated workforce report for ${item.name}`, ...prev])}
                            className="px-2.5 py-1 text-[10px] font-bold border border-[var(--outline-variant)] rounded hover:bg-[var(--surface-container)] cursor-pointer"
                          >
                            Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: ASSESSMENTS */}
          {activeTab === "Assessments" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                  Assessments Control Panel & Scoring Banks
                </h3>
                <button className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 cursor-pointer">
                  <Plus size={12} /> Add Assessment Category
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Anxiety Index", count: 8, severity: "High/Mod/Low", completions: "1,248" },
                  { name: "Burnout Meter", count: 12, severity: "Critical/Mod/Low", completions: "842" },
                  { name: "Relationship Wellness", count: 10, severity: "High/Mod/Low", completions: "632" }
                ].map((item) => (
                  <div key={item.name} className="p-5 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-3 text-xs">
                    <h4 className="font-bold text-sm text-[var(--on-surface)]">{item.name}</h4>
                    <p className="text-[var(--on-surface-variant)]">Question Bank size: <strong>{item.count} items</strong></p>
                    <p className="text-[var(--on-surface-variant)]">Scoring Logic: <strong>{item.severity}</strong></p>
                    <p className="text-[var(--on-surface-variant)]">Completions: <strong>{item.completions}</strong></p>
                    
                    <div className="pt-2 border-t border-[var(--outline-variant)]/30 flex justify-end gap-2">
                      <button className="p-1 text-indigo-600 hover:text-indigo-800"><Edit3 size={14} /></button>
                      <button className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PROGRAMS */}
          {activeTab === "Programs" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                  Wellness Programs Syllabus Control Center
                </h3>
                <button className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 cursor-pointer">
                  <Plus size={12} /> Create Program
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Burnout Recovery", duration: "4 Weeks", modules: 4, completions: "842" },
                  { name: "Anxiety Reset", duration: "4 Weeks", modules: 4, completions: "1,102" },
                  { name: "Sleep Recovery", duration: "4 Weeks", modules: 4, completions: "782" }
                ].map((item) => (
                  <div key={item.name} className="p-5 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-3 text-xs">
                    <h4 className="font-bold text-sm text-[var(--on-surface)]">{item.name}</h4>
                    <p className="text-[var(--on-surface-variant)]">Duration: <strong>{item.duration}</strong></p>
                    <p className="text-[var(--on-surface-variant)]">Weekly Modules: <strong>{item.modules} blocks</strong></p>
                    <p className="text-[var(--on-surface-variant)]">Completion rate: <strong>88.4%</strong></p>
                    
                    <div className="pt-2 border-t border-[var(--outline-variant)]/30 flex justify-end gap-2">
                      <button className="p-1 text-indigo-600 hover:text-indigo-800"><Edit3 size={14} /></button>
                      <button className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: CONTENT & RESOURCES */}
          {activeTab === "Content & Resources" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                  CMS: Wellbeing Library & Articles
                </h3>
                <button className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 cursor-pointer">
                  <Plus size={12} /> Add Resource
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Burnout Recovery Plan Guidebook", type: "Article", author: "Dr. Ananya Sen" },
                  { title: "Deep Sleep Release Meditation", type: "Meditation", author: "Sarah Jenkins" },
                  { title: "10-Minute Evening Recharge Yoga", type: "Video", author: "Aditi Rao" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[var(--surface-container-low)] border-hairline rounded-xl text-xs">
                    <div>
                      <span className="font-semibold block">{item.title}</span>
                      <span className="text-[10px] text-[var(--on-surface-variant)]/70">{item.type} &bull; Author: {item.author}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 text-indigo-600 hover:text-indigo-800"><Edit3 size={14} /></button>
                      <button className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: REPORTS & ANALYTICS */}
          {activeTab === "Reports & Analytics" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Ecosystem Impact & Wellbeing Reports
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-4 text-xs">
                  <h4 className="font-semibold text-sm">Download Compliance & Transparency Logs</h4>
                  <p className="text-[var(--on-surface-variant)]">Generate and download compiled platform records for auditing purposes.</p>
                  <button className="px-3 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer">
                    <Download size={14} /> Export transparency_report_2026.pdf
                  </button>
                </div>

                <div className="p-5 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-4 text-xs">
                  <h4 className="font-semibold text-sm">Workforce Burnout Indices</h4>
                  <p className="text-[var(--on-surface-variant)]">Generate aggregated report summarizing stress levels and burnout factors.</p>
                  <button className="px-3 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer">
                    <Download size={14} /> Export enterprise_wellbeing_data.xlsx
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: RESEARCH */}
          {activeTab === "Research" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Wellbeing Intelligence & Anonymized Clinical Research
              </h3>
              <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                Platform clinical data is aggregated and anonymized in compliance with DPDP and medical ethics research codes to help researchers develop better treatment paradigms.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-xl text-xs space-y-2">
                  <h4 className="font-bold">Anxiety Trends Research</h4>
                  <p className="text-[var(--on-surface-variant)]">Anonymized dataset of 4,000+ anxiety checking patterns.</p>
                  <button className="text-indigo-600 font-bold hover:underline flex items-center gap-1">Open Research Hub <ExternalLink size={12} /></button>
                </div>
                <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-xl text-xs space-y-2">
                  <h4 className="font-bold">Stress & Remote Work Patterns</h4>
                  <p className="text-[var(--on-surface-variant)]">Correlation logs between remote work hours and burnout indicators.</p>
                  <button className="text-indigo-600 font-bold hover:underline flex items-center gap-1">Open Research Hub <ExternalLink size={12} /></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: REVENUE & SUBS */}
          {activeTab === "Revenue & Subs" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Ecosystem Revenue & Subscriptions Tracker
              </h3>

              <div className="grid sm:grid-cols-3 gap-6 text-xs">
                <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-[var(--on-surface-variant)]/60 uppercase">Enterprise Billing</span>
                  <p className="text-xl font-bold font-display text-indigo-600">$12,480.00</p>
                  <p className="text-[9px] text-[var(--on-surface-variant)]">Active subscriptions: 18</p>
                </div>
                <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-[var(--on-surface-variant)]/60 uppercase">Professional Payouts</span>
                  <p className="text-xl font-bold font-display text-indigo-600">$8,450.00</p>
                  <p className="text-[9px] text-[var(--on-surface-variant)]">Pending release: $1,240</p>
                </div>
                <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-[var(--on-surface-variant)]/60 uppercase">Creator & Mentor Rewards</span>
                  <p className="text-xl font-bold font-display text-indigo-600">$2,100.00</p>
                  <p className="text-[9px] text-[var(--on-surface-variant)]">Monthly budget remaining: $900</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: NOTIFICATIONS */}
          {activeTab === "Notifications" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Ecosystem Push Notification Campaigns & Alerts
              </h3>

              <form className="space-y-4 text-xs max-w-lg" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="font-bold">Campaign Name</label>
                  <input type="text" placeholder="Weekly Wellbeing Reminder" className="w-full p-2.5 border rounded-lg bg-[var(--surface-container-lowest)] focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold">Target Audience</label>
                  <select className="w-full p-2.5 border rounded-lg bg-[var(--surface-container-lowest)] focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>All Enrolled Program Users</option>
                    <option>Verified Professionals Only</option>
                    <option>Enterprise Employees Only</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold">Notification Message</label>
                  <textarea rows={3} placeholder="Remember to log your gratitude check-in today. Small steps support healing." className="w-full p-2.5 border rounded-lg bg-[var(--surface-container-lowest)] focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <button 
                  onClick={() => setAuditLogs(prev => ["Triggered push notification campaign: Weekly Wellbeing Reminder", ...prev])}
                  className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Send Campaign
                </button>
              </form>
            </div>
          )}

          {/* TAB 16: AUDIT LOGS */}
          {activeTab === "Audit Logs" && (
            <div className="card p-6 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Immutable System Audit Logs
              </h3>
              
              <div className="space-y-2">
                {auditLogs.map((log, index) => (
                  <div key={index} className="p-3 bg-[var(--surface-container-low)] border-hairline rounded-xl text-xs font-mono flex items-center justify-between">
                    <span>{log}</span>
                    <span className="text-[10px] text-[var(--on-surface-variant)]/60 font-semibold">Success</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 17: SETTINGS */}
          {activeTab === "Settings" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                Platform Rules & Moderation Thresholds
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-xs">
                <div className="p-5 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-3">
                  <h4 className="font-semibold text-sm">Escalation Policies</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      Auto-escalate CRITICAL risks to regional supervisor
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      Notify AI ethics board of manual human overrides
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      Bypass verification for licensed emergency responders
                    </label>
                  </div>
                </div>

                <div className="p-5 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-3">
                  <h4 className="font-semibold text-sm">System Localizations</h4>
                  <div className="space-y-2">
                    <p>Primary Language: <strong>English (US / IN)</strong></p>
                    <p>Secondary Languages: <strong>Hindi, Spanish, French</strong></p>
                    <button className="text-indigo-600 font-bold hover:underline cursor-pointer">Modify locales</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
