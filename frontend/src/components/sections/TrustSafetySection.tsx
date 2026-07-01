"use client";

import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle, Brain, Users, Phone } from "lucide-react";

const items = [
  { icon: Shield,      title: "Clinical Governance",    desc: "All services overseen by qualified clinical professionals",              num: "01" },
  { icon: Lock,        title: "Privacy First",          desc: "End-to-end encryption, anonymous mode, DPDP compliant",                 num: "02" },
  { icon: CheckCircle, title: "Verified Professionals", desc: "Every professional is verified, trained, and regularly supervised",      num: "03" },
  { icon: Brain,       title: "Ethical AI Framework",   desc: "AI assists but never replaces human judgment and empathy",              num: "04" },
  { icon: Users,       title: "Human Moderation",       desc: "Community spaces are moderated by trained humans",                      num: "05" },
  { icon: Phone,       title: "Crisis Response",        desc: "24/7 crisis support systems with immediate human escalation",           num: "06" },
];

export default function TrustSafetySection() {
  return (
    <section
      className="section-gap relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d3d38 50%, #102e2b 100%)" }}
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--secondary)]/10 blur-[100px] pointer-events-none" />
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-3">
            \\ Trust &amp; Security
          </p>
          <h2 className="text-headline-lg text-white mb-4">Built on Trust &amp; Safety</h2>
          <p className="text-white/60 text-body-lg max-w-2xl mx-auto">
            Your emotional safety is our top priority. Every aspect of KleverKlues&trade; is designed with trust at its core.
          </p>
        </motion.div>

        {/* Cards — 3 col bento with alternating sizes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = item.icon;
            // Make first and last cards span 2 cols on lg for variety
            const isWide = i === 0 || i === 5;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl border border-white/10 p-7 overflow-hidden group cursor-default
                  ${isWide ? "lg:col-span-1" : ""}
                `}
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(147,210,204,0.12) 0%, transparent 70%)" }}
                />
                {/* Top border glow on hover */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--primary-fixed)] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Big number — decorative */}
                <span className="absolute top-4 right-5 text-6xl font-bold text-white/5 select-none leading-none">
                  {item.num}
                </span>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(147,210,204,0.25), rgba(147,210,204,0.08))", border: "1px solid rgba(147,210,204,0.25)" }}
                >
                  <Icon size={22} style={{ color: "var(--primary-fixed)" }} />
                </motion.div>

                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
