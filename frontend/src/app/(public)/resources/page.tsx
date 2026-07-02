"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Video, Headphones, Moon, Music, Brain,
  ArrowRight, Clock, Heart, CheckCircle, Sparkles, Search,
} from "lucide-react";

const resourceCategories = [
  { name: "Articles",    icon: BookOpen,   count: "200+", color: "bg-violet-100", iconColor: "text-violet-600", emoji: "📄" },
  { name: "Videos",      icon: Video,      count: "80+",  color: "bg-rose-100",   iconColor: "text-rose-500",   emoji: "🎬" },
  { name: "Podcasts",    icon: Headphones, count: "50+",  color: "bg-amber-100",  iconColor: "text-amber-600",  emoji: "🎙️" },
  { name: "Sleep Audio", icon: Moon,       count: "30+",  color: "bg-indigo-100", iconColor: "text-indigo-600", emoji: "🌙" },
  { name: "Brain Music", icon: Music,      count: "40+",  color: "bg-teal-100",   iconColor: "text-teal-600",   emoji: "🎵" },
  { name: "Meditation",  icon: Brain,      count: "60+",  color: "bg-emerald-100",iconColor: "text-emerald-600",emoji: "🧘" },
];

const articles = [
  { title: "Understanding Anxiety: A Complete Guide",     category: "Mental Health", readTime: "8 min", image: "/images/anxiety-recovery.png",    excerpt: "Learn about types of anxiety, symptoms, and evidence-based strategies." },
  { title: "5 Daily Habits for Emotional Resilience",    category: "Wellness",      readTime: "5 min", image: "/images/emotional-fitness.png",    excerpt: "Simple daily practices that transform your emotional health." },
  { title: "Burnout Recovery: When Rest Isn't Enough",   category: "Career",        readTime: "7 min", image: "/images/burnout-reset.png",        excerpt: "Why traditional rest doesn't fix burnout and what works." },
  { title: "Building EQ in Children",                    category: "Parenting",     readTime: "6 min", image: "/images/parenting-confidence.png", excerpt: "Practical strategies for helping children develop emotional awareness." },
  { title: "The Science of Sleep and Mental Health",     category: "Sleep",         readTime: "9 min", image: "/images/sleep-recovery.png",       excerpt: "How sleep impacts mental health and strategies for better rest." },
  { title: "Mindfulness for Beginners",                  category: "Mindfulness",   readTime: "4 min", image: "/images/assessment-focus.png",     excerpt: "A gentle introduction to mindfulness for first-timers." },
];

const stories = [
  { name: "Ravi K.",   story: "From burnout to launching my own wellness startup. KleverKlues gave me tools to heal.", image: "/images/prof-rahul.png",     tag: "Burnout Recovery" },
  { name: "Sania M.",  story: "Managing anxiety felt impossible until I found the right support here.",               image: "/images/prof-kavita.png",    tag: "Anxiety Support" },
  { name: "Deepak S.", story: "The parenting program saved my relationship with my teenager.",                        image: "/images/prof-dr-ananya.png", tag: "Parenting" },
];

const meditationFeatures = [
  "Guided breathing exercises",
  "Sleep stories & audio",
  "Focus-enhancing brain music",
  "Mindfulness meditations",
  "Stress relief sessions",
  "Research-backed insights",
];

const heroStats = [
  { value: "460+", label: "Resources" },
  { value: "6",    label: "Categories" },
  { value: "Free", label: "Access" },
  { value: "New",  label: "Weekly" },
];

const categoryColors: Record<string, string> = {
  "Mental Health": "bg-violet-100 text-violet-700",
  "Wellness":      "bg-teal-100 text-teal-700",
  "Career":        "bg-amber-100 text-amber-700",
  "Parenting":     "bg-sky-100 text-sky-700",
  "Sleep":         "bg-indigo-100 text-indigo-700",
  "Mindfulness":   "bg-emerald-100 text-emerald-700",
};

