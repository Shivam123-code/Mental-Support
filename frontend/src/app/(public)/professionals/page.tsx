'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, CheckCircle, Globe, Clock, Video, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import SafetyDisclaimer from '@/components/ui/SafetyDisclaimer';
import AutoMatchButton from '@/components/AutoMatchButton';

/**
 * The public directory.
 *
 * This listed eight people from a hardcoded file — invented names, invented
 * ratings, invented experience — and every "Book Session" button went to a page
 * that could not book any of them, because none had an account behind them.
 * It is the first thing a stranger sees, and all of it was made up.
 *
 * These are real verified professionals from /api/professionals now. If there
 * are none, it says so.
 */

interface Professional {
  id: string;
  userId: string;
  displayName: string;
  type: string;
  specializations: string[];
  languages: string[];
  yearsOfExperience: number | null;
  averageRating: number;
  totalReviews: number;
  profileImage: string | null;
  isAcceptingClients: boolean;
  city: string | null;
  state: string | null;
  region: string | null;
  country: string;
  sessionModes: string[];
  hourlyRate: number | null;
  currency: string;
  bio: string | null;
}

const REGIONS = ['All India', 'North India', 'South India', 'East India', 'West India', 'International'];

const TYPE_LABELS: Record<string, string> = {
  THERAPIST: 'Therapist',
  PSYCHOLOGIST: 'Psychologist',
  COUNSELOR: 'Counsellor',
  COACH: 'Wellness Coach',
  PSYCHIATRIST: 'Psychiatrist',
  SOCIAL_WORKER: 'Social Worker',
  MENTOR: 'Mentor & Coach',
};

