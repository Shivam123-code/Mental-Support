'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  X, ChevronRight, ChevronLeft, Sparkles, MapPin, Globe, User,
  Monitor, Building, Star, CheckCircle, Clock, Loader2, ArrowRight,
  Shield, RefreshCw, Heart
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────────
interface MatchedProfessional {
  id: string;
  displayName: string;
  type: string;
  specializations: string[];
  languages: string[];
  yearsOfExperience?: number;
  averageRating: number;
  totalReviews: number;
  profileImage?: string;
  isAcceptingClients: boolean;
  city?: string;
  state?: string;
  region?: string;
  country: string;
  gender?: string;
  sessionModes: string[];
  hourlyRate?: number;
  currency: string;
  bio?: string;
  matchScore: number;
  matchPercent: number;
}

interface QuizState {
  concerns: string[];
  city: string;
  state: string;
  region: string;
  privacyMode: boolean;
  preferredLanguages: string[];
  userAgeRange: string;
  preferredGender: string;
  sessionMode: string;
}

const CONCERNS = [
  'Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma',
  'Grief & Loss', 'Self-esteem', 'Career & Burnout', 'Sleep Issues',
  'Addiction', 'ADHD', 'OCD', 'Anger Management', 'Parenting',
  'Loneliness', 'Life Transitions', 'Leadership', 'Mindfulness',
];

const LANGUAGES = [
  'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil',
  'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu',
];

const STATES_BY_REGION: Record<string, string[]> = {
  'North India': ['Delhi', 'Uttar Pradesh', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Rajasthan', 'Jammu & Kashmir'],
  'South India': ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana'],
  'East India': ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand', 'Assam', 'Manipur', 'Meghalaya', 'Tripura', 'Arunachal Pradesh', 'Sikkim', 'Nagaland', 'Mizoram'],
  'West India': ['Maharashtra', 'Gujarat', 'Goa', 'Madhya Pradesh', 'Chhattisgarh'],
  'International': [],
};

const ALL_REGIONS = Object.keys(STATES_BY_REGION);

const TYPE_LABELS: Record<string, string> = {
  THERAPIST: 'Therapist',
  PSYCHOLOGIST: 'Psychologist',
  COUNSELOR: 'Counsellor',
  COACH: 'Wellness Coach',
  PSYCHIATRIST: 'Psychiatrist',
  SOCIAL_WORKER: 'Social Worker',
  MENTOR: 'Mentor & Coach',
};

const MATCH_COLOR = (pct: number) => {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 60) return 'bg-teal-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-slate-400';
};

// ── Step Components ────────────────────────────────────────────────────────────

