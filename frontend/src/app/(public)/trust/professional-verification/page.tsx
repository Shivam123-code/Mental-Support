import Link from "next/link";
import { ShieldCheck, FileSearch, UserCheck, Eye, ArrowRight } from "lucide-react";

const steps = [
  { step: "01", title: "Credential Check", desc: "Verification of degrees, licenses, and professional certifications from accredited institutions", icon: FileSearch },
  { step: "02", title: "Background Check", desc: "Comprehensive background screening including criminal records and professional misconduct history", icon: ShieldCheck },
  { step: "03", title: "Clinical Review", desc: "Panel review of clinical competency, therapeutic approach, and specialization areas", icon: UserCheck },
  { step: "04", title: "Ongoing Monitoring", desc: "Continuous quality assurance through outcome tracking, peer reviews, and client feedback", icon: Eye },
];

export default function ProfessionalVerification() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><ShieldCheck size={14} /> Verification</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Professional Verification</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Every professional on KleverKlues undergoes a rigorous 4-step verification process to ensure you receive safe, qualified care.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-display font-bold text-[var(--primary)]">{s.step}</span>
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                    <s.icon className="text-[var(--primary)]" size={20} />
                  </div>
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/professionals" className="btn-primary inline-flex items-center gap-2">
              Browse Verified Professionals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
