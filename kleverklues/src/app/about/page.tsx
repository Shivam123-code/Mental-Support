import Image from "next/image";
import Link from "next/link";
import { Heart, Globe, Shield, Brain, Users, Sparkles, ArrowRight, Target, Eye, Lightbulb } from "lucide-react";

const values = [
  { icon: Heart, title: "Human First", desc: "Every decision starts with human wellbeing. Technology serves people, not the other way around." },
  { icon: Shield, title: "Trust & Safety", desc: "We build with safety at the core. Privacy, ethics, and trust are non-negotiable." },
  { icon: Brain, title: "Emotional Intelligence", desc: "We design for emotional safety, reducing stigma and creating psychologically safe experiences." },
  { icon: Users, title: "Community Care", desc: "Collective wellbeing matters. We foster positive human connection and mutual support." },
  { icon: Globe, title: "Global Accessibility", desc: "Mental wellness support should be accessible to everyone, everywhere, in their language." },
  { icon: Sparkles, title: "Continuous Growth", desc: "We believe in lifelong emotional growth, not just crisis intervention." },
];

const timeline = [
  { phase: "Phase 1", title: "Trust Foundation", desc: "Website, Assessments, Professionals, Sessions, SOS, Trust Center", status: "current" },
  { phase: "Phase 2", title: "Engagement & Retention", desc: "Programs, Communities, Daily Engagement, AI, Academy, Enterprise", status: "upcoming" },
  { phase: "Phase 3", title: "Ecosystem Expansion", desc: "AI Companion, Emotional Economy, Creator Ecosystem, Research Institute", status: "future" },
  { phase: "Phase 4", title: "Global Leadership", desc: "Global Partnerships, Government Alliances, International Expansion", status: "future" },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Better Humans. <span className="text-gradient">Better World.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-lg">
                KleverKlues is building the Human Wellbeing Layer for the Digital World — a connected ecosystem where people can heal, grow, connect, and thrive.
              </p>
              <p className="text-gray-600 max-w-lg">
                We&apos;re not just another therapy app or wellness portal. We&apos;re creating a new category: <strong>Human Wellbeing Infrastructure Platform</strong>.
              </p>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=550&h=450&fit=crop"
                alt="People connected and supporting each other"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our <span className="text-gradient">Story</span></h2>
          </div>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p>
              Humanity is becoming digitally connected but emotionally disconnected. Stress, loneliness, burnout, anxiety, emotional suppression, relationship struggles, and mental fatigue are increasing globally.
            </p>
            <p>
              Many people do not know where to seek help. They fear judgment. They feel emotionally isolated. They silently struggle without support.
            </p>
            <p className="text-xl font-semibold text-gray-900">
              KleverKlues exists to change this.
            </p>
            <p>
              We&apos;re designed to create safe emotional spaces, trusted human support, intelligent wellbeing guidance, emotionally positive communities, and meaningful human connection.
            </p>
            <p className="text-lg font-medium text-purple-700 italic">
              &ldquo;Better Humans Create Better Families, Better Workplaces, Better Societies, and a Better World.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Purpose */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <Target className="text-purple-600 mb-4" size={36} />
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To help create a world where no human feels emotionally alone. To provide safe, trusted, emotionally intelligent support for everyone, everywhere.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <Eye className="text-purple-600 mb-4" size={36} />
              <h3 className="text-xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the world&apos;s most trusted Human Wellbeing & Emotional Support Ecosystem — the emotional backbone of the digital world.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <Lightbulb className="text-purple-600 mb-4" size={36} />
              <h3 className="text-xl font-bold mb-4">Our Purpose</h3>
              <p className="text-gray-600">
                To improve human wellbeing at scale. To help people heal, grow, connect, learn, and contribute — safely, privately, and meaningfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-gradient">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <value.icon className="text-purple-600 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform <span className="text-gradient">Pillars</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: "Trust & Safety", desc: "Privacy-first, clinical governance, verified professionals", emoji: "🛡️" },
              { title: "Guided Wellbeing", desc: "Assessments, programs, sessions, care plans", emoji: "🧭" },
              { title: "Human Connection", desc: "Communities, mentorship, peer support", emoji: "🤝" },
              { title: "Emotional Economy", desc: "Learn, earn, mentor, contribute", emoji: "💡" },
              { title: "AI & Intelligence", desc: "Smart insights, recommendations, predictions", emoji: "🧠" },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <span className="text-3xl block mb-3">{pillar.emoji}</span>
                <h3 className="font-semibold mb-2">{pillar.title}</h3>
                <p className="text-xs text-gray-600">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-gradient">Journey</span></h2>
          </div>
          <div className="space-y-6">
            {timeline.map((item) => (
              <div key={item.phase} className={`flex gap-4 p-6 rounded-2xl border ${item.status === 'current' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === 'current' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  <span className="text-xs font-bold">{item.phase.split(' ')[1]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{item.title}</h3>
                    {item.status === 'current' && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Movement */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-700 to-purple-500 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-xl text-purple-200 italic mb-4">&ldquo;Humanity, Connected.&rdquo;</p>
          <p className="text-purple-100 mb-8">
            KleverKlues is more than a platform — it&apos;s a movement to improve human wellbeing globally. Join us in building a world where no one feels emotionally alone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/community" className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
              Join Community
            </Link>
            <Link href="/get-support" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
              Get Support <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
