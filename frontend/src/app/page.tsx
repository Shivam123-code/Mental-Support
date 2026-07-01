"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ServicesCarousel from "@/components/sections/ServicesCarousel";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import HumanConnectionSection from "@/components/sections/HumanConnectionSection";
import TrustSafetySection from "@/components/sections/TrustSafetySection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import EnterpriseSection from "@/components/sections/EnterpriseSection";
import {
  Shield, Lock, Users, Brain, Heart, Sparkles,
  ArrowRight, ArrowUpRight, CheckCircle, Star, Clock, Globe, Phone
} from "lucide-react";

const categories = [
  { name: "Stress", icon: "🧠", desc: "Managing daily pressures" },
  { name: "Anxiety", icon: "💭", desc: "Finding calm within" },
  { name: "Burnout", icon: "🔥", desc: "Recovery & prevention" },
  { name: "Relationships", icon: "💞", desc: "Healing connections" },
  { name: "Parenting", icon: "👨‍👩‍👧", desc: "Confident parenting" },
  { name: "Career Pressure", icon: "💼", desc: "Professional growth" },
  { name: "Sleep Issues", icon: "🌙", desc: "Rest & recovery" },
  { name: "Students", icon: "📚", desc: "Academic support" },
  { name: "Emotional Healing", icon: "🌱", desc: "Inner growth" },
  { name: "Crisis Support", icon: "🆘", desc: "Immediate help" },
];

const programs = [
  { name: "Anxiety Recovery", duration: "8 weeks", image: "/images/anxiety-recovery.png" },
  { name: "Burnout Reset", duration: "6 weeks", image: "/images/burnout-reset.png" },
  { name: "Emotional Fitness", duration: "12 weeks", image: "/images/emotional-fitness.png" },
  { name: "Parenting Confidence", duration: "8 weeks", image: "/images/parenting-confidence.png" },
  { name: "Student Focus", duration: "4 weeks", image: "/images/student-focus.png" },
  { name: "Relationship Healing", duration: "10 weeks", image: "/images/relationship-healing.png" },
  { name: "Sleep Recovery", duration: "6 weeks", image: "/images/sleep-recovery.png" },
  { name: "Confidence Building", duration: "8 weeks", image: "/images/confidence-building.png" },
];

const steps = [
  { step: "01", title: "Assess", desc: "Take a free wellbeing assessment to understand your emotional health", icon: Brain },
  { step: "02", title: "Match", desc: "Get matched with verified professionals who understand your needs", icon: Users },
  { step: "03", title: "Support", desc: "Receive personalized guidance through sessions & programs", icon: Heart },
  { step: "04", title: "Progress", desc: "Track your growth, celebrate milestones, and build resilience", icon: Sparkles },
];

