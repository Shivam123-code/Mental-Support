import Link from "next/link";
import { BarChart3, Shield, Users, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

const metrics = [
  { label: "Content Reports Reviewed", value: "12,847", change: "+8% from last quarter" },
  { label: "Average Response Time", value: "< 4 hrs", change: "Improved 22%" },
  { label: "Professional Verifications", value: "1,230", change: "98.5% pass rate" },
  { label: "Crisis Interventions", value: "342", change: "100% responded within 15 min" },
  { label: "Community Guideline Actions", value: "1,056", change: "94% resolved within 24 hrs" },
  { label: "User Satisfaction", value: "4.8/5", change: "Based on 25K+ reviews" },
];

export default function Transparency() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><BarChart3 size={14} /> Accountability</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Transparency Reports</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            We believe in radical transparency. Here&apos;s how we&apos;re keeping our community safe — with real data, real actions, and real accountability.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((m) => (
              <div key={m.label} className="card group hover:-translate-y-1 transition-all duration-300">
                <p className="text-2xl font-display font-medium text-[var(--primary)] mb-2">{m.value}</p>
                <h3 className="font-semibold text-[var(--on-surface)] mb-1">{m.label}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{m.change}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/about" className="btn-primary inline-flex items-center gap-2">
              Learn About Our Mission <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
