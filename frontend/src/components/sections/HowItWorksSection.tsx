"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Users, Heart, Sparkles } from "lucide-react";

// Same content as existing steps array
const steps = [
  {
    step: "01",
    title: "Assess",
    desc: "Take a free wellbeing assessment to understand your emotional health",
    icon: Brain,
    emoji: "🧠",
    glow: "rgba(147,210,204,0.35)",
  },
  {
    step: "02",
    title: "Match",
    desc: "Get matched with verified professionals who understand your needs",
    icon: Users,
    emoji: "🤝",
    glow: "rgba(147,210,204,0.25)",
  },
  {
    step: "03",
    title: "Support",
    desc: "Receive personalized guidance through sessions & programs",
    icon: Heart,
    emoji: "💚",
    glow: "rgba(147,210,204,0.35)",
  },
  {
    step: "04",
    title: "Progress",
    desc: "Track your growth, celebrate milestones, and build resilience",
    icon: Sparkles,
    emoji: "⭐",
    glow: "rgba(147,210,204,0.25)",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function HowItWorksSection() {
  return (
    <section className="relative section-gap overflow-hidden bg-gradient-to-br from-[var(--surface-container-low)] via-[var(--surface)] to-[var(--surface-container-lowest)]">

      {/* Soft background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[var(--primary-fixed)]/30 blur-[100px]" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-[var(--secondary-fixed)]/20 blur-[80px]" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
            How KleverKlues&trade; Works
          </h2>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            Your journey to emotional wellbeing starts with just one simple step.
          </p>
        </motion.div>

        {/* Cards + Wave Row */}
        <div className="relative">

          {/* Flowing wave connector — SVG behind cards */}
          <div className="absolute inset-0 flex items-center pointer-events-none hidden lg:block">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-full h-[120px] absolute top-1/2 -translate-y-1/2"
              fill="none"
            >
              <motion.path
                d="M0,60 C150,20 200,100 400,60 C600,20 650,100 800,60 C950,20 1000,100 1200,60"
                stroke="url(#waveGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
              />
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="var(--primary-bright)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="relative rounded-3xl overflow-hidden border border-white/60 shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                {/* Inner glow */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${step.glow} 0%, transparent 70%)`,
                  }}
                />

                <div className="relative p-6 flex flex-col h-full min-h-[320px]">
                  {/* Step number — large, top-left */}
                  <span
                    className="text-[72px] font-display font-bold leading-none text-[var(--primary-fixed)]/60 select-none mb-2"
                    style={{ fontFeatureSettings: '"tnum"' }}
                  >
                    {step.step}
                  </span>

                  {/* Large Emoji Visual */}
                  <div className="flex-1 flex items-center justify-center py-2">
                    <motion.span
                      className="text-[80px] leading-none drop-shadow-sm"
                      animate={{
                        y: [0, -8, 0],
                        rotate: i % 2 === 0 ? [0, 4, 0] : [0, -4, 0],
                      }}
                      transition={{
                        duration: 3.5 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {step.emoji}
                    </motion.span>
                  </div>

                  {/* Icon badge */}
                  <div className="w-9 h-9 rounded-full bg-white/70 border border-[var(--primary)]/20 flex items-center justify-center mb-3 shadow-sm">
                    <step.icon size={16} className="text-[var(--primary)]" />
                  </div>

                  {/* Title + Desc */}
                  <h3 className="font-bold text-[var(--on-surface)] text-lg mb-1.5">{step.title}</h3>
                  <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Get Started CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="flex justify-center mt-14"
        >
          <Link
            href="/assessments"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-[var(--primary)] border-2 border-[var(--primary)]/40 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-[var(--primary)] hover:shadow-lg transition-all duration-200 text-sm"
          >
            Get Started
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
