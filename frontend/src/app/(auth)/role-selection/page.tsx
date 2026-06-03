"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { User, Briefcase, Building2, ArrowRight, Shield, Heart, Loader2, Truck } from "lucide-react";

// Top row — 3 primary user-facing roles
const primaryRoles = [
  {
    id: "individual",
    icon: User,
    title: "I Need Support",
    subtitle: "Individual / User",
    description: "Get emotional support, take assessments, join programs, and connect with verified professionals.",
    features: ["Free assessments", "Book sessions", "Join community", "Track progress"],
    href: "/login/user",
    color: "bg-[var(--primary-fixed)]",
    iconColor: "text-[var(--primary)]",
    borderHover: "hover:border-[var(--primary-bright)]",
  },
  {
    id: "professional",
    icon: Briefcase,
    title: "I'm a Professional",
    subtitle: "Counsellor / Psychologist / Coach",
    description: "Join our network of verified professionals. Help others while growing your practice.",
    features: ["Get verified", "Manage sessions", "Grow your practice", "Earn respectfully"],
    href: "/apply-professional",
    color: "bg-[var(--tertiary-fixed)]",
    iconColor: "text-[var(--tertiary)]",
    borderHover: "hover:border-[var(--tertiary-bright)]",
  },
  {
    id: "admin",
    icon: Shield,
    title: "Platform Admin",
    subtitle: "Administrator / Safety Team",
    description: "Monitor platform health, verify professionals, oversee clinical governance, and audit safety logs.",
    features: ["System analytics", "Safety escalations", "Consultant verification", "Manage resources"],
    href: "/login/admin",
    color: "bg-indigo-50 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderHover: "hover:border-indigo-500",
  },
];

// Bottom row — 2 organisational roles, centred
const orgRoles = [
  {
    id: "enterprise",
    icon: Building2,
    title: "For My Organization",
    subtitle: "Enterprise / Institution",
    description: "Workforce wellbeing solutions. Reduce burnout, improve engagement, build resilient teams.",
    features: ["Employee Assistance", "Burnout analytics", "Wellbeing dashboards", "Custom programs"],
    href: "/apply-organization",
    color: "bg-[var(--secondary-fixed)]",
    iconColor: "text-[var(--secondary)]",
    borderHover: "hover:border-[var(--secondary-muted)]",
  },
  {
    id: "vendor",
    icon: Truck,
    title: "I'm a Vendor",
    subtitle: "Field Responder / Support Unit",
    description: "Join our emergency dispatch network. Get alerted when someone nearby needs urgent on-ground support.",
    features: ["Real-time SOS alerts", "GPS dispatch", "Case tracking", "Direct coordination"],
    href: "/login/vendor",
    color: "bg-orange-50 dark:bg-orange-950/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderHover: "hover:border-orange-500",
  },
];

function RoleCard({ role }: { role: (typeof primaryRoles)[0] }) {
  return (
    <Link
      href={role.href}
      className={`card group ${role.borderHover} hover:-translate-y-1 transition-all duration-300 flex flex-col`}
    >
      <div className={`w-14 h-14 ${role.color} rounded-2xl flex items-center justify-center mb-5`}>
        <role.icon size={26} className={role.iconColor} />
      </div>
      <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-1 group-hover:text-[var(--primary)] transition-colors">
        {role.title}
      </h2>
      <p className="text-xs text-[var(--on-surface-variant)] mb-3 font-medium uppercase tracking-wide">
        {role.subtitle}
      </p>
      <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed mb-5 flex-1">
        {role.description}
      </p>
      <ul className="space-y-2 mb-6">
        {role.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-[var(--on-surface-variant)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-bright)]" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 text-[var(--primary)] font-semibold text-sm mt-auto group-hover:gap-3 transition-all">
        Continue <ArrowRight size={14} />
      </div>
    </Link>
  );
}

export default function RoleSelection() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-[var(--surface)] flex flex-col">
      {/* Header */}
      <div className="pt-12 sm:pt-16 pb-8 sm:pb-12 text-center px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src="/logo.jpg" alt="KleverKlues" width={36} height={36} className="object-contain" />
          <span className="text-lg font-display font-medium text-[var(--on-surface)]">KleverKlues&trade;</span>
        </div>
        <h1 className="text-headline-lg text-[var(--on-surface)] mb-3">
          How would you like to use KleverKlues&trade;?
        </h1>
        <p className="text-body-lg text-[var(--on-surface-variant)] max-w-xl mx-auto">
          Choose the option that best describes you. You can always change this later.
        </p>
      </div>

      {/* Role Cards — 2-row layout */}
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="w-full max-w-6xl space-y-6">

          {/* Row 1: 3 primary roles */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {primaryRoles.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>

          {/* Row 2: 2 organisational roles, centred */}
          <div className="flex justify-center gap-4 sm:gap-6">
            {orgRoles.map((role) => (
              <div key={role.id} className="w-full max-w-sm">
                <RoleCard role={role} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="pb-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--on-surface-variant)]">
        <span className="flex items-center gap-1.5">
          <Shield size={13} className="text-[var(--primary)]" />
          100% Private & Secure
        </span>
        <span className="flex items-center gap-1.5">
          <Heart size={13} className="text-[var(--primary)]" />
          No Judgment, Ever
        </span>
        <span className="flex items-center gap-1.5">
          <User size={13} className="text-[var(--primary)]" />
          Anonymous Mode Available
        </span>
      </div>

      {/* Sign-in links */}
      <div className="text-center pb-10 text-sm text-[var(--on-surface-variant)] space-y-3 px-4">
        <p>Already have an account? Choose your sign in portal:</p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <Link href="/login/user" className="text-[var(--primary)] hover:underline">User Sign In</Link>
          <span>&bull;</span>
          <Link href="/login/professional" className="text-[var(--tertiary)] hover:underline">Professional Sign In</Link>
          <span>&bull;</span>
          <Link href="/login/enterprise" className="text-[var(--secondary)] hover:underline">Enterprise Sign In</Link>
          <span>&bull;</span>
          <Link href="/login/vendor" className="text-orange-600 hover:underline">Vendor Sign In</Link>
          <span>&bull;</span>
          <Link href="/login/admin" className="text-indigo-600 hover:underline">Admin Sign In</Link>
        </div>
      </div>
    </div>
  );
}
