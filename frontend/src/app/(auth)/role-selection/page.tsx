"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Briefcase, Building2, ArrowRight, Shield, Heart,
  Loader2, Truck, Sparkles, Lock, CheckCircle, Globe, Star,
} from "lucide-react";

// ─── Role data ───────────────────────────────────────────────
const roles = [
  {
    id: "individual",
    icon: User,
    emoji: "🧠",
    title: "I Need Support",
    subtitle: "Individual · User",
    description: "Get emotional support, take free assessments, join programs, and connect with verified professionals — privately.",
    features: ["Free mental health assessments", "Book 1-on-1 sessions", "Join support community", "Track your progress"],
    href: "/login/user",
    accentClass: "bg-[var(--primary-fixed)]",
    iconClass: "text-[var(--primary)]",
    glowClass: "shadow-[0_0_40px_-8px_var(--primary-bright)]",
    badgeClass: "bg-[var(--primary-fixed)] text-[var(--primary)]",
    hoverBorder: "hover:border-[var(--primary-bright)]",
    ctaClass: "text-[var(--primary)]",
    tag: "Most Popular",
  },
  {
    id: "professional",
    icon: Briefcase,
    emoji: "🩺",
    title: "I'm a Professional",
    subtitle: "Counsellor · Psychologist · Coach",
    description: "Join our verified network. Grow your practice, manage sessions, and earn while making a meaningful difference.",
    features: ["Get clinically verified", "Manage your calendar", "Grow your client base", "DPDP-compliant tools"],
    href: "/apply-professional",
    accentClass: "bg-[var(--tertiary-fixed)]",
    iconClass: "text-[var(--tertiary)]",
    glowClass: "shadow-[0_0_40px_-8px_var(--tertiary-bright)]",
    badgeClass: "bg-[var(--tertiary-fixed)] text-[var(--tertiary)]",
    hoverBorder: "hover:border-[var(--tertiary-bright)]",
    ctaClass: "text-[var(--tertiary)]",
    tag: "Apply Now",
  },
  {
    id: "enterprise",
    icon: Building2,
    emoji: "🏢",
    title: "For My Organization",
    subtitle: "Enterprise · Institution",
    description: "Workforce wellbeing at scale. Reduce burnout, track engagement, and build resilient teams with custom programs.",
    features: ["Employee Assistance Program", "Burnout risk analytics", "Wellbeing dashboards", "Dedicated account manager"],
    href: "/apply-organization",
    accentClass: "bg-[var(--secondary-fixed)]",
    iconClass: "text-[var(--secondary)]",
    glowClass: "shadow-[0_0_40px_-8px_#567F77]",
    badgeClass: "bg-[var(--secondary-fixed)] text-[var(--secondary)]",
    hoverBorder: "hover:border-[var(--secondary-muted)]",
    ctaClass: "text-[var(--secondary)]",
    tag: "Enterprise",
  },
  {
    id: "vendor",
    icon: Truck,
    emoji: "🚐",
    title: "I'm a Vendor",
    subtitle: "Field Responder · Support Unit",
    description: "Join our emergency dispatch network. Get real-time SOS alerts and coordinate on-ground support when it matters most.",
    features: ["Real-time SOS dispatch", "GPS coordination", "Live case tracking", "Direct admin coordination"],
    href: "/login/vendor",
    accentClass: "bg-orange-50",
    iconClass: "text-orange-600",
    glowClass: "shadow-[0_0_40px_-8px_#f97316]",
    badgeClass: "bg-orange-50 text-orange-700",
    hoverBorder: "hover:border-orange-400",
    ctaClass: "text-orange-600",
    tag: "Responder",
  },
  {
    id: "admin",
    icon: Shield,
    emoji: "🛡️",
    title: "Platform Admin",
    subtitle: "Administrator · Safety Team",
    description: "Monitor platform health, verify professionals, oversee clinical governance, and manage safety escalations.",
    features: ["System analytics", "Safety escalations", "Verification center", "Audit & compliance"],
    href: "/login/admin",
    accentClass: "bg-indigo-50",
    iconClass: "text-indigo-600",
    glowClass: "shadow-[0_0_40px_-8px_#6366f1]",
    badgeClass: "bg-indigo-50 text-indigo-700",
    hoverBorder: "hover:border-indigo-400",
    ctaClass: "text-indigo-600",
    tag: "Secure Access",
  },
];

const signInLinks = [
  { label: "User", href: "/login/user", color: "text-[var(--primary)]" },
  { label: "Professional", href: "/login/professional", color: "text-[var(--tertiary)]" },
  { label: "Enterprise", href: "/login/enterprise", color: "text-[var(--secondary)]" },
  { label: "Vendor", href: "/login/vendor", color: "text-orange-600" },
  { label: "Admin", href: "/login/admin", color: "text-indigo-600" },
];

