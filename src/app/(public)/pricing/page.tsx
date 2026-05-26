import Link from "next/link";
import { CheckCircle, ArrowRight, Star, Shield, Users, Building2, GraduationCap, Heart, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Start your wellbeing journey with essential tools.",
    popular: false,
    features: [
      "1 Free Assessment",
      "Resource Hub access (limited)",
      "Community access (read-only)",
      "SOS Crisis support",
      "Daily mood check-in",
      "Wellbeing articles & tips",
    ],
    cta: "Get Started Free",
    href: "/login",
  },
  {
    name: "Essential",
    price: "₹999",
    period: "/month",
    description: "Personalized support with professional guidance.",
    popular: true,
    features: [
      "Unlimited Assessments",
      "2 Sessions/month (video/chat/call)",
      "Full Resource Hub access",
      "1 Guided Program included",
      "Community participation",
      "AI Recommendations",
      "Progress tracking & insights",
      "Mood journal with patterns",
      "Priority support",
    ],
    cta: "Start Essential",
    href: "/login",
  },
  {
    name: "Premium",
    price: "₹2,499",
    period: "/month",
    description: "Complete wellbeing ecosystem with unlimited access.",
    popular: false,
    features: [
      "Everything in Essential",
      "Unlimited Sessions",
      "All Programs included",
      "AI Companion (coming soon)",
      "Priority professional matching",
      "Family account (up to 4 members)",
      "Exclusive community circles",
      "Personal care coordinator",
      "Advanced analytics & trends",
      "WhatsApp support channel",
    ],
    cta: "Start Premium",
    href: "/login",
  },
];

const sessionPricing = [
  { type: "Video Session", duration: "50 min", price: "₹1,499", note: "Face-to-face secure video" },
  { type: "Chat Session", duration: "45 min", price: "₹999", note: "Real-time text support" },
  { type: "Voice Call", duration: "45 min", price: "₹1,199", note: "Audio-only session" },
  { type: "Couple Session", duration: "60 min", price: "₹2,499", note: "For partners together" },
  { type: "Child/Teen Session", duration: "40 min", price: "₹1,299", note: "Age-appropriate support" },
];

const enterprisePlans = [
  { name: "Starter", employees: "Up to 50", price: "₹49,999/yr", features: ["Basic EAP", "5 workshops/year", "Wellbeing dashboard"] },
  { name: "Growth", employees: "50–500", price: "₹1,99,999/yr", features: ["Full EAP", "Unlimited workshops", "Burnout analytics", "Leadership coaching"] },
  { name: "Enterprise", employees: "500+", price: "Custom", features: ["Everything in Growth", "Dedicated account manager", "Custom integrations", "On-site programs"] },
];

export default function Pricing() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--surface)] section-gap !pb-8 sm:!pb-12 relative overflow-hidden">
        <div className="absolute top-10 right-[5%] w-[300px] h-[300px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none hidden lg:block" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <div className="chip mx-auto w-fit mb-6">
            <Sparkles size={14} />
            Transparent Pricing
          </div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">
            Plans for Every <span className="text-gradient">Journey</span>
          </h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            Ethical, transparent pricing. No hidden fees. No exploitative tactics. Start free and upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="section-gap !pt-8 sm:!pt-12 bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${
                  plan.popular ? "!border-[var(--primary-bright)] ring-1 ring-[var(--primary-bright)] !bg-[var(--surface-container-lowest)]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--primary-bright)] text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star size={11} /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--on-surface)]">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-display font-medium text-[var(--on-surface)]">{plan.price}</span>
                    <span className="text-sm text-[var(--on-surface-variant)]">{plan.period}</span>
                  </div>
                  <p className="text-sm text-[var(--on-surface-variant)] mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--on-surface-variant)]">
                      <CheckCircle size={15} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                    plan.popular
                      ? "btn-primary"
                      : "border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary-bright)] hover:text-[var(--primary)]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session Pricing */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Pay-Per-Session</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Prefer to pay as you go? Book individual sessions without a subscription.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-3">
              {sessionPricing.map((session) => (
                <div key={session.type} className="card !p-4 sm:!p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--on-surface)] text-sm">{session.type}</h3>
                    <p className="text-xs text-[var(--on-surface-variant)]">{session.note} · {session.duration}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[var(--primary)] text-lg">{session.price}</span>
                    <Link href="/book-session" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
                      Book <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Pricing */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="chip mx-auto w-fit mb-4"><Building2 size={14} /> For Organizations</div>
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Enterprise Plans</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Invest in your team&apos;s emotional wellbeing. Reduce burnout, improve retention.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {enterprisePlans.map((plan) => (
              <div key={plan.name} className="card">
                <h3 className="font-semibold text-[var(--on-surface)] text-lg">{plan.name}</h3>
                <p className="text-xs text-[var(--on-surface-variant)] mt-1">{plan.employees} employees</p>
                <p className="text-2xl font-display font-medium text-[var(--primary)] mt-4">{plan.price}</p>
                <ul className="mt-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--on-surface-variant)]">
                      <CheckCircle size={14} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/enterprise" className="btn-secondary w-full text-center mt-6 block text-sm">
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Pricing Preview */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <div className="chip mb-4"><GraduationCap size={14} /> Academy</div>
              <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Academy & Certifications</h2>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-6">
                Professional certifications starting from ₹4,999. Earn while you learn.
              </p>
              <ul className="space-y-3">
                {["Counsellor Training — ₹49,999", "EQ Expert — ₹29,999", "Student Programs — from ₹4,499", "Corporate Training — from ₹12,999"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--on-surface-variant)]">
                    <CheckCircle size={14} className="text-[var(--primary-bright)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/academy" className="btn-primary inline-flex items-center gap-2 mt-8">
                View All Courses <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card !bg-[var(--surface-container)] text-center">
              <Heart className="mx-auto text-[var(--primary-bright)] mb-4" size={32} />
              <h3 className="text-headline-md text-[var(--on-surface)] mb-3">Our Promise</h3>
              <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
                Revenue never compromises emotional trust. We maintain ethical monetization, user-first wellbeing, transparent pricing, and balanced free &amp; premium access.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {["No hidden fees", "Cancel anytime", "Ethical pricing"].map((item) => (
                  <span key={item} className="chip text-xs">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 sm:py-20 bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Have Questions?</h2>
          <p className="text-[var(--on-surface-variant)] mb-8">Check our FAQ or reach out to our team for help choosing the right plan.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/faq" className="btn-primary inline-flex items-center justify-center gap-2">
              View FAQ <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
