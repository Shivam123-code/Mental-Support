import Link from "next/link";
import { GraduationCap, Users, Heart, Sparkles, Target, ArrowRight } from "lucide-react";

const features = [
  { title: "Find a Mentor", desc: "Get matched with an experienced guide who has walked a similar path", icon: Users },
  { title: "Become a Mentor", desc: "Share your journey and help others navigate their challenges", icon: Heart },
  { title: "Smart Matching", desc: "AI-powered matching based on experience, goals, and communication style", icon: Sparkles },
  { title: "Structured Programs", desc: "Guided mentorship paths with milestones and check-ins", icon: Target },
  { title: "Safe Boundaries", desc: "Clear guidelines and moderation to protect both mentors and mentees", icon: GraduationCap },
  { title: "Growth Tracking", desc: "Track progress, celebrate wins, and measure mutual impact", icon: Target },
];

export default function Mentorship() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><GraduationCap size={14} /> Guided Growth</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Mentorship Program</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Connect with someone who&apos;s been where you are. Our mentorship program pairs you with experienced guides for meaningful growth.
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
            <Link href="/role-selection" className="btn-primary inline-flex items-center gap-2">
              Join the Program <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
