import Link from "next/link";
import { Heart, Users, Star, Award, TrendingUp, ArrowRight, Sparkles, Gift, Target } from "lucide-react";

const contributions = [
  { icon: Heart, title: "Encourage Others", desc: "Send words of support to community members going through tough times." },
  { icon: Gift, title: "Sponsor Sessions", desc: "Fund therapy sessions for those who can't afford professional support." },
  { icon: Users, title: "Mentor Students", desc: "Guide young people through academic stress and emotional challenges." },
  { icon: Star, title: "Join Missions", desc: "Participate in community wellbeing missions and campaigns." },
  { icon: Target, title: "Help Elderly", desc: "Provide companionship and emotional support to senior citizens." },
  { icon: Sparkles, title: "Share Your Story", desc: "Inspire others by sharing your healing journey (anonymously if preferred)." },
];

const badges = [
  { name: "First Step", desc: "Completed first assessment", emoji: "🌱" },
  { name: "Supporter", desc: "Encouraged 5 community members", emoji: "💪" },
  { name: "Mentor", desc: "Mentored someone for 4 weeks", emoji: "🎓" },
  { name: "Sponsor", desc: "Sponsored a session for someone", emoji: "🎁" },
  { name: "Streak Master", desc: "30-day wellbeing streak", emoji: "🔥" },
  { name: "Community Hero", desc: "100+ positive interactions", emoji: "🦸" },
  { name: "Healer", desc: "Shared your healing story", emoji: "🌈" },
  { name: "Ambassador", desc: "Referred 10+ people to the platform", emoji: "🌍" },
];

export default function Impact() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--primary)] text-white overflow-hidden py-16 sm:py-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium mb-6">
            Help Someone Today
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Your Human Impact Score reflects how you contribute to collective wellbeing. Every act of kindness counts.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/10 rounded-xl border border-white/20">
            <Award size={28} className="text-[var(--tertiary-bright)]" />
            <div className="text-left">
              <p className="text-2xl font-display font-medium">Human Impact Score</p>
              <p className="text-xs text-white/50">Based on community contribution, mentorship, and positive participation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Ways to Make an Impact</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Every contribution matters. Here&apos;s how you can help humanity heal.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {contributions.map((item) => (
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

      {/* Badges & Recognition */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Earn Recognition</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Earn badges as you contribute to the community. Celebrate your growth.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.name} className="card !p-4 text-center hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl block mb-2">{badge.emoji}</span>
                <h3 className="font-semibold text-[var(--on-surface)] text-xs sm:text-sm mb-1">{badge.name}</h3>
                <p className="text-[10px] sm:text-xs text-[var(--on-surface-variant)]">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Viral Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Spread Positivity</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {["Healing Stories", "Emotional Milestones", "Gratitude Walls", "Wellbeing Streaks", "Community Missions", "Support Badges"].map((item) => (
              <div key={item} className="card !p-4 sm:!p-6 text-center">
                <p className="font-semibold text-[var(--on-surface)] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-gap bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Start Making an Impact</h2>
          <p className="text-[var(--on-surface-variant)] mb-8">Join the movement. Every small act of kindness creates a ripple of wellbeing.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/community" className="btn-primary inline-flex items-center gap-2">Join Community <ArrowRight size={16} /></Link>
            <Link href="/gratitude-wall" className="btn-secondary">Visit Gratitude Wall</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