const testimonials = [
  { name: "Priya S.", role: "Working Professional", text: "KleverKlues&trade; helped me through my worst burnout phase. The anonymous sessions gave me the safety to open up.", rating: 5 },
  { name: "Arjun M.", role: "College Student", text: "The student programs changed my life. I learned to manage exam stress and build real confidence.", rating: 5 },
  { name: "Meera R.", role: "New Parent", text: "Parenting support circles helped me realize I wasn't alone. The community is genuinely warm and supportive.", rating: 5 },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--surface-container-low)] via-[var(--surface)] to-[var(--surface-container-lowest)] pt-10 pb-8 sm:py-16 lg:py-20 min-h-[580px] sm:min-h-[620px] lg:min-h-[645px] flex flex-col justify-between">
        {/* Full-bleed background image on the right, fading into the solid background on the left */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h-full z-0 pointer-events-none select-none">
          <Image
            src="/images/hero-woman.png"
            alt="Mental wellness support background"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-right-top lg:object-center opacity-30 lg:opacity-100"
            priority
          />
          {/* Seamless blend gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/60 to-[var(--surface)] lg:bg-gradient-to-r lg:from-[var(--surface)] lg:via-[var(--surface)]/30 lg:to-transparent" />
        </div>

        {/* Soft decorative background glow */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[var(--primary-bright)]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 w-full relative z-10 my-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Column: Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="lg:col-span-7 space-y-6 lg:space-y-10 text-center lg:text-left"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--outline-variant)] rounded-full text-xs font-semibold text-[var(--primary)] bg-[var(--surface-container-low)]/50 mx-auto lg:mx-0"
              >
                <Sparkles size={12} className="text-[var(--primary-bright)]" />
                Human Wellbeing Ecosystem
              </motion.div>
              
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-display-xl text-[var(--on-surface)] leading-[1.1] tracking-tight"
              >
                Mental wellness support, <br />
                <span className="font-serif italic font-normal text-[var(--primary-bright)]">Anytime, Anywhere.</span>
              </motion.h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-body-lg text-[var(--on-surface-variant)] leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Private, guided, emotionally intelligent support for stress, anxiety, burnout, relationships, emotional wellbeing, and personal growth.
              </motion.p>
              
              {/* CTAs */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3"
              >
                <Link href="/assessments" className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--primary-container)] shadow-sm hover:shadow transition-all duration-200 text-center">
                  Start Free Assessment
                </Link>
                <Link href="/book-session" className="w-full sm:w-auto px-6 py-3 sm:py-3.5 border border-[var(--outline-variant)] text-[var(--on-surface)] text-sm font-semibold rounded-full hover:bg-[var(--surface-container-low)] transition-all duration-200 text-center">
                  Book a Session
                </Link>
                <Link href="/sos" className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 bg-red-50 text-[var(--error)] border border-red-200 text-sm font-semibold rounded-full hover:bg-red-100 transition-all duration-200">
                  <Phone size={14} />
                  SOS — Get Help Now
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block lg:col-span-5 relative min-h-[460px] flex items-center justify-start">
              {/* Floating Counselor Card overlaying the background image - Left aligned over the shoulder, compact size */}
              <motion.div 
                initial={{ opacity: 0, x: -30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
                className="absolute top-[25%] lg:top-[30%] left-0 lg:-left-20 bg-white/95 backdrop-blur-md border border-white/40 shadow-lg rounded-xl p-2.5 flex items-center gap-2.5 w-full max-w-[245px] z-10"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden relative flex-shrink-0 border border-white shadow-sm">
                  <Image
                    src="/images/prof-dr-ananya.png"
                    alt="Dr. Ananya Rao"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[10px] text-[var(--on-surface)] truncate">Dr. Ananya Rao</p>
                  <p className="text-[8px] text-[var(--on-surface-variant)] leading-snug">
                    Your Dedicated Wellness Partner & Verified Specialist
                  </p>
                </div>
                <Link href="/professionals" className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary-bright)] transition-colors flex-shrink-0">
                  <ArrowUpRight size={10} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Capsule Tag Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.65, ease: "easeOut" }}
          className="max-w-[1280px] mx-auto px-6 w-full mt-auto pt-8"
        >
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-3 pt-6 border-t border-[var(--outline-variant)]/30 w-full">
            {[
              { icon: "🕶️",  label: "Anonymous Mode" },
              { icon: "✅",  label: "Verified Professionals" },
              { icon: "🆘",  label: "24×7 Crisis Support" },
              { icon: "🔒",  label: "Privacy & DPDP Ready" },
              { icon: "🌐",  label: "Multilingual Support" },
              { icon: "🤖",  label: "AI-Assisted Guidance" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--outline-variant)]/60 rounded-full text-xs font-semibold text-[var(--on-surface-variant)] bg-white/40 backdrop-blur-sm hover:bg-white/70 hover:text-[var(--primary)] hover:border-[var(--primary-bright)]/40 transition-all cursor-default"
              >
                <span>{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
        </motion.div>

      </section>

      {/* Core Services / Categories — Carousel Layout */}
      <ServicesCarousel />


      {/* How It Works — Glassmorphism redesign */}
      <HowItWorksSection />

      {/* Programs — Bento Grid redesign */}
      <ProgramsSection />

      {/* Human Connection — Premium redesign */}
      <HumanConnectionSection />

      {/* Trust & Safety — Full redesign */}
      <TrustSafetySection />

      {/* Enterprise — Full redesign */}
      <EnterpriseSection />

      {/* Testimonials — Full redesign */}
      <TestimonialsSection />

      {/* Impact Stats */}
      <section className="py-20 bg-[var(--inverse-surface)] text-white relative overflow-hidden">
        {/* Orbit motifs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/8 rounded-full pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "People Supported" },
              { value: "500+", label: "Verified Professionals" },
              { value: "50+", label: "Programs Available" },
              { value: "24/7", label: "Crisis Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl md:text-5xl font-display font-medium">{stat.value}</p>
                <p className="text-white/60 mt-2 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
