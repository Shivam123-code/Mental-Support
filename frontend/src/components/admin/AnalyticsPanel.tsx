"use client";

import { useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, Briefcase, Truck, Building2, Search, RefreshCw,
  UserPlus, ChevronDown, ChevronUp, Loader2, Star, Activity,
  Heart, BookOpen, Brain, AlertTriangle, CheckCircle2,
  Clock, Wifi, WifiOff, TrendingUp, BarChart3, MessageSquare,
  Calendar, Shield, Phone,
} from "lucide-react";
import AddUserModal from "./AddUserModal";

// ─────────────────────── palette ───────────────────────
const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];
const MOOD_COLOR: Record<string, string> = {
  HAPPY: "#10b981", CALM: "#06b6d4", NEUTRAL: "#6366f1",
  ANXIOUS: "#f59e0b", SAD: "#8b5cf6", ANGRY: "#ef4444", STRESSED: "#f97316",
};
const STATUS_COLOR: Record<string, string> = {
  COMPLETED: "#10b981", PENDING: "#f59e0b", CANCELLED: "#ef4444",
  CONFIRMED: "#6366f1", RESOLVED: "#10b981", ACTIVE: "#ef4444",
  ACKNOWLEDGED: "#f59e0b", VENDOR_ACCEPTED: "#6366f1", EN_ROUTE: "#06b6d4",
};

