"use client";

import { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2, Users, TrendingUp, Heart, AlertTriangle, ShieldCheck,
  Award, BarChart3, Download, RefreshCw, Calendar, ArrowLeft,
  Briefcase, Activity, CheckCircle, Menu, X
} from "lucide-react";

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

  const navTabs = [
    { name: "Analytics", icon: BarChart3 },
    { name: "EAP Program Management", icon: Briefcase },
    { name: "Department Insights", icon: Building2 },
    { name: "Reports & Exports", icon: Download }
  ];

  const handleTabChange = (name: string) => {
    setActiveTab(name);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] text-[var(--on-surface)] flex">

      {/* ── Mobile Top Bar ── */}
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

      {/* ── Mobile Backdrop ── */}
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
          {navTabs.map((tab) => (
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
      </main>
    </div>
  );
}
