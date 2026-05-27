import Image from "next/image";
import Link from "next/link";
import { BookOpen, Video, Headphones, Moon, Music, Brain, ArrowRight, Clock, Heart, CheckCircle } from "lucide-react";

const resourceCategories = [
  { name: "Articles", icon: BookOpen, count: "200+" },
  { name: "Videos", icon: Video, count: "80+" },
  { name: "Podcasts", icon: Headphones, count: "50+" },
  { name: "Sleep Audio", icon: Moon, count: "30+" },
  { name: "Brain Music", icon: Music, count: "40+" },
  { name: "Meditation", icon: Brain, count: "60+" },
];

const articles = [
  { title: "Understanding Anxiety: A Complete Guide", category: "Mental Health", readTime: "8 min", image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=500&h=350&fit=crop", excerpt: "Learn about types of anxiety, symptoms, and evidence-based strategies." },
  { title: "5 Daily Habits for Emotional Resilience", category: "Wellness", readTime: "5 min", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=350&fit=crop", excerpt: "Simple daily practices that transform your emotional health." },
  { title: "Burnout Recovery: When Rest Isn't Enough", category: "Career", readTime: "7 min", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&h=350&fit=crop", excerpt: "Why traditional rest doesn't fix burnout and what works." },
  { title: "Building EQ in Children", category: "Parenting", readTime: "6 min", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=350&fit=crop", excerpt: "Practical strategies for helping children develop emotional awareness." },
  { title: "The Science of Sleep and Mental Health", category: "Sleep", readTime: "9 min", image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=500&h=350&fit=crop", excerpt: "How sleep impacts mental health and strategies for better rest." },
  { title: "Mindfulness for Beginners", category: "Mindfulness", readTime: "4 min", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=350&fit=crop", excerpt: "A gentle introduction to mindfulness for first-timers." },
];

const stories = [
  { name: "Ravi K.", story: "From burnout to launching my own wellness startup. KleverKlues gave me tools to heal.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "Sania M.", story: "Managing anxiety felt impossible until I found the right support.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "Deepak S.", story: "The parenting program saved my relationship with my teenager.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
];


export default function Resources() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap !pb-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-display-xl text-[var(--on-surface)] mb-6">Wellbeing <span className="text-gradient">Resource Hub</span></h1>
          <p className="text-body-lg text-[var(--on-surface-variant)]">Articles, videos, podcasts, guided meditations, sleep audio, and more — curated for your wellbeing journey.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-[var(--surface-container-lowest)] border-b border-[var(--outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resourceCategories.map((c) => (
              <div key={c.name} className="card !p-4 text-center cursor-pointer hover:-translate-y-1 transition-all duration-300">
                <c.icon className="mx-auto mb-2 text-[var(--primary)]" size={24} />
                <p className="font-medium text-sm text-[var(--on-surface)]">{c.name}</p>
                <p className="text-xs text-[var(--on-surface-variant)]">{c.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-headline-md text-[var(--on-surface)]">Featured Articles</h2>
            <Link href="/resources" className="text-[var(--primary)] font-medium flex items-center gap-1.5 text-sm hover:gap-2.5 transition-all">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div key={a.title} className="bg-[var(--surface-container-lowest)] rounded-xl overflow-hidden border-hairline hover:shadow-ambient-hover transition-all duration-300 group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <Image src={a.image} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 chip !bg-white/90 !backdrop-blur-sm text-xs">{a.category}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[var(--on-surface)] text-sm mb-2 group-hover:text-[var(--primary)] transition-colors">{a.title}</h3>
                  <p className="text-xs text-[var(--on-surface-variant)] mb-3 line-clamp-2">{a.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-[var(--outline)]"><Clock size={11} /> {a.readTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="section-gap bg-[var(--surface-container-low)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Success Stories</h2>
            <p className="text-[var(--on-surface-variant)]">Real transformations from real people.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((s) => (
              <div key={s.name} className="card">
                <Heart className="text-[var(--primary-fixed-dim)] mb-4" size={20} />
                <p className="text-sm text-[var(--on-surface-variant)] mb-5 italic leading-relaxed">&ldquo;{s.story}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden"><Image src={s.image} alt={s.name} fill className="object-cover" /></div>
                  <span className="font-medium text-[var(--on-surface)] text-sm">{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meditation */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div><Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=450&fit=crop" alt="Meditation" width={600} height={450} className="rounded-xl shadow-ambient" /></div>
            <div>
              <h2 className="text-headline-lg text-[var(--on-surface)] mb-6">Guided Exercises & Meditation</h2>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-8">Access guided meditations, breathing exercises, sleep stories, and brain music.</p>
              <ul className="space-y-3 mb-8">
                {["Guided breathing exercises", "Sleep stories & audio", "Focus-enhancing brain music", "Mindfulness meditations", "Stress relief sessions", "Research-backed insights"].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--on-surface-variant)] text-sm"><CheckCircle size={15} className="text-[var(--primary-bright)]" />{i}</li>
                ))}
              </ul>
              <Link href="/resources" className="btn-primary inline-flex items-center gap-2">Explore Library <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}