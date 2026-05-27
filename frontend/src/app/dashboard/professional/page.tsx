'use client';

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Calendar, Wallet, Star, Clock, BookOpen, ArrowRight } from "lucide-react";

const cards = [
  { title: "My Clients", desc: "View and manage your active client list", icon: Users, href: "/professionals" },
  { title: "Sessions", desc: "Upcoming appointments and session notes", icon: Calendar, href: "/book-session" },
  { title: "Earnings", desc: "Track income, invoices, and payouts", icon: Wallet, href: "/professionals" },
  { title: "Reviews", desc: "Client feedback and satisfaction ratings", icon: Star, href: "/professionals" },
  { title: "Availability", desc: "Set your schedule and time slots", icon: Clock, href: "/professionals" },
  { title: "Resources", desc: "Clinical tools, templates, and guides", icon: BookOpen, href: "/resources" },
];

export default function ProfessionalDashboard() {
  return (
    <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
      <ProfessionalDashboardContent />
    </ProtectedRoute>
  );
}

function ProfessionalDashboardContent() {
  const { logout } = useAuth();
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Users size={14} /> Professional Hub</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Professional Dashboard</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Manage your practice, track sessions, and grow your impact — all from one professional workspace.
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
            <button onClick={logout} className="btn-secondary inline-flex items-center gap-2 text-[var(--error)] border-[var(--error)] hover:bg-rose-50">
              Log Out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
