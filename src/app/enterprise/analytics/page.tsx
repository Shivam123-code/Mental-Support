import Link from "next/link";
import { BarChart3, TrendingUp, AlertTriangle, Users, Activity, PieChart, ArrowRight } from "lucide-react";

const metrics = [
  { title: "Burnout Trends", desc: "Track burnout risk across teams and departments with predictive analytics", icon: TrendingUp },
  { title: "Engagement Metrics", desc: "Measure wellness program utilization and employee engagement levels", icon: Activity },
  { title: "Risk Indicators", desc: "Early warning system for team-level stress and disengagement patterns", icon: AlertTriangle },
  { title: "Department Insights", desc: "Compare wellbeing scores across teams to identify areas needing support", icon: Users },
  { title: "ROI Dashboard", desc: "Measure the business impact of wellness investments on productivity", icon: PieChart },
  { title: "Custom Reports", desc: "Generate tailored reports for leadership and board presentations", icon: BarChart3 },
];

export default function EnterpriseAnalytics() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><BarChart3 size={14} /> Data-Driven Wellness</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Enterprise Analytics</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Understand your workforce&apos;s emotional health with powerful, privacy-preserving analytics. Spot risks early and measure impact.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((m) => (
              <div key={m.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5">
                  <m.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{m.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Schedule a Demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
