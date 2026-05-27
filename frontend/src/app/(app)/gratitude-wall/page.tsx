import Link from "next/link";
import { Heart, ArrowRight, Sparkles } from "lucide-react";

const gratitudes = [
  { text: "Grateful for the support circle that helped me through my anxiety. I feel less alone now.", author: "Anonymous", days: "2 days ago" },
  { text: "My counsellor on KleverKlues helped me rebuild my confidence after losing my job. Thank you.", author: "Priya", days: "3 days ago" },
  { text: "Thankful for the parenting program. My relationship with my daughter has improved so much.", author: "Anonymous", days: "5 days ago" },
  { text: "The daily journal prompts helped me understand why I was feeling stuck. Small steps matter.", author: "Arjun", days: "1 week ago" },
  { text: "I sponsored a session for someone who couldn't afford it. It felt amazing to give back.", author: "Meera", days: "1 week ago" },
  { text: "Grateful for the community mission last week. Helped 3 students with exam stress.", author: "Anonymous", days: "2 weeks ago" },
  { text: "6 months of burnout recovery program complete. I finally feel like myself again.", author: "Raj", days: "2 weeks ago" },
  { text: "The AI journaling helped me see patterns I never noticed. So thankful for this tool.", author: "Anonymous", days: "3 weeks ago" },
  { text: "Found my mentor through KleverKlues. She's helped me grow professionally and emotionally.", author: "Sania", days: "3 weeks ago" },
];

export default function GratitudeWall() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap !pb-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <div className="chip mx-auto w-fit mb-6"><Heart size={14} /> Gratitude Wall</div>
          <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
            Wall of <span className="text-gradient">Gratitude</span>
          </h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            Real stories of gratitude from our community. Every thank you represents a life touched by emotional support.
          </p>
        </div>
      </section>

      {/* Gratitude Cards */}
      <section className="section-gap !pt-8 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
            {gratitudes.map((item, idx) => (
              <div key={idx} className="card !p-5 sm:!p-6 mb-4 sm:mb-6 break-inside-avoid">
                <Heart size={16} className="text-[var(--primary-fixed-dim)] mb-3" />
                <p className="text-sm text-[var(--on-surface-variant)] italic leading-relaxed mb-4">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--on-surface)]">{item.author}</span>
                  <span className="text-[10px] text-[var(--outline)]">{item.days}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Your Gratitude */}
      <section className="section-gap bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Sparkles className="mx-auto text-[var(--tertiary-bright)] mb-4" size={32} />
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Share Your Gratitude</h2>
          <p className="text-[var(--on-surface-variant)] mb-8">Add your voice to the wall. Share what you're grateful for — anonymously or with your name.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/role-selection" className="btn-primary inline-flex items-center gap-2">Sign In to Share <ArrowRight size={16} /></Link>
            <Link href="/impact" className="btn-secondary">View Impact System</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
