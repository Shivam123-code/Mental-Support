import Link from "next/link";
import { FileText, Shield, Lock, CheckCircle, ArrowRight, Download, Trash2, Eye } from "lucide-react";

export default function DataRights() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="chip mb-6 w-fit"><FileText size={14} /> Your Data Rights</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">Your Data, Your Rights</h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] mb-10">
              At KleverKlues&trade;, you have complete control over your data. Here&apos;s what you can do.
            </p>

            <div className="space-y-6">
              {[
                { icon: Eye, title: "Right to Access", desc: "View all personal data we hold about you at any time through your dashboard." },
                { icon: Download, title: "Right to Export", desc: "Download all your data (assessments, journal entries, session notes) in a portable format." },
                { icon: Trash2, title: "Right to Delete", desc: "Permanently delete your account and all associated data. This action is irreversible." },
                { icon: Lock, title: "Right to Privacy", desc: "Use anonymous mode for any service. We never require real identity for emotional support." },
                { icon: Shield, title: "Right to Consent", desc: "Every data collection point requires your explicit, informed consent. No hidden tracking." },
                { icon: FileText, title: "Right to Transparency", desc: "Know exactly what data we collect, why we collect it, and how it's used — in plain language." },
              ].map((item) => (
                <div key={item.title} className="card flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--on-surface)] mb-1">{item.title}</h3>
                    <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 card !bg-[var(--surface-container)]">
              <h3 className="font-semibold text-[var(--on-surface)] mb-3">DPDP Compliance</h3>
              <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
                KleverKlues&trade; is fully compliant with the Digital Personal Data Protection Act (DPDP), 2023 — India&apos;s comprehensive data protection law. We implement all required safeguards including purpose limitation, data minimization, and storage limitation.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">Manage My Data <ArrowRight size={16} /></Link>
              <Link href="/trust" className="btn-secondary">Back to Trust Center</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
