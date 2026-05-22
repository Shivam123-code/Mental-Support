import Image from "next/image";
import Link from "next/link";
import { Heart, Globe, Shield, Brain, Users, Sparkles, ArrowRight, Target, Eye, Lightbulb, Zap, Award, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero - Full Width Statement */}
      <section className="relative bg-[var(--primary)] text-white overflow-hidden py-20 sm:py-28 md:py-36">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/15 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border border-white/10 rounded-full" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <p className="text-sm sm:text-base uppercase tracking-[0.2em] text-white/50 mb-6 font-medium">The Bigger Vision</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-medium leading-[1.05] mb-8">
            We&apos;re building the<br/>
            <span className="text-[var(--primary-fixed)]">Human Wellbeing Layer</span><br/>
            for the Digital World.
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-10">
            Not a therapy app. Not a meditation tool. A category-defining ecosystem for healing, growing, connecting, and thriving — at scale.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/community" className="px-6 sm:px-8 py-3.5 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all text-sm sm:text-base">
              Join the Movement
            </Link>
            <Link href="/get-support" className="px-6 sm:px-8 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-sm sm:text-base">
              Get Support
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline Banner */}
      <section className="py-12 sm:py-16 bg-[var(--surface-container-lowest)] text-center border-b border-[var(--outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <p className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-[var(--on-surface)]">
            &ldquo;You&apos;re Not Alone.&rdquo;
          </p>
          <p className="text-sm sm:text-base text-[var(--on-surface-variant)] mt-3 italic">Our promise to every human who finds us.</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="chip mx-auto w-fit mb-4"><Heart size={14} /> Our Story</div>
            <h2 className="text-headline-lg text-[var(--on-surface)]">Why We Exist</h2>
          </div>
          <div className="space-y-8 text-[var(--on-surface-variant)] leading-relaxed">
            <p className="text-lg sm:text-xl">
              Humanity is becoming <strong className="text-[var(--on-surface)]">digitally connected</strong> but <strong className="text-[var(--on-surface)]">emotionally disconnected</strong>.
            </p>
            <p className="text-base sm:text-lg">
              Stress, loneliness, burnout, anxiety, emotional suppression, relationship struggles, and mental fatigue are increasing globally. Many people do not know where to seek help. They fear judgment. They feel emotionally isolated.
            </p>
            <div className="bg-[var(--primary-fixed)] rounded-2xl p-6 sm:p-10 text-center my-8 sm:my-12">
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-[var(--primary)]">
                KleverKlues&trade; exists to change this.
              </p>
            </div>
            <p className="text-base sm:text-lg">
              We believe: <em className="font-display text-[var(--primary)] not-italic font-medium">Better Humans Create Better Families, Better Workplaces, Better Societies, and a Better World.</em>
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Purpose */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Target, title: "Mission", text: "To help create a world where no human feels emotionally alone.", color: "bg-[var(--primary-fixed)]" },
              { icon: Eye, title: "Vision", text: "To become the world's most trusted Human Wellbeing & Emotional Support Ecosystem.", color: "bg-[var(--tertiary-fixed)]" },
              { icon: Lightbulb, title: "Purpose", text: "To improve human wellbeing at scale — safely, privately, meaningfully, globally.", color: "bg-[var(--secondary-fixed)]" },
            ].map((item) => (
              <div key={item.title} className="card text-center sm:text-left">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5 mx-auto sm:mx-0`}>
                  <item.icon size={24} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-3">{item.title}</h3>
                <p className="text-[var(--on-surface-variant)] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">What We&apos;re Building</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Five pillars that make KleverKlues&trade; a category-defining platform.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {[
              { emoji: "🛡️", title: "Trust & Safety", desc: "Privacy-first, verified, clinically governed" },
              { emoji: "🧭", title: "Guided Wellbeing", desc: "Assessments, programs, sessions, care plans" },
              { emoji: "🤝", title: "Human Connection", desc: "Communities, mentorship, peer circles" },
              { emoji: "💡", title: "Emotional Economy", desc: "Learn, earn, mentor, contribute" },
              { emoji: "🧠", title: "AI Intelligence", desc: "Smart insights, predictions, recommendations" },
            ].map((pillar) => (
              <div key={pillar.title} className="card text-center hover:-translate-y-1 transition-all duration-300 !p-4 sm:!p-6">
                <span className="text-3xl sm:text-4xl block mb-3">{pillar.emoji}</span>
                <h3 className="font-semibold text-[var(--on-surface)] text-xs sm:text-sm mb-1">{pillar.title}</h3>
                <p className="text-[10px] sm:text-xs text-[var(--on-surface-variant)] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-16 sm:py-20 bg-[var(--primary)] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-headline-lg text-white mb-2">Our Impact So Far</h2>
            <p className="text-white/50 text-sm">And we&apos;re just getting started.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: "10K+", label: "People Supported" },
              { value: "500+", label: "Verified Professionals" },
              { value: "50+", label: "Programs" },
              { value: "24/7", label: "Crisis Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl md:text-5xl font-display font-medium">{stat.value}</p>
                <p className="text-white/50 mt-2 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Heart, title: "Human First", desc: "Every decision starts with human wellbeing." },
              { icon: Shield, title: "Trust & Safety", desc: "Privacy, ethics, and trust are non-negotiable." },
              { icon: Brain, title: "Emotional Intelligence", desc: "We design for emotional safety, always." },
              { icon: Users, title: "Community Care", desc: "Collective wellbeing through connection." },
              { icon: Globe, title: "Global Accessibility", desc: "Support accessible to everyone, everywhere." },
              { icon: Sparkles, title: "Continuous Growth", desc: "Lifelong emotional growth, not just crisis care." },
            ].map((v) => (
              <div key={v.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                  <v.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Our Roadmap</h2>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {[
              { phase: "1", title: "Trust Foundation", desc: "Website, Assessments, Professionals, Sessions, SOS", status: "current" },
              { phase: "2", title: "Engagement & Retention", desc: "Programs, Communities, AI, Academy, Enterprise", status: "upcoming" },
              { phase: "3", title: "Ecosystem Expansion", desc: "AI Companion, Creator Economy, Research Institute", status: "future" },
              { phase: "4", title: "Global Leadership", desc: "Global Partnerships, Government Alliances, TrustOS", status: "future" },
            ].map((t) => (
              <div key={t.phase} className={`flex gap-4 sm:gap-5 p-4 sm:p-6 rounded-xl border transition-all ${t.status === 'current' ? 'bg-[var(--primary-fixed)]/20 border-[var(--primary-fixed-dim)]' : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]'}`}>
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${t.status === 'current' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'}`}>
                  {t.phase}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[var(--on-surface)] text-sm sm:text-base">{t.title}</h3>
                    {t.status === 'current' && <span className="text-[10px] sm:text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--on-surface-variant)] mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Movement CTA */}
      <section className="py-16 sm:py-24 bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-lg sm:text-xl font-display italic text-[var(--primary)] mb-4">&ldquo;Humanity, Connected.&rdquo;</p>
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-6">Join the Movement</h2>
          <p className="text-[var(--on-surface-variant)] mb-8 sm:mb-10 max-w-xl mx-auto">
            KleverKlues&trade; is more than a platform — it&apos;s a movement to ensure no human feels emotionally alone. Join us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community" className="btn-primary inline-flex items-center justify-center gap-2">
              Join Community <ArrowRight size={16} />
            </Link>
            <Link href="/get-support" className="btn-secondary inline-flex items-center justify-center gap-2">
              Get Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
