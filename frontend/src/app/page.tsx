import Image from "next/image";
import Link from "next/link";
import {
  Shield, Lock, Users, Brain, Heart, Sparkles,
  ArrowRight, CheckCircle, Star, Clock, Globe, Phone
} from "lucide-react";

const categories = [
  { name: "Stress", icon: "🧠", desc: "Managing daily pressures" },
  { name: "Anxiety", icon: "💭", desc: "Finding calm within" },
  { name: "Burnout", icon: "🔥", desc: "Recovery & prevention" },
  { name: "Relationships", icon: "💞", desc: "Healing connections" },
  { name: "Parenting", icon: "👨‍👩‍👧", desc: "Confident parenting" },
  { name: "Career Pressure", icon: "💼", desc: "Professional growth" },
  { name: "Sleep Issues", icon: "🌙", desc: "Rest & recovery" },
  { name: "Students", icon: "📚", desc: "Academic support" },
  { name: "Emotional Healing", icon: "🌱", desc: "Inner growth" },
  { name: "Crisis Support", icon: "🆘", desc: "Immediate help" },
];

const programs = [
  { name: "Anxiety Recovery", duration: "8 weeks", image: "/images/anxiety-recovery.png" },
  { name: "Burnout Reset", duration: "6 weeks", image: "/images/burnout-reset.png" },
  { name: "Emotional Fitness", duration: "12 weeks", image: "/images/emotional-fitness.png" },
  { name: "Parenting Confidence", duration: "8 weeks", image: "/images/parenting-confidence.png" },
  { name: "Student Focus", duration: "4 weeks", image: "/images/student-focus.png" },
  { name: "Relationship Healing", duration: "10 weeks", image: "/images/relationship-healing.png" },
  { name: "Sleep Recovery", duration: "6 weeks", image: "/images/sleep-recovery.png" },
  { name: "Confidence Building", duration: "8 weeks", image: "/images/confidence-building.png" },
];

const steps = [
  { step: "01", title: "Assess", desc: "Take a free wellbeing assessment to understand your emotional health", icon: Brain },
  { step: "02", title: "Match", desc: "Get matched with verified professionals who understand your needs", icon: Users },
  { step: "03", title: "Support", desc: "Receive personalized guidance through sessions & programs", icon: Heart },
  { step: "04", title: "Progress", desc: "Track your growth, celebrate milestones, and build resilience", icon: Sparkles },
];

