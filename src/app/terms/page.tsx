import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function Terms() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="chip mb-6 w-fit"><FileText size={14} /> Legal</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">Terms of Service</h1>
            <p className="text-sm text-[var(--on-surface-variant)] mb-10">Last updated: May 22, 2026</p>

            <div className="space-y-8 text-sm text-[var(--on-surface-variant)] leading-relaxed">
              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using KleverKlues&trade;, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">2. Platform Purpose</h2>
                <p>KleverKlues&trade; provides emotional wellbeing support, not medical treatment. Our services complement but do not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.</p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">3. User Accounts</h2>
                <ul className="space-y-2 ml-4">
                  <li>• You must be 13 years or older to use KleverKlues&trade;</li>
                  <li>• Users under 18 require parental/guardian consent</li>
                  <li>• You are responsible for maintaining account security</li>
                  <li>• Anonymous accounts are permitted for all services</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">4. Acceptable Use</h2>
                <p className="mb-3">You agree NOT to:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Harass, abuse, or harm other users</li>
                  <li>• Impersonate professionals or other users</li>
                  <li>• Share harmful or triggering content without warnings</li>
                  <li>• Use the platform for illegal activities</li>
                  <li>• Attempt to access other users&apos; data</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">5. Payments & Subscriptions</h2>
                <ul className="space-y-2 ml-4">
                  <li>• Free tier is available with no credit card required</li>
                  <li>• Paid subscriptions can be cancelled anytime</li>
                  <li>• Refunds are available within 7 days of purchase</li>
                  <li>• Session cancellations must be made 4+ hours in advance</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">6. Intellectual Property</h2>
                <p>All content, design, and technology on KleverKlues&trade; is owned by us. User-generated content (journal entries, community posts) remains owned by users. By posting in community spaces, you grant us a license to display that content.</p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">7. Limitation of Liability</h2>
                <p>KleverKlues&trade; provides emotional support tools and does not guarantee specific outcomes. We are not liable for decisions made based on platform content. In crisis situations, always contact emergency services directly.</p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">8. Changes to Terms</h2>
                <p>We may update these terms periodically. Users will be notified of significant changes via email and in-app notification. Continued use after changes constitutes acceptance.</p>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-3">9. Contact</h2>
                <p>Questions about these terms? Contact us at legal@kleverklues.com or visit our <Link href="/contact" className="text-[var(--primary)] hover:underline">Contact page</Link>.</p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="btn-primary inline-flex items-center gap-2">Privacy Policy <ArrowRight size={16} /></Link>
              <Link href="/trust" className="btn-secondary">Trust Center</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