function StepConcerns({ quiz, setQuiz }: { quiz: QuizState; setQuiz: (q: QuizState) => void }) {
  const toggle = (concern: string) => {
    const next = quiz.concerns.includes(concern)
      ? quiz.concerns.filter((c) => c !== concern)
      : quiz.concerns.length < 4
      ? [...quiz.concerns, concern]
      : quiz.concerns;
    setQuiz({ ...quiz, concerns: next });
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--on-surface)]">What brings you here?</h3>
        <p className="text-xs text-[var(--on-surface-variant)] mt-1">Select up to 4 concerns you'd like support with.</p>
      </div>
      <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
        {CONCERNS.map((c) => {
          const selected = quiz.concerns.includes(c);
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selected
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                  : 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:border-[var(--primary)]'
              }`}
            >
              {selected && <span className="mr-1">✓</span>}
              {c}
            </button>
          );
        })}
      </div>
      {quiz.concerns.length > 0 && (
        <p className="text-[10px] text-[var(--primary)] font-semibold">
          {quiz.concerns.length} selected: {quiz.concerns.join(' · ')}
        </p>
      )}
    </div>
  );
}

function StepLocation({ quiz, setQuiz }: { quiz: QuizState; setQuiz: (q: QuizState) => void }) {
  const statesForRegion = quiz.region ? STATES_BY_REGION[quiz.region] || [] : [];
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--on-surface)]">Where are you located?</h3>
        <p className="text-xs text-[var(--on-surface-variant)] mt-1">We'll prioritise professionals near you.</p>
      </div>

      {/* Privacy mode toggle */}
      <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--outline-variant)]/30 bg-amber-50/40 cursor-pointer">
        <input
          type="checkbox"
          checked={quiz.privacyMode}
          onChange={(e) => setQuiz({ ...quiz, privacyMode: e.target.checked, city: '', state: '' })}
          className="w-4 h-4 accent-amber-500"
        />
        <div>
          <p className="text-xs font-bold text-amber-800">Privacy Mode 🔒</p>
          <p className="text-[10px] text-amber-700">Match by region only — don't share exact city/state</p>
        </div>
      </label>

      {/* Region picker */}
      <div>
        <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-2">Region</label>
        <div className="flex flex-wrap gap-2">
          {ALL_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setQuiz({ ...quiz, region: r, state: '' })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                quiz.region === r
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:border-[var(--primary)]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* State picker */}
      {statesForRegion.length > 0 && !quiz.privacyMode && (
        <div>
          <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-2">State (optional)</label>
          <select
            value={quiz.state}
            onChange={(e) => setQuiz({ ...quiz, state: e.target.value })}
            className="w-full text-xs p-2.5 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="">Select state…</option>
            {statesForRegion.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {/* City input */}
      {quiz.state && !quiz.privacyMode && (
        <div>
          <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-2">City (optional)</label>
          <input
            type="text"
            placeholder="e.g. Bangalore, Mumbai…"
            value={quiz.city}
            onChange={(e) => setQuiz({ ...quiz, city: e.target.value })}
            className="w-full text-xs p-2.5 border border-[var(--outline-variant)]/40 rounded-xl bg-[var(--surface-container-low)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      )}
    </div>
  );
}

function StepLanguage({ quiz, setQuiz }: { quiz: QuizState; setQuiz: (q: QuizState) => void }) {
  const toggle = (lang: string) => {
    const next = quiz.preferredLanguages.includes(lang)
      ? quiz.preferredLanguages.filter((l) => l !== lang)
      : [...quiz.preferredLanguages, lang];
    setQuiz({ ...quiz, preferredLanguages: next });
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[var(--on-surface)]">Preferred session language</h3>
        <p className="text-xs text-[var(--on-surface-variant)] mt-1">Select all languages you're comfortable with.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => {
          const selected = quiz.preferredLanguages.includes(lang);
          return (
            <button
              key={lang}
              onClick={() => toggle(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selected
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:border-[var(--primary)]'
              }`}
            >
              {selected && '✓ '}{lang}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepAboutYou({ quiz, setQuiz }: { quiz: QuizState; setQuiz: (q: QuizState) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-[var(--on-surface)]">A little about you</h3>
        <p className="text-xs text-[var(--on-surface-variant)] mt-1">Helps us find the most compatible match.</p>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-2">Your age range</label>
        <div className="flex flex-wrap gap-2">
          {['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'].map((age) => (
            <button
              key={age}
              onClick={() => setQuiz({ ...quiz, userAgeRange: age })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                quiz.userAgeRange === age
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:border-[var(--primary)]'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-2">Preferred counsellor gender</label>
        <div className="flex flex-wrap gap-2">
          {['No preference', 'Female', 'Male', 'Non-binary'].map((g) => (
            <button
              key={g}
              onClick={() => setQuiz({ ...quiz, preferredGender: g })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                quiz.preferredGender === g
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:border-[var(--primary)]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-2">Session type</label>
        <div className="flex flex-wrap gap-2">
          {['Either', 'Online', 'In-person'].map((mode) => (
            <button
              key={mode}
              onClick={() => setQuiz({ ...quiz, sessionMode: mode })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                quiz.sessionMode === mode
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]/40 hover:border-[var(--primary)]'
              }`}
            >
              {mode === 'Online' ? <Monitor size={11} /> : mode === 'In-person' ? <Building size={11} /> : <Globe size={11} />}
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchResultCard({ prof, index }: { prof: MatchedProfessional; index: number }) {
  return (
    <div
      className={`relative p-4 rounded-xl border transition-all hover:shadow-md ${
        index === 0
          ? 'border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/5 to-transparent'
          : 'border-[var(--outline-variant)]/30 bg-[var(--surface)]'
      }`}
    >
      {index === 0 && (
        <span className="absolute -top-2.5 left-4 bg-[var(--primary)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles size={9} /> Best Match
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--primary-fixed)]">
          {prof.profileImage ? (
            <Image src={prof.profileImage} alt={prof.displayName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-[var(--on-surface)] truncate">{prof.displayName}</p>
              <p className="text-[10px] text-[var(--on-surface-variant)]">{TYPE_LABELS[prof.type] || prof.type}</p>
            </div>
            {/* Match % badge */}
            <div className="flex-shrink-0 text-right">
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${MATCH_COLOR(prof.matchPercent)}`}>
                <Heart size={9} /> {prof.matchPercent}%
              </div>
            </div>
          </div>

          {/* Match bar */}
          <div className="mt-2 h-1 bg-[var(--outline-variant)]/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${MATCH_COLOR(prof.matchPercent)}`}
              style={{ width: `${prof.matchPercent}%` }}
            />
          </div>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {prof.city || prof.state ? (
              <span className="flex items-center gap-1 text-[10px] text-[var(--on-surface-variant)]">
                <MapPin size={9} /> {prof.city || prof.state}
              </span>
            ) : null}
            <span className="flex items-center gap-1 text-[10px] text-[var(--on-surface-variant)]">
              <Star size={9} className="text-amber-400" fill="currentColor" /> {prof.averageRating} ({prof.totalReviews})
            </span>
            {prof.yearsOfExperience && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--on-surface-variant)]">
                <Clock size={9} /> {prof.yearsOfExperience}y exp
              </span>
            )}
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-1 mt-2">
            {prof.languages.slice(0, 3).map((l) => (
              <span key={l} className="text-[9px] px-1.5 py-0.5 bg-[var(--primary-fixed)]/30 text-[var(--primary)] rounded-full font-medium">{l}</span>
            ))}
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1 mt-1">
            {prof.specializations.slice(0, 3).map((s) => (
              <span key={s} className="text-[9px] px-1.5 py-0.5 bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] rounded-full">{s}</span>
            ))}
          </div>

          {/* Session mode + rate */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              {(prof.sessionModes ?? []).map((m) => (
                <span key={m} className="text-[9px] px-2 py-0.5 border border-[var(--outline-variant)]/30 rounded-full text-[var(--on-surface-variant)]">
                  {m === 'Online' ? '💻' : '🏢'} {m}
                </span>
              ))}
            </div>
            {prof.isAcceptingClients ? (
              <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                <CheckCircle size={9} /> Available
              </span>
            ) : (
              <span className="text-[9px] text-rose-500 font-semibold">Not accepting</span>
            )}
          </div>

          {/* Book button */}
          <Link
            href="/book-session"
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-[var(--primary)] hover:bg-[#00685c] text-white text-xs font-bold rounded-xl transition-all"
          >
            Book Session <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main AutoMatchModal ────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = ['Concerns', 'Location', 'Language', 'About You'];

const DEFAULT_QUIZ: QuizState = {
  concerns: [],
  city: '',
  state: '',
  region: '',
  privacyMode: false,
  preferredLanguages: [],
  userAgeRange: '',
  preferredGender: 'No preference',
  sessionMode: 'Either',
};

export default function AutoMatchModal({ isOpen, onClose }: Props) {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState<QuizState>(DEFAULT_QUIZ);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchedProfessional[] | null>(null);
  const [error, setError] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setQuiz(DEFAULT_QUIZ);
      setResults(null);
      setError('');
    }
  }, [isOpen]);

  const canProceed = () => {
    if (step === 0) return quiz.concerns.length > 0;
    if (step === 1) return quiz.region !== '';
    if (step === 2) return quiz.preferredLanguages.length > 0;
    return true; // Step 3 (about you) — all optional
  };

  const handleFind = async () => {
    setLoading(true);
    setError('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    try {
      const res = await fetch('/api/professionals/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          concerns: quiz.concerns,
          city: quiz.city || undefined,
          state: quiz.state || undefined,
          region: quiz.region || undefined,
          privacyMode: quiz.privacyMode,
          preferredLanguages: quiz.preferredLanguages,
          userAgeRange: quiz.userAgeRange || undefined,
          preferredGender: quiz.preferredGender === 'No preference' ? undefined : quiz.preferredGender,
          sessionMode: quiz.sessionMode === 'Either' ? undefined : quiz.sessionMode,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Matching failed');
      setResults(data.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const showingResults = results !== null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]/20 bg-gradient-to-r from-[var(--primary)]/5 to-transparent flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--on-surface)]">
                {showingResults ? `Your Matches (${results!.length})` : 'Auto Match Me'}
              </h2>
              <p className="text-[10px] text-[var(--on-surface-variant)]">
                {showingResults ? 'Ranked by compatibility' : `Step ${step + 1} of ${STEPS.length} — ${STEPS[step]}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[var(--surface-container-low)] transition-colors">
            <X size={16} className="text-[var(--on-surface-variant)]" />
          </button>
        </div>

        {/* Step indicator (only during quiz) */}
        {!showingResults && !loading && (
          <div className="flex gap-1.5 px-5 pt-4 flex-shrink-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-1 w-full rounded-full transition-all duration-300 ${
                    i < step ? 'bg-[var(--primary)]' : i === step ? 'bg-[var(--primary)]/60' : 'bg-[var(--outline-variant)]/30'
                  }`}
                />
                <span className={`text-[9px] font-semibold ${i <= step ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]/50'}`}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <Loader2 size={28} className="text-[var(--primary)] animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[var(--on-surface)]">Finding your best matches…</p>
                <p className="text-xs text-[var(--on-surface-variant)] mt-1">Analysing {quiz.concerns.join(', ')} · {quiz.region}</p>
              </div>
            </div>
          ) : showingResults ? (
            <div className="space-y-3">
              {/* Privacy mode notice */}
              {quiz.privacyMode && (
                <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <Shield size={13} className="text-amber-600 flex-shrink-0" />
                  <p className="text-[10px] text-amber-700">Privacy Mode: matched by region, not exact location.</p>
                </div>
              )}

              {results!.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-bold text-[var(--on-surface)]">No exact matches found</p>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-1">Try broadening your criteria.</p>
                  <button
                    onClick={() => { setResults(null); setStep(0); setQuiz(DEFAULT_QUIZ); }}
                    className="mt-4 btn-primary text-xs"
                  >
                    <RefreshCw size={12} /> Restart Quiz
                  </button>
                </div>
              ) : (
                results!.map((prof, i) => <MatchResultCard key={prof.id} prof={prof} index={i} />)
              )}
            </div>
          ) : (
            <div className="py-2">
              {step === 0 && <StepConcerns quiz={quiz} setQuiz={setQuiz} />}
              {step === 1 && <StepLocation quiz={quiz} setQuiz={setQuiz} />}
              {step === 2 && <StepLanguage quiz={quiz} setQuiz={setQuiz} />}
              {step === 3 && <StepAboutYou quiz={quiz} setQuiz={setQuiz} />}
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{error}</div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--outline-variant)]/20 flex-shrink-0 bg-[var(--surface)]">
            {showingResults ? (
              <>
                <button
                  onClick={() => { setResults(null); setStep(0); setQuiz(DEFAULT_QUIZ); }}
                  className="flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] font-semibold transition-colors"
                >
                  <RefreshCw size={12} /> Restart
                </button>
                <Link
                  href="/professionals"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-xs text-[var(--primary)] font-semibold hover:underline"
                >
                  Browse all <ArrowRight size={12} />
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="flex items-center gap-1.5 text-xs text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] font-semibold disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={14} /> Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-[#00685c] transition-all"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleFind}
                    disabled={!canProceed()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-[#00685c] transition-all shadow-md"
                  >
                    <Sparkles size={12} /> Find My Match
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
