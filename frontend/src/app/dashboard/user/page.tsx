'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  Heart, Brain, TrendingUp, Calendar, Activity, BookOpen,
  Users, Target, Award, Loader2, AlertCircle
} from 'lucide-react';

export default function UserDashboard() {
  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [assessments, setAssessments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [assessmentsData, programsData, moodData, journalData] = await Promise.all([
        api.assessments.list().catch(() => []),
        api.programs.list().catch(() => []),
        api.mood.list(7).catch(() => []),
        api.journal.list(5, 0).catch(() => ({ entries: [], total: 0 })),
      ]);

      setAssessments(assessmentsData);
      setPrograms(programsData);
      setMoodLogs(moodData);
      setJournalEntries(journalData.entries || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[var(--primary)] mx-auto mb-4" />
          <p className="text-[var(--on-surface-variant)]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const latestAssessment = assessments[0];
  const activeProgram = programs.find(p => p.status === 'ACTIVE');
  const averageMood = moodLogs.length > 0
    ? (moodLogs.reduce((sum, log) => sum + log.intensity, 0) / moodLogs.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-[var(--surface)] py-8">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-2">
            Welcome back, {user?.firstName || 'Friend'}! 👋
          </h1>
          <p className="text-body-lg text-[var(--on-surface-variant)]">
            Here's your wellbeing journey at a glance
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--error-container)] border border-[var(--error)] rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--on-error-container)]">{error}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                <Brain size={24} className="text-[var(--primary)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--on-surface)]">
                {assessments.length}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-1">
              Assessments Taken
            </h3>
            <p className="text-xs text-[var(--on-surface-variant)]">
              Track your progress
            </p>
          </div>

          <div className="card hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--secondary-fixed)] flex items-center justify-center">
                <Target size={24} className="text-[var(--secondary)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--on-surface)]">
                {programs.length}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-1">
              Programs Enrolled
            </h3>
            <p className="text-xs text-[var(--on-surface-variant)]">
              {activeProgram ? 'Active program running' : 'Start a new program'}
            </p>
          </div>

          <div className="card hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--tertiary-fixed)] flex items-center justify-center">
                <Activity size={24} className="text-[var(--tertiary)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--on-surface)]">
                {averageMood}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-1">
              Average Mood
            </h3>
            <p className="text-xs text-[var(--on-surface-variant)]">
              Last 7 days
            </p>
          </div>

          <div className="card hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                <BookOpen size={24} className="text-[var(--primary)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--on-surface)]">
                {journalEntries.length}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-1">
              Journal Entries
            </h3>
            <p className="text-xs text-[var(--on-surface-variant)]">
              Recent reflections
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Latest Assessment */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[var(--on-surface)]">
                Latest Assessment
              </h2>
              <Link href="/assessments" className="text-sm text-[var(--primary)] hover:underline">
                View All
              </Link>
            </div>

            {latestAssessment ? (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--surface-container)] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--on-surface)]">
                      {latestAssessment.assessmentType.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      latestAssessment.level === 'Severe' ? 'bg-red-100 text-red-700' :
                      latestAssessment.level === 'High' ? 'bg-orange-100 text-orange-700' :
                      latestAssessment.level === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {latestAssessment.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--on-surface-variant)]">
                    <Calendar size={14} />
                    {new Date(latestAssessment.completedAt).toLocaleDateString()}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Score</span>
                      <span>{latestAssessment.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[var(--surface-container-high)] rounded-full h-2">
                      <div
                        className="bg-[var(--primary)] h-2 rounded-full transition-all"
                        style={{ width: `${latestAssessment.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Link href="/assessments" className="btn-secondary w-full text-center">
                  Take New Assessment
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain size={48} className="mx-auto mb-4 text-[var(--on-surface-variant)] opacity-50" />
                <p className="text-[var(--on-surface-variant)] mb-4">
                  No assessments yet
                </p>
                <Link href="/assessments" className="btn-primary inline-block">
                  Take Your First Assessment
                </Link>
              </div>
            )}
          </div>

          {/* Active Program */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[var(--on-surface)]">
                Active Program
              </h2>
              <Link href="/programs" className="text-sm text-[var(--primary)] hover:underline">
                Browse All
              </Link>
            </div>

            {activeProgram ? (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--surface-container)] rounded-lg">
                  <h3 className="font-semibold text-[var(--on-surface)] mb-2">
                    {activeProgram.programType.replace(/_/g, ' ')}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[var(--on-surface-variant)] mb-4">
                    <Calendar size={14} />
                    Week {activeProgram.currentWeek}
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{activeProgram.progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[var(--surface-container-high)] rounded-full h-2">
                      <div
                        className="bg-[var(--primary)] h-2 rounded-full transition-all"
                        style={{ width: `${activeProgram.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Link href={`/programs/${activeProgram.programType.toLowerCase()}`} className="btn-primary w-full text-center">
                  Continue Program
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target size={48} className="mx-auto mb-4 text-[var(--on-surface-variant)] opacity-50" />
                <p className="text-[var(--on-surface-variant)] mb-4">
                  No active programs
                </p>
                <Link href="/programs" className="btn-primary inline-block">
                  Explore Programs
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/mood-tracker" className="card text-center hover:-translate-y-1 transition-all">
            <Activity size={32} className="mx-auto mb-3 text-[var(--primary)]" />
            <h3 className="text-sm font-semibold text-[var(--on-surface)]">Log Mood</h3>
          </Link>
          <Link href="/journal" className="card text-center hover:-translate-y-1 transition-all">
            <BookOpen size={32} className="mx-auto mb-3 text-[var(--secondary)]" />
            <h3 className="text-sm font-semibold text-[var(--on-surface)]">Write Journal</h3>
          </Link>
          <Link href="/book-session" className="card text-center hover:-translate-y-1 transition-all">
            <Users size={32} className="mx-auto mb-3 text-[var(--tertiary)]" />
            <h3 className="text-sm font-semibold text-[var(--on-surface)]">Book Session</h3>
          </Link>
          <Link href="/community" className="card text-center hover:-translate-y-1 transition-all">
            <Heart size={32} className="mx-auto mb-3 text-[var(--primary)]" />
            <h3 className="text-sm font-semibold text-[var(--on-surface)]">Community</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
