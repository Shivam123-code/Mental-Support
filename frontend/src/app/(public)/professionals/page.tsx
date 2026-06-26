'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, CheckCircle, Globe, Clock, Video, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import SafetyDisclaimer from '@/components/ui/SafetyDisclaimer';
import AutoMatchButton from '@/components/AutoMatchButton';
import { STATIC_PROFESSIONALS } from '@/app/api/professionals/route';

const categories = [
  { name: 'Counsellors', count: '120+' },
  { name: 'Psychologists', count: '85+' },
  { name: 'Clinical Psychologists', count: '45+' },
  { name: 'Coaches', count: '60+' },
  { name: 'Mentors', count: '90+' },
  { name: 'Wellness Experts', count: '50+' },
  { name: 'Trainers', count: '35+' },
];

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

  const filtered = activeRegion === 'All India'
    ? STATIC_PROFESSIONALS
    : STATIC_PROFESSIONALS.filter((p) => p.region === activeRegion);

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
                {categories.map((cat) => (
                  <span key={cat.name} className="chip">
                    {cat.name} <span className="opacity-60">({cat.count})</span>
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

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--on-surface-variant)] text-sm">No professionals found for this region yet.</p>
              <button onClick={() => setActiveRegion('All India')} className="mt-3 text-[var(--primary)] text-sm font-semibold hover:underline">Show all</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prof) => (
                <div key={prof.id} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--primary-fixed)]">
                      <Image src={prof.profileImage || '/images/prof-dr-ananya.png'} alt={prof.displayName} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--on-surface)] text-sm truncate">{prof.displayName}</h3>
                        <CheckCircle size={14} className="text-[var(--primary-bright)] flex-shrink-0" />
                      </div>
                      <p className="text-xs text-[var(--primary)]">{TYPE_LABELS[prof.type] || prof.type}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="text-[var(--tertiary-bright)] fill-[var(--tertiary-bright)]" />
                        <span className="text-xs font-medium text-[var(--on-surface)]">{prof.averageRating}</span>
                        <span className="text-xs text-[var(--on-surface-variant)]">({prof.totalReviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-[var(--on-surface-variant)]">
                    <p><span className="font-medium text-[var(--on-surface)]">Specializations:</span> {prof.specializations.slice(0, 3).join(', ')}</p>
                    <p className="flex items-center gap-1.5"><Globe size={13} /> {prof.languages.join(', ')}</p>
                    <p className="flex items-center gap-1.5"><Clock size={13} /> {prof.yearsOfExperience} years experience</p>
                    {(prof.city || prof.state) && (
                      <p className="flex items-center gap-1.5"><MapPin size={13} /> {prof.city || prof.state}, {prof.country}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    {prof.sessionModes.map((m) => (
                      <span key={m} className="chip !py-1 !px-2.5 text-xs">
                        {m === 'Online' ? <Video size={11} /> : <MessageCircle size={11} />} {m}
                      </span>
                    ))}
                    {prof.isAcceptingClients && (
                      <span className="text-xs bg-[var(--primary-fixed)] text-[var(--primary)] px-2.5 py-1 rounded-full font-medium">Available</span>
                    )}
                  </div>

                  <Link href="/book-session" className="block w-full btn-primary !py-3 text-sm text-center">
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