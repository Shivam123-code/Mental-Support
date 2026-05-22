"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Shield, CheckCircle, Send, ArrowRight } from "lucide-react";

export default function ReportConcern() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="chip mb-6 w-fit"><AlertTriangle size={14} /> Report a Concern</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">Report a Safety Concern</h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] mb-4">
              If you&apos;ve witnessed or experienced something unsafe on KleverKlues&trade;, please report it immediately. Every report is reviewed by our safety team.
            </p>

            <div className="bg-[var(--error-container)] rounded-xl p-4 sm:p-5 mb-10">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[var(--on-error-container)] mb-1">In immediate danger?</p>
                  <p className="text-xs text-[var(--on-error-container)]">Call 112 (India Emergency) or go to our <Link href="/sos" className="underline font-medium">SOS page</Link> for immediate crisis support.</p>
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="card text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-2">Report Submitted</h3>
                <p className="text-[var(--on-surface-variant)] text-sm max-w-md mx-auto">
                  Thank you for reporting. Our safety team will review this within 24 hours. If you&apos;re in danger, please contact emergency services.
                </p>
                <Link href="/" className="btn-primary inline-flex items-center gap-2 mt-8">Return Home <ArrowRight size={16} /></Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div>
                  <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Type of Concern</label>
                  <select required className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all text-sm">
                    <option value="">Select type...</option>
                    <option>Inappropriate behavior by a professional</option>
                    <option>Community safety concern</option>
                    <option>Privacy violation</option>
                    <option>Child safety concern</option>
                    <option>Abusive content or messaging</option>
                    <option>Platform vulnerability</option>
                    <option>Other safety concern</option>
                  </select>
                </div>

                <div>
                  <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Describe What Happened</label>
                  <textarea rows={5} required placeholder="Please describe the concern in detail. Include dates, usernames, or any relevant information..." className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all text-sm resize-none" />
                </div>

                <div>
                  <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Your Email (Optional)</label>
                  <input type="email" placeholder="For follow-up (optional — you can report anonymously)" className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all text-sm" />
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--on-surface-variant)]">
                  <Shield size={14} className="text-[var(--primary)]" />
                  <span>Reports are confidential. Anonymous reporting is supported.</span>
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                  <Send size={16} /> Submit Report
                </button>
              </form>
            )}

            <div className="mt-12">
              <Link href="/trust" className="btn-secondary inline-flex items-center gap-2">
                Back to Trust Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
