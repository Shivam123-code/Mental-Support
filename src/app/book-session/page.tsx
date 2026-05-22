import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Video, MessageCircle, Phone, Shield, CheckCircle, Star, ArrowRight, Globe } from "lucide-react";

const sessionTypes = [
  {
    title: "Video Session",
    icon: Video,
    duration: "50 min",
    price: "₹1,499",
    description: "Face-to-face video counselling with a verified professional",
    features: ["HD Video Call", "Screen Sharing", "Session Recording (optional)", "Follow-up Notes"],
    color: "border-blue-200 hover:border-blue-400",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Chat Session",
    icon: MessageCircle,
    duration: "45 min",
    price: "₹999",
    description: "Text-based counselling for those who prefer writing",
    features: ["Real-time Chat", "Share Files & Images", "Chat Transcript", "Anonymous Option"],
    color: "border-green-200 hover:border-green-400",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Voice Call",
    icon: Phone,
    duration: "45 min",
    price: "₹1,199",
    description: "Audio-only session for comfortable, private conversations",
    features: ["Clear Audio", "No Video Required", "Session Summary", "Callback Option"],
    color: "border-purple-200 hover:border-purple-400",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const steps = [
  { step: "1", title: "Choose Session Type", desc: "Select video, chat, or voice call based on your comfort" },
  { step: "2", title: "Pick Date & Time", desc: "Choose a slot that works for your schedule" },
  { step: "3", title: "Select Professional", desc: "Browse or get matched with the right professional" },
  { step: "4", title: "Confirm & Pay", desc: "Secure payment with instant confirmation" },
];

const faqs = [
  { q: "How long is each session?", a: "Sessions range from 45-50 minutes depending on the type. You can extend if needed." },
  { q: "Can I cancel or reschedule?", a: "Yes, free cancellation up to 4 hours before your session. Reschedule anytime." },
  { q: "Is my session private?", a: "Absolutely. All sessions are encrypted end-to-end. Anonymous mode is available." },
  { q: "What if I'm not satisfied?", a: "We offer a satisfaction guarantee. If your first session doesn't help, we'll arrange a free follow-up." },
  { q: "Do I need to share my real name?", a: "No. You can use a display name and remain fully anonymous if you prefer." },
  { q: "Can I choose my professional?", a: "Yes. Browse our directory or let our matching system recommend the best fit." },
];

export default function BookSession() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-10 md:py-16 lg:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Calendar size={14} />
                Book a Session
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                Start Your <span className="text-gradient">Healing Journey</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-lg">
                Book a private session with a verified professional. Choose your preferred format — video, chat, or voice — and begin your path to emotional wellbeing.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Shield size={14} className="text-purple-600" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>Verified Experts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-600" />
                  <span>Flexible Timing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe size={14} className="text-teal-600" />
                  <span>Multilingual</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=550&h=450&fit=crop"
                alt="Booking a therapy session"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Session Types */}
      <section className="py-10 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Choose Your <span className="text-gradient">Session Type</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Pick the format that feels most comfortable for you. All sessions are private, secure, and professionally guided.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sessionTypes.map((session) => (
              <div key={session.title} className={`bg-white rounded-2xl p-5 sm:p-6 border-2 ${session.color} transition-all hover:shadow-lg`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${session.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                  <session.icon className={session.iconColor} size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{session.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{session.description}</p>
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <Clock size={14} /> {session.duration}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-purple-700">{session.price}</span>
                </div>
                <ul className="space-y-2 mb-5 sm:mb-6">
                  {session.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 sm:py-3 bg-purple-700 text-white font-medium rounded-full hover:bg-purple-800 transition-all text-sm">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Booking a session is simple, private, and takes less than 2 minutes.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {steps.map((item) => (
              <div key={item.step} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-sm sm:text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-xs sm:text-base mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-10 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Your Safety is <span className="text-gradient">Our Priority</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Every session on KleverKlues is protected with industry-leading security and privacy measures.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "End-to-end encrypted sessions",
                  "Anonymous mode available",
                  "DPDP compliant data handling",
                  "No session content stored without consent",
                  "Clinically supervised professionals",
                  "Free cancellation up to 4 hours before",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=550&h=450&fit=crop"
                alt="Secure and private sessions"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-purple-700 to-purple-500 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Begin?</h2>
          <p className="text-purple-200 mb-6 sm:mb-8 text-sm sm:text-base">
            Take the first step towards emotional wellbeing. Book your session today.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Link href="/professionals" className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all text-sm sm:text-base">
              Browse Professionals
            </Link>
            <Link href="/assessments" className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
              Take Assessment First <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
