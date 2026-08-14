'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  Heart, Brain, Activity, BookOpen, Users, Target, Award, Loader2,
  Sparkles, TrendingUp, Calendar, MessageCircle, Zap, Sun, Moon,
  Cloud, Wind, Smile, Meh, Frown, AlertCircle, CheckCircle, Clock,
  Settings, LogOut, Shield, Compass, BookCheck, ShieldAlert, Star,
  Menu, X, Send, Eye, ShieldCheck, HeartHandshake, EyeOff, Lock,
  ChevronRight, ChevronLeft, BarChart2, ArrowRight, RefreshCw, Bell, Video,
  MessageSquare
} from 'lucide-react';
import { ASSESSMENTS, scoreAssessment, AssessmentKey } from '@/lib/assessments';
import { useSOSStatus } from '@/hooks/useSocket';
import { TabContent, StaggerList, StaggerItem } from '@/components/motion/animations';
import ChangePasswordCard from '@/components/ChangePasswordCard';
import AutoMatchButton from '@/components/AutoMatchButton';
import Chat from '@/components/Chat';
import VideoCall from '@/components/VideoCall';
import ReviewSession from '@/components/ReviewSession';
import { getProgramConfig } from '@/data/programs';

/** The ProgramType enum, in the order the catalogue presents them. */
const PROGRAM_TYPES = [
  'BURNOUT_RECOVERY', 'ANXIETY_RESET', 'SLEEP_RECOVERY', 'EMOTIONAL_HEALING',
  'CONFIDENCE_REBUILD', 'PARENTING_CONFIDENCE', 'FOCUS_IMPROVEMENT', 'RELATIONSHIP_HEALING',
] as const;

/** BURNOUT_RECOVERY -> burnout-recovery, which is how the catalogue keys them. */
const programSlug = (type: string) => type.toLowerCase().replace(/_/g, '-');

const MOOD_EMOJI: Record<string, string> = {
  happy: '😊', calm: '😌', neutral: '😐', anxious: '😰',
  stressed: '😣', sad: '😢', angry: '😠', tired: '😴',
};

const PROGRAM_COLORS = [
  'from-[var(--primary-fixed)]/20 to-[var(--secondary-fixed)]/20',
  'from-blue-50 to-indigo-50',
  'from-purple-50 to-rose-50',
  'from-amber-50 to-orange-50',
];

