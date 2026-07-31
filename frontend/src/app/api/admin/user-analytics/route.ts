// GET /api/admin/user-analytics
// Returns full analytics for a specific user, parameterised by panel type.
// Admin only.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const panel = searchParams.get('panel') ?? 'USER';

    if (!userId) return errorResponse('userId is required', 400);

    // ── USER ──────────────────────────────────────────────────────────────────
    if (panel === 'USER') {
      const [user, moodLogs, journalCount, assessments, bookings, sosCount] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, firstName: true, lastName: true, email: true, status: true, createdAt: true, lastLoginAt: true },
        }),
        prisma.moodLog.findMany({
          where: { userId },
          orderBy: { loggedAt: 'desc' },
          take: 30,
          select: { mood: true, intensity: true, loggedAt: true },
        }),
        prisma.journalEntry.count({ where: { userId } }),
        prisma.assessmentResult.findMany({
          where: { userId },
          orderBy: { completedAt: 'desc' },
          take: 10,
          select: { assessmentType: true, score: true, percentage: true, level: true, completedAt: true },
        }),
        prisma.booking.findMany({
          where: { userId },
          orderBy: { scheduledAt: 'desc' },
          take: 10,
          select: { id: true, sessionType: true, status: true, scheduledAt: true, duration: true },
        }),
        prisma.emergencyAlert.count({ where: { userId } }),
      ]);

      if (!user) return errorResponse('User not found', 404);

      const moodTrend = moodLogs.map((m) => ({
        date: m.loggedAt.toISOString().split('T')[0],
        mood: m.mood,
        intensity: m.intensity,
      }));

      const moodDist: Record<string, number> = {};
      moodLogs.forEach((m) => { moodDist[m.mood] = (moodDist[m.mood] ?? 0) + 1; });

      const bookingDist: Record<string, number> = {};
      bookings.forEach((b) => { bookingDist[b.status] = (bookingDist[b.status] ?? 0) + 1; });

      return successResponse({
        panel: 'USER',
        user: { ...user, name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() },
        summary: {
          totalMoodLogs: moodLogs.length,
          totalJournals: journalCount,
          totalAssessments: assessments.length,
          totalBookings: bookings.length,
          totalSosAlerts: sosCount,
        },
        moodTrend,
        moodDistribution: moodDist,
        recentAssessments: assessments,
        recentBookings: bookings,
        bookingDistribution: bookingDist,
      }, 'User analytics loaded');
    }

    // ── PROFESSIONAL ──────────────────────────────────────────────────────────
    if (panel === 'PROFESSIONAL') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true, email: true, status: true, createdAt: true, lastLoginAt: true },
      });
      if (!user) return errorResponse('User not found', 404);

      const professional = await prisma.professional.findFirst({ where: { userId } });

      const [bookings, reviews] = await Promise.all([
        professional
          ? prisma.booking.findMany({
              where: { professionalId: professional.id },
              orderBy: { scheduledAt: 'desc' },
              take: 10,
              select: { id: true, status: true, scheduledAt: true, sessionType: true, duration: true },
            })
          : [],
        professional
          ? prisma.review.findMany({
              where: { professionalId: professional.id },
              orderBy: { createdAt: 'desc' },
              take: 5,
              select: { rating: true, comment: true, createdAt: true },
            })
          : [],
      ]);

      const statusDist: Record<string, number> = {};
      (bookings as any[]).forEach((b) => { statusDist[b.status] = (statusDist[b.status] ?? 0) + 1; });

      return successResponse({
        panel: 'PROFESSIONAL',
        user: { ...user, name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() },
        professional,
        summary: {
          totalSessions: professional?.totalSessions ?? 0,
          completedSessions: statusDist['COMPLETED'] ?? 0,
          pendingSessions: statusDist['PENDING'] ?? 0,
          averageRating: professional?.averageRating ?? 0,
          totalReviews: professional?.totalReviews ?? 0,
          verificationStatus: professional?.verificationStatus ?? 'PENDING',
          isAcceptingClients: professional?.isAcceptingClients ?? false,
        },
        recentBookings: bookings,
        recentReviews: reviews,
        bookingDistribution: statusDist,
      }, 'Professional analytics loaded');
    }

    // ── VENDOR ────────────────────────────────────────────────────────────────
    if (panel === 'VENDOR') {
      const [user, vendorProfile, assignments] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, firstName: true, lastName: true, email: true, status: true, createdAt: true, lastLoginAt: true },
        }),
        prisma.vendorProfile.findUnique({ where: { userId } }),
        prisma.emergencyAlert.findMany({
          where: { assignedVendorId: userId },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: { id: true, severity: true, status: true, dispatchStatus: true, createdAt: true, vendorAcceptedAt: true },
        }),
      ]);

      if (!user) return errorResponse('User not found', 404);

      const severityDist: Record<string, number> = {};
      const statusDist: Record<string, number> = {};
      assignments.forEach((a) => {
        severityDist[a.severity] = (severityDist[a.severity] ?? 0) + 1;
        const key = a.dispatchStatus ?? a.status;
        statusDist[key] = (statusDist[key] ?? 0) + 1;
      });

      const responseTimes = assignments
        .filter((a) => a.vendorAcceptedAt)
        .map((a) => (new Date(a.vendorAcceptedAt!).getTime() - new Date(a.createdAt).getTime()) / 60000);
      const avgResponseMin = responseTimes.length
        ? Math.round(responseTimes.reduce((s, v) => s + v, 0) / responseTimes.length)
        : null;

      return successResponse({
        panel: 'VENDOR',
        user: { ...user, name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() },
        vendorProfile,
        summary: {
          totalAssignments: assignments.length,
          resolvedCases: statusDist['RESOLVED'] ?? 0,
          avgResponseMin,
          isCurrentlyOnline: vendorProfile?.isOnline ?? false,
          isAvailable: vendorProfile?.isAvailable ?? false,
        },
        recentAssignments: assignments,
        severityDistribution: severityDist,
        statusDistribution: statusDist,
      }, 'Vendor analytics loaded');
    }

    // ── ENTERPRISE ────────────────────────────────────────────────────────────
    if (panel === 'ENTERPRISE') {
      // For enterprises, userId is the OrganizationApplication id
      const org = await prisma.organizationApplication.findUnique({ where: { id: userId } });
      if (!org) return errorResponse('Organization not found', 404);

      return successResponse({
        panel: 'ENTERPRISE',
        user: {
          id: org.id,
          name: org.orgName,
          email: org.email,
          status: org.status,
          createdAt: org.createdAt,
          lastActiveAt: null,
        },
        organization: org,
        summary: {
          employeeCount: org.employeeCount ?? 0,
          industry: org.orgType ?? 'N/A',
          contactPerson: org.contactName,
          phone: org.contactPhone,
          programInterests: [],
        },
      }, 'Enterprise analytics loaded');
    }

    return errorResponse('Invalid panel type', 400);
  } catch (error: any) {
    console.error('User analytics error:', error);
    return errorResponse('Failed to fetch analytics: ' + (error?.message ?? 'Unknown'), 500);
  }
}
