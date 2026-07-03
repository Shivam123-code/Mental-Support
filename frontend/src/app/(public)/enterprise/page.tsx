"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, GraduationCap, Heart, Shield,
  TrendingUp, Users, ArrowRight, CheckCircle, BarChart3,
} from "lucide-react";

const sectors = [
  { name: "Corporates",     icon: "🏢", desc: "Employee wellness & burnout prevention"   },
  { name: "Healthcare",     icon: "🏥", desc: "Staff resilience & emotional support"     },
  { name: "Schools",        icon: "📚", desc: "Student & teacher wellbeing"              },
  { name: "Universities",   icon: "🎓", desc: "Campus mental wellness programs"          },
  { name: "Manufacturing",  icon: "🏭", desc: "Worker safety & emotional health"         },
  { name: "Government",     icon: "🏛️", desc: "Public sector wellness initiatives"       },
];

const features = [
  { title: "Employee Assistance Program", desc: "Comprehensive emotional support for your entire workforce with anonymous access",     icon: Users,        color: "#dbeafe", iconColor: "#1d4ed8" },
  { title: "Burnout Analytics",           desc: "Real-time burnout risk detection and prevention with AI-powered insights",            icon: BarChart3,    color: "#fce7f3", iconColor: "#be185d" },
  { title: "Wellbeing Dashboards",        desc: "Track engagement, wellness trends, and emotional health metrics",                    icon: TrendingUp,   color: "#d1fae5", iconColor: "#065f46" },
  { title: "Leadership Support",          desc: "Specialized coaching and support for leaders and managers",                          icon: Building2,    color: "#fef3c7", iconColor: "#b45309" },
  { title: "Anonymous Support",           desc: "Employees can access help without fear of judgment",                                icon: Shield,       color: "#ede9fe", iconColor: "#7c3aed" },
  { title: "Workshops & Programs",        desc: "Customized wellness workshops and team programs",                                    icon: GraduationCap,color: "#ccfbf1", iconColor: "#0f766e" },
];

const stats = [
  { value: "43%",  label: "Reduction in Burnout"  },
  { value: "67%",  label: "Improved Engagement"    },
  { value: "89%",  label: "User Satisfaction"      },
  { value: "3.5x", label: "ROI on Wellness"        },
];

const dashboardItems = [
  "Utilization trends",
  "Burnout indicators",
  "Emotional wellness analytics",
  "Engagement metrics",
  "Risk insights & alerts",
];

export default function Enterprise() {
  return (
    <div>

      {/* ── HERO: full viewport, image bg, bottom-aligned content ── */}
      <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/enterprise-team.png" alt="Enterprise" fill sizes="100vw" className="object-cover object-center" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,46,43,0.75) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/65 text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
          >
            <Building2 size={11} /> Enterprise Solutions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-medium text-white leading-[1.05] mb-6 max-w-3xl"
          >
            Build Emotionally<br />
            <span style={{ background: "linear-gradient(90deg,#93d2cc,#b8e8e4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Resilient Teams
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/60 text-lg max-w-xl mb-10 leading-relaxed"
          >
            Reduce burnout. Improve workforce wellbeing. Increase productivity with KleverKlues™ Enterprise.
          </motion.p>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="flex flex-wrap gap-8 mb-10"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white leading-none">{s.value}</p>
                <p className="text-white/45 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.34 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
              Schedule Demo
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all text-sm">
              Download Brochure
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTORS — horizontal pill row ── */}
      <section className="py-14 bg-white border-b border-[var(--outline-variant)]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest whitespace-nowrap">\\ Serving Every Sector</p>
            <div className="h-px flex-1 bg-[var(--outline-variant)]/40" />
            <p className="text-sm text-[var(--on-surface-variant)]">Tailored solutions for every size</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {sectors.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 shadow-sm hover:shadow-md cursor-default transition-all"
              >
                <span className="text-3xl mb-3">{s.icon}</span>
                <p className="font-bold text-[var(--on-surface)] text-xs mb-1">{s.name}</p>
                <p className="text-[10px] text-[var(--on-surface-variant)] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — colour-block bento ── */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Platform Capabilities</p>
            <h2 className="text-3xl lg:text-4xl font-display font-medium text-[var(--on-surface)]">Enterprise Features</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="rounded-2xl p-6 cursor-default"
                  style={{ backgroundColor: f.color }}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center mb-4 shadow-sm">
                    <Icon size={20} style={{ color: f.iconColor }} />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: f.iconColor }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: f.iconColor + "aa" }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD — dark left panel + image right ── */}
      <section className="section-gap overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Left — dark */}
            <div className="relative flex flex-col justify-center p-10 lg:p-14"
              style={{ background: "linear-gradient(135deg,#0a2e2b,#0d3d38)" }}>
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative z-10">
                <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-4">\\ Real-Time Insights</p>
                <h2 className="text-2xl lg:text-3xl font-display font-medium text-white mb-4">Enterprise Dashboard</h2>
                <p className="text-white/55 mb-8 leading-relaxed">Real-time insights into your organization&apos;s emotional health.</p>
                <ul className="space-y-3 mb-8">
                  {dashboardItems.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.07 }}
                      className="flex items-center gap-3 text-white/70 text-sm"
                    >
                      <CheckCircle size={15} style={{ color: "#93d2cc", flexShrink: 0 }} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all text-sm">
                  Request Demo
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div className="relative min-h-[340px] lg:min-h-0">
              <Image src="/images/assessment-focus.png" alt="Dashboard" fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}