const testimonials = [
  { name: "Priya S.", role: "Working Professional", text: "KleverKlues&trade; helped me through my worst burnout phase. The anonymous sessions gave me the safety to open up.", rating: 5 },
  { name: "Arjun M.", role: "College Student", text: "The student programs changed my life. I learned to manage exam stress and build real confidence.", rating: 5 },
  { name: "Meera R.", role: "New Parent", text: "Parenting support circles helped me realize I wasn't alone. The community is genuinely warm and supportive.", rating: 5 },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--surface)]">
        {/* Orbit decorations */}
        <div className="absolute top-20 right-[10%] w-[400px] h-[400px] border border-[var(--primary-bright)]/10 rounded-full pointer-events-none" />
        <div className="absolute top-40 right-[15%] w-[250px] h-[250px] border border-[var(--tertiary-bright)]/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 py-10 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="chip">
                <Sparkles size={14} />
                Human Wellbeing Ecosystem
              </div>
              <h1 className="text-display-xl text-[var(--on-surface)]">
                Mental wellness support,{" "}
                <span className="text-gradient">anytime. Anywhere.</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] max-w-lg">
                Private, guided, emotionally intelligent support for stress, anxiety, burnout, relationships, emotional wellbeing, and personal growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/assessments" className="btn-primary">
                  Start Free Assessment
                </Link>
                <Link href="/book-session" className="btn-secondary">
                  Book a Session
                </Link>
                <Link href="/sos" className="flex items-center gap-2 px-6 py-3.5 bg-[var(--error)] text-white font-semibold rounded-lg hover:bg-[var(--on-error-container)] transition-all">
                  <Phone size={16} />
                  SOS — Get Help Now
                </Link>
              </div>
              {/* Trust Strip */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Lock, label: "Anonymous Mode", color: "text-[var(--primary)]" },
                  { icon: CheckCircle, label: "Verified Professionals", color: "text-[var(--primary-bright)]" },
                  { icon: Clock, label: "24×7 Crisis Support", color: "text-[var(--secondary)]" },
                  { icon: Shield, label: "Privacy & DPDP Ready", color: "text-[var(--primary)]" },
                  { icon: Globe, label: "Multilingual Support", color: "text-[var(--secondary-muted)]" },
                  { icon: Brain, label: "AI-Assisted Guidance", color: "text-[var(--tertiary)]" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-sm text-[var(--on-surface-variant)]">
                    <item.icon size={16} className={item.color} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image
                src="/images/hero-woman.png"
                alt="Person feeling peaceful and supported"
                width={600}
                height={700}
                className="rounded-xl shadow-ambient object-cover"
                priority
              />
              {/* Floating card - bottom left */}
              <div className="absolute -bottom-6 -left-6 bg-[var(--surface-container-lowest)] rounded-lg shadow-ambient p-4 flex items-center gap-3 border-hairline">
                <div className="w-11 h-11 bg-[var(--primary-fixed)] rounded-full flex items-center justify-center">
                  <CheckCircle className="text-[var(--primary)]" size={22} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--on-surface)]">10,000+</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">People Supported</p>
                </div>
              </div>
              {/* Floating card - top right */}
              <div className="absolute -top-4 -right-4 bg-[var(--surface-container-lowest)] rounded-lg shadow-ambient p-4 flex items-center gap-3 border-hairline">
                <div className="w-11 h-11 bg-[var(--tertiary-fixed)] rounded-full flex items-center justify-center">
                  <Star className="text-[var(--tertiary)]" size={22} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--on-surface)]">4.9/5 Rating</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">User Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Categories */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
              Support for Every Challenge
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Whatever you&apos;re going through, we have the support you need. Explore categories designed around real human experiences.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/get-support"
                className="card !p-6 text-center hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <span className="font-semibold text-[var(--on-surface)] text-sm block mb-1">{cat.name}</span>
                <span className="text-xs text-[var(--on-surface-variant)]">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
              How KleverKlues&trade; Works
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Your journey to emotional wellbeing starts with just one simple step.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="relative card group hover:-translate-y-1 transition-all duration-300">
                <span className="text-5xl font-display font-medium text-[var(--primary-fixed)]/30 group-hover:text-[var(--primary-fixed)]/50 transition-colors">
                  {step.step}
                </span>
                <div className="mt-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                    <step.icon className="text-[var(--primary)]" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--on-surface)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
              Personalized Programs
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Guided wellbeing journeys designed by experts to help you heal, grow, and thrive.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <Link key={program.name} href="/programs" className="group bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden border-hairline hover:shadow-ambient-hover transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-1">{program.name}</h3>
                  <p className="text-xs text-[var(--primary-bright)]">{program.duration} program</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/programs" className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all btn-tertiary">
              View All Programs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Human Connection Section */}
      <section className="section-gap bg-[var(--surface-container-low)] relative overflow-hidden">
        {/* Orbit decoration */}
        <div className="absolute top-10 right-10 w-[200px] h-[200px] border border-[var(--primary-bright)]/10 rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Image
                src="/images/community-support.png"
                alt="People supporting each other"
                width={600}
                height={500}
                className="rounded-xl shadow-ambient"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-headline-lg text-[var(--on-surface)]">
                Help Someone Today
              </h2>
              <p className="text-body-lg text-[var(--on-surface-variant)]">
                Make a meaningful impact. Support someone emotionally, mentor others, or contribute to community wellbeing.
              </p>
              <ul className="space-y-5">
                {[
                  { icon: Heart, text: "Support someone emotionally through peer circles" },
                  { icon: Users, text: "Become a mentor or support buddy" },
                  { icon: Sparkles, text: "Sponsor sessions for those in need" },
                  { icon: Star, text: "Join support circles and community missions" },
                  { icon: Heart, text: "Contribute to community wellbeing missions" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="text-[var(--primary)]" size={16} />
                    </div>
                    <span className="text-[var(--on-surface-variant)]">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/community" className="btn-primary inline-flex items-center gap-2">
                Join the Movement <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
              Built on Trust & Safety
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Your emotional safety is our top priority. Every aspect of KleverKlues&trade; is designed with trust at its core.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Clinical Governance", desc: "All services overseen by qualified clinical professionals" },
              { icon: Lock, title: "Privacy First", desc: "End-to-end encryption, anonymous mode, DPDP compliant" },
              { icon: CheckCircle, title: "Verified Professionals", desc: "Every professional is verified, trained, and regularly supervised" },
              { icon: Brain, title: "Ethical AI Framework", desc: "AI assists but never replaces human judgment and empathy" },
              { icon: Users, title: "Human Moderation", desc: "Community spaces are moderated by trained humans" },
              { icon: Phone, title: "Crisis Response", desc: "24/7 crisis support systems with immediate human escalation" },
            ].map((item) => (
              <div key={item.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5">
                  <item.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Preview */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="chip !bg-[var(--tertiary-fixed)] !text-[var(--tertiary)]">
                For Organizations
              </div>
              <h2 className="text-headline-lg text-[var(--on-surface)]">
                Enterprise Wellbeing
              </h2>
              <p className="text-body-lg text-[var(--on-surface-variant)]">
                Build emotionally resilient teams. Reduce burnout. Improve workplace wellbeing with our enterprise solutions.
              </p>
              <ul className="space-y-4">
                {["Corporate wellness programs", "Workforce emotional resilience", "Burnout prevention systems", "Educational institution support", "Leadership wellbeing coaching"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[var(--on-surface-variant)]">
                    <CheckCircle size={16} className="text-[var(--primary-bright)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/enterprise" className="btn-primary inline-flex items-center gap-2">
                Enterprise Solutions <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/images/enterprise-team.png"
                alt="Team collaboration and wellbeing"
                width={600}
                height={450}
                className="rounded-xl shadow-ambient"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap bg-[var(--surface-container-low)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">
              Stories of Transformation
            </h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Real stories from real people whose lives were changed through emotional support and community care.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-[var(--tertiary-bright)] fill-[var(--tertiary-bright)]" />
                  ))}
                </div>
                <p className="text-[var(--on-surface-variant)] mb-6 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-[var(--on-surface)] text-sm">{t.name}</p>
                  <p className="text-xs text-[var(--on-surface-variant)]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-[var(--inverse-surface)] text-white relative overflow-hidden">
        {/* Orbit motifs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/8 rounded-full pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "People Supported" },
              { value: "500+", label: "Verified Professionals" },
              { value: "50+", label: "Programs Available" },
              { value: "24/7", label: "Crisis Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl md:text-5xl font-display font-medium">{stat.value}</p>
                <p className="text-white/60 mt-2 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
