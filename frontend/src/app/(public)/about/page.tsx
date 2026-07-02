"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Heart, Globe, Shield, Brain, Users, Sparkles,
  ArrowRight, Target, Eye, Lightbulb,
} from "lucide-react";

/* ─── Marquee ticker data ─── */
const tickerItems = [
  "10K+ People Supported",
  "★  500+ Verified Professionals",
  "★  50+ Guided Programs",
  "★  24/7 Crisis Support",
  "★  100% Confidential",
  "★  6 Languages",
  "★  16K+ Community Members",
  "★  AI-Powered Insights",
];

/* ─── Values ─── */
const values = [
  { icon: Heart,    title: "Human First",            desc: "Every decision starts with human wellbeing.", color: "#fce7f3", iconColor: "#be185d" },
  { icon: Shield,   title: "Trust & Safety",         desc: "Privacy, ethics, and trust are non-negotiable.", color: "#dbeafe", iconColor: "#1d4ed8" },
  { icon: Brain,    title: "Emotional Intelligence", desc: "We design for emotional safety, always.", color: "#ede9fe", iconColor: "#7c3aed" },
  { icon: Users,    title: "Community Care",         desc: "Collective wellbeing through connection.", color: "#d1fae5", iconColor: "#065f46" },
  { icon: Globe,    title: "Global Accessibility",   desc: "Support accessible to everyone, everywhere.", color: "#fef3c7", iconColor: "#b45309" },
  { icon: Sparkles, title: "Continuous Growth",      desc: "Lifelong emotional growth, not just crisis care.", color: "#ccfbf1", iconColor: "#0f766e" },
];

/* ─── Pillars ─── */
const pillars = [
  { num: "01", emoji: "🛡️", title: "Trust & Safety",     desc: "Privacy-first, verified, clinically governed — safety is our infrastructure." },
  { num: "02", emoji: "🧭", title: "Guided Wellbeing",    desc: "Assessments, programs, sessions, and personalised care plans at every step." },
  { num: "03", emoji: "🤝", title: "Human Connection",    desc: "Communities, mentorship, peer circles — healing together is faster." },
  { num: "04", emoji: "💡", title: "Emotional Economy",   desc: "Learn, earn, mentor, contribute — an economy built on emotional value." },
  { num: "05", emoji: "🧠", title: "AI Intelligence",     desc: "Smart insights, early-warning predictions, and hyper-personalised guidance." },
];

