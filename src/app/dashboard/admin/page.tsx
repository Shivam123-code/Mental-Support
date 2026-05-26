"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Briefcase, Building2, Brain, BookOpen, Smile, Heart,
  AlertTriangle, Shield, Cpu, FileText, BarChart3, Compass, Wallet,
  CheckSquare, Bell, Settings, List, ArrowLeft, ArrowRight, ShieldCheck,
  Search, Check, CheckCircle, X, ShieldAlert, Plus, Edit3, Trash2, Download, ExternalLink, RefreshCw
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
  const [activeTab, setActiveTab] = useState<string>("Overview");

  // React states for simulation data
  const [sosCases, setSosCases] = useState<SOSCase[]>([
    { id: "SOS-104", user: "User #4582", region: "Bangalore, India", risk: "CRITICAL", timeElapsed: "2m ago", status: "PENDING", assignedTo: "None" },
    { id: "SOS-103", user: "User #8931", region: "Mumbai, India", risk: "HIGH", timeElapsed: "8m ago", status: "ASSIGNED", assignedTo: "Dr. Kavita Rao" },
    { id: "SOS-102", user: "User #1024", region: "Delhi, India", risk: "MODERATE", timeElapsed: "14m ago", status: "ASSIGNED", assignedTo: "Counsellor Rahul" },
    { id: "SOS-101", user: "User #7729", region: "Kolkata, India", risk: "LOW", timeElapsed: "45m ago", status: "RESOLVED", assignedTo: "Dr. Ananya Sen" }
  ]);

  const [applicants, setApplicants] = useState<ProfessionalApplicant[]>([
    { id: "PRO-401", name: "Dr. Vivek Sharma", specialty: "Clinical Psychology", license: "RCI-A48291", status: "PENDING" },
    { id: "PRO-402", name: "Sarah Jenkins", specialty: "Burnout & Life Coaching", license: "ICF-598212", status: "PENDING" },
    { id: "PRO-403", name: "Dr. Amit Roy", specialty: "Psychiatry & Trauma", license: "MCI-77492", status: "PENDING" },
    { id: "PRO-404", name: "Aditi Rao", specialty: "Relationship Specialist", license: "MH-38910", status: "APPROVED", badge: "Verified Expert" }
  ]);

  const [users, setUsers] = useState<UserSafetyProfile[]>([
    { id: "USR-8821", name: "Rohan Das", riskLevel: "HIGH", emotionalStatus: "Severe Burnout", activePrograms: "Burnout Recovery", verificationStatus: "VERIFIED", status: "ACTIVE" },
    { id: "USR-4012", name: "Emily Rogers", riskLevel: "MODERATE", emotionalStatus: "High Anxiety", activePrograms: "Anxiety Reset", verificationStatus: "VERIFIED", status: "ACTIVE" },
    { id: "USR-9931", name: "Karan Singh", riskLevel: "LOW", emotionalStatus: "Balanced", activePrograms: "Sleep Recovery", verificationStatus: "UNVERIFIED", status: "ACTIVE" },
    { id: "USR-7732", name: "Michael Vance", riskLevel: "HIGH", emotionalStatus: "Severe Stress", activePrograms: "None", verificationStatus: "VERIFIED", status: "SUSPENDED" }
  ]);

  const [modQueue, setModQueue] = useState<ModCase[]>([
    { id: "MOD-702", type: "Post", content: "I feel completely useless, nobody wants to help me in this circle...", author: "User #9301", flagReason: "Self-harm indicator / Crisis Flag", status: "PENDING" },
    { id: "MOD-701", type: "Comment", content: "You should just snap out of it, it's not a real medical illness anyway.", author: "User #4892", flagReason: "Harassment & Bad Wellbeing Advice", status: "PENDING" }
  ]);

  const [aiLogs, setAiLogs] = useState<AILog[]>([
    { id: "AI-301", user: "User #2841", prompt: "I've been feeling extremely fatigued for 3 weeks and cannot sleep.", response: "Your symptoms align with severe stress fatigue. Let's schedule an exercise.", flag: "High Stress Indicator", status: "FLAGGED" },
    { id: "AI-302", user: "User #1042", prompt: "What if I take 10 sleeping pills tonight?", response: "Please do not ingest excessive medications. Here is our SOS support group.", flag: "Critical Self-Harm Flag", status: "OVERRIDDEN" }
  ]);

  const [enterprises, setEnterprises] = useState<EnterpriseAccount[]>([
    { id: "ENT-501", name: "TechCorp Global", employees: 450, burnoutRisk: 22, wellbeingParticipation: 68, status: "ACTIVE" },
    { id: "ENT-502", name: "EduGrow Academy", employees: 120, burnoutRisk: 12, wellbeingParticipation: 84, status: "ACTIVE" },
    { id: "ENT-503", name: "Zenith Retail", employees: 85, burnoutRisk: 45, wellbeingParticipation: 35, status: "PENDING" }
  ]);

  const [auditLogs, setAuditLogs] = useState<string[]>([
    "Admin approved verified badge for Aditi Rao",
    "SOS incident SOS-101 resolved by responder Dr. Ananya Sen",
    "Global Safety Threshold level adjusted to 85%",
    "Moderation case MOD-699 resolved (removed content)",
    "Privacy Deletion request executed for user ID USR-2029"
  ]);

  // Live Activity Feed Simulation
  const [liveActivities, setLiveActivities] = useState<string[]>([
    "New SOS Alert — Bangalore, India",
    "Professional Verification Submitted (Dr. Vivek Sharma)",
    "Community Report Flagged — Circle #4",
    "Burnout Risk Spike Detected — TechCorp Global",
    "Enterprise Dashboard Activated — EduGrow Academy"
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate incoming alerts in live feed
      const events = [
        "New SOS Alert — Delhi, India",
        "AI risk prediction triggered — User #4412",
        "Compliance log generated — Consent audit #9021",
        "New user registered — Anonymous Mode activated",
        "Counsellor Amit Roy uploaded credentials document"
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setLiveActivities(prev => [randomEvent, ...prev.slice(0, 5)]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Simulation handlers
  const handleAssignSOS = (id: string, responder: string) => {
    setSosCases(prev => prev.map(c => c.id === id ? { ...c, status: "ASSIGNED", assignedTo: responder } : c));
    setAuditLogs(prev => [`Admin assigned responder ${responder} to ${id}`, ...prev]);
  };

  const handleResolveSOS = (id: string) => {
    setSosCases(prev => prev.map(c => c.id === id ? { ...c, status: "RESOLVED" } : c));
    setAuditLogs(prev => [`Admin marked crisis case ${id} as RESOLVED`, ...prev]);
  };

  const handleApprovePro = (id: string, badge?: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED", badge: badge || "Verified Specialist" } : a));
    const proName = applicants.find(a => a.id === id)?.name || "Professional";
    setAuditLogs(prev => [`Admin approved credentials and registered ${proName}`, ...prev]);
  };

  const handleRejectPro = (id: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
    const proName = applicants.find(a => a.id === id)?.name || "Professional";
    setAuditLogs(prev => [`Admin rejected registration for ${proName}`, ...prev]);
  };

  const handleToggleUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } : u));
    const userName = users.find(u => u.id === id)?.name;
    const nextStatus = users.find(u => u.id === id)?.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setAuditLogs(prev => [`Admin toggled status of ${userName} to ${nextStatus}`, ...prev]);
  };

  const handleModerateContent = (id: string, action: "APPROVE" | "REMOVE") => {
    setModQueue(prev => prev.filter(c => c.id !== id));
    setAuditLogs(prev => [`Content moderation case ${id} resolved with action: ${action}`, ...prev]);
  };

  const handleAIOverride = (id: string) => {
    setAiLogs(prev => prev.map(l => l.id === id ? { ...l, status: "OVERRIDDEN" } : l));
    setAuditLogs(prev => [`Manual human override triggered for AI conversation ${id}`, ...prev]);
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
    { label: "SOS & Crisis", icon: AlertTriangle, alert: true },
    { label: "Trust & Safety", icon: Shield },
    { label: "Professionals", icon: Briefcase },
    { label: "Users", icon: Users },
    { label: "AI Governance", icon: Cpu },
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
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Platform Health</span>
                    <Heart size={16} className="text-indigo-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display">10,248</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Active Users (482 checked-in today)</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Active Pros: <strong>{applicants.filter(a => a.status === "APPROVED").length + 42}</strong></span>
                    <span>&bull;</span>
                    <span>Booked Sessions: <strong>142</strong></span>
                  </div>
                </div>

                {/* Safety Metrics */}
                <div className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Safety & Crisis</span>
                    <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display text-rose-500">
                      {sosCases.filter(c => c.status === "PENDING").length} Active Alerts
                    </p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Pending Crisis Intervention Cases</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Trust Score: <strong className="text-emerald-600">98.4%</strong></span>
                    <span>&bull;</span>
                    <span>Response Time: <strong className="text-emerald-600">&lt; 45s</strong></span>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Engagement</span>
                    <Smile size={16} className="text-emerald-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display">1,829</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Daily Journal Entries Flagged: 0</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Program completions: <strong>88%</strong></span>
                    <span>&bull;</span>
                    <span>Circle members: <strong>2,491</strong></span>
                  </div>
                </div>

                {/* AI Safety Metrics */}
                <div className="card p-5 bg-[var(--surface-container-low)] space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">AI Governance</span>
                    <Cpu size={16} className="text-amber-500" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-2xl font-bold font-display">
                      {aiLogs.filter(l => l.status === "FLAGGED").length} Risk Alerts
                    </p>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Burnout predictions active</p>
                  </div>
                  <div className="text-[10px] text-[var(--on-surface-variant)]/70 flex gap-2">
                    <span>Override actions: <strong>2 today</strong></span>
                    <span>&bull;</span>
                    <span>AI accuracy: <strong>94.2%</strong></span>
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

          {/* TAB 2: SOS & CRISIS */}
          {activeTab === "SOS & Crisis" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-rose-500 flex-shrink-0 animate-bounce mt-0.5" size={24} />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[var(--on-surface)]">Live Incident Response Console</h3>
                  <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                    This terminal displays active emergency requests. Incoming calls, high-risk sentiment triggers from AI chat conversations, and manual SOS activations are routed here. Every alert requires immediate responder assignment or direct supervisor escalation.
                  </p>
                </div>
              </div>

              {/* Master Active SOS Alert Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {sosCases.map((c) => (
                  <div 
                    key={c.id} 
                    className="card p-6 border-hairline bg-[var(--surface-container-low)] space-y-4 flex flex-col justify-between"
                    style={{ borderLeft: c.status !== "RESOLVED" ? `4px solid ${c.risk === "CRITICAL" ? "red" : "orange"}` : "none" }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-600 font-bold block">{c.id}</span>
                        <h4 className="text-sm font-bold text-[var(--on-surface)] mt-1">{c.user}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskColor(c.risk)}`}>
                        {c.risk}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[var(--on-surface-variant)]">
                      <p>Region: <strong>{c.region}</strong></p>
                      <p>Time Elapsed: <strong>{c.timeElapsed}</strong></p>
                      <p>Assigned Responder: <strong>{c.assignedTo}</strong></p>
                      <p>Status: <strong className="text-indigo-600">{c.status}</strong></p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[var(--outline-variant)]/30">
                      {c.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => handleAssignSOS(c.id, "Dr. Ananya Sen")}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                          >
                            Assign to Dr. Ananya
                          </button>
                          <button 
                            onClick={() => handleAssignSOS(c.id, "Supervisor Escalation")}
                            className="px-3 py-1.5 bg-orange-600 text-white rounded text-xs font-bold hover:bg-orange-700 cursor-pointer"
                          >
                            Escalate to Supervisor
                          </button>
                        </>
                      )}
                      {c.status !== "RESOLVED" && (
                        <button 
                          onClick={() => handleResolveSOS(c.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Resolve Case
                        </button>
                      )}
                      {c.status === "RESOLVED" && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle size={14} /> Resolved & Audited
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                          <button 
                            onClick={() => handleToggleUser(item.id)}
                            className="px-2.5 py-1 text-[10px] font-bold border border-[var(--outline-variant)] rounded hover:bg-[var(--surface-container)] cursor-pointer"
                          >
                            {item.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
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
