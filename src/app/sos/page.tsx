import Link from "next/link";
import { Phone, MessageCircle, Shield, Clock, Heart, AlertTriangle, PhoneCall, ArrowRight } from "lucide-react";

export default function SOS() {
  return (
    <div>
      {/* Emergency Banner */}
      <section className="bg-[var(--error)] text-white py-5">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-semibold">If you are in immediate danger, call 112 (India Emergency)</h2>
          </div>
          <p className="text-white/70 text-sm">For life-threatening emergencies, contact local emergency services immediately.</p>
        </div>
      </section>

      {/* Hero */}
      <section className="section-gap bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[var(--error)]/5 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
          <div className="chip !bg-[var(--error-container)] !text-[var(--on-error-container)] mb-6 mx-auto w-fit">
            <Phone size={14} /> 24/7 Crisis Support
          </div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
            You&apos;re Not Alone. We&apos;re Here.
          </h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto mb-12">
            If you&apos;re in crisis or need immediate emotional support, reach out now. Trained professionals available 24/7.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center border-2 !border-[var(--error)]/20 hover:!border-[var(--error)]/40 transition-all">
              <Phone className="mx-auto text-[var(--error)] mb-4" size={36} />
              <h3 className="font-bold text-lg mb-2 text-[var(--on-surface)]">Crisis Helpline</h3>
              <p className="text-sm text-[var(--on-surface-variant)] mb-5">Call our 24/7 crisis support line</p>
              <a href="tel:+919999999999" className="block w-full py-3 bg-[var(--error)] text-white font-semibold rounded-lg hover:bg-[var(--on-error-container)] transition-all">Call Now</a>
            </div>
            <div className="card text-center border-2 !border-[var(--primary)]/20 hover:!border-[var(--primary)]/40 transition-all">
              <MessageCircle className="mx-auto text-[var(--primary)] mb-4" size={36} />
              <h3 className="font-bold text-lg mb-2 text-[var(--on-surface)]">SOS Chat</h3>
              <p className="text-sm text-[var(--on-surface-variant)] mb-5">Chat with a crisis counsellor now</p>
              <button className="block w-full py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-bright)] transition-all">Start Chat</button>
            </div>
            <div className="card text-center border-2 !border-[var(--secondary)]/20 hover:!border-[var(--secondary)]/40 transition-all">
              <PhoneCall className="mx-auto text-[var(--secondary)] mb-4" size={36} />
              <h3 className="font-bold text-lg mb-2 text-[var(--on-surface)]">Callback Request</h3>
              <p className="text-sm text-[var(--on-surface-variant)] mb-5">Request callback within 15 min</p>
              <button className="block w-full py-3 bg-[var(--secondary)] text-white font-semibold rounded-lg hover:bg-[var(--secondary-muted)] transition-all">Request</button>
            </div>
          </div>
        </div>
      </section>


      {/* Safety Features */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Our Safety Infrastructure</h2>
            <p className="text-[var(--on-surface-variant)] max-w-2xl mx-auto">Comprehensive safety systems for immediate support when you need it most.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "24/7 Availability", desc: "Round-the-clock professional crisis support" },
              { icon: Shield, title: "Clinical Supervision", desc: "All crisis responders are clinically supervised" },
              { icon: Phone, title: "Hybrid Crisis System", desc: "Chat, call, and video support options" },
              { icon: Heart, title: "Safety Planning", desc: "Personalized safety plans for ongoing support" },
              { icon: AlertTriangle, title: "Emergency Guidance", desc: "Clear guidance for life-threatening situations" },
              { icon: MessageCircle, title: "Region-Based Escalation", desc: "Connection to local emergency services" },
            ].map((item) => (
              <div key={item.title} className="card">
                <div className="w-10 h-10 rounded-full bg-[var(--error-container)] flex items-center justify-center mb-5">
                  <item.icon className="text-[var(--error)]" size={18} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helplines */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-headline-md text-[var(--on-surface)] mb-8 text-center">National Helplines (India)</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Vandrevala Foundation", number: "1860-2662-345", note: "24/7, Multilingual" },
              { name: "iCall", number: "9152987821", note: "Mon-Sat, 8am-10pm" },
              { name: "NIMHANS", number: "080-46110007", note: "Mon-Sat, 9:30am-4:30pm" },
              { name: "Sneha Foundation", number: "044-24640050", note: "24/7" },
              { name: "AASRA", number: "9820466726", note: "24/7" },
              { name: "Women Helpline", number: "181", note: "24/7" },
            ].map((h) => (
              <div key={h.name} className="card !p-5">
                <h3 className="font-semibold text-[var(--on-surface)] text-sm">{h.name}</h3>
                <a href={`tel:${h.number}`} className="text-[var(--primary)] font-bold text-lg">{h.number}</a>
                <p className="text-xs text-[var(--on-surface-variant)]">{h.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Links */}
      <section className="py-16 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-headline-md text-[var(--on-surface)] mb-8">Crisis & Safety Resources</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Crisis & Safety Policy", "Trust Center", "Emergency Guidance", "Report a Concern", "Your Data Rights"].map((l) => (
              <Link key={l} href="/sos" className="chip hover:!bg-[var(--primary-fixed)] transition-all">{l}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <section className="py-20 bg-[var(--primary)] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <Heart className="mx-auto mb-4" size={36} />
          <h2 className="text-headline-lg mb-4">Asking for help is strength.</h2>
          <p className="text-white/60 mb-8">Whatever you&apos;re going through, it&apos;s valid. Support is available. You deserve care.</p>
          <Link href="/get-support" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--primary)] font-semibold rounded-lg hover:bg-white/90 transition-all">
            Explore All Support <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}