import Link from "next/link";
import { Phone, MessageCircle, Shield, Clock, Heart, AlertTriangle, PhoneCall, ArrowRight } from "lucide-react";

export default function SOS() {
  return (
    <div>
      {/* Emergency Banner */}
      <section className="bg-red-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">If you are in immediate danger, call 112 (India Emergency)</h2>
          </div>
          <p className="text-red-100">For life-threatening emergencies, please contact local emergency services immediately.</p>
        </div>
      </section>

      {/* Hero */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-red-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            <Phone size={16} />
            24/7 Crisis Support
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            You&apos;re <span className="text-red-600">Not Alone</span>. We&apos;re Here.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            If you&apos;re in crisis or need immediate emotional support, reach out right now. We have trained professionals available 24/7.
          </p>

          {/* Emergency Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200 hover:border-red-400 transition-all">
              <Phone className="mx-auto text-red-600 mb-4" size={40} />
              <h3 className="font-bold text-lg mb-2">Crisis Helpline</h3>
              <p className="text-gray-600 text-sm mb-4">Call our 24/7 crisis support line</p>
              <a href="tel:+919999999999" className="block w-full py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all">
                Call Now
              </a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all">
              <MessageCircle className="mx-auto text-purple-600 mb-4" size={40} />
              <h3 className="font-bold text-lg mb-2">SOS Chat</h3>
              <p className="text-gray-600 text-sm mb-4">Chat with a crisis counsellor now</p>
              <button className="block w-full py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-all">
                Start Chat
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all">
              <PhoneCall className="mx-auto text-blue-600 mb-4" size={40} />
              <h3 className="font-bold text-lg mb-2">Callback Request</h3>
              <p className="text-gray-600 text-sm mb-4">Request a callback within 15 min</p>
              <button className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all">
                Request Callback
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Safety Infrastructure</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We maintain comprehensive safety systems to ensure immediate support when you need it most.
            </p>
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
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <item.icon className="text-red-600 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* National Helplines */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">National Helplines (India)</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Vandrevala Foundation", number: "1860-2662-345", note: "24/7, Multilingual" },
              { name: "iCall", number: "9152987821", note: "Mon-Sat, 8am-10pm" },
              { name: "NIMHANS", number: "080-46110007", note: "Mon-Sat, 9:30am-4:30pm" },
              { name: "Sneha Foundation", number: "044-24640050", note: "24/7" },
              { name: "AASRA", number: "9820466726", note: "24/7" },
              { name: "Women Helpline", number: "181", note: "24/7" },
            ].map((helpline) => (
              <div key={helpline.name} className="bg-white rounded-xl p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900">{helpline.name}</h3>
                <a href={`tel:${helpline.number}`} className="text-purple-700 font-bold text-lg">{helpline.number}</a>
                <p className="text-xs text-gray-500">{helpline.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Policy Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Crisis & Safety Resources</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Crisis & Safety Policy", "Trust Center", "Emergency Guidance", "Report a Concern", "Your Data Rights"].map((link) => (
              <Link key={link} href="/sos" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-all text-sm font-medium">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-500 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Heart className="mx-auto mb-4" size={40} />
          <h2 className="text-3xl font-bold mb-4">Remember: Asking for help is a sign of strength.</h2>
          <p className="text-purple-200 mb-8">
            Whatever you&apos;re going through, it&apos;s valid, and support is available. You deserve care and compassion.
          </p>
          <Link href="/get-support" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
            Explore All Support Options <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
