"use client";

import Link from "next/link";
import { BookOpen, Brain, TrendingUp, Shield, Smile, ArrowRight, Lock, Heart, Sparkles } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Guided Prompts", desc: "AI-powered prompts that help you explore your emotions safely and meaningfully." },
  { icon: Brain, title: "Pattern Analysis", desc: "Identify emotional patterns and triggers over time with intelligent insights." },
  { icon: TrendingUp, title: "Mood Tracking", desc: "Daily mood check-ins that build a picture of your emotional health journey." },
  { icon: Sparkles, title: "Growth Insights", desc: "See how far you've come. Celebrate emotional milestones and streaks." },
  { icon: Heart, title: "Gratitude Practice", desc: "Built-in gratitude exercises to shift focus towards positivity." },
  { icon: Shield, title: "100% Private", desc: "Your journal is encrypted. No one sees it — not even us." },
];

export default function Journal() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="chip mx-auto w-fit mb-6"><BookOpen size={14} /> AI Journaling</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
              Your Private Space to <span className="text-gradient">Feel & Heal</span>
            </h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-xl mx-auto mb-10">
              AI-guided journaling that helps you understand your emotions, track patterns, and grow — completely privately.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login" className="btn-primary inline-flex items-center gap-2">Start Journaling <ArrowRight size={16} /></Link>
              <Link href="/ai-companion" className="btn-secondary">Learn About AI</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">How It Works</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Write freely. The AI helps you understand yourself better — without judgment.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f) => (
              <div key={f.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                  <f.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal Preview */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="card !bg-[var(--surface-container-low)] !p-6 sm:!p-10">
            <div className="flex items-center gap-3 mb-6">
              <Smile className="text-[var(--tertiary-bright)]" size={24} />
              <div>
                <p className="font-semibold text-[var(--on-surface)] text-sm">Today&apos;s Prompt</p>
                <p className="text-xs text-[var(--on-surface-variant)]">May 22, 2026</p>
              </div>
            </div>
            <p className="text-lg sm:text-xl font-display text-[var(--on-surface)] italic mb-6">
              &ldquo;What made you smile today, even just a little?&rdquo;
            </p>
            <div className="bg-[var(--surface-container-lowest)] rounded-lg p-4 border border-[var(--outline-variant)]">
              <p className="text-sm text-[var(--outline)] italic">Start writing here... Your thoughts are private and encrypted.</p>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-[var(--on-surface-variant)]">
              <span className="flex items-center gap-1"><Lock size={11} className="text-[var(--primary)]" /> End-to-end encrypted</span>
              <span className="flex items-center gap-1"><Brain size={11} className="text-[var(--primary)]" /> AI pattern analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[var(--inverse-surface)] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-headline-lg mb-4">Start Your Wellbeing Journal</h2>
          <p className="text-white/60 mb-8">Free. Private. Guided by AI. Begin understanding yourself better today.</p>
          <Link href="/role-selection" className="px-8 py-4 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
