"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEmergencyAlerts } from "@/hooks/useSocket";
import { TabContent } from "@/components/motion/animations";
import {
  LayoutDashboard, Users, Briefcase, Building2, Brain, BookOpen, Smile, Heart,
  AlertTriangle, Shield, Cpu, FileText, BarChart3, Compass, Wallet,
  CheckSquare, Bell, Settings, List, ArrowLeft, ShieldCheck,
  CheckCircle, Cpu as CpuIcon, RefreshCw, Loader2, MapPin, Eye, Radio,
  Plus, Edit3, Trash2, Download, ExternalLink, TrendingUp, Menu, X, Truck, Navigation, Phone, UserPlus,
  Activity, ChevronRight, Search, Filter, MoreVertical, LogOut
} from "lucide-react";
import ChangePasswordCard from '@/components/ChangePasswordCard';
import AddUserModal from '@/components/admin/AddUserModal';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import { reverseGeocode } from '@/lib/client/geocode';

interface SOSCase {
  id: string; user: string; region: string;
  risk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  timeElapsed: string; status: "PENDING" | "ASSIGNED" | "RESOLVED"; assignedTo: string;
}
interface ProfessionalApplicant {
  id: string; name: string; specialty: string; license: string;
  status: "PENDING" | "APPROVED" | "REJECTED"; badge?: string;
}
interface UserSafetyProfile {
  id: string; name: string; riskLevel: "LOW" | "MODERATE" | "HIGH";
  emotionalStatus: string; activePrograms: string;
  verificationStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
  status: "ACTIVE" | "SUSPENDED"; role?: string;
}
interface ModCase {
  id: string; type: string; content: string; author: string;
  flagReason: string; status: "PENDING" | "APPROVED" | "REMOVED";
}
interface AILog {
  id: string; user: string; prompt: string; response: string;
  flag: string; status: "FLAGGED" | "RESOLVED" | "OVERRIDDEN";
}
interface EnterpriseAccount {
  id: string; name: string; employees: number;
  burnoutRisk: number; wellbeingParticipation: number; status: "ACTIVE" | "PENDING";
}

export default function MasterAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

