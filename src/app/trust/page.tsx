import Link from "next/link";
import { Shield, Lock, Eye, Brain, Users, FileText, AlertTriangle, CheckCircle, Heart, ArrowRight } from "lucide-react";

const trustFeatures = [
  { icon: Lock, title: "Privacy-First Architecture", desc: "End-to-end encryption, minimal data collection, and user-controlled privacy at every step." },
  { icon: Shield, title: "Clinical Governance", desc: "All services are overseen by qualified clinical professionals with regular supervision." },
  { icon: Brain, title: "Ethical AI Framework", desc: "AI assists but never replaces human judgment. Non-diagnostic, transparent, and supervised." },
  { icon: CheckCircle, title: "Professional Verification", desc: "Every professional undergoes rigorous qualification checks, background verification, and ongoing review." },
  { icon: Users, title: "Community Safety", desc: "Human-moderated spaces with clear guidelines, reporting tools, and swift intervention." },
  { icon: Heart, title: "Child Safety Systems", desc: "Enhanced protections for minors including parental controls and specialized safeguards." },
  { icon: AlertTriangle, title: "Incident Management", desc: "24/7 incident response with clear escalation paths and resolution tracking." },
  { icon: Eye, title: "Transparency Reports", desc: "Regular public reporting on safety metrics, moderation actions, and platform health." },
];

const policies = [
  { title: "Trust & Privacy Policy", desc: "How we protect and handle your data", icon: Lock, href: "/privacy-policy" },
  { title: "Crisis & Safety Policy", desc: "Our crisis response protocols and systems", icon: AlertTriangle, href: "/trust/crisis-policy" },
  { title: "Your Data Rights", desc: "Access, export, or delete your data anytime", icon: FileText, href: "/trust/data-rights" },
  { title: "Ethical AI Policy", desc: "How we develop and deploy AI responsibly", icon: Brain, href: "/trust/ethical-ai" },
  { title: "Safety Standards", desc: "Platform-wide safety requirements and protocols", icon: Shield, href: "/trust" },
  { title: "Clinical Governance", desc: "How clinical oversight works on our platform", icon: Heart, href: "/trust" },
  { title: "Professional Verification", desc: "Our rigorous vetting and monitoring process", icon: CheckCircle, href: "/trust" },
  { title: "Report a Concern", desc: "Flag safety issues or provide feedback", icon: Eye, href: "/trust/report-concern" },
];

export default function Trust() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[350px] h-[350px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none hidden lg:block" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="chip mx-auto w-fit mb-6">
              <Shield size={14} />
              Trust & Safety Center
            </div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
              Your Safety is Our Foundation
            </h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Trust isn&apos;t just a feature — it&apos;s the foundation everything is built on. Explore how we protect you at every level.
            </p>
          </div>
        </div>
      </section>

      {/* Core Trust Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">How We Keep You Safe</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Multiple layers of protection work together to create a truly safe environment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustFeatures.map((feature) => (
              <div key={feature.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4 sm:mb-5">
                  <feature.icon className="text-[var(--primary)]" size={18} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-2">{feature.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Pages */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Policies & Resources</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Full transparency on how we operate. Read our policies and know your rights.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {policies.map((policy) => (
              <Link key={policy.title} href={policy.href} className="card group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <policy.icon className="text-[var(--primary)] mb-3" size={22} />
                <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-1 group-hover:text-[var(--primary)] transition-colors">{policy.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)]">{policy.desc}</p>
                <ArrowRight size={14} className="text-[var(--primary)] mt-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <h2 className="text-headline-lg text-[var(--on-surface)] mb-6">Your Data, Your Control</h2>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-8">
                We believe in minimal data collection, maximum transparency, and complete user control.
              </p>
              <ul className="space-y-4">
                {[
                  "Anonymous mode available for all services",
                  "End-to-end encrypted conversations",
                  "Export your data anytime",
                  "Delete your account and all data permanently",
                  "Consent-driven interactions only",
                  "DPDP (India) compliance ready",
                  "No selling of personal data — ever",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--on-surface-variant)]">
                    <CheckCircle size={16} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--surface-container)] rounded-xl p-6 sm:p-10 border-hairline">
              <div className="space-y-6">
                {[
                  { label: "Data Encryption", value: "AES-256" },
                  { label: "Authentication", value: "Multi-Factor" },
                  { label: "Security Model", value: "Zero-Trust" },
                  { label: "Audit Logging", value: "Complete" },
                  { label: "Threat Monitoring", value: "24/7 Active" },
                  { label: "Compliance", value: "DPDP Ready" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-[var(--outline-variant)] pb-3 last:border-0">
                    <span className="text-sm text-[var(--on-surface-variant)]">{item.label}</span>
                    <span className="text-sm font-semibold text-[var(--primary)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report CTA */}
      <section className="py-16 sm:py-20 bg-[var(--inverse-surface)] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <Shield className="mx-auto mb-4" size={36} />
          <h2 className="text-headline-lg mb-4">See Something? Say Something.</h2>
          <p className="text-white/60 mb-8">If you ever feel unsafe or notice concerning behaviour, report it immediately. We investigate every report.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--primary-bright)] text-white font-semibold rounded-lg hover:bg-[var(--primary)] transition-all">
            Report a Concern <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
