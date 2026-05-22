import Link from "next/link";
import { Shield, Clock, Users, Phone, Lock, Heart, ArrowRight } from "lucide-react";

const features = [
  { title: "Anonymous Support", desc: "Employees access help without identification — no manager notifications", icon: Lock },
  { title: "24/7 Access", desc: "Round-the-clock emotional support via chat, call, or video sessions", icon: Clock },
  { title: "Professional Counselling", desc: "Licensed therapists and counsellors specializing in workplace issues", icon: Users },
  { title: "Crisis Hotline", desc: "Immediate support for emergencies with trained crisis responders", icon: Phone },
  { title: "Family Coverage", desc: "Extended support for employees' immediate family members", icon: Heart },
  { title: "Confidential & Secure", desc: "HIPAA-compliant platform with zero employer access to individual data", icon: Shield },
];

export default function EAP() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><Shield size={14} /> Workforce Wellness</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Employee Assistance Program</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Give your team anonymous, confidential access to professional mental health support — 24/7, without stigma or barriers.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-5">
                  <f.icon className="text-[var(--primary)]" size={20} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Get EAP for Your Team <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
