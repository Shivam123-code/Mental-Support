import Link from "next/link";
import { Heart, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const support = [
  { label: "Get Support",       href: "/get-support" },
  { label: "Assessments",       href: "/assessments" },
  { label: "Programs",          href: "/programs" },
  { label: "Find Professional", href: "/professionals" },
  { label: "Crisis Support",    href: "/sos" },
  { label: "Book Session",      href: "/book-session" },
  { label: "AI Companion",      href: "/ai-companion" },
  { label: "Journal",           href: "/journal" },
];

const platform = [
  { label: "Community",         href: "/community" },
  { label: "Enterprise",        href: "/enterprise" },
  { label: "Academy",           href: "/academy" },
  { label: "Resources",         href: "/resources" },
  { label: "About Us",          href: "/about" },
  { label: "Trust Center",      href: "/trust" },
  { label: "Join as Pro",       href: "/careers" },
  { label: "Pricing",           href: "/pricing" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms",          href: "/terms" },
  { label: "Trust Center",   href: "/trust" },
  { label: "Contact",        href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)]">

      {/* ── CTA Banner — compact horizontal strip ── */}
      <div
        className="relative overflow-hidden py-10"
        style={{ background: "linear-gradient(135deg, var(--primary) 0%, #0d5c55 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                You&apos;re Not Alone.
              </h2>
              <p className="text-white/70 text-sm">
                Take the first step towards emotional wellbeing. We&apos;re here for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link href="/assessments"
                className="px-5 py-2.5 bg-white text-[var(--primary)] font-semibold rounded-full text-sm hover:bg-white/90 transition-all inline-flex items-center gap-1.5">
                Start Assessment <ArrowRight size={14} />
              </Link>
              <Link href="/book-session"
                className="px-5 py-2.5 bg-white/15 border border-white/25 text-white font-semibold rounded-full text-sm hover:bg-white/25 transition-all">
                Book Session
              </Link>
              <Link href="/sos"
                className="px-5 py-2.5 bg-red-500/80 text-white font-semibold rounded-full text-sm hover:bg-red-500 transition-all">
                SOS 🆘
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 lg:gap-10">

          {/* Brand — col 1 */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className="font-display text-xl font-bold text-white mb-2">KleverKlues&trade;</h3>
            <p className="text-white/50 text-xs leading-relaxed mb-4 max-w-[240px]">
              The World&apos;s Most Trusted Human Wellbeing &amp; Emotional Support Ecosystem. Built for humanity.
            </p>
            <p className="text-xs text-white/30 italic font-display mb-5">&ldquo;Humanity, Connected.&rdquo;</p>

            {/* Contact */}
            <div className="space-y-2">
              {[
                { icon: Mail,   text: "support@kleverklues.com" },
                { icon: Phone,  text: "+91-XXXX-XXXX" },
                { icon: MapPin, text: "India (Global)" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-white/45">
                  <Icon size={12} className="text-[var(--primary-fixed-dim)] flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-[10px] font-bold text-[var(--primary-fixed-dim)] uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {support.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-xs text-white/55 hover:text-[var(--primary-fixed-dim)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-[10px] font-bold text-[var(--primary-fixed-dim)] uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              {platform.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-xs text-white/55 hover:text-[var(--primary-fixed-dim)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter/Legal */}
          <div>
            <h4 className="text-[10px] font-bold text-[var(--primary-fixed-dim)] uppercase tracking-widest mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-white/45 mb-3 leading-relaxed">
              Get wellbeing tips &amp; updates weekly.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 min-w-0 bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary-fixed-dim)] transition-colors"
              />
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-bright)] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex-shrink-0">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/30">
            &copy; 2025 KleverKlues&trade;. All rights reserved. Better Humans. Better World.
          </p>
          <div className="flex items-center gap-5">
            {legal.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-[11px] text-white/35 hover:text-[var(--primary-fixed-dim)] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-white/25 flex items-center gap-1">
            Made with <Heart size={10} className="text-[var(--tertiary-bright)]" /> for Humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
