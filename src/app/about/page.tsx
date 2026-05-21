import Image from "next/image";
import Link from "next/link";
import { Heart, Globe, Shield, Brain, Users, Sparkles, ArrowRight, Target, Eye, Lightbulb } from "lucide-react";

const values = [
  { icon: Heart, title: "Human First", desc: "Every decision starts with human wellbeing. Technology serves people." },
  { icon: Shield, title: "Trust & Safety", desc: "Privacy, ethics, and trust are non-negotiable foundations." },
  { icon: Brain, title: "Emotional Intelligence", desc: "We design for emotional safety, reducing stigma always." },
  { icon: Users, title: "Community Care", desc: "Collective wellbeing through positive human connection." },
  { icon: Globe, title: "Global Accessibility", desc: "Mental wellness support accessible to everyone, everywhere." },
  { icon: Sparkles, title: "Continuous Growth", desc: "Lifelong emotional growth, not just crisis intervention." },
];

const timeline = [
  { phase: "Phase 1", title: "Trust Foundation", desc: "Website, Assessments, Professionals, Sessions, SOS, Trust Center", status: "current" },
  { phase: "Phase 2", title: "Engagement & Retention", desc: "Programs, Communities, Daily Engagement, AI, Academy, Enterprise", status: "upcoming" },
  { phase: "Phase 3", title: "Ecosystem Expansion", desc: "AI Companion, Emotional Economy, Creator Ecosystem, Research", status: "future" },
  { phase: "Phase 4", title: "Global Leadership", desc: "Global Partnerships, Government Alliances, International Expansion", status: "future" },
];


export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-20 right-[10%] w-[350px] h-[350px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Better Humans. <span className="text-gradient">Better World.</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-6 max-w-lg">
                KleverKlues&trade; is building the Human Wellbeing Layer for the Digital World — a connected ecosystem where people can heal, grow, connect, and thrive.
              </p>
              <p className="text-[var(--on-surface-variant)] max-w-lg">
                We&apos;re creating a new category: <strong className="text-[var(--on-surface)]">Human Wellbeing Infrastructure Platform</strong>.
              </p>
            </div>
            <div className="hidden lg:block">
              <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=550&h=450&fit=crop" alt="People connected" width={550} height={450} className="rounded-xl shadow-ambient" />
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-10 text-center">Our Story</h2>
          <div className="space-y-6 text-[var(--on-surface-variant)] text-body-lg leading-relaxed">
            <p>Humanity is becoming digitally connected but emotionally disconnected. Stress, loneliness, burnout, anxiety, and mental fatigue are increasing globally.</p>
            <p>Many people do not know where to seek help. They fear judgment. They feel emotionally isolated. They silently struggle without support.</p>
            <p className="text-xl font-display font-medium text-[var(--on-surface)]">KleverKlues&trade; exists to change this.</p>
            <p>We create safe emotional spaces, trusted human support, intelligent wellbeing guidance, emotionally positive communities, and meaningful human connection.</p>
            <p className="font-display italic text-[var(--primary)] text-lg">&ldquo;Better Humans Create Better Families, Better Workplaces, Better Societies, and a Better World.&rdquo;</p>
          </div>
        </div>
      </section>

      {/* Mission Vision Purpose */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Our Mission", text: "To help create a world where no human feels emotionally alone." },
              { icon: Eye, title: "Our Vision", text: "To become the world's most trusted Human Wellbeing & Emotional Support Ecosystem." },
              { icon: Lightbulb, title: "Our Purpose", text: "To improve human wellbeing at scale — safely, privately, and meaningfully." },
            ].map((i) => (
              <div key={i.title} className="card">
                <div className="w-12 h-12 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5"><i.icon className="text-[var(--primary)]" size={24} /></div>
                <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-3">{i.title}</h3>
                <p className="text-[var(--on-surface-variant)] leading-relaxed">{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-12 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5"><v.icon className="text-[var(--primary)]" size={20} /></div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-12 text-center">Platform Pillars</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: "Trust & Safety", desc: "Privacy-first, clinical governance", emoji: "🛡️" },
              { title: "Guided Wellbeing", desc: "Assessments, programs, sessions", emoji: "🧭" },
              { title: "Human Connection", desc: "Communities, mentorship, peers", emoji: "🤝" },
              { title: "Emotional Economy", desc: "Learn, earn, mentor, contribute", emoji: "💡" },
              { title: "AI & Intelligence", desc: "Smart insights & predictions", emoji: "🧠" },
            ].map((p) => (
              <div key={p.title} className="card text-center">
                <span className="text-3xl block mb-3">{p.emoji}</span>
                <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Roadmap */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-12 text-center">Our Journey</h2>
          <div className="space-y-6">
            {timeline.map((t) => (
              <div key={t.phase} className={`flex gap-5 p-6 rounded-xl border ${t.status === 'current' ? 'bg-[var(--primary-fixed)]/30 border-[var(--primary-fixed-dim)]' : 'bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]'}`}>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${t.status === 'current' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'}`}>
                  <span className="text-xs font-bold">{t.phase.split(' ')[1]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[var(--on-surface)]">{t.title}</h3>
                    {t.status === 'current' && <span className="text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  <p className="text-sm text-[var(--on-surface-variant)] mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Movement CTA */}
      <section className="py-24 bg-[var(--primary)] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-headline-lg mb-4">Join the Movement</h2>
          <p className="text-xl text-white/50 italic font-display mb-4">&ldquo;Humanity, Connected.&rdquo;</p>
          <p className="text-white/60 mb-10">KleverKlues&trade; is more than a platform — it&apos;s a movement to improve human wellbeing globally.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/community" className="px-8 py-4 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all">Join Community</Link>
            <Link href="/get-support" className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all inline-flex items-center gap-2">Get Support <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}