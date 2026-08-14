import Link from "next/link";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";

/**
 * The Gratitude Wall.
 *
 * This page previously carried nine invented posts under the heading "Real
 * stories of gratitude from our community", attributed to named people making
 * claims about their therapy outcomes, on a platform where nobody had ever been
 * able to post one — the "Share Your Gratitude" button led to a sign-in page and
 * no form existed behind it. These are the real posts, and there is a real form
 * in the dashboard now.
 *
 * Read straight from the database rather than through the API, because this is
 * a server component and an HTTP round trip to our own process would only add
 * a hop. Only moderated posts appear.
 */

// Always fresh: a wall that caches is a wall where a newly approved note does
// not show up and the person who wrote it thinks it was rejected.
export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days < 14 ? "" : "s"} ago`;
  return `${Math.floor(days / 30)} month${days < 60 ? "" : "s"} ago`;
}

export default async function GratitudeWall() {
  let gratitudes: { text: string; author: string; days: string }[] = [];
  try {
    const rows = await prisma.communityPost.findMany({
      where: { type: "GRATITUDE", isModerated: true },
      orderBy: { createdAt: "desc" },
      take: 60,
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    gratitudes = rows.map((p) => ({
      text: p.content,
      author: p.isAnonymous
        ? "Anonymous"
        : `${p.user.firstName ?? ""} ${(p.user.lastName ?? "").slice(0, 1)}`.trim() || "Anonymous",
      days: timeAgo(p.createdAt),
    }));
  } catch (err) {
    // A database hiccup shows the empty state rather than a broken page.
    console.error("[gratitude-wall] could not load posts:", err);
  }

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
            Notes of gratitude shared by our community. Every one was written by someone using
            KleverKlues, and checked by our team before it appeared here.
          </p>
        </div>
      </section>

      {/* Gratitude Cards */}
      <section className="section-gap !pt-8 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {gratitudes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart size={28} className="mx-auto text-[var(--primary-fixed-dim)]" />
              <p className="text-sm font-semibold text-[var(--on-surface)]">The wall is empty for now</p>
              <p className="text-sm text-[var(--on-surface-variant)] max-w-md mx-auto">
                Nobody has shared a note yet. Yours would be the first — sign in and write one from
                the Impact &amp; Gratitude tab in your dashboard.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Share Your Gratitude */}
      <section className="section-gap bg-[var(--surface-container)] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Sparkles className="mx-auto text-[var(--tertiary-bright)] mb-4" size={32} />
          <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Share Your Gratitude</h2>
          <p className="text-[var(--on-surface-variant)] mb-8">Add your voice to the wall. Share what you&rsquo;re grateful for &mdash; anonymously or with your name.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard/user" className="btn-primary inline-flex items-center gap-2">Share a note <ArrowRight size={16} /></Link>
            <Link href="/impact" className="btn-secondary">View Impact System</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
