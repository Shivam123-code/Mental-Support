import Link from "next/link";
import { Heart, Brain, Calendar, TrendingUp, BookOpen, Shield, Phone, Settings, Smile, Target, Award, Bell } from "lucide-react";

const quickActions = [
  { icon: Calendar, title: "Book Session", desc: "Schedule with your professional", href: "/professionals", color: "bg-[var(--primary-fixed)]" },
  { icon: Brain, title: "Take Assessment", desc: "Check your emotional health", href: "/assessments", color: "bg-[var(--tertiary-fixed)]" },
  { icon: Heart, title: "Mood Check-in", desc: "Log how you're feeling today", href: "/dashboard", color: "bg-[var(--secondary-fixed)]" },
  { icon: Phone, title: "SOS Support", desc: "Immediate crisis help", href: "/sos", color: "bg-[var(--error-container)]" },
];

const dashboardSections = [
  { icon: Heart, title: "My Care", desc: "Active care plans, upcoming sessions, and professional connections" },
  { icon: Brain, title: "My Assessments", desc: "Assessment history, scores, and progress over time" },
  { icon: Calendar, title: "My Sessions", desc: "Upcoming and past sessions with notes and follow-ups" },
  { icon: BookOpen, title: "My Programs", desc: "Enrolled programs, progress tracking, and milestones" },
  { icon: TrendingUp, title: "Progress Tracker", desc: "Visualize your emotional growth journey week by week" },
  { icon: Smile, title: "Mood Journal", desc: "Daily emotional check-ins, gratitude, and reflections" },
  { icon: Target, title: "AI Recommendations", desc: "Personalized suggestions based on your journey" },
  { icon: Settings, title: "Privacy Settings", desc: "Control your data, anonymous mode, and preferences" },
];

const dailyEngagement = [
  { icon: Smile, title: "Emotional Check-in", desc: "How are you feeling right now?" },
  { icon: Heart, title: "Gratitude Tracking", desc: "Note 3 things you're grateful for" },
  { icon: TrendingUp, title: "Mood Insights", desc: "See your emotional patterns" },
  { icon: Award, title: "Growth Streaks", desc: "Keep your wellbeing streak going" },
  { icon: Bell, title: "Wellbeing Reminders", desc: "Gentle nudges for self-care" },
];

export default function Dashboard() {
  return (
    <div>
      {/* Welcome Header */}
      <section className="bg-[var(--surface)] py-8 sm:py-12 border-b border-[var(--outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-headline-md text-[var(--on-surface)]">Welcome back</h1>
              <p className="text-[var(--on-surface-variant)]">Your wellbeing dashboard — everything in one place.</p>
            </div>
            <Link href="/login" className="btn-primary w-fit">Sign In to Access</Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 sm:py-12 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <h2 className="text-lg font-semibold text-[var(--on-surface)] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href} className="card !p-4 sm:!p-6 group hover:-translate-y-1 transition-all duration-300 text-center sm:text-left">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-3`}>
                  <action.icon size={20} className="text-[var(--on-surface)]" />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)] hidden sm:block">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Features Preview */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Your Wellbeing Hub</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Track your care, sessions, programs, mood, and growth — all in one secure, private dashboard.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dashboardSections.map((section) => (
              <div key={section.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                  <section.icon className="text-[var(--primary)]" size={18} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-2">{section.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{section.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Engagement */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Daily Engagement</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Small daily practices that build lasting emotional resilience.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {dailyEngagement.map((item) => (
              <div key={item.title} className="card !p-4 sm:!p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 mx-auto rounded-full bg-[var(--tertiary-fixed)] flex items-center justify-center mb-3">
                  <item.icon className="text-[var(--tertiary)]" size={18} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] text-xs sm:text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)] hidden sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[var(--primary)] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-headline-lg mb-4">Start Your Wellbeing Journey</h2>
          <p className="text-white/60 mb-8">Create your free account to access your personal dashboard, track progress, and connect with support.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all">
              Create Free Account
            </Link>
            <Link href="/assessments" className="px-6 sm:px-8 py-3 sm:py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
              Take Assessment First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
