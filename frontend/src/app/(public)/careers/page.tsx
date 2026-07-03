"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Heart, Award, Users, Globe, TrendingUp, Star } from "lucide-react";

const benefits = [
  { icon: Heart,      title: "Meaningful Work",         desc: "Help thousands of people improve their emotional wellbeing every day.",               color: "#fce7f3", iconColor: "#be185d" },
  { icon: TrendingUp, title: "Grow Your Practice",      desc: "Access a growing community of clients matched to your expertise.",                    color: "#d1fae5", iconColor: "#065f46" },
  { icon: Globe,      title: "Flexible Schedule",       desc: "Work from anywhere, set your own hours, and manage your availability.",               color: "#dbeafe", iconColor: "#1d4ed8" },
  { icon: Award,      title: "Professional Development",desc: "Free certifications, training, and continuous learning opportunities.",               color: "#fef3c7", iconColor: "#b45309" },
  { icon: Users,      title: "Community of Peers",      desc: "Connect with fellow professionals, share insights, and collaborate.",                 color: "#ede9fe", iconColor: "#7c3aed" },
  { icon: Star,       title: "Earn Respectfully",       desc: "Transparent compensation with no exploitative practices.",                            color: "#ccfbf1", iconColor: "#0f766e" },
];

const roles = [
  { title: "Counsellors",          desc: "Provide emotional support and guidance through sessions",    requirements: ["Masters in Psychology/Counselling", "2+ years experience", "Active license/registration"]          },
  { title: "Clinical Psychologists",desc: "Deliver clinical assessments and therapeutic interventions",requirements: ["M.Phil/PhD in Clinical Psychology", "RCI registration", "3+ years practice"]                    },
  { title: "Wellness Coaches",     desc: "Guide clients through wellness programs and goal-setting",   requirements: ["Certified coaching credential", "1+ year experience", "Specialization area"]                     },
  { title: "Mentors",              desc: "Share life experience to guide and support others",           requirements: ["5+ years professional experience", "Strong communication skills", "Training completed"]          },
  { title: "EQ Trainers",          desc: "Conduct workshops on emotional intelligence",                requirements: ["EQ certification", "Training experience", "Corporate/education background"]                      },
  { title: "Content Creators",     desc: "Create wellness content — articles, videos, and programs",   requirements: ["Domain expertise in wellness", "Content creation skills", "Portfolio of work"]                   },
];

const steps = [
  { step: "01", title: "Apply",   desc: "Submit your profile, qualifications, and experience" },
  { step: "02", title: "Verify",  desc: "We verify credentials, background, and references"   },
  { step: "03", title: "Onboard", desc: "Complete platform training and orientation"           },
  { step: "04", title: "Start",   desc: "Begin helping people and growing your practice"       },
];

export default function Careers() {
  return (
    <div>

      {/* ── HERO: mint gradient, split, image with floating badge ── */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: "linear-gradient(135deg,#f0faf8 0%,#e8f5f2 55%,#f5faf8 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--primary-fixed)]/25 blur-[130px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-rose-200/30 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-fixed)]/50 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-widest mb-5"
              >
                <Heart size={12} /> Join KleverKlues™
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-[var(--on-surface)] leading-[1.05] mb-6"
              >
                Help Humanity{" "}
                <span className="text-gradient">Heal & Grow</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="text-[var(--on-surface-variant)] text-lg mb-8 max-w-lg leading-relaxed"
              >
                Join our network of verified professionals and make a meaningful impact. Grow your practice while helping others build emotional resilience.
              </motion.p>

              {/* Trust chips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {["Verified Network", "Flexible Hours", "Mission-Driven"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border border-[var(--outline-variant)]/40 rounded-full text-xs text-[var(--on-surface-variant)]">
                    ✅ {t}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.28 }}
              >
                <Link href="/apply-professional"
                  className="btn-primary inline-flex items-center gap-2 px-7 py-3.5">
                  Apply to Join <ArrowRight size={15} />
                </Link>
              </motion.div>
            </div>

            {/* Right — image with floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" as const }}
              className="hidden lg:block relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[5/4]">
                <Image src="/images/therapist-session.png" alt="Professional at work" fill sizes="50vw" className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-xl border border-[var(--outline-variant)]/30 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                  <Users size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="font-bold text-[var(--on-surface)] text-sm leading-none">500+ Professionals</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Already on the platform</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN — colour-block benefit cards ── */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Your Benefits</p>
            <h2 className="text-3xl lg:text-4xl font-display font-medium text-[var(--on-surface)] mb-3">Why Join KleverKlues™?</h2>
            <p className="text-[var(--on-surface-variant)] max-w-xl mx-auto">Be part of a mission-driven ecosystem that values your expertise and supports your growth.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="rounded-2xl p-6 cursor-default"
                  style={{ backgroundColor: b.color }}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center mb-4 shadow-sm">
                    <Icon size={20} style={{ color: b.iconColor }} />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: b.iconColor }}>{b.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: b.iconColor + "aa" }}>{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── OPEN ROLES — accordion-style list ── */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Opportunities</p>
              <h2 className="text-3xl lg:text-4xl font-display font-medium text-[var(--on-surface)]">Open Roles</h2>
              <p className="text-[var(--on-surface-variant)] mt-2">Find the role that matches your expertise and passion.</p>
            </div>
          </motion.div>

          <div className="space-y-0 divide-y divide-[var(--outline-variant)]/40">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <motion.div
                  whileHover={{ x: 8, backgroundColor: "rgba(147,210,204,0.06)", transition: { duration: 0.2 } }}
                  className="grid sm:grid-cols-3 gap-4 py-6 px-4 rounded-2xl items-start group cursor-default transition-colors"
                >
                  {/* Title + desc */}
                  <div className="sm:col-span-1">
                    <h3 className="font-bold text-[var(--on-surface)] text-base group-hover:text-[var(--primary)] transition-colors">{role.title}</h3>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">{role.desc}</p>
                  </div>

                  {/* Requirements */}
                  <ul className="sm:col-span-1 space-y-1.5">
                    {role.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-xs text-[var(--on-surface-variant)]">
                        <CheckCircle size={12} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>

                  {/* Apply link */}
                  <div className="sm:col-span-1 sm:text-right flex sm:justify-end items-center">
                    <Link
                      href="/apply-professional"
                      className="inline-flex items-center gap-1.5 text-[var(--primary)] text-sm font-bold group-hover:gap-3 transition-all"
                    >
                      Apply Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO JOIN — numbered steps, dark panel ── */}
      <section className="section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(135deg,#0a2e2b,#0d3d38)" }}
          >
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10 p-10 lg:p-14">
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-[var(--primary-fixed)] uppercase tracking-widest mb-3">\\ The Process</p>
                <h2 className="text-2xl lg:text-3xl font-display font-medium text-white">How to Join</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Connecting line on desktop */}
                <div className="absolute top-7 left-[12.5%] right-[12.5%] h-px bg-white/10 hidden lg:block" />

                {steps.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className="flex flex-col items-center text-center relative z-10"
                  >
                    <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-bold mb-5 shadow-lg"
                      style={{ borderColor: "#93d2cc", background: i === 0 ? "#93d2cc" : "rgba(147,210,204,0.12)", color: i === 0 ? "#0a2e2b" : "#93d2cc" }}>
                      {item.step}
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <Link href="/apply-professional"
                  className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                  Start Your Application
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
