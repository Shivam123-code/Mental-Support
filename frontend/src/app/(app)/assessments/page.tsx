"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain, Heart, Users, Briefcase, TrendingUp,
  Shield, ArrowRight, Clock, CheckCircle, Sparkles, Star,
} from "lucide-react";
import SafetyDisclaimer from "@/components/ui/SafetyDisclaimer";
import { slugify } from "@/data/assessments";

const assessmentCategories = [
  {
    title: "Emotional Wellness",
    icon: Heart,
    color: "from-rose-400/20 to-pink-400/10",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
    assessments: [
      { name: "Anxiety Index",             duration: "5 min", image: "/images/anxiety-recovery.png",     description: "Understand your anxiety patterns and triggers" },
      { name: "Stress Score",              duration: "4 min", image: "/images/burnout-reset.png",         description: "Measure your current stress levels" },
      { name: "Burnout Meter",             duration: "6 min", image: "/images/emotional-fitness.png",    description: "Check if you're heading towards burnout" },
      { name: "Mood Assessment",           duration: "3 min", image: "/images/get-support.png",           description: "Track and understand your emotional state" },
      { name: "Emotional Stability Check", duration: "7 min", image: "/images/hero-woman.png",            description: "Evaluate your emotional regulation skills" },
    ],
  },
  {
    title: "Personality & Potential",
    icon: Brain,
    color: "from-violet-400/20 to-purple-400/10",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    assessments: [
      { name: "Personality Insights", duration: "10 min", image: "/images/confidence-building.png",  description: "Discover your personality traits and strengths" },
      { name: "EQ Assessment",        duration: "8 min",  image: "/images/assessment-focus.png",     description: "Measure your emotional intelligence" },
      { name: "Leadership Style",     duration: "7 min",  image: "/images/enterprise-team.png",      description: "Understand your natural leadership approach" },
      { name: "Communication Style",  duration: "5 min",  image: "/images/community-support.png",    description: "Learn how you connect with others" },
    ],
  },
  {
    title: "Career & Learning",
    icon: Briefcase,
    color: "from-amber-400/20 to-orange-400/10",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    assessments: [
      { name: "Career Aptitude",       duration: "12 min", image: "/images/therapist-session.png",    description: "Find careers that align with your strengths" },
      { name: "Learning Potential",    duration: "8 min",  image: "/images/student-focus.png",        description: "Discover your best learning methods" },
      { name: "Cognitive Strengths",   duration: "10 min", image: "/images/prof-rahul.png",           description: "Map your cognitive abilities" },
      { name: "Productivity Analysis", duration: "6 min",  image: "/images/prof-dr-ananya.png",       description: "Optimise your work patterns" },
    ],
  },
  {
    title: "Relationship & Family",
    icon: Users,
    color: "from-sky-400/20 to-blue-400/10",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-500",
    assessments: [
      { name: "Relationship Wellness",   duration: "8 min",  image: "/images/relationship-healing.png", description: "Evaluate the health of your relationships" },
      { name: "Parenting Style",         duration: "7 min",  image: "/images/parenting-confidence.png", description: "Understand your approach to parenting" },
      { name: "Family Emotional Health", duration: "10 min", image: "/images/prof-kavita.png",           description: "Assess your family's emotional dynamics" },
    ],
  },
  {
    title: "Workplace Wellness",
    icon: TrendingUp,
    color: "from-teal-400/20 to-emerald-400/10",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    assessments: [
      { name: "Burnout Risk",        duration: "5 min",  image: "/images/sleep-recovery.png",       description: "Identify early signs of workplace burnout" },
      { name: "Workforce Wellbeing", duration: "8 min",  image: "/images/community-support.png",    description: "Measure your overall work-life balance" },
      { name: "Leadership EQ",       duration: "10 min", image: "/images/enterprise-team.png",      description: "Assess your leadership emotional intelligence" },
    ],
  },
];



const heroStats = [
  { value: "20+", label: "Assessments" },
  { value: "3-12", label: "Mins Each" },
  { value: "100%", label: "Private" },
  { value: "Free", label: "To Start" },
];

