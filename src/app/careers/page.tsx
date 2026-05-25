import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Heart, Award, Users, Globe, TrendingUp, Star } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Meaningful Work", desc: "Help thousands of people improve their emotional wellbeing every day." },
  { icon: TrendingUp, title: "Grow Your Practice", desc: "Access a growing community of clients matched to your expertise." },
  { icon: Globe, title: "Flexible Schedule", desc: "Work from anywhere, set your own hours, and manage your availability." },
  { icon: Award, title: "Professional Development", desc: "Free certifications, training, and continuous learning opportunities." },
  { icon: Users, title: "Community of Peers", desc: "Connect with fellow professionals, share insights, and collaborate." },
  { icon: Star, title: "Earn Respectfully", desc: "Transparent compensation with no exploitative practices." },
];

const roles = [
  { title: "Counsellors", desc: "Provide emotional support and guidance through sessions", requirements: ["Masters in Psychology/Counselling", "2+ years experience", "Active license/registration"] },
  { title: "Clinical Psychologists", desc: "Deliver clinical assessments and therapeutic interventions", requirements: ["M.Phil/PhD in Clinical Psychology", "RCI registration", "3+ years practice"] },
  { title: "Wellness Coaches", desc: "Guide clients through wellness programs and goal-setting", requirements: ["Certified coaching credential", "1+ year experience", "Specialization area"] },
  { title: "Mentors", desc: "Share life experience to guide and support others", requirements: ["5+ years professional experience", "Strong communication skills", "Training completed"] },
  { title: "EQ Trainers", desc: "Conduct workshops on emotional intelligence", requirements: ["EQ certification", "Training experience", "Corporate/education background"] },
  { title: "Content Creators", desc: "Create wellness content — articles, videos, and programs", requirements: ["Domain expertise in wellness", "Content creation skills", "Portfolio of work"] },
];

export default function Careers() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-20 left-[5%] w-[300px] h-[300px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none hidden md:block" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <div className="chip mb-6">
                <Heart size={14} />
                Join KleverKlues&trade;
              </div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Help Humanity <span className="text-gradient">Heal & Grow</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-8 sm:mb-10 max-w-lg">
                Join our network of verified professionals and make a meaningful impact. Grow your practice while helping others build emotional resilience.
              </p>
              <Link href="/careers" className="btn-primary inline-flex items-center gap-2">
                Apply to Join <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/therapist-session.png"
                alt="Professional at work"
                width={550}
                height={450}
                className="rounded-xl shadow-ambient"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Why Join KleverKlues&trade;?</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Be part of a mission-driven ecosystem that values your expertise and supports your growth.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4 sm:mb-5">
                  <benefit.icon className="text-[var(--primary)]" size={18} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{benefit.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-headline-lg text-[var(--on-surface)] mb-4">Open Roles</h2>
            <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Find the role that matches your expertise and passion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {roles.map((role) => (
              <div key={role.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-semibold text-[var(--on-surface)] text-lg mb-2">{role.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)] mb-4">{role.desc}</p>
                <ul className="space-y-2 mb-5">
                  {role.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-xs text-[var(--on-surface-variant)]">
                      <CheckCircle size={13} className="text-[var(--primary-bright)] mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
                <Link href="/careers" className="text-[var(--primary)] text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-headline-lg text-[var(--on-surface)] mb-10 sm:mb-12 text-center">How to Join</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Apply", desc: "Submit your profile, qualifications, and experience" },
              { step: "02", title: "Verify", desc: "We verify credentials, background, and references" },
              { step: "03", title: "Onboard", desc: "Complete platform training and orientation" },
              { step: "04", title: "Start", desc: "Begin helping people and growing your practice" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">{item.step}</div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{item.title}</h3>
                <p className="text-xs text-[var(--on-surface-variant)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
