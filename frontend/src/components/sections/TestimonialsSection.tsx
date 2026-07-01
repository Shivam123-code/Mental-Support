"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    role: "Working Professional",
    text: "KleverKlues\u2122 helped me through my worst burnout phase. The anonymous sessions gave me the safety to open up.",
    rating: 5,
    initials: "PS",
    color: "from-[var(--primary-fixed)] to-[var(--secondary-fixed)]",
  },
  {
    name: "Arjun M.",
    role: "College Student",
    text: "The student programs changed my life. I learned to manage exam stress and build real confidence.",
    rating: 5,
    initials: "AM",
    color: "from-[var(--secondary-fixed)] to-[var(--tertiary-fixed)]",
  },
  {
    name: "Meera R.",
    role: "New Parent",
    text: "Parenting support circles helped me realize I wasn\u2019t alone. The community is genuinely warm and supportive.",
    rating: 5,
    initials: "MR",
    color: "from-[var(--tertiary-fixed)] to-[var(--primary-fixed)]",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-gap bg-[var(--surface-container-lowest)] relative overflow-hidden">

      {/* Giant decorative quote */}
      <div
        className="absolute -top-6 left-4 text-[220px] leading-none font-serif select-none pointer-events-none"
        style={{ color: "var(--primary-fixed)", opacity: 0.15 }}
      >
        &ldquo;
      </div>
      {/* Blob */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--secondary-fixed)]/20 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-[var(--primary-bright)] uppercase tracking-widest mb-3">
            \\ What People Say
          </p>
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Stories of Transformation</h2>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            Real stories from real people whose lives were changed through emotional support and community care.
          </p>
        </motion.div>

        {/* Asymmetric layout — 1 large left + 2 stacked right */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5 items-stretch">

          {/* Featured large card — first testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden min-h-[320px]"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, #0d5c55 100%)" }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/8 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* Quote icon */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                <Quote size={22} className="text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonials[0].rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.3, type: "spring" }}
                  >
                    <Star size={18} className="fill-yellow-300 text-yellow-300" />
                  </motion.div>
                ))}
              </div>

              <p className="text-white text-xl sm:text-2xl font-medium leading-relaxed mb-8">
                &ldquo;{testimonials[0].text}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[0].color} flex items-center justify-center flex-shrink-0 border-2 border-white/30`}>
                <span className="text-[var(--primary)] font-bold text-sm">{testimonials[0].initials}</span>
              </div>
              <div>
                <p className="text-white font-bold">{testimonials[0].name}</p>
                <p className="text-white/60 text-sm">{testimonials[0].role}</p>
              </div>
            </div>
          </motion.div>

          {/* Right column — 2 stacked cards */}
          <div className="flex flex-col gap-5">
            {testimonials.slice(1).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex-1 relative rounded-3xl p-7 bg-white border border-[var(--outline-variant)]/30 shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Accent corner */}
                <div
                  className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40"
                  style={{ background: `linear-gradient(135deg, var(--primary-fixed), var(--secondary-fixed))` }}
                />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.15 + si * 0.06, type: "spring" }}
                    >
                      <Star size={15} className="fill-[var(--tertiary-bright)] text-[var(--tertiary-bright)]" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-[var(--on-surface)] leading-relaxed mb-5 italic text-[15px]">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-[var(--primary)] font-bold text-xs">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--on-surface)] text-sm">{t.name}</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
