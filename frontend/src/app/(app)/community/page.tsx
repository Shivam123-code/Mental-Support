"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Heart, Shield, Star, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const communityGroups = [
  { name: "Student Wellness",    members: "2.5K+", image: "/images/student-focus.png",       description: "Support for academic stress and student life" },
  { name: "Startup Founders",    members: "1.2K+", image: "/images/burnout-reset.png",        description: "Navigating entrepreneurial stress and burnout" },
  { name: "Parenting Support",   members: "3.1K+", image: "/images/parenting-confidence.png", description: "A safe space for parents to grow together" },
  { name: "Grief Healing",       members: "1.8K+", image: "/images/get-support.png",          description: "Compassionate community for processing loss" },
  { name: "Men's Wellness",      members: "2.0K+", image: "/images/confidence-building.png",  description: "Breaking stigma — men supporting men" },
  { name: "Women Leadership",    members: "1.5K+", image: "/images/emotional-fitness.png",    description: "Empowering women leaders with resilience" },
  { name: "Relationship Healing",members: "2.2K+", image: "/images/relationship-healing.png", description: "Rebuilding trust and healing relationships" },
  { name: "Senior Wellbeing",    members: "900+",  image: "/images/community-support.png",    description: "Connection and support for seniors" },
];

const features = [
  { icon: Users,       title: "Support Circles",     desc: "Join guided groups for shared healing",       color: "bg-teal-100",   iconColor: "text-teal-600"   },
  { icon: Heart,       title: "Peer Encouragement",  desc: "Give and receive emotional support",          color: "bg-rose-100",   iconColor: "text-rose-500"   },
  { icon: MessageCircle,title:"Guided Communities",  desc: "Expert-moderated safe spaces",                color: "bg-violet-100", iconColor: "text-violet-600" },
  { icon: Star,        title: "Gratitude Sharing",   desc: "Celebrate wins and spread positivity",        color: "bg-amber-100",  iconColor: "text-amber-600"  },
  { icon: Sparkles,    title: "Healing Journeys",    desc: "Follow transformation stories",               color: "bg-sky-100",    iconColor: "text-sky-500"    },
  { icon: Shield,      title: "Safe & Moderated",    desc: "Human-moderated positive spaces",             color: "bg-emerald-100",iconColor: "text-emerald-600"},
];

const heroStats = [
  { value: "16K+",  label: "Members" },
  { value: "8",     label: "Circles" },
  { value: "100%",  label: "Safe" },
  { value: "Free",  label: "To Join" },
];

const helpActions = [
  { label: "Encourage Others", icon: "💪", desc: "Lift someone up today" },
  { label: "Sponsor Sessions",  icon: "🎁", desc: "Fund a healing session" },
  { label: "Mentor Students",   icon: "🎓", desc: "Guide those who need it" },
  { label: "Join Missions",     icon: "🌟", desc: "Earn your Impact Score" },
];

export default function Community() {
  return (
    <div>

      {/* ── HERO — Mint gradient matching homepage ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0faf8 0%, #e8f5f2 55%, #f5faf8 100%)" }}
      >
        {/* Blobs */}
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
                <Users size={12} /> Humanity, Connected.
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.06 }}
                className="text-display-xl text-[var(--on-surface)] mb-6 leading-tight"
              >
                You&apos;re Part of Something{" "}
                <span className="text-gradient">Bigger</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="text-body-lg text-[var(--on-surface-variant)] mb-8 max-w-lg leading-relaxed"
              >
                Join a safe, moderated, emotionally positive community where you can connect, heal, and grow with people who understand.
              </motion.p>

              {/* Stats */}
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

              {/* Trust chips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {["Expert-Moderated", "Anonymous Option", "Zero Toxicity"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-[var(--outline-variant)]/40 rounded-full text-xs text-[var(--on-surface-variant)] backdrop-blur-sm">
                    ✅ {t}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.28 }}
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Link href="/community" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5">
                    Join Community <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — image with floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" as const }}
              className="hidden lg:block relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[5/4]">
                <Image
                  src="/images/community-support.png"
                  alt="Community"
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating members badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border border-[var(--outline-variant)]/30 flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {["/images/prof-dr-ananya.png", "/images/prof-kavita.png", "/images/prof-rahul.png"].map((src, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                      <Image src={src} alt="member" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-[var(--on-surface)] text-sm leading-none">16K+ Members</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Growing every day</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="absolute -top-4 -right-4 bg-[var(--primary-bright)] text-white rounded-2xl px-4 py-2.5 shadow-lg text-center"
              >
                <p className="text-xl leading-none">💚</p>
                <p className="text-[10px] font-semibold mt-1">Safe Space</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY FEATURES ── */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ What We Offer</p>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Community Features</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Safe, moderated, emotionally positive support ecosystem.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl border border-[var(--outline-variant)]/30 p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon size={22} className={f.iconColor} />
                  </div>
                  <h3 className="font-bold text-[var(--on-surface)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FIND YOUR CIRCLE ── */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ 8 Active Circles</p>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Find Your Circle</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Join communities built around shared experiences.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {communityGroups.map((g, i) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-white rounded-2xl overflow-hidden border border-[var(--outline-variant)]/30 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={g.image}
                    alt={g.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Members badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold text-[var(--on-surface)]">
                    <Users size={10} className="text-[var(--primary)]" />
                    {g.members}
                  </div>

                  {/* Name over image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-white text-sm drop-shadow-sm">{g.name}</h3>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4">
                  <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{g.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-[var(--primary)] text-xs font-semibold group-hover:gap-2 transition-all">
                    Join Circle <ArrowRight size={11} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HELP SOMEONE — Dark teal ── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d3d38 60%, #0a2e2b 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-3">\\ Make an Impact</p>
            <h2 className="text-headline-lg text-white mb-4">Help Someone Today</h2>
            <p className="text-white/60 text-body-lg max-w-2xl mx-auto">
              Earn your Human Impact Score by contributing positively.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {helpActions.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="flex flex-col items-center text-center p-7 rounded-2xl cursor-pointer"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <p className="font-bold text-white text-base mb-2">{item.label}</p>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.45 }}
            className="flex justify-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Join the Community
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}