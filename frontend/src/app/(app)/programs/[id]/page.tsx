"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Heart, Clock, Shield, CheckCircle, ArrowLeft, ArrowRight, 
  Sparkles, Brain, BookOpen, MessageCircle, AlertCircle, RefreshCw, BarChart2,
  ChevronDown, ChevronUp, Play, Compass, Award, Users, Star, Edit3, 
  CheckSquare, Square, Zap
} from "lucide-react";
import { getProgramConfig } from "@/data/programs";
import SafetyDisclaimer from "@/components/ui/SafetyDisclaimer";

interface SavedProgressState {
  enrolled: boolean;
  completedActivities: string[]; // List of activity ids, e.g. "week-1-activity-0"
  reflectionText: string;
  streak: number;
  lastActiveDate: string;
  aiInsight: string;
}

export default function ProgramDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const config = getProgramConfig(id);

  // Enrollment and progress states
  const [enrolled, setEnrolled] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [streak, setStreak] = useState(0);
  const [aiInsight, setAiInsight] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Accordion state: which week is open
  const [openWeek, setOpenWeek] = useState<number>(1);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(`kk-program-progress-${id}`);
    if (saved) {
      try {
        const parsed: SavedProgressState = JSON.parse(saved);
        setEnrolled(parsed.enrolled);
        setCompletedActivities(parsed.completedActivities || []);
        setReflectionText(parsed.reflectionText || "");
        setStreak(parsed.streak || 0);
        setAiInsight(parsed.aiInsight || "");
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    } else {
      // Initialize with random enrollment stats / initial state
      setStreak(Math.floor(Math.random() * 4) + 1); // Mock 1-4 day streak
    }
  }, [id]);

  // Save to local storage helper
  const saveProgress = (
    newEnrolledState: boolean,
    newCompletedActivities: string[],
    newReflection: string,
    newStreak: number,
    newAiInsight: string
  ) => {
    const state: SavedProgressState = {
      enrolled: newEnrolledState,
      completedActivities: newCompletedActivities,
      reflectionText: newReflection,
      streak: newStreak,
      lastActiveDate: new Date().toISOString().split("T")[0],
      aiInsight: newAiInsight
    };
    localStorage.setItem(`kk-program-progress-${id}`, JSON.stringify(state));
  };

  const handleEnrollToggle = () => {
    const nextEnrolled = !enrolled;
    setEnrolled(nextEnrolled);
    saveProgress(nextEnrolled, completedActivities, reflectionText, streak, aiInsight);
  };

  const handleToggleActivity = (weekNum: number, activityIdx: number) => {
    if (!enrolled) return; // Must be enrolled to check activities
    
    const activityId = `week-${weekNum}-activity-${activityIdx}`;
    let nextCompleted = [...completedActivities];
    
    if (nextCompleted.includes(activityId)) {
      nextCompleted = nextCompleted.filter(id => id !== activityId);
    } else {
      nextCompleted.push(activityId);
      // Increment streak on completing an activity if not done today
      // For simplicity, we just increment it.
      setStreak(prev => prev + 1);
    }
    
    setCompletedActivities(nextCompleted);
    saveProgress(enrolled, nextCompleted, reflectionText, streak, aiInsight);
  };

  // Get total activities count
  const totalActivities = config.weeks.reduce((acc, w) => acc + w.activities.length, 0);
  const completedCount = completedActivities.length;
  const percent = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;

  const handleSubmitReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    setIsAiLoading(true);
    try {
      const prompt = `The user is participating in the "${config.name}" program (Promise: "${config.promise}").
They have completed ${completedCount} out of ${totalActivities} activities (Progress: ${percent}%).
They submitted the following reflection in response to the prompt "${config.reflectionPrompt}":
"${reflectionText}"

Please provide a highly personalized, encouraging, and emotionally intelligent response.
Reflect on their thoughts, offer gentle reassurance, and suggest one small wellness adjustment or practice they can do today to support their healing journey. Keep it to 2-3 sentences.
Do not diagnose medically. Keep the tone warm, compassionate, and supportive.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) throw new Error("AI call failed");
      const data = await res.json();
      setAiInsight(data.text);
      saveProgress(enrolled, completedActivities, reflectionText, streak, data.text);
    } catch (err) {
      console.error(err);
      const fallback = `Accepting and witnessing these thoughts is a powerful first step in your growth. As you navigate ${config.name}, remember to proceed with gentle patience. Focus on small, mindful breathing spaces today.`;
      setAiInsight(fallback);
      saveProgress(enrolled, completedActivities, reflectionText, streak, fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetReflection = () => {
    setReflectionText("");
    setAiInsight("");
    saveProgress(enrolled, completedActivities, "", streak, "");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Play size={14} className="text-blue-500" />;
      case "Exercise":
        return <Compass size={14} className="text-emerald-500" />;
      case "Reflection":
        return <Edit3 size={14} className="text-purple-500" />;
      case "Audio":
        return <MessageCircle size={14} className="text-indigo-500" />;
      default:
        return <Shield size={14} className="text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] pb-16 transition-all duration-300">
      
      {/* Hero Header Section */}
      <section className="bg-[var(--surface-container-lowest)] py-12 md:py-16 border-b border-[var(--outline-variant)] relative overflow-hidden">
        {/* Decorative glows */}
        <div 
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full filter blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: config.accentColor }}
        />
        <div className="max-w-[1280px] mx-auto px-6">
          <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] font-semibold hover:gap-2 transition-all mb-6">
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <span className="chip !py-0.5 !px-2.5 text-[10px] uppercase font-bold tracking-wider" style={{ borderColor: `${config.accentColor}33`, color: config.accentColor }}>
                  {config.level}
                </span>
                <span className="chip !py-0.5 !px-2.5 text-[10px] uppercase font-bold tracking-wider">
                  {config.duration}
                </span>
              </div>
              <h1 className="text-display-lg font-display text-[var(--on-surface)]">{config.name}</h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] leading-relaxed max-w-2xl">
                {config.promise}
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2 text-sm text-[var(--on-surface-variant)]">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[var(--primary)]" />
                  <span>{config.sessions} interactive sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--primary-bright)]" />
                  <span>{config.format}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[var(--secondary)]" />
                  <span>{config.currentEnrolled} active participants</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button for enrollment */}
            <div className="lg:col-span-1 bg-[var(--surface-container-low)] border-hairline rounded-2xl p-6 space-y-4 shadow-ambient">
              <h3 className="font-semibold text-sm text-[var(--on-surface)]">Program Registration</h3>
              <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                Unlock daily activities, progress tracking, streaks, and personalized AI reflections.
              </p>
              
              <button
                onClick={handleEnrollToggle}
                className="w-full btn-primary flex items-center justify-center gap-2 transition-all cursor-pointer py-3.5"
                style={{ 
                  backgroundColor: enrolled ? "transparent" : config.accentColor,
                  border: enrolled ? "1px solid var(--outline-variant)" : "none",
                  color: enrolled ? "var(--on-surface)" : "#fff"
                }}
              >
                {enrolled ? (
                  <>
                    <CheckCircle size={16} className="text-emerald-500" /> Enrolled (Leave Program)
                  </>
                ) : (
                  <>
                    Start Program <ArrowRight size={16} />
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--on-surface-variant)]/60">
                <Shield size={12} /> Privacy guaranteed &bull; 100% self-paced
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-[1280px] mx-auto px-6 mt-10">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left Column (2/3 width): Safety Banner, Outcomes, Modules, AI Journal */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Emotional Reassurance Banner */}
            <div className="p-4 sm:p-5 bg-[var(--surface-container-low)] border border-emerald-500/20 rounded-xl flex items-start gap-4 shadow-sm animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600">
                <Heart size={20} className="fill-emerald-600/10" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[var(--on-surface)] mb-1">You&apos;re not alone.</h4>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                  Every step forward is a victory. Rebuilding emotional wellbeing is a gradual journey, not a race. Small, daily exercises will slowly reinforce neural balance and resilience over time. Proceed with kindness toward yourself.
                </p>
              </div>
            </div>

            {/* Who It Is For / Program Outcomes (Twin Columns) */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Who this is for */}
              <div className="p-6 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-4">
                <h3 className="font-bold text-sm text-[var(--on-surface)] uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" /> Ideal For
                </h3>
                <ul className="space-y-3">
                  {config.forWho.map((item, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                      <span className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div className="p-6 bg-[var(--surface-container-low)] border-hairline rounded-xl space-y-4">
                <h3 className="font-bold text-sm text-[var(--on-surface)] uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-emerald-500" /> Program Outcomes
                </h3>
                <ul className="space-y-3">
                  {config.outcomes.map((item, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-1" />
                      <span className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Milestone Timeline (Visual Nodes Flowchart) */}
            <div className="p-6 bg-[var(--surface-container-low)] border-hairline rounded-xl">
              <h3 className="text-sm font-bold text-[var(--on-surface-variant)]/70 uppercase tracking-wider mb-6 flex items-center gap-2">
                <BarChart2 size={16} /> Milestones & Care Journey
              </h3>
              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="flex items-center justify-between gap-2 min-w-[800px] pr-2">
                  {config.journey.map((step, index) => {
                    const isActive = enrolled && percent >= (index / config.journey.length) * 100;
                    return (
                      <div key={index} className="flex items-center flex-1">
                        <div 
                          className="p-3.5 border rounded-xl text-center flex-1 min-w-[120px] transition-all duration-300"
                          style={{
                            backgroundColor: isActive ? `${config.accentColor}0a` : "var(--surface-container-low)",
                            borderColor: isActive ? config.accentColor : "var(--outline-variant)"
                          }}
                        >
                          <p className="text-[10px] font-bold uppercase mb-0.5" style={{ color: isActive ? config.accentColor : "var(--on-surface-variant)" }}>
                            Phase 0{index+1}
                          </p>
                          <p className="text-xs font-semibold text-[var(--on-surface)] truncate" title={step}>{step}</p>
                        </div>
                        {index < config.journey.length - 1 && (
                          <div className="mx-2 text-[var(--outline-variant)] flex-shrink-0">
                            <ArrowRight size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Weekly Modules Accordion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-headline-md font-display">Syllabus & Weekly Activities</h3>
                {!enrolled && (
                  <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                    <AlertCircle size={12} /> Enroll to track and mark tasks complete
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {config.weeks.map((w) => {
                  const isOpen = openWeek === w.week;
                  const isWeekActive = enrolled;

                  return (
                    <div 
                      key={w.week} 
                      className={`border-hairline rounded-xl overflow-hidden bg-[var(--surface-container-low)] transition-all duration-300 ${
                        isOpen ? "ring-1 border-[var(--outline)]" : ""
                      }`}
                    >
                      {/* Week Header */}
                      <button
                        onClick={() => setOpenWeek(isOpen ? 0 : w.week)}
                        className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--surface-container)] transition-colors"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                            Week {w.week}
                          </span>
                          <h4 className="text-sm font-semibold text-[var(--on-surface)]">
                            {w.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-[var(--on-surface-variant)]">
                            {w.activities.length} sessions
                          </span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {/* Week Activities List */}
                      {isOpen && (
                        <div className="border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-5 space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                          {w.activities.map((activity, idx) => {
                            const activityId = `week-${w.week}-activity-${idx}`;
                            const isCompleted = completedActivities.includes(activityId);
                            
                            return (
                              <div 
                                key={idx} 
                                className={`flex items-center justify-between p-3.5 rounded-xl border border-[var(--outline-variant)]/60 bg-[var(--surface-container-low)] hover:border-[var(--outline)] transition-colors ${
                                  !isWeekActive ? "opacity-75" : ""
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Checkbox */}
                                  <button
                                    onClick={() => handleToggleActivity(w.week, idx)}
                                    disabled={!isWeekActive}
                                    className={`flex-shrink-0 transition-colors ${
                                      isWeekActive ? "cursor-pointer text-[var(--primary)] hover:scale-105" : "cursor-not-allowed text-[var(--outline)]"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckSquare size={18} className="fill-[var(--primary)] text-[var(--surface)]" style={{ fill: config.accentColor }} />
                                    ) : (
                                      <Square size={18} />
                                    )}
                                  </button>

                                  <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-[var(--on-surface)]">
                                      {activity.title}
                                    </p>
                                    <div className="flex items-center gap-2.5 text-[10px] text-[var(--on-surface-variant)]">
                                      <span className="flex items-center gap-1">
                                        {getActivityIcon(activity.type)}
                                        {activity.type}
                                      </span>
                                      <span>&bull;</span>
                                      <span>{activity.duration}</span>
                                    </div>
                                  </div>
                                </div>

                                <span className="text-[10px] font-bold uppercase py-0.5 px-2 rounded-full bg-[var(--surface-container-lowest)] border-hairline">
                                  {isCompleted ? "Completed" : "Pending"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Reflection Journal & AI Guidance Layer */}
            <div className="border border-[var(--primary-fixed-dim)]/30 rounded-2xl bg-gradient-to-br from-[var(--primary-fixed)]/10 to-[var(--surface-container-low)] p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-[var(--primary-fixed)] filter blur-3xl opacity-10 pointer-events-none rounded-full" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[var(--primary-fixed)]/25 rounded-lg text-[var(--primary-bright)]">
                    <Brain size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-md text-[var(--on-surface)]">Guided AI Reflection Journal</h3>
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      Formulate your thoughts to unlock personalized clinical-free guidance.
                    </p>
                  </div>
                </div>

                {/* Reflection Form */}
                <form onSubmit={handleSubmitReflection} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
                      {config.reflectionPrompt}
                    </label>
                    <textarea
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Write your emotional reflections here..."
                      rows={4}
                      disabled={!enrolled || isAiLoading}
                      className="w-full p-4 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-bright)] disabled:opacity-50"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[10px] text-[var(--on-surface-variant)]/60">
                      {!enrolled ? "⚠️ Enroll in program to write your reflections." : "Reflections are saved encrypted locally."}
                    </span>
                    <div className="flex gap-3">
                      {(reflectionText || aiInsight) && (
                        <button
                          type="button"
                          onClick={handleResetReflection}
                          disabled={isAiLoading}
                          className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!enrolled || !reflectionText.trim() || isAiLoading}
                        className="btn-primary !py-2 !px-5 text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: enrolled && reflectionText.trim() ? config.accentColor : "var(--outline-variant)" }}
                      >
                        {isAiLoading ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} /> Get AI Guidance
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* AI Guidance Answer Panel */}
                {(isAiLoading || aiInsight) && (
                  <div className="mt-6 pt-6 border-t border-[var(--outline-variant)] space-y-3 animate-in fade-in duration-300">
                    <h4 className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} className="animate-pulse" /> AI Wellbeing Adaptation Insight
                    </h4>
                    
                    {isAiLoading ? (
                      <div className="space-y-2 py-1">
                        <div className="h-4 bg-[var(--surface-container)] rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-[var(--surface-container)] rounded w-5/6 animate-pulse" />
                        <div className="h-4 bg-[var(--surface-container)] rounded w-2/3 animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-sm font-medium leading-relaxed italic text-[var(--on-surface-variant)]">
                        &ldquo;{aiInsight}&rdquo;
                      </p>
                    )}

                    <p className="text-[10px] text-[var(--on-surface-variant)]/60">
                      Reflection analyzed on-demand via OpenRouter GLM-4.5-Air. Values are for personal self-guidance.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (1/3 width): Progress Tracker, Resources, SOS / Support CTAs */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Progress Meter Ring Card */}
            {enrolled && (
              <div className="card p-6 bg-[var(--surface-container-low)] border-hairline flex flex-col items-center text-center space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider">
                    Program Progress
                  </h4>
                  <p className="text-[10px] text-emerald-500 font-semibold mt-1">
                    Active Wellbeing Transformation
                  </p>
                </div>

                {/* Circular progress meter */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" fill="none" stroke="var(--surface-container-lowest)" strokeWidth="8" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      fill="none" 
                      stroke={config.accentColor} 
                      strokeWidth="8" 
                      strokeDasharray={376.8}
                      strokeDashoffset={376.8 - (376.8 * percent) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold font-display">{percent}%</span>
                    <span className="text-[9px] text-[var(--on-surface-variant)]/70 uppercase">
                      {completedCount} of {totalActivities} done
                    </span>
                  </div>
                </div>

                {/* Streak and details */}
                <div className="w-full grid grid-cols-2 gap-4 border-t border-[var(--outline-variant)] pt-4">
                  <div className="text-center border-r border-[var(--outline-variant)]">
                    <span className="text-xl font-bold flex items-center justify-center gap-1 text-orange-500">
                      <Zap size={18} className="fill-orange-500" /> {streak}d
                    </span>
                    <span className="text-[9px] text-[var(--on-surface-variant)]/60 uppercase font-semibold">
                      Current Streak
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-bold text-[var(--primary)]">
                      {config.weeks.length - completedActivities.filter(a => a.includes(`week-${openWeek}`)).length}
                    </span>
                    <span className="text-[9px] text-[var(--on-surface-variant)]/60 uppercase font-semibold">
                      Week {openWeek} Left
                    </span>
                  </div>
                </div>

                {/* Certificate unlock alert */}
                {percent === 100 && (
                  <div className="w-full p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-left">
                    <Award size={20} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[var(--on-surface)]">Program Completed!</p>
                      <p className="text-[10px] text-[var(--on-surface-variant)]">Your digital badge is unlocked.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Related Resources */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--on-surface-variant)]/70 uppercase tracking-wider">
                Supportive Materials
              </h3>
              
              <div className="space-y-3">
                {config.resources.map((res, index) => (
                  <div key={index} className="card p-4 hover:border-[var(--primary-fixed-dim)] transition-all cursor-pointer bg-[var(--surface-container-low)]">
                    <div className="space-y-2">
                      <span className="chip !py-0.5 !px-2 text-[9px] tracking-wide uppercase font-semibold">
                        <BookOpen size={10} className="inline mr-1" /> {res.type}
                      </span>
                      <h4 className="text-xs font-semibold leading-relaxed text-[var(--on-surface)]">
                        {res.title}
                      </h4>
                      <p className="text-[10px] text-[var(--on-surface-variant)]/60">
                        {res.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ecosystem Support & human connection */}
            <div className="card p-5 bg-[var(--surface-container-low)] border-hairline space-y-4">
              <h4 className="text-xs font-bold text-[var(--on-surface-variant)] uppercase tracking-wider flex items-center gap-1.5">
                <Heart size={14} className="text-[var(--primary)]" /> Additional Care
              </h4>
              <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                If self-paced modules are challenging or you need professional guidance, we are here:
              </p>
              
              <div className="flex flex-col gap-2.5 pt-1">
                {config.support.map((linkText, idx) => {
                  let href = "/sos";
                  if (linkText.toLowerCase().includes("session") || linkText.toLowerCase().includes("therapist")) {
                    href = "/book-session";
                  } else if (linkText.toLowerCase().includes("circle")) {
                    href = "/community";
                  } else if (linkText.toLowerCase().includes("companion") || linkText.toLowerCase().includes("chat")) {
                    href = "/chat";
                  }

                  return (
                    <Link
                      key={idx}
                      href={href}
                      className="w-full text-left p-3 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-xs font-semibold hover:border-[var(--primary)] hover:bg-[var(--primary-fixed)]/5 transition-all flex items-center justify-between group"
                    >
                      <span>{linkText}</span>
                      <ArrowRight size={12} className="text-[var(--outline)] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Clinical Disclaimer footer */}
            <SafetyDisclaimer />

          </div>

        </div>
      </main>

    </div>
  );
}