/* ─── Roadmap ─── */
const roadmap = [
  { phase: "01", title: "Trust Foundation",        desc: "Website · Assessments · Professionals · Sessions · SOS", status: "current" },
  { phase: "02", title: "Engagement & Retention",  desc: "Programs · Communities · AI · Academy · Enterprise",      status: "upcoming" },
  { phase: "03", title: "Ecosystem Expansion",     desc: "AI Companion · Creator Economy · Research Institute",     status: "future" },
  { phase: "04", title: "Global Leadership",       desc: "Global Partnerships · Government Alliances · TrustOS",    status: "future" },
];

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About() {
  /* Parallax for hero image */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO — full viewport, parallax image,
          diagonal clip at bottom, big statement
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)" }}
      >
        {/* Parallax bg */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <Image src="/images/enterprise-team.png" alt="About KleverKlues" fill
            className="object-cover object-center" priority />
        </motion.div>
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-[#0a2e2b]/80" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pt-24 pb-32 w-full">
          <div className="grid lg:grid-cols-12 gap-8 items-end">

            {/* Left — big label */}
            <div className="lg:col-span-4 hidden lg:flex flex-col justify-end pb-2">
              <motion.p
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[160px] font-display font-bold leading-none select-none"
                style={{ color: "rgba(147,210,204,0.12)", lineHeight: 1 }}
              >
                KK
              </motion.p>
            </div>

            {/* Right — headline */}
            <div className="lg:col-span-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-6"
              >
                — The Bigger Vision
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display font-medium leading-[1.02] text-white mb-8"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
              >
                We&apos;re building the<br />
                <span style={{ background: "linear-gradient(90deg,#93d2cc,#b8e8e4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Human Wellbeing Layer
                </span><br />
                for the Digital World.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-white/55 text-lg max-w-2xl mb-10 leading-relaxed"
              >
                Not a therapy app. Not a meditation tool. A category-defining ecosystem for healing,
                growing, connecting, and thriving — at scale.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/community"
                  className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                  Join the Movement
                </Link>
                <Link href="/get-support"
                  className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all text-sm">
                  Get Support <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MARQUEE TICKER — infinite scroll strip
      ══════════════════════════════════════════ */}
      <div className="py-5 bg-[var(--primary-bright)] overflow-hidden -mt-1">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" as const }}
          className="flex gap-10 whitespace-nowrap"
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-white font-bold text-sm tracking-wide flex-shrink-0">{item}</span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          BRAND STORY — typographic editorial
      ══════════════════════════════════════════ */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left — sticky label */}
            <div className="lg:sticky lg:top-28 self-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-4">\\ Our Story</p>
                <h2 className="text-5xl lg:text-6xl font-display font-medium text-[var(--on-surface)] leading-tight mb-8">
                  Why We<br />Exist
                </h2>
                {/* Pull quote box */}
                <div className="rounded-3xl p-8 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#0a2e2b,#0d3d38)" }}>
                  <div className="absolute top-4 left-6 text-[80px] font-serif leading-none text-white/10 select-none">&ldquo;</div>
                  <p className="relative z-10 text-xl font-display font-medium leading-relaxed"
                    style={{ background: "linear-gradient(90deg,#93d2cc,#b8e8e4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    KleverKlues™ exists to change this.
                  </p>
                  <p className="text-white/50 text-sm mt-3 relative z-10">Our core promise</p>
                </div>
              </motion.div>
            </div>

            {/* Right — body text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-8 pt-2"
            >
              <p className="text-2xl font-display font-medium text-[var(--on-surface)] leading-snug">
                Humanity is becoming{" "}
                <span className="underline decoration-[var(--primary-bright)] decoration-4 underline-offset-4">digitally connected</span>{" "}
                but{" "}
                <span className="underline decoration-rose-400 decoration-4 underline-offset-4">emotionally disconnected</span>.
              </p>
              <p className="text-lg text-[var(--on-surface-variant)] leading-relaxed">
                Stress, loneliness, burnout, anxiety, emotional suppression, relationship struggles,
                and mental fatigue are increasing globally. Many people do not know where to seek help.
                They fear judgment. They feel emotionally isolated.
              </p>
              <div className="h-px w-full bg-[var(--outline-variant)]" />
              <p className="text-lg text-[var(--on-surface-variant)] leading-relaxed">
                We believe:{" "}
                <em className="font-display text-[var(--primary)] not-italic font-semibold text-xl">
                  Better Humans Create Better Families, Better Workplaces, Better Societies, and a Better World.
                </em>
              </p>
              <div className="h-px w-full bg-[var(--outline-variant)]" />
              <p className="text-xs text-[var(--on-surface-variant)] uppercase tracking-widest">— The KleverKlues Team</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION / VISION / PURPOSE
          — angled floating cards on gradient bg
      ══════════════════════════════════════════ */}
      <section className="section-gap overflow-hidden relative"
        style={{ background: "linear-gradient(135deg,#f0faf8 0%,#e8f5f2 55%,#f5faf8 100%)" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary-fixed)]/30 blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-violet-200/40 blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-3">\\ Our Foundation</p>
            <h2 className="text-4xl lg:text-5xl font-display font-medium text-[var(--on-surface)]">What Drives Us</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Target,    title: "Mission", text: "To help create a world where no human feels emotionally alone.", rotate: "-2deg",  delay: 0    },
              { icon: Eye,       title: "Vision",  text: "To become the world's most trusted Human Wellbeing & Emotional Support Ecosystem.", rotate: "1deg",   delay: 0.1  },
              { icon: Lightbulb, title: "Purpose", text: "To improve human wellbeing at scale — safely, privately, meaningfully, globally.", rotate: "-1.5deg", delay: 0.2  },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: item.delay, ease: "easeOut" as const }}
                  whileHover={{ rotate: "0deg", y: -8, transition: { duration: 0.25 } }}
                  className="bg-white rounded-3xl p-8 shadow-xl border border-[var(--outline-variant)]/20 cursor-default"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary-fixed)] flex items-center justify-center mb-6 shadow-sm">
                    <Icon size={26} className="text-[var(--primary)]" />
                  </div>
                  <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-2">{item.title}</p>
                  <p className="text-lg font-medium text-[var(--on-surface)] leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          IMPACT NUMBERS — cinematic dark section
          with giant animated counters
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-14"
        style={{ background: "linear-gradient(135deg,#0a2e2b 0%,#0d3d38 60%,#0a2e2b 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/15 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-2">\\ Impact</p>
            <h2 className="text-2xl lg:text-3xl font-display font-medium text-white">Our Impact So Far</h2>
            <p className="text-white/40 mt-2 text-sm">And we&apos;re just getting started.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {[
              { target: 10, suffix: "K+", label: "People Supported" },
              { target: 500, suffix: "+", label: "Verified Professionals" },
              { target: 50, suffix: "+", label: "Programs" },
              { target: 24, suffix: "/7", label: "Crisis Support" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-5 border-r border-white/8 last:border-r-0"
              >
                <span className="text-4xl lg:text-6xl font-display font-bold text-white leading-none">
                  <Counter target={s.target} suffix={s.suffix} />
                </span>
                <span className="text-white/40 text-xs mt-2 tracking-wide">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PILLARS — large numbered editorial rows
      ══════════════════════════════════════════ */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Platform</p>
            <h2 className="text-4xl lg:text-5xl font-display font-medium text-[var(--on-surface)]">What We&apos;re Building</h2>
            <p className="text-[var(--on-surface-variant)] mt-3 max-w-lg">Five pillars that make KleverKlues™ a category-defining platform.</p>
          </motion.div>

          <div className="space-y-0 divide-y divide-[var(--outline-variant)]/40">
            {pillars.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <motion.div
                  whileHover={{ x: 12, backgroundColor: "rgba(147,210,204,0.06)", transition: { duration: 0.2 } }}
                  className="flex items-center gap-6 lg:gap-10 py-7 px-4 rounded-2xl cursor-default transition-colors group"
                >
                  <span className="text-5xl lg:text-7xl font-display font-bold text-[var(--outline-variant)] group-hover:text-[var(--primary-bright)] transition-colors leading-none w-20 flex-shrink-0">
                    {p.num}
                  </span>
                  <span className="text-3xl flex-shrink-0">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">{p.title}</h3>
                    <p className="text-[var(--on-surface-variant)] text-sm mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                  <ArrowRight size={20} className="text-[var(--outline-variant)] group-hover:text-[var(--primary)] group-hover:translate-x-2 transition-all flex-shrink-0 hidden sm:block" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VALUES — masonry-inspired asymmetric grid
      ══════════════════════════════════════════ */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
          >
            <div>
              <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Values</p>
              <h2 className="text-4xl lg:text-5xl font-display font-medium text-[var(--on-surface)]">Our Values</h2>
            </div>
            <p className="text-[var(--on-surface-variant)] max-w-sm leading-relaxed">
              Six core principles that guide every product decision we make.
            </p>
          </motion.div>

          {/* Row 1 — 1 large + 2 small */}
          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            {/* Large card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-2 rounded-3xl p-8 flex flex-col justify-between min-h-[220px]"
              style={{ backgroundColor: values[0].color }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm mb-6">
                <Heart size={26} style={{ color: values[0].iconColor }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: values[0].iconColor }}>{values[0].title}</h3>
                <p className="text-base leading-relaxed" style={{ color: values[0].iconColor + "cc" }}>{values[0].desc}</p>
              </div>
            </motion.div>

            {/* Small card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="rounded-3xl p-8 flex flex-col justify-between"
              style={{ backgroundColor: values[1].color }}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center mb-5">
                <Shield size={22} style={{ color: values[1].iconColor }} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ color: values[1].iconColor }}>{values[1].title}</h3>
                <p className="text-sm" style={{ color: values[1].iconColor + "bb" }}>{values[1].desc}</p>
              </div>
            </motion.div>
          </div>

          {/* Row 2 — 3 equal */}
          <div className="grid sm:grid-cols-3 gap-5">
            {values.slice(2).map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.09 }}
                  className="rounded-3xl p-7"
                  style={{ backgroundColor: v.color }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center mb-5">
                    <Icon size={22} style={{ color: v.iconColor }} />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: v.iconColor }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: v.iconColor + "bb" }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ROADMAP — horizontal stepper
      ══════════════════════════════════════════ */}
      <section className="section-gap bg-[var(--surface)] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Journey</p>
            <h2 className="text-4xl lg:text-5xl font-display font-medium text-[var(--on-surface)]">Our Roadmap</h2>
          </motion.div>

          {/* Desktop horizontal stepper */}
          <div className="hidden lg:grid grid-cols-4 gap-0 relative">
            {/* Connecting line */}
            <div className="absolute top-[28px] left-[12.5%] right-[12.5%] h-px bg-[var(--outline-variant)] z-0" />

            {roadmap.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center text-center px-4 relative z-10"
              >
                {/* Circle */}
                <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center text-sm font-bold mb-6 shadow-lg ${
                  item.status === "current"
                    ? "bg-[var(--primary-bright)] border-[var(--primary-bright)] text-white"
                    : item.status === "upcoming"
                    ? "bg-white border-[var(--primary)] text-[var(--primary)]"
                    : "bg-white border-[var(--outline-variant)] text-[var(--on-surface-variant)]"
                }`}>
                  {item.phase}
                </div>

                {item.status === "current" && (
                  <span className="text-[10px] font-bold bg-[var(--primary-bright)] text-white px-3 py-0.5 rounded-full mb-3 -mt-3">
                    Live Now
                  </span>
                )}

                <h3 className={`font-bold text-base mb-2 ${item.status === "current" ? "text-[var(--primary)]" : "text-[var(--on-surface)]"}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile vertical */}
          <div className="lg:hidden space-y-4">
            {roadmap.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`flex gap-5 p-5 rounded-2xl border ${
                  item.status === "current"
                    ? "bg-[var(--primary-fixed)]/20 border-[var(--primary-fixed-dim)]"
                    : "bg-[var(--surface-container-lowest)] border-[var(--outline-variant)]"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  item.status === "current" ? "bg-[var(--primary-bright)] text-white" : "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
                }`}>{item.phase}</div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-[var(--on-surface)] text-sm">{item.title}</h3>
                    {item.status === "current" && <span className="text-[10px] bg-[var(--primary-bright)] text-white px-2 py-0.5 rounded-full">Live Now</span>}
                  </div>
                  <p className="text-xs text-[var(--on-surface-variant)]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA — split, image left, text right
      ══════════════════════════════════════════ */}
      <section className="section-gap overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl min-h-[400px]"
          >
            {/* Left — image */}
            <div className="relative hidden lg:block">
              <Image src="/images/community-support.png" alt="Join Movement" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
            </div>

            {/* Right — content */}
            <div className="flex flex-col justify-center p-10 lg:p-16"
              style={{ background: "linear-gradient(135deg,#0a2e2b 0%,#0d3d38 100%)" }}>
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative z-10">
                <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-4">\\ Be Part of It</p>
                <p className="text-2xl lg:text-3xl font-display italic mb-2"
                  style={{ color: "#93d2cc" }}>
                  &ldquo;Humanity, Connected.&rdquo;
                </p>
                <h2 className="text-3xl lg:text-4xl font-display font-medium text-white mb-5 leading-snug">
                  Join the Movement
                </h2>
                <p className="text-white/55 mb-8 leading-relaxed">
                  KleverKlues™ is more than a platform — it&apos;s a movement to ensure no human feels emotionally alone. Join us.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/community"
                    className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                    Join Community
                  </Link>
                  <Link href="/get-support"
                    className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all text-sm">
                    Get Support
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
