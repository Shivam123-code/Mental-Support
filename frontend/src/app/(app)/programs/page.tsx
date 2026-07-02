"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star, CheckCircle, Sparkles, Trophy } from "lucide-react";
import { slugify } from "@/data/programs";

const programCategories = [
  {
    title: "Emotional Recovery",
    description: "Heal and rebuild your emotional foundation",
    emoji: "💚",
    accent: "#fce7f3",
    programs: [
      { name: "Anxiety Reset", duration: "8 weeks", sessions: 16, image: "/images/anxiety-recovery.png", rating: 4.9 },
      { name: "Emotional Healing", duration: "12 weeks", sessions: 24, image: "/images/get-support.png", rating: 4.8 },
      { name: "Burnout Recovery", duration: "6 weeks", sessions: 12, image: "/images/burnout-reset.png", rating: 4.9 },
      { name: "Confidence Rebuild", duration: "8 weeks", sessions: 16, image: "/images/confidence-building.png", rating: 4.7 },
    ],
  },
  {
    title: "Relationships",
    description: "Strengthen bonds and heal connections",
    emoji: "💞",
    accent: "#ede9fe",
    programs: [
      { name: "Couple Reconnection", duration: "10 weeks", sessions: 20, image: "/images/relationship-healing.png", rating: 4.8 },
      { name: "Marriage Wellbeing", duration: "12 weeks", sessions: 24, image: "/images/relationship-healing.png", rating: 4.9 },
      { name: "Parenting Confidence", duration: "8 weeks", sessions: 16, image: "/images/parenting-confidence.png", rating: 4.8 },
    ],
  },
  {
    title: "Student Programs",
    description: "Academic success and emotional growth",
    emoji: "📚",
    accent: "#bae6fd",
    programs: [
      { name: "Focus Improvement", duration: "4 weeks", sessions: 8, image: "/images/student-focus.png", rating: 4.7 },
      { name: "Exam Confidence", duration: "6 weeks", sessions: 12, image: "/images/student-focus.png", rating: 4.8 },
      { name: "Emotional Resilience", duration: "8 weeks", sessions: 16, image: "/images/assessment-focus.png", rating: 4.9 },
    ],
  },
  {
    title: "Workplace Programs",
    description: "Thrive at work without burning out",
    emoji: "💼",
    accent: "#d1fae5",
    programs: [
      { name: "Leadership Wellbeing", duration: "10 weeks", sessions: 20, image: "/images/enterprise-team.png", rating: 4.8 },
      { name: "Burnout Prevention", duration: "6 weeks", sessions: 12, image: "/images/burnout-reset.png", rating: 4.9 },
      { name: "Workplace EQ", duration: "8 weeks", sessions: 16, image: "/images/community-support.png", rating: 4.7 },
    ],
  },
  {
    title: "Lifestyle Wellness",
    description: "Build healthy habits for lasting wellbeing",
    emoji: "🌿",
    accent: "#ccfbf1",
    programs: [
      { name: "Sleep Recovery", duration: "6 weeks", sessions: 12, image: "/images/sleep-recovery.png", rating: 4.9 },
      { name: "Mindfulness Journey", duration: "8 weeks", sessions: 16, image: "/images/hero-woman.png", rating: 4.8 },
      { name: "Emotional Fitness", duration: "12 weeks", sessions: 24, image: "/images/emotional-fitness.png", rating: 4.8 },
    ],
  },
];

const heroStats = [
  { value: "17+", label: "Programs" },
  { value: "4-12", label: "Wk Duration" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "Expert", label: "Designed" },
];