const trustTags = [
  { icon: "🕶️", label: "Anonymous Mode" },
  { icon: "✅", label: "Verified Professionals" },
  { icon: "🆘", label: "24×7 Crisis Support" },
  { icon: "🔒", label: "DPDP & Privacy Ready" },
  { icon: "🌐", label: "Multilingual" },
  { icon: "🤖", label: "AI-Assisted Guidance" },
];

// ─── Framer variants ──────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } as any,
};

// custom-prop variant — Variants type doesn't support function values, cast accordingly
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
} as Variants;

// ─── Role Card ───────────────────────────────────────────────
function RoleCard({ role, index }: { role: typeof roles[0]; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <Link
        href={role.href}
        className={`group relative flex flex-col h-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl ${role.hoverBorder} ${role.glowClass} hover:border-opacity-100`}
      >
        {/* Tag badge */}
        <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${role.badgeClass}`}>
          {role.tag}
        </span>

        {/* Icon */}
        <div className={`w-14 h-14 ${role.accentClass} rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
          <role.icon size={26} className={role.iconClass} />
        </div>

        {/* Text */}
        <h2 className="text-lg font-bold text-[var(--on-surface)] mb-1 leading-snug">
          {role.title}
        </h2>
        <p className="text-[11px] text-[var(--on-surface-variant)] font-semibold uppercase tracking-widest mb-3">
          {role.subtitle}
        </p>
        <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed mb-5 flex-1">
          {role.description}
        </p>

        {/* Features */}
        <ul className="space-y-1.5 mb-6">
          {role.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-[var(--on-surface-variant)]">
              <CheckCircle size={12} className={`${role.iconClass} flex-shrink-0`} />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={`flex items-center gap-2 text-sm font-bold mt-auto ${role.ctaClass} group-hover:gap-3 transition-all duration-300`}>
          Get Started
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────
export default function RoleSelection() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/");
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--surface-container-low)] via-[var(--surface)] to-[var(--surface-container-lowest)] flex flex-col">

      {/* ── Decorative background glows (same as homepage hero) ── */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--primary-bright)]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--tertiary-bright)]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Hero header ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 pt-14 sm:pt-20 pb-10 text-center px-6"
      >
        {/* Pill badge */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0 }} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-[var(--outline-variant)] rounded-full text-xs font-semibold text-[var(--primary)] bg-[var(--surface-container-low)]/70 backdrop-blur-sm">
            <Sparkles size={12} className="text-[var(--primary-bright)]" />
            Human Wellbeing Ecosystem
          </span>
        </motion.div>

        {/* Logo + wordmark */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }} className="flex items-center justify-center gap-2.5 mb-6">
          <img src="/logo.jpg" alt="KleverKlues" width={40} height={40} className="rounded-xl object-contain shadow-sm" />
          <span className="text-xl font-display font-semibold text-[var(--on-surface)]">KleverKlues&trade;</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[var(--on-surface)] leading-[1.1] tracking-tight max-w-3xl mx-auto mb-4"
        >
          Who are you here{" "}
          <span className="font-serif italic font-normal text-[var(--primary-bright)]">today?</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="text-base sm:text-lg text-[var(--on-surface-variant)] max-w-xl mx-auto leading-relaxed"
        >
          Choose the option that best describes you. Private, secure, and judgment-free from the very first step.
        </motion.p>
      </motion.div>

      {/* ── Role cards grid ── */}
      <div className="relative z-10 flex-1 px-5 sm:px-8 pb-10 max-w-[1280px] w-full mx-auto">

        {/* Top 3 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">
          {roles.slice(0, 3).map((role, i) => (
            <RoleCard key={role.id} role={role} index={i} />
          ))}
        </div>

        {/* Bottom 2 — centred */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
          {roles.slice(3).map((role, i) => (
            <div key={role.id} className="w-full sm:max-w-[400px]">
              <RoleCard role={role} index={i + 3} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Trust tag strip (same capsule row as homepage) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.7, ease: "easeOut" }}
        className="relative z-10 px-6 pt-4 pb-6"
      >
        <div className="max-w-[1280px] mx-auto border-t border-[var(--outline-variant)]/30 pt-6">
          <div className="flex flex-wrap justify-center gap-3">
            {trustTags.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--outline-variant)]/60 rounded-full text-xs font-semibold text-[var(--on-surface-variant)] bg-white/40 backdrop-blur-sm hover:bg-white/70 hover:text-[var(--primary)] hover:border-[var(--primary-bright)]/40 transition-all cursor-default"
              >
                <span>{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Sign-in links ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="relative z-10 text-center pb-10 px-5"
      >
        <p className="text-sm text-[var(--on-surface-variant)] mb-3">Already have an account?</p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold">
          {signInLinks.map((link, i) => (
            <span key={link.href} className="flex items-center gap-5">
              <Link href={link.href} className={`${link.color} hover:underline underline-offset-2`}>
                {link.label} Sign In
              </Link>
              {i < signInLinks.length - 1 && <span className="text-[var(--outline-variant)]">·</span>}
            </span>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
