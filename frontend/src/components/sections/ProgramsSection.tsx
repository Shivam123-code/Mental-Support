"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Brain, Flame, Dumbbell, Baby, BookOpen, Heart, Moon, Star, ArrowRight } from "lucide-react";

const programs = [
  { name: "Anxiety Recovery",     duration: "8 weeks",  image: "/images/anxiety-recovery.png",    icon: Brain    },
  { name: "Burnout Reset",        duration: "6 weeks",  image: "/images/burnout-reset.png",        icon: Flame    },
  { name: "Emotional Fitness",    duration: "12 weeks", image: "/images/emotional-fitness.png",    icon: Dumbbell },
  { name: "Parenting Confidence", duration: "8 weeks",  image: "/images/parenting-confidence.png", icon: Baby     },
  {
    name: "Student Focus", duration: "4 weeks", image: "/images/student-focus.png", icon: BookOpen,
    featured: true,
    bullets: [
      "Calm exam anxiety, build clarity.",
      "Structured rest & focus techniques.",
      "Emotional balance & confidence.",
    ],
  },
  { name: "Relationship Healing", duration: "10 weeks", image: "/images/relationship-healing.png", icon: Heart },
  { name: "Sleep Recovery",       duration: "6 weeks",  image: "/images/sleep-recovery.png",       icon: Moon  },
  { name: "Confidence Building",  duration: "8 weeks",  image: "/images/confidence-building.png",  icon: Star  },
];

function ImageCard({ p, delay = 0 }: { p: typeof programs[0]; delay?: number }) {
  const Icon = p.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden group h-full"
    >
      <Link href="/programs" className="block w-full h-full">
        <Image src={p.image} alt={p.name} fill sizes="25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm leading-tight">{p.name}</h3>
          <p className="text-white/70 text-xs mt-0.5">{p.duration} program</p>
        </div>
        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <Icon size={12} className="text-white" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProgramsSection() {
  const left  = programs.slice(0, 4);
  const feat  = programs[4];
  const right = programs.slice(5);
  const FeatIcon = feat.icon;

  return (
    <section className="section-gap bg-[var(--surface-container-lowest)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Personalized Programs</h2>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            Guided wellbeing journeys designed by experts to help you heal, grow, and thrive.
          </p>
        </motion.div>

        {/* Bento Grid — 4 columns, fixed 456px height */}
        <div className="hidden lg:grid grid-cols-[1fr_1fr_1.15fr_0.9fr] gap-4 h-[456px]">

          {/* Col A — Anxiety + Emotional */}
          <div className="grid grid-rows-2 gap-4">
            <ImageCard p={left[0]} delay={0}   />
            <ImageCard p={left[2]} delay={0.1} />
          </div>

          {/* Col B — Burnout + Parenting */}
          <div className="grid grid-rows-2 gap-4">
            <ImageCard p={left[1]} delay={0.05} />
            <ImageCard p={left[3]} delay={0.15} />
          </div>

          {/* Col C — Featured: Student Focus */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-white border border-[var(--outline-variant)]/50 shadow-ambient-hover overflow-hidden"
          >
            <Link href="/programs" className="flex flex-col h-full group">
              {/* Image — 40% of height */}
              <div className="relative h-[180px] flex-shrink-0">
                <Image
                  src={feat.image} alt={feat.name} fill
                  sizes="25vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Text — remaining height */}
              <div className="flex flex-col flex-1 p-4">
                {/* Icon + title inline */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0">
                    <FeatIcon size={14} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--on-surface)] text-base leading-tight">{feat.name}</h3>
                    <p className="text-[10px] text-[var(--primary-bright)] font-semibold">{feat.duration} program</p>
                  </div>
                </div>

                <div className="h-px bg-[var(--outline-variant)]/40 mb-2.5" />

                {/* Bullets */}
                <ul className="space-y-1.5 flex-1">
                  {feat.bullets?.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-bright)] mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-[var(--on-surface-variant)] leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex items-center gap-1 text-[var(--primary)] text-xs font-semibold group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Col D — Right: 3 stacked */}
          <div className="grid grid-rows-3 gap-4">
            <ImageCard p={right[0]} delay={0.1}  />
            <ImageCard p={right[1]} delay={0.18} />
            <ImageCard p={right[2]} delay={0.26} />
          </div>
        </div>

        {/* Mobile — simple 2-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {programs.map((p, i) => {
            if (p.featured) {
              const FI = p.icon;
              return (
                <motion.div key={p.name}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="rounded-2xl bg-white border border-[var(--outline-variant)]/50 shadow-sm overflow-hidden"
                >
                  <Link href="/programs" className="flex flex-col">
                    <div className="relative h-[140px]">
                      <Image src={p.image} alt={p.name} fill sizes="50vw" className="object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center"><FI size={13} className="text-[var(--primary)]" /></div>
                        <div>
                          <h3 className="font-bold text-[var(--on-surface)] text-sm">{p.name}</h3>
                          <p className="text-[10px] text-[var(--primary-bright)] font-semibold">{p.duration} program</p>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {p.bullets?.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-1.5 text-xs text-[var(--on-surface-variant)]">
                            <div className="w-1 h-1 rounded-full bg-[var(--primary-bright)] mt-1.5 flex-shrink-0" />{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </motion.div>
              );
            }
            const Icon = p.icon;
            return (
              <motion.div key={p.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}
                className="relative rounded-2xl overflow-hidden h-[160px] group"
              >
                <Link href="/programs" className="block w-full h-full">
                  <Image src={p.image} alt={p.name} fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-sm">{p.name}</h3>
                    <p className="text-white/70 text-xs">{p.duration} program</p>
                  </div>
                  <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Icon size={12} className="text-white" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center mt-10">
          <Link href="/programs"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--on-surface)] text-[var(--surface)] font-semibold rounded-full hover:opacity-90 hover:scale-[1.02] transition-all shadow-md text-sm">
            View All Programs <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