// ── Reusable stat card ──
function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub?: string;
  color: string; icon: any;
}) {
  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-display leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

// ── Status pill ──
function StatusPill({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    RESOLVED: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
    ACKNOWLEDGED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    REJECTED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    SUSPENDED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    ASSIGNED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cfg[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

// ── Risk pill ──
function RiskPill({ risk }: { risk: string }) {
  const cfg: Record<string, string> = {
    CRITICAL: "bg-rose-100 text-rose-700 animate-pulse",
    HIGH: "bg-orange-100 text-orange-700",
    MODERATE: "bg-amber-100 text-amber-700",
    LOW: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg[risk] || "bg-slate-100 text-slate-600"}`}>
      {risk}
    </span>
  );
}

// ── Section heading ──
function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Card wrapper ──
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function AdminDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, regularUsers: 0, professionals: 0, enterprises: 0, pendingVerifications: 0, totalSessions: 0 });
  const [sosCases, setSosCases] = useState<SOSCase[]>([]);
  const [applicants, setApplicants] = useState<ProfessionalApplicant[]>([]);
  const [users, setUsers] = useState<UserSafetyProfile[]>([]);
  const [modQueue, setModQueue] = useState<ModCase[]>([]);
  const [aiLogs, setAiLogs] = useState<AILog[]>([]);
  const [enterprises, setEnterprises] = useState<EnterpriseAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [liveActivities, setLiveActivities] = useState<string[]>([]);
  const [vendorDispatch, setVendorDispatch] = useState<Record<string, { status: string; message: string; timestamp: Date }>>({});
  const [allVendors, setAllVendors] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorLocationLabels, setVendorLocationLabels] = useState<Record<string, string>>({});
  const [professionalApps, setProfessionalApps] = useState<any[]>([]);
  const [orgApps, setOrgApps] = useState<any[]>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ id: string; type: 'professional' | 'organization' } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminAssessments, setAdminAssessments] = useState<{ totalCompletions: number; typeStats: any[]; submissions: any[] }>({ totalCompletions: 0, typeStats: [], submissions: [] });
  const [assessmentAdminLoading, setAssessmentAdminLoading] = useState(false);
  const [addUserModal, setAddUserModal] = useState<{ open: boolean; role: 'USER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'VENDOR' } | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const { alerts: liveAlerts, acknowledgeAlert, resolveAlert, isConnected: socketConnected, isAuthenticated: socketAuth, dbLoaded, socket: adminSocket } =
    useEmergencyAlerts(user?.id, token || undefined);
  const [locationLabels, setLocationLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!adminSocket) return;
    const handler = (data: { alertId: string; dispatchStatus: string; message: string; timestamp: Date }) => {
      setVendorDispatch(prev => ({ ...prev, [data.alertId]: { status: data.dispatchStatus, message: data.message, timestamp: new Date(data.timestamp) } }));
      setAuditLogs(prev => [`Alert ${data.alertId.slice(-6)}: vendor → ${data.dispatchStatus}`, ...prev.slice(0, 19)]);
    };
    adminSocket.on('sos:vendor_status_update', handler);
    return () => { adminSocket.off('sos:vendor_status_update', handler); };
  }, [adminSocket]);

  const [vendorCursor, setVendorCursor] = useState<string | null>(null);
  const [vendorTotal, setVendorTotal] = useState(0);

  const fetchAllVendors = async (cursor?: string) => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t) return;
    setVendorsLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '100', ...(cursor ? { cursor } : {}) });
      const res = await fetch(`/api/admin/vendors?${qs}`, { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.success) {
        // Paginated now — append on "load more", replace on a fresh open.
        setAllVendors(prev => (cursor ? [...prev, ...data.data.items] : data.data.items));
        setVendorCursor(data.data.nextCursor);
        setVendorTotal(data.data.total);
      }
    } catch { } finally { setVendorsLoading(false); }
  };

  useEffect(() => { if (activeTab === 'Vendors') fetchAllVendors(); }, [activeTab]);

  // ── Persisted audit trail ──────────────────────────────────────────────────
  // Replaces the in-memory string array, which lost every recorded action on
  // refresh. Cursor-paginated: this table only grows.
  const [auditEntries, setAuditEntries] = useState<any[]>([]);
  const [auditCursor, setAuditCursor] = useState<string | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchAuditLogs = async (cursor?: string) => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t) return;
    setAuditLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', ...(cursor ? { cursor } : {}) });
      const res = await fetch(`/api/admin/audit-logs?${qs}`, { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.success) {
        setAuditEntries(prev => (cursor ? [...prev, ...data.data.items] : data.data.items));
        setAuditCursor(data.data.nextCursor);
      }
    } catch { } finally { setAuditLoading(false); }
  };

  useEffect(() => { if (activeTab === 'Audit Logs') fetchAuditLogs(); }, [activeTab]);

  useEffect(() => {
    allVendors.forEach((v: any) => {
      if (!v.latitude || !v.longitude || vendorLocationLabels[v.id]) return;
      reverseGeocode(v.latitude, v.longitude).then(label => {
        if (label) setVendorLocationLabels(prev => ({ ...prev, [v.id]: label }));
      });
    });
  }, [allVendors]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    liveAlerts.forEach((alert) => {
      const key = `${alert.id}`;
      if (locationLabels[key] || !alert.latitude || !alert.longitude) return;
      setLocationLabels((prev) => ({ ...prev, [key]: 'Resolving…' }));
      reverseGeocode(alert.latitude, alert.longitude).then((label) => {
        setLocationLabels((prev) => ({ ...prev, [key]: label }));
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveAlerts]);

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
      setStats(data.stats || { totalUsers: 0, regularUsers: 0, professionals: 0, enterprises: 0, pendingVerifications: 0, totalSessions: 0 });
      setAuditLogs(["Platform database synchronized.", `Found ${data.applicants?.length || 0} active verification applications.`, `Platform status: ACTIVE. Registered users: ${data.stats?.totalUsers || 0}.`]);
      setLiveActivities(["WebSocket SOS server connected on port 3001.", "Listening for live SOS activations in real-time...", "Admin authenticated — joined emergency admin-room."]);
    } catch (err: any) { console.error("Error loading admin dashboard data:", err); } finally { setLoading(false); }
  };

  const fetchApplications = async () => {
    setAppLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch('/api/admin/applications?status=ALL', { headers: { Authorization: `Bearer ${token}` } });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Applications fetch: server returned non-JSON', res.status, text.slice(0, 300));
        alert(`Failed to load applications (HTTP ${res.status}). Check the console for details.\n\nHint: Make sure the dev server is running with latest code.`);
        return;
      }
      const data = await res.json();
      if (data.success) { setProfessionalApps(data.data.professional || []); setOrgApps(data.data.organization || []); }
      else console.error('Applications fetch error:', data.error);
    } catch (err) { console.error('Error fetching applications:', err); } finally { setAppLoading(false); }
  };

  const fetchAdminAssessments = async () => {
    setAssessmentAdminLoading(true);
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch('/api/admin/assessments', { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.success) setAdminAssessments(data.data);
    } catch (err) { console.error('Admin assessments fetch error:', err); } finally { setAssessmentAdminLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); fetchApplications(); fetchAdminAssessments(); }, []);



  // ponytail: local-only. This never persisted — refresh reverted the
  // assignment and no responder was ever contacted. Real dispatch already runs
  // server-side via startDispatch; this panel needs to claim an alert through
  // EmergencyAlert.acknowledgedBy rather than keep its own shadow state.
  // Ceiling: two admins can each "assign" the same case and neither sees the
  // other. Upgrade path: POST /api/admin/sos-alerts/[id]/claim.
  const handleAssignSOS = (id: string, responder: string) => {
    setSosCases(prev => prev.map(c => c.id === id ? { ...c, status: "ASSIGNED", assignedTo: responder } : c));
  };

  const handleResolveSOS = async (id: string) => {
    try {
      await api.admin.executeAction({ action: 'RESOLVE_SAFETY_CASE', targetId: id });
      setSosCases(prev => prev.map(c => c.id === id ? { ...c, status: "RESOLVED" } : c));
      setAuditLogs(prev => [`Crisis case ${id} marked as RESOLVED`, ...prev]);
    } catch (err: any) { console.error("Error resolving safety case:", err); }
  };

  const handleApprovePro = async (id: string, badge?: string) => {
    try {
      await api.admin.executeAction({ action: 'APPROVE_USER', targetId: id });
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED", badge: badge || "Verified Specialist" } : a));
      const proName = applicants.find(a => a.id === id)?.name || "Professional";
      setAuditLogs(prev => [`Approved credentials for ${proName}`, ...prev]);
    } catch (err: any) { console.error("Error approving professional applicant:", err); }
  };

  const handleRejectPro = async (id: string) => {
    try {
      await api.admin.executeAction({ action: 'REJECT_USER', targetId: id });
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
      const proName = applicants.find(a => a.id === id)?.name || "Professional";
      setAuditLogs(prev => [`Rejected application for ${proName}`, ...prev]);
    } catch (err: any) { console.error("Error rejecting professional applicant:", err); }
  };

  const handleApproveApplication = async (id: string, type: 'professional' | 'organization') => {
    setActionLoading(id);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`/api/admin/applications/${id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ type }) });
      let data: any;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) { data = await res.json(); }
      else { const text = await res.text(); throw new Error(`Server error ${res.status}: ${text.slice(0, 120)}`); }
      if (!data.success) throw new Error(data.error || data.message || 'Unknown server error');
      if (type === 'professional') setProfessionalApps(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
      else setOrgApps(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
      const emailError = data.data?.emailError;
      const tempPassword = data.data?.tempPassword;
      if (emailError && tempPassword) {
        alert(`✅ Application APPROVED!\n\n⚠️ Email delivery failed: ${emailError}\n\nShare these credentials manually:\nEmail: ${data.data.email}\nTemp Password: ${tempPassword}`);
        setAuditLogs(prev => [`Application ${id} APPROVED — email failed, manual credential sharing needed`, ...prev]);
      } else {
        alert(`✅ Application APPROVED! Credentials sent to ${data.data?.email}`);
        setAuditLogs(prev => [`Application ${id} APPROVED — credentials sent to ${data.data?.email}`, ...prev]);
      }
    } catch (err: any) { alert('Approval failed: ' + (err.message || 'Unknown error')); } finally { setActionLoading(null); }
  };

  const handleRejectApplication = async () => {
    if (!rejectModal) return;
    const { id, type } = rejectModal;
    setActionLoading(id);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`/api/admin/applications/${id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ type, reason: rejectReason }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      if (type === 'professional') setProfessionalApps(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a));
      else setOrgApps(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a));
      setAuditLogs(prev => [`Application ${id} REJECTED`, ...prev]);
      setRejectModal(null); setRejectReason("");
    } catch (err: any) { alert('Rejection failed: ' + (err.message || 'Unknown error')); } finally { setActionLoading(null); }
  };

  const handleDeleteApplication = async (id: string, type: 'professional' | 'organization') => {
    if (!window.confirm(`Delete this ${type} application permanently? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`/api/admin/applications/${id}?type=${type}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || data.message);
      if (type === 'professional') setProfessionalApps(prev => prev.filter(a => a.id !== id));
      else setOrgApps(prev => prev.filter(a => a.id !== id));
      setAuditLogs(prev => [`Application ${id} (${type}) DELETED by admin`, ...prev]);
    } catch (err: any) { alert('Delete failed: ' + (err.message || 'Unknown error')); } finally { setActionLoading(null); }
  };

  const handleToggleUser = async (id: string) => {
    try {
      const u = users.find(u => u.id === id);
      if (!u) return;
      const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      await api.admin.executeAction({ action: nextStatus === "ACTIVE" ? "ACTIVATE_USER" : "SUSPEND_USER", targetId: id });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
      setAuditLogs(prev => [`User ${u.name} toggled to ${nextStatus}`, ...prev]);
    } catch (err: any) { console.error("Error toggling user status:", err); }
  };

  const handleModerateContent = async (id: string, action: "APPROVE" | "REMOVE") => {
    try {
      await api.admin.executeAction({ action: action === 'APPROVE' ? 'APPROVE_POST' : 'DELETE_POST', targetId: id });
      setModQueue(prev => prev.filter(c => c.id !== id));
      setAuditLogs(prev => [`Moderation case ${id} resolved: ${action}`, ...prev]);
    } catch (err: any) { console.error("Error moderating content:", err); }
  };

  const handleAIOverride = (id: string) => {
    setAiLogs(prev => prev.map(l => l.id === id ? { ...l, status: "OVERRIDDEN" } : l));
    setAuditLogs(prev => [`Human override for AI conversation ${id}`, ...prev]);
  };

  const navGroups = [
    {
      label: "Core",
      items: [
        { label: "Overview", icon: LayoutDashboard },
        { label: "SOS & Crisis", icon: AlertTriangle, badge: liveAlerts.filter(a => a.status === 'ACTIVE').length, badgeColor: "bg-rose-500" },
        { label: "Reports & Analytics", icon: BarChart3 },
        { label: "Audit Logs", icon: List },
      ]
    },
    {
      label: "Users",
      items: [
        { label: "Users", icon: Users },
        { label: "Professionals", icon: Briefcase, badge: professionalApps.filter(a => a.status === 'PENDING').length, badgeColor: "bg-amber-500" },
        { label: "Organizations", icon: Building2, badge: orgApps.filter(a => a.status === 'PENDING').length, badgeColor: "bg-amber-500" },
        { label: "Vendors", icon: Truck },
      ]
    },
    {
      label: "Safety & AI",
      items: [
        { label: "Trust & Safety", icon: Shield },
        { label: "AI Governance", icon: CpuIcon },
        { label: "Community", icon: Smile },
        { label: "Moderation Queue", icon: CheckSquare },
      ]
    },
    {
      label: "Platform",
      items: [
        { label: "Assessments", icon: Brain },
        { label: "Programs", icon: BookOpen },
        { label: "Content & Resources", icon: FileText },
        { label: "Research", icon: Compass },
        { label: "Revenue & Subs", icon: Wallet },
        { label: "Notifications", icon: Bell },
        { label: "Settings", icon: Settings },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Loader2 size={24} className="animate-spin text-white" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading Control Center…</p>
        </div>
      </div>
    );
  }

  const pendingPros = professionalApps.filter(a => a.status === 'PENDING').length;
  const pendingOrgs = orgApps.filter(a => a.status === 'PENDING').length;
  const activeSOS = liveAlerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex">

      {/* ── Reject Modal ── */}
      {rejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 mx-4">
            <h3 className="text-sm font-bold mb-1">Reject Application</h3>
            <p className="text-xs text-slate-500 mb-4">Provide a rejection reason — this will be emailed to the applicant.</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4}
              placeholder="e.g. Incomplete documents, unverifiable license..."
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setRejectModal(null); setRejectReason(""); }}
                className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Cancel</button>
              <button onClick={handleRejectApplication} disabled={actionLoading === rejectModal.id}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-60 cursor-pointer">
                {actionLoading === rejectModal.id ? 'Sending…' : 'Send Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add User Modal ── */}
      {addUserModal?.open && (
        <AddUserModal
          isOpen={addUserModal.open}
          role={addUserModal.role}
          onClose={() => setAddUserModal(null)}
          onSuccess={() => { setAuditLogs(prev => [`User added via admin panel`, ...prev]); setAddUserModal(null); }}
        />
      )}

      {/* ── Mobile Topbar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {activeSOS > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />{activeSOS} SOS
            </span>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Backdrop ── */}
      {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 dark:bg-slate-950 flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">KleverKlues™</p>
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">Control Center</p>
          </div>
        </div>

        {/* Status pill */}
        <div className="px-5 pt-4 pb-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${socketConnected && socketAuth ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
            <span className={`w-2 h-2 rounded-full ${socketConnected && socketAuth ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {socketConnected && socketAuth ? 'Live · SOS Connected' : 'Connecting…'}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activeTab === item.label;
                  return (
                    <button key={item.label} onClick={() => { setActiveTab(item.label); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                      <div className="flex items-center gap-2.5">
                        <item.icon size={15} className={active ? 'text-white' : 'text-slate-500'} />
                        <span>{item.label}</span>
                      </div>
                      {(item as any).badge > 0 && (
                        <span className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 text-white ${(item as any).badgeColor || 'bg-rose-500'}`}>
                          {(item as any).badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-xs flex-shrink-0">
              {(user?.displayName || user?.firstName || 'AD').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.displayName || user?.firstName || 'Admin'}</p>
              <p className="text-[10px] text-slate-500">Super Admin · 2FA</p>
            </div>
          </div>
          <Link href="/role-selection" className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 hover:text-rose-400 transition-colors">
            <LogOut size={12} /> Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pt-14 lg:pt-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronRight size={14} className="text-slate-400 hidden lg:block" />
            <h1 className="text-sm font-bold text-slate-700 dark:text-slate-200">{activeTab}</h1>
            {activeSOS > 0 && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />{activeSOS} Active SOS
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
              <ShieldCheck size={12} className="text-indigo-600" /> DPDP Ready
            </span>
            <button onClick={fetchDashboardData} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <TabContent tabKey={activeTab}>
            <div className="p-5 lg:p-8 space-y-6 max-w-[1440px] w-full">

              {/* ═══════════════ OVERVIEW ═══════════════ */}
              {activeTab === "Overview" && (
                <div className="space-y-6 animate-in fade-in duration-300">

                  {/* KPI row */}
                  <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard label="Total Users" value={stats.totalUsers} sub={`${stats.professionals} professionals · ${stats.enterprises} orgs`} color="bg-indigo-500" icon={Users} />
                    <StatCard label="Active SOS Alerts" value={activeSOS} sub={`${liveAlerts.filter(c => c.status === 'RESOLVED').length} resolved this session`} color="bg-rose-500" icon={AlertTriangle} />
                    <StatCard label="Pending Reviews" value={pendingPros + pendingOrgs} sub={`${pendingPros} professionals · ${pendingOrgs} orgs`} color="bg-amber-500" icon={CheckSquare} />
                    <StatCard label="Assessment Submissions" value={adminAssessments.totalCompletions} sub="Total completions in DB" color="bg-emerald-500" icon={Brain} />
                  </div>

                  {/* Middle row */}
                  <div className="grid lg:grid-cols-3 gap-5">
                    {/* Live feed */}
                    <Card className="lg:col-span-2 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Live System Feed</h3>
                          <p className="text-xs text-slate-400 mt-0.5">Real-time control center activity</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
                        </span>
                      </div>
                      <div className="space-y-2">
                        {liveActivities.map((act, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                            <Activity size={13} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{act}</span>
                          </div>
                        ))}
                        {auditLogs.slice(0, 4).map((log, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                            <CheckCircle size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{log}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Platform health */}
                    <Card className="p-5 flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Platform Health</h3>
                      {[
                        { label: "Trust Index", value: 98, color: "bg-indigo-500" },
                        { label: "Safety Score", value: 97, color: "bg-emerald-500" },
                        { label: "Uptime", value: 99, color: "bg-blue-500" },
                      ].map(m => (
                        <div key={m.label}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-500">{m.label}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{m.value}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.value}%` }} />
                          </div>
                        </div>
                      ))}
                      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
                        {[
                          { label: "SOS Routing", value: "Regional" },
                          { label: "Consent Logs", value: "Active" },
                          { label: "DPDP", value: "Compliant" },
                          { label: "GDPR", value: "Compliant" },
                        ].map(i => (
                          <div key={i.label}>
                            <p className="text-slate-400 text-[10px]">{i.label}</p>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{i.value}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Pending SOS quickview */}
                  {sosCases.filter(c => c.status !== "RESOLVED").length > 0 && (
                    <Card>
                      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2">
                          <AlertTriangle size={15} /> Pending SOS Cases
                        </h3>
                        <button onClick={() => setActiveTab("SOS & Crisis")} className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                          View all <ChevronRight size={12} />
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700">
                              {["ID", "Patient", "Region", "Severity", "Elapsed", "Responder", "Actions"].map(h => (
                                <th key={h} className={`py-3 px-4 font-semibold text-slate-400 text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sosCases.filter(c => c.status !== "RESOLVED").map(item => (
                              <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-indigo-600 text-[10px]">{item.id}</td>
                                <td className="py-3 px-4 font-semibold">{item.user}</td>
                                <td className="py-3 px-4 text-slate-500">{item.region}</td>
                                <td className="py-3 px-4"><RiskPill risk={item.risk} /></td>
                                <td className="py-3 px-4 text-slate-500">{item.timeElapsed}</td>
                                <td className="py-3 px-4 text-slate-500">{item.assignedTo}</td>
                                <td className="py-3 px-4 text-right flex items-center gap-2 justify-end">
                                  {item.status === "PENDING" && (
                                    <button onClick={() => handleAssignSOS(item.id, "Emergency Agent")} className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer">Assign</button>
                                  )}
                                  <button onClick={() => handleResolveSOS(item.id)} className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer">Resolve</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}

                </div>
              )}

              {/* ═══════════════ SOS & CRISIS ═══════════════ */}
              {activeTab === "SOS & Crisis" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead
                    title="Live SOS Alert Center"
                    sub="Real-time alerts via WebSocket — updates instantly, no refresh needed"
                    action={
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${socketConnected && socketAuth ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : socketConnected ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                        <Radio size={13} className={socketConnected && socketAuth ? 'animate-pulse' : ''} />
                        {socketConnected && socketAuth ? 'Connected & Listening' : socketConnected ? 'Authenticating…' : 'Disconnected'}
                      </div>
                    }
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Active", value: liveAlerts.filter(a => a.status === 'ACTIVE').length, color: "bg-rose-500" },
                      { label: "Acknowledged", value: liveAlerts.filter(a => a.status === 'ACKNOWLEDGED').length, color: "bg-amber-500" },
                      { label: "Resolved", value: liveAlerts.filter(a => a.status === 'RESOLVED').length, color: "bg-emerald-500" },
                      { label: "Total in DB", value: liveAlerts.length, color: "bg-indigo-500" },
                    ].map(s => (
                      <Card key={s.label} className="p-4 flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${s.color} flex-shrink-0 ${s.label === 'Active' && s.value > 0 ? 'animate-pulse' : ''}`} />
                        <div>
                          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">{s.label}</p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-t-2xl">
                      <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />SOS Alert History
                      </h3>
                      <div className="flex items-center gap-3">
                        {!dbLoaded && <span className="text-[10px] text-amber-600 font-semibold animate-pulse">Loading history…</span>}
                        {dbLoaded && <span className="text-[10px] text-emerald-600 font-semibold">✓ {liveAlerts.length} records loaded</span>}
                      </div>
                    </div>

                    {!dbLoaded ? (
                      <div className="py-16 text-center"><Loader2 size={28} className="animate-spin text-indigo-400 mx-auto mb-3" /><p className="text-sm text-slate-400">Loading from database…</p></div>
                    ) : liveAlerts.length === 0 ? (
                      <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3"><CheckCircle size={24} className="text-emerald-500" /></div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">No SOS Alerts</p>
                        <p className="text-xs text-slate-400 mt-1">{socketConnected && socketAuth ? 'All clear — listening for incoming SOS triggers' : 'Waiting for WebSocket connection…'}</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        {liveAlerts.map((alert) => (
                          <div key={alert.id} className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-l-4 ${alert.status === 'ACTIVE' ? 'border-rose-500' : alert.status === 'ACKNOWLEDGED' ? 'border-amber-400' : 'border-emerald-400'}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <StatusPill status={alert.status} />
                                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${alert.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' : alert.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{alert.severity}</span>
                                  <span className="text-[10px] text-slate-400">{new Date(alert.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-slate-500"><span className="font-semibold text-slate-700 dark:text-slate-200">User:</span> <span className="font-mono">{alert.userId}</span></p>
                                {alert.message && <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">"{alert.message}"</p>}
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={12} className="text-indigo-500 flex-shrink-0" />
                                  <a href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`} target="_blank" rel="noreferrer"
                                    className="text-xs font-semibold text-indigo-600 hover:underline">
                                    {locationLabels[alert.id] || `${alert.latitude?.toFixed(4)}, ${alert.longitude?.toFixed(4)}`}
                                  </a>
                                  <span className="text-[10px] text-slate-400">↗ Maps</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 flex-shrink-0">
                                {alert.status === 'ACTIVE' && (
                                  <button onClick={() => acknowledgeAlert(alert.id)} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer">Acknowledge</button>
                                )}
                                {alert.status === 'ACKNOWLEDGED' && (
                                  <button onClick={() => resolveAlert(alert.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer">✓ Resolve</button>
                                )}
                                {alert.status === 'RESOLVED' && (
                                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Resolved</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {!socketConnected && (
                    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
                      <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-800">Socket server not reachable</p>
                        <p className="text-amber-600 text-xs mt-0.5">Run <code className="bg-amber-100 px-1 rounded">npm run dev</code> inside <code className="bg-amber-100 px-1 rounded">socket-server/</code></p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════ VENDORS ═══════════════ */}
              {activeTab === "Vendors" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Live Dispatch Board" sub="Real-time vendor → user status tracking"
                    action={<span className="flex items-center gap-1.5 text-[10px] bg-orange-100 text-orange-700 border border-orange-200 font-bold px-3 py-1.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> LIVE</span>} />

                  <Card className="p-5">
                    {liveAlerts.length === 0 ? (
                      <div className="text-center py-10"><Truck size={32} className="mx-auto text-slate-300 mb-3" /><p className="text-sm text-slate-400">No active SOS alerts — dispatch board is idle</p></div>
                    ) : (
                      <div className="space-y-3">
                        {liveAlerts.map(alert => {
                          const vd = vendorDispatch[alert.id];
                          const currentStatus = vd?.status || alert.dispatchStatus || 'PENDING';
                          const steps = ['VENDOR_ALERTED', 'VENDOR_ACCEPTED', 'EN_ROUTE', 'NEARBY', 'ARRIVED', 'RESOLVED'];
                          const currentIdx = steps.indexOf(currentStatus);
                          return (
                            <div key={alert.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <RiskPill risk={alert.severity} />
                                  <span className="text-xs text-slate-500">{locationLabels[alert.id] || `${alert.latitude?.toFixed(3)}, ${alert.longitude?.toFixed(3)}`}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <StatusPill status={currentStatus} />
                                  <a href={`https://maps.google.com/?q=${alert.latitude},${alert.longitude}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1"><Navigation size={11} /> Map</a>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {steps.map((s, i) => (
                                  <div key={s} className="flex items-center flex-1">
                                    <div className={`h-1.5 flex-1 rounded-full transition-all ${i <= currentIdx ? 'bg-orange-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                  </div>
                                ))}
                              </div>
                              {vd && <p className="text-xs text-slate-400 italic">"{vd.message}"</p>}
                              <p className="text-[10px] text-slate-400">Alert #{alert.id.slice(-8)} · {new Date(alert.timestamp || alert.createdAt || Date.now()).toLocaleTimeString()}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>

                  <Card>
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div><h3 className="text-sm font-bold">All Vendors</h3>
                        {/* Honest count: the list is paged, so say how much of it is on screen. */}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {vendorTotal > 0 ? `Showing ${allVendors.length} of ${vendorTotal} registered` : 'Registered service providers'}
                        </p>
                      </div>
                      {/* Wrapped: passing the handler directly hands React's click
                          event to the cursor parameter. */}
                      <button onClick={() => fetchAllVendors()} disabled={vendorsLoading} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition disabled:opacity-60 cursor-pointer">
                        {vendorsLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Refresh
                      </button>
                    </div>
                    <div className="p-5">
                      {vendorsLoading && allVendors.length === 0 ? <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-orange-500" /></div>
                        : allVendors.length === 0 ? <div className="text-center py-10"><Truck size={28} className="mx-auto text-slate-300 mb-3" /><p className="text-sm text-slate-400">No vendors registered yet</p></div>
                        : (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {allVendors.map((v: any) => (
                              <div key={v.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-2 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <div><p className="font-semibold text-sm">{v.businessName}</p><p className="text-xs text-slate-400">{v.serviceType}</p></div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{v.isOnline ? '● Online' : '○ Offline'}</span>
                                </div>
                                {v.phone && <a href={`tel:${v.phone}`} className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"><Phone size={11} /> {v.phone}</a>}
                                {v.latitude && v.longitude && (
                                  <div className="space-y-0.5">
                                    {vendorLocationLabels[v.id] && <p className="text-xs font-medium text-slate-600 dark:text-slate-300">📍 {vendorLocationLabels[v.id]}</p>}
                                    <a href={`https://maps.google.com/?q=${v.latitude},${v.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"><MapPin size={11} /> {v.latitude.toFixed(4)}, {v.longitude.toFixed(4)}</a>
                                  </div>
                                )}
                                <p className={`text-[10px] font-semibold ${v.isAvailable ? 'text-emerald-600' : 'text-orange-600'}`}>{v.isAvailable ? 'Available for dispatch' : 'On assignment'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      {vendorCursor && (
                        <button
                          onClick={() => fetchAllVendors(vendorCursor)}
                          disabled={vendorsLoading}
                          className="w-full mt-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
                        >
                          {vendorsLoading ? 'Loading…' : `Load more (${vendorTotal - allVendors.length} remaining)`}
                        </button>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* ═══════════════ TRUST & SAFETY ═══════════════ */}
              {activeTab === "Trust & Safety" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Trust & Safety Center" sub="Compliance monitoring, privacy requests, and governance status" />
                  <div className="grid md:grid-cols-3 gap-5">
                    <Card className="p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Status</h3>
                      {[
                        { label: "DPDP Compliance", status: "Active" },
                        { label: "GDPR Compliance", status: "Active" },
                        { label: "Consent Logs", status: "Synced" },
                        { label: "Platform Safety Score", status: "98/100" },
                        { label: "Ethics Filter", status: "Active" },
                        { label: "AI Oversight", status: "Enabled" },
                      ].map(i => (
                        <div key={i.label} className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{i.label}</span>
                          <span className="font-semibold text-emerald-600">{i.status}</span>
                        </div>
                      ))}
                    </Card>
                    <Card className="md:col-span-2 p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo-600" /> Privacy & Compliance Queue</h3>
                      {/* The rows here were hardcoded fixtures and Execute only
                          appended a log line — no data was ever exported or
                          erased. A DPDP/GDPR control that silently no-ops is
                          worse than none: it gets clicked, and the requester is
                          told their data is gone. Stays disabled until the
                          export/erase pipeline is real. */}
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs">
                        <p className="font-bold text-amber-900 dark:text-amber-200">Not implemented yet</p>
                        <p className="text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                          Data export and right-to-be-forgotten requests are not yet wired to a
                          real pipeline. Handle them manually and record the outcome, and do not
                          confirm erasure to a requester from this screen.
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ═══════════════ PROFESSIONALS ═══════════════ */}
              {activeTab === "Professionals" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Professional Applications"
                    sub={`${pendingPros} pending review · Real data from database`}
                    action={<button onClick={fetchApplications} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer transition"><RefreshCw size={12} /> Refresh</button>} />

                  {appLoading ? (
                    <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-600" /></div>
                  ) : professionalApps.length === 0 ? (
                    <Card className="p-12 text-center"><Briefcase size={32} className="mx-auto text-slate-300 mb-3" /><p className="text-slate-400 text-sm">No professional applications found.</p></Card>
                  ) : (
                    <div className="space-y-4">
                      {professionalApps.map(app => (
                        <Card key={app.id} className="p-5">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-indigo-600 text-[10px] font-bold">#{app.id.slice(-8)}</span>
                                <StatusPill status={app.status} />
                              </div>
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{app.firstName} {app.lastName}</h4>
                              <p className="text-xs text-slate-500">{app.specialty} · {app.yearsOfExperience} exp · License: <strong className="text-slate-700 dark:text-slate-200">{app.licenseNumber || 'N/A'}</strong></p>
                              <p className="text-xs text-slate-500">{app.email} · {app.phone}</p>
                              <p className="text-[10px] text-slate-400">{app.highestDegree} — {app.institution} ({app.graduationYear})</p>
                              <p className="text-[10px] text-slate-400">Submitted: {new Date(app.createdAt).toLocaleDateString('en-IN')}</p>
                              {app.bio && <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-700">"{app.bio.slice(0, 180)}{app.bio.length > 180 ? '…' : ''}"</p>}
                            </div>
                            <div className="flex flex-row md:flex-col gap-2 min-w-[160px]">
                              {app.status === 'PENDING' && (
                                <>
                                  <button onClick={() => handleApproveApplication(app.id, 'professional')} disabled={actionLoading === app.id}
                                    className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer disabled:opacity-60 transition-colors">
                                    {actionLoading === app.id ? '…' : '✓ Approve'}
                                  </button>
                                  <button onClick={() => { setRejectModal({ id: app.id, type: 'professional' }); setRejectReason(''); }}
                                    className="flex-1 px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer">Reject</button>
                                </>
                              )}
                              {app.status === 'APPROVED' && <p className="text-[10px] text-emerald-600 font-semibold">✓ Credentials sent</p>}
                              <button onClick={() => handleDeleteApplication(app.id, 'professional')} disabled={actionLoading === app.id}
                                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-50 disabled:opacity-60 transition-colors">Delete</button>
                            </div>
                          </div>
                          {(app.licenseDocPath || app.degreeDocPath || app.idProofPath || app.profilePhotoPath) && (
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Documents</p>
                              <div className="flex flex-wrap gap-2">
                                {app.idProofPath && <a href={app.idProofPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">📄 ID Proof</a>}
                                {app.degreeDocPath && <a href={app.degreeDocPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">🎓 Degree</a>}
                                {app.licenseDocPath && <a href={app.licenseDocPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">📋 License</a>}
                                {app.profilePhotoPath && <a href={app.profilePhotoPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">🖼 Photo</a>}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════ USERS ═══════════════ */}
              {activeTab === "Users" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="User Directory" sub="Ecosystem users with risk profiles and status management" />
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-700">
                            {["User", "Risk", "Emotional State", "Program", "Status", "Actions"].map(h => (
                              <th key={h} className={`py-3 px-4 font-semibold text-slate-400 text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(item => (
                            <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{item.id}</p>
                              </td>
                              <td className="py-3.5 px-4"><RiskPill risk={item.riskLevel} /></td>
                              <td className="py-3.5 px-4 text-slate-500">{item.emotionalStatus}</td>
                              <td className="py-3.5 px-4 text-slate-500">{item.activePrograms}</td>
                              <td className="py-3.5 px-4"><StatusPill status={item.status} /></td>
                              <td className="py-3.5 px-4 text-right">
                                {item.role === 'ADMIN' ? (
                                  <span className="text-[10px] text-slate-400 font-semibold">Protected</span>
                                ) : (
                                  <button onClick={() => handleToggleUser(item.id)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border cursor-pointer transition-colors ${item.status === 'ACTIVE' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}>
                                    {item.status === "ACTIVE" ? "Suspend" : "Activate"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {users.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">No users loaded.</div>}
                    </div>
                  </Card>
                </div>
              )}

              {/* ═══════════════ AI GOVERNANCE ═══════════════ */}
              {activeTab === "AI Governance" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="AI Governance" sub="Sentiment monitoring, safety thresholds, and human override controls" />
                  <div className="grid md:grid-cols-3 gap-5">
                    <Card className="p-5 space-y-5">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safety Configurations</h3>
                      {[
                        { label: "Sentiment Risk Threshold", value: 85 },
                        { label: "Trigger Intervention Level", value: 90 },
                        { label: "Ethics Filter Coverage", value: 100 },
                      ].map(m => (
                        <div key={m.label}>
                          <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-500">{m.label}</span><span className="font-bold text-indigo-600">{m.value}%</span></div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${m.value}%` }} /></div>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-slate-500">Ethics Filter Override</span>
                        <span className="font-bold text-emerald-600">🟢 Active</span>
                      </div>
                    </Card>
                    <Card className="md:col-span-2 p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Risk Monitoring Queue</h3>
                      {aiLogs.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">No flagged AI conversations.</div>
                      ) : (
                        <div className="space-y-3">
                          {aiLogs.map(log => (
                            <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl space-y-2.5 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-indigo-600">{log.id} ({log.user})</span>
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-[9px] font-bold uppercase">{log.flag}</span>
                              </div>
                              <p className="italic text-slate-500">User: "{log.prompt}"</p>
                              <p className="font-semibold text-emerald-600">AI: "{log.response}"</p>
                              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                                <StatusPill status={log.status} />
                                {log.status === "FLAGGED" && (
                                  <button onClick={() => handleAIOverride(log.id)}
                                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-[10px] font-bold hover:bg-rose-700 cursor-pointer">Human Override</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )}

              {/* ═══════════════ COMMUNITY ═══════════════ */}
              {activeTab === "Community" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Community Moderation" sub="Flagged content queue requiring admin review" />
                  <Card className="p-5 space-y-4">
                    {modQueue.length === 0 ? (
                      <div className="text-center py-12"><CheckCircle size={28} className="mx-auto text-emerald-400 mb-3" /><p className="text-slate-400 text-sm">Moderation queue is clear.</p></div>
                    ) : (
                      <div className="space-y-3">
                        {modQueue.map(item => (
                          <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl space-y-3 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-indigo-600">{item.id} · {item.author}</span>
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[9px] font-bold uppercase">{item.flagReason}</span>
                            </div>
                            <p className="italic leading-relaxed text-slate-500 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">"{item.content}"</p>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleModerateContent(item.id, "APPROVE")} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 cursor-pointer">Approve</button>
                              <button onClick={() => handleModerateContent(item.id, "REMOVE")} className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-[10px] font-bold hover:bg-rose-700 cursor-pointer">Remove & Warn</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* ═══════════════ ORGANIZATIONS ═══════════════ */}
              {activeTab === "Organizations" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Organization Applications"
                    sub={`${pendingOrgs} pending review · Real data from database`}
                    action={<button onClick={fetchApplications} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer transition"><RefreshCw size={12} /> Refresh</button>} />

                  {appLoading ? (
                    <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-indigo-600" /></div>
                  ) : orgApps.length === 0 ? (
                    <Card className="p-12 text-center"><Building2 size={32} className="mx-auto text-slate-300 mb-3" /><p className="text-slate-400 text-sm">No organization applications found.</p></Card>
                  ) : (
                    <div className="space-y-4">
                      {orgApps.map(app => (
                        <Card key={app.id} className="p-5">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-indigo-600 text-[10px] font-bold">#{app.id.slice(-8)}</span>
                                <StatusPill status={app.status} />
                              </div>
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{app.orgName}</h4>
                              <p className="text-xs text-slate-500">{app.orgType} · {app.employeeCount} employees · Reg: <strong className="text-slate-700 dark:text-slate-200">{app.registrationNumber || 'N/A'}</strong></p>
                              <p className="text-xs text-slate-500">Contact: {app.contactName} ({app.contactDesignation})</p>
                              <p className="text-xs text-slate-500">{app.email} · {app.phone}</p>
                              <p className="text-[10px] text-slate-400">Submitted: {new Date(app.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div className="flex flex-row md:flex-col gap-2 min-w-[160px]">
                              {app.status === 'PENDING' && (
                                <>
                                  <button onClick={() => handleApproveApplication(app.id, 'organization')} disabled={actionLoading === app.id}
                                    className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer disabled:opacity-60">
                                    {actionLoading === app.id ? '…' : '✓ Approve'}
                                  </button>
                                  <button onClick={() => { setRejectModal({ id: app.id, type: 'organization' }); setRejectReason(''); }}
                                    className="flex-1 px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer">Reject</button>
                                </>
                              )}
                              {app.status === 'APPROVED' && <p className="text-[10px] text-emerald-600 font-semibold">✓ Credentials sent</p>}
                              <button onClick={() => handleDeleteApplication(app.id, 'organization')} disabled={actionLoading === app.id}
                                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-50 disabled:opacity-60">Delete</button>
                            </div>
                          </div>
                          {(app.regCertPath || app.gstCertPath || app.authLetterPath || app.logoPath) && (
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Documents</p>
                              <div className="flex flex-wrap gap-2">
                                {app.regCertPath && <a href={app.regCertPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">📄 Reg. Cert</a>}
                                {app.gstCertPath && <a href={app.gstCertPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">📋 GST</a>}
                                {app.authLetterPath && <a href={app.authLetterPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">✉ Auth Letter</a>}
                                {app.logoPath && <a href={app.logoPath} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100">🖼 Logo</a>}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Enterprise Directory */}
                  {enterprises.length > 0 && (
                    <>
                      <SectionHead title="Enterprise Directory" sub="Active workplace accounts" />
                      <Card>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-700">
                                {["Company", "Members", "Burnout Index", "Participation", "Status", "Actions"].map(h => (
                                  <th key={h} className={`py-3 px-4 font-semibold text-slate-400 text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {enterprises.map(item => (
                                <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                  <td className="py-3.5 px-4 font-semibold">{item.name}</td>
                                  <td className="py-3.5 px-4 text-slate-500">{item.employees}</td>
                                  <td className="py-3.5 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.burnoutRisk > 30 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.burnoutRisk}%</span>
                                  </td>
                                  <td className="py-3.5 px-4 font-semibold text-indigo-600">{item.wellbeingParticipation}%</td>
                                  <td className="py-3.5 px-4"><StatusPill status={item.status} /></td>
                                  <td className="py-3.5 px-4 text-right">
                                    {/* No report is generated — disabled rather than
                                        pretending, until an export exists. */}
                                    <button disabled title="Report generation not implemented yet"
                                      className="px-3 py-1.5 text-[10px] font-bold border border-slate-200 dark:border-slate-600 rounded-xl opacity-40 cursor-not-allowed">Report</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
              )}

              {/* ═══════════════ ASSESSMENTS ═══════════════ */}
              {activeTab === "Assessments" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Assessment Analytics"
                    sub={`${adminAssessments.totalCompletions} total completions in database`}
                    action={<button onClick={fetchAdminAssessments} disabled={assessmentAdminLoading}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-60">
                      {assessmentAdminLoading ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />} Refresh
                    </button>} />

                  {assessmentAdminLoading && adminAssessments.typeStats.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-slate-400"><Loader2 size={20} className="animate-spin" /> Loading assessment data…</div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {adminAssessments.typeStats.map(stat => (
                          <Card key={stat.key} className="p-5 space-y-3">
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{stat.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{stat.questions} questions</p>
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between"><span className="text-slate-400">Completions</span><span className="font-bold text-indigo-600">{stat.completions}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Avg Score</span><span className="font-bold">{stat.avgScore || '—'}</span></div>
                              <div className="flex justify-between"><span className="text-slate-400">Avg Level</span><span className="font-bold text-indigo-500">{stat.avgPercentage || 0}%</span></div>
                            </div>
                            {Object.keys(stat.levelCounts || {}).length > 0 && (
                              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700">
                                {Object.entries(stat.levelCounts).map(([lvl, cnt]: any) => (
                                  <div key={lvl} className="flex justify-between text-[10px]">
                                    <span className={`font-semibold ${['Minimal','Low','Excellent','Expert'].includes(lvl) ? 'text-emerald-600' : ['Mild','Good','Proficient'].includes(lvl) ? 'text-blue-600' : ['Moderate','Needs Work','Developing'].includes(lvl) ? 'text-amber-600' : 'text-rose-600'}`}>{lvl}</span>
                                    <span className="text-slate-400">{cnt}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {stat.completions === 0 && <p className="text-[10px] text-slate-400 italic">No completions yet</p>}
                          </Card>
                        ))}
                      </div>

                      <Card>
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">All Submissions</h4>
                          <span className="text-[10px] text-slate-400">{adminAssessments.submissions.length} records</span>
                        </div>
                        {adminAssessments.submissions.length === 0 ? (
                          <div className="py-12 text-center"><Brain size={28} className="text-slate-300 mx-auto mb-3" /><p className="text-sm text-slate-400">No submissions yet.</p></div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                  {["User", "Assessment", "Score", "Level", "Date"].map(h => (
                                    <th key={h} className="py-3 px-4 font-semibold text-slate-400 text-left">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {adminAssessments.submissions.slice(0, 50).map(sub => (
                                  <tr key={sub.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4"><p className="font-semibold">{sub.userName || 'Unknown'}</p><p className="text-[10px] text-slate-400">{sub.userEmail}</p></td>
                                    <td className="py-3 px-4 font-medium">{sub.assessmentTitle}</td>
                                    <td className="py-3 px-4"><span className="font-bold text-indigo-600">{sub.score}/{sub.maxScore}</span> <span className="text-slate-400">({sub.percentage}%)</span></td>
                                    <td className="py-3 px-4">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${['Minimal','Low','Excellent','Expert'].includes(sub.level) ? 'bg-emerald-100 text-emerald-700' : ['Mild','Good','Proficient'].includes(sub.level) ? 'bg-blue-100 text-blue-700' : ['Moderate','Needs Work','Developing'].includes(sub.level) ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'}`}>{sub.level}</span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400">{new Date(sub.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Card>
                    </>
                  )}
                </div>
              )}

              {/* ═══════════════ REPORTS & ANALYTICS ═══════════════ */}
              {activeTab === "Reports & Analytics" && <AnalyticsPanel />}

              {/* ═══════════════ AUDIT LOGS ═══════════════ */}
              {activeTab === "Audit Logs" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Audit Logs" sub="Permanent record of admin actions — who did what, when, from where" />
                  <Card className="p-5">
                    {auditLoading && auditEntries.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-sm">Loading audit trail…</div>
                    ) : auditEntries.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-sm">No admin actions recorded yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {auditEntries.map((e) => (
                          <div key={e.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 text-xs">
                            <div className="w-5 h-5 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5"><List size={10} className="text-indigo-600" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-700 dark:text-slate-200">
                                <span className="font-bold">{e.actor?.name ?? 'unknown'}</span>
                                <span className="font-mono mx-1.5 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px]">{e.action}</span>
                                {e.metadata?.email && <span className="text-slate-500">{e.metadata.email}</span>}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(e.createdAt).toLocaleString()}
                                {e.resourceId && <> · <span className="font-mono">{String(e.resourceId).slice(-8)}</span></>}
                                {e.ipAddress && <> · {e.ipAddress}</>}
                              </p>
                            </div>
                          </div>
                        ))}
                        {auditCursor && (
                          <button
                            onClick={() => fetchAuditLogs(auditCursor)}
                            disabled={auditLoading}
                            className="w-full mt-2 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
                          >
                            {auditLoading ? 'Loading…' : 'Load older entries'}
                          </button>
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* ═══════════════ PROGRAMS ═══════════════ */}
              {activeTab === "Programs" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Wellness Programs" sub="Syllabus and program management"
                    action={<button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer"><Plus size={13} /> New Program</button>} />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Burnout Recovery", duration: "4 Weeks", modules: 4, completions: "842", rate: 88 },
                      { name: "Anxiety Reset", duration: "4 Weeks", modules: 4, completions: "1,102", rate: 91 },
                      { name: "Sleep Recovery", duration: "4 Weeks", modules: 4, completions: "782", rate: 86 },
                    ].map(item => (
                      <Card key={item.name} className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.name}</h4>
                          <div className="flex gap-1">
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-600 cursor-pointer"><Edit3 size={13} /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"><Trash2 size={13} /></button>
                          </div>
                        </div>
                        <div className="space-y-2 text-xs text-slate-500">
                          <div className="flex justify-between"><span>Duration</span><span className="font-semibold text-slate-700 dark:text-slate-200">{item.duration}</span></div>
                          <div className="flex justify-between"><span>Modules</span><span className="font-semibold text-slate-700 dark:text-slate-200">{item.modules}</span></div>
                          <div className="flex justify-between"><span>Completions</span><span className="font-semibold text-indigo-600">{item.completions}</span></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Completion Rate</span><span className="font-bold text-slate-700 dark:text-slate-200">{item.rate}%</span></div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.rate}%` }} /></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══════════════ CONTENT & RESOURCES ═══════════════ */}
              {activeTab === "Content & Resources" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Content Management" sub="Wellbeing library, articles, and guided resources"
                    action={<button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer"><Plus size={13} /> Add Resource</button>} />
                  <Card className="p-5 space-y-3">
                    {[
                      { title: "Burnout Recovery Plan Guidebook", type: "Article", author: "Dr. Ananya Sen" },
                      { title: "Deep Sleep Release Meditation", type: "Meditation", author: "Sarah Jenkins" },
                      { title: "10-Minute Evening Recharge Yoga", type: "Video", author: "Aditi Rao" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs">
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200 block">{item.title}</span>
                          <span className="text-slate-400">{item.type} · {item.author}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 cursor-pointer"><Edit3 size={13} /></button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}

              {/* ═══════════════ MODERATION QUEUE ═══════════════ */}
              {activeTab === "Moderation Queue" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Moderation Queue" sub="All flagged content across the platform" />
                  <Card className="p-5 space-y-4">
                    {modQueue.length === 0 ? (
                      <div className="text-center py-12"><CheckCircle size={28} className="mx-auto text-emerald-400 mb-3" /><p className="text-slate-400 text-sm">Moderation queue is clear.</p></div>
                    ) : (
                      <div className="space-y-3">
                        {modQueue.map(item => (
                          <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl space-y-3 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-indigo-600">{item.id} · {item.author}</span>
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[9px] font-bold uppercase">{item.flagReason}</span>
                            </div>
                            <p className="italic leading-relaxed text-slate-500 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">"{item.content}"</p>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleModerateContent(item.id, "APPROVE")} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 cursor-pointer">Approve</button>
                              <button onClick={() => handleModerateContent(item.id, "REMOVE")} className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-[10px] font-bold hover:bg-rose-700 cursor-pointer">Remove & Warn</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* ═══════════════ SETTINGS ═══════════════ */}
              {activeTab === "Settings" && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <SectionHead title="Settings" sub="Account security and platform configuration" />
                  <ChangePasswordCard />
                </div>
              )}

              {/* ═══════════════ PLACEHOLDER TABS ═══════════════ */}
              {["Research", "Revenue & Subs", "Notifications"].includes(activeTab) && (
                <div className="animate-in fade-in duration-300">
                  <Card className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {activeTab === "Research" ? <Compass size={24} className="text-slate-400" /> : activeTab === "Revenue & Subs" ? <Wallet size={24} className="text-slate-400" /> : <Bell size={24} className="text-slate-400" />}
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-bold text-slate-600 dark:text-slate-300">{activeTab}</h3>
                      <p className="text-sm text-slate-400 mt-1">This section is coming soon.</p>
                    </div>
                  </Card>
                </div>
              )}

            </div>
          </TabContent>
        </main>
      </div>
    </div>
  );
}
