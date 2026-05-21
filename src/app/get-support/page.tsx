import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Brain, Users, Briefcase, Baby, Shield, Sparkles } from "lucide-react";

const supportCategories = [
  {
    title: "Emotional Health",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=500&h=350&fit=crop",
    items: ["Anxiety", "Depression", "Stress", "Trauma", "Panic", "Grief", "Emotional Imbalance"],
  },
  {
    title: "Relationships & Family",
    icon: Users,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&h=350&fit=crop",
    items: ["Couples Support", "Divorce Recovery", "Parenting Support", "Family Conflict", "Single Parenting"],
  },
  {
    title: "Life & Career",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=350&fit=crop",
    items: ["Career Counselling", "Burnout", "Leadership Stress", "Workplace Pressure", "Interview Anxiety"],
  },
  {
    title: "Children & Teenagers",
    icon: Baby,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=350&fit=crop",
    items: ["ADHD", "Exam Stress", "Emotional Growth", "Learning Challenges", "Behavioural Support"],
  },
  {
    title: "Special Support",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1559234938-b60fff04894d?w=500&h=350&fit=crop",
    items: ["Domestic Abuse", "Addiction Recovery", "Crisis Support", "Emotional Trauma"],
  },
  {
    title: "Personal Growth",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=500&h=350&fit=crop",
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
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=550&h=450&fit=crop"
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
    </div>
  );
}
