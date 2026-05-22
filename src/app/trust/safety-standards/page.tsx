import Link from "next/link";
import { Shield, Lock, AlertTriangle, MessageSquare, Users, Ban, ArrowRight } from "lucide-react";

const standards = [
  { title: "Platform Safety", desc: "End-to-end encryption, secure data storage, and strict access controls", icon: Lock },
  { title: "Crisis Protocols", desc: "Immediate escalation paths for users in crisis with 24/7 response teams", icon: AlertTriangle },
  { title: "Community Guidelines", desc: "Clear behavioral standards ensuring respectful and supportive interactions", icon: MessageSquare },
  { title: "Content Moderation", desc: "AI-assisted and human-reviewed content moderation for all community spaces", icon: Shield },
  { title: "User Protection", desc: "Anti-harassment tools, blocking, reporting, and anonymous participation options", icon: Users },
  { title: "Zero Tolerance", desc: "Immediate action against harmful behavior, exploitation, or abuse", icon: Ban },
];

export default function SafetyStandards() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Shield size={14} /> Safety First</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Safety Standards</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Your safety is non-negotiable. We maintain rigorous standards to protect every member of our community.
          </p>
        </div>
      </section>

      {/* Standards */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {standards.map((s) => (
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
            <Link href="/sos" className="btn-primary inline-flex items-center gap-2">
              Emergency Support <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
