import Link from "next/link";
import { CheckCircle, Heart, Sun, Sparkles, PenLine, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  { title: "How Are You Feeling?", desc: "Quick emotional check-in with a simple mood scale — takes just 10 seconds", icon: Heart },
  { title: "Gratitude Moment", desc: "Name one thing you're grateful for today to shift your perspective", icon: Sun },
  { title: "Wellbeing Score", desc: "Get your daily wellbeing score based on mood, sleep, and energy levels", icon: TrendingUp },
  { title: "Daily Intention", desc: "Set a micro-intention for the day to guide your actions", icon: Sparkles },
  { title: "Reflection Prompt", desc: "Optional guided prompt to deepen your self-awareness", icon: PenLine },
  { title: "Streak & Progress", desc: "Build momentum with consecutive check-in streaks", icon: CheckCircle },
];

export default function DailyCheckin() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><CheckCircle size={14} /> 60-Second Ritual</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Daily Check-in</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Start your day with a quick emotional check-in. Gratitude, intention, and self-awareness — all in under a minute.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5">
                  <s.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/login" className="btn-primary inline-flex items-center gap-2">
              Begin Check-in <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