export default function Programs() {
  return (
    <div>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0faf8 0%, #e8f5f2 55%, #f5faf8 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--primary-fixed)]/25 blur-[130px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-emerald-200/30 blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-4"
              >
                \\ Guided Wellbeing
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06 }}
                className="text-display-xl text-[var(--on-surface)] mb-6 leading-tight"
              >
                Guided Wellbeing{" "}
                <span className="text-gradient">Journeys</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="text-body-lg text-[var(--on-surface-variant)] mb-8 max-w-lg leading-relaxed"
              >
                Structured programs designed by experts to help you heal, grow, and build lasting emotional resilience. Step by step.
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="grid grid-cols-4 gap-3 mb-8"
              >
                {heroStats.map((s) => (
                  <div key={s.label} className="bg-white/70 border border-[var(--outline-variant)]/40 rounded-xl p-3 text-center shadow-sm backdrop-blur-sm">
                    <p className="font-bold text-[var(--on-surface)] text-base leading-none">{s.value}</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)] mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Feature chips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {[
                  { icon: CheckCircle, text: "Expert-Designed" },
                  { icon: Clock, text: "Self-Paced" },
                  { icon: Users, text: "Community Support" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-[var(--outline-variant)]/40 rounded-full text-sm text-[var(--on-surface-variant)] backdrop-blur-sm">
                    <Icon size={14} className="text-[var(--primary)]" />
                    {text}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Link href="#programs" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5">
                    Browse Programs <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — image */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" as const }}
              className="hidden lg:block relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[5/4]">
                <Image
                  src="/images/hero-woman.png"
                  alt="Personal growth journey"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-[var(--outline-variant)]/30 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                  <Trophy size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-bold text-[var(--on-surface)] text-sm leading-none">4.8★ Avg Rating</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">By verified participants</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="absolute -top-4 -right-4 bg-[var(--primary-bright)] text-white rounded-2xl px-4 py-2.5 shadow-lg text-center"
              >
                <p className="text-xl leading-none">🌱</p>
                <p className="text-[10px] font-semibold mt-1">Step by Step</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROGRAM CATEGORIES ── */}
      <section id="programs" className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

          {programCategories.map((category, catIdx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-16 last:mb-0"
            >
              {/* Category header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: category.accent }}
                >
                  {category.emoji}
                </div>
                <div className="flex-1">
                  <h2 className="text-headline-md text-[var(--on-surface)] font-bold">{category.title}</h2>
                  <p className="text-sm text-[var(--on-surface-variant)]">{category.description}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)] bg-white border border-[var(--outline-variant)]/40 rounded-full px-3 py-1.5">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  {category.programs.length} programs
                </div>
              </div>

              {/* Program cards — horizontal image + info */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {category.programs.map((program, i) => (
                  <motion.div
                    key={program.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  >
                    <Link
                      href={`/programs/${slugify(program.name)}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[var(--outline-variant)]/30 shadow-sm hover:shadow-xl transition-all h-full block"
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={program.image}
                          alt={program.name}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Rating badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold text-[var(--on-surface)]">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          {program.rating}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-[var(--on-surface)] mb-2 group-hover:text-[var(--primary)] transition-colors text-sm">
                          {program.name}
                        </h3>

                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-[var(--on-surface-variant)] mb-3">
                          <span className="flex items-center gap-1">
                            <Clock size={11} className="text-[var(--primary)]" />
                            {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles size={11} className="text-[var(--secondary)]" />
                            {program.sessions} sessions
                          </span>
                        </div>

                        <div className="mt-auto flex items-center gap-1.5 text-[var(--primary)] font-semibold text-xs group-hover:gap-3 transition-all">
                          View Program <ArrowRight size={12} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA — Dark immersive ── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d3d38 60%, #0a2e2b 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-4">
              \\ Find Your Path
            </p>
            <h2 className="text-headline-lg text-white mb-4">Not Sure Where to Start?</h2>
            <p className="text-white/65 text-body-lg mb-10 leading-relaxed">
              Take a free assessment and we&apos;ll recommend the perfect program for you.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/assessments"
                className="inline-flex items-center gap-2.5 bg-white text-[var(--primary)] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Take Free Assessment <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
