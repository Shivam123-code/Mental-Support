import Link from "next/link";
import { Brain, Shield, Users, Eye, AlertTriangle, CheckCircle, ArrowRight, Heart } from "lucide-react";

export default function EthicalAI() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="chip mb-6 w-fit"><Brain size={14} /> Ethical AI Policy</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">Our Ethical AI Commitment</h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] mb-10">
              AI at KleverKlues&trade; is designed to assist — never to replace human judgment, empathy, or clinical expertise.
            </p>

            <div className="space-y-8">
              <div className="card">
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-4">Core AI Principles</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "AI never makes clinical diagnoses",
                    "Human supervision at all times",
                    "Transparent AI interactions (clearly labeled)",
                    "Non-exploitative — no emotional manipulation",
                    "Safety-first — automatic human escalation",
                    "Privacy-preserving — minimal data retention",
                    "Bias monitoring and regular audits",
                    "User consent for all AI interactions",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-[var(--on-surface-variant)]">
                      <CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-4 flex items-center gap-3">
                  <Shield size={20} className="text-[var(--primary)]" /> AI Governance Framework
                </h2>
                <ul className="space-y-4 text-sm text-[var(--on-surface-variant)]">
                  <li><strong className="text-[var(--on-surface)]">Clinical Oversight:</strong> All AI models are reviewed and approved by qualified mental health professionals.</li>
                  <li><strong className="text-[var(--on-surface)]">Safety Boundaries:</strong> AI cannot recommend medication, make diagnoses, or replace professional therapy.</li>
                  <li><strong className="text-[var(--on-surface)]">Escalation Protocol:</strong> AI automatically transfers to human professionals when risk is detected.</li>
                  <li><strong className="text-[var(--on-surface)]">Regular Audits:</strong> Quarterly ethics reviews and bias assessments of all AI systems.</li>
                  <li><strong className="text-[var(--on-surface)]">User Control:</strong> Users can opt out of AI features at any time without losing access to services.</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-4 flex items-center gap-3">
                  <Eye size={20} className="text-[var(--tertiary)]" /> Transparency Standards
                </h2>
                <ul className="space-y-3 text-sm text-[var(--on-surface-variant)]">
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Every AI interaction is clearly labeled as &ldquo;AI-Assisted&rdquo;</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Users are informed when AI is analyzing their data</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />AI recommendations include confidence levels</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Annual transparency report on AI system performance</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/ai-companion" className="btn-primary inline-flex items-center gap-2">Explore AI Features <ArrowRight size={16} /></Link>
              <Link href="/trust" className="btn-secondary">Back to Trust Center</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
