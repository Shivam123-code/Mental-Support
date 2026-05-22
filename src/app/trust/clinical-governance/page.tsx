import Link from "next/link";
import { Shield, Eye, Award, ClipboardCheck, Users, ArrowRight } from "lucide-react";

const principles = [
  { title: "Clinical Oversight", desc: "Every care pathway is designed and reviewed by licensed clinical professionals", icon: Eye },
  { title: "Professional Supervision", desc: "Regular peer supervision and clinical auditing for all practitioners", icon: Users },
  { title: "Quality Standards", desc: "Evidence-based protocols aligned with international best practices", icon: Award },
  { title: "Continuous Improvement", desc: "Ongoing clinical audits, outcome tracking, and protocol refinement", icon: ClipboardCheck },
  { title: "Ethical Framework", desc: "Strict ethical guidelines governing all practitioner-client interactions", icon: Shield },
  { title: "Outcome Monitoring", desc: "Systematic tracking of therapeutic outcomes to ensure effective care", icon: ClipboardCheck },
];

export default function ClinicalGovernance() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Shield size={14} /> Trust & Safety</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Clinical Governance</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Our clinical governance framework ensures the highest standards of care, professional accountability, and continuous quality improvement.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => (
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
            <Link href="/professionals" className="btn-primary inline-flex items-center gap-2">
              Meet Our Professionals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