export default function Resources() {
  return (
    <div>

      {/* ══════════════════════════════════════════
          HERO — Full-bleed dark editorial
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-end">

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-woman.png"
            alt="Wellbeing Resource Hub"
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,46,43,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pb-16 pt-32 w-full">

          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/70 text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
          >
            <BookOpen size={12} /> Wellbeing Resource Hub
          </motion.div>

          {/* Big headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-medium text-white leading-[1.05] mb-6 max-w-3xl"
          >
            Everything You Need to{" "}
            <span style={{ background: "linear-gradient(90deg, #93d2cc, #b8e8e4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Feel Better
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-white/60 text-base sm:text-lg max-w-xl mb-10 leading-relaxed"
          >
            Articles, videos, podcasts, guided meditations, sleep audio, and more — curated for your wellbeing journey.
          </motion.p>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {resourceCategories.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white cursor-pointer hover:bg-white/20 transition-all"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
              >
                <span>{c.emoji}</span> {c.name}
                <span className="text-white/50 text-xs">{c.count}</span>
              </span>
            ))}
          </motion.div>

          {/* Bottom stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap gap-8"
          >
            {[
              { value: "460+", label: "Total Resources" },
              { value: "6",    label: "Content Types" },
              { value: "Free", label: "Always Free" },
              { value: "New",  label: "Added Weekly" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-3xl font-bold text-white leading-none">{s.value}</span>
                <span className="text-white/50 text-xs mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          ARTICLES
      ══════════════════════════════════════════ */}


      {/* ══════════════════════════════════════════
          FEATURED ARTICLES — editorial bento grid
      ══════════════════════════════════════════ */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-2">\\ Curated Reads</p>
              <h2 className="text-headline-lg text-[var(--on-surface)]">Featured Articles</h2>
            </div>
            <Link href="/resources" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:gap-3 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {/* Bento: 1 large featured + 2 col small grid */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Featured article — large */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="lg:col-span-1 group bg-white rounded-3xl overflow-hidden border border-[var(--outline-variant)]/30 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-64 overflow-hidden flex-shrink-0">
                <Image src={articles[0].image} alt={articles[0].title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${categoryColors[articles[0].category] || "bg-white text-gray-700"}`}>
                  {articles[0].category}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white text-lg leading-snug">{articles[0].title}</h3>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{articles[0].excerpt}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)]">
                    <Clock size={11} className="text-[var(--primary)]" /> {articles[0].readTime} read
                  </div>
                  <span className="text-[var(--primary)] text-xs font-bold group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </motion.div>

            {/* Right: 2×2 grid of smaller cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
              {articles.slice(1).map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-2xl overflow-hidden border border-[var(--outline-variant)]/30 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden flex-shrink-0">
                    <Image src={a.image} alt={a.title} fill sizes="(max-width:1024px) 50vw, 22vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[a.category] || "bg-white text-gray-700"}`}>
                      {a.category}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-[var(--on-surface)] text-sm mb-1.5 group-hover:text-[var(--primary)] transition-colors leading-snug">
                      {a.title}
                    </h3>
                    <p className="text-xs text-[var(--on-surface-variant)] line-clamp-2 leading-relaxed flex-1">{a.excerpt}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)] mt-3">
                      <Clock size={10} className="text-[var(--primary)]" /> {a.readTime} read
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SUCCESS STORIES — asymmetric horizontal
      ══════════════════════════════════════════ */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">\\ Real People</p>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-3">Success Stories</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)]">Real transformations from real people.</p>
          </motion.div>

          {/* Large featured story + 2 stacked */}
          <div className="grid lg:grid-cols-5 gap-5">

            {/* Large left story */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 rounded-3xl overflow-hidden relative min-h-[320px] flex flex-col justify-end shadow-xl"
              style={{ background: "linear-gradient(135deg, #0a2e2b 0%, #0d4038 100%)" }}
            >
              {/* Dot grid */}
              <div className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

              <div className="relative z-10 p-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(147,210,204,0.2)", color: "#93d2cc", border: "1px solid rgba(147,210,204,0.3)" }}>
                  <Heart size={10} /> {stories[0].tag}
                </span>
                <p className="text-white/85 text-xl font-medium leading-relaxed mb-6 max-w-lg">
                  &ldquo;{stories[0].story}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                    <Image src={stories[0].image} alt={stories[0].name} fill className="object-cover" />
                  </div>
                  <p className="text-white font-bold">{stories[0].name}</p>
                </div>
              </div>
            </motion.div>

            {/* Right 2 stacked stories */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {stories.slice(1).map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex-1 bg-white rounded-2xl border border-[var(--outline-variant)]/30 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-4 ${i === 0 ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600"}`}>
                      <Sparkles size={9} /> {s.tag}
                    </span>
                    <p className="text-sm text-[var(--on-surface-variant)] italic leading-relaxed mb-5">
                      &ldquo;{s.story}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--outline-variant)]/30">
                      <Image src={s.image} alt={s.name} fill className="object-cover" />
                    </div>
                    <span className="font-bold text-[var(--on-surface)] text-sm">{s.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MEDITATION — split with checklist
      ══════════════════════════════════════════ */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — image with overlay badge */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/images/emotional-fitness.png"
                  alt="Meditation"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
              </div>
              {/* Floating stat */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -bottom-5 -right-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-xl border border-[var(--outline-variant)]/30"
              >
                <p className="text-2xl font-bold text-[var(--primary)] leading-none">60+</p>
                <p className="text-xs text-[var(--on-surface-variant)] mt-1">Meditation sessions</p>
              </motion.div>
            </motion.div>

            {/* Right — content */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-4">\\ Guided Practice</p>
              <h2 className="text-headline-lg text-[var(--on-surface)] mb-5">Guided Exercises & Meditation</h2>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-8 leading-relaxed">
                Access guided meditations, breathing exercises, sleep stories, and brain music.
              </p>

              <ul className="space-y-3 mb-8">
                {meditationFeatures.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="flex items-center gap-3 text-[var(--on-surface-variant)] text-sm"
                  >
                    <CheckCircle size={16} className="text-[var(--primary-bright)] flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link href="/resources" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5">
                  Explore Library <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}