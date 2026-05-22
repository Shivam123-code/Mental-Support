import Link from "next/link";
import { ShieldCheck, Baby, Lock, Eye, UserCheck, AlertTriangle, ArrowRight } from "lucide-react";

const protections = [
  { title: "Age Verification", desc: "Multi-layer age verification to ensure appropriate access and content filtering", icon: UserCheck },
  { title: "Parental Controls", desc: "Parents can monitor activity, set boundaries, and receive safety notifications", icon: Eye },
  { title: "Enhanced Moderation", desc: "Heightened content moderation and monitoring in youth-accessible spaces", icon: ShieldCheck },
  { title: "Safe Matching", desc: "Youth are matched only with specially trained and certified professionals", icon: Baby },
  { title: "Data Protection", desc: "Strict data minimization and enhanced privacy controls for minors", icon: Lock },
  { title: "Mandatory Reporting", desc: "Compliance with all mandatory reporting requirements for child welfare", icon: AlertTriangle },
];

export default function ChildSafety() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Baby size={14} /> Protecting Young Minds</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Child Safety</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            We maintain the highest standards of protection for young users. Every interaction, every space, and every professional is held to enhanced safety requirements.
          </p>
        </div>
      </section>

      {/* Protections */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {protections.map((p) => (
              <div key={p.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5">
                  <p.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{p.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/trust/safety-standards" className="btn-primary inline-flex items-center gap-2">
              View All Safety Standards <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