export default function Assessments() {
  return (
    <div>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0faf8 0%, #e8f5f2 55%, #f5faf8 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--primary-fixed)]/25 blur-[130px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-violet-200/30 blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-fixed)]/50 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-widest mb-5"
              >
                <Brain size={12} /> Intelligence Center
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06 }}
                className="text-display-xl text-[var(--on-surface)] mb-6 leading-tight"
              >
                Understand Yourself{" "}
                <span className="text-gradient">Better</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="text-body-lg text-[var(--on-surface-variant)] mb-8 max-w-lg leading-relaxed"
              >
                Take scientifically-designed assessments to gain deep insights into your emotional health,
                personality, relationships, and potential.
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
                    <p className="font-bold text-[var(--on-surface)] text-lg leading-none">{s.value}</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)] mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                {[
                  { icon: Clock, text: "3-12 minutes each" },
                  { icon: Shield, text: "100% Private" },
                  { icon: CheckCircle, text: "Expert-Designed" },
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
                className="flex flex-wrap gap-3"
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="#assessments" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5">
                    Browse Assessments <ArrowRight size={16} />
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
                  src="/images/assessment-focus.png"
                  alt="Person taking assessment"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-[var(--outline-variant)]/30 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                  <Sparkles size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-bold text-[var(--on-surface)] text-sm leading-none">AI-Powered Analysis</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Personalised insights</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="absolute -top-4 -right-4 bg-[var(--primary)] text-white rounded-2xl px-4 py-2.5 shadow-lg text-center"
              >
                <p className="text-xl leading-none">🧠</p>
                <p className="text-[10px] font-semibold mt-1">Science-Backed</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ASSESSMENT CATEGORIES ── */}
      <section id="assessments" className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

          {assessmentCategories.map((category, catIdx) => {
            const CatIcon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mb-16 last:mb-0"
              >
                {/* Category header */}
                <div className={`flex items-center gap-4 mb-8 p-5 rounded-2xl bg-gradient-to-r ${category.color} border border-[var(--outline-variant)]/20`}>
                  <div className={`w-12 h-12 rounded-xl ${category.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <CatIcon size={22} className={category.iconColor} />
                  </div>
                  <div>
                    <h2 className="text-headline-md text-[var(--on-surface)] font-bold">{category.title}</h2>
                    <p className="text-sm text-[var(--on-surface-variant)]">{category.assessments.length} assessments available</p>
                  </div>
                  <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)] bg-white/60 rounded-full px-3 py-1.5 border border-[var(--outline-variant)]/30">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    Expert-Designed
                  </div>
                </div>

                {/* Assessment cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.assessments.map((assessment, i) => (
                    <motion.div
                      key={assessment.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <Link
                        href={`/assessments/${slugify(assessment.name)}`}
                        className="group flex flex-col h-full bg-white rounded-2xl border border-[var(--outline-variant)]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all block"
                      >
                        {/* Image header */}
                        <div className="relative h-40 overflow-hidden flex-shrink-0">
                          <Image
                            src={assessment.image}
                            alt={assessment.name}
                            fill
                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                          {/* Duration badge top-right */}
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[var(--primary)]">
                            <Clock size={10} /> {assessment.duration}
                          </span>

                          {/* Category icon bottom-left */}
                          <div className={`absolute bottom-3 left-3 w-8 h-8 rounded-lg ${category.iconBg} flex items-center justify-center shadow-sm`}>
                            <CatIcon size={15} className={category.iconColor} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-[var(--on-surface)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                            {assessment.name}
                          </h3>
                          <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed flex-1">
                            {assessment.description}
                          </p>
                          <div className="flex items-center gap-1.5 mt-4 text-[var(--primary)] font-semibold text-sm group-hover:gap-3 transition-all">
                            Start Assessment <ArrowRight size={14} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── AI INSIGHTS — Dark immersive ── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d3d38 60%, #0a2e2b 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-4">
                \\ Coming Soon
              </p>
              <h2 className="text-headline-lg text-white mb-4 leading-tight">
                AI-Powered Insights
              </h2>
              <p className="text-white/65 text-body-lg leading-relaxed mb-8">
                Our AI engine will provide personalised wellbeing insights, smart recommendations,
                emotional trend prediction, and personalised care journeys.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/assessments"
                  className="inline-flex items-center gap-2.5 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  Start Your First Assessment <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, title: "Smart Recommendations", desc: "AI-matched support and programs" },
                { icon: TrendingUp, title: "Trend Prediction", desc: "Spot patterns before they affect you" },
                { icon: Sparkles, title: "Personalised Journey", desc: "Care paths built just for you" },
                { icon: Shield, title: "Private & Secure", desc: "Your data, your control, always" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="flex flex-col gap-3 p-5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(147,210,204,0.2)", border: "1px solid rgba(147,210,204,0.25)" }}>
                      <Icon size={17} style={{ color: "var(--primary-fixed)" }} />
                    </div>
                    <p className="text-white font-semibold text-sm">{f.title}</p>
                    <p className="text-white/55 text-xs leading-relaxed">{f.desc}</p>
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