export default function Professionals() {
  const [activeRegion, setActiveRegion] = useState('All India');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/professionals');
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Could not load professionals');
        setProfessionals(data.data ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = activeRegion === 'All India'
    ? professionals
    : professionals.filter((p) => p.region === activeRegion);

  /**
   * Category chips counted from the real directory. These read "Counsellors
   * (120+)", "Psychologists (85+)" and so on — figures nobody had ever
   * counted, on a directory that contained eight fictional entries.
   */
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of professionals) {
      const label = TYPE_LABELS[p.type] ?? p.type;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [professionals]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface)] section-gap">
        <div className="absolute top-10 right-[8%] w-[280px] h-[280px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-display-xl text-[var(--on-surface)] mb-6">
                Find Your <span className="text-gradient">Perfect Match</span>
              </h1>
              <p className="text-body-lg text-[var(--on-surface-variant)] mb-6 max-w-lg">
                Connect with verified, experienced professionals who understand your unique needs —
                matched to your language, location, and concern.
              </p>

              {/* Auto Match CTA */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <AutoMatchButton size="lg" />
                <span className="text-sm text-[var(--on-surface-variant)]">or browse manually below</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map(([name, count]) => (
                  <span key={name} className="chip">
                    {name} <span className="opacity-60">({count})</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/therapist-session.png"
                alt="Professional counselling session"
                width={550}
                height={450}
                className="rounded-xl shadow-ambient"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-headline-lg text-[var(--on-surface)] mb-2">Our Professionals</h2>
              <p className="text-body-md text-[var(--on-surface-variant)] max-w-xl">
                Every professional is verified, qualified, and committed to your wellbeing.
              </p>
            </div>
            {/* Auto Match shortcut for mobile */}
            <AutoMatchButton size="sm" className="self-start sm:self-auto" />
          </div>

          {/* Regional filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-[var(--surface-container-low)] rounded-xl w-fit">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeRegion === r
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-[var(--on-surface-variant)] text-sm">Loading professionals…</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-[var(--on-surface-variant)] text-sm">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-[var(--on-surface)] text-sm font-semibold">
                {professionals.length === 0
                  ? 'No professionals are listed yet'
                  : 'Nobody is listed for this region yet'}
              </p>
              <p className="text-[var(--on-surface-variant)] text-sm max-w-md mx-auto">
                {professionals.length === 0
                  ? 'Professionals appear here once their credentials have been verified. In the meantime, emergency support is always available.'
                  : 'Try another region, or let us match you.'}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                {professionals.length === 0 ? (
                  <Link href="/sos" className="text-[var(--primary)] text-sm font-semibold hover:underline">Get emergency support</Link>
                ) : (
                  <button onClick={() => setActiveRegion('All India')} className="text-[var(--primary)] text-sm font-semibold hover:underline">Show all</button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prof) => (
                <div key={prof.id} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--primary-fixed)]">
                      {prof.profileImage ? (
                        <Image src={prof.profileImage} alt={prof.displayName} fill sizes="56px" className="object-cover" />
                      ) : (
                        // Their initial, not a stock photograph. The fallback
                        // here used to be a picture of one of the invented
                        // professionals, so anyone without an avatar was shown
                        // to clients wearing a stranger's face.
                        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] flex items-center justify-center text-white font-bold">
                          {prof.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--on-surface)] text-sm truncate">{prof.displayName}</h3>
                        <CheckCircle size={14} className="text-[var(--primary-bright)] flex-shrink-0" />
                      </div>
                      <p className="text-xs text-[var(--primary)]">{TYPE_LABELS[prof.type] || prof.type}</p>
                      {/* No stars until somebody has actually left one. A "0.0"
                          under a name reads as a bad review rather than none. */}
                      {prof.totalReviews > 0 ? (
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={12} className="text-[var(--tertiary-bright)] fill-[var(--tertiary-bright)]" />
                          <span className="text-xs font-medium text-[var(--on-surface)]">{prof.averageRating.toFixed(1)}</span>
                          <span className="text-xs text-[var(--on-surface-variant)]">({prof.totalReviews})</span>
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--on-surface-variant)] mt-1">No reviews yet</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-[var(--on-surface-variant)]">
                    {prof.specializations.length > 0 && (
                      <p><span className="font-medium text-[var(--on-surface)]">Specializations:</span> {prof.specializations.slice(0, 3).join(', ')}</p>
                    )}
                    {prof.languages.length > 0 && (
                      <p className="flex items-center gap-1.5"><Globe size={13} /> {prof.languages.join(', ')}</p>
                    )}
                    {prof.yearsOfExperience != null && prof.yearsOfExperience > 0 && (
                      <p className="flex items-center gap-1.5"><Clock size={13} /> {prof.yearsOfExperience} years experience</p>
                    )}
                    {(prof.city || prof.state) && (
                      <p className="flex items-center gap-1.5"><MapPin size={13} /> {prof.city || prof.state}, {prof.country}</p>
                    )}
                    {prof.hourlyRate != null && prof.hourlyRate > 0 && (
                      <p className="font-medium text-[var(--on-surface)]">{prof.currency} {prof.hourlyRate}/hr</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {prof.sessionModes.map((m) => (
                      <span key={m} className="chip !py-1 !px-2.5 text-xs">
                        {m === 'Online' ? <Video size={11} /> : <MessageCircle size={11} />} {m}
                      </span>
                    ))}
                    {prof.isAcceptingClients && (
                      <span className="text-xs bg-[var(--primary-fixed)] text-[var(--primary)] px-2.5 py-1 rounded-full font-medium">Available</span>
                    )}
                  </div>

                  {/* Carries who was picked, so the booking page does not ask again. */}
                  <Link
                    href={`/book-session?professional=${prof.id}`}
                    className="block w-full btn-primary !py-3 text-sm text-center"
                  >
                    Book Session
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-sm text-[var(--on-surface-variant)] mb-3">
              Want a personalised recommendation?
            </p>
            <AutoMatchButton size="md" />
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="section-gap bg-[var(--surface-container)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-headline-md text-[var(--on-surface)] mb-4">Our Verification Promise</h2>
            <p className="text-[var(--on-surface-variant)] max-w-2xl mx-auto">
              Every professional on KleverKlues&trade; goes through a rigorous verification process.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Qualification Verified', desc: 'Degrees and certifications validated' },
              { title: 'Background Checked', desc: 'Comprehensive background verification' },
              { title: 'Clinically Supervised', desc: 'Regular clinical supervision' },
              { title: 'Continuously Monitored', desc: 'Ongoing quality and feedback review' },
            ].map((item) => (
              <div key={item.title} className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                  <CheckCircle className="text-[var(--primary)]" size={22} />
                </div>
                <h3 className="font-semibold text-[var(--on-surface)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--on-surface-variant)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <section className="py-6 sm:py-8 bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <SafetyDisclaimer />
        </div>
      </section>
    </div>
  );
}