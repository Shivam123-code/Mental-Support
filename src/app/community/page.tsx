import Image from "next/image";
import Link from "next/link";
import { Users, Heart, Shield, Star, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const communityGroups = [
  { name: "Student Wellness", members: "2.5K+", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop", description: "Support for academic stress and student life" },
  { name: "Startup Founders", members: "1.2K+", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop", description: "Navigating entrepreneurial stress and burnout" },
  { name: "Parenting Support", members: "3.1K+", image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop", description: "A safe space for parents to grow together" },
  { name: "Grief Healing", members: "1.8K+", image: "https://images.unsplash.com/photo-1516534775068-ba3e7a1d2dad?w=400&h=300&fit=crop", description: "Compassionate community for processing loss" },
  { name: "Men's Wellness", members: "2.0K+", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", description: "Breaking stigma — men supporting men" },
  { name: "Women Leadership", members: "1.5K+", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=300&fit=crop", description: "Empowering women leaders with resilience" },
  { name: "Relationship Healing", members: "2.2K+", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop", description: "Rebuilding trust and healing relationships" },
  { name: "Senior Wellbeing", members: "900+", image: "https://images.unsplash.com/photo-1447005497901-b3e9ee359928?w=400&h=300&fit=crop", description: "Connection and support for seniors" },
];

const features = [
  { icon: Users, title: "Support Circles", desc: "Join guided groups for shared healing" },
  { icon: Heart, title: "Peer Encouragement", desc: "Give and receive emotional support" },
  { icon: MessageCircle, title: "Guided Communities", desc: "Expert-moderated safe spaces" },
  { icon: Star, title: "Gratitude Sharing", desc: "Celebrate wins and spread positivity" },
  { icon: Sparkles, title: "Healing Journeys", desc: "Follow transformation stories" },
  { icon: Shield, title: "Safe & Moderated", desc: "Human-moderated positive spaces" },
];


export default function Community() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-20 left-[5%] w-[250px] h-[250px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="chip mb-6"><Users size={14} /> Humanity, Connected.</div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                You&apos;re Part of Something <span className="text-gradient">Bigger</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-10 max-w-lg">
                Join a safe, moderated, emotionally positive community where you can connect, heal, and grow with people who understand.
              </p>
              <Link href="/community" className="btn-primary inline-flex items-center gap-2">
                Join Community <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hidden lg:block">
              <Image src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=550&h=450&fit=crop" alt="Community" width={550} height={450} className="rounded-xl shadow-ambient" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Community Features</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Safe, moderated, emotionally positive support ecosystem.</p>
          </div>
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
        </div>
      </section>

      {/* Groups */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Find Your Circle</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Join communities built around shared experiences.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityGroups.map((g) => (
              <div key={g.name} className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden border-hairline hover:shadow-ambient-hover transition-all duration-300 group cursor-pointer">
                <div className="relative h-40 overflow-hidden">
                  <Image src={g.image} alt={g.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3"><p className="text-white text-xs font-medium">{g.members} members</p></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-1">{g.name}</h3>
                  <p className="text-xs text-[var(--on-surface-variant)]">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Someone */}
      <section className="section-gap bg-[var(--surface-container-low)] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Help Someone Today</h2>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto mb-12">Earn your Human Impact Score by contributing positively.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ label: "Encourage Others", icon: "💪" }, { label: "Sponsor Sessions", icon: "🎁" }, { label: "Mentor Students", icon: "🎓" }, { label: "Join Missions", icon: "🌟" }].map((item) => (
              <div key={item.label} className="card text-center">
                <span className="text-3xl block mb-3">{item.icon}</span>
                <p className="font-medium text-[var(--on-surface)] text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}