// ─────────────────────── tiny helpers ───────────────────────
const token = () => (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

function authFetch(url: string) {
  return fetch(url, { headers: { Authorization: `Bearer ${token()}` } }).then((r) => r.json());
}

function MiniBar({ value, max, color = "#6366f1" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function StatBadge({ label, value, color = "indigo" }: { label: string; value: string | number; color?: string }) {
  const map: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <div className={`flex flex-col items-center px-3 py-2 rounded-xl border text-center ${map[color] || map.indigo}`}>
      <span className="text-lg font-bold leading-none">{value}</span>
      <span className="text-[10px] font-medium mt-0.5 opacity-70">{label}</span>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 ${className}`}>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  );
}

// ─────────────────────── custom tooltip ───────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl px-3 py-2 text-xs">
      <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

// ─────────────────────── USER analytics ───────────────────────
function UserAnalytics({ data }: { data: any }) {
  const { summary, moodTrend, moodDistribution, recentAssessments, recentBookings, bookingDistribution } = data;

  const moodDist = Object.entries(moodDistribution || {}).map(([name, value]) => ({ name, value, fill: MOOD_COLOR[name] || "#6366f1" }));
  const bookingDist = Object.entries(bookingDistribution || {}).map(([name, value]) => ({ name, value, fill: STATUS_COLOR[name] || "#6366f1" }));
  const trendData = (moodTrend || []).slice(0, 14).reverse().map((m: any) => ({ date: m.date?.slice(5), mood: m.intensity || 5, type: m.mood }));

  return (
    <div className="space-y-4">
      {/* Summary badges */}
      <div className="grid grid-cols-5 gap-2">
        <StatBadge label="Mood Logs" value={summary.totalMoodLogs} color="indigo" />
        <StatBadge label="Journals" value={summary.totalJournals} color="emerald" />
        <StatBadge label="Assessments" value={summary.totalAssessments} color="purple" />
        <StatBadge label="Sessions" value={summary.totalBookings} color="cyan" />
        <StatBadge label="SOS Alerts" value={summary.totalSosAlerts} color="rose" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Mood trend */}
        <ChartCard title="Mood Intensity (Last 14 Days)" className="md:col-span-2">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="mood" name="Intensity" stroke="#6366f1" fill="url(#moodGrad)" strokeWidth={2} dot={{ r: 3, fill: "#6366f1" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-center py-8 text-xs text-slate-400">No mood data recorded yet.</p>}
        </ChartCard>

        {/* Mood distribution */}
        <ChartCard title="Mood Distribution">
          {moodDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={moodDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {moodDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center py-8 text-xs text-slate-400">No mood logs yet.</p>}
        </ChartCard>

        {/* Booking distribution */}
        <ChartCard title="Session Status">
          {bookingDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={bookingDist} margin={{ left: -20, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Sessions" radius={[4, 4, 0, 0]}>
                  {bookingDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center py-8 text-xs text-slate-400">No sessions yet.</p>}
        </ChartCard>
      </div>

      {/* Recent assessments */}
      {recentAssessments?.length > 0 && (
        <ChartCard title="Recent Assessments">
          <div className="space-y-2">
            {recentAssessments.slice(0, 5).map((a: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{a.assessmentType}</span>
                  <span className="text-slate-400 ml-2">{new Date(a.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600">{a.percentage}%</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${["Minimal","Low","Excellent","Expert"].includes(a.level) ? "bg-emerald-100 text-emerald-700" : ["Moderate","Needs Work"].includes(a.level) ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-600"}`}>{a.level}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}

// ─────────────────────── PROFESSIONAL analytics ───────────────────────
function ProfessionalAnalytics({ data }: { data: any }) {
  const { summary, professional, recentBookings, recentReviews, bookingDistribution } = data;
  const bookingDist = Object.entries(bookingDistribution || {}).map(([name, value]) => ({ name, value, fill: STATUS_COLOR[name] || "#6366f1" }));
  const stars = Math.round(summary.averageRating || 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBadge label="Total Sessions" value={summary.totalSessions} color="indigo" />
        <StatBadge label="Completed" value={summary.completedSessions} color="emerald" />
        <StatBadge label="Pending" value={summary.pendingSessions} color="amber" />
        <StatBadge label="Reviews" value={summary.totalReviews} color="purple" />
      </div>

      {/* Rating + status */}
      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Rating & Profile">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className={i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-600"} />
              ))}
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm ml-1">{(summary.averageRating || 0).toFixed(1)}</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Verification", value: summary.verificationStatus, color: summary.verificationStatus === "VERIFIED" ? "emerald" : "amber" },
                { label: "Accepting Clients", value: summary.isAcceptingClients ? "Yes" : "No", color: summary.isAcceptingClients ? "emerald" : "rose" },
                { label: "Specialty", value: professional?.specializations?.[0] || "—", color: "indigo" },
                { label: "Experience", value: professional?.yearsOfExperience ? `${professional.yearsOfExperience} yrs` : "—", color: "cyan" },
                { label: "Location", value: [professional?.city, professional?.state].filter(Boolean).join(", ") || "—", color: "purple" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-semibold ${ item.color === "emerald" ? "text-emerald-600" : item.color === "amber" ? "text-amber-600" : item.color === "rose" ? "text-rose-500" : item.color === "cyan" ? "text-cyan-600" : item.color === "purple" ? "text-purple-600" : "text-indigo-600" }`}>{String(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Session status chart */}
        <ChartCard title="Session Status Breakdown">
          {bookingDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bookingDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {bookingDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center py-8 text-xs text-slate-400">No session data yet.</p>}
        </ChartCard>
      </div>

      {/* Recent reviews */}
      {recentReviews?.length > 0 && (
        <ChartCard title="Recent Reviews">
          <div className="space-y-2">
            {recentReviews.slice(0, 4).map((r: any, i: number) => (
              <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={11} className={j < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />)}
                  <span className="text-slate-400 ml-1">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-slate-500 italic">"{r.comment}"</p>}
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Recent bookings */}
      {recentBookings?.length > 0 && (
        <ChartCard title="Recent Sessions">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentBookings.slice(0, 5).map((b: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{b.sessionType}</span>
                  <span className="text-slate-400 ml-2">{new Date(b.scheduledAt).toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLOR[b.status] ? "" : "bg-slate-100 text-slate-600"}`}
                  style={{ backgroundColor: (STATUS_COLOR[b.status] || "#e2e8f0") + "20", color: STATUS_COLOR[b.status] || "#64748b" }}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}

