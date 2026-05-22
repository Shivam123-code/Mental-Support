import Image from "next/image";
import Link from "next/link";
import { Users, Heart, Shield, Star, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const communityGroups = [
  { name: "Student Wellness", members: "2.5K+", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop", description: "Support for academic stress, exam anxiety, and student life challenges" },
  { name: "Startup Founder Support", members: "1.2K+", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop", description: "Connect with founders navigating entrepreneurial stress and burnout" },
  { name: "Parenting Support", members: "3.1K+", image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop", description: "A safe space for parents to share, learn, and grow together" },
  { name: "Grief Healing", members: "1.8K+", image: "https://images.unsplash.com/photo-1516534775068-ba3e7a1d2dad?w=400&h=300&fit=crop", description: "Compassionate community for those processing loss and grief" },
  { name: "Men's Emotional Wellness", members: "2.0K+", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", description: "Breaking stigma — men supporting men's emotional health" },
  { name: "Women Leadership Wellness", members: "1.5K+", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=300&fit=crop", description: "Empowering women leaders with emotional resilience" },
  { name: "Relationship Rebuilding", members: "2.2K+", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop", description: "Support for rebuilding trust and healing relationships" },
  { name: "Senior Wellbeing", members: "900+", image: "https://images.unsplash.com/photo-1447005497901-b3e9ee359928?w=400&h=300&fit=crop", description: "Connection and support for senior citizens" },
];

const features = [
  { icon: Users, title: "Support Circles", desc: "Join guided groups for shared healing experiences" },
  { icon: Heart, title: "Peer Encouragement", desc: "Give and receive emotional support from community" },
  { icon: MessageCircle, title: "Guided Communities", desc: "Expert-moderated safe spaces for sharing" },
  { icon: Star, title: "Gratitude Sharing", desc: "Celebrate wins and spread positivity" },
  { icon: Sparkles, title: "Healing Journeys", desc: "Follow others' transformation stories" },
  { icon: Shield, title: "Safe & Moderated", desc: "Human-moderated, emotionally positive spaces" },
];

export default function Community() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Users size={16} />
                Humanity, Connected.
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                You&apos;re Part of Something <span className="text-gradient">Bigger</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-lg">
                Join a safe, moderated, emotionally positive community where you can connect, heal, and grow together with people who understand.
              </p>
              <Link href="/community" className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all inline-flex items-center gap-2">
                Join Community <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=550&h=450&fit=crop"
                alt="Community support"
                width={550}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Community <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Safe, moderated, emotionally positive support ecosystem designed for genuine human connection.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-purple-50 rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-100 hover:shadow-md transition-all">
                <feature.icon className="text-purple-600 mb-3 sm:mb-4" size={28} />
                <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Groups */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Find Your <span className="text-gradient">Circle</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Join communities built around shared experiences. You&apos;re not alone in your journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {communityGroups.map((group) => (
              <div key={group.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                  <Image src={group.image} alt={group.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs sm:text-sm font-medium">{group.members} members</p>
                  </div>
                </div>
                <div className="p-3 sm:p-4 md:p-5">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{group.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{group.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human Impact */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Help Someone Today</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-12">
            Earn your Human Impact Score by contributing positively to the community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { label: "Encourage Others", icon: "💪" },
              { label: "Sponsor Sessions", icon: "🎁" },
              { label: "Mentor Students", icon: "🎓" },
              { label: "Join Missions", icon: "🌟" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl sm:text-4xl block mb-3">{item.icon}</span>
                <p className="font-medium text-xs sm:text-sm md:text-base text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
