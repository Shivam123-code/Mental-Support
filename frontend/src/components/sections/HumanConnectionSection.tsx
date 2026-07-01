"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Users, Sparkles, Star, ArrowRight } from "lucide-react";

const items = [
  { icon: Heart,    text: "Support someone emotionally through peer circles" },
  { icon: Users,    text: "Become a mentor or support buddy" },
  { icon: Sparkles, text: "Sponsor sessions for those in need" },
  { icon: Star,     text: "Join support circles and community missions" },
  { icon: Heart,    text: "Contribute to community wellbeing missions" },
];

const stats = [
  { value: "5K+",  label: "Lives Touched" },
  { value: "300+", label: "Volunteers" },
  { value: "92%",  label: "Satisfaction" },
];

export default function HumanConnectionSection() {
  return (
    <section className="section-gap overflow-hidden bg-[var(--surface-container-low)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* ── Top Label ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-4"
        >
          \\ Community Impact
        </motion.p>

        {/* ── Full-width bento card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden grid lg:grid-cols-[1fr_1.1fr] min-h-[520px] shadow-2xl"
        >
          {/* LEFT — Full-bleed image with stats overlay */}
          <div className="relative min-h-[340px] lg:min-h-0">
            <Image
              src="/images/community-support.png"
              alt="People supporting each other"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Stats row at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center"
                >
                  <p className="text-white font-bold text-xl leading-none">{s.value}</p>
                  <p className="text-white/70 text-xs mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT — Rich dark panel */}
          <div
            className="relative flex flex-col justify-center p-8 lg:p-12"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, #0d5c55 100%)" }}
          >
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 relative z-10"
            >
              Help Someone Today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-white/75 text-base leading-relaxed mb-8 relative z-10"
            >
              Make a meaningful impact. Support someone emotionally, mentor others, or contribute to community wellbeing.
            </motion.p>

            {/* Items as 2-col mini cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 relative z-10">
              {items.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.18)" }}
                  className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 cursor-default transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-white" />
                  </div>
                  <span className="text-white/90 text-xs font-medium leading-snug">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="relative z-10"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2.5 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  Join the Movement
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
