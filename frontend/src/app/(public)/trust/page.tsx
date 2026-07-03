"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield, Lock, Eye, Brain, Users, FileText,
  AlertTriangle, CheckCircle, Heart, ArrowRight,
} from "lucide-react";

const trustFeatures = [
  { icon: Lock,          title: "Privacy-First Architecture",  desc: "End-to-end encryption, minimal data collection, and user-controlled privacy at every step.",                       color: "#dbeafe", iconColor: "#1d4ed8" },
  { icon: Shield,        title: "Clinical Governance",         desc: "All services are overseen by qualified clinical professionals with regular supervision.",                           color: "#d1fae5", iconColor: "#065f46" },
  { icon: Brain,         title: "Ethical AI Framework",        desc: "AI assists but never replaces human judgment. Non-diagnostic, transparent, and supervised.",                        color: "#ede9fe", iconColor: "#7c3aed" },
  { icon: CheckCircle,   title: "Professional Verification",   desc: "Every professional undergoes rigorous qualification checks, background verification, and ongoing review.",          color: "#ccfbf1", iconColor: "#0f766e" },
  { icon: Users,         title: "Community Safety",            desc: "Human-moderated spaces with clear guidelines, reporting tools, and swift intervention.",                            color: "#fce7f3", iconColor: "#be185d" },
  { icon: Heart,         title: "Child Safety Systems",        desc: "Enhanced protections for minors including parental controls and specialized safeguards.",                           color: "#fef3c7", iconColor: "#b45309" },
  { icon: AlertTriangle, title: "Incident Management",         desc: "24/7 incident response with clear escalation paths and resolution tracking.",                                       color: "#fee2e2", iconColor: "#dc2626" },
  { icon: Eye,           title: "Transparency Reports",        desc: "Regular public reporting on safety metrics, moderation actions, and platform health.",                             color: "#f0fdf4", iconColor: "#15803d" },
];

const policies = [
  { title: "Trust & Privacy Policy",     desc: "How we protect and handle your data",              icon: Lock,          href: "/privacy-policy"         },
  { title: "Crisis & Safety Policy",     desc: "Our crisis response protocols and systems",        icon: AlertTriangle, href: "/trust/crisis-policy"     },
  { title: "Your Data Rights",           desc: "Access, export, or delete your data anytime",     icon: FileText,      href: "/trust/data-rights"       },
  { title: "Ethical AI Policy",          desc: "How we develop and deploy AI responsibly",         icon: Brain,         href: "/trust/ethical-ai"        },
  { title: "Safety Standards",           desc: "Platform-wide safety requirements and protocols",  icon: Shield,        href: "/trust"                   },
  { title: "Clinical Governance",        desc: "How clinical oversight works on our platform",     icon: Heart,         href: "/trust"                   },
  { title: "Professional Verification",  desc: "Our rigorous vetting and monitoring process",      icon: CheckCircle,   href: "/trust"                   },
  { title: "Report a Concern",           desc: "Flag safety issues or provide feedback",           icon: Eye,           href: "/trust/report-concern"    },
];

const securitySpecs = [
  { label: "Data Encryption",   value: "AES-256"    },
  { label: "Authentication",    value: "Multi-Factor"},
  { label: "Security Model",    value: "Zero-Trust"  },
  { label: "Audit Logging",     value: "Complete"    },
  { label: "Threat Monitoring", value: "24/7 Active" },
  { label: "Compliance",        value: "DPDP Ready"  },
];

const dataRights = [
  "Anonymous mode available for all services",
  "End-to-end encrypted conversations",
  "Export your data anytime",
  "Delete your account and all data permanently",
  "Consent-driven interactions only",
  "DPDP (India) compliance ready",
  "No selling of personal data — ever",
];

function FeatureCard({ feature, index }: { feature: typeof trustFeatures[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const Icon = feature.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative rounded-2xl p-6 overflow-hidden cursor-default hover:-translate-y-1 transition-transform duration-300"
      style={{ backgroundColor: feature.color }}
    >
      <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center mb-4 shadow-sm">
        <Icon size={20} style={{ color: feature.iconColor }} />
      </div>
      <h3 className="font-bold text-sm mb-2" style={{ color: feature.iconColor }}>{feature.title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: feature.iconColor + "aa" }}>{feature.desc}</p>
    </motion.div>
  );
}

