import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Brain, Users, Briefcase, Baby, Shield, Sparkles } from "lucide-react";
import SafetyDisclaimer from "@/components/ui/SafetyDisclaimer";

const supportCategories = [
  {
    title: "Emotional Health",
    icon: Heart,
    image: "/images/get-support.png",
    items: ["Anxiety", "Depression", "Stress", "Trauma", "Panic", "Grief", "Emotional Imbalance"],
  },
  {
    title: "Relationships & Family",
    icon: Users,
    image: "/images/relationship-healing.png",
    items: ["Couples Support", "Divorce Recovery", "Parenting Support", "Family Conflict", "Single Parenting"],
  },
  {
    title: "Life & Career",
    icon: Briefcase,
    image: "/images/burnout-reset.png",
    items: ["Career Counselling", "Burnout", "Leadership Stress", "Workplace Pressure", "Interview Anxiety"],
  },
  {
    title: "Children & Teenagers",
    icon: Baby,
    image: "/images/parenting-confidence.png",
    items: ["ADHD", "Exam Stress", "Emotional Growth", "Learning Challenges", "Behavioural Support"],
  },
  {
    title: "Special Support",
    icon: Shield,
    image: "/images/community-support.png",
    items: ["Domestic Abuse", "Addiction Recovery", "Crisis Support", "Emotional Trauma"],
  },
  {
    title: "Personal Growth",
    icon: Sparkles,
    image: "/images/confidence-building.png",
    items: ["Confidence Building", "EQ Development", "Communication Skills", "Focus & Productivity"],
  },
];

export default function GetSupport() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-20 right-[5%] w-[300px] h-[300px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Get the <span className="text-gradient">Support</span> You Deserve
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-10 max-w-lg">
                Whatever you&apos;re going through, you don&apos;t have to face it alone. Find the right support for your unique journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/assessments" className="btn-primary">
                  Take Assessment
                </Link>
                <Link href="/professionals" className="btn-secondary">
                  Find Professional
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/hero-woman.png"
                alt="Supportive environment"
                width={550}
                height={450}
                className="rounded-xl shadow-ambient"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
              Explore Support Categories
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Browse our comprehensive support areas designed around real human experiences and challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportCategories.map((cat) => (
              <div key={cat.title} className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden border-hairline hover:shadow-ambient-hover transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <cat.icon className="text-white" size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{cat.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2.5">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--on-surface-variant)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-bright)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/professionals" className="inline-flex items-center gap-2 mt-5 text-[var(--primary)] font-semibold text-sm hover:gap-3 transition-all">
                    Get Support <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Assurance */}
      <section className="section-gap bg-[var(--surface-container)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
            <Brain className="text-[var(--primary)]" size={28} />
          </div>
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Your Privacy is Sacred</h2>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto mb-10">
            All conversations are encrypted. Anonymous mode available. You control your data.
            We follow DPDP compliance and the highest ethical standards.
          </p>
          <Link href="/assessments" className="btn-primary">
            Start Your Journey — Free & Private
          </Link>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <section className="py-6 sm:py-8 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <SafetyDisclaimer />
        </div>
      </section>
    </div>
  );
}
