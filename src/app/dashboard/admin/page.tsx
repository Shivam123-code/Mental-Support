import Link from "next/link";
import { LayoutDashboard, BarChart3, Shield, AlertTriangle, UserCheck, FileText, ArrowRight } from "lucide-react";

const cards = [
  { title: "Platform Overview", desc: "System health, active users, and key metrics", icon: LayoutDashboard, href: "/dashboard" },
  { title: "User Analytics", desc: "Growth trends, retention, and engagement data", icon: BarChart3, href: "/impact" },
  { title: "Moderation", desc: "Content review queue and community reports", icon: Shield, href: "/trust/safety-standards" },
  { title: "Safety Reports", desc: "Crisis interventions and risk escalations", icon: AlertTriangle, href: "/trust/transparency" },
  { title: "Professional Management", desc: "Verify, onboard, and manage consultants", icon: UserCheck, href: "/trust/professional-verification" },
  { title: "Content Management", desc: "Resources, programs, and editorial content", icon: FileText, href: "/resources" },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><LayoutDashboard size={14} /> Administration</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Admin Dashboard</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Monitor platform health, manage professionals, oversee safety systems, and ensure the highest quality of care.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c) => (
              <Link key={c.title} href={c.href} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5">
                  <c.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{c.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/login" className="btn-primary inline-flex items-center gap-2">
              Admin Sign In <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
