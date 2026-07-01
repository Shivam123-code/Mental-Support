"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const tabs = ["All", "Stress & Anxiety", "Relationships", "Career & Study", "Life Events"];

const serviceCards = [
  { name: "Stress Management", icon: "🧠", desc: "Practical techniques to calm your mind, regulate emotions, and break free from daily pressure cycles.", tab: "Stress & Anxiety", color: "from-[var(--primary-fixed)] to-[var(--surface-container)]" },
  { name: "Anxiety Support", icon: "💭", desc: "Find calm within. Guided sessions to understand your anxiety triggers and build lasting resilience.", tab: "Stress & Anxiety", color: "from-[var(--secondary-fixed)] to-[var(--surface-container)]" },
  { name: "Burnout Recovery", icon: "🔥", desc: "Recover and prevent exhaustion. Rebuild your energy, boundaries, and passion for life.", tab: "Career & Study", color: "from-[var(--tertiary-fixed)] to-[var(--surface-container)]" },
  { name: "Relationship Healing", icon: "💞", desc: "Heal and strengthen your connections. Navigate conflicts, grief, and communication with expert support.", tab: "Relationships", color: "from-[var(--primary-fixed)] to-[var(--surface-container)]" },
  { name: "Career Pressure", icon: "💼", desc: "Professional growth and stress relief. Manage workplace anxiety and unlock your true potential.", tab: "Career & Study", color: "from-[var(--secondary-fixed)] to-[var(--surface-container)]" },
  { name: "Student Support", icon: "📚", desc: "Academic stress, exam anxiety, and campus life challenges — handled by those who truly understand.", tab: "Career & Study", color: "from-[var(--tertiary-fixed)] to-[var(--surface-container)]" },
  { name: "Parenting Confidence", icon: "👨‍👩‍👧", desc: "Confident parenting starts here. Support for every stage — newborns to teenagers and beyond.", tab: "Life Events", color: "from-[var(--primary-fixed)] to-[var(--surface-container)]" },
  { name: "Sleep Recovery", icon: "🌙", desc: "Rest and recovery programs to fix sleep patterns, reduce insomnia, and wake up restored.", tab: "Life Events", color: "from-[var(--secondary-fixed)] to-[var(--surface-container)]" },
  { name: "Emotional Healing", icon: "🌱", desc: "Inner growth and emotional processing. Heal past wounds and step into a more empowered self.", tab: "Life Events", color: "from-[var(--tertiary-fixed)] to-[var(--surface-container)]" },
  { name: "Crisis Support", icon: "🆘", desc: "Immediate help when you need it most. 24/7 access to trained professionals ready to listen.", tab: "Stress & Anxiety", color: "from-[var(--error-container)] to-[var(--surface-container)]" },
];

export default function ServicesCarousel() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const filtered = activeTab === "All" ? serviceCards : serviceCards.filter((c) => c.tab === activeTab);
  const total = filtered.length;

  const prev = () => { setDirection(-1); setActiveIndex((i) => (i - 1 + total) % total); };
  const next = () => { setDirection(1); setActiveIndex((i) => (i + 1) % total); };

  const handleTabChange = (tab: string) => { setActiveTab(tab); setActiveIndex(0); setDirection(1); };

  const getCard = (offset: number) => filtered[(activeIndex + offset + total) % total];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, scale: 0.92 }),
  };

  return (
    <section className="section-gap bg-[var(--surface-container-lowest)] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="text-center mb-10">
          <p className="text-xs font-semibold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Our Core Services</p>
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Support for Every Challenge</h2>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Whatever you&apos;re going through, we have the support you need. Explore categories designed around real human experiences.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => handleTabChange(tab)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${activeTab === tab ? "bg-[var(--primary-bright)] text-white border-[var(--primary-bright)] shadow-md" : "bg-white border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}>{tab}</button>
          ))}
        </motion.div>

        <div className="relative flex items-center justify-center gap-4 sm:gap-6 min-h-[420px]">
          <button onClick={prev} className="absolute left-0 sm:left-2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-[var(--outline-variant)] flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all"><ChevronLeft size={18} /></button>

          <div className="flex items-center justify-center gap-4 w-full px-10 sm:px-14">
            {total > 1 && (
              <motion.div key={`left-${activeIndex}`} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="hidden sm:flex flex-col w-[220px] flex-shrink-0 h-[340px] rounded-2xl overflow-hidden border border-[var(--outline-variant)]/40 bg-white/70 shadow-sm opacity-60 scale-95 cursor-pointer" onClick={prev}>
                <div className={`bg-gradient-to-b ${getCard(-1).color} h-[200px] flex items-center justify-center`}><span className="text-6xl">{getCard(-1).icon}</span></div>
                <div className="p-4 flex-1"><h3 className="font-semibold text-[var(--on-surface)] text-sm mb-1">{getCard(-1).name}</h3><p className="text-xs text-[var(--on-surface-variant)] line-clamp-3">{getCard(-1).desc}</p></div>
              </motion.div>
            )}

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={`center-${activeIndex}-${activeTab}`} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="relative flex flex-col w-full sm:w-[300px] flex-shrink-0 h-[400px] rounded-2xl overflow-hidden shadow-ambient-hover border border-[var(--outline-variant)]/20 bg-white z-10">
                <div className={`bg-gradient-to-b ${filtered[activeIndex].color} h-[240px] flex items-center justify-center relative`}>
                  <span className="text-8xl">{filtered[activeIndex].icon}</span>
                  <Link href="/get-support" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-all shadow-sm"><ArrowUpRight size={14} className="text-[var(--primary)]" /></Link>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div><h3 className="font-bold text-[var(--on-surface)] text-lg mb-2">{filtered[activeIndex].name}</h3><p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{filtered[activeIndex].desc}</p></div>
                  <Link href="/get-support" className="mt-4 self-end w-9 h-9 rounded-full bg-[var(--primary-bright)] flex items-center justify-center hover:scale-110 transition-all shadow-md"><ArrowUpRight size={16} className="text-white" /></Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <motion.div key={`right-${activeIndex}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="hidden sm:flex flex-col w-[220px] flex-shrink-0 h-[340px] rounded-2xl overflow-hidden border border-[var(--outline-variant)]/40 bg-white/70 shadow-sm opacity-60 scale-95 cursor-pointer" onClick={next}>
                <div className={`bg-gradient-to-b ${getCard(1).color} h-[200px] flex items-center justify-center`}><span className="text-6xl">{getCard(1).icon}</span></div>
                <div className="p-4 flex-1"><h3 className="font-semibold text-[var(--on-surface)] text-sm mb-1">{getCard(1).name}</h3><p className="text-xs text-[var(--on-surface-variant)] line-clamp-3">{getCard(1).desc}</p></div>
              </motion.div>
            )}
          </div>

          <button onClick={next} className="absolute right-0 sm:right-2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-[var(--outline-variant)] flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all"><ChevronRight size={18} /></button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {filtered.map((_, i) => (
            <button key={i} onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }} className={`transition-all duration-300 rounded-full ${i === activeIndex ? "w-6 h-2 bg-[var(--primary-bright)]" : "w-2 h-2 bg-[var(--outline-variant)]"}`} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="flex justify-center mt-10">
          <Link href="/get-support" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--primary-bright)] text-white font-semibold rounded-full hover:bg-[var(--primary)] transition-all shadow-md hover:shadow-lg hover:scale-[1.02]">
            See all Support <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
