import Link from "next/link";
import { Smile, TrendingUp, Calendar, Flame, Brain, BarChart3, ArrowRight } from "lucide-react";

const features = [
  { title: "Daily Mood Logging", desc: "Quick 10-second mood check with emoji-based emotional scale", icon: Smile },
  { title: "Emotional Patterns", desc: "Discover trends in your mood over days, weeks, and months", icon: TrendingUp },
  { title: "Streak Tracking", desc: "Build healthy habits with daily logging streaks and rewards", icon: Flame },
  { title: "Calendar View", desc: "Visual overview of your emotional journey over time", icon: Calendar },
  { title: "AI Insights", desc: "Personalized observations about your patterns and triggers", icon: Brain },
  { title: "Progress Reports", desc: "Weekly and monthly summaries to track your growth", icon: BarChart3 },
];

export default function MoodTracker() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Smile size={14} /> Emotional Awareness</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Mood Tracker</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Track your emotional landscape daily. Understand your patterns, identify triggers, and celebrate your progress — one check-in at a time.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5">
                  <f.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/login" className="btn-primary inline-flex items-center gap-2">
              Start Tracking <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
