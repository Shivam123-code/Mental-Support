"use client";

import { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2, Users, TrendingUp, Heart, AlertTriangle, ShieldCheck,
  Award, BarChart3, Download, RefreshCw, Calendar, ArrowLeft,
  Briefcase, Activity, CheckCircle, Menu, X, Settings
} from "lucide-react";
import ChangePasswordCard from '@/components/ChangePasswordCard';

export default function EnterpriseDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ENTERPRISE']}>
      <EnterpriseDashboardContent />
    </ProtectedRoute>
  );
}

function EnterpriseDashboardContent() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Analytics");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock enterprise metrics
  const stats = [
    { title: "Total Covered Employees", value: "1,240", change: "+12% MoM", icon: Users, color: "text-indigo-600" },
    { title: "Wellbeing EAP Adoption", value: "72.4%", change: "+4.2% since launch", icon: Activity, color: "text-emerald-600" },
    { title: "Aggregated Burnout Risk", value: "Low (18%)", change: "-5% vs last quarter", icon: TrendingUp, color: "text-amber-500" },
    { title: "Programs Enrolled", value: "6 Active", change: "2 launching next week", icon: Award, color: "text-rose-500" }
  ];

  const programUsage = [
    { name: "Burnout Recovery Program", enrolled: 248, completed: "82%", status: "Active" },
    { name: "Anxiety Reset Journey", enrolled: 184, completed: "74%", status: "Active" },
    { name: "Sleep Hygiene Course", enrolled: 312, completed: "91%", status: "Completed" },
    { name: "Mindfulness & Peak Focus", enrolled: 120, completed: "58%", status: "Active" }
  ];

  const departmentHealth = [
    { name: "Engineering & Dev", size: 450, participation: "84%", risk: "Moderate" },
    { name: "Customer Experience", size: 180, participation: "92%", risk: "Low" },
    { name: "Sales & Marketing", size: 310, participation: "61%", risk: "Moderate" },
    { name: "Finance & Operations", size: 120, participation: "79%", risk: "Low" },
    { name: "HR & Talent", size: 60, participation: "95%", risk: "Low" }
  ];

  // Org-level analytics tabs only
  const orgTabs = [
    { name: "Analytics", icon: BarChart3 },
    { name: "EAP Program Management", icon: Briefcase },
    { name: "Department Insights", icon: Building2 },
    { name: "Reports & Exports", icon: Download },
    { name: "Utilization Trends", icon: TrendingUp },
    { name: "Burnout Indicators", icon: AlertTriangle },
    { name: "Emotional Wellness Analytics", icon: Heart },
    { name: "Engagement Metrics", icon: Activity },
    { name: "Risk Insights", icon: ShieldCheck },
    { name: "Settings", icon: Settings },
  ];

  const handleTabChange = (name: string) => {
    setActiveTab(name);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] text-[var(--on-surface)] flex">

      {/* â”€â”€ Mobile Top Bar â”€â”€ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]/60 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-indigo-600" />
          <span className="font-display font-semibold text-sm">TechCorp EAP</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--surface-container)] cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* â”€â”€ Mobile Backdrop â”€â”€ */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 lg:w-64 border-r border-[var(--outline-variant)]/60 bg-[var(--surface-container-low)] flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-[var(--outline-variant)]/40 flex items-center gap-3">
          <Building2 size={24} className="text-indigo-600" />
          <div>
            <span className="font-display font-semibold text-sm text-[var(--on-surface)] block">TechCorp Global</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block">Enterprise EAP</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {orgTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.name
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--on-surface-variant)] hover:text-indigo-600 hover:bg-[var(--surface-container)]"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container)] space-y-3">
          <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>DPDP & GDPR Compliant</span>
          </div>
          <button onClick={logout} className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer">
            <ArrowLeft size={10} /> Exit Workspace
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 pt-14 lg:pt-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1200px] mx-auto">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--outline-variant)]/40 pb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--on-surface)]">Enterprise Command Center</h1>
              <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Real-time organizational wellbeing intelligence & EAP dashboard.</p>
            </div>
            <button className="btn-secondary !text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-center whitespace-nowrap">
              <RefreshCw size={12} /> Sync Insights
            </button>
          </header>

          {/* Tab: Analytics */}
          {activeTab === "Analytics" && (
            <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-300">
              {/* Disclaimer */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[var(--on-surface)]">Privacy Protection Enabled</h4>
                  <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed">
                    All stress ratings, mood logs, and clinical records are completely anonymized and aggregated. Individual patient details are private to secure emotional trust.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-label-bold uppercase text-[var(--on-surface-variant)]/70 text-[10px] leading-tight">{stat.title}</span>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-display">{stat.value}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">{stat.change}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active EAP Programs usage */}
                <div className="card lg:col-span-2 p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Active EAP Program Completion</h3>
                  <div className="overflow-x-auto -mx-2 px-2">
                    <table className="w-full text-left text-xs border-collapse min-w-[400px]">
                      <thead>
                        <tr className="border-b border-[var(--outline-variant)] text-[var(--on-surface-variant)]/60">
                          <th className="py-2.5 font-semibold">Wellbeing Program</th>
                          <th className="py-2.5 font-semibold">Enrolled</th>
                          <th className="py-2.5 font-semibold">Completion</th>
                          <th className="py-2.5 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programUsage.map((p, i) => (
                          <tr key={i} className="border-b border-[var(--outline-variant)]/30 hover:bg-[var(--surface-container-low)]">
                            <td className="py-3 font-semibold">{p.name}</td>
                            <td className="py-3 font-bold text-indigo-600">{p.enrolled}</td>
                            <td className="py-3 font-semibold text-emerald-600">{p.completed}</td>
                            <td className="py-3 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.status === "Active" ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Wellbeing Index Meter */}
                <div className="card lg:col-span-1 p-4 sm:p-6 space-y-6 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Overall Workplace Score</h3>
                    <p className="text-[10px] text-[var(--on-surface-variant)]/60">Anonymized wellness quotient</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="var(--surface-container-low)" strokeWidth="6" />
                        <circle
                          cx="56" cy="56" r="48" fill="none"
                          stroke="var(--primary-bright)" strokeWidth="6"
                          strokeDasharray={301.6}
                          strokeDashoffset={301.6 - (301.6 * 84.5) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold font-display text-emerald-600">84.5%</span>
                        <span className="text-[8px] text-[var(--on-surface-variant)]/60 uppercase">Resilience</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold mt-2">Satisfactory Trust Level</p>
                  </div>
                  <div className="border-t border-[var(--outline-variant)]/40 pt-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-between gap-1 text-[11px] text-[var(--on-surface-variant)]">
                    <span>Weekly Sessions: <strong>48 Booked</strong></span>
                    <span>Safety Cases: <strong>0 Escalated</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: EAP Program Management */}
          {activeTab === "EAP Program Management" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="card p-4 sm:p-6 space-y-4">
                <h3 className="text-sm font-bold text-[var(--on-surface)]">EAP Benefit Configurations</h3>
                <p className="text-xs text-[var(--on-surface-variant)]">Configure therapeutic session allowances, wellness day triggers, and crisis referral policies for covered employees.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-4 p-4 bg-[var(--surface-container-low)] rounded-xl border border-[var(--outline-variant)]/30">
                    <h4 className="text-label-bold uppercase text-indigo-600">Therapist Sessions Coverage</h4>
                    <div className="space-y-2 text-xs">
                      <p className="flex justify-between gap-4"><span>Max Allowed Sessions / Employee / Year</span> <strong>12 sessions</strong></p>
                      <p className="flex justify-between gap-4"><span>Allowed Specialties</span> <strong>Clinical, Stress & Burnout</strong></p>
                      <p className="flex justify-between gap-4"><span>Co-pay arrangement</span> <strong>100% Employer Covered</strong></p>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-[var(--surface-container-low)] rounded-xl border border-[var(--outline-variant)]/30">
                    <h4 className="text-label-bold uppercase text-emerald-600">Proactive Interventions</h4>
                    <div className="space-y-2 text-xs">
                      <p className="flex justify-between gap-4"><span>Anonymous AI Risk Flagging</span> <strong className="text-emerald-600">Enabled</strong></p>
                      <p className="flex justify-between gap-4"><span>Burnout threshold alert</span> <strong>&gt;40% risk rating</strong></p>
                      <p className="flex justify-between gap-4"><span>Mandatory Wellness Day Triggers</span> <strong>Activated</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Department Insights */}
          {activeTab === "Department Insights" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="card p-4 sm:p-6 space-y-4">
                <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Departmental wellbeing participation & risk rating</h3>
                <div className="space-y-3">
                  {departmentHealth.map((dept, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-[var(--surface-container-low)] border-hairline rounded-xl gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--on-surface)]">{dept.name}</h4>
                        <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Size: <strong>{dept.size} employees</strong> &bull; EAP adoption: <strong className="text-indigo-600">{dept.participation}</strong></p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-[var(--on-surface-variant)]">Burnout Risk:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${dept.risk === "Low" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                          {dept.risk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Reports & Exports */}
          {activeTab === "Reports & Exports" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="card p-4 sm:p-6 space-y-4">
                <h3 className="text-sm font-bold text-[var(--on-surface)]">Export Compliance Reports</h3>
                <p className="text-xs text-[var(--on-surface-variant)]">Export aggregated, anonymized wellness compliance reporting datasets for ESG metrics, health certifications, and annual health audit files.</p>

                <div className="space-y-3 pt-4">
                  {[
                    { title: "Q2 Wellbeing & Stress Metrics Assessment Report", type: "PDF Report", size: "2.4 MB" },
                    { title: "Anonymized EAP Program Participation Dataset (DPDP Compliant)", type: "CSV Dataset", size: "48 KB" }
                  ].map((rep, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 bg-[var(--surface-container-low)] border-hairline rounded-xl text-xs">
                      <div>
                        <span className="font-semibold block">{rep.title}</span>
                        <span className="text-[10px] text-[var(--on-surface-variant)]/70">{rep.type} &bull; {rep.size}</span>
                      </div>
                      <button className="btn-secondary !py-1.5 !px-3 !text-[11px] flex items-center gap-1 self-start sm:self-center whitespace-nowrap">
                        <Download size={12} /> Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

          {/* Tab: Utilization Trends */}
          {activeTab === "Utilization Trends" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[var(--on-surface)]">Privacy Protection Enabled</h4>
                  <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed">
                    Utilization data is aggregated to maintain employee confidentiality. No individual identities are exposed.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card p-4 sm:p-6 space-y-4 lg:col-span-2">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Monthly Utilization</h3>
                  <div className="h-40 flex items-end gap-2 sm:gap-4 mt-4">
                    {[ { month: "Jan", val: 40 }, { month: "Feb", val: 55 }, { month: "Mar", val: 45 }, { month: "Apr", val: 70 }, { month: "May", val: 65 }, { month: "Jun", val: 85 }].map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                        <div className="w-full bg-indigo-600 rounded-t-sm transition-all duration-300 group-hover:bg-indigo-500" style={{ height: `${d.val}%` }}></div>
                        <span className="text-[10px] text-[var(--on-surface-variant)]">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">YTD Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[var(--on-surface-variant)]">Total Sessions</p>
                      <p className="text-2xl font-bold font-display text-[var(--on-surface)]">1,247</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--on-surface-variant)]">Avg per Employee</p>
                      <p className="text-xl font-bold font-display text-[var(--on-surface)]">1.8</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--on-surface-variant)]">YoY Trend</p>
                      <p className="text-sm font-bold text-emerald-600">+22% YoY</p>
                    </div>
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4 lg:col-span-2">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Service Type Breakdown</h3>
                  <div className="space-y-4 mt-2">
                    {[
                      { label: "Individual Therapy", percent: 48, color: "bg-indigo-600" },
                      { label: "Group Sessions", percent: 22, color: "bg-emerald-600" },
                      { label: "Assessments", percent: 18, color: "bg-amber-500" },
                      { label: "Crisis Support", percent: 12, color: "bg-rose-500" }
                    ].map((s, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{s.label}</span>
                          <span className="font-bold">{s.percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--surface-container)] rounded-full overflow-hidden">
                          <div className={`h-full ${s.color}`} style={{ width: `${s.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Peak Usage Days</h3>
                  <div className="flex items-end h-32 gap-2 mt-4">
                    {[
                      { day: "Mon", val: 34 }, { day: "Tue", val: 28 }, { day: "Wed", val: 22 }, { day: "Thu", val: 10 }, { day: "Fri", val: 6 }
                    ].map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1">
                        <div className="w-full bg-indigo-200 rounded-t-sm" style={{ height: `${d.val}%` }}>
                          <div className="w-full bg-indigo-600 rounded-t-sm" style={{ height: '100%' }}></div>
                        </div>
                        <span className="text-[9px] text-[var(--on-surface-variant)]">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Burnout Indicators */}
          {activeTab === "Burnout Indicators" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card p-4 sm:p-6 space-y-6 flex flex-col items-center justify-center">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)] self-start">Risk Level Gauge</h3>
                  <div className="relative w-40 h-20 flex justify-center overflow-hidden mt-4">
                    <svg className="w-40 h-40 transform" viewBox="0 0 100 100">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--surface-container)" strokeWidth="12" strokeLinecap="round" />
                      <path d="M 10 50 A 40 40 0 0 1 35 15" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="12" strokeLinecap="round" />
                    </svg>
                    <div className="absolute bottom-0 flex flex-col items-center">
                      <span className="text-2xl font-bold font-display text-emerald-600">18%</span>
                      <span className="text-[10px] text-[var(--on-surface-variant)] uppercase font-bold">Low Overall</span>
                    </div>
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4 lg:col-span-2">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Department Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--outline-variant)] text-[var(--on-surface-variant)]/60">
                          <th className="py-2 font-semibold">Department</th>
                          <th className="py-2 font-semibold text-right">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { dept: "Engineering", risk: "28% Moderate", color: "bg-amber-100 text-amber-600" },
                          { dept: "Customer Exp", risk: "12% Low", color: "bg-emerald-100 text-emerald-600" },
                          { dept: "Sales", risk: "31% Moderate", color: "bg-amber-100 text-amber-600" },
                          { dept: "Finance", risk: "15% Low", color: "bg-emerald-100 text-emerald-600" },
                          { dept: "HR", risk: "9% Low", color: "bg-emerald-100 text-emerald-600" }
                        ].map((d, i) => (
                          <tr key={i} className="border-b border-[var(--outline-variant)]/30">
                            <td className="py-2.5 font-semibold">{d.dept}</td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${d.color}`}>{d.risk}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4 lg:col-span-2">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Early Warning Signals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    <div className="p-3 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 rounded-xl flex items-center gap-3">
                      <AlertTriangle className="text-amber-500" size={16} />
                      <div>
                        <p className="text-xs font-bold">Overtime Hours</p>
                        <p className="text-[10px] text-[var(--on-surface-variant)]">Trending Up 12%</p>
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 rounded-xl flex items-center gap-3">
                      <AlertTriangle className="text-amber-500" size={16} />
                      <div>
                        <p className="text-xs font-bold">Leave Requests</p>
                        <p className="text-[10px] text-[var(--on-surface-variant)]">Spike in last 2 weeks</p>
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 rounded-xl flex items-center gap-3">
                      <TrendingUp className="text-rose-500 transform rotate-180" size={16} />
                      <div>
                        <p className="text-xs font-bold">Engagement</p>
                        <p className="text-[10px] text-[var(--on-surface-variant)]">Drop by 8%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">8-Week Trend</h3>
                  <div className="flex items-end h-16 gap-1 mt-4">
                    {[40, 45, 50, 48, 55, 60, 58, 65].map((val, i) => (
                      <div key={i} className="flex-1 bg-amber-400 rounded-t-sm" style={{ height: `${val}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                <CheckCircle className="text-indigo-600" size={18} />
                <p className="text-xs text-indigo-900 font-semibold">Recommended action: Schedule proactive wellness sessions for Engineering & Sales teams</p>
              </div>
            </div>
          )}

          {/* Tab: Emotional Wellness Analytics */}
          {activeTab === "Emotional Wellness Analytics" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <p className="text-[11px] text-[var(--on-surface-variant)] italic">Note: All emotional data is anonymized and aggregated. No individual data is visible.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-4 sm:p-6 space-y-4 flex flex-col items-center">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)] w-full text-left">Org-wide Mood Distribution</h3>
                  <div className="relative w-40 h-40 flex items-center justify-center mt-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="50%" cy="50%" r="40%" fill="none" stroke="var(--surface-container)" strokeWidth="16" />
                      <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="251" strokeDashoffset="0" />
                      <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="251" strokeDashoffset="80" />
                      <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="251" strokeDashoffset="183" />
                      <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="251" strokeDashoffset="228" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold font-display text-[var(--on-surface)]">Mood</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Very Good 32%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Good 41%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Neutral 18%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Low 9%</span>
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Top Emotional Themes</h3>
                  <div className="space-y-3 mt-4">
                    {[
                      { theme: "Work pressure", pct: 43 },
                      { theme: "Relationship stress", pct: 21 },
                      { theme: "Financial anxiety", pct: 18 },
                      { theme: "Uncertainty", pct: 11 },
                      { theme: "Other", pct: 7 }
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs w-28 shrink-0">{t.theme}</span>
                        <div className="flex-1 h-2 bg-[var(--surface-container)] rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${t.pct}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--on-surface-variant)] w-8 text-right">{t.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Stress Level Heatmap</h3>
                  <div className="grid grid-rows-4 gap-1 mt-4">
                    {Array.from({ length: 4 }).map((_, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 7 }).map((_, colIndex) => {
                          const intensity = (rowIndex + colIndex) % 4;
                          const colors = ["bg-emerald-100", "bg-emerald-300", "bg-amber-300", "bg-rose-400"];
                          return (
                            <div key={colIndex} className={`h-6 rounded-sm ${colors[intensity]}`}></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Wellness Score Trend (8 Weeks)</h3>
                  <div className="h-32 w-full mt-4 flex items-end">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <polyline
                        points="0,80 15,70 30,75 45,60 60,65 75,40 90,50 100,30"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Engagement Metrics */}
          {activeTab === "Engagement Metrics" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Platform DAU", value: "67%" },
                  { title: "Program Completion", value: "78%" },
                  { title: "Assessment Participation", value: "54%" },
                  { title: "Check-in Streak Avg", value: "11 days" }
                ].map((kpi, i) => (
                  <div key={i} className="card p-4 bg-[var(--surface-container-low)]">
                    <p className="text-label-bold uppercase text-[var(--on-surface-variant)]/70 text-[10px] mb-2">{kpi.title}</p>
                    <p className="text-xl font-bold font-display">{kpi.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Feature Usage Breakdown</h3>
                  <div className="space-y-3 mt-4">
                    {[
                      { feature: "Mood tracker", uses: 892, color: "bg-indigo-500" },
                      { feature: "Journal", uses: 634, color: "bg-emerald-500" },
                      { feature: "AI Companion", uses: 421, color: "bg-blue-500" },
                      { feature: "Community", uses: 287, color: "bg-amber-500" },
                      { feature: "Assessments", uses: 198, color: "bg-rose-500" }
                    ].map((f, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{f.feature}</span>
                          <span className="font-bold">{f.uses}</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--surface-container)] rounded-full overflow-hidden">
                          <div className={`h-full ${f.color}`} style={{ width: `${(f.uses / 892) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Engagement Funnel</h3>
                  <div className="flex flex-col gap-2 mt-4 items-center">
                    <div className="w-full bg-indigo-100 text-indigo-800 text-xs font-bold py-2 text-center rounded-sm">Enrolled (100%)</div>
                    <div className="w-[85%] bg-indigo-200 text-indigo-800 text-xs font-bold py-2 text-center rounded-sm">Active (85%)</div>
                    <div className="w-[60%] bg-indigo-300 text-indigo-900 text-xs font-bold py-2 text-center rounded-sm">Consistent (60%)</div>
                    <div className="w-[35%] bg-indigo-400 text-white text-xs font-bold py-2 text-center rounded-sm">High-engagers (35%)</div>
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Monthly Active Users</h3>
                  <div className="h-40 flex items-end gap-2 sm:gap-4 mt-4">
                    {[ { month: "Jan", val: 50 }, { month: "Feb", val: 60 }, { month: "Mar", val: 55 }, { month: "Apr", val: 75 }, { month: "May", val: 80 }, { month: "Jun", val: 90 }].map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                        <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: `${d.val}%` }}></div>
                        <span className="text-[10px] text-[var(--on-surface-variant)]">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Top Engaged Departments</h3>
                  <div className="space-y-3 mt-4">
                    {[
                      { dept: "Customer Experience", score: "92%" },
                      { dept: "HR & Talent", score: "95%" },
                      { dept: "Engineering & Dev", score: "84%" }
                    ].map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Award className="text-amber-500" size={16} />
                          <span className="text-xs font-bold">{d.dept}</span>
                        </div>
                        <span className="text-xs font-bold text-indigo-600">{d.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Risk Insights */}
          {activeTab === "Risk Insights" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-amber-600" size={18} />
                    <h4 className="text-sm font-bold text-amber-900">Attrition Risk</h4>
                  </div>
                  <p className="text-xs text-amber-800">Moderate (22 employees flagged)</p>
                </div>
                <div className="card p-4 bg-emerald-50 border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-emerald-600" size={18} />
                    <h4 className="text-sm font-bold text-emerald-900">Crisis Escalation</h4>
                  </div>
                  <p className="text-xs text-emerald-800">Low (3 active cases)</p>
                </div>
                <div className="card p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="text-amber-600" size={18} />
                    <h4 className="text-sm font-bold text-amber-900">Burnout Surge</h4>
                  </div>
                  <p className="text-xs text-amber-800">Moderate (Engineering dept)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Predictive Insights</h3>
                  <ul className="space-y-3 mt-4 text-xs text-[var(--on-surface)]">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">â€¢</span>
                      <span>High probability of burnout spike in Sales mid-quarter based on current hours logged.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">â€¢</span>
                      <span>Increase in financial anxiety themes correlates with upcoming performance reviews.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">â€¢</span>
                      <span>Departments with active community engagement show 40% lower turnover risk.</span>
                    </li>
                  </ul>
                </div>

                <div className="card p-4 sm:p-6 space-y-4">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Upcoming Interventions</h3>
                  <div className="space-y-3 mt-4">
                    {[
                      { action: "Manager Resilience Workshop", date: "Oct 12" },
                      { action: "Engineering Team Wellness Day", date: "Oct 18" },
                      { action: "Financial Planning Seminar", date: "Nov 02" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-indigo-500" size={14} />
                          <span className="text-xs font-semibold">{item.action}</span>
                        </div>
                        <span className="text-[10px] text-[var(--on-surface-variant)] font-bold">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4 sm:p-6 space-y-4 lg:col-span-2">
                  <h3 className="text-label-bold uppercase text-[var(--on-surface-variant)]">Compliance Status</h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg"><CheckCircle size={14} /> DPDP Compliant</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg"><CheckCircle size={14} /> ISO 27001 Aligned</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg"><CheckCircle size={14} /> GDPR Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold font-display text-[var(--on-surface)]">Account Settings</h2>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Manage your enterprise account credentials.</p>
              </div>
              <div className="max-w-xl">
                <ChangePasswordCard />
              </div>
            </div>
          )}

      </main>
    </div>
  );
}
