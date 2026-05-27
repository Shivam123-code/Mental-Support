import Link from "next/link";
import { BookHeart, Heart, Sparkles, Shield, ArrowRight } from "lucide-react";

const stories = [
  { title: "From Burnout to Balance", excerpt: "After 3 years of chronic stress, I found my way back to joy through consistent support and community.", tag: "Work Stress", hearts: 234 },
  { title: "Breaking the Silence", excerpt: "I never thought I'd talk about my anxiety. This community showed me vulnerability is strength.", tag: "Anxiety", hearts: 189 },
  { title: "Healing After Loss", excerpt: "The grief circle gave me a space to process my loss without judgment. I'm grateful every day.", tag: "Grief", hearts: 312 },
  { title: "A New Chapter", excerpt: "Therapy helped me leave a toxic relationship and rediscover who I am. I'm finally free.", tag: "Relationships", hearts: 267 },
  { title: "Finding My Voice", excerpt: "As a teen, I felt invisible. My mentor helped me find confidence I never knew I had.", tag: "Youth", hearts: 156 },
  { title: "The Power of Small Steps", excerpt: "Daily check-ins and mood tracking showed me patterns I couldn't see before. Small changes, big impact.", tag: "Self-Discovery", hearts: 198 },
];

export default function Stories() {
  return (
    <div>
      {/* Hero */}
      <section className="section-gap bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="chip mb-6"><BookHeart size={14} /> Real Journeys</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">Healing Stories</h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mb-12">
            Anonymous transformation stories shared by our community. Every journey is unique, every story matters, and healing is always possible.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s) => (
              <div key={s.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[var(--primary)] bg-[var(--primary-fixed)] px-3 py-1 rounded-full font-medium">{s.tag}</span>
                  <span className="flex items-center gap-1 text-xs text-[var(--on-surface-variant)]"><Heart size={12} /> {s.hearts}</span>
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{s.excerpt}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/gratitude-wall" className="btn-primary inline-flex items-center gap-2">
              Share Your Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
