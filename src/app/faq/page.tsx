"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Phone, Shield, Heart } from "lucide-react";

const faqCategories = [
  {
    title: "General",
    questions: [
      { q: "What is KleverKlues?", a: "KleverKlues is the world's most trusted Human Wellbeing & Emotional Support Ecosystem. We provide private, guided, emotionally intelligent support for stress, anxiety, burnout, relationships, and personal growth through verified professionals, guided programs, and a supportive community." },
      { q: "Is KleverKlues a therapy app?", a: "KleverKlues is more than a therapy app — it's a Human Wellbeing Infrastructure Platform. We combine professional support, guided programs, community circles, assessments, and AI-assisted guidance into one ecosystem focused on holistic emotional wellbeing." },
      { q: "Who is KleverKlues for?", a: "KleverKlues is for everyone — individuals, families, students, professionals, organizations, and institutions. Whether you're dealing with stress, seeking personal growth, or want to support your team's wellbeing, we have solutions for you." },
      { q: "Is it available in my language?", a: "We currently support English and Hindi, with more Indian languages (Marathi, Tamil, Bengali, Telugu, Kannada, Malayalam) being added progressively. Our goal is full multilingual support." },
    ],
  },
  {
    title: "Privacy & Safety",
    questions: [
      { q: "Is my data private and secure?", a: "Absolutely. We use end-to-end encryption, follow DPDP compliance, and practice minimal data collection. You can use anonymous mode, export your data, or delete your account anytime. We never sell personal data." },
      { q: "Can I use KleverKlues anonymously?", a: "Yes! Anonymous mode is available for all services. You can access support, take assessments, and join communities without revealing your identity." },
      { q: "What happens in a crisis?", a: "Our SOS system provides 24/7 crisis support through chat, call, and callback. All crisis responders are clinically supervised. We also connect you with local emergency services and national helplines when needed." },
      { q: "Are the professionals verified?", a: "Every professional undergoes rigorous verification — qualification checks, background verification, clinical supervision, and ongoing quality monitoring. Look for the verified badge on profiles." },
    ],
  },
  {
    title: "Sessions & Booking",
    questions: [
      { q: "How do I book a session?", a: "Visit our Book Session page, choose your session type (video, chat, or call), select a date and time, pick a professional (or let us auto-match you), and confirm. You'll receive a confirmation with joining details." },
      { q: "What session types are available?", a: "We offer Video Sessions (50 min, ₹1,499), Chat Sessions (45 min, ₹999), Voice Calls (45 min, ₹1,199), Couple Sessions (60 min, ₹2,499), and Child/Teen Sessions (40 min, ₹1,299)." },
      { q: "Can I cancel or reschedule?", a: "Yes, free cancellation is available up to 4 hours before your session. You can reschedule anytime through your dashboard." },
      { q: "How does auto-matching work?", a: "Our system considers your assessment results, preferences, language, and specific needs to match you with the most suitable professional. You can always choose a different professional if you prefer." },
    ],
  },
  {
    title: "Programs & Assessments",
    questions: [
      { q: "What are guided programs?", a: "Guided programs are structured wellbeing journeys (4-12 weeks) designed by experts. They include sessions, exercises, tracking, and community support — all focused on specific goals like anxiety recovery, burnout reset, or confidence building." },
      { q: "Are assessments free?", a: "Your first assessment is free. With Essential or Premium plans, you get unlimited assessments. Pay-per-session users can purchase individual assessments." },
      { q: "How accurate are the assessments?", a: "Our assessments are designed by qualified psychologists using validated frameworks. They provide insights and guidance but are not clinical diagnoses. For clinical assessment, we connect you with qualified professionals." },
    ],
  },
  {
    title: "Pricing & Plans",
    questions: [
      { q: "Is there a free plan?", a: "Yes! Our Free plan includes 1 assessment, limited resource access, read-only community access, SOS crisis support, and daily mood check-ins. No credit card required." },
      { q: "What's included in the Essential plan?", a: "Essential (₹999/month) includes unlimited assessments, 2 sessions/month, full resource access, 1 guided program, community participation, AI recommendations, progress tracking, and priority support." },
      { q: "Can I cancel my subscription?", a: "Yes, cancel anytime. No lock-in contracts. Your access continues until the end of your billing period." },
      { q: "Do you offer enterprise pricing?", a: "Yes! We have Starter, Growth, and Enterprise plans for organizations. These include EAP programs, workshops, burnout analytics, and workforce wellbeing dashboards. Contact us for custom pricing." },
    ],
  },
  {
    title: "Community & Academy",
    questions: [
      { q: "What are support circles?", a: "Support circles are small, moderated groups of people sharing similar experiences. They provide peer support, guided discussions, and a safe space to connect with others on similar journeys." },
      { q: "How can I become a professional on KleverKlues?", a: "Visit our Join Us page, submit your profile and qualifications, complete our verification process (credential check, background verification), finish onboarding training, and start helping people." },
      { q: "What certifications does the Academy offer?", a: "Our Academy offers Counsellor Training (6 months), EQ Expert Certification (3 months), Mindfulness Trainer (3 months), and various short courses in parenting, student skills, and corporate training." },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[var(--outline-variant)] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-medium text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">{question}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[var(--outline)] transition-transform duration-200 mt-0.5 ${isOpen ? "rotate-180 text-[var(--primary)]" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="pb-5 pr-8">
          <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("General");

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--surface)] section-gap !pb-10 relative overflow-hidden">
        <div className="absolute top-20 right-[8%] w-[280px] h-[280px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none hidden lg:block" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            Find answers to common questions about KleverKlues, our services, privacy, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-1">
                <p className="text-label-bold text-[var(--outline)] uppercase tracking-wider mb-4">Categories</p>
                {faqCategories.map((cat) => (
                  <button
                    key={cat.title}
                    onClick={() => setActiveCategory(cat.title)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeCategory === cat.title
                        ? "bg-[var(--primary-fixed)] text-[var(--primary)]"
                        : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--primary)]"
                    }`}
                  >
                    {cat.title} ({cat.questions.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-3">
              <div className="card">
                <h2 className="text-headline-md text-[var(--on-surface)] mb-6">{activeCategory}</h2>
                <div>
                  {faqCategories
                    .find((c) => c.title === activeCategory)
                    ?.questions.map((item) => (
                      <FAQItem key={item.q} question={item.q} answer={item.a} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 sm:py-20 bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Heart className="mx-auto text-[var(--primary-bright)] mb-4" size={32} />
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Still Have Questions?</h2>
          <p className="text-[var(--on-surface-variant)] mb-8">Our team is here to help. Reach out anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary inline-flex items-center justify-center gap-2">
              Contact Us <ArrowRight size={16} />
            </Link>
            <Link href="/sos" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--error)] text-white font-semibold rounded-lg hover:bg-[var(--on-error-container)] transition-all">
              <Phone size={16} /> Crisis? Get Help Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
