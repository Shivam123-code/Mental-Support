import Link from "next/link";
import { Brain, MessageCircle, TrendingUp, Shield, Sparkles, ArrowRight, Heart, Lock, AlertTriangle } from "lucide-react";

const aiModules = [
  { icon: MessageCircle, title: "AI Companion", desc: "Daily emotional support through intelligent, empathetic conversations. Always available, never judgmental.", tag: "Daily Support" },
  { icon: Brain, title: "AI Journaling", desc: "Mood & emotional pattern analysis. Understand your feelings through guided reflective writing.", tag: "Self-Awareness" },
  { icon: Sparkles, title: "AI Recommendations", desc: "Personalized suggestions for programs, professionals, and wellness resources based on your journey.", tag: "Guidance" },
  { icon: TrendingUp, title: "AI Burnout Prediction", desc: "Workplace & personal wellbeing insights. Get early warnings before burnout hits.", tag: "Prevention" },
  { icon: AlertTriangle, title: "AI Risk Detection", desc: "Safety escalation assistance. Automatically connects you with human support when needed.", tag: "Safety" },
  { icon: Heart, title: "Emotional Trend Tracking", desc: "Visualize your emotional patterns over time. See growth, identify triggers, celebrate progress.", tag: "Insights" },
];

const governance = [
  { title: "Human Supervision", desc: "All AI interactions are monitored by qualified professionals" },
  { title: "Non-Diagnostic", desc: "AI provides guidance, never clinical diagnoses" },
  { title: "Ethical Policy", desc: "Strict ethical framework governs all AI behavior" },
  { title: "Safety Escalation", desc: "Automatic human handoff for crisis situations" },
  { title: "Transparency", desc: "You always know when you're interacting with AI" },
  { title: "Data Privacy", desc: "Your conversations are encrypted and never sold" },
];

export default function AICompanion() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--primary)] text-white overflow-hidden py-16 sm:py-24 md:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
            <Brain size={14} /> AI Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-6">
            Your Intelligent<br />Wellbeing Companion
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-10">
            AI that understands, supports, and guides — without ever replacing human connection. Available 24/7, ethically governed, and always transparent.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/journal" className="px-6 sm:px-8 py-3.5 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all text-sm sm:text-base">
              Try AI Journaling
            </Link>
            <Link href="/ai-insights" className="px-6 sm:px-8 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-sm sm:text-base">
              View AI Insights
            </Link>
          </div>
        </div>
      </section>

      {/* AI Modules */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">AI-Powered Modules</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Six intelligent modules working together to support your emotional wellbeing journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {aiModules.map((module) => (
              <div key={module.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                    <module.icon className="text-[var(--primary)]" size={20} />
                  </div>
                  <span className="text-[10px] sm:text-xs bg-[var(--primary-fixed)] text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">{module.tag}</span>
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{module.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Governance */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="chip mx-auto w-fit mb-4"><Shield size={14} /> Ethical AI</div>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">AI Governance & Safety</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Our AI is built with strict ethical boundaries. It assists — it never replaces human judgment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {governance.map((item) => (
              <div key={item.title} className="card">
                <h3 className="font-semibold text-[var(--on-surface)] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-gap bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Lock className="mx-auto text-[var(--primary)] mb-4" size={32} />
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Coming Soon</h2>
          <p className="text-[var(--on-surface-variant)] mb-8">Our AI ecosystem is currently in development. Join the waitlist to be among the first to experience it.</p>
          <Link href="/assessments" className="btn-primary inline-flex items-center gap-2">
            Start With Assessments <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
