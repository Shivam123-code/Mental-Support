import Link from "next/link";
import { AlertTriangle, Phone, Shield, Clock, Heart, CheckCircle, ArrowRight, MessageCircle } from "lucide-react";

export default function CrisisPolicy() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="chip mb-6 w-fit"><AlertTriangle size={14} /> Crisis & Safety Policy</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">Crisis & Safety Policy</h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] mb-10">
              KleverKlues&trade; is committed to protecting every user in moments of crisis. This policy outlines how we respond to emergencies and ensure safety.
            </p>

            <div className="space-y-8">
              <div className="card">
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-4 flex items-center gap-3">
                  <Clock size={20} className="text-[var(--error)]" /> 24/7 Crisis Response
                </h2>
                <ul className="space-y-3 text-sm text-[var(--on-surface-variant)]">
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Round-the-clock crisis support via chat, call, and callback</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />All crisis responders are clinically supervised</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Automatic escalation to local emergency services when needed</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Region-based escalation to ensure culturally appropriate support</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-4 flex items-center gap-3">
                  <Shield size={20} className="text-[var(--primary)]" /> Safety Protocols
                </h2>
                <ul className="space-y-3 text-sm text-[var(--on-surface-variant)]">
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Personalized safety planning for at-risk users</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Case management for ongoing crisis situations</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Clinical supervision of all crisis interactions</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Mandatory incident reporting and review processes</li>
                  <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />Child safety systems with enhanced protections for minors</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-4 flex items-center gap-3">
                  <Phone size={20} className="text-[var(--secondary)]" /> Emergency Guidance
                </h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-4">If you or someone you know is in immediate danger:</p>
                <div className="bg-[var(--error-container)] rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-[var(--on-error-container)]">Call 112 (India Emergency) or your local emergency number immediately.</p>
                </div>
                <p className="text-sm text-[var(--on-surface-variant)]">For non-emergency crisis support, use our <Link href="/sos" className="text-[var(--primary)] font-medium hover:underline">SOS page</Link> for 24/7 assistance.</p>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-[var(--on-surface)] mb-4 flex items-center gap-3">
                  <Heart size={20} className="text-[var(--tertiary)]" /> Our Commitment
                </h2>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
                  Every crisis interaction is treated with the utmost seriousness, compassion, and professionalism. We continuously improve our crisis response systems based on outcomes, feedback, and best practices in mental health crisis care.
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/sos" className="btn-primary inline-flex items-center gap-2">Go to SOS Page <ArrowRight size={16} /></Link>
              <Link href="/trust" className="btn-secondary">Back to Trust Center</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