// ─────────────────────── VENDOR analytics ───────────────────────
function VendorAnalytics({ data }: { data: any }) {
  const { summary, vendorProfile, severityDistribution, statusDistribution, recentAssignments } = data;
  const severityData = Object.entries(severityDistribution || {}).map(([name, value]) => ({ name, value, fill: name === "CRITICAL" ? "#ef4444" : name === "HIGH" ? "#f97316" : "#f59e0b" }));
  const statusData = Object.entries(statusDistribution || {}).map(([name, value]) => ({ name, value, fill: STATUS_COLOR[name] || "#6366f1" }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBadge label="Assignments" value={summary.totalAssignments} color="indigo" />
        <StatBadge label="Resolved" value={summary.resolvedCases} color="emerald" />
        <StatBadge label="Avg Response" value={summary.avgResponseMin ? `${summary.avgResponseMin}m` : "—"} color="cyan" />
        <StatBadge label={summary.isCurrentlyOnline ? "Online" : "Offline"} value={summary.isAvailable ? "Available" : "Busy"} color={summary.isCurrentlyOnline ? "emerald" : "rose"} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Assignment Severity">
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={severityData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Cases" radius={[4, 4, 0, 0]}>
                  {severityData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center py-8 text-xs text-slate-400">No assignments yet.</p>}
        </ChartCard>

        <ChartCard title="Dispatch Status">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {statusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center py-8 text-xs text-slate-400">No dispatch data.</p>}
        </ChartCard>
      </div>

      {/* Vendor profile details */}
      {vendorProfile && (
        <ChartCard title="Vendor Profile">
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {[
              { label: "Business", value: vendorProfile.businessName },
              { label: "Service Type", value: vendorProfile.serviceType },
              { label: "Phone", value: vendorProfile.phone || "—" },
            ].map(i => (
              <div key={i.label} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400">{i.label}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{i.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Recent assignments */}
      {recentAssignments?.length > 0 && (
        <ChartCard title="Recent Assignments">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentAssignments.slice(0, 5).map((a: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 text-xs">
                <div>
                  <span className="font-mono text-indigo-600 font-bold">#{a.id.slice(-6)}</span>
                  <span className="text-slate-400 ml-2">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.severity === "CRITICAL" ? "bg-rose-100 text-rose-700" : a.severity === "HIGH" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700"}`}>{a.severity}</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-bold">{a.dispatchStatus || a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}

// ─────────────────────── ENTERPRISE analytics ───────────────────────
function EnterpriseAnalytics({ data }: { data: any }) {
  const { summary, organization } = data;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <StatBadge label="Employees" value={summary.employeeCount} color="indigo" />
        <StatBadge label="Industry" value={summary.industry} color="cyan" />
      </div>
      <ChartCard title="Organization Details">
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {[
            { label: "Contact Person", value: summary.contactPerson || "—" },
            { label: "Phone", value: summary.phone || "—" },
            { label: "Organization Type", value: organization?.orgType || "—" },
            { label: "City", value: organization?.city || "—" },
            { label: "State", value: organization?.state || "—" },
            { label: "Reg. Number", value: organization?.registrationNumber || "—" },
            { label: "Applied On", value: organization?.createdAt ? new Date(organization.createdAt).toLocaleDateString() : "—" },
            { label: "Status", value: organization?.status || "—" },
          ].map(i => (
            <div key={i.label} className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-slate-400">{i.label}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-right max-w-[60%] truncate">{i.value}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

// ─────────────────────── Panel user card ───────────────────────
function PanelUserCard({
  user, panel, isSelected, onSelect, analytics, analyticsLoading,
}: {
  user: any; panel: string; isSelected: boolean;
  onSelect: () => void; analytics: any; analyticsLoading: boolean;
}) {
  const initials = (user.name || user.email || "U").slice(0, 2).toUpperCase();
  const gradients = ["from-indigo-500 to-purple-600", "from-cyan-500 to-blue-600", "from-emerald-500 to-teal-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600"];
  const grad = gradients[user.name?.charCodeAt(0) % gradients.length || 0];

  // Build mini stats bars per panel
  const miniStats = (() => {
    if (panel === "USER") {
      const s = user.stats || {};
      const max = Math.max(s.moodLogs, s.journals, s.assessments, s.sessions, s.sosAlerts, 1);
      return [
        { label: "Mood", value: s.moodLogs, color: "#6366f1", max },
        { label: "Journals", value: s.journals, color: "#10b981", max },
        { label: "Sessions", value: s.sessions, color: "#06b6d4", max },
      ];
    }
    if (panel === "PROFESSIONAL") {
      const s = user.stats || {};
      return [{ label: `${s.sessions} sessions`, value: null, color: "#6366f1", max: 1 }];
    }
    return [];
  })();

  return (
    <div className="border-b border-slate-100 dark:border-slate-700/60 last:border-0">
      {/* Row */}
      <button
        onClick={onSelect}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors cursor-pointer ${isSelected ? "bg-indigo-50 dark:bg-indigo-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
      >
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name || "—"}</span>
            {panel === "PROFESSIONAL" && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${user.stats?.verificationStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {user.stats?.verificationStatus || "PENDING"}
              </span>
            )}
            {panel === "VENDOR" && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${user.stats?.isOnline ? "bg-emerald-400" : "bg-slate-300"}`} />
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          {/* Mini stat bars for USER panel */}
          {miniStats.length > 0 && panel === "USER" && (
            <div className="mt-1.5 space-y-0.5">
              {miniStats.map((s) => <MiniBar key={s.label} value={s.value} max={s.max} color={s.color} />)}
            </div>
          )}
        </div>

        {/* Right side stats */}
        <div className="flex-shrink-0 text-right">
          {panel === "USER" && (
            <div className="flex gap-3 items-center">
              <div className="text-center hidden sm:block">
                <p className="text-sm font-bold text-indigo-600">{user.stats?.moodLogs ?? 0}</p>
                <p className="text-[9px] text-slate-400">moods</p>
              </div>
              <div className="text-center hidden sm:block">
                <p className="text-sm font-bold text-emerald-600">{user.stats?.sessions ?? 0}</p>
                <p className="text-[9px] text-slate-400">sessions</p>
              </div>
              {(user.stats?.sosAlerts ?? 0) > 0 && (
                <div className="text-center">
                  <p className="text-sm font-bold text-rose-600">{user.stats.sosAlerts}</p>
                  <p className="text-[9px] text-slate-400">SOS</p>
                </div>
              )}
            </div>
          )}
          {panel === "PROFESSIONAL" && (
            <div className="flex gap-3 items-center">
              <div className="text-center hidden sm:block">
                <p className="text-sm font-bold text-indigo-600">{user.stats?.sessions ?? 0}</p>
                <p className="text-[9px] text-slate-400">sessions</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-0.5 justify-end">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <p className="text-sm font-bold text-amber-600">{(user.stats?.rating ?? 0).toFixed(1)}</p>
                </div>
                <p className="text-[9px] text-slate-400">{user.stats?.reviews ?? 0} reviews</p>
              </div>
            </div>
          )}
          {panel === "VENDOR" && (
            <div className="text-center">
              <p className="text-sm font-bold text-indigo-600">{user.stats?.totalAssignments ?? 0}</p>
              <p className="text-[9px] text-slate-400">dispatches</p>
            </div>
          )}
          {panel === "ENTERPRISE" && (
            <div className="text-center">
              <p className="text-sm font-bold text-indigo-600">{user.stats?.employeeCount ?? 0}</p>
              <p className="text-[9px] text-slate-400">employees</p>
            </div>
          )}
          {/* Chevron */}
          <div className="mt-1 flex justify-end">
            {isSelected ? <ChevronUp size={14} className="text-indigo-500" /> : <ChevronDown size={14} className="text-slate-400" />}
          </div>
        </div>
      </button>

      {/* Expanded analytics drawer */}
      {isSelected && (
        <div className="border-t border-indigo-100 dark:border-indigo-900/40 bg-slate-50/60 dark:bg-slate-900/30 px-5 py-5">
          {analyticsLoading ? (
            <div className="flex items-center justify-center gap-3 py-10 text-sm text-slate-400">
              <Loader2 size={20} className="animate-spin text-indigo-500" /> Loading analytics…
            </div>
          ) : !analytics ? (
            <p className="text-center py-8 text-sm text-slate-400">No analytics data available.</p>
          ) : (
            <>
              {analytics.panel === "USER" && <UserAnalytics data={analytics} />}
              {analytics.panel === "PROFESSIONAL" && <ProfessionalAnalytics data={analytics} />}
              {analytics.panel === "VENDOR" && <VendorAnalytics data={analytics} />}
              {analytics.panel === "ENTERPRISE" && <EnterpriseAnalytics data={analytics} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────── PANEL OVERVIEW CHARTS ───────────────────────
function PanelOverviewCharts({ panel, users }: { panel: string; users: any[] }) {
  if (users.length === 0) return null;

  if (panel === "USER") {
    const moodData = [
      { name: "Mood Logs", value: users.reduce((s, u) => s + (u.stats?.moodLogs || 0), 0), fill: "#6366f1" },
      { name: "Journals", value: users.reduce((s, u) => s + (u.stats?.journals || 0), 0), fill: "#10b981" },
      { name: "Assessments", value: users.reduce((s, u) => s + (u.stats?.assessments || 0), 0), fill: "#8b5cf6" },
      { name: "Sessions", value: users.reduce((s, u) => s + (u.stats?.sessions || 0), 0), fill: "#06b6d4" },
      { name: "SOS Alerts", value: users.reduce((s, u) => s + (u.stats?.sosAlerts || 0), 0), fill: "#ef4444" },
    ];
    const topUsers = [...users].sort((a, b) => (b.stats?.sessions || 0) - (a.stats?.sessions || 0)).slice(0, 8).map(u => ({ name: (u.name || "?").split(" ")[0], sessions: u.stats?.sessions || 0, moods: u.stats?.moodLogs || 0 }));
    return (
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Platform Engagement Totals">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={moodData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Total" radius={[4, 4, 0, 0]}>
                {moodData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Top Users by Sessions" className="md:col-span-2">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topUsers} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sessions" name="Sessions" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="moods" name="Mood Logs" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    );
  }

  if (panel === "PROFESSIONAL") {
    const ratingDist = [1, 2, 3, 4, 5].map(r => ({
      name: `${r}★`,
      count: users.filter(u => Math.round(u.stats?.rating || 0) === r).length,
      fill: r >= 4 ? "#10b981" : r === 3 ? "#f59e0b" : "#ef4444",
    }));
    const verified = users.filter(u => u.stats?.verificationStatus === "VERIFIED").length;
    const accepting = users.filter(u => u.stats?.isAcceptingClients).length;
    const pieData = [
      { name: "Verified", value: verified, fill: "#10b981" },
      { name: "Pending", value: users.length - verified, fill: "#f59e0b" },
    ];
    return (
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Verification Status">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Rating Distribution">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ratingDist} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Professionals" radius={[4, 4, 0, 0]}>
                {ratingDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Summary">
          <div className="space-y-3 mt-2">
            {[
              { label: "Total Professionals", value: users.length, color: "text-indigo-600" },
              { label: "Verified", value: verified, color: "text-emerald-600" },
              { label: "Accepting Clients", value: accepting, color: "text-cyan-600" },
              { label: "Avg Rating", value: users.length ? (users.reduce((s, u) => s + (u.stats?.rating || 0), 0) / users.length).toFixed(1) : "—", color: "text-amber-600" },
              { label: "Total Sessions", value: users.reduce((s, u) => s + (u.stats?.sessions || 0), 0), color: "text-purple-600" },
            ].map(i => (
              <div key={i.label} className="flex justify-between text-xs">
                <span className="text-slate-400">{i.label}</span>
                <span className={`font-bold ${i.color}`}>{i.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    );
  }

  if (panel === "VENDOR") {
    const online = users.filter(u => u.stats?.isOnline).length;
    const available = users.filter(u => u.stats?.isAvailable).length;
    const pieData = [
      { name: "Online", value: online, fill: "#10b981" },
      { name: "Offline", value: users.length - online, fill: "#e2e8f0" },
    ];
    return (
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Online Status">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Summary">
          <div className="space-y-3 mt-2">
            {[
              { label: "Total Vendors", value: users.length, color: "text-indigo-600" },
              { label: "Currently Online", value: online, color: "text-emerald-600" },
              { label: "Available", value: available, color: "text-cyan-600" },
              { label: "Total Dispatches", value: users.reduce((s, u) => s + (u.stats?.totalAssignments || 0), 0), color: "text-amber-600" },
            ].map(i => (
              <div key={i.label} className="flex justify-between text-xs">
                <span className="text-slate-400">{i.label}</span>
                <span className={`font-bold ${i.color}`}>{i.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    );
  }

  if (panel === "ENTERPRISE") {
    const byType: Record<string, number> = {};
    users.forEach(u => { const t = u.stats?.industry || "Other"; byType[t] = (byType[t] || 0) + 1; });
    const typeData = Object.entries(byType).map(([name, value], i) => ({ name, value, fill: CHART_COLORS[i % CHART_COLORS.length] }));
    return (
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Industry Distribution">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {typeData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Summary">
          <div className="space-y-3 mt-2">
            {[
              { label: "Total Organizations", value: users.length, color: "text-indigo-600" },
              { label: "Total Employees", value: users.reduce((s, u) => s + (u.stats?.employeeCount || 0), 0).toLocaleString(), color: "text-emerald-600" },
            ].map(i => (
              <div key={i.label} className="flex justify-between text-xs">
                <span className="text-slate-400">{i.label}</span>
                <span className={`font-bold ${i.color}`}>{i.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    );
  }

  return null;
}

// ─────────────────────── PANEL CONFIG ───────────────────────
const PANELS = [
  { key: "USER", label: "Users", icon: Users, color: "indigo", desc: "Regular platform users" },
  { key: "PROFESSIONAL", label: "Professionals", icon: Briefcase, color: "purple", desc: "Therapists & counselors" },
  { key: "VENDOR", label: "Vendors", icon: Truck, color: "orange", desc: "Emergency responders" },
  { key: "ENTERPRISE", label: "Enterprises", icon: Building2, color: "cyan", desc: "Organizations & companies" },
] as const;

// ─────────────────────── MAIN EXPORT ───────────────────────
export default function AnalyticsPanel() {
  const [activePanel, setActivePanel] = useState<"USER" | "PROFESSIONAL" | "VENDOR" | "ENTERPRISE">("USER");
  const [panelUsers, setPanelUsers] = useState<any[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [analyticsCache, setAnalyticsCache] = useState<Record<string, any>>({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [addModal, setAddModal] = useState<{ open: boolean; role: typeof PANELS[number]["key"] } | null>(null);

  const loadUsers = useCallback(async (panel = activePanel, q = search) => {
    setPanelLoading(true);
    setSelectedUserId(null);
    try {
      const data = await authFetch(`/api/admin/panel-users?panel=${panel}&search=${encodeURIComponent(q)}`);
      if (data.success) setPanelUsers(data.data || []);
    } catch { /* silently ignore */ } finally { setPanelLoading(false); }
  }, [activePanel, search]);

  const loadAnalytics = useCallback(async (userId: string) => {
    if (analyticsCache[userId]) return;
    setAnalyticsLoading(true);
    try {
      const data = await authFetch(`/api/admin/user-analytics?userId=${userId}&panel=${activePanel}`);
      if (data.success) setAnalyticsCache(prev => ({ ...prev, [userId]: data.data }));
    } catch { /* silently ignore */ } finally { setAnalyticsLoading(false); }
  }, [activePanel, analyticsCache]);

  const toggleUser = (userId: string) => {
    if (selectedUserId === userId) { setSelectedUserId(null); return; }
    setSelectedUserId(userId);
    loadAnalytics(userId);
  };

  const switchPanel = (key: typeof activePanel) => {
    setActivePanel(key);
    setSearch("");
    setPanelUsers([]);
    setSelectedUserId(null);
    setTimeout(() => {
      setPanelLoading(true);
      authFetch(`/api/admin/panel-users?panel=${key}&search=`).then(data => {
        if (data.success) setPanelUsers(data.data || []);
      }).finally(() => setPanelLoading(false));
    }, 0);
  };

  const panelCfg = PANELS.find(p => p.key === activePanel)!;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* Add User Modal */}
      {addModal?.open && (
        <AddUserModal
          isOpen={addModal.open}
          role={addModal.role}
          onClose={() => setAddModal(null)}
          onSuccess={() => { setAddModal(null); loadUsers(); }}
        />
      )}

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Reports & Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Deep-dive analytics across all platform panels — powered by live database data</p>
        </div>
      </div>

      {/* Panel selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PANELS.map((p) => {
          const active = activePanel === p.key;
          const colorMap: Record<string, string> = {
            indigo: active ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300",
            purple: active ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300",
            orange: active ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-500/20" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300",
            cyan: active ? "bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-500/20" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-cyan-300",
          };
          return (
            <button key={p.key} onClick={() => switchPanel(p.key)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer text-left bg-white dark:bg-slate-800/60 ${colorMap[p.color]}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700"}`}>
                <p.icon size={18} className={active ? "text-white" : "text-slate-500"} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-bold ${active ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>{p.label}</p>
                <p className={`text-[10px] truncate ${active ? "text-white/70" : "text-slate-400"}`}>{p.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel overview charts (rendered once users are loaded) */}
      {panelUsers.length > 0 && !panelLoading && (
        <PanelOverviewCharts panel={activePanel} users={panelUsers} />
      )}

      {/* Search + Add row */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && loadUsers()}
            placeholder={`Search ${panelCfg.label.toLowerCase()} by name or email…`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/60 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
          />
        </div>
        <button onClick={() => loadUsers()} disabled={panelLoading}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 cursor-pointer disabled:opacity-60 flex items-center gap-2 transition-colors">
          {panelLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Search
        </button>
        <button onClick={() => setAddModal({ open: true, role: activePanel })}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 cursor-pointer flex items-center gap-2 transition-colors">
          <UserPlus size={14} /> Add
        </button>
        <button onClick={() => loadUsers()} disabled={panelLoading}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
          <RefreshCw size={14} className={panelLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* User list */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <panelCfg.icon size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {panelCfg.label}
            </span>
            {!panelLoading && panelUsers.length > 0 && (
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{panelUsers.length}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">Click a row to expand analytics</span>
        </div>

        {panelLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400">Loading {panelCfg.label.toLowerCase()}…</p>
          </div>
        ) : panelUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <panelCfg.icon size={24} className="text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No {panelCfg.label.toLowerCase()} found</p>
              <p className="text-xs text-slate-400 mt-0.5">Try searching or click Search to load all</p>
            </div>
          </div>
        ) : (
          <div>
            {panelUsers.map(u => (
              <PanelUserCard
                key={u.id} user={u} panel={activePanel}
                isSelected={selectedUserId === u.id}
                onSelect={() => toggleUser(u.id)}
                analytics={analyticsCache[u.id] || null}
                analyticsLoading={analyticsLoading && selectedUserId === u.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
