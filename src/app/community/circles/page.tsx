import Link from "next/link";
import { Users, Heart, MessageCircle, Shield, Sparkles, Clock, ArrowRight } from "lucide-react";

const circles = [
  { title: "Anxiety Support", desc: "Weekly guided sessions for managing anxiety", members: "1.8K+", icon: Heart },
  { title: "Grief & Loss", desc: "Compassionate space for processing loss", members: "950+", icon: Heart },
  { title: "Work Stress", desc: "Navigate burnout and workplace challenges", members: "2.3K+", icon: Users },
  { title: "Relationship Healing", desc: "Build healthier connection patterns", members: "1.4K+", icon: MessageCircle },
  { title: "Self-Discovery", desc: "Explore identity, values, and purpose", members: "1.1K+", icon: Sparkles },
  { title: "Mindfulness Practice", desc: "Daily meditation and present-moment awareness", members: "2.7K+", icon: Clock },
];

export default function SupportCircles() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Users size={14} /> Peer Support</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Support Circles</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Join guided groups where you can share, listen, and heal alongside others who truly understand. Every circle is moderated by trained facilitators.
          </p>
        </div>
      </section>

      {/* Circles */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {circles.map((c) => (
              <div key={c.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                    <c.icon className="text-[var(--primary)]" size={20} />
                  </div>
                  <span className="text-xs text-[var(--on-surface-variant)] bg-[var(--surface-container-low)] px-3 py-1 rounded-full">{c.members}</span>
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/community" className="btn-primary inline-flex items-center gap-2">
              Browse All Circles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