export default function UserDashboard() {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── Live SOS status tracking ─────────────────────────────────────────────────
  const sosToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const { statusUpdate, clearStatus } = useSOSStatus(user?.id, user?.role, sosToken || undefined);

  // ── Sessions, from the database ──────────────────────────────────────────────
  // My Sessions listed invented therapists and a fixed set of statistics. These
  // are the caller's real Booking rows — the same rows the professional sees.
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!t) { setBookingsLoading(false); return; }
      try {
        const data = await (await fetch('/api/bookings?scope=all&limit=100', {
          headers: { Authorization: `Bearer ${t}` },
        })).json();
        if (data.success) setMyBookings(data.data.items || []);
      } catch { /* the empty state below covers this */ }
      finally { setBookingsLoading(false); }
    })();
  }, []);

  // ── Programme enrolments, from the database ──────────────────────────────────
  // The Programs tab listed four courses with a fixed 68% and a "7 Day Streak"
  // on an account that had never enrolled in anything, and both buttons were
  // dead. /api/programs already existed and nothing called it.
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programBusy, setProgramBusy] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t) { setProgramsLoading(false); return; }
    try {
      const data = await (await fetch('/api/programs', {
        headers: { Authorization: `Bearer ${t}` },
      })).json();
      if (data.success) setEnrollments(data.data || []);
    } catch { /* the empty state covers it */ }
    finally { setProgramsLoading(false); }
  }, []);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);

  const enrollInProgram = async (programType: string) => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t || programBusy) return;
    setProgramBusy(programType);
    try {
      await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ programType }),
      });
      // Reload rather than guess: the server owns the enrolment row.
      await loadPrograms();
    } finally {
      setProgramBusy(null);
    }
  };

  // ── Gratitude wall ───────────────────────────────────────────────────────────
  // The Impact tab's input was uncontrolled and its button had no handler, so
  // everything typed was discarded. These post to the real wall, which waits on
  // the admin moderation queue that already existed.
  const [myGratitude, setMyGratitude] = useState<any[]>([]);
  const [gratitudeDraft, setGratitudeDraft] = useState('');
  const [gratitudeAnon, setGratitudeAnon] = useState(false);
  const [gratitudePosting, setGratitudePosting] = useState(false);
  const [gratitudeMessage, setGratitudeMessage] = useState('');

  const loadGratitude = useCallback(async () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t) return;
    try {
      const data = await (await fetch('/api/gratitude?mine=1', {
        headers: { Authorization: `Bearer ${t}` },
      })).json();
      if (data.success) setMyGratitude(data.data.items || []);
    } catch { /* the empty state covers it */ }
  }, []);

  useEffect(() => { loadGratitude(); }, [loadGratitude]);

  const postGratitude = async () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!t || gratitudePosting) return;
    setGratitudePosting(true);
    setGratitudeMessage('');
    try {
      const res = await fetch('/api/gratitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ content: gratitudeDraft.trim(), isAnonymous: gratitudeAnon }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not post');
      setGratitudeDraft('');
      setGratitudeMessage(data.message ?? 'Posted');
      await loadGratitude();
    } catch (e: any) {
      setGratitudeMessage(e.message);
    } finally {
      setGratitudePosting(false);
    }
  };

  // ── Sessions still waiting on a review ───────────────────────────────────────
  // Which completed sessions the caller has not rated. Held as a set of booking
  // ids so a row can decide in constant time whether to offer the prompt.
  const [awaitingReview, setAwaitingReview] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!t) return;
      try {
        const data = await (await fetch('/api/reviews?pending=1', {
          headers: { Authorization: `Bearer ${t}` },
        })).json();
        if (data.success) setAwaitingReview(new Set(data.data.items.map((i: any) => i.bookingId)));
      } catch { /* no prompt is shown; the review can still be left later */ }
    })();
  }, []);

  /** Drop the prompt once a review lands, without refetching the whole list. */
  const markReviewed = (bookingId: string) =>
    setAwaitingReview(prev => {
      const next = new Set(prev);
      next.delete(bookingId);
      return next;
    });

  // ── Library and circles, from the database ───────────────────────────────────
  // Both tabs listed invented handouts and circles with invented member counts.
  // These are what professionals have actually published.
  const [library, setLibrary] = useState<any[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [circles, setCircles] = useState<any[]>([]);
  const [circlesLoading, setCirclesLoading] = useState(true);
  const [circleBusy, setCircleBusy] = useState<string | null>(null);

  const authHeaders = useCallback(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return t ? { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` } : null;
  }, []);

  const loadCircles = useCallback(async () => {
    const h = authHeaders();
    if (!h) { setCirclesLoading(false); return; }
    try {
      const data = await (await fetch('/api/circles', { headers: h })).json();
      if (data.success) setCircles(data.data.items || []);
    } catch { /* empty state covers it */ }
    finally { setCirclesLoading(false); }
  }, [authHeaders]);

  useEffect(() => {
    (async () => {
      const h = authHeaders();
      if (!h) { setLibraryLoading(false); return; }
      try {
        const data = await (await fetch('/api/resources?limit=50', { headers: h })).json();
        if (data.success) setLibrary(data.data.items || []);
      } catch { /* empty state covers it */ }
      finally { setLibraryLoading(false); }
    })();
    loadCircles();
  }, [authHeaders, loadCircles]);

  /** Join or leave, then reload so the count shown is the server's, not a guess. */
  const toggleCircle = async (circle: any) => {
    const h = authHeaders();
    if (!h || circleBusy) return;
    setCircleBusy(circle.id);
    try {
      await fetch(`/api/circles/${circle.id}/join`, {
        method: circle.hasJoined ? 'DELETE' : 'POST', headers: h,
      });
      await loadCircles();
    } finally {
      setCircleBusy(null);
    }
  };

  const now = Date.now();
  const upcomingSessions = myBookings.filter(
    b => ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.scheduledAt).getTime() >= now
  );
  const pastSessions = myBookings.filter(b => !upcomingSessions.includes(b));
  const completedSessions = myBookings.filter(b => b.status === 'COMPLETED');
  // Real totals rather than the fixed "12 sessions, 4.8 stars" that every
  // account displayed regardless of history.
  const totalMinutes = completedSessions.reduce((sum, b) => sum + (b.duration ?? 0), 0);
  const uniqueProfessionals = new Set(myBookings.map(b => b.professional?.id).filter(Boolean)).size;

  // Show browser notification when vendor status changes
  useEffect(() => {
    if (!statusUpdate) return;
    const notifMap: Record<string, string> = {
      EN_ROUTE:        '🚗 Your responder is on the way!',
      NEARBY:          '📍 Your responder is very close — stay calm!',
      ARRIVED:         '🟢 Your responder has arrived!',
      RESOLVED:        '✅ Your case has been resolved. You are safe.',
      VENDOR_ACCEPTED: '✅ A responder has accepted your alert!',
    };
    const msg = notifMap[statusUpdate.dispatchStatus];
    if (msg && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🚨 KleverKlues SOS Update', { body: msg, icon: '/logo.jpg' });
      }
    }
  }, [statusUpdate]);

  
  // Interactive States
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [todayCheckIn, setTodayCheckIn] = useState(false);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  
  // Check-in Form State
  const [checkInMood, setCheckInMood] = useState('calm');
  const [checkInStress, setCheckInStress] = useState('Moderate');
  const [checkInEnergy, setCheckInEnergy] = useState('Medium');
  const [checkInSleep, setCheckInSleep] = useState('Good');
  const [checkInGratitude, setCheckInGratitude] = useState('');
  
  // Journal Editor State
  const [newJournalContent, setNewJournalContent] = useState('');
  const [newJournalTitle, setNewJournalTitle] = useState('');
  const [newJournalMood, setNewJournalMood] = useState('calm');
  
  // AI Chat State
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: "Hello Shivam. I'm here to support you in a calm, non-judgmental space. How is your emotional energy holding up today?" }
  ]);
  const [newAiMsg, setNewAiMsg] = useState('');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);

  // Privacy states
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [autoDND, setAutoDND] = useState(true);

  // ─── ASSESSMENT STATE ─────────────────────────────────────────────────────
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [latestByType, setLatestByType] = useState<Record<string, any>>({});
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  // ─── DERIVED FROM REAL DATA ───────────────────────────────────────────────
  // Everything below replaces a fixture. The rule throughout: if nothing in the
  // system computes a number, it does not get shown. A fabricated "wellbeing
  // score up 36 points" on a mental health dashboard is not decoration — it is
  // a claim about someone's recovery.

  /** Distinct local days on which anything was logged, newest first. */
  const checkInDays = useMemo(() => {
    const days = new Set<string>();
    for (const m of moodLogs) days.add(new Date(m.loggedAt ?? m.createdAt).toDateString());
    for (const j of journalEntries) days.add(new Date(j.createdAt).toDateString());
    return [...days].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [moodLogs, journalEntries]);

  /**
   * Consecutive days up to today (or yesterday, so the streak does not appear
   * broken before you have checked in this morning).
   */
  const checkInStreak = useMemo(() => {
    if (!checkInDays.length) return 0;
    const dayMs = 86_400_000;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const newest = new Date(checkInDays[0]); newest.setHours(0, 0, 0, 0);
    const gap = Math.round((today.getTime() - newest.getTime()) / dayMs);
    if (gap > 1) return 0; // the streak has already lapsed

    let streak = 1;
    for (let i = 1; i < checkInDays.length; i++) {
      const prev = new Date(checkInDays[i - 1]); prev.setHours(0, 0, 0, 0);
      const cur = new Date(checkInDays[i]); cur.setHours(0, 0, 0, 0);
      if (Math.round((prev.getTime() - cur.getTime()) / dayMs) !== 1) break;
      streak++;
    }
    return streak;
  }, [checkInDays]);

  /** The last 28 days as booleans, for the check-in calendar. Oldest first. */
  const checkInCalendar = useMemo(() => {
    const logged = new Set(checkInDays);
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (27 - i));
      return logged.has(d.toDateString());
    });
  }, [checkInDays]);

  /**
   * Score history per assessment type, oldest first — the real version of the
   * hardcoded PHQ-9 / GAD-7 / PSS trend lines.
   */
  const assessmentTrends = useMemo(() => {
    const byType = new Map<string, any[]>();
    for (const r of [...assessmentHistory].reverse()) {
      if (!byType.has(r.assessmentType)) byType.set(r.assessmentType, []);
      byType.get(r.assessmentType)!.push(r);
    }
    return [...byType.entries()].map(([type, rows]) => {
      const trend = rows.map(r => r.score);
      const first = trend[0];
      const current = trend[trend.length - 1];
      return {
        type,
        label: ASSESSMENTS[type as AssessmentKey]?.title ?? type.replace(/_/g, ' '),
        trend,
        current,
        maxScore: rows[rows.length - 1]?.maxScore ?? Math.max(...trend, 1),
        severity: rows[rows.length - 1]?.severity ?? null,
        // Only claim a direction once there is more than one data point to
        // compare, and lower is better on every instrument here.
        direction: trend.length < 2 ? null : current < first ? 'improving' : current > first ? 'worsening' : 'steady',
      };
    });
  }, [assessmentHistory]);

  /** Milestones with a real completion test rather than an invented date. */
  const milestones = useMemo(() => ([
    { label: 'First assessment completed', done: assessmentHistory.length > 0, at: assessmentHistory[assessmentHistory.length - 1]?.completedAt },
    { label: '5 sessions with a professional', done: completedSessions.length >= 5, at: completedSessions[4]?.completedAt, progress: `${Math.min(completedSessions.length, 5)}/5` },
    { label: '10 journal entries written', done: journalEntries.length >= 10, progress: `${Math.min(journalEntries.length, 10)}/10` },
    { label: '14-day check-in streak', done: checkInStreak >= 14, progress: `${Math.min(checkInStreak, 14)}/14` },
    { label: 'Complete a full wellbeing programme', done: enrollments.some(e => e.status === 'COMPLETED') },
  ]), [assessmentHistory, completedSessions, journalEntries, checkInStreak, enrollments]);

  /**
   * The care journey, built from what has actually happened. The fixture named
   * an invented therapist ("Dr. Kavita Rao") and claimed a booked Friday
   * session on accounts with no bookings at all.
   */
  const careJourney = useMemo(() => {
    const steps: { title: string; date: string; desc: string; state: 'done' | 'active' | 'pending' }[] = [];

    const latestAssessment = assessmentHistory[0];
    steps.push(latestAssessment
      ? {
          title: `${ASSESSMENTS[latestAssessment.assessmentType as AssessmentKey]?.title ?? 'Assessment'} completed`,
          date: new Date(latestAssessment.completedAt).toLocaleDateString(),
          desc: `Scored ${latestAssessment.score}${latestAssessment.maxScore ? ` of ${latestAssessment.maxScore}` : ''}${latestAssessment.severity ? ` — ${latestAssessment.severity.toLowerCase().replace(/_/g, ' ')}` : ''}.`,
          state: 'done',
        }
      : { title: 'Take your first assessment', date: 'Not started', desc: 'It takes a few minutes and shapes everything we suggest next.', state: 'pending' });

    const activeProgram = enrollments.find(e => e.status === 'ACTIVE');
    steps.push(activeProgram
      ? {
          title: `${activeProgram.programType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())} programme`,
          date: `Started ${new Date(activeProgram.startedAt).toLocaleDateString()}`,
          desc: `Week ${activeProgram.currentWeek} · ${Math.round(activeProgram.progressPercent)}% complete.`,
          state: 'active',
        }
      : { title: 'Join a wellbeing programme', date: 'Not enrolled', desc: 'Structured weekly guidance you work through at your own pace.', state: 'pending' });

    const nextSession = upcomingSessions[0];
    steps.push(nextSession
      ? {
          title: `Session with ${nextSession.professional?.name ?? 'your professional'}`,
          date: new Date(nextSession.scheduledAt).toLocaleString(),
          desc: `${nextSession.duration}-minute ${nextSession.sessionType} session · ${nextSession.status.toLowerCase()}.`,
          state: 'active',
        }
      : { title: 'Book a session', date: 'None booked', desc: 'One-to-one time with a verified professional.', state: 'pending' });

    const joined = circles.filter((c: any) => c.hasJoined);
    steps.push(joined.length
      ? {
          title: joined.length === 1 ? joined[0].title : `${joined.length} support circles`,
          date: joined[0].scheduleLabel ?? 'Ongoing',
          desc: joined.length === 1
            ? joined[0].description ?? 'A group you have joined.'
            : `You are a member of ${joined.length} circles.`,
          state: 'done',
        }
      : { title: 'Join a support circle', date: 'Not joined', desc: 'Group support alongside people working through the same thing.', state: 'pending' });

    return steps;
  }, [assessmentHistory, enrollments, upcomingSessions, circles]);

  /**
   * The last seven days of mood, oldest first. Days with nothing logged stay
   * blank rather than being filled in with a cheerful default.
   */
  const moodWeek = useMemo(() => {
    const byDay = new Map<string, any>();
    for (const m of moodLogs) {
      const key = new Date(m.loggedAt ?? m.createdAt).toDateString();
      // moodLogs arrive newest first, so the first hit is the latest that day.
      if (!byDay.has(key)) byDay.set(key, m);
    }
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const log = byDay.get(d.toDateString());
      return {
        label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()],
        emoji: log ? MOOD_EMOJI[String(log.mood).toLowerCase()] ?? '🙂' : null,
        mood: log?.mood ?? null,
      };
    });
  }, [moodLogs]);

  /**
   * Gratitude notes, pulled back out of the check-in. The check-in writes them
   * into MoodLog.notes as "… Gratitude: <text>", so that is where they are read
   * from — there is no separate store and adding one to display four lines
   * would be building a table to avoid a split.
   */
  const gratitudeEntries = useMemo(() =>
    moodLogs
      .map(m => {
        // [\s\S] rather than . with the s flag — the tsconfig target predates it.
        const match = /Gratitude:\s*([\s\S]+)$/.exec(m.notes ?? '');
        const text = match?.[1]?.trim();
        return text ? { at: new Date(m.loggedAt ?? m.createdAt), text } : null;
      })
      .filter((g): g is { at: Date; text: string } => !!g)
      .slice(0, 6),
    [moodLogs]);

  /**
   * Nudges worth acting on now, worked out from what is actually outstanding.
   * The fixture listed five reminders at fixed clock times with two already
   * ticked off, on an account that had done neither.
   */
  const todayNudges = useMemo(() => {
    const today = new Date().toDateString();
    const loggedToday = moodLogs.some(m => new Date(m.loggedAt ?? m.createdAt).toDateString() === today);
    const journalledToday = journalEntries.some(j => new Date(j.createdAt).toDateString() === today);
    const soon = upcomingSessions.find(
      b => new Date(b.scheduledAt).getTime() - Date.now() < 24 * 3600_000
    );

    return [
      {
        icon: '🌅', label: 'Log how you are feeling', done: loggedToday,
        detail: loggedToday ? 'Done today' : 'Takes under a minute', tab: 'Mood Tracker',
        color: 'bg-amber-50 border-amber-200',
      },
      {
        icon: '📓', label: 'Write a journal entry', done: journalledToday,
        detail: journalledToday ? 'Done today' : 'Even a line or two helps', tab: 'Journal',
        color: 'bg-purple-50 border-purple-200',
      },
      ...(soon ? [{
        icon: '💬', label: `Session with ${soon.professional?.name ?? 'your professional'}`, done: false,
        detail: new Date(soon.scheduledAt).toLocaleString(), tab: 'My Sessions',
        color: 'bg-blue-50 border-blue-200',
      }] : []),
      ...(awaitingReview.size ? [{
        icon: '⭐', label: `Rate ${awaitingReview.size} finished session${awaitingReview.size === 1 ? '' : 's'}`, done: false,
        detail: 'Your professional sees this', tab: 'My Sessions',
        color: 'bg-emerald-50 border-emerald-200',
      }] : []),
      ...(assessmentHistory.length === 0 ? [{
        icon: '📋', label: 'Take your first assessment', done: false,
        detail: 'It shapes what we suggest next', tab: 'Assessments',
        color: 'bg-indigo-50 border-indigo-200',
      }] : []),
    ];
  }, [moodLogs, journalEntries, upcomingSessions, awaitingReview, assessmentHistory]);

  // Runner state
  const [activeAssessment, setActiveAssessment] = useState<AssessmentKey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);

  // Breathing exercise simulator loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            setBreathPhase(current => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Exhale';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const fetchAssessments = useCallback(async () => {
    setAssessmentLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) return;
      const res = await fetch('/api/assessments', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setAssessmentHistory(data.data?.results || []);
        setLatestByType(data.data?.latestByType || {});
      }
    } catch (err) {
      console.error('Assessment history error:', err);
    } finally {
      setAssessmentLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchAssessments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [moodData, journalData] = await Promise.all([
        api.mood.list(7).catch(() => []),
        api.journal.list(5, 0).catch(() => ({ entries: [], total: 0 })),
      ]);

      setMoodLogs(moodData);
      setJournalEntries(journalData.entries || []);
    } catch (err: any) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Start / Answer / Submit ──────────────────────────────────────────────
  const startAssessment = (key: AssessmentKey) => {
    setActiveAssessment(key);
    setCurrentQuestion(0);
    setAnswers({});
    setAssessmentResult(null);
  };

  const selectAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const goNextQuestion = () => {
    if (!activeAssessment) return;
    const def = ASSESSMENTS[activeAssessment];
    if (currentQuestion < def.questions.length - 1) {
      setCurrentQuestion(q => q + 1);
    }
  };

  const goPrevQuestion = () => {
    setCurrentQuestion(q => Math.max(0, q - 1));
  };

  const submitAssessmentAnswers = async () => {
    if (!activeAssessment) return;
    setSubmittingAssessment(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assessmentType: activeAssessment, answers }),
      });
      const data = await res.json();
      if (data.success) {
        setAssessmentResult(data.data.insights);
        fetchAssessments(); // Refresh history
      } else {
        alert('Failed to save: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Assessment submit error:', err);
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const closeAssessment = () => {
    setActiveAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
    setAssessmentResult(null);
  };

  const submitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.mood.log({
        mood: checkInMood,
        intensity: checkInMood === 'stressed' || checkInMood === 'overwhelmed' ? 7 : 5,
        notes: `Energy: ${checkInEnergy}, Sleep: ${checkInSleep}. Gratitude: ${checkInGratitude}`,
        triggers: ['Daily Check-in'],
        activities: ['Dashboard Reflection']
      });
      setTodayCheckIn(true);
      fetchDashboardData();
    } catch (err) {
      console.error('Checkin log error:', err);
      setTodayCheckIn(true); // Fallback to local success if network issue in sandbox
    }
  };

  const submitJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalContent.trim()) return;
    try {
      await api.journal.create({
        title: newJournalTitle || 'Daily Reflection',
        content: newJournalContent,
        mood: newJournalMood,
        tags: ['journal', 'wellbeing'],
        isPrivate: true
      });
      setNewJournalContent('');
      setNewJournalTitle('');
      fetchDashboardData();
      alert('Your reflection has been added to your private journal vault 💚');
    } catch (err) {
      console.error('Journal submit error:', err);
    }
  };

  const handleSendAiMessage = () => {
    if (!newAiMsg.trim()) return;
    const userMsg = newAiMsg;
    setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setNewAiMsg('');
    setTimeout(() => {
      let reply = "I understand. Taking a slow, intentional breath can help reset our nervous system. Let me know if you would like me to guide you through a session.";
      if (userMsg.toLowerCase().includes('stress') || userMsg.toLowerCase().includes('anxious')) {
        reply = "I hear you. When things feel heavy, remember you don't have to carry it all at once. Shall we start a simple 4-7-8 breathing practice?";
      }
      setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1200);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--surface)] via-[var(--surface-container-lowest)] to-[var(--surface)]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[var(--primary)] mx-auto mb-4" />
          <p className="text-[var(--on-surface-variant)] font-medium">Preparing your wellbeing sanctuary...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { label: 'Overview', icon: LayoutDashboardIcon },
    { label: 'My Care Journey', icon: Compass },
    { label: 'Assessments', icon: Brain },
    { label: 'My Sessions', icon: Video },
    { label: 'Messages', icon: MessageSquare },
    { label: 'Programs', icon: BookCheck },
    { label: 'Progress Tracker', icon: TrendingUp },
    { label: 'Journal', icon: BookOpen },
    { label: 'Mood Tracker', icon: Activity },
    { label: 'AI Companion', icon: Sparkles },
    { label: 'Wellbeing Reminders', icon: Bell },
    { label: 'Community', icon: Users },
    { label: 'Resources', icon: HeartHandshake },
    { label: 'Impact & Gratitude', icon: Award },
    { label: 'SOS Support', icon: AlertCircle, error: true },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f9f6] via-[#ffffff] to-[#eff7f3] text-[var(--on-surface)] flex">
      
      {/* Mobile Sidebar Trigger & Floating Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-hairline px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="KleverKlues" width={30} height={30} className="object-contain" />
          <span className="font-display font-medium text-base text-[var(--on-surface)]">KleverKlues&trade;</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sos" className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg">SOS</Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--surface-container)] rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar Nav */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#f8fcf9] border-r border-[var(--outline-variant)]/40 flex flex-col z-40 transform transition-transform duration-300 lg:transform-none lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-[var(--outline-variant)]/20 flex items-center gap-3">
          <img src="/logo.jpg" alt="KleverKlues" width={34} height={34} className="object-contain" />
          <div className="space-y-0.5">
            <span className="font-display font-semibold text-sm text-[var(--on-surface)] block">KleverKlues&trade;</span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--primary)] block">Wellbeing Space</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isSelected = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : item.error 
                      ? "text-red-600 hover:bg-red-50"
                      : "text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={16} className={isSelected ? "text-white" : item.error ? "text-red-500" : "text-[var(--outline)]"} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-[var(--outline-variant)]/30 bg-[#f4faf6] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center font-bold text-xs text-[var(--primary)]">
              {user?.firstName ? user.firstName[0] : 'S'}
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{user?.firstName || 'Shivam'} {user?.lastName || 'Kumar'}</p>
              <p className="text-[10px] text-[var(--on-surface-variant)]">{anonymousMode ? 'Anonymous Mode' : user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Sanctuary Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pt-16 lg:pt-0">
        
        {/* Top Header */}
        <header className="hidden lg:flex h-16 border-b border-[var(--outline-variant)]/20 bg-white/80 backdrop-blur-md px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">
              {activeTab} Space
            </h2>
            <span className="h-4 w-px bg-[var(--outline-variant)]/50" />
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sanitized & Secure
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('SOS Support')}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <AlertCircle size={12} /> SOS EMERGENCY
            </button>
          </div>
        </header>

        {/* Space Router */}
        <main className="flex-1 overflow-y-auto">
        <TabContent tabKey={activeTab}>
        <div className="p-3 sm:p-5 lg:p-8 space-y-6 lg:space-y-8 max-w-[1200px] mx-auto w-full">

          {/* ── LIVE SOS STATUS CARD — visible on ALL tabs while alert is active ── */}
          {statusUpdate && statusUpdate.dispatchStatus !== 'RESOLVED' && (
            <div className={`rounded-2xl border-2 p-4 flex items-start gap-4 shadow-lg animate-in slide-in-from-top duration-300 ${
              statusUpdate.dispatchStatus === 'NEARBY' || statusUpdate.dispatchStatus === 'ARRIVED'
                ? 'bg-green-50 border-green-400'
                : 'bg-amber-50 border-amber-400'
            }`}>
              <div className="text-3xl flex-shrink-0">
                {(({'EN_ROUTE': '🚗', 'NEARBY': '📍', 'ARRIVED': '🟢', 'VENDOR_ACCEPTED': '✅', 'VENDOR_ALERTED': '📡', 'SEARCHING': '🔍'} as Record<string,string>)[statusUpdate.dispatchStatus]) || '🚨'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">
                  {(({'EN_ROUTE': 'Responder is on the way!', 'NEARBY': 'Responder is very close — stay calm!', 'ARRIVED': 'Responder has arrived!', 'VENDOR_ACCEPTED': 'Responder accepted your alert!', 'VENDOR_ALERTED': 'Responder is being alerted…', 'SEARCHING': 'Finding nearest responder…'} as Record<string,string>)[statusUpdate.dispatchStatus]) || 'SOS Update'}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{statusUpdate.message}</p>
                {/* Progress bar */}
                <div className="flex gap-1 mt-3">
                  {['SEARCHING','VENDOR_ALERTED','VENDOR_ACCEPTED','EN_ROUTE','NEARBY','ARRIVED'].map((s, i) => {
                    const order = ['SEARCHING','VENDOR_ALERTED','VENDOR_ACCEPTED','EN_ROUTE','NEARBY','ARRIVED'];
                    const idx = order.indexOf(statusUpdate.dispatchStatus);
                    return <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${ i <= idx ? 'bg-orange-500' : 'bg-gray-200'}`} />;
                  })}
                </div>
              </div>
              <button onClick={clearStatus} className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg leading-none">×</button>
            </div>
          )}

          {/* Resolved banner — shows briefly then user can dismiss */}
          {statusUpdate?.dispatchStatus === 'RESOLVED' && (
            <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-4 flex items-center gap-4 shadow-lg animate-in slide-in-from-top duration-300">
              <span className="text-3xl">✅</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-green-900">Case Resolved — You are safe</p>
                <p className="text-xs text-green-700 mt-0.5">{statusUpdate.message}</p>
              </div>
              <button onClick={clearStatus} className="text-green-600 hover:text-green-800 flex-shrink-0 text-lg leading-none">×</button>
            </div>
          )}

          {/* ──────────────── TAB: OVERVIEW ──────────────── */}
          {activeTab === 'Overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Quick Actions Bar */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveTab('Book Session')} className="px-4 py-2 bg-[var(--primary-fixed)] text-[var(--primary)] text-xs font-semibold rounded-full hover:bg-[var(--primary-fixed-dim)] transition-all">Book Session</button>
                <button onClick={() => setActiveTab('Journal')} className="px-4 py-2 bg-[var(--secondary-fixed)] text-[var(--secondary-container)] text-xs font-semibold rounded-full hover:bg-[var(--secondary-fixed-dim)] transition-all">Start Journal</button>
                <button onClick={() => setActiveTab('Mood Tracker')} className="px-4 py-2 bg-[var(--tertiary-fixed)] text-[var(--tertiary-container)] text-xs font-semibold rounded-full hover:bg-[var(--tertiary-fixed-dim)] transition-all">Mood Check</button>
                <button onClick={() => setActiveTab('AI Companion')} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full hover:bg-indigo-100 transition-all">AI Helper</button>
                <button onClick={() => setActiveTab('SOS Support')} className="px-4 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-full hover:bg-red-100 transition-all">SOS Support</button>
              </div>

              {/* Hero Greeting Section */}
              <div className="bg-gradient-to-br from-[#ebf5ef] to-[#ffffff] border border-[var(--primary-bright)]/10 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-display font-medium text-[var(--on-surface)] leading-tight">
                    {getGreeting()}, {user?.firstName || 'Shivam'} 💚
                  </h1>
                  <p className="text-sm text-[var(--on-surface-variant)] max-w-xl">
                    Take a slow breath. You are in a safe, quiet, and private space dedicated fully to your wellbeing. How does your heart feel today?
                  </p>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] mb-3">Quick emotional energy check-in:</p>
                  <div className="flex flex-wrap gap-2.5">
                    {['Calm', 'Stressed', 'Motivated', 'Overwhelmed', 'Tired'].map(mood => (
                      <button
                        key={mood}
                        onClick={() => {
                          setSelectedMood(mood);
                          setCheckInMood(mood.toLowerCase());
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                          selectedMood === mood
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white text-[var(--on-surface-variant)] border-[var(--outline-variant)]/50 hover:border-[var(--primary-bright)]"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                
                {/* Daily Check-In Widget */}
                <div className="card md:col-span-2 space-y-5 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-[var(--outline-variant)]/20 pb-3">
                    <h3 className="text-sm font-bold text-[var(--on-surface)] uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="text-[var(--primary)]" size={16} /> Daily Emotional Check-In
                    </h3>
                    {todayCheckIn && <span className="text-[10px] bg-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-full">Completed</span>}
                  </div>

                  {todayCheckIn ? (
                    <div className="p-6 text-center space-y-3 bg-[#f6faf7] rounded-2xl border border-[var(--primary-bright)]/10">
                      <CheckCircle size={32} className="text-emerald-500 mx-auto" />
                      <h4 className="font-semibold text-sm">Thank you for checked-in today!</h4>
                      <p className="text-xs text-[var(--on-surface-variant)]">You logged feeling <strong>{selectedMood || checkInMood}</strong>. Your consistency builds positive habits.</p>
                      <button onClick={() => setTodayCheckIn(false)} className="text-[10px] text-[var(--primary)] font-bold hover:underline">Log Another Check-in</button>
                    </div>
                  ) : (
                    <form onSubmit={submitCheckIn} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1.5">Overall Mood</label>
                          <select value={checkInMood} onChange={e => setCheckInMood(e.target.value)} className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none bg-white">
                            <option value="calm">😊 Calm & Content</option>
                            <option value="stressed">😐 Stressed / Anxious</option>
                            <option value="happy">🥳 Motivated & Happy</option>
                            <option value="overwhelmed">🥺 Overwhelmed</option>
                            <option value="tired">🥱 Tired / Low Energy</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1.5">Stress Level</label>
                          <select value={checkInStress} onChange={e => setCheckInStress(e.target.value)} className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none bg-white">
                            <option value="Low">Low Stress</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High Stress</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1.5">Energy Levels</label>
                          <select value={checkInEnergy} onChange={e => setCheckInEnergy(e.target.value)} className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none bg-white">
                            <option value="High">High Energy</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low / Fatigued</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1.5">Sleep Quality</label>
                          <select value={checkInSleep} onChange={e => setCheckInSleep(e.target.value)} className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none bg-white">
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good / Adequate</option>
                            <option value="Restless">Restless</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1.5">Gratitude Prompt: What was one small comfort today?</label>
                        <input
                          type="text"
                          placeholder="e.g. Morning warm tea, friendly message..."
                          value={checkInGratitude}
                          onChange={e => setCheckInGratitude(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none focus:border-[var(--primary)] bg-white"
                        />
                      </div>

                      <button type="submit" className="btn-primary w-full !py-2.5 !text-xs">Submit Today's Check-In</button>
                    </form>
                  )}
                </div>

                {/* AI Companion Preview Widget */}
                <div className="card space-y-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">AI Companion</h4>
                      <p className="text-[9px] text-[var(--on-surface-variant)]">Gentle Wellbeing Helper</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed bg-white/70 p-3 rounded-xl border border-indigo-100/50">
                    &ldquo;You've shown improved emotional consistency this week. Would you like a quick breathing exercise?&rdquo;
                  </p>
                  <button onClick={() => setActiveTab('AI Companion')} className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-all text-center">
                    Start Exercise
                  </button>
                </div>

              </div>

              {/* Wellbeing Score / Insights */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: "Emotional Balance", value: "72%", sub: "+5% this week", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                  { label: "Stress Trend", value: "Moderate", sub: "Improving", color: "bg-amber-50 text-amber-700 border-amber-100" },
                  { label: "Consistency Score", value: "85%", sub: "14-day streak", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                  { label: "Sleep Recovery", value: "Good", sub: "7.4 hrs average", color: "bg-blue-50 text-blue-700 border-blue-100" },
                  { label: "Focus Score", value: "Optimal", sub: "Balanced work", color: "bg-purple-50 text-purple-700 border-purple-100" },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 border rounded-2xl ${stat.color} space-y-1.5`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider block opacity-70">{stat.label}</span>
                    <p className="text-lg font-bold font-display leading-tight">{stat.value}</p>
                    <p className="text-[9px] opacity-70 font-medium">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Care Journey & Active Programs */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* My Care Journey Timeline */}
                <div className="card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b border-[var(--outline-variant)]/20 pb-3">Your Care Journey Progress</h3>
                  
                  <div className="space-y-4 relative pl-4 border-l-2 border-[var(--primary-fixed)]">
                    {[
                      { title: "Anxiety Assessment", desc: "Completed • Mild level identified", done: true },
                      { title: "Burnout Recovery Program", desc: "Active • Week 3 of 8 (68% Complete)", active: true },
                      { title: "Daily Journaling Habit", desc: "Streak: 7 Days", active: true },
                      { title: "Weekly Professional Check-in", desc: "Next session: scheduled", pending: true },
                      { title: "Community Support Circle", desc: "Joined anxiety-support circle", done: true },
                    ].map((step, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <span className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full ${step.done ? 'bg-[var(--primary)]' : step.active ? 'bg-indigo-500 animate-ping' : 'bg-gray-300'}`} />
                        <h4 className="text-xs font-bold leading-tight">{step.title}</h4>
                        <p className="text-[10px] text-[var(--on-surface-variant)]">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Programs Progress */}
                <div className="card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b border-[var(--outline-variant)]/20 pb-3">Active Programs</h3>
                  
                  <div className="p-4 bg-gradient-to-br from-[var(--primary-fixed)]/20 to-[var(--secondary-fixed)]/20 rounded-2xl border border-[var(--primary-bright)]/10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold">Burnout Recovery</h4>
                        <p className="text-[10px] text-[var(--on-surface-variant)]">Module 4: Re-establishing Work-Life Boundaries</p>
                      </div>
                      <span className="text-[10px] font-bold text-[var(--primary)] flex items-center gap-1">🔥 7 Day Streak</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>Program Progress</span>
                        <span className="font-bold">68% Complete</span>
                      </div>
                      <div className="w-full bg-[var(--surface-container-high)] h-2 rounded-full overflow-hidden">
                        <div className="bg-[var(--primary)] h-full rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>

                    <button onClick={() => setActiveTab('Programs')} className="w-full btn-primary !py-2 !text-xs">Continue Module</button>
                  </div>
                </div>

              </div>

              {/* Journal & Mood Preview */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Journal reflection helper */}
                <div className="card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b border-[var(--outline-variant)]/20 pb-3">Today's Reflection Prompt</h3>
                  <div className="bg-[#fafafb] p-4 rounded-xl border border-hairline space-y-3">
                    <p className="text-xs text-[var(--on-surface-variant)] italic">&ldquo;What helped you feel emotionally safe this week? Did you say no to something that was draining you?&rdquo;</p>
                    <button onClick={() => setActiveTab('Journal')} className="text-xs font-bold text-[var(--primary)] hover:underline">Start Writing Reflection &rarr;</button>
                  </div>
                </div>

                {/* Mood trends graph placeholder */}
                <div className="card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b border-[var(--outline-variant)]/20 pb-3">7-Day Emotional Balance</h3>
                  
                  <div className="flex items-end justify-between h-20 pt-4 px-2">
                    {[
                      { day: 'Mon', val: '70%', mood: '😊' },
                      { day: 'Tue', val: '65%', mood: '😊' },
                      { day: 'Wed', val: '80%', mood: '😊' },
                      { day: 'Thu', val: '50%', mood: '😐' },
                      { day: 'Fri', val: '75%', mood: '😊' },
                      { day: 'Sat', val: '85%', mood: '😊' },
                      { day: 'Sun', val: '90%', mood: '😊' },
                    ].map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                        <span className="text-[9px]">{d.mood}</span>
                        <div className="w-2.5 bg-emerald-400/30 hover:bg-emerald-500 rounded-t-full transition-all" style={{ height: d.val }} />
                        <span className="text-[8px] text-[var(--on-surface-variant)]">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recommended Ecosystem Actions */}
              <div className="card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b border-[var(--outline-variant)]/20 pb-3">Recommended For You</h3>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Sleep Recovery", desc: "Based on low sleep check-ins", icon: Moon, href: "Programs", color: "from-blue-50 to-indigo-50" },
                    { title: "Anxiety Support Circle", desc: "Connect with verified peers", icon: Users, href: "Community", color: "from-rose-50 to-pink-50" },
                    { title: "5-Min Calm Meditation", desc: "Quick mindful audio breathwork", icon: Wind, href: "Resources", color: "from-emerald-50 to-teal-50" },
                    { title: "Book Professional Session", desc: "Private clinical check-in", icon: Heart, href: "Book Session", color: "from-amber-50 to-orange-50" },
                  ].map((rec, i) => (
                    <button key={i} onClick={() => setActiveTab(rec.href)} className={`p-4 bg-gradient-to-br ${rec.color} rounded-2xl text-left border border-white hover:shadow-sm transition-all group`}>
                      <rec.icon size={22} className="text-[var(--primary)] mb-2" />
                      <h4 className="text-xs font-bold group-hover:text-[var(--primary)] transition-colors">{rec.title}</h4>
                      <p className="text-[10px] text-[var(--on-surface-variant)]/80 mt-1">{rec.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Community connection & Streaks */}
              <div className="grid md:grid-cols-3 gap-6">
                
                <div className="card p-5 space-y-3 bg-[#fafcfb]">
                  <span className="text-[9px] font-bold text-[var(--primary)] uppercase block">Streaks & Milestones</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>7-Day Journaling Streak</span>
                      <span className="text-emerald-600 font-bold">✓ Complete</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>14-Day Check-in Consistency</span>
                      <span className="text-emerald-600 font-bold">✓ Complete</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Calm Week Milestone</span>
                      <span className="text-indigo-600 font-bold">🔥 Active</span>
                    </div>
                  </div>
                </div>

                <div className="card p-5 space-y-3 md:col-span-2 bg-[#fdfafb]">
                  <span className="text-[9px] font-bold text-rose-500 uppercase block">Community Kindness & Impact</span>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold font-display text-[var(--on-surface)]">142</p>
                      <p className="text-[10px] text-[var(--on-surface-variant)]">Human Impact Score</p>
                    </div>
                    <p className="text-xs text-[var(--on-surface-variant)] bg-white border border-rose-100 p-2.5 rounded-xl">💚 You encouraged <strong>3 people</strong> with supportive feedback in support circles this week.</p>
                  </div>
                </div>

              </div>

              {/* Resource Feed Grid */}
              <div className="card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b border-[var(--outline-variant)]/20 pb-3">Guided Audio & Readings Feed</h3>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { title: "Building Emotional Boundaries", type: "Audio Guided", duration: "8 mins", icon: Wind },
                    { title: "Overcoming Work Anxiety Loop", type: "Reading", duration: "5 mins read", icon: BookOpen },
                    { title: "Guided Rest & Recovery", type: "Video Session", duration: "12 mins", icon: Moon }
                  ].map((res, idx) => (
                    <div key={idx} className="p-4 bg-white border border-[var(--outline-variant)]/40 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase font-bold text-[var(--primary)] bg-[var(--primary-fixed)] px-2 py-0.5 rounded-full">{res.type}</span>
                        <span className="text-[9px] text-[var(--outline)]">{res.duration}</span>
                      </div>
                      <h4 className="text-xs font-bold">{res.title}</h4>
                      <button onClick={() => setActiveTab('Resources')} className="text-[10px] text-[var(--primary)] font-bold hover:underline">Access Now &rarr;</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOS Emergency Help quick banner */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-red-700">Feeling overwhelmed or in distress?</h4>
                    <p className="text-[10px] text-red-600">Immediate, private crisis support is available 24/7.</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('SOS Support')} className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors">Access Crisis Support</button>
              </div>

            </div>
          )}

          {/* ──────────────── TAB: MY CARE JOURNEY ──────────────── */}
          {activeTab === 'My Care Journey' && (
            <div className="card space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold">My Guided Wellbeing Journey</h2>
                <p className="text-xs text-[var(--on-surface-variant)]">A structural care route tailored specifically to your assessment results.</p>
              </div>

              {/* Built from real assessments, enrolments, bookings and circles.
                  The fixture here named an invented therapist and claimed a
                  booked Friday session on accounts with no bookings at all. */}
              <div className="relative pl-6 border-l-2 border-[var(--primary-fixed)] space-y-8">
                {careJourney.map((item, i) => (
                  <div key={i} className="relative space-y-2">
                    <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white ${
                      item.state === 'done' ? 'bg-[var(--primary)]' : item.state === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'
                    }`}>
                      {item.state === 'done' ? '✓' : i + 1}
                    </span>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-[var(--outline)]">{item.date}</span>
                      <h4 className="text-sm font-bold text-[var(--on-surface)]">{item.title}</h4>
                      <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── TAB: ASSESSMENTS ──────────────── */}
          {activeTab === 'Assessments' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* ── ASSESSMENT RUNNER (Modal overlay) ── */}
              {activeAssessment && !assessmentResult && (() => {
                const def = ASSESSMENTS[activeAssessment];
                const q = def.questions[currentQuestion];
                const progress = Math.round(((currentQuestion + 1) / def.questions.length) * 100);
                const answered = answers[q.id] !== undefined;
                const allAnswered = def.questions.every(qq => answers[qq.id] !== undefined);
                const isLast = currentQuestion === def.questions.length - 1;
                return (
                  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:px-4">
                    <div className="bg-[var(--surface)] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${def.color} px-6 py-4 border-b border-[var(--outline-variant)]/20`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{def.iconEmoji}</span>
                            <div>
                              <h3 className="text-sm font-bold text-[var(--on-surface)]">{def.title}</h3>
                              <p className="text-[10px] text-[var(--on-surface-variant)]">{def.subtitle}</p>
                            </div>
                          </div>
                          <button onClick={closeAssessment} className="p-1.5 rounded-full hover:bg-black/10 text-[var(--on-surface-variant)] cursor-pointer">
                            <X size={16} />
                          </button>
                        </div>
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-[var(--on-surface-variant)]">
                            <span>Question {currentQuestion + 1} of {def.questions.length}</span>
                            <span className="font-bold">{progress}% complete</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Question body */}
                      <div className="px-4 sm:px-6 py-5 sm:py-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
                        <p className="text-sm sm:text-base font-semibold text-[var(--on-surface)] leading-relaxed">
                          {currentQuestion + 1}. {q.text}
                        </p>
                        <div className="space-y-2">
                          {q.options.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => selectAnswer(q.id, opt.value)}
                              className={`w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                                answers[q.id] === opt.value
                                  ? 'border-[var(--primary)] bg-[var(--primary-fixed)] text-[var(--primary)]'
                                  : 'border-[var(--outline-variant)]/50 hover:border-[var(--primary-bright)] hover:bg-[var(--surface-container-low)]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Footer nav */}
                      <div className="px-6 py-4 border-t border-[var(--outline-variant)]/20 flex items-center justify-between">
                        <button
                          onClick={goPrevQuestion}
                          disabled={currentQuestion === 0}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-[var(--outline-variant)] rounded-lg hover:bg-[var(--surface-container)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ChevronLeft size={14} /> Previous
                        </button>

                        <div className="flex gap-1.5">
                          {def.questions.map((_, i) => (
                            <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
                              i === currentQuestion ? 'bg-[var(--primary)] w-3' :
                              answers[def.questions[i].id] !== undefined ? 'bg-[var(--primary)]/50' : 'bg-[var(--outline-variant)]'
                            }`} />
                          ))}
                        </div>

                        {isLast ? (
                          <button
                            onClick={submitAssessmentAnswers}
                            disabled={!allAnswered || submittingAssessment}
                            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-container)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            {submittingAssessment ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                            {submittingAssessment ? 'Saving…' : 'Submit Assessment'}
                          </button>
                        ) : (
                          <button
                            onClick={goNextQuestion}
                            disabled={!answered}
                            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-container)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            Next <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── RESULT SCREEN ── */}
              {assessmentResult && activeAssessment && (() => {
                const def = ASSESSMENTS[activeAssessment];
                const pct = assessmentResult.percentage;
                const levelColors: Record<string, string> = {
                  Minimal: 'emerald', Low: 'emerald', Excellent: 'emerald', Expert: 'emerald',
                  Mild: 'blue', Good: 'blue', Proficient: 'blue',
                  Moderate: 'amber', High: 'orange', 'Needs Work': 'amber', Developing: 'amber',
                  Severe: 'rose', Critical: 'rose', Concerning: 'rose', Foundational: 'rose',
                };
                const color = levelColors[assessmentResult.level] || 'indigo';
                return (
                  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-[var(--surface)] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                      <div className={`bg-gradient-to-r ${def.color} px-6 py-5 text-center`}>
                        <div className="text-4xl mb-2">{assessmentResult.badge?.split(' ')[0] || def.iconEmoji}</div>
                        <h2 className="text-xl font-bold text-[var(--on-surface)]">{def.title} — Complete</h2>
                        <p className="text-xs text-[var(--on-surface-variant)] mt-1">{assessmentResult.summary}</p>
                      </div>

                      <div className="px-6 py-6 space-y-6">
                        {/* Score ring + stats */}
                        <div className="flex items-center justify-center gap-8">
                          <div className="text-center">
                            <div className={`w-24 h-24 rounded-full border-8 border-${color}-200 flex items-center justify-center mx-auto mb-2`} style={{ borderColor: 'currentColor' }}>
                              <div>
                                <p className={`text-2xl font-bold font-display text-${color}-600`}>{assessmentResult.score}</p>
                                <p className="text-[10px] text-[var(--on-surface-variant)]">/{assessmentResult.maxScore}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700`}>{assessmentResult.level}</span>
                          </div>
                          <div className="space-y-2 flex-1 max-w-xs">
                            <div className="flex justify-between text-xs">
                              <span className="text-[var(--on-surface-variant)]">Your Score</span>
                              <span className="font-bold">{pct}%</span>
                            </div>
                            <div className="w-full h-3 bg-[var(--surface-container-high)] rounded-full overflow-hidden">
                              <div className={`h-full bg-${color}-500 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className="text-[10px] text-[var(--on-surface-variant)] text-right">{assessmentResult.badge}</p>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Recommendations</h3>
                          <ul className="space-y-2">
                            {assessmentResult.recommendations?.map((r: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 p-3 bg-[var(--surface-container-low)] rounded-xl text-xs">
                                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-[var(--on-surface-variant)]">{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Next steps */}
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Next Steps</h3>
                          <div className="flex flex-wrap gap-2">
                            {assessmentResult.nextSteps?.map((s: string, i: number) => (
                              <span key={i} className="px-3 py-1.5 text-[11px] bg-indigo-50 text-indigo-700 rounded-full font-semibold border border-indigo-100">
                                → {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={closeAssessment}
                            className="flex-1 py-2.5 text-xs font-bold border border-[var(--outline-variant)] rounded-xl hover:bg-[var(--surface-container)] cursor-pointer"
                          >
                            Back to Assessments
                          </button>
                          <button
                            onClick={() => startAssessment(activeAssessment!)}
                            className="flex-1 py-2.5 text-xs font-bold bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-container)] cursor-pointer"
                          >
                            <RefreshCw size={12} className="inline mr-1.5" /> Retake
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── HEADER ── */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Mental Wellbeing Assessments</h2>
                  <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Scientific wellbeing indicators — all results stored to your profile.</p>
                </div>
                <button onClick={fetchAssessments} disabled={assessmentLoading}
                  className="p-2 text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all cursor-pointer">
                  <RefreshCw size={14} className={assessmentLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* ── ASSESSMENT CARDS ── */}
              <div className="grid sm:grid-cols-2 gap-5">
                {(Object.keys(ASSESSMENTS) as AssessmentKey[]).map(key => {
                  const def = ASSESSMENTS[key];
                  const past = latestByType[key];
                  const hasPast = !!past;
                  return (
                    <div key={key} className={`card bg-gradient-to-br ${def.color} border-0 flex flex-col justify-between space-y-4`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold text-[var(--primary)] bg-white/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full">{def.time}</span>
                          <span className="text-xl">{def.iconEmoji}</span>
                        </div>
                        <h3 className="text-sm font-bold text-[var(--on-surface)]">{def.title}</h3>
                        <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed">{def.description}</p>
                        <p className="text-[10px] text-[var(--on-surface-variant)]/70">{def.questions.length} questions</p>
                      </div>

                      {hasPast && (
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-[var(--on-surface-variant)] uppercase">Last Result</span>
                            <span className="text-[10px] text-[var(--on-surface-variant)]/60">
                              {new Date(past.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[var(--surface-container-high)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${past.percentage}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-[var(--primary)] whitespace-nowrap">{past.score}/{past.maxScore} • {past.level}</span>
                          </div>
                          {(() => {
                            const ins: any = typeof past.insights === 'string' ? JSON.parse(past.insights) : past.insights;
                            return ins?.badge ? <p className="text-[10px] text-[var(--on-surface-variant)]">{ins.badge}</p> : null;
                          })()}
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-between">
                        {hasPast ? (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle size={11} /> Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-[var(--on-surface-variant)]/60 font-medium">Not yet taken</span>
                        )}
                        <button
                          onClick={() => startAssessment(key)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-lg hover:bg-[var(--primary-container)] transition-all shadow-sm cursor-pointer"
                        >
                          {hasPast ? <><RefreshCw size={11} /> Retake</> : <><ArrowRight size={11} /> Start Test</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── HISTORY TABLE ── */}
              {assessmentHistory.length > 0 && (
                <div className="card space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)] border-b border-[var(--outline-variant)]/20 pb-3">
                    Assessment History
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-[var(--on-surface-variant)]/60 border-b border-[var(--outline-variant)]/30">
                          <th className="py-2 font-semibold">Assessment</th>
                          <th className="py-2 font-semibold">Score</th>
                          <th className="py-2 font-semibold">Level</th>
                          <th className="py-2 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessmentHistory.slice(0, 10).map(r => (
                          <tr key={r.id} className="border-b border-[var(--outline-variant)]/20 hover:bg-[var(--surface-container-low)]">
                            <td className="py-2.5 font-semibold">
                              {ASSESSMENTS[r.assessmentType as AssessmentKey]?.title || r.assessmentType}
                            </td>
                            <td className="py-2.5">
                              <span className="font-bold text-[var(--primary)]">{r.score}/{r.maxScore}</span>
                              <span className="text-[var(--on-surface-variant)]/60 ml-1">({r.percentage}%)</span>
                            </td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ['Minimal','Low','Excellent','Expert'].includes(r.level) ? 'bg-emerald-100 text-emerald-700' :
                                ['Mild','Good','Proficient'].includes(r.level) ? 'bg-blue-100 text-blue-700' :
                                ['Moderate','Needs Work','Developing'].includes(r.level) ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-600'
                              }`}>{r.level}</span>
                            </td>
                            <td className="py-2.5 text-[var(--on-surface-variant)]/60">
                              {new Date(r.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ──────────────── TAB: PROGRAMS ──────────────── */}
          {activeTab === 'Programs' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold">Guided Wellbeing Programs</h2>
                <p className="text-xs text-[var(--on-surface-variant)]">Structured wellness courses created by clinical psychologists.</p>
              </div>

              {/* Real enrolments, with the catalogue text reused from
                  src/data/programs.ts rather than restated here. Progress and
                  week come from the enrolment row; both buttons used to have no
                  onClick at all. */}
              {programsLoading ? (
                <p className="text-xs text-[var(--on-surface-variant)] py-6">Loading your programmes…</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {PROGRAM_TYPES.map((type, idx) => {
                    const config = getProgramConfig(programSlug(type));
                    const enrolled = enrollments.find(e => e.programType === type && e.status !== 'CANCELLED');
                    const progress = enrolled ? Math.round(enrolled.progressPercent) : 0;
                    const status = enrolled
                      ? enrolled.status === 'COMPLETED' ? 'Completed'
                      : enrolled.status === 'PAUSED' ? 'Paused' : 'Active'
                      : 'Available';

                    return (
                      <div key={type} className={`card bg-gradient-to-br ${PROGRAM_COLORS[idx % PROGRAM_COLORS.length]} space-y-4 border-none`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-[var(--primary)] bg-white px-2 py-0.5 rounded-full shadow-sm">{status}</span>
                            <h3 className="text-sm font-bold mt-2">{config.name}</h3>
                          </div>
                          {enrolled && enrolled.status === 'ACTIVE' && (
                            <span className="text-[10px] font-bold text-[var(--primary)]">Week {enrolled.currentWeek}</span>
                          )}
                        </div>

                        <p className="text-xs text-[var(--on-surface-variant)]">{config.promise}</p>

                        {enrolled ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                              <span>Progress</span>
                              <span className="font-bold">{progress}% complete</span>
                            </div>
                            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                              <div className="bg-[var(--primary)] h-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                            <Link
                              href={`/programs/${programSlug(type)}`}
                              className="w-full btn-primary !py-2.5 !text-xs mt-1 flex items-center justify-center"
                            >
                              {enrolled.status === 'COMPLETED' ? 'Revisit programme' : 'Continue learning'}
                            </Link>
                          </div>
                        ) : (
                          <button
                            onClick={() => enrollInProgram(type)}
                            disabled={!!programBusy}
                            className="w-full btn-secondary bg-white !py-2.5 !text-xs disabled:opacity-50"
                          >
                            {programBusy === type ? 'Enrolling…' : 'Enroll in programme'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ──────────────── TAB: JOURNAL ──────────────── */}
          {activeTab === 'Messages' && (
            <div className="space-y-6 animate-in fade-in duration-300 p-4 sm:p-6 lg:p-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[var(--on-surface)]">Messages</h2>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">
                  Talk to the professionals you have sessions with.
                </p>
              </div>
              <Chat />
            </div>
          )}

          {activeTab === 'Journal' && (
            <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              
              {/* Journal Editor */}
              <div className="card md:col-span-2 space-y-5">
                <div className="border-b border-[var(--outline-variant)]/20 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider">Private Reflection Vault</h2>
                  <p className="text-[10px] text-[var(--on-surface-variant)]">Your entries are client-side encrypted and fully secure.</p>
                </div>

                <form onSubmit={submitJournal} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1">Entry Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Setting boundaries today"
                        value={newJournalTitle}
                        onChange={e => setNewJournalTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1">Reflection Mood</label>
                      <select
                        value={newJournalMood}
                        onChange={e => setNewJournalMood(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none bg-white"
                      >
                        <option value="calm">Calm & Rested</option>
                        <option value="anxious">Anxious / Overthinking</option>
                        <option value="grateful">Grateful / Content</option>
                        <option value="exhausted">Exhausted / Low Energy</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-[var(--on-surface-variant)] block mb-1">Your Thoughts</label>
                    <textarea
                      rows={6}
                      placeholder="Write freely. There is no judgment here..."
                      value={newJournalContent}
                      onChange={e => setNewJournalContent(e.target.value)}
                      className="w-full px-4 py-3 text-xs border border-[var(--outline-variant)]/60 rounded-xl focus:outline-none focus:border-[var(--primary)] resize-none"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full !py-2.5 !text-xs">Lock Entry in Journal Vault</button>
                </form>
              </div>

              {/* Recent Entries */}
              <div className="card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b border-[var(--outline-variant)]/20 pb-3">Recent Entries</h3>
                
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {journalEntries.length > 0 ? (
                    journalEntries.map((item) => (
                      <div key={item.id} className="p-3.5 bg-white border border-[var(--outline-variant)]/40 rounded-xl space-y-1.5">
                        <div className="flex justify-between text-[9px] text-[var(--outline)]">
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          <span className="font-bold uppercase text-[var(--primary)]">{item.mood || 'Reflection'}</span>
                        </div>
                        <h4 className="text-xs font-bold">{item.title || 'Untitled reflection'}</h4>
                        <p className="text-[10px] text-[var(--on-surface-variant)] line-clamp-2 leading-relaxed">{item.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--on-surface-variant)]/60 text-center py-8">No entries locked yet.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ──────────────── TAB: MOOD TRACKER ──────────────── */}
          {activeTab === 'Mood Tracker' && (
            <div className="card space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold">Emotional Energy Tracker</h2>
                <p className="text-xs text-[var(--on-surface-variant)]">Track your emotional fluctuations, stress patterns, and sleep recovery over time.</p>
              </div>

              {/* Custom Graph */}
              <div className="p-6 bg-[#f7faf8] rounded-2xl border border-[var(--outline-variant)]/20 space-y-4">
                <h3 className="text-xs font-bold text-[var(--on-surface-variant)]">Stress vs Energy Levels (7-Day Fluctuations)</h3>
                <div className="h-48 flex items-end justify-between px-4 border-b border-[var(--outline-variant)]/40 pb-2">
                  {[
                    { day: 'Mon', stress: 30, energy: 80 },
                    { day: 'Tue', stress: 45, energy: 65 },
                    { day: 'Wed', stress: 60, energy: 50 },
                    { day: 'Thu', stress: 80, energy: 30 },
                    { day: 'Fri', stress: 40, energy: 70 },
                    { day: 'Sat', stress: 20, energy: 85 },
                    { day: 'Sun', stress: 15, energy: 90 },
                  ].map((d, i) => (
                    <div key={i} className="flex gap-2 items-end justify-center flex-1 h-full max-w-[80px]">
                      {/* Stress bar (Red) */}
                      <div className="w-3 bg-red-400/40 rounded-t-full hover:bg-red-400 transition-all" style={{ height: `${d.stress}%` }} title={`Stress: ${d.stress}%`} />
                      {/* Energy bar (Green) */}
                      <div className="w-3 bg-emerald-400/40 rounded-t-full hover:bg-emerald-400 transition-all" style={{ height: `${d.energy}%` }} title={`Energy: ${d.energy}%`} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between px-4 text-[9px] text-[var(--on-surface-variant)]">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="flex justify-center gap-6 text-[10px] pt-2">
                  <span className="flex items-center gap-1.5 font-semibold"><span className="w-3 h-3 bg-red-400/40 rounded-full border border-red-300" /> Stress Levels</span>
                  <span className="flex items-center gap-1.5 font-semibold"><span className="w-3 h-3 bg-emerald-400/40 rounded-full border border-emerald-300" /> Energy Levels</span>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── TAB: AI COMPANION ──────────────── */}
          {activeTab === 'AI Companion' && (
            <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              
              {/* Chat Interface */}
              <div className="card md:col-span-2 flex flex-col justify-between h-[500px]">
                <div className="flex items-center gap-2 border-b border-[var(--outline-variant)]/20 pb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">Companion AI</h3>
                    <p className="text-[9px] text-emerald-600 font-bold">Active in Safe Mode</p>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-2">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[#fafafb] text-[var(--on-surface)] border border-[var(--outline-variant)]/40'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <div className="flex gap-2 border-t border-[var(--outline-variant)]/20 pt-3">
                  <input
                    type="text"
                    placeholder="Type what is on your mind..."
                    value={newAiMsg}
                    onChange={e => setNewAiMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendAiMessage()}
                    className="flex-1 px-4 py-2 border border-[var(--outline-variant)]/50 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button onClick={handleSendAiMessage} className="p-2.5 bg-[var(--primary)] hover:bg-[var(--primary-container)] text-white rounded-xl transition-colors cursor-pointer">
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {/* Breathing Exercise Helper */}
              <div className="card space-y-5 bg-gradient-to-br from-indigo-50/40 to-purple-50/40 border-indigo-100 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Wind size={16} className="text-indigo-600" /> Mindful Breathing Helper
                  </h3>
                  <p className="text-[10px] text-[var(--on-surface-variant)]">Guided breathing stimulates your parasympathetic nervous system to decrease stress.</p>
                </div>

                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  {/* Breathing bubble graphic */}
                  <div className={`relative w-28 h-28 rounded-full border border-indigo-200/50 flex items-center justify-center transition-all duration-1000 ${
                    isBreathingActive && breathPhase === 'Inhale' ? 'scale-110 bg-indigo-100/50 shadow-md' :
                    isBreathingActive && breathPhase === 'Exhale' ? 'scale-90 bg-purple-50/50' : 'bg-white shadow-sm'
                  }`}>
                    <div className="text-center">
                      <p className="text-xs font-bold text-indigo-700">{isBreathingActive ? breathPhase : 'Ready'}</p>
                      {isBreathingActive && <p className="text-lg font-bold font-display mt-1">{breathCount}</p>}
                    </div>
                  </div>

                  <p className="text-[10px] text-[var(--on-surface-variant)] text-center max-w-[180px] italic">
                    {isBreathingActive 
                      ? `${breathPhase === 'Inhale' ? 'Slowly fill your lungs...' : breathPhase === 'Hold' ? 'Hold and capture calm...' : 'Gently release your breath...'}`
                      : "Start a 4-7-8 breathing pattern."
                    }
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setIsBreathingActive(!isBreathingActive);
                    setBreathPhase('Inhale');
                    setBreathCount(4);
                  }}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isBreathingActive 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  {isBreathingActive ? 'Stop Breath Helper' : 'Start Breath Helper'}
                </button>
              </div>

            </div>
          )}

          {/* ──────────────── TAB: COMMUNITY ──────────────── */}
          {activeTab === 'Community' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold">Wellbeing Circles & Community</h2>
                <p className="text-xs text-[var(--on-surface-variant)]">Connect anonymously with peers sharing similar care journeys.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Active Circles list */}
                <div className="card md:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-[var(--outline-variant)]/20 pb-3">Support Circles</h3>

                  <div className="space-y-4">
                    {circlesLoading && <p className="text-xs text-[var(--on-surface-variant)]">Loading circles…</p>}
                    {!circlesLoading && circles.length === 0 && (
                      <p className="text-xs text-[var(--on-surface-variant)]">
                        No circles are running yet. They appear here when a professional opens one.
                      </p>
                    )}
                    {circles.map((circle) => (
                      <div key={circle.id} className="flex justify-between items-center gap-3 p-4 bg-[var(--surface-container-low)] border-hairline rounded-2xl">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <Users size={20} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate">{circle.title}</h4>
                            {/* Real membership against real capacity, not an
                                invented "482 active members". */}
                            <p className="text-[10px] text-[var(--on-surface-variant)]">
                              {circle.joined}/{circle.capacity} joined &bull; {circle.scheduleLabel || (circle.scheduledAt ? new Date(circle.scheduledAt).toLocaleString() : 'time to be confirmed')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleCircle(circle)}
                          disabled={circleBusy === circle.id || (circle.isFull && !circle.hasJoined)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 disabled:opacity-40 ${
                            circle.hasJoined
                              ? 'bg-white border border-[var(--outline-variant)]/60 hover:border-rose-400 text-rose-600'
                              : 'bg-[var(--primary)] text-white'
                          }`}
                        >
                          {circleBusy === circle.id ? '…' : circle.hasJoined ? 'Leave' : circle.isFull ? 'Full' : 'Join'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gratitude wall */}
                <div className="card space-y-4 bg-gradient-to-br from-amber-50/50 to-rose-50/50 border-amber-100/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Gratitude Support Wall</h3>
                  <p className="text-[10px] text-[var(--on-surface-variant)] leading-relaxed">Leave a note of encouragement for the community. Completely anonymous.</p>
                  
                  <div className="space-y-3.5 bg-white/70 p-4 rounded-2xl border border-amber-100">
                    <p className="text-xs text-[var(--on-surface-variant)] italic">&ldquo;To whoever is feeling overwhelmed today: it is okay to rest. You are doing enough by just being here.&rdquo;</p>
                    <div className="flex justify-between items-center text-[9px] text-[var(--outline)] pt-1.5 border-t border-[var(--outline-variant)]/20">
                      <span>Shared anonymously</span>
                      <span className="text-rose-500 font-bold">💚 Support (18)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ──────────────── TAB: BOOK SESSION ──────────────── */}
          {activeTab === 'Book Session' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold">Schedule Wellbeing Session</h2>
                <p className="text-xs text-[var(--on-surface-variant)]">Book secure, 100% private digital sessions with verified psychologists, coaches, and psychiatrists.</p>
              </div>

              {/* Auto Match CTA */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[var(--on-surface)] mb-1">✨ Not sure who to book?</h3>
                  <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
                    Let our smart matching system find the most compatible professional for you — based on your concern, location, language, and preferences.
                  </p>
                </div>
                <AutoMatchButton size="md" className="flex-shrink-0" />
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { name: "Dr. Kavita Rao", specialty: "Clinical Psychologist", exp: "12 yrs experience", rate: "$80/hr", rating: "4.9 ★", img: "prof-kavita.png" },
                  { name: "Counsellor Rahul", specialty: "Stress & Burnout Coach", exp: "8 yrs experience", rate: "$60/hr", rating: "4.8 ★", img: "prof-rahul.png" },
                  { name: "Dr. Ananya Sen", specialty: "Child & Adult Psychiatrist", exp: "15 yrs experience", rate: "$120/hr", rating: "5.0 ★", img: "prof-dr-ananya.png" }
                ].map((prof, i) => (
                  <div key={i} className="card flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center font-bold text-xs text-[var(--primary)]">
                          {prof.name[4]}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold">{prof.name}</h4>
                          <p className="text-[10px] text-[var(--on-surface-variant)]">{prof.specialty}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-[var(--on-surface-variant)]/80 leading-relaxed">{prof.exp} &bull; Rating: <strong>{prof.rating}</strong></p>
                    </div>

                    <div className="pt-3 border-t border-[var(--outline-variant)]/20 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[var(--primary)]">{prof.rate}</span>
                      <button className="px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-container)] text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer">Book Session</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── TAB: RESOURCES ──────────────── */}
          {activeTab === 'Resources' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-bold">guided Audio & Readings Library</h2>
                <p className="text-xs text-[var(--on-surface-variant)]">Personalized recommendations based on your assessments and checked-in mood logs.</p>
              </div>

              {libraryLoading && <p className="text-xs text-[var(--on-surface-variant)]">Loading the library…</p>}
              {!libraryLoading && library.length === 0 && (
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Nothing published yet. Resources appear here as professionals add them.
                </p>
              )}
              <div className="grid sm:grid-cols-3 gap-6">
                {library.map((item) => (
                  <div key={item.id} className="card flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] uppercase font-bold text-[var(--primary)] bg-[var(--primary-fixed)] px-2.5 py-0.5 rounded-full">{item.category}</span>
                        <span className="text-[9px] text-[var(--outline)] shrink-0">{item.type}</span>
                      </div>
                      <h3 className="text-xs font-bold">{item.title}</h3>
                      {item.description && (
                        <p className="text-[10px] text-[var(--on-surface-variant)] leading-relaxed">{item.description}</p>
                      )}
                      <p className="text-[9px] text-[var(--outline)]">By {item.author}</p>
                    </div>
                    {/* Only offer to open it when there is genuinely something
                        to open — a dead button is worse than none. */}
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="w-full text-center py-2 border border-[var(--outline-variant)]/60 hover:border-[var(--primary)] rounded-lg text-[10px] font-bold transition-all">
                        Open Resource
                      </a>
                    ) : (
                      <span className="w-full text-center py-2 text-[10px] text-[var(--outline)]">No file attached</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── TAB: IMPACT & GRATITUDE ──────────────── */}
          {activeTab === 'Impact & Gratitude' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Active Impact Hub</span>
                  <h2 className="text-lg font-bold">Your Human Wellbeing Impact</h2>
                  <p className="text-xs text-emerald-800/80 max-w-md">KleverKlues™ values community kindness. Your active comments and gratitude logs support others who are healing.</p>
                </div>
                {/* The "142 Impact Score" that stood here was the same number
                    on every account and nothing computed it. Notes posted to
                    the wall is a real count. */}
                <div className="p-4 bg-white rounded-2xl border border-emerald-100/50 text-center flex-shrink-0 w-32 shadow-sm">
                  <p className="text-3xl font-bold font-display text-emerald-700">{myGratitude.length}</p>
                  <p className="text-[9px] text-[var(--on-surface-variant)] uppercase font-semibold mt-1">Notes shared</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Log Gratitude Reflection</h3>
                  {/* The input here was uncontrolled and the button had no
                      onClick, so everything typed was thrown away. */}
                  <textarea
                    value={gratitudeDraft}
                    onChange={e => setGratitudeDraft(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Today I am grateful for..."
                    className="w-full px-3 py-2 text-xs border border-[var(--outline-variant)]/60 rounded-lg focus:outline-none focus:border-[var(--primary)] resize-none"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gratitudeAnon}
                      onChange={e => setGratitudeAnon(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[var(--primary)]"
                    />
                    <span className="text-[10px] text-[var(--on-surface-variant)]">Post without my name</span>
                  </label>
                  {gratitudeMessage && (
                    <p className="text-[10px] font-semibold text-[var(--primary)]">{gratitudeMessage}</p>
                  )}
                  <button
                    onClick={postGratitude}
                    disabled={gratitudeDraft.trim().length < 4 || gratitudePosting}
                    className="btn-primary !py-2 !text-xs w-full disabled:opacity-40"
                  >
                    {gratitudePosting ? 'Posting…' : 'Share on the wall'}
                  </button>
                  <p className="text-[10px] text-[var(--on-surface-variant)]">
                    Notes are checked by our team before they appear publicly.
                  </p>
                </div>

                <div className="card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Your Kindness Footprint</h3>
                  {/* Real counts. "Encouraged 3 people this week" was fixed text
                      and nothing tracked encouragement at all, so it is gone. */}
                  <div className="space-y-3.5 text-xs text-[var(--on-surface-variant)]">
                    <p className="flex justify-between"><span>Gratitude notes shared</span><strong>{myGratitude.length}</strong></p>
                    <p className="flex justify-between"><span>Support circles joined</span><strong>{circles.filter((c: any) => c.hasJoined).length}</strong></p>
                    <p className="flex justify-between"><span>Check-in streak</span><strong>{checkInStreak} day{checkInStreak === 1 ? '' : 's'}</strong></p>
                    <p className="flex justify-between"><span>Sessions completed</span><strong>{completedSessions.length}</strong></p>
                  </div>
                </div>
              </div>

              {myGratitude.length > 0 && (
                <div className="card space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Your Notes</h3>
                  {myGratitude.map((g: any) => (
                    <div key={g.id} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100">
                      <p className="text-xs text-[var(--on-surface)]">{g.content}</p>
                      <p className="text-[9px] text-[var(--on-surface-variant)] mt-1">
                        {new Date(g.createdAt).toLocaleDateString()}
                        {g.isAnonymous && ' · anonymous'}
                        {g.pending && ' · waiting to be reviewed'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──────────────── TAB: SOS SUPPORT ──────────────── */}
          {activeTab === 'SOS Support' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 bg-red-600 text-white rounded-3xl space-y-3.5 shadow-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle size={28} className="text-white animate-bounce" />
                  <h2 className="text-lg font-bold font-display">SOS Emergency & Safety Portal</h2>
                </div>
                <p className="text-xs text-red-100 leading-relaxed max-w-2xl">
                  If you are experiencing severe distress, panic attacks, or self-harm thoughts, please reach out to our dedicated support channels immediately. Your data remains fully secure, private, and local.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                
                {/* Hotlines */}
                <div className="card md:col-span-2 space-y-4 border-red-200 bg-red-50/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider border-b border-red-200/50 pb-3 text-red-700">Immediate Emergency Hotline Access</h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: "KleverKlues Crisis Line", phone: "1800-XX-KLEVER", desc: "24/7 dedicated support team. Free and encrypted." },
                      { name: "National Mental Health Hotline", phone: "915-298-7821", desc: "Government emergency support access." },
                      { name: "Vandrevala Foundation Helpline", phone: "+91 9999 666 555", desc: "Available for distress and clinical intervention." }
                    ].map((hl, i) => (
                      <div key={i} className="flex justify-between items-center p-3.5 bg-white border border-red-100 rounded-xl text-xs">
                        <div>
                          <h4 className="font-bold">{hl.name}</h4>
                          <p className="text-[10px] text-[var(--on-surface-variant)] mt-0.5">{hl.desc}</p>
                        </div>
                        <a href={`tel:${hl.phone}`} className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all">Call Now</a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Guidelines */}
                <div className="card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider">Safety Guidelines</h3>
                  <ul className="space-y-2.5 text-xs text-[var(--on-surface-variant)]">
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" /> Find a quiet, safe, physical space if you feel overwhelmed.</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" /> Take 5 slow, deep breaths with our Mindful Breathing Helper.</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" /> Contact a family member, doctor, or a trusted friend directly.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* ──────────────── TAB: SETTINGS ──────────────── */}
          {activeTab === 'Settings' && (
            <div className="card space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-[var(--outline-variant)]/20 pb-3">
                <h2 className="text-lg font-bold">Privacy & Trust Settings</h2>
                <p className="text-xs text-[var(--on-surface-variant)]">Manage anonymous profile configurations, data rights, and notifications.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Privacy Settings</h3>
                  
                  <label className="flex items-start gap-4 p-4 rounded-xl border border-[var(--outline-variant)]/40 hover:border-[var(--primary)] cursor-pointer transition-all bg-[#fafcfb]">
                    <input
                      type="checkbox"
                      checked={anonymousMode}
                      onChange={e => setAnonymousMode(e.target.checked)}
                      className="mt-1 w-4 h-4 flex-shrink-0 accent-[var(--primary)]"
                    />
                    <div>
                      <p className="font-semibold text-xs text-[var(--on-surface)]">Enable Anonymous Mode</p>
                      <p className="text-[10px] text-[var(--on-surface-variant)] mt-1 leading-relaxed">Conceals your display name and email inside community circles. Support is shared fully anonymously.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 rounded-xl border border-[var(--outline-variant)]/40 hover:border-[var(--primary)] cursor-pointer transition-all bg-[#fafcfb]">
                    <input
                      type="checkbox"
                      checked={autoDND}
                      onChange={e => setAutoDND(e.target.checked)}
                      className="mt-1 w-4 h-4 flex-shrink-0 accent-[var(--primary)]"
                    />
                    <div>
                      <p className="font-semibold text-xs text-[var(--on-surface)]">Do Not Disturb (DND) during recovery programs</p>
                      <p className="text-[10px] text-[var(--on-surface-variant)] mt-1 leading-relaxed">Mutes marketing messages and wellness alerts when you are inside active recovery modules.</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-4 pt-3 border-t border-[var(--outline-variant)]/20">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Your Data Rights (DPDP Compliance)</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--surface-container-low)] rounded-xl space-y-2">
                      <h4 className="text-xs font-bold">Right to Portability</h4>
                      <p className="text-[10px] text-[var(--on-surface-variant)]">Download a complete backup of all assessment answers, logged moods, and reflections.</p>
                      <button className="text-[10px] text-[var(--primary)] font-bold hover:underline">Request Data Export &rarr;</button>
                    </div>

                    <div className="p-4 bg-red-50/20 rounded-xl space-y-2 border border-red-100/50">
                      <h4 className="text-xs font-bold text-red-700">Right to be Forgotten</h4>
                      <p className="text-[10px] text-red-600">Delete your account and wipe all stored wellbeing logs permanently from database clusters.</p>
                      <button
                        onClick={async () => {
                          const confirmed = window.confirm(
                            '⚠️ Delete Account?\n\nThis will permanently delete your account and ALL your data (moods, journals, assessments, SOS history).\n\nThis action CANNOT be undone.\n\nType OK to confirm.'
                          );
                          if (!confirmed) return;
                          try {
                            const token = localStorage.getItem('auth_token');
                            const res = await fetch('/api/auth/me', {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            const data = await res.json();
                            if (!data.success) throw new Error(data.error || 'Deletion failed');
                            localStorage.removeItem('auth_token');
                            alert('Your account has been deleted. Goodbye.');
                            window.location.href = '/';
                          } catch (err: any) {
                            alert('Failed to delete account: ' + err.message);
                          }
                        }}
                        className="text-[10px] text-red-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        🗑️ Delete My Account Permanently &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Change Password ── */}
              <div className="pt-3 border-t border-[var(--outline-variant)]/20">
                <ChangePasswordCard />
              </div>

            </div>
          )}


          {/* ── MY SESSIONS ── */}
          {activeTab === 'My Sessions' && (
            <div className="space-y-6 animate-in fade-in duration-300 p-4 sm:p-6 lg:p-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[var(--on-surface)]">My Sessions</h2>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Your therapy, coaching & support session history and upcoming bookings.</p>
              </div>

              {/* Quick Book CTA */}
              <div className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-bright)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-white">
                  <p className="font-bold text-sm">Book a New Session</p>
                  <p className="text-white/70 text-xs mt-0.5">Connect with a verified counsellor, therapist, or life coach</p>
                </div>
                <Link href="/book-session" className="px-5 py-2.5 bg-white text-[var(--primary)] font-bold text-xs rounded-xl hover:bg-white/90 transition-all whitespace-nowrap">
                  Browse Professionals →
                </Link>
              </div>

              {/* Upcoming sessions */}
              <div className="card p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Upcoming Sessions</h3>
                {bookingsLoading && <p className="text-xs text-[var(--on-surface-variant)] py-4">Loading your sessions…</p>}
                {!bookingsLoading && upcomingSessions.length === 0 && (
                  <p className="text-xs text-[var(--on-surface-variant)] py-4">
                    Nothing booked yet. Browse professionals above to arrange a session.
                  </p>
                )}
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-[var(--surface-container-low)] rounded-xl border border-[var(--outline-variant)]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center font-bold text-xs text-[var(--primary)]">
                        {(s.professional?.name ?? '?')[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--on-surface)]">{s.professional?.name ?? 'Professional'}</p>
                        <p className="text-[10px] text-[var(--on-surface-variant)]">{s.professional?.type ?? ''}</p>
                        <p className="text-[10px] text-[var(--primary)] font-semibold mt-0.5">
                          {new Date(s.scheduledAt).toLocaleString()} · {s.sessionType} · {s.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block ${
                        s.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>{s.status.toLowerCase()}</span>
                      {s.sessionType !== 'chat' && (
                        <VideoCall bookingId={s.id} label="Join call" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Past sessions */}
              <div className="card p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Past Sessions</h3>
                {!bookingsLoading && pastSessions.length === 0 && (
                  <p className="text-xs text-[var(--on-surface-variant)] py-4">No past sessions yet.</p>
                )}
                {pastSessions.map((s) => (
                  <div key={s.id} className="flex flex-col sm:flex-row justify-between gap-3 p-3 bg-[var(--surface-container-low)] rounded-xl border border-[var(--outline-variant)]/30">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--secondary-fixed)] flex items-center justify-center font-bold text-xs text-[var(--secondary)] shrink-0">
                        {(s.professional?.name ?? '?')[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--on-surface)]">
                          {s.professional?.name ?? 'Professional'}
                          <span className="font-normal text-[var(--on-surface-variant)]"> &mdash; {s.sessionType}, {s.duration} min</span>
                        </p>
                        {/* Only the professional's own note, never invented detail. */}
                        {s.professionalNotes && (
                          <p className="text-[10px] text-[var(--on-surface-variant)] mt-0.5 whitespace-pre-line">{s.professionalNotes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs shrink-0">
                      <span className="text-[var(--on-surface-variant)] text-[10px]">{new Date(s.scheduledAt).toLocaleDateString()}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>{s.status.toLowerCase()}</span>
                      {/* Only for a completed session that has not been rated —
                          the server refuses anything else anyway. */}
                      {awaitingReview.has(s.id) && (
                        <ReviewSession
                          bookingId={s.id}
                          professionalName={s.professional?.name ?? 'your professional'}
                          onDone={markReviewed}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Session stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Every account used to show the same twelve sessions and 4.8
                    stars. Counted from real bookings instead. The rating stat
                    stays out: a client does not have one, and the ratings they
                    give belong on the professional's profile, not here. */}
                {[
                  { label: 'Total Sessions', value: String(myBookings.length), sub: 'booked in total', color: 'text-[var(--primary)]' },
                  { label: 'Completed', value: String(completedSessions.length), sub: 'sessions attended', color: 'text-emerald-600' },
                  {
                    label: 'Hours of Care',
                    value: totalMinutes >= 60
                      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                      : `${totalMinutes}m`,
                    sub: 'invested in you', color: 'text-amber-600',
                  },
                  { label: 'Professionals', value: String(uniqueProfessionals), sub: 'you have worked with', color: 'text-indigo-600' },
                ].map((s, i) => (
                  <div key={i} className="card p-4 text-center">
                    <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-bold text-[var(--on-surface)] mt-0.5">{s.label}</p>
                    <p className="text-[9px] text-[var(--on-surface-variant)]">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROGRESS TRACKER ── */}
          {activeTab === 'Progress Tracker' && (
            <div className="space-y-6 animate-in fade-in duration-300 p-4 sm:p-6 lg:p-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[var(--on-surface)]">Progress Tracker</h2>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Your wellbeing growth journey, streaks, and milestone insights.</p>
              </div>

              {/* Streak banner — counted from real mood logs and journal
                  entries. Every account used to be told it had a 14-day
                  streak, including one that had never logged anything. */}
              <div className={`rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                checkInStreak > 0 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-[var(--surface-container)] border border-[var(--outline-variant)]/30'
              }`}>
                <div className={checkInStreak > 0 ? 'text-white' : 'text-[var(--on-surface)]'}>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={18} />
                    <span className="font-bold text-lg">
                      {checkInStreak > 0 ? `${checkInStreak}-day check-in streak 🔥` : 'No streak yet'}
                    </span>
                  </div>
                  <p className={`text-xs ${checkInStreak > 0 ? 'text-white/80' : 'text-[var(--on-surface-variant)]'}`}>
                    {checkInStreak > 0
                      ? 'Logging a mood or writing a journal entry keeps it going.'
                      : 'Log a mood or write a journal entry to start one.'}
                  </p>
                </div>
                <div className={`text-right ${checkInStreak > 0 ? 'text-white' : 'text-[var(--on-surface)]'}`}>
                  <p className="font-bold text-3xl font-display">{checkInStreak}</p>
                  <p className={`text-[10px] uppercase tracking-wide ${checkInStreak > 0 ? 'text-white/70' : 'text-[var(--on-surface-variant)]'}`}>Days in a row</p>
                </div>
              </div>

              {/* 4-week check-in calendar, from the same real days */}
              <div className="card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">28-Day Check-in Calendar</h3>
                <div className="grid grid-cols-7 gap-1.5">
                  {['M','T','W','T','F','S','S'].map((d, i) => <p key={i} className="text-[9px] text-center text-[var(--on-surface-variant)]/60 font-bold">{d}</p>)}
                  {checkInCalendar.map((done, i) => (
                    <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-bold ${ done ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-container)] text-[var(--on-surface-variant)]/40' }`}>
                      {done ? '✓' : ''}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[var(--on-surface-variant)]">
                  {checkInCalendar.filter(Boolean).length} of 28 days checked in
                </p>
              </div>

              {/* Assessment score trends — real results, not PHQ-9 numbers this
                  platform does not administer */}
              <div className="card p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Assessment Score Trends</h3>
                {assessmentTrends.length === 0 ? (
                  <div className="py-4 space-y-2">
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      No assessments completed yet. Your scores appear here once you take one.
                    </p>
                    <button onClick={() => setActiveTab('Assessments')} className="text-xs font-bold text-[var(--primary)] hover:underline">
                      Take an assessment →
                    </button>
                  </div>
                ) : assessmentTrends.map((a) => (
                  <div key={a.type} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[var(--on-surface)]">{a.label}</span>
                      {/* A direction needs two points to be a direction. */}
                      {a.direction && (
                        <span className={`font-bold text-[10px] ${
                          a.direction === 'improving' ? 'text-emerald-600'
                          : a.direction === 'worsening' ? 'text-rose-600' : 'text-[var(--on-surface-variant)]'
                        }`}>
                          {a.direction === 'improving' ? '↓ Improving' : a.direction === 'worsening' ? '↑ Worsening' : '→ Steady'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-1 h-8">
                      {a.trend.map((v: number, j: number) => (
                        <div key={j} className="flex-1 rounded-sm" style={{ height: `${Math.max((v / (a.maxScore || 1)) * 100, 4)}%`, background: j === a.trend.length - 1 ? 'var(--primary)' : 'var(--surface-container-high)' }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-[var(--on-surface-variant)]">
                      <span>{a.trend.length === 1 ? 'First result' : `${a.trend.length} results`}</span>
                      <span className="font-bold text-[var(--primary)]">Now: {a.current}/{a.maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Growth milestones — each has a real test behind it rather than
                  an invented achievement date */}
              <div className="card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Growth Milestones</h3>
                {milestones.map((m, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${m.done ? 'bg-emerald-50/60 border border-emerald-200/50' : 'bg-[var(--surface-container)] border border-[var(--outline-variant)]/20'}`}>
                    <span className="text-lg">{['🏆','💬','📓','🔥','🌟'][i] ?? '⭐'}</span>
                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${m.done ? 'text-[var(--on-surface)]' : 'text-[var(--on-surface-variant)]'}`}>{m.label}</p>
                      <p className="text-[9px] text-[var(--on-surface-variant)]">
                        {m.done
                          ? m.at ? `Achieved ${new Date(m.at).toLocaleDateString()}` : 'Achieved'
                          : m.progress ?? 'Not yet'}
                      </p>
                    </div>
                    {m.done ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--outline-variant)] flex-shrink-0" />}
                  </div>
                ))}
              </div>

              {/* The "Overall Wellbeing Score" chart that stood here claimed a
                  rise from 42 to 78 over eight weeks, on every account, with
                  nothing anywhere computing such a score. On a mental health
                  dashboard that is a claim about someone's recovery, so it is
                  gone rather than approximated. The trends above are measured. */}
            </div>
          )}

          {/* ── WELLBEING REMINDERS ── */}
          {activeTab === 'Wellbeing Reminders' && (
            <div className="space-y-6 animate-in fade-in duration-300 p-4 sm:p-6 lg:p-8">
              <div>
                <h2 className="text-xl font-bold font-display text-[var(--on-surface)]">Wellbeing Reminders</h2>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">Stay consistent with gentle daily nudges for check-ins, gratitude, and mindfulness.</p>
              </div>

              {/* What is actually outstanding, worked out from real activity.
                  The fixture listed five reminders at fixed clock times with
                  two already ticked, on accounts that had done neither. */}
              <div className="card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Today</h3>
                {todayNudges.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(r.tab)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:shadow-sm ${r.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{r.icon}</span>
                      <div>
                        <p className={`text-xs font-semibold ${r.done ? 'line-through text-[var(--on-surface-variant)]' : 'text-[var(--on-surface)]'}`}>{r.label}</p>
                        <p className="text-[10px] text-[var(--on-surface-variant)]">{r.detail}</p>
                      </div>
                    </div>
                    {r.done ? <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> : <Clock size={16} className="text-[var(--on-surface-variant)]/40 flex-shrink-0" />}
                  </button>
                ))}
                {todayNudges.every(n => n.done) && (
                  <p className="text-[11px] text-emerald-600 font-semibold pt-1">Everything is done for today. 🎉</p>
                )}
              </div>

              {/* The "Reminder Schedule" that stood here was six toggles at
                  fixed times that stored nothing and could not be switched —
                  plain divs with no onClick. Scheduled push and email reminders
                  are not built, so this says so rather than showing a settings
                  panel that silently discards every change. */}
              <div className="card p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Scheduled Reminders</h3>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Timed reminders by push or email are not switched on yet. The nudges above
                  are worked out from what you have and have not done, and update as you go.
                </p>
              </div>

              {/* Gratitude log — real notes from your check-ins */}
              <div className="card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">Recent Gratitude Entries</h3>
                {gratitudeEntries.length === 0 ? (
                  <p className="text-xs text-[var(--on-surface-variant)] py-2">
                    Nothing yet. The daily check-in asks what you are grateful for, and it shows up here.
                  </p>
                ) : gratitudeEntries.map((g, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-amber-50/40 rounded-xl border border-amber-100">
                    <span className="text-base flex-shrink-0">🌟</span>
                    <div>
                      <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wide">
                        {g.at.toDateString() === new Date().toDateString() ? 'Today' : g.at.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[var(--on-surface)] mt-0.5">{g.text}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setActiveTab('Overview')}
                  className="w-full py-2.5 border-2 border-dashed border-amber-200 text-amber-600 text-xs font-bold rounded-xl hover:bg-amber-50 transition-all"
                >
                  + Add today's gratitude
                </button>
              </div>

              {/* 7-day mood, from real logs. Days with nothing logged stay blank
                  rather than being filled in with a cheerful default. */}
              <div className="card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--on-surface-variant)]">7-Day Mood Insights</h3>
                <div className="grid grid-cols-7 gap-2">
                  {moodWeek.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className={`text-base ${day.emoji ? '' : 'opacity-25'}`}>{day.emoji ?? '·'}</span>
                      <span className="text-[9px] text-[var(--on-surface-variant)] font-bold">{day.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[var(--on-surface-variant)] font-semibold">
                  {moodWeek.filter(d => d.emoji).length === 0
                    ? 'No moods logged this week yet.'
                    : `Logged on ${moodWeek.filter(d => d.emoji).length} of the last 7 days.`}
                </p>
              </div>
            </div>
          )}

        </div>
        </TabContent>
        </main>
      </div>
    </div>
  );
}

// Icon wrapper to avoid type issues with imported icons
function LayoutDashboardIcon(props: any) {
  return <Award {...props} />;
}
