import Link from "next/link";
import { Brain, TrendingUp, BarChart3, Globe, FileText, ArrowRight, Users, BookOpen } from "lucide-react";

const researchAreas = [
  { icon: TrendingUp, title: "Burnout Trends", desc: "Analyzing workplace burnout patterns across industries and demographics." },
  { icon: Users, title: "Workforce Emotional Health", desc: "Understanding how emotional wellbeing impacts productivity and retention." },
  { icon: Brain, title: "Student Stress Analytics", desc: "Research into academic pressure, exam anxiety, and youth emotional health." },
  { icon: BarChart3, title: "Relationship Wellbeing Trends", desc: "Data-driven insights into relationship health and family dynamics." },
  { icon: Globe, title: "Emotional Resilience Indicators", desc: "Identifying factors that build emotional resilience across populations." },
  { icon: FileText, title: "AI-Human Emotional Interaction", desc: "Studying how AI can ethically support human emotional wellbeing." },
];

const reports = [
  { title: "India Mental Wellness Index", year: "2026", status: "Coming Soon" },
  { title: "Workplace Burnout Index", year: "2026", status: "Coming Soon" },
  { title: "Youth Emotional Health Report", year: "2026", status: "Coming Soon" },
  { title: "Global Human Wellbeing Report", year: "2027", status: "Planned" },
];

export default function Research() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="chip mx-auto w-fit mb-6"><Brain size={14} /> Research Institute</div>
            <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
              KleverKlues&trade; Research Institute
            </h1>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-xl mx-auto">
              Leading emotional wellbeing intelligence. Generating insights that shape policy, practice, and understanding of human mental health.
            </p>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Research Areas</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Active and planned research into human emotional wellbeing at scale.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {researchAreas.map((area) => (
              <div key={area.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                  <area.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{area.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Upcoming Reports</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {reports.map((report) => (
              <div key={report.title} className="card !p-4 sm:!p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--on-surface)] text-sm">{report.title}</h3>
                  <p className="text-xs text-[var(--on-surface-variant)]">Expected: {report.year}</p>
                </div>
                <span className="chip text-xs w-fit">{report.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-gap bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <BookOpen className="mx-auto text-[var(--primary)] mb-4" size={32} />
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Partner With Us</h2>
          <p className="text-[var(--on-surface-variant)] mb-8">We collaborate with universities, NGOs, governments, and healthcare organizations on wellbeing research.</p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">Get in Touch <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
