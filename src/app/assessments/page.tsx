import Image from "next/image";
import Link from "next/link";
import { Brain, Heart, Users, Briefcase, TrendingUp, Shield, ArrowRight, Clock, CheckCircle } from "lucide-react";

const assessmentCategories = [
  {
    title: "Emotional Wellness",
    icon: Heart,
    assessments: [
      { name: "Anxiety Index", duration: "5 min", description: "Understand your anxiety patterns and triggers" },
      { name: "Stress Score", duration: "4 min", description: "Measure your current stress levels" },
      { name: "Burnout Meter", duration: "6 min", description: "Check if you're heading towards burnout" },
      { name: "Mood Assessment", duration: "3 min", description: "Track and understand your emotional state" },
      { name: "Emotional Stability Check", duration: "7 min", description: "Evaluate your emotional regulation skills" },
    ],
  },
  {
    title: "Personality & Potential",
    icon: Brain,
    assessments: [
      { name: "Personality Insights", duration: "10 min", description: "Discover your personality traits and strengths" },
      { name: "EQ Assessment", duration: "8 min", description: "Measure your emotional intelligence" },
      { name: "Leadership Style", duration: "7 min", description: "Understand your natural leadership approach" },
      { name: "Communication Style", duration: "5 min", description: "Learn how you connect with others" },
    ],
  },
  {
    title: "Career & Learning",
    icon: Briefcase,
    assessments: [
      { name: "Career Aptitude", duration: "12 min", description: "Find careers that align with your strengths" },
      { name: "Learning Potential", duration: "8 min", description: "Discover your best learning methods" },
      { name: "Cognitive Strengths", duration: "10 min", description: "Map your cognitive abilities" },
      { name: "Productivity Analysis", duration: "6 min", description: "Optimize your work patterns" },
    ],
  },
  {
    title: "Relationship & Family",
    icon: Users,
    assessments: [
      { name: "Relationship Wellness", duration: "8 min", description: "Evaluate the health of your relationships" },
      { name: "Parenting Style", duration: "7 min", description: "Understand your approach to parenting" },
      { name: "Family Emotional Health", duration: "10 min", description: "Assess your family's emotional dynamics" },
    ],
  },
  {
    title: "Workplace Wellness",
    icon: TrendingUp,
    assessments: [
      { name: "Burnout Risk", duration: "5 min", description: "Identify early signs of workplace burnout" },
      { name: "Workforce Wellbeing", duration: "8 min", description: "Measure your overall work-life balance" },
      { name: "Leadership EQ", duration: "10 min", description: "Assess your leadership emotional intelligence" },
    ],
  },
];

export default function Assessments() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute -top-10 right-[10%] w-[350px] h-[350px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="chip mb-6">
                <Brain size={14} />
                Intelligence Center
              </div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Understand Yourself <span className="text-gradient">Better</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-10 max-w-lg">
                Take scientifically-designed assessments to gain deep insights into your emotional health, personality, relationships, and potential.
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-[var(--on-surface-variant)]">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[var(--primary)]" />
                  <span>3-12 minutes each</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-[var(--primary)]" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[var(--primary-bright)]" />
                  <span>Expert-Designed</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=550&h=450&fit=crop"
                alt="Person taking assessment"
                width={550}
                height={450}
                className="rounded-xl shadow-ambient"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Categories */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          {assessmentCategories.map((category) => (
            <div key={category.title} className="mb-20 last:mb-0">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-fixed)] flex items-center justify-center">
                  <category.icon size={22} className="text-[var(--primary)]" />
                </div>
                <h2 className="text-headline-md text-[var(--on-surface)]">{category.title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.assessments.map((assessment) => (
                  <div key={assessment.name} className="card group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                    <h3 className="font-semibold text-[var(--on-surface)] mb-2 group-hover:text-[var(--primary)] transition-colors">{assessment.name}</h3>
                    <p className="text-sm text-[var(--on-surface-variant)] mb-5 leading-relaxed">{assessment.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="chip !py-1 !px-3 text-xs">
                        <Clock size={11} /> {assessment.duration}
                      </span>
                      <ArrowRight size={16} className="text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Integration Preview */}
      <section className="py-24 bg-[var(--primary)] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <Brain size={28} className="text-white" />
          </div>
          <h2 className="text-headline-lg mb-4">AI-Powered Insights Coming Soon</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-10 text-body-lg">
            Our AI engine will provide personalized wellbeing insights, smart recommendations, emotional trend prediction, and personalized care journeys.
          </p>
          <Link href="/assessments" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all">
            Start Your First Assessment <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
