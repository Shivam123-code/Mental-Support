"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Building2, TrendingUp, Users, Shield } from "lucide-react";

const features = [
  "Corporate wellness programs",
  "Workforce emotional resilience",
  "Burnout prevention systems",
  "Educational institution support",
  "Leadership wellbeing coaching",
];

const highlights = [
  { icon: Building2, value: "200+", label: "Organizations" },
  { icon: TrendingUp, value: "40%",  label: "Productivity Boost" },
  { icon: Users,     value: "50K+", label: "Employees Served" },
  { icon: Shield,    value: "100%", label: "Confidential" },
];

export default function EnterpriseSection() {
  return (
    <section className="section-gap bg-[var(--surface)] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* Full-width bento card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #f0faf8 0%, #e6f5f2 50%, #f5faf8 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-[var(--primary-fixed)]/30 blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[var(--secondary-fixed)]/20 blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-0">

            {/* LEFT — Content */}
            <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              {/* Chip */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--tertiary)]/30 bg-[var(--tertiary-fixed)]/40 text-[var(--tertiary)] text-xs font-bold uppercase tracking-widest w-fit mb-6"
              >
                <Building2 size={12} />
                For Organizations
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-headline-lg text-[var(--on-surface)] mb-4"
              >
                Enterprise Wellbeing
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 }}
                className="text-body-lg text-[var(--on-surface-variant)] mb-8 leading-relaxed"
              >
                Build emotionally resilient teams. Reduce burnout. Improve workplace wellbeing with our enterprise solutions.
              </motion.p>

              {/* Features — 2-col pill grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-10">
                {features.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
                    className="flex items-center gap-2.5 bg-white/70 border border-[var(--outline-variant)]/40 rounded-xl px-4 py-2.5 shadow-sm"
                  >
                    <CheckCircle size={14} className="text-[var(--primary-bright)] flex-shrink-0" />
                    <span className="text-[var(--on-surface)] text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.55 }}
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Link href="/enterprise" className="btn-primary inline-flex items-center gap-2.5 px-7 py-3.5">
                    Enterprise Solutions
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — Image + stat row */}
            <div className="relative min-h-[360px] lg:min-h-0">
              <Image
                src="/images/enterprise-team.png"
                alt="Enterprise team wellbeing"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/10" />

              {/* Stats strip at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 grid grid-cols-4 gap-2">
                {highlights.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <motion.div
                      key={h.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                      className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-2.5 text-center"
                    >
                      <Icon size={14} className="text-white mx-auto mb-1" />
                      <p className="text-white font-bold text-sm leading-none">{h.value}</p>
                      <p className="text-white/65 text-[10px] mt-0.5">{h.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
