"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Heart, Brain, BookOpen, PenLine, Smile, MessageSquare,
  Users, Calendar, Compass, Award, AlertTriangle, Settings, ArrowRight, ChevronRight,
  Shield, Check, CheckCircle, Menu, X, Activity, Sparkles, Phone, Lock, Eye, LogOut
} from "lucide-react";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User States
  const [userName] = useState("Shivam");
  const [streakCount, setStreakCount] = useState(6);
  const [impactScore, setImpactScore] = useState(139);
  const [anonymousMode, setAnonymousMode] = useState(false);
  
  // Interactive Check-In State
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);
  const [checkInState, setCheckInState] = useState({
    moodEmoji: "😊",
    stress: "Moderate",
    energy: "Moderate",
    sleep: "Good",
    gratitude: ""
  });

  // AI Breathing exercise state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingText, setBreathingText] = useState("Inhale...");
  const [breathingSecs, setBreathingSecs] = useState(4);

  // Journal Reflection State
  const [journalText, setJournalText] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);

  // Community Encouragement state
  const [encouragedCount, setEncouragedCount] = useState(2);

  // Breathing timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathingSecs((prev) => {
          if (prev === 1) {
            if (breathingText === "Inhale...") {
              setBreathingText("Hold...");
              return 4;
            } else if (breathingText === "Hold...") {
              setBreathingText("Exhale...");
              return 4;
            } else {
              setBreathingText("Inhale...");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathingText]);

  const handleStartBreathing = () => {
    setBreathingActive(true);
    setBreathingText("Inhale...");
    setBreathingSecs(4);
  };

  const handleStopBreathing = () => {
    setBreathingActive(false);
  };

  const handleMoodSelect = (mood: string) => {
    setTodayMood(mood);
    // Auto-update mood emoji in check-in
    let emoji = "😊";
    if (mood === "Calm") emoji = "😌";
    if (mood === "Stressed") emoji = "😰";
    if (mood === "Motivated") emoji = "💪";
    if (mood === "Overwhelmed") emoji = "🤯";
    if (mood === "Tired") emoji = "😴";
    setCheckInState(prev => ({ ...prev, moodEmoji: emoji }));
  };

  const submitCheckIn = () => {
    setCheckInSubmitted(true);
    setStreakCount(prev => prev + 1);
    setImpactScore(prev => prev + 3);
  };

  const saveJournal = () => {
    setJournalSaved(true);
    setImpactScore(prev => prev + 5);
    setTimeout(() => setJournalSaved(false), 3000);
  };

  const triggerEncouragement = () => {
    setEncouragedCount(prev => prev + 1);
    setImpactScore(prev => prev + 10);
  };

  const handleQuickExit = () => {
    window.location.replace("https://www.google.com");
  };

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "My Care Journey", icon: Compass },
    { label: "Assessments", icon: Brain },
    { label: "Programs", icon: BookOpen },
    { label: "Journal", icon: PenLine },
    { label: "Mood Tracker", icon: Activity },
    { label: "AI Companion", icon: Sparkles },
    { label: "Community", icon: Users },
    { label: "Book Session", icon: Calendar },
    { label: "Resources", icon: MessageSquare },
    { label: "Impact & Gratitude", icon: Award },
    { label: "SOS Support", icon: AlertTriangle, alert: true },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] text-[var(--on-surface)] flex flex-col lg:flex-row">
      
      {/* Mobile Header Bar */}
      <header className="lg:hidden h-16 border-b border-[var(--outline-variant)]/60 bg-[var(--surface-container-low)] px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="KleverKlues" width={28} height={28} className="object-contain" />
          <span className="font-display font-semibold text-sm">Wellbeing Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleQuickExit}
            className="px-2.5 py-1.5 bg-rose-600 text-white rounded text-[10px] font-bold uppercase tracking-wider"
          >
            Quick Exit
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[var(--on-surface-variant)]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`w-full lg:w-64 border-r border-[var(--outline-variant)]/60 bg-[var(--surface-container-low)] flex flex-col fixed lg:sticky top-16 lg:top-0 h-[calc(100vh-64px)] lg:h-screen z-40 transition-transform duration-300 lg:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Title logo (Desktop only) */}
        <div className="hidden lg:flex p-6 border-b border-[var(--outline-variant)]/40 items-center gap-3">
          <img src="/logo.jpg" alt="KleverKlues" width={32} height={32} className="object-contain" />
          <div className="space-y-0.5">
            <span className="font-display font-semibold text-sm text-[var(--on-surface)] block">KleverKlues&trade;</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">Personal Companion</span>
          </div>
        </div>

        {/* User stats preview card */}
        <div className="px-6 py-4 border-b border-[var(--outline-variant)]/40 bg-[var(--surface-container)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center font-bold text-xs text-emerald-600">
              {userName[0]}
            </div>
            <div>
              <p className="text-xs font-bold leading-tight flex items-center gap-1">
                {anonymousMode ? "Anonymous Active" : userName}
                {anonymousMode && <Lock size={10} className="text-emerald-600" />}
              </p>
              <p className="text-[9px] text-[var(--on-surface-variant)] font-semibold flex items-center gap-1">
                🔥 {streakCount} Days Active
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav buttons */}
        <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isSelected = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-[var(--on-surface-variant)] hover:text-emerald-600 hover:bg-[var(--surface-container)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={15} className={isSelected ? "text-white" : "text-[var(--outline)]"} />
                  <span>{item.label}</span>
                </div>
                {item.alert && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Exit Panel Bottom */}
        <div className="p-4 border-t border-[var(--outline-variant)]/40 bg-[var(--surface-container)] space-y-2">
          <button 
            onClick={handleQuickExit}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-sm transition-all"
          >
            <X size={12} /> Quick Exit (Esc)
          </button>
          <Link href="/role-selection" className="text-[10px] font-bold text-[var(--on-surface-variant)] hover:underline flex items-center justify-center gap-1 pt-1">
            <LogOut size={10} /> Exit Wellbeing Hub
          </Link>
        </div>
      </aside>

      {/* Main Body content */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)] lg:min-h-screen">
        
        {/* Top Header / Quick Actions */}
        <header className="h-16 border-b border-[var(--outline-variant)]/60 bg-[var(--surface-container-lowest)] px-6 lg:px-8 flex items-center justify-between sticky top-16 lg:top-0 z-30">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
            {activeTab} Module
          </h2>

          {/* Quick Actions Bar */}
          <div className="hidden md:flex items-center gap-2.5">
            <button onClick={() => setActiveTab("Book Session")} className="px-3 py-1.5 border border-[var(--outline-variant)] rounded-lg text-[10px] font-bold hover:bg-[var(--surface-container)] flex items-center gap-1">
              <Calendar size={12} /> Book Session
            </button>
            <button onClick={() => setActiveTab("Journal")} className="px-3 py-1.5 border border-[var(--outline-variant)] rounded-lg text-[10px] font-bold hover:bg-[var(--surface-container)] flex items-center gap-1">
              <PenLine size={12} /> Start Journal
            </button>
            <button onClick={() => setActiveTab("SOS Support")} className="px-3 py-1.5 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-lg text-[10px] font-bold hover:bg-rose-500/20 flex items-center gap-1">
              <AlertTriangle size={12} /> SOS
            </button>
            <button onClick={() => setActiveTab("AI Companion")} className="px-3 py-1.5 bg-emerald-600/10 text-emerald-600 border border-emerald-600/20 rounded-lg text-[10px] font-bold hover:bg-emerald-600/20 flex items-center gap-1">
              <Sparkles size={12} /> AI Companion
            </button>
          </div>
        </header>

        {/* Tab Route Contents */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-[1400px]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* HERO GREETING */}
              <section className="bg-gradient-to-r from-emerald-50/60 to-teal-50/20 dark:from-emerald-950/20 dark:to-teal-950/5 p-6 sm:p-8 rounded-3xl border border-[var(--outline-variant)]/50 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-emerald-600/10 text-emerald-600 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full inline-block">
                    SAFE SPACE ACTIVE
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-medium text-[var(--on-surface)]">
                    Good Day, {anonymousMode ? "Friend" : userName}
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--on-surface-variant)] max-w-xl">
                    Take a deep breath. You are safe here. How is your heart feeling in this moment?
                  </p>
                </div>

                {/* Mood Select buttons */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {["Calm", "Stressed", "Motivated", "Overwhelmed", "Tired"].map((mood) => {
                    const isSel = todayMood === mood;
                    return (
                      <button
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          isSel
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/80 hover:border-emerald-600"
                        }`}
                      >
                        {mood === "Calm" && "😌 Calm"}
                        {mood === "Stressed" && "😰 Stressed"}
                        {mood === "Motivated" && "💪 Motivated"}
                        {mood === "Overwhelmed" && "🤯 Overwhelmed"}
                        {mood === "Tired" && "😴 Tired"}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* TWO COLUMN SUMMARY WIDGETS */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Daily checkin card */}
                <div className="card bg-[var(--surface-container-low)] p-6 space-y-5 lg:col-span-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] flex items-center gap-1.5">
                      <Activity size={14} className="text-emerald-600" /> Today's Emotional Check-In
                    </h3>
                    <p className="text-[10px] text-[var(--on-surface-variant)]/60">Log your energy and sleep metrics to help the AI map insights.</p>
                  </div>

                  {checkInSubmitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-center space-y-3 my-auto">
                      <CheckCircle size={32} className="text-emerald-600 mx-auto animate-bounce" />
                      <p className="text-xs font-bold">Emotional Check-In Logged!</p>
                      <p className="text-[10px] text-[var(--on-surface-variant)]">Your day score has been synced securely. Thanks for tuning into your body.</p>
                      <button 
                        onClick={() => setCheckInSubmitted(false)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                      >
                        Update Log
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Stress Selection */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[var(--on-surface-variant)]">Stress Threshold</label>
                          <select 
                            value={checkInState.stress}
                            onChange={(e) => setCheckInState(prev => ({ ...prev, stress: e.target.value }))}
                            className="w-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/80 rounded-xl px-3 py-2 text-xs outline-none"
                          >
                            <option value="Low">😌 Low Stress</option>
                            <option value="Moderate">😐 Moderate Stress</option>
                            <option value="High">😰 High Stress</option>
                            <option value="Critical">🚨 Critical Burnout</option>
                          </select>
                        </div>
                        {/* Energy Selection */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[var(--on-surface-variant)]">Emotional Energy</label>
                          <select 
                            value={checkInState.energy}
                            onChange={(e) => setCheckInState(prev => ({ ...prev, energy: e.target.value }))}
                            className="w-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/80 rounded-xl px-3 py-2 text-xs outline-none"
                          >
                            <option value="High">⚡ High Vitality</option>
                            <option value="Moderate">🔋 Balanced</option>
                            <option value="Low">🪫 Low / Exhausted</option>
                          </select>
                        </div>
                      </div>

                      {/* Gratitude Prompt */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[var(--on-surface-variant)]">Daily Gratitude (Write 1 thing you are grateful for today)</label>
                        <input
                          type="text"
                          value={checkInState.gratitude}
                          onChange={(e) => setCheckInState(prev => ({ ...prev, gratitude: e.target.value }))}
                          placeholder="What warmed your heart today?"
                          className="w-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/80 rounded-xl px-3.5 py-2 text-xs outline-none"
                        />
                      </div>

                      <button
                        onClick={submitCheckIn}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                      >
                        Submit Check-In
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Mini AI Companion breathing widget */}
                <div className="card bg-[var(--surface-container-low)] p-6 space-y-4 lg:col-span-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-600 animate-pulse" /> AI Companion
                    </h3>
                    <p className="text-[10px] text-[var(--on-surface-variant)]/60">Gentle mental wellness guidelines</p>
                  </div>

                  {breathingActive ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-3">
                      <div className="w-24 h-24 rounded-full bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20 animate-pulse relative">
                        <span className="text-xs font-bold text-emerald-600">{breathingText}</span>
                        <span className="absolute bottom-2 text-[10px] font-mono text-emerald-600">{breathingSecs}s</span>
                      </div>
                      <button 
                        onClick={handleStopBreathing}
                        className="px-3 py-1 bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer"
                      >
                        Exit Exercise
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3.5 my-auto">
                      <p className="text-xs text-[var(--on-surface-variant)] italic bg-[var(--surface-container-lowest)] p-3 rounded-xl border-hairline leading-relaxed">
                        &ldquo;You have logged a consistent 6-day check-in streak. Would you like a quick 1-minute calming breathing session?&rdquo;
                      </p>
                      <button
                        onClick={handleStartBreathing}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        Start Calming Breathing
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* score dials & wellbeing score grid */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Weekly Wellbeing Indicators</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  
                  {[
                    { label: "Emotional Balance", value: 82, stroke: 251.2 * 0.82, color: "stroke-emerald-600", bg: "bg-emerald-500/10", text: "Balanced State" },
                    { label: "Stress Trend", value: 45, stroke: 251.2 * 0.45, color: "stroke-amber-500", bg: "bg-amber-500/10", text: "Moderate Strain" },
                    { label: "Wellbeing Streak", value: 88, stroke: 251.2 * 0.88, color: "stroke-emerald-600", bg: "bg-emerald-500/10", text: "High Consistency" },
                    { label: "Sleep Recovery", value: 74, stroke: 251.2 * 0.74, color: "stroke-indigo-600", bg: "bg-indigo-500/10", text: "Good Rest" },
                    { label: "Focus Score", value: 65, stroke: 251.2 * 0.65, color: "stroke-indigo-600", bg: "bg-indigo-500/10", text: "Optimal Focus" }
                  ].map((meter, i) => (
                    <div key={i} className="card p-4 bg-[var(--surface-container-low)] flex flex-col items-center justify-between text-center gap-3">
                      <span className="text-[10px] font-bold text-[var(--on-surface-variant)]">{meter.label}</span>
                      
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="var(--surface-container)" strokeWidth="4" />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            fill="none"
                            className={meter.color}
                            strokeWidth="4"
                            strokeDasharray={201.0}
                            strokeDashoffset={201.0 - (201.0 * meter.value) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-xs font-bold font-display">{meter.value}%</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${meter.bg} text-[var(--on-surface-variant)] uppercase`}>
                        {meter.text}
                      </span>
                    </div>
                  ))}

                </div>
              </section>

              {/* THREE COLUMN GRID: CARE JOURNEY, PROGRAMS, JOURNAL */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Care Journey checklist */}
                <div className="card bg-[var(--surface-container-low)] p-6 space-y-4 lg:col-span-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Your Care Journey</h3>
                  <div className="space-y-3.5 pt-2">
                    {[
                      { step: "Anxiety Index Assessment", done: true },
                      { step: "Burnout Recovery Program", done: true },
                      { step: "Daily Emotional Reflection", done: false, active: true },
                      { step: "Weekly Counsellor Session", done: false },
                      { step: "Community Support Group", done: false }
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        {step.done ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <Check size={12} />
                          </div>
                        ) : step.active ? (
                          <div className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-600 flex-shrink-0 animate-pulse">
                            <ArrowRight size={12} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[var(--surface-container)] flex items-center justify-center text-[var(--outline)] flex-shrink-0 border-hairline">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--outline)]" />
                          </div>
                        )}
                        <span className={`font-semibold ${step.done ? "line-through text-[var(--on-surface-variant)]/60" : step.active ? "text-indigo-600 font-bold" : "text-[var(--on-surface-variant)]"}`}>
                          {step.step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Active Programs list */}
                <div className="card bg-[var(--surface-container-low)] p-6 space-y-4 lg:col-span-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Active Programs</h3>
                  
                  <div className="space-y-4 pt-1">
                    {[
                      { name: "Burnout Recovery", progress: 68, streak: 7, color: "w-[68%] bg-emerald-600" },
                      { name: "Anxiety Reset Journey", progress: 24, streak: 2, color: "w-[24%] bg-indigo-600" }
                    ].map((prog, i) => (
                      <div key={i} className="p-3.5 bg-[var(--surface-container-lowest)] rounded-2xl border-hairline space-y-3.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold">{prog.name}</h4>
                            <span className="text-[9px] font-bold text-amber-600">🔥 {prog.streak} Day Streak</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600">{prog.progress}%</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-[var(--surface-container)] h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${prog.color}`} />
                        </div>

                        <button 
                          onClick={() => setActiveTab("Programs")}
                          className="w-full py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Continue Program
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Reflection Journal Widget */}
                <div className="card bg-[var(--surface-container-low)] p-6 space-y-4 lg:col-span-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Today's Reflection</h3>
                    <p className="text-[10px] text-[var(--on-surface-variant)]/60">What helped you feel emotionally safe this week?</p>
                  </div>

                  <div className="space-y-3.5 pt-1 flex-1 flex flex-col justify-between">
                    <textarea
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      placeholder="Write your thoughts..."
                      rows={3}
                      className="w-full flex-1 p-3 text-xs bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/80 rounded-xl outline-none resize-none placeholder:text-[var(--outline)]"
                    />

                    {journalSaved && (
                      <span className="text-[10px] font-bold text-emerald-600 text-center block">✓ Reflection Saved to Journal</span>
                    )}

                    <button 
                      onClick={saveJournal}
                      className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      Save Journal Entry
                    </button>
                  </div>
                </div>

              </div>

              {/* RECOMMENDED ACTIONS & RESOURCE FEED */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Recommended Ecosystem Actions */}
                <div className="card p-6 bg-[var(--surface-container-low)] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Recommended For You</h3>
                  <div className="space-y-3 pt-1">
                    {[
                      { action: "Start Sleep Recovery Program", path: "Programs", detail: "Suggested based on low sleep recovery check-ins." },
                      { action: "Join Anxiety Support Circle", path: "Community", detail: "Connect with others managing stress." },
                      { action: "Calm 5-Minute Meditation", path: "Resources", detail: "Short audio guide to restore focus." },
                      { action: "Book Professional Therapist Session", path: "Book Session", detail: "Find expert care to assist recovery." }
                    ].map((rec, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[var(--surface-container-lowest)] border-hairline rounded-xl hover:border-emerald-500/40 transition-colors">
                        <div>
                          <span className="text-xs font-bold block">{rec.action}</span>
                          <span className="text-[10px] text-[var(--on-surface-variant)]/70">{rec.detail}</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab(rec.path)}
                          className="p-1 text-emerald-600 hover:bg-emerald-500/10 rounded-lg flex items-center justify-center cursor-pointer"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Feed */}
                <div className="card p-6 bg-[var(--surface-container-low)] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Calming Resource Feed</h3>
                  <div className="space-y-3 pt-1">
                    {[
                      { title: "Understanding Stress Cycles", format: "Podcast • 12 mins", category: "Stress Management" },
                      { title: "Calming Breath Guided Meditations", format: "Audio Guidance • 8 mins", category: "Mindfulness" },
                      { title: "Healthy Sleep Routines", format: "Article • 4 mins read", category: "Sleep Health" }
                    ].map((res, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[var(--surface-container-lowest)] border-hairline rounded-xl">
                        <div>
                          <span className="text-xs font-bold block">{res.title}</span>
                          <span className="text-[10px] text-[var(--on-surface-variant)]/70">{res.format} &bull; <strong className="text-indigo-600">{res.category}</strong></span>
                        </div>
                        <button 
                          onClick={() => setActiveTab("Resources")}
                          className="px-2.5 py-1 border border-[var(--outline-variant)] rounded text-[9px] font-bold hover:bg-[var(--surface-container)] cursor-pointer"
                        >
                          Listen / Read
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MY CARE JOURNEY */}
          {activeTab === "My Care Journey" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Your Complete Care Journey</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">This roadmap traces your emotional check-ins, assessments, clinical sessions, and program milestones into a unified healing trajectory.</p>
              
              <div className="relative border-l-2 border-emerald-500/30 ml-4 pl-8 py-4 space-y-8">
                {[
                  { title: "Onboarding & Diagnostics", desc: "Completed basic profile diagnostics and stress intake assessment.", date: "Completed on May 12", completed: true },
                  { title: "Burnout Recovery Core Journey", desc: "Completed Weeks 1 & 2 guidelines covering daily stress logs and cognitive resets.", date: "Completed on May 20", completed: true },
                  { title: "Emotional Check-Ins & Reflective Journaling", desc: "Currently active task. Maintain a daily mood streak to evaluate wellness indices.", date: "Active Now", active: true },
                  { title: "Clinical Provider Matching", desc: "Schedule a diagnostic review session with one of our licensed mental therapists.", date: "Upcoming Schedule" },
                  { title: "Community Circle Support Integration", desc: "Connect with the Anxiety Support community circle group.", date: "Next Milestone" }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    {/* Circle indicators */}
                    {item.completed ? (
                      <span className="absolute -left-[41px] top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <Check size={12} />
                      </span>
                    ) : item.active ? (
                      <span className="absolute -left-[41px] top-0.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm animate-pulse">
                        <ArrowRight size={12} />
                      </span>
                    ) : (
                      <span className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-[var(--surface-container)] border border-[var(--outline-variant)] flex items-center justify-center" />
                    )}

                    <div className="space-y-1.5">
                      <h4 className={`text-sm font-bold ${item.completed ? "text-[var(--on-surface)]" : item.active ? "text-indigo-600" : "text-[var(--on-surface-variant)]"}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed max-w-xl">{item.desc}</p>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase block">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ASSESSMENTS */}
          {activeTab === "Assessments" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Wellness & Diagnostics Assessments</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Diagnostic assessments help customize your EAP coverage, wellness programs, and recommended actions.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "Anxiety Index Assessment", time: "8 mins", status: "Completed", score: "Moderate (42/100)", desc: "Analyzes panic, social anxiety, and generalized stress metrics." },
                  { name: "Burnout & Resilience Meter", time: "12 mins", status: "Completed", score: "Severe Fatigue (68/100)", desc: "Examines fatigue levels, workload balance, and recovery skills." },
                  { name: "Sleep Hygiene Diagnostic", time: "6 mins", status: "Start Now", desc: "Evaluates sleep quality, bedtime habits, and circadian rhythm consistency." },
                  { name: "Emotional Quotient EQ Index", time: "15 mins", status: "Start Now", desc: "Measures empathy, emotional awareness, and interpersonal skills." }
                ].map((ass, i) => (
                  <div key={i} className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold">{ass.name}</h4>
                        <span className="text-[10px] text-[var(--on-surface-variant)]/60">Duration: {ass.time}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        ass.status === "Completed" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-600 text-white"
                      }`}>
                        {ass.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{ass.desc}</p>
                    {ass.score && (
                      <div className="text-[10px] font-bold text-[var(--on-surface-variant)]">
                        Latest Score: <strong className="text-indigo-600">{ass.score}</strong>
                      </div>
                    )}
                    {ass.status === "Start Now" ? (
                      <Link href="/assessments" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold block text-center cursor-pointer">
                        Begin Assessment
                      </Link>
                    ) : (
                      <button className="w-full py-2 border border-[var(--outline-variant)] rounded-lg text-xs font-bold hover:bg-[var(--surface-container)] cursor-pointer">
                        View Detailed Insights
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROGRAMS */}
          {activeTab === "Programs" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Your Active Wellness Programs</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Guided transformation programs covering mindfulness, anxiety relief, sleep recovery, and stress resilience.</p>

              <div className="space-y-6">
                {[
                  { name: "Burnout Recovery", progress: 68, duration: "4 Weeks", module: "Week 3: Stress Cycles & Boundaries", desc: "A cognitive-behavioral wellness program designed to manage emotional exhaustion, restore workplace boundaries, and rebuild physical reserves.", color: "bg-emerald-600" },
                  { name: "Anxiety Reset Journey", progress: 24, duration: "6 Weeks", module: "Week 2: Somatic Breathing & Calming", desc: "A somatic regulation system designed to quiet the nervous system, mitigate panic indicators, and rebuild confidence patterns.", color: "bg-indigo-600" }
                ].map((prog, i) => (
                  <div key={i} className="p-5 bg-[var(--surface-container-low)] border-hairline rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h4 className="text-base font-bold text-[var(--on-surface)]">{prog.name}</h4>
                        <p className="text-xs text-[var(--on-surface-variant)]/60">Duration: {prog.duration} &bull; Next Module: <strong>{prog.module}</strong></p>
                      </div>
                      <span className="text-lg font-bold text-emerald-600">{prog.progress}% Complete</span>
                    </div>

                    <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed max-w-3xl">{prog.desc}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-[var(--surface-container)] h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${prog.color}`} style={{ width: `${prog.progress}%` }} />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[var(--outline-variant)]/30">
                      <Link href={`/programs/${prog.name.toLowerCase().replace(/ /g, "-")}`} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer">
                        Continue to Next Week
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: JOURNAL */}
          {activeTab === "Journal" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Private Emotional Reflection Journal</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Write down thoughts, logs, and gratitude checks. All journal logs are secured and encrypted for maximum safety.</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-indigo-600">Daily Guided Reflection Prompt</h4>
                  <p className="text-xs font-semibold">&ldquo;What helped you feel emotionally safe this week? How did you respond to feelings of overwhelm?&rdquo;</p>
                  
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Reflect on your mood, feelings, and resilience here..."
                    rows={6}
                    className="w-full p-4 text-xs bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/80 rounded-xl outline-none resize-none placeholder:text-[var(--outline)]"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[var(--on-surface-variant)]/60">Word count: {journalText.split(" ").filter(Boolean).length} words</span>
                    <button 
                      onClick={saveJournal}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      Save Private Reflection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MOOD TRACKER */}
          {activeTab === "Mood Tracker" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Emotional Mood Trends</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">This chart outlines stress fluctuations, vitality scores, and emotional check-in consistency over the last 7 days.</p>
              
              {/* 7-day emotional graph */}
              <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl space-y-8">
                <div className="h-48 flex items-end justify-between pt-6 px-4 border-b border-[var(--outline-variant)]">
                  {[
                    { day: "Mon", score: 80, label: "Calm", color: "bg-emerald-500" },
                    { day: "Tue", score: 55, label: "Tired", color: "bg-amber-400" },
                    { day: "Wed", score: 30, label: "Stressed", color: "bg-rose-400" },
                    { day: "Thu", score: 70, label: "Calm", color: "bg-emerald-500" },
                    { day: "Fri", score: 90, label: "Motivated", color: "bg-emerald-600" },
                    { day: "Sat", score: 85, label: "Calm", color: "bg-emerald-500" },
                    { day: "Sun", score: 88, label: "Calm", color: "bg-emerald-500" }
                  ].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-10 sm:w-16">
                      <span className="text-[9px] font-bold text-[var(--on-surface-variant)]">{d.label}</span>
                      <div 
                        className={`w-4 sm:w-8 ${d.color} rounded-t-lg transition-all duration-300`} 
                        style={{ height: `${d.score * 1.4}px` }} 
                      />
                      <span className="text-[10px] font-bold mt-1 text-[var(--on-surface-variant)]/60">{d.day}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-[var(--on-surface-variant)]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Calm / Balanced State</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Tired / Exhausted State</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-400" /> Stressed / Overwhelmed State</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AI COMPANION */}
          {activeTab === "AI Companion" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Interactive AI Wellbeing Companion</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">A supportive, private, non-clinical AI space to request breathing exercises, evaluate cognitive fatigue, and structure daily self-care.</p>
              
              <div className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                  <Sparkles size={16} /> COMPANION ON-CALL
                </div>
                <p className="text-xs leading-relaxed text-[var(--on-surface-variant)] bg-[var(--surface-container-lowest)] p-4 rounded-xl border-hairline">
                  &ldquo;Hello Shivam. I have been evaluating your weekly check-ins. Your emotional consistency metrics have improved by 14% this week. Whenever you feel stress spiking, click below to trigger a guided breathing relaxation exercise.&rdquo;
                </p>
                
                {breathingActive ? (
                  <div className="p-6 bg-[var(--surface-container-lowest)] border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center space-y-4">
                    <div className="w-28 h-28 rounded-full bg-emerald-500/10 flex flex-col items-center justify-center border-2 border-emerald-600/30 animate-pulse relative">
                      <span className="text-sm font-bold text-emerald-600">{breathingText}</span>
                      <span className="text-xs font-mono text-emerald-600 mt-1">{breathingSecs}s</span>
                    </div>
                    <p className="text-[10px] text-[var(--on-surface-variant)]">Follow the rhythm to regulate your stress thresholds.</p>
                    <button 
                      onClick={handleStopBreathing}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Stop Breathing Guide
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleStartBreathing}
                    className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg text-xs hover:bg-indigo-700 cursor-pointer"
                  >
                    Start Somatic Breathing Session
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: COMMUNITY */}
          {activeTab === "Community" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Community Support Circles</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Connect anonymously with others to share gratitude notes, support streaks, and positive encouragement.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Impact score card */}
                <div className="card bg-[var(--surface-container-low)] p-5 space-y-4 md:col-span-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Your Impact & Gratitude Score</h4>
                    <p className="text-3xl font-bold font-display mt-2">{impactScore}</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)] mt-1">You encouraged <strong>{encouragedCount}</strong> peers on the gratitude wall this week!</p>
                  </div>
                  <button 
                    onClick={triggerEncouragement}
                    className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 cursor-pointer"
                  >
                    Encourage a Peer (+10 pts)
                  </button>
                </div>

                {/* Active Circles */}
                <div className="card bg-[var(--surface-container-low)] p-5 space-y-4 md:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Your Active Circles</h4>
                  
                  <div className="space-y-3 pt-1">
                    {[
                      { name: "Anxiety Reset Support Circle", members: "1.2k members", active: "148 online" },
                      { name: "Sleep Recovery Support Group", members: "450 members", active: "28 online" }
                    ].map((group, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[var(--surface-container-lowest)] border-hairline rounded-xl text-xs">
                        <div>
                          <span className="font-bold block">{group.name}</span>
                          <span className="text-[10px] text-[var(--on-surface-variant)]">{group.members} &bull; <strong className="text-emerald-600">{group.active}</strong></span>
                        </div>
                        <Link href="/community" className="px-3 py-1.5 border border-[var(--outline-variant)] rounded font-bold hover:bg-[var(--surface-container)] cursor-pointer">
                          Enter Circle
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BOOK SESSION */}
          {activeTab === "Book Session" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Schedule Professional Clinical Sessions</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Find verified psychiatrists, counselors, and wellbeing coaches available for private online diagnostic sessions.</p>
              
              <div className="space-y-4">
                {[
                  { name: "Dr. Kavita Rao", specialty: "Clinical Psychologist • Stress & Trauma Specialist", rating: "4.9 ★ (120+ sessions)", fee: "EAP Fully Covered", avail: "Today, 4:00 PM" },
                  { name: "Sarah Jenkins", specialty: "Wellbeing & Burnout Coach", rating: "4.8 ★ (80+ sessions)", fee: "EAP Fully Covered", avail: "Tomorrow, 10:00 AM" }
                ].map((pro, i) => (
                  <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--on-surface)]">{pro.name}</h4>
                      <p className="text-xs text-[var(--on-surface-variant)]">{pro.specialty}</p>
                      <p className="text-[10px] text-[var(--on-surface-variant)]/60 mt-1">{pro.rating} &bull; Cost: <strong className="text-emerald-600">{pro.fee}</strong></p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded-full">Next: {pro.avail}</span>
                      <Link href="/book-session" className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 text-center cursor-pointer">
                        Book Session
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: RESOURCES */}
          {activeTab === "Resources" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Personalized Wellbeing Resources</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Meditation guides, stress articles, and recovery guidelines selected for you based on diagnostics logs.</p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Understanding Stress Cycles", length: "12 mins", type: "Podcast Audio", desc: "A psychological study detailing physiological stress feedback loops." },
                  { title: "Calming Breath Exercises", length: "8 mins", type: "Guided Audio", desc: "A slow somatic practice designed to lower active anxiety levels." },
                  { title: "Workplace Burnout Recovery", length: "5 mins read", type: "Article Guide", desc: "Setting cognitive boundaries and resetting recovery timers." }
                ].map((res, i) => (
                  <div key={i} className="p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">{res.type} &bull; {res.length}</span>
                      <h4 className="text-sm font-bold text-[var(--on-surface)] mt-1">{res.title}</h4>
                      <p className="text-xs text-[var(--on-surface-variant)] mt-1.5 leading-relaxed">{res.desc}</p>
                    </div>
                    <button className="w-full mt-4 py-2 border border-[var(--outline-variant)] rounded-lg text-xs font-bold hover:bg-[var(--surface-container)] cursor-pointer">
                      Open Resource
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: IMPACT & GRATITUDE */}
          {activeTab === "Impact & Gratitude" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Ecosystem Impact & Peer Gratitude</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Your activities on KleverKlues help build a resilient and supportive wellbeing culture. Check out your scores and gratitude highlights below.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Score */}
                <div className="card bg-[var(--surface-container-low)] p-6 space-y-4 text-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Your Gratitude Index</h4>
                  <div className="w-28 h-28 rounded-full bg-emerald-600/10 border-2 border-emerald-600/20 flex flex-col items-center justify-center mx-auto">
                    <span className="text-3xl font-bold text-emerald-600 font-display">{impactScore}</span>
                    <span className="text-[8px] uppercase font-bold text-[var(--on-surface-variant)]">Total Points</span>
                  </div>
                  <p className="text-xs text-[var(--on-surface-variant)]">Logged by completing check-ins, posting safe reflections, and encouraging peers.</p>
                </div>

                {/* peer feed */}
                <div className="card bg-[var(--surface-container-low)] p-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Gratitude Highlights</h4>
                  <div className="space-y-3 pt-1">
                    {[
                      "Peer #148: 'Thanks for the encouragement, the breathing exercise guidelines helped! 💚'",
                      "System: 'You successfully completed the Burnout Recovery Program Week 2 reset!'"
                    ].map((note, i) => (
                      <p key={i} className="text-xs text-[var(--on-surface-variant)] bg-[var(--surface-container-lowest)] p-3 rounded-xl border-hairline italic leading-relaxed">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SOS SUPPORT */}
          {activeTab === "SOS Support" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-rose-500 flex-shrink-0 animate-bounce mt-0.5" size={24} />
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-[var(--on-surface)]">Crisis Safety Escalation</h3>
                  <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                    If you are experiencing severe distress, feelings of self-harm, or are in a life-threatening crisis, please access immediate assistance. Responders are available 24/7.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Emergency numbers */}
                <div className="card p-6 bg-[var(--surface-container-low)] space-y-4 border-l-4 border-rose-500">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">24/7 Helpline Telephones</h4>
                  <div className="space-y-3.5 pt-2 text-xs">
                    <p className="flex justify-between font-semibold border-b border-[var(--outline-variant)]/40 pb-2">
                      <span>Vandrevala Foundation Helpline</span>
                      <a href="tel:919999666555" className="text-rose-500 hover:underline">91-9999 666 555</a>
                    </p>
                    <p className="flex justify-between font-semibold border-b border-[var(--outline-variant)]/40 pb-2">
                      <span>KIRAN Mental Health Helpline</span>
                      <a href="tel:18005990019" className="text-rose-500 hover:underline">1800-599-0019</a>
                    </p>
                    <p className="flex justify-between font-semibold">
                      <span>Emergency Medical Services</span>
                      <a href="tel:112" className="text-rose-500 hover:underline">Dial 112</a>
                    </p>
                  </div>
                </div>

                {/* Safety protocols */}
                <div className="card p-6 bg-[var(--surface-container-low)] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Guided Grounding Exercise</h4>
                  <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                    To help restore cognitive calm immediately, focus on your surroundings and try the 5-4-3-2-1 technique:
                  </p>
                  <ol className="text-xs list-decimal pl-4 space-y-1.5 text-[var(--on-surface-variant)]">
                    <li>Acknowledge <strong>5</strong> things you can see around you.</li>
                    <li>Acknowledge <strong>4</strong> things you can touch.</li>
                    <li>Acknowledge <strong>3</strong> things you can hear.</li>
                    <li>Acknowledge <strong>2</strong> things you can smell.</li>
                    <li>Acknowledge <strong>1</strong> thing you can taste.</li>
                  </ol>
                </div>

              </div>

            </div>
          )}

          {/* TAB 13: SETTINGS */}
          {activeTab === "Settings" && (
            <div className="card p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Trust & Settings Workspace</h3>
              <p className="text-xs text-[var(--on-surface-variant)]">Manage personal data options, configure notifications, and configure anonymous modes.</p>

              <div className="space-y-6 pt-2">
                
                {/* Anonymous mode trigger */}
                <div className="flex justify-between items-center p-4 bg-[var(--surface-container-low)] rounded-xl border-hairline">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[var(--on-surface)] flex items-center gap-1.5">
                      <Shield size={14} className="text-emerald-600" /> Anonymous Hub Mode
                    </h4>
                    <p className="text-[10px] text-[var(--on-surface-variant)] max-w-md leading-relaxed">
                      Masks your profile name with a random string when posting gratitude entries or joining circles to safeguard safety.
                    </p>
                  </div>
                  <button
                    onClick={() => setAnonymousMode(!anonymousMode)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      anonymousMode
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/80"
                    }`}
                  >
                    {anonymousMode ? "Enabled" : "Disabled"}
                  </button>
                </div>

                {/* Data rights */}
                <div className="p-4 bg-[var(--surface-container-low)] rounded-xl border-hairline space-y-4">
                  <h4 className="text-xs font-bold text-[var(--on-surface)] flex items-center gap-1.5">
                    <Lock size={14} className="text-indigo-600" /> Data Rights & Exports
                  </h4>
                  <p className="text-xs text-[var(--on-surface-variant)]">
                    Under DPDP & GDPR data protection regulations, you can download a copy of your personal check-ins or request total profile erasure.
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Data pack compilation triggered. Download link will be emailed.")}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                    >
                      Export Data Pack
                    </button>
                    <button 
                      onClick={() => alert("Erasure request filed. Our data officer will contact you within 48 hours.")}
                      className="px-3 py-1.5 border border-rose-500/20 text-rose-500 rounded text-xs font-semibold hover:bg-rose-500/10 cursor-pointer"
                    >
                      Request Profile Erasure
                    </button>
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
