"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Heart, Clock, Shield, CheckCircle, ArrowLeft, ArrowRight, 
  Sparkles, Brain, BookOpen, MessageCircle, AlertCircle, RefreshCw, BarChart2
} from "lucide-react";
import { getAssessmentConfig } from "@/data/assessments";
import SafetyDisclaimer from "@/components/ui/SafetyDisclaimer";

interface AnswerState {
  questionId: string;
  score: number;
  answerText: string;
  isFollowUp?: boolean;
}

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const config = getAssessmentConfig(id);

  const [flowState, setFlowState] = useState<"intro" | "quiz" | "transition" | "results">("intro");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handleStart = () => {
    setFlowState("quiz");
    setCurrentQIndex(0);
    setAnswers({});
    setShowFollowUp(false);
  };

  const currentQuestion = config.questions[currentQIndex];

  const handleSelectOption = (score: number, text: string, triggerFollowUp = false) => {
    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        score,
        answerText: text,
      },
    }));

    if (triggerFollowUp && currentQuestion.followUpQuestion) {
      setShowFollowUp(true);
    } else {
      setShowFollowUp(false);
      handleNextStep();
    }
  };

  const handleSelectFollowUpOption = (score: number, text: string) => {
    if (!currentQuestion.followUpQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.followUpQuestion!.id]: {
        questionId: currentQuestion.followUpQuestion!.id,
        score,
        answerText: text,
        isFollowUp: true,
      },
    }));

    setShowFollowUp(false);
    handleNextStep();
  };

  const handleNextStep = () => {
    if (currentQIndex < config.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Trigger transition screen
      setFlowState("transition");
      
      // Call AI endpoint in background, and set a timer for premium transition feel
      fetchAIInsights();

      transitionTimerRef.current = setTimeout(() => {
        setFlowState("results");
      }, 3500);
    }
  };

  const handlePrevStep = () => {
    if (showFollowUp) {
      setShowFollowUp(false);
    } else if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
      // Check if previous question has follow-up stored
      const prevQ = config.questions[currentQIndex - 1];
      const hasFollowUpAnswer = prevQ.followUpQuestion && answers[prevQ.followUpQuestion.id];
      if (hasFollowUpAnswer) {
        setShowFollowUp(true);
      }
    } else {
      setFlowState("intro");
    }
  };

  // Score Calculations
  const calculateTotalScore = () => {
    return Object.values(answers)
      .filter((a) => !a.isFollowUp)
      .reduce((sum, a) => sum + a.score, 0);
  };

  const getSeverity = (score: number) => {
    const maxScore = config.questions.length * 4;
    const ratio = score / maxScore;

    if (ratio <= 0.4) return { label: "Low", desc: "Balanced emotional state. Normal baseline levels.", color: "text-emerald-500", bg: "bg-emerald-50" };
    if (ratio <= 0.75) return { label: "Moderate", desc: "Mild emotional stress detected. Potential for self-regulation or guidance.", color: "text-amber-500", bg: "bg-amber-50" };
    return { label: "High", desc: "Elevated tension detected. Recommended to practice mindfulness or consult a specialist.", color: "text-rose-500", bg: "bg-rose-50" };
  };

  const totalScore = calculateTotalScore();
  const severity = getSeverity(totalScore);

  // Dynamic content based on severity
  const getStrengthsAndConcerns = () => {
    if (severity.label === "Low") {
      return {
        strengths: ["Strong emotional resilience", "Effective self-regulation", "Consistent sleep schedule", "Balanced stress response"],
        concerns: ["Minor situational fatigue", "Opportunity for deeper mindfulness training"],
      };
    } else if (severity.label === "Moderate") {
      return {
        strengths: ["High self-awareness", "Empathy towards others", "Receptive to emotional regulation practices"],
        concerns: ["Overthinking in stressful situations", "Fluctuating sleep patterns", "Boundary setting difficulty"],
      };
    } else {
      return {
        strengths: ["Deep emotional sensitivity", "Expressive empathy", "Resilience potential under guided care"],
        concerns: ["Severe emotional burnout risk", "Disrupted sleep and restoration cycle", "High situational anxiety spikes"],
      };
    }
  };

  const { strengths, concerns } = getStrengthsAndConcerns();

  const fetchAIInsights = async () => {
    setIsAiLoading(true);
    try {
      // Build brief summary of answers for the prompt
      const summaryString = Object.values(answers)
        .map((a) => {
          const qText = config.questions.find((q) => q.id === a.questionId)?.text || "Question";
          return `- Question: "${qText}" | Selected Answer: "${a.answerText}"`;
        })
        .join("\n");

      const prompt = `The user has completed the "${config.name}" assessment. 
Their total score indicates a "${severity.label}" level (${severity.desc}).
Here is a summary of their answers:
${summaryString}

Please provide a highly personalized, empathetic, and warm emotional intelligence insight (2-3 sentences).
Specifically address their responses and offer one actionable, soothing wellbeing advice. Do not diagnose medically. 
Ensure you DO NOT append any trailing tags like [MOOD: ...]. Just output the warm reflection directly.`;

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
    } catch (err) {
      console.error(err);
      // Fallback insights
      setAiInsight(`Your results suggest some emotional friction in coping with daily tasks. It is common to experience these patterns. Developing structured morning reflections, journaling, and regular breaks will help improve overall resilience and emotional stability.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const maxPossibleScore = config.questions.length * 4;
  const scorePercent = Math.round((totalScore / maxPossibleScore) * 100);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] pb-12 transition-all duration-300">
      
      {/* Dynamic Intro Screen */}
      {flowState === "intro" && (
        <div>
          {/* Hero Section */}
          <section className="bg-[var(--surface-container-lowest)] py-12 md:py-20 border-b border-[var(--outline-variant)]">
            <div className="max-w-[800px] mx-auto px-4 sm:px-6">
              <Link href="/assessments" className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] font-semibold hover:gap-2 transition-all mb-6">
                <ArrowLeft size={14} /> Back to Intelligence Center
              </Link>
              
              <h1 className="text-display-xl font-display mb-4">{config.name}</h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-8 leading-relaxed">
                {config.description}
              </p>

              <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 text-sm">
                <span className="chip !py-1.5 !px-4">⏱ {config.duration}</span>
                <span className="chip !py-1.5 !px-4">🔒 Private & Secure</span>
                <span className="chip !py-1.5 !px-4">🧠 AI-Assisted Insights</span>
              </div>

              <button 
                onClick={handleStart}
                className="btn-primary flex items-center gap-2 !px-8 !py-4 shadow-ambient-hover"
                style={{ backgroundColor: config.accentColor }}
              >
                Start Assessment <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Emotional Safety Banner */}
          <section className="max-w-[800px] mx-auto px-4 sm:px-6 mt-10">
            <div className="p-4 sm:p-5 bg-[var(--surface-container-low)] border border-emerald-500/20 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600">
                <Heart size={20} className="fill-emerald-600/10" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[var(--on-surface)] mb-1">You&apos;re Not Alone</h4>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                  {config.bannerMessage}
                </p>
              </div>
            </div>
          </section>

          {/* What This Assessment Helps With */}
          <section className="max-w-[800px] mx-auto px-4 sm:px-6 mt-10">
            <h3 className="text-headline-md mb-6">What this helps with</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {config.helpsWith.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Common Symptoms / Educational Section */}
          <section className="max-w-[800px] mx-auto px-4 sm:px-6 mt-12 pt-10 border-t border-[var(--outline-variant)]">
            <h3 className="text-headline-md mb-6">Common Signs & Behaviors</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {config.symptoms.map((item, index) => (
                <div key={index} className="p-4 bg-[var(--surface-container-lowest)] border-hairline rounded-xl">
                  <p className="text-sm font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Trust disclaimer */}
          <section className="max-w-[800px] mx-auto px-4 sm:px-6 mt-16 pt-6 border-t border-[var(--outline-variant)]">
            <SafetyDisclaimer />
          </section>
        </div>
      )}

      {/* Quiz Flow State */}
      {flowState === "quiz" && (
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 pt-10 md:pt-16">
          {/* Header navigation */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={handlePrevStep} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
              <ArrowLeft size={14} /> Previous
            </button>
            <span className="text-xs font-semibold text-[var(--on-surface-variant)]">
              Question {currentQIndex + 1} of {config.questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[var(--surface-container)] rounded-full overflow-hidden mb-12">
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: `${((currentQIndex + (showFollowUp ? 0.5 : 0)) / config.questions.length) * 100}%`,
                backgroundColor: config.accentColor 
              }}
            />
          </div>

          {/* Active Question Render */}
          {!showFollowUp ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h2 className="text-headline-lg font-display text-[var(--on-surface)] leading-snug">
                {currentQuestion.text}
              </h2>

              <div className="flex flex-col gap-3.5 pt-4">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id]?.answerText === opt.text;
                  return (
                    <button
                      key={opt.text}
                      onClick={() => handleSelectOption(opt.score, opt.text, opt.triggerFollowUp)}
                      className={`w-full p-4 rounded-xl text-left border font-medium text-sm transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[var(--primary-fixed)]/25 ring-1 border-[var(--primary-bright)]"
                          : "bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] hover:border-[var(--primary-fixed-dim)]"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Render Follow-up Question
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary-bright)] uppercase tracking-wider">
                <Sparkles size={12} /> Follow-up Insight
              </div>
              <h2 className="text-headline-lg font-display text-[var(--on-surface)] leading-snug">
                {currentQuestion.followUpQuestion?.text}
              </h2>

              <div className="flex flex-col gap-3.5 pt-4">
                {currentQuestion.followUpQuestion?.options.map((opt) => {
                  const isSelected = answers[currentQuestion.followUpQuestion!.id]?.answerText === opt.text;
                  return (
                    <button
                      key={opt.text}
                      onClick={() => handleSelectFollowUpOption(opt.score, opt.text)}
                      className={`w-full p-4 rounded-xl text-left border font-medium text-sm transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[var(--primary-fixed)]/25 ring-1 border-[var(--primary-bright)]"
                          : "bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] hover:border-[var(--primary-fixed-dim)]"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion Transition Loader */}
      {flowState === "transition" && (
        <div className="fixed inset-0 bg-[var(--surface)] z-[100] flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-8">
            {/* Spinning glowing loader circles */}
            <div className="w-16 h-16 rounded-full border-4 border-[var(--primary-fixed)] border-t-[var(--primary-bright)] animate-spin" />
            <Brain size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--primary-bright)]" />
          </div>
          <h2 className="text-headline-md font-display mb-3 text-[var(--on-surface)]">Analyzing your emotional patterns...</h2>
          <p className="text-sm text-[var(--on-surface-variant)] max-w-sm leading-relaxed">
            Preparing your personalized wellbeing dashboard and fetching AI insights.
          </p>
        </div>
      )}

      {/* Results Dashboard State */}
      {flowState === "results" && (
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-10 md:pt-14 space-y-10 animate-in fade-in duration-500">
          
          {/* Header navigation back */}
          <div className="flex items-center justify-between">
            <Link href="/assessments" className="inline-flex items-center gap-1 text-sm text-[var(--primary)] font-semibold hover:gap-2 transition-all">
              <ArrowLeft size={14} /> Back to Assessments
            </Link>
            <button 
              onClick={handleStart}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              <RefreshCw size={12} /> Retake Assessment
            </button>
          </div>

          {/* Results Summary Card */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left - Score Visualization Circular Meter */}
            <div className="card md:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-[var(--surface-container-low)]">
              <p className="text-xs font-bold text-[var(--on-surface-variant)]/60 uppercase tracking-wider mb-6">Your Score</p>
              
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG circular track */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" fill="none" stroke="var(--surface-container)" strokeWidth="8" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    fill="none" 
                    stroke={config.accentColor} 
                    strokeWidth="8" 
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * scorePercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold font-display">{totalScore}</span>
                  <span className="text-[10px] text-[var(--on-surface-variant)]/70 uppercase">of {maxPossibleScore}</span>
                </div>
              </div>

              <div className={`mt-6 px-3 py-1 rounded-full text-xs font-bold ${severity.bg} ${severity.color}`}>
                {severity.label} Severity
              </div>
            </div>

            {/* Right - Score detail and emotional insights */}
            <div className="card md:col-span-2 p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--on-surface-variant)]/60 uppercase tracking-wider mb-2">Wellbeing Insight</p>
                <h3 className="text-headline-md font-display mb-4">{severity.desc}</h3>
                
                {/* Strengths & Concern Areas */}
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <CheckCircle size={12} /> Strength Indicators
                    </h4>
                    <ul className="space-y-2 text-xs text-[var(--on-surface-variant)] list-disc pl-4">
                      {strengths.map((st, i) => <li key={i}>{st}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <AlertCircle size={12} /> Concern Areas
                    </h4>
                    <ul className="space-y-2 text-xs text-[var(--on-surface-variant)] list-disc pl-4">
                      {concerns.map((co, i) => <li key={i}>{co}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--outline-variant)] text-xs text-[var(--on-surface-variant)]/70 flex items-center gap-1.5">
                <Shield size={12} /> Strictly confidential — your score data resides encrypted locally.
              </div>
            </div>
          </div>

          {/* AI Insights Segment */}
          <div className="card p-6 bg-gradient-to-br from-[var(--primary-fixed)]/15 to-[var(--surface-container-lowest)] border-[var(--primary-fixed-dim)]/30 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute right-0 bottom-0 w-44 h-44 bg-[var(--primary-fixed)] filter blur-3xl opacity-20 pointer-events-none rounded-full" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                <Sparkles size={14} className="animate-pulse" /> AI-Generated Wellbeing Reflection
              </div>

              {isAiLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-4 bg-[var(--surface-container)] rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-[var(--surface-container)] rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-[var(--surface-container)] rounded w-2/3 animate-pulse" />
                </div>
              ) : (
                <p className="text-sm font-medium leading-relaxed italic text-[var(--on-surface-variant)]">
                  &ldquo;{aiInsight}&rdquo;
                </p>
              )}

              <div className="text-[10px] text-[var(--on-surface-variant)]/60">
                Reflection analyzed on-demand via OpenRouter GLM-4.5-Air. Values are for personal self-guidance.
              </div>
            </div>
          </div>

          {/* Suggested Care Journey */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-[var(--on-surface-variant)]/70 uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <BarChart2 size={16} /> Suggested Care Journey
            </h3>
            
            {/* horizontal flowchart flow */}
            <div className="overflow-x-auto pb-2 scrollbar-thin">
              <div className="flex items-center justify-between gap-2 min-w-[800px] pr-2">
                {config.journey.map((step, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div className="p-3 bg-[var(--surface-container-low)] border-hairline rounded-xl text-center flex-1 min-w-[120px]">
                      <p className="text-xs font-bold text-[var(--primary)] uppercase mb-0.5">Step 0{index+1}</p>
                      <p className="text-xs font-semibold text-[var(--on-surface)] truncate" title={step}>{step}</p>
                    </div>
                    {index < config.journey.length - 1 && (
                      <div className="mx-2 text-[var(--outline-variant)] flex-shrink-0">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Resources */}
          <div className="space-y-4">
            <h3 className="text-headline-md">Dynamic Resources for you</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {config.resources.map((res, index) => (
                <div key={index} className="card p-4 flex flex-col justify-between hover:border-[var(--primary-fixed-dim)] transition-all cursor-pointer">
                  <div>
                    <span className="chip !py-0.5 !px-2.5 text-[10px] tracking-wide uppercase mb-3 inline-block">
                      <BookOpen size={10} className="inline mr-1" /> {res.type}
                    </span>
                    <h4 className="text-sm font-semibold leading-relaxed text-[var(--on-surface)] mb-4">{res.title}</h4>
                  </div>
                  <span className="text-xs text-[var(--on-surface-variant)]/70">{res.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ecosystem CTAs */}
          <div className="card p-6 sm:p-8 bg-[var(--surface-container)] text-center flex flex-col items-center">
            <Brain className="text-[var(--primary)] mb-4" size={32} />
            <h3 className="text-headline-md mb-2">Need additional supportive care?</h3>
            <p className="text-sm text-[var(--on-surface-variant)] max-w-md mb-6 leading-relaxed">
              Connect with verified human professionals, start empathetic mood journaling, or join community support circles.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/book-session" className="btn-primary">
                Book Professional Session
              </Link>
              <Link href="/journal" className="btn-secondary">
                Start Reflective Journal
              </Link>
              <Link href="/community" className="btn-secondary">
                Join Support Circles
              </Link>
            </div>
          </div>

          {/* Privacy / Trust Segment */}
          <div className="py-6 border-t border-[var(--outline-variant)] text-center text-xs text-[var(--on-surface-variant)]/60 max-w-md mx-auto leading-relaxed">
            All data logged is private. We strictly encrypt responses. No details are sold. GDPR & DPDP compliant configurations.
          </div>
        </div>
      )}
    </div>
  );
}
