import Link from "next/link";
import { Brain, TrendingUp, BarChart3, Sparkles, ArrowRight, Shield, Heart, Target } from "lucide-react";

const insights = [
  { icon: TrendingUp, title: "Emotional Trends", desc: "Track how your emotional health changes over weeks and months. Identify patterns." },
  { icon: BarChart3, title: "Burnout Risk Score", desc: "AI analyzes your work-life patterns and warns you before burnout hits." },
  { icon: Sparkles, title: "Smart Recommendations", desc: "Personalized suggestions for programs, professionals, and resources." },
  { icon: Heart, title: "Wellbeing Score", desc: "A holistic score combining mood, engagement, growth, and community participation." },
  { icon: Target, title: "Goal Tracking", desc: "Set emotional wellness goals and track progress with AI-assisted milestones." },
  { icon: Brain, title: "Pattern Recognition", desc: "AI identifies triggers, positive habits, and areas needing attention." },
];

export default function AIInsights() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="chip mx-auto w-fit mb-6"><Brain size={14} /> AI Insights</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
              Understand Your <span className="text-gradient">Emotional Patterns</span>
            </h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-xl mx-auto mb-10">
              AI-powered insights that help you see the bigger picture of your emotional health — trends, risks, and growth opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Insight Types */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {insights.map((item) => (
              <div key={item.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                  <item.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Shield className="mx-auto text-[var(--primary)] mb-4" size={32} />
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Ethical & Transparent</h2>
          <p className="text-[var(--on-surface-variant)] max-w-2xl mx-auto mb-8">
            Our AI never makes diagnoses. It provides insights to help you and your professional make informed decisions together. All AI interactions are supervised by clinical professionals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ai-companion" className="btn-primary inline-flex items-center gap-2">Explore AI Ecosystem <ArrowRight size={16} /></Link>
            <Link href="/trust/ethical-ai" className="btn-secondary">Read Ethical AI Policy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
