import Image from "next/image";
import Link from "next/link";
import { Building2, GraduationCap, Heart, Shield, TrendingUp, Users, ArrowRight, CheckCircle, BarChart3 } from "lucide-react";

const sectors = [
  { name: "Corporates", icon: Building2, desc: "Employee wellness & burnout prevention" },
  { name: "Healthcare", icon: Heart, desc: "Staff resilience & emotional support" },
  { name: "Schools", icon: GraduationCap, desc: "Student & teacher wellbeing" },
  { name: "Universities", icon: GraduationCap, desc: "Campus mental wellness programs" },
  { name: "Manufacturing", icon: Building2, desc: "Worker safety & emotional health" },
  { name: "Government", icon: Shield, desc: "Public sector wellness initiatives" },
];

const features = [
  { title: "Employee Assistance Program", desc: "Comprehensive emotional support for your entire workforce with anonymous access", icon: Users },
  { title: "Burnout Analytics", desc: "Real-time burnout risk detection and prevention with AI-powered insights", icon: BarChart3 },
  { title: "Wellbeing Dashboards", desc: "Track engagement, wellness trends, and emotional health metrics", icon: TrendingUp },
  { title: "Leadership Support", desc: "Specialized coaching and support for leaders and managers", icon: Building2 },
  { title: "Anonymous Support", desc: "Employees can access help without fear of judgment", icon: Shield },
  { title: "Workshops & Programs", desc: "Customized wellness workshops and team programs", icon: GraduationCap },
];


export default function Enterprise() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[var(--inverse-surface)] text-white overflow-hidden">
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-[var(--primary-fixed-dim)] rounded-full text-sm font-medium mb-6">
                <Building2 size={14} /> Enterprise Solutions
              </div>
              <h1 className="text-display-xl text-white mb-6">
                Build Emotionally Resilient Teams
              </h1>
              <p className="text-body-lg text-white/60 mb-10 max-w-lg">
                Reduce burnout. Improve workforce wellbeing. Increase productivity with KleverKlues&trade; Enterprise.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="px-8 py-4 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all">Schedule Demo</Link>
                <Link href="/contact" className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all">Download Brochure</Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=550&h=450&fit=crop" alt="Enterprise team" width={550} height={450} className="rounded-xl shadow-ambient" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{ value: "43%", label: "Reduction in Burnout" }, { value: "67%", label: "Improved Engagement" }, { value: "89%", label: "User Satisfaction" }, { value: "3.5x", label: "ROI on Wellness" }].map((s) => (
              <div key={s.label}><p className="text-3xl md:text-4xl font-display font-medium text-[var(--primary)]">{s.value}</p><p className="text-sm text-[var(--on-surface-variant)] mt-1">{s.label}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Serving Every Sector</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">Tailored wellbeing solutions for organizations of every size.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((s) => (
              <div key={s.name} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5"><s.icon className="text-[var(--primary)]" size={20} /></div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{s.name}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16"><h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Enterprise Features</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5"><f.icon className="text-[var(--primary)]" size={20} /></div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-headline-lg text-[var(--on-surface)] mb-6">Enterprise Dashboard</h2>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-8">Real-time insights into your organization&apos;s emotional health.</p>
              <ul className="space-y-4">
                {["Utilization trends", "Burnout indicators", "Emotional wellness analytics", "Engagement metrics", "Risk insights & alerts"].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--on-surface-variant)]"><CheckCircle size={16} className="text-[var(--primary-bright)]" />{i}</li>
                ))}
              </ul>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2 mt-8">Request Demo <ArrowRight size={16} /></Link>
            </div>
            <div><Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop" alt="Dashboard" width={600} height={450} className="rounded-xl shadow-ambient" /></div>
          </div>
        </div>
      </section>
    </div>
  );
}