import Link from "next/link";
import { Target, Zap, Heart, Users, Trophy, Star, ArrowRight } from "lucide-react";

const missions = [
  { title: "Kindness Wave", desc: "Send 100 encouragement messages to community members this week", progress: "72%", icon: Heart },
  { title: "Wellness Challenge", desc: "Complete 7-day mindfulness streak with 500 others", progress: "45%", icon: Zap },
  { title: "Mentor Match", desc: "Help 50 new members find their first mentor", progress: "88%", icon: Users },
  { title: "Story Sharing", desc: "Inspire others — 200 healing stories shared this month", progress: "63%", icon: Star },
  { title: "Community Growth", desc: "Welcome and onboard 1,000 new members", progress: "91%", icon: Trophy },
  { title: "Gratitude Flood", desc: "Post 500 gratitude notes on the community wall", progress: "56%", icon: Target },
];

export default function CommunityMissions() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Target size={14} /> Collective Impact</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Community Missions</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Join forces with the community to achieve meaningful goals. Every contribution counts toward our collective wellbeing.
          </p>
        </div>
      </section>

      {/* Missions */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((m) => (
              <div key={m.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                    <m.icon className="text-[var(--primary)]" size={20} />
                  </div>
                  <span className="text-sm font-semibold text-[var(--primary)]">{m.progress}</span>
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{m.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{m.desc}</p>
                <div className="mt-4 w-full bg-[var(--surface-container-low)] rounded-full h-2">
                  <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: m.progress }} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/community" className="btn-primary inline-flex items-center gap-2">
              View All Missions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
