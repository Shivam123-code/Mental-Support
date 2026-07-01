"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Heart, Brain, Users, Briefcase,
  Baby, Shield, Sparkles, Lock, CheckCircle,
} from "lucide-react";
import SafetyDisclaimer from "@/components/ui/SafetyDisclaimer";

const supportCategories = [
  {
    title: "Emotional Health",
    icon: Heart,
    image: "/images/get-support.png",
    accent: "#fecdd3",
    items: ["Anxiety", "Depression", "Stress", "Trauma", "Panic", "Grief", "Emotional Imbalance"],
  },
  {
    title: "Relationships & Family",
    icon: Users,
    image: "/images/relationship-healing.png",
    accent: "#ede9fe",
    items: ["Couples Support", "Divorce Recovery", "Parenting Support", "Family Conflict", "Single Parenting"],
  },
  {
    title: "Life & Career",
    icon: Briefcase,
    image: "/images/burnout-reset.png",
    accent: "#fed7aa",
    items: ["Career Counselling", "Burnout", "Leadership Stress", "Workplace Pressure", "Interview Anxiety"],
  },
  {
    title: "Children & Teenagers",
    icon: Baby,
    image: "/images/parenting-confidence.png",
    accent: "#bae6fd",
    items: ["ADHD", "Exam Stress", "Emotional Growth", "Learning Challenges", "Behavioural Support"],
  },
  {
    title: "Special Support",
    icon: Shield,
    image: "/images/community-support.png",
    accent: "#fca5a5",
    items: ["Domestic Abuse", "Addiction Recovery", "Crisis Support", "Emotional Trauma"],
  },
  {
    title: "Personal Growth",
    icon: Sparkles,
    image: "/images/confidence-building.png",
    accent: "#99f6e4",
    items: ["Confidence Building", "EQ Development", "Communication Skills", "Focus & Productivity"],
  },
];

const trustPoints = [
  { icon: Lock,        text: "End-to-end encrypted conversations" },
  { icon: Shield,      text: "Anonymous mode — no identity required" },
  { icon: CheckCircle, text: "DPDP compliant, highest ethical standards" },
  { icon: Brain,       text: "You control your data, always" },
];

const quickStats = [
  { value: "10K+", label: "People Supported" },
  { value: "100%", label: "Confidential" },
  { value: "24/7", label: "Available" },
  { value: "Free",  label: "To Start" },
];

export default function GetSupport() {
  return (
    <div>

      {/* ─────────────────────────────────────────
          HERO — Full immersive split card
      ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0faf8 0%, #e6f4f1 60%, #f5faf8 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--primary-fixed)]/25 blur-[130px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--secondary-fixed)]/20 blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT — Content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-4"
              >
                \\ Personalized Support
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06 }}
                className="text-display-xl text-[var(--on-surface)] mb-6 leading-tight"
              >
                Get the{" "}
                <span className="text-gradient">Support</span>{" "}
                You Deserve
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="text-body-lg text-[var(--on-surface-variant)] mb-8 max-w-lg leading-relaxed"
              >
                Whatever you&apos;re going through, you don&apos;t have to face it alone.
                Find the right support for your unique journey.
              </motion.p>

              {/* Quick stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="grid grid-cols-4 gap-3 mb-8"
              >
                {quickStats.map((s) => (
                  <div key={s.label} className="bg-white/70 border border-[var(--outline-variant)]/40 rounded-xl p-3 text-center backdrop-blur-sm shadow-sm">
                    <p className="font-bold text-[var(--on-surface)] text-lg leading-none">{s.value}</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)] mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-wrap gap-3"
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/assessments" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5">
                    Take Assessment <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/professionals" className="btn-secondary inline-flex items-center gap-2 px-6 py-3.5">
                    Find Professional
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — Image with floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="hidden lg:block relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[5/4]">
                <Image
                  src="/images/hero-woman.png"
                  alt="Supportive environment"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-[var(--outline-variant)]/30 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                  <Heart size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-bold text-[var(--on-surface)] text-base leading-none">You&apos;re Safe Here</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Anonymous &amp; Encrypted</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-[var(--primary-bright)] text-white rounded-2xl px-4 py-2.5 shadow-lg text-center"
              >
                <p className="text-xl font-bold leading-none">🌱</p>
                <p className="text-[10px] font-semibold mt-1">Start Healing</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SUPPORT CATEGORIES — Bento image cards
      ───────────────────────────────────────── */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">
              \\ Browse Support Areas
            </p>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
              Explore Support Categories
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Browse our comprehensive support areas designed around real human experiences and challenges.
            </p>
          </motion.div>

          {/* 3-col card grid — image top, content bottom, hover lift */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {supportCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[var(--outline-variant)]/30 transition-all"
                >
                  <Link href="/professionals" className="block">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="(max-width:640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                      {/* Icon + title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-white" />
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">{cat.title}</h3>
                      </div>
                    </div>

                    {/* Items as pill tags */}
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {cat.items.map((item) => (
                          <span
                            key={item}
                            className="text-xs px-2.5 py-1 rounded-full font-medium text-[var(--on-surface-variant)] border border-[var(--outline-variant)]/50"
                            style={{ backgroundColor: cat.accent + "60" }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--primary)] font-semibold text-sm group-hover:gap-3 transition-all">
                        Get Support <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          PRIVACY SECTION — Dark immersive panel
      ───────────────────────────────────────── */}
      <section
        className="section-gap relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d3d38 60%, #0a2e2b 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — Text */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-4">
                \\ Your Privacy is Sacred
              </p>
              <h2 className="text-headline-lg text-white mb-4 leading-tight">
                100% Safe,<br />Private &amp; Anonymous
              </h2>
              <p className="text-white/65 text-body-lg leading-relaxed mb-8">
                All conversations are encrypted. Anonymous mode available. You control your data.
                We follow DPDP compliance and the highest ethical standards.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/assessments"
                  className="inline-flex items-center gap-2.5 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  Start Your Journey — Free &amp; Private
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — Trust points grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trustPoints.map((tp, i) => {
                const Icon = tp.icon;
                return (
                  <motion.div
                    key={tp.text}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="flex flex-col gap-3 p-5 rounded-2xl cursor-default"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(147,210,204,0.2)", border: "1px solid rgba(147,210,204,0.25)" }}
                    >
                      <Icon size={18} style={{ color: "var(--primary-fixed)" }} />
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">{tp.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <section className="py-6 sm:py-8 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <SafetyDisclaimer />
        </div>
      </section>

    </div>
  );
}
