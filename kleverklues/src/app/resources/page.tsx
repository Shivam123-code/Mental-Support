import Image from "next/image";
import Link from "next/link";
import { BookOpen, Video, Headphones, Moon, Music, Brain, ArrowRight, Clock, Heart, CheckCircle } from "lucide-react";

const resourceCategories = [
  { name: "Articles", icon: BookOpen, count: "200+", color: "bg-purple-100 text-purple-700" },
  { name: "Videos", icon: Video, count: "80+", color: "bg-blue-100 text-blue-700" },
  { name: "Podcasts", icon: Headphones, count: "50+", color: "bg-green-100 text-green-700" },
  { name: "Sleep Audio", icon: Moon, count: "30+", color: "bg-indigo-100 text-indigo-700" },
  { name: "Brain Music", icon: Music, count: "40+", color: "bg-amber-100 text-amber-700" },
  { name: "Meditation", icon: Brain, count: "60+", color: "bg-teal-100 text-teal-700" },
];

const featuredArticles = [
  {
    title: "Understanding Anxiety: A Complete Guide",
    category: "Mental Health",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=500&h=350&fit=crop",
    excerpt: "Learn about the different types of anxiety, their symptoms, and evidence-based strategies for management.",
  },
  {
    title: "5 Daily Habits for Emotional Resilience",
    category: "Wellness",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=350&fit=crop",
    excerpt: "Simple daily practices that can transform your emotional health and build lasting resilience.",
  },
  {
    title: "Burnout Recovery: When Rest Isn't Enough",
    category: "Career",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&h=350&fit=crop",
    excerpt: "Why traditional rest doesn't fix burnout and what actually works for sustainable recovery.",
  },
  {
    title: "Building Emotional Intelligence in Children",
    category: "Parenting",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=350&fit=crop",
    excerpt: "Practical strategies for helping children develop emotional awareness and regulation skills.",
  },
  {
    title: "The Science of Sleep and Mental Health",
    category: "Sleep",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=500&h=350&fit=crop",
    excerpt: "How sleep impacts your mental health and evidence-based strategies for better sleep.",
  },
  {
    title: "Mindfulness for Beginners: Start Here",
    category: "Mindfulness",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=350&fit=crop",
    excerpt: "A gentle introduction to mindfulness practice for those who have never meditated before.",
  },
];

const successStories = [
  {
    name: "Ravi K.",
    story: "From severe burnout to launching my own wellness startup. KleverKlues gave me the tools to heal and grow.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Sania M.",
    story: "Managing anxiety felt impossible until I found the right support. Today, I help others do the same.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "Deepak S.",
    story: "The parenting program saved my relationship with my teenager. We communicate better than ever.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
];

export default function Resources() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 gradient-hero">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Wellbeing <span className="text-gradient">Resource Hub</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Articles, videos, podcasts, guided meditations, sleep audio, and more — curated to support your emotional wellbeing journey.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resourceCategories.map((cat) => (
              <div key={cat.name} className={`${cat.color} rounded-2xl p-4 text-center hover:shadow-md transition-all cursor-pointer`}>
                <cat.icon className="mx-auto mb-2" size={28} />
                <p className="font-medium text-sm">{cat.name}</p>
                <p className="text-xs opacity-70">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Featured <span className="text-gradient">Articles</span></h2>
            <Link href="/resources" className="text-purple-700 font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <div key={article.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-purple-700">
                    {article.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={12} />
                    {article.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success <span className="text-gradient">Stories</span></h2>
            <p className="text-gray-600">Real transformations from real people.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <div key={story.name} className="bg-white rounded-2xl p-6 shadow-sm">
                <Heart className="text-purple-300 mb-4" size={24} />
                <p className="text-gray-700 mb-4 italic">&ldquo;{story.story}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={story.image} alt={story.name} fill className="object-cover" />
                  </div>
                  <span className="font-medium text-gray-900">{story.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guided Exercises & Meditation */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=450&fit=crop"
                alt="Meditation and mindfulness"
                width={600}
                height={450}
                className="rounded-3xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Guided Exercises & <span className="text-gradient">Meditation</span></h2>
              <p className="text-gray-600 mb-6">
                Access our library of guided meditations, breathing exercises, sleep stories, and brain music — designed to calm your mind and uplift your spirit.
              </p>
              <ul className="space-y-3 mb-8">
                {["Guided breathing exercises", "Sleep stories & audio", "Focus-enhancing brain music", "Mindfulness meditations", "Stress relief sessions", "Research-backed insights"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={16} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/resources" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition-all">
                Explore Library <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
