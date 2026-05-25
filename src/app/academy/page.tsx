import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Award, Clock, Users, Star, ArrowRight, CheckCircle, BookOpen } from "lucide-react";

const trainingCategories = [
  {
    title: "Professional Certifications",
    description: "Become a certified wellbeing professional",
    courses: [
      { name: "Certified Counsellor Training", duration: "6 months", level: "Professional", image: "/images/therapist-session.png", price: "₹49,999" },
      { name: "EQ Expert Certification", duration: "3 months", level: "Advanced", image: "/images/emotional-fitness.png", price: "₹29,999" },
      { name: "Wellbeing Facilitator", duration: "4 months", level: "Intermediate", image: "/images/community-support.png", price: "₹34,999" },
      { name: "Mindfulness Trainer", duration: "3 months", level: "Professional", image: "/images/anxiety-recovery.png", price: "₹24,999" },
    ],
  },
  {
    title: "Parenting & Child Programs",
    description: "Build confident, emotionally intelligent children",
    courses: [
      { name: "Parenting Mastery", duration: "8 weeks", level: "All Levels", image: "/images/parenting-confidence.png", price: "₹9,999" },
      { name: "Child Emotional Intelligence", duration: "6 weeks", level: "Parents", image: "/images/parenting-confidence.png", price: "₹7,999" },
    ],
  },
  {
    title: "Student Skill Programs",
    description: "Build essential life skills for academic success",
    courses: [
      { name: "Focus Enhancement", duration: "4 weeks", level: "Students", image: "/images/student-focus.png", price: "₹4,999" },
      { name: "Communication Skills", duration: "6 weeks", level: "Students", image: "/images/student-focus.png", price: "₹5,999" },
      { name: "Confidence Building", duration: "4 weeks", level: "Students", image: "/images/confidence-building.png", price: "₹4,499" },
    ],
  },
  {
    title: "Corporate Training",
    description: "Wellbeing training for organizational leaders",
    courses: [
      { name: "Leadership EQ", duration: "8 weeks", level: "Leaders", image: "/images/enterprise-team.png", price: "₹19,999" },
      { name: "Workforce Resilience", duration: "6 weeks", level: "Teams", image: "/images/enterprise-team.png", price: "₹14,999" },
      { name: "Stress Management", duration: "4 weeks", level: "Managers", image: "/images/burnout-reset.png", price: "₹12,999" },
    ],
  },
];


export default function Academy() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-10 right-[8%] w-[300px] h-[300px] border border-[var(--tertiary-bright)]/10 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="chip mb-6"><GraduationCap size={14} /> KleverKlues&trade; Academy</div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Learn. Grow. <span className="text-gradient">Certify.</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-10 max-w-lg">
                Professional certifications, skill programs, and wellness training designed to help you grow and help others grow.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-[var(--on-surface-variant)]">
                <div className="flex items-center gap-2"><Award size={16} className="text-[var(--tertiary)]" /> Certified Programs</div>
                <div className="flex items-center gap-2"><BookOpen size={16} className="text-[var(--primary)]" /> Expert Instructors</div>
                <div className="flex items-center gap-2"><Users size={16} className="text-[var(--secondary)]" /> Community Learning</div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image src="/images/assessment-focus.png" alt="Academy" width={550} height={450} className="rounded-xl shadow-ambient" />
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          {trainingCategories.map((cat) => (
            <div key={cat.title} className="mb-24 last:mb-0">
              <div className="mb-10">
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">{cat.title}</h2>
                <p className="text-[var(--on-surface-variant)]">{cat.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cat.courses.map((c) => (
                  <div key={c.name} className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden border-hairline hover:shadow-ambient-hover transition-all duration-300 group cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <Image src={c.image} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 chip !bg-white/90 !backdrop-blur-sm !text-[var(--primary)] text-xs">{c.level}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-2">{c.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-[var(--on-surface-variant)] mb-3"><Clock size={12} /> {c.duration}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--primary)]">{c.price}</span>
                        <ArrowRight size={14} className="text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Academy */}
      <section className="section-gap bg-[var(--surface-container)]">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-12">Why KleverKlues&trade; Academy?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Industry Recognized", desc: "Certifications valued by employers" },
              { icon: Star, title: "Expert Faculty", desc: "Learn from top practitioners" },
              { icon: Users, title: "Community Support", desc: "Learn alongside peers" },
              { icon: CheckCircle, title: "Earn While Learning", desc: "Start earning as you certify" },
            ].map((i) => (
              <div key={i.title} className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center"><i.icon className="text-[var(--primary)]" size={22} /></div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{i.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}