export default function Trust() {
  return (
    <div>

      {/* ── HERO: dark teal with shield watermark ── */}
      <section
        className="relative overflow-hidden py-24 lg:py-36"
        style={{ background: "linear-gradient(135deg,#0a2e2b 0%,#0d3d38 60%,#0a2e2b 100%)" }}
      >
        {/* Giant shield watermark */}
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none hidden lg:block">
          <Shield size={520} className="text-white" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/20 blur-[100px] pointer-events-none -translate-y-1/2" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-white/30 text-xs mb-8"
          >
            <span>Platform</span><span>/</span><span className="text-white/60">Trust & Safety Center</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 text-white/60 text-xs font-bold uppercase tracking-widest mb-5"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <Shield size={11} /> Trust & Safety Center
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-white leading-[1.05] mb-6"
              >
                Your Safety is<br />
                <span style={{ background: "linear-gradient(90deg,#93d2cc,#b8e8e4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Our Foundation
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="text-white/55 text-lg max-w-lg leading-relaxed"
              >
                Trust isn&apos;t just a feature — it&apos;s the foundation everything is built on. Explore how we protect you at every level.
              </motion.p>
            </div>

            {/* Right — 4 quick-stat pills */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { val: "AES-256",   label: "Encryption"       },
                { val: "Zero-Trust",label: "Security Model"   },
                { val: "24/7",      label: "Incident Response"},
                { val: "DPDP",      label: "Compliance Ready" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  className="rounded-2xl p-5 text-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <p className="text-2xl font-bold text-white leading-none mb-1">{s.val}</p>
                  <p className="text-white/45 text-xs">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW WE KEEP YOU SAFE — colour-block mosaic ── */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Multi-Layer Protection</p>
            <h2 className="text-3xl lg:text-4xl font-display font-medium text-[var(--on-surface)]">How We Keep You Safe</h2>
            <p className="text-[var(--on-surface-variant)] mt-2 max-w-xl">Multiple layers of protection work together to create a truly safe environment.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustFeatures.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── DATA SECURITY — split layout ── */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* Left checklist */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-4">\\ Data Rights</p>
              <h2 className="text-3xl lg:text-4xl font-display font-medium text-[var(--on-surface)] mb-4">Your Data, Your Control</h2>
              <p className="text-[var(--on-surface-variant)] mb-8 leading-relaxed">
                We believe in minimal data collection, maximum transparency, and complete user control.
              </p>
              <ul className="space-y-3">
                {dataRights.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="flex items-start gap-3 text-sm text-[var(--on-surface-variant)]"
                  >
                    <CheckCircle size={16} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right — spec table */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-xl"
              style={{ background: "linear-gradient(135deg,#0a2e2b,#0d3d38)" }}
            >
              <div className="px-8 py-6 border-b border-white/10">
                <p className="text-white font-bold text-sm flex items-center gap-2"><Shield size={14} className="text-[var(--primary-fixed)]" /> Security Specifications</p>
              </div>
              <div className="p-8 space-y-5">
                {securitySpecs.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-center justify-between pb-5 border-b border-white/8 last:border-0 last:pb-0"
                  >
                    <span className="text-white/50 text-sm">{item.label}</span>
                    <span className="text-sm font-bold px-3 py-1 rounded-full"
                      style={{ background: "rgba(147,210,204,0.15)", color: "#93d2cc" }}>
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── POLICIES — horizontal scrollable link cards ── */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-2">\\ Full Transparency</p>
              <h2 className="text-3xl lg:text-4xl font-display font-medium text-[var(--on-surface)]">Policies & Resources</h2>
              <p className="text-[var(--on-surface-variant)] mt-2">Read our policies and know your rights.</p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {policies.map((policy, i) => {
              const Icon = policy.icon;
              return (
                <motion.div
                  key={policy.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link
                    href={policy.href}
                    className="group flex flex-col h-full bg-white rounded-2xl p-6 border border-[var(--outline-variant)]/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                      <Icon size={18} className="text-[var(--primary)]" />
                    </div>
                    <h3 className="font-bold text-[var(--on-surface)] text-sm mb-1 group-hover:text-[var(--primary)] transition-colors">{policy.title}</h3>
                    <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed flex-1">{policy.desc}</p>
                    <div className="flex items-center gap-1 mt-4 text-[var(--primary)] text-xs font-semibold group-hover:gap-2 transition-all">
                      Read more <ArrowRight size={11} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA — report concern ── */}
      <section className="section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg,#0a2e2b,#0d3d38)" }}
          >
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.05] hidden lg:block">
              <AlertTriangle size={300} className="text-white" />
            </div>
            <div className="relative z-10 p-10 lg:p-16 lg:max-w-2xl">
              <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-4">\\ Safety First</p>
              <h2 className="text-3xl lg:text-4xl font-display font-medium text-white mb-4">See Something? Say Something.</h2>
              <p className="text-white/55 mb-8 leading-relaxed">
                If you ever feel unsafe or notice concerning behaviour, report it immediately. We investigate every report.
              </p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                Report a Concern
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
