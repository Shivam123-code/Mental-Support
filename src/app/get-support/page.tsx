import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Brain, Users, Briefcase, Baby, Shield, Sparkles } from "lucide-react";

const supportCategories = [
  {
    title: "Emotional Health",
    icon: Heart,
    color: "from-purple-500 to-purple-700",
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=500&h=350&fit=crop",
    items: ["Anxiety", "Depression", "Stress", "Trauma", "Panic", "Grief", "Emotional Imbalance"],
  },
  {
    title: "Relationships & Family",
    icon: Users,
    color: "from-pink-500 to-rose-700",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&h=350&fit=crop",
    items: ["Couples Support", "Divorce Recovery", "Parenting Support", "Family Conflict", "Single Parenting"],
  },
  {
    title: "Life & Career",
    icon: Briefcase,
    color: "from-amber-500 to-orange-700",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=350&fit=crop",
    items: ["Career Counselling", "Burnout", "Leadership Stress", "Workplace Pressure", "Interview Anxiety"],
  },
  {
    title: "Children & Teenagers",
    icon: Baby,
    color: "from-cyan-500 to-blue-700",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=350&fit=crop",
    items: ["ADHD", "Exam Stress", "Emotional Growth", "Learning Challenges", "Behavioural Support"],
  },
  {
    title: "Special Support",
    icon: Shield,
    color: "from-red-500 to-red-700",
    image: "https://images.unsplash.com/photo-1559234938-b60fff04894d?w=500&h=350&fit=crop",
    items: ["Domestic Abuse", "Addiction Recovery", "Crisis Support", "Emotional Trauma"],
  },
  {
    title: "Personal Growth",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-700",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=500&h=350&fit=crop",
    items: ["Confidence Building", "EQ Development", "Communication Skills", "Focus & Productivity"],
  },
];

export default function GetSupport() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get the <span className="text-gradient">Support</span> You Deserve
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Whatever you&apos;re going through, you don&apos;t have to face it alone. Find the right support for your unique journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/assessments" className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all">
                  Take Assessment
                </Link>
                <Link href="/professionals" className="px-6 py-3 border-2 border-purple-700 text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition-all">
                  Find Professional
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=550&h=450&fit=crop"
                alt="Supportive environment"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore <span className="text-gradient">Support Categories</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive support areas designed around real human experiences and challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportCategories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60`} />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <cat.icon className="text-white" size={24} />
                    <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/professionals" className="inline-flex items-center gap-2 mt-4 text-purple-700 font-medium hover:gap-3 transition-all text-sm">
                    Get Support <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Assurance */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Brain className="mx-auto text-purple-600 mb-4" size={40} />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Privacy is Sacred</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            All conversations are encrypted. Anonymous mode available. You control your data.
            We follow DPDP compliance and the highest ethical standards.
          </p>
          <Link href="/assessments" className="px-8 py-4 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all">
            Start Your Journey — Free & Private
          </Link>
        </div>
      </section>
    </div>
  );
}
