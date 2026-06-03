import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Users, Star, CheckCircle } from "lucide-react";
import { slugify } from "@/data/programs";

const programCategories = [
  {
    title: "Emotional Recovery",
    description: "Heal and rebuild your emotional foundation",
    programs: [
      { name: "Anxiety Reset", duration: "8 weeks", sessions: 16, image: "/images/anxiety-recovery.png", rating: 4.9 },
      { name: "Emotional Healing", duration: "12 weeks", sessions: 24, image: "/images/get-support.png", rating: 4.8 },
      { name: "Burnout Recovery", duration: "6 weeks", sessions: 12, image: "/images/burnout-reset.png", rating: 4.9 },
      { name: "Confidence Rebuild", duration: "8 weeks", sessions: 16, image: "/images/confidence-building.png", rating: 4.7 },
    ],
  },
  {
    title: "Relationships",
    description: "Strengthen bonds and heal connections",
    programs: [
      { name: "Couple Reconnection", duration: "10 weeks", sessions: 20, image: "/images/relationship-healing.png", rating: 4.8 },
      { name: "Marriage Wellbeing", duration: "12 weeks", sessions: 24, image: "/images/relationship-healing.png", rating: 4.9 },
      { name: "Parenting Confidence", duration: "8 weeks", sessions: 16, image: "/images/parenting-confidence.png", rating: 4.8 },
    ],
  },
  {
    title: "Student Programs",
    description: "Academic success and emotional growth",
    programs: [
      { name: "Focus Improvement", duration: "4 weeks", sessions: 8, image: "/images/student-focus.png", rating: 4.7 },
      { name: "Exam Confidence", duration: "6 weeks", sessions: 12, image: "/images/student-focus.png", rating: 4.8 },
      { name: "Emotional Resilience", duration: "8 weeks", sessions: 16, image: "/images/assessment-focus.png", rating: 4.9 },
    ],
  },
  {
    title: "Workplace Programs",
    description: "Thrive at work without burning out",
    programs: [
      { name: "Leadership Wellbeing", duration: "10 weeks", sessions: 20, image: "/images/enterprise-team.png", rating: 4.8 },
      { name: "Burnout Prevention", duration: "6 weeks", sessions: 12, image: "/images/burnout-reset.png", rating: 4.9 },
      { name: "Workplace EQ", duration: "8 weeks", sessions: 16, image: "/images/community-support.png", rating: 4.7 },
    ],
  },
  {
    title: "Lifestyle Wellness",
    description: "Build healthy habits for lasting wellbeing",
    programs: [
      { name: "Sleep Recovery", duration: "6 weeks", sessions: 12, image: "/images/sleep-recovery.png", rating: 4.9 },
      { name: "Mindfulness Journey", duration: "8 weeks", sessions: 16, image: "/images/hero-woman.png", rating: 4.8 },
      { name: "Emotional Fitness", duration: "12 weeks", sessions: 24, image: "/images/emotional-fitness.png", rating: 4.8 },
    ],
  },
];


export default function Programs() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute bottom-0 left-[5%] w-[250px] h-[250px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Guided Wellbeing <span className="text-gradient">Journeys</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-10 max-w-lg">
                Structured programs designed by experts to help you heal, grow, and build lasting emotional resilience. Step by step.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-[var(--on-surface-variant)]">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[var(--primary-bright)]" />
                  Expert-Designed
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[var(--primary)]" />
                  Self-Paced
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[var(--secondary)]" />
                  Community Support
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/hero-woman.png"
                alt="Personal growth journey"
                width={550}
                height={450}
                className="rounded-xl shadow-ambient"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          {programCategories.map((category) => (
            <div key={category.title} className="mb-24 last:mb-0">
              <div className="mb-10">
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">{category.title}</h2>
                <p className="text-[var(--on-surface-variant)]">{category.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.programs.map((program) => (
                  <Link
                    key={program.name}
                    href={`/programs/${slugify(program.name)}`}
                    className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden border-hairline hover:shadow-ambient-hover transition-all duration-300 group block"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image src={program.image} alt={program.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-2">{program.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-[var(--on-surface-variant)] mb-3">
                        <span className="flex items-center gap-1"><Clock size={12} /> {program.duration}</span>
                        <span>{program.sessions} sessions</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs">
                          <Star size={12} className="text-[var(--tertiary-bright)] fill-[var(--tertiary-bright)]" />
                          <span className="text-[var(--on-surface-variant)]">{program.rating}</span>
                        </span>
                        <ArrowRight size={14} className="text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-gap bg-[var(--surface-container)] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Not Sure Where to Start?</h2>
          <p className="text-body-lg text-[var(--on-surface-variant)] mb-10">Take a free assessment and we&apos;ll recommend the perfect program for you.</p>
          <Link href="/assessments" className="btn-primary">
            Take Free Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
