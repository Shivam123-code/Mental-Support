import Image from "next/image";
import Link from "next/link";
import {
  Shield, Lock, Users, Brain, Heart, Sparkles,
  ArrowRight, CheckCircle, Star, Clock, Globe, Phone
} from "lucide-react";

const categories = [
  { name: "Stress", icon: "🧠", color: "bg-blue-50 border-blue-200" },
  { name: "Anxiety", icon: "💭", color: "bg-purple-50 border-purple-200" },
  { name: "Burnout", icon: "🔥", color: "bg-orange-50 border-orange-200" },
  { name: "Relationships", icon: "💞", color: "bg-pink-50 border-pink-200" },
  { name: "Parenting", icon: "👨‍👩‍👧", color: "bg-green-50 border-green-200" },
  { name: "Career Pressure", icon: "💼", color: "bg-amber-50 border-amber-200" },
  { name: "Sleep Issues", icon: "🌙", color: "bg-indigo-50 border-indigo-200" },
  { name: "Students", icon: "📚", color: "bg-cyan-50 border-cyan-200" },
  { name: "Emotional Healing", icon: "🌱", color: "bg-emerald-50 border-emerald-200" },
  { name: "Crisis Support", icon: "🆘", color: "bg-red-50 border-red-200" },
];

const programs = [
  { name: "Anxiety Recovery", duration: "8 weeks", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop" },
  { name: "Burnout Reset", duration: "6 weeks", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop" },
  { name: "Emotional Fitness", duration: "12 weeks", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop" },
  { name: "Parenting Confidence", duration: "8 weeks", image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop" },
  { name: "Student Focus", duration: "4 weeks", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop" },
  { name: "Relationship Healing", duration: "10 weeks", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop" },
  { name: "Sleep Recovery", duration: "6 weeks", image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=400&h=300&fit=crop" },
  { name: "Confidence Building", duration: "8 weeks", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=300&fit=crop" },
];

const steps = [
  { step: "01", title: "Assess", desc: "Take a free wellbeing assessment to understand your emotional health", icon: Brain },
  { step: "02", title: "Match", desc: "Get matched with verified professionals who understand your needs", icon: Users },
  { step: "03", title: "Support", desc: "Receive personalized guidance through sessions & programs", icon: Heart },
  { step: "04", title: "Progress", desc: "Track your growth, celebrate milestones, and build resilience", icon: Sparkles },
];

const testimonials = [
  { name: "Priya S.", role: "Working Professional", text: "KleverKlues helped me through my worst burnout phase. The anonymous sessions gave me the safety to open up.", rating: 5 },
  { name: "Arjun M.", role: "College Student", text: "The student programs changed my life. I learned to manage exam stress and build real confidence.", rating: 5 },
  { name: "Meera R.", role: "New Parent", text: "Parenting support circles helped me realize I wasn't alone. The community is genuinely warm and supportive.", rating: 5 },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Sparkles size={16} />
                Human Wellbeing Ecosystem
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Mental wellness support,{" "}
                <span className="text-gradient">anytime. Anywhere.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Private, guided, emotionally intelligent support for stress, anxiety, burnout, relationships, emotional wellbeing, and personal growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/assessments" className="px-8 py-4 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all shadow-lg shadow-purple-200 hover:shadow-xl">
                  Start Free Assessment
                </Link>
                <Link href="/professionals" className="px-8 py-4 border-2 border-purple-700 text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
                  Book a Session
                </Link>
                <Link href="/sos" className="px-8 py-4 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all flex items-center gap-2">
                  <Phone size={18} />
                  SOS — Get Help Now
                </Link>
              </div>
              {/* Trust Strip */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock size={16} className="text-purple-600" />
                  <span>Anonymous Mode</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-blue-600" />
                  <span>24×7 Crisis Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={16} className="text-purple-600" />
                  <span>Privacy & DPDP Ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe size={16} className="text-teal-600" />
                  <span>Multilingual Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Brain size={16} className="text-amber-600" />
                  <span>AI-Assisted Guidance</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=700&fit=crop"
                alt="Person feeling peaceful and supported"
                width={600}
                height={700}
                className="rounded-3xl shadow-2xl object-cover"
                priority
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm">10,000+</p>
                  <p className="text-xs text-gray-500">People Supported</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-sm">4.9/5 Rating</p>
                  <p className="text-xs text-gray-500">User Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Categories */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Support for <span className="text-gradient">Every Challenge</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whatever you&apos;re going through, we have the support you need. Explore categories designed around real human experiences.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/get-support"
                className={`${cat.color} border rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <span className="font-medium text-gray-800">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 gradient-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-gradient">KleverKlues</span> Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your journey to emotional wellbeing starts with just one simple step.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group">
                <span className="text-5xl font-bold text-purple-100 group-hover:text-purple-200 transition-colors">{step.step}</span>
                <div className="mt-4">
                  <step.icon className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Personalized <span className="text-gradient">Programs</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Guided wellbeing journeys designed by experts to help you heal, grow, and thrive.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <Link key={program.name} href="/programs" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">{program.name}</h3>
                  <p className="text-sm text-purple-600">{program.duration} program</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/programs" className="inline-flex items-center gap-2 text-purple-700 font-semibold hover:gap-3 transition-all">
              View All Programs <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Human Connection Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=500&fit=crop"
                alt="People supporting each other"
                width={600}
                height={500}
                className="rounded-3xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Help Someone <span className="text-gradient">Today</span>
              </h2>
              <p className="text-lg text-gray-600">
                Make a meaningful impact. Support someone emotionally, mentor others, or contribute to community wellbeing.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Heart className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Support someone emotionally through peer circles</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Become a mentor or support buddy</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Sponsor sessions for those in need</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Join support circles and community missions</span>
                </li>
              </ul>
              <Link href="/community" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all">
                Join the Movement <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built on <span className="text-gradient">Trust & Safety</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your emotional safety is our top priority. Every aspect of KleverKlues is designed with trust at its core.
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
              <div key={item.title} className="bg-purple-50 rounded-2xl p-6 border border-purple-100 hover:shadow-md transition-all">
                <item.icon className="text-purple-600 mb-4" size={28} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Preview */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                For Organizations
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Enterprise <span className="text-gradient">Wellbeing</span>
              </h2>
              <p className="text-lg text-gray-600">
                Build emotionally resilient teams. Reduce burnout. Improve workplace wellbeing with our enterprise solutions.
              </p>
              <ul className="space-y-3">
                {["Corporate wellness programs", "Workforce emotional resilience", "Burnout prevention systems", "Educational institution support", "Leadership wellbeing coaching"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={18} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/enterprise" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all">
                Enterprise Solutions <ArrowRight size={18} />
              </Link>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop"
                alt="Team collaboration and wellbeing"
                width={600}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stories of <span className="text-gradient">Transformation</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from real people whose lives were changed through emotional support and community care.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 md:py-20 gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold">10K+</p>
              <p className="text-purple-200 mt-2">People Supported</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">500+</p>
              <p className="text-purple-200 mt-2">Verified Professionals</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">50+</p>
              <p className="text-purple-200 mt-2">Programs Available</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">24/7</p>
              <p className="text-purple-200 mt-2">Crisis Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
