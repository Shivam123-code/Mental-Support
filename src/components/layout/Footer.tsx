import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)]">
      {/* CTA Banner */}
      <div className="relative overflow-hidden bg-[var(--primary)] py-16">
        {/* Orbit decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
          <h2 className="text-headline-lg text-white mb-4">
            You&apos;re Not Alone.
          </h2>
          <p className="text-body-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Take the first step towards emotional wellbeing. We&apos;re here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/assessments" className="px-6 py-3.5 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all">
              Start Assessment
            </Link>
            <Link href="/community" className="px-6 py-3.5 bg-white/15 text-white font-semibold rounded-lg hover:bg-white/25 transition-all border border-white/20">
              Join Community
            </Link>
            <Link href="/book-session" className="px-6 py-3.5 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
              Book Session
            </Link>
            <Link href="/sos" className="px-6 py-3.5 bg-[var(--error)] text-white font-semibold rounded-lg hover:bg-[var(--on-error-container)] transition-all">
              SOS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-medium text-white mb-4">KleverKlues&trade;</h3>
            <p className="text-[var(--inverse-on-surface)]/60 mb-4 max-w-sm text-sm leading-relaxed">
              The World&apos;s Most Trusted Human Wellbeing & Emotional Support Ecosystem. Built for humanity.
            </p>
            <p className="text-sm text-[var(--inverse-on-surface)]/40 italic font-display">
              &ldquo;Humanity, Connected.&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-label-bold text-[var(--primary-fixed-dim)] uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/get-support" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Get Support</Link></li>
              <li><Link href="/assessments" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Assessments</Link></li>
              <li><Link href="/programs" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Programs</Link></li>
              <li><Link href="/professionals" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Find Professional</Link></li>
              <li><Link href="/sos" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Crisis Support</Link></li>
              <li><Link href="/book-session" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Book Session</Link></li>
              <li><Link href="/ai-companion" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">AI Companion</Link></li>
              <li><Link href="/journal" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Journal</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-label-bold text-[var(--primary-fixed-dim)] uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/community" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Community</Link></li>
              <li><Link href="/enterprise" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Enterprise</Link></li>
              <li><Link href="/academy" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Academy</Link></li>
              <li><Link href="/resources" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Resources</Link></li>
              <li><Link href="/about" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">About Us</Link></li>
              <li><Link href="/trust" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Trust Center</Link></li>
              <li><Link href="/careers" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Join as Professional</Link></li>
              <li><Link href="/pricing" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">FAQ</Link></li>
              <li><Link href="/impact" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Impact</Link></li>
              <li><Link href="/research" className="text-[var(--inverse-on-surface)]/70 hover:text-[var(--primary-fixed-dim)] transition-colors">Research</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-label-bold text-[var(--primary-fixed-dim)] uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-[var(--primary-fixed-dim)]" />
                <span className="text-[var(--inverse-on-surface)]/70">support@kleverklues.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-[var(--primary-fixed-dim)]" />
                <span className="text-[var(--inverse-on-surface)]/70">+91-XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={14} className="text-[var(--primary-fixed-dim)]" />
                <span className="text-[var(--inverse-on-surface)]/70">India (Global)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--inverse-on-surface)]/40">
            &copy; 2025 KleverKlues&trade;. All rights reserved. Better Humans. Better World.
          </p>
          <div className="flex items-center gap-6 text-xs text-[var(--inverse-on-surface)]/40">
            <Link href="/privacy-policy" className="hover:text-[var(--primary-fixed-dim)] cursor-pointer transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--primary-fixed-dim)] cursor-pointer transition-colors">Terms</Link>
            <Link href="/trust" className="hover:text-[var(--primary-fixed-dim)] cursor-pointer transition-colors">Trust Center</Link>
            <Link href="/contact" className="hover:text-[var(--primary-fixed-dim)] cursor-pointer transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-[var(--inverse-on-surface)]/30 flex items-center gap-1.5">
            Made with <Heart size={11} className="text-[var(--tertiary-bright)]" /> for Humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
