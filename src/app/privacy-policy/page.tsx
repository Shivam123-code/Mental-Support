import Link from "next/link";
import { Shield, Lock, ArrowRight } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="chip mb-6 w-fit"><Shield size={14} /> Legal</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">Privacy Policy</h1>
            <p className="text-sm text-[var(--on-surface-variant)] mb-10">Last updated: May 22, 2026</p>

            <div className="prose-custom space-y-8 text-sm text-[var(--on-surface-variant)] leading-relaxed">
              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">1. Introduction</h2>
                <p>KleverKlues&trade; (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">2. Data We Collect</h2>
                <p className="mb-3">We practice minimal data collection. We only collect:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Account information (email, name — optional)</li>
                  <li>• Assessment responses (encrypted)</li>
                  <li>• Session records (encrypted, accessible only to you and your professional)</li>
                  <li>• Journal entries (end-to-end encrypted)</li>
                  <li>• Usage analytics (anonymized)</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">3. How We Use Your Data</h2>
                <ul className="space-y-2 ml-4">
                  <li>• To provide emotional support services</li>
                  <li>• To match you with appropriate professionals</li>
                  <li>• To personalize your wellbeing journey</li>
                  <li>• To improve our platform (anonymized data only)</li>
                  <li>• To ensure safety through crisis detection</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">4. Data Security</h2>
                <p>All personal and emotional data is encrypted using AES-256 encryption. We implement zero-trust security principles, multi-factor authentication, and regular security audits. Your conversations are end-to-end encrypted.</p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">5. Your Rights (DPDP Compliance)</h2>
                <p className="mb-3">Under India&apos;s Digital Personal Data Protection Act, you have the right to:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Access all your personal data</li>
                  <li>• Correct inaccurate data</li>
                  <li>• Delete your account and all data</li>
                  <li>• Export your data in portable format</li>
                  <li>• Withdraw consent at any time</li>
                  <li>• File a grievance with us or the Data Protection Board</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">6. What We Never Do</h2>
                <ul className="space-y-2 ml-4">
                  <li>• We never sell your personal data</li>
                  <li>• We never share emotional records with employers or insurers</li>
                  <li>• We never use your data for advertising</li>
                  <li>• We never require real identity for support services</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">7. Contact Us</h2>
                <p>For privacy-related questions or to exercise your data rights, contact our Data Protection Officer at privacy@kleverklues.com or visit our <Link href="/trust/data-rights" className="text-[var(--primary)] hover:underline">Data Rights page</Link>.</p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/trust/data-rights" className="btn-primary inline-flex items-center gap-2">Manage Data Rights <ArrowRight size={16} /></Link>
              <Link href="/terms" className="btn-secondary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
