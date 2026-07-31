// GET /api/admin/panel-users
// Returns the list of users for a given panel type with basic stats.
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
    const panel = searchParams.get('panel') ?? 'USER';
    const search = searchParams.get('search') ?? '';

    const nameFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // ── USER panel ───────────────────────────────────────────────────────────
    if (panel === 'USER') {
      const users = await prisma.user.findMany({
        where: { role: 'USER', ...nameFilter },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              moodLogs: true,
              journalEntries: true,
              assessments: true,   // schema field name
              bookings: true,
              emergencyAlerts: true,
            },
          },
        },
      });

      return successResponse(
        users.map((u) => ({
          id: u.id,
          name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
          email: u.email,
          status: u.status,
          joinedAt: u.createdAt,
          lastActiveAt: u.lastLoginAt,
          stats: {
            moodLogs: u._count.moodLogs,
            journals: u._count.journalEntries,
            assessments: u._count.assessments,
            sessions: u._count.bookings,
            sosAlerts: u._count.emergencyAlerts,
          },
        })),
        'Users loaded',
      );
    }

    // ── PROFESSIONAL panel ────────────────────────────────────────────────────
    if (panel === 'PROFESSIONAL') {
      const users = await prisma.user.findMany({
        where: { role: 'PROFESSIONAL', ...nameFilter },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });

      // Fetch Professional profiles in a separate query (no User back-relation)
      const professionalIds = users.map((u) => u.id);
      const profiles = await prisma.professional.findMany({
        where: { userId: { in: professionalIds } },
        select: {
          userId: true,
          type: true,
          averageRating: true,
          totalSessions: true,
          totalReviews: true,
          verificationStatus: true,
          isAcceptingClients: true,
          specializations: true,
          languages: true,
          city: true,
          state: true,
          yearsOfExperience: true,
        },
      });
      const profileMap = Object.fromEntries(profiles.map((p) => [p.userId, p]));

      return successResponse(
        users.map((u) => {
          const pro = profileMap[u.id];
          return {
            id: u.id,
            name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
            email: u.email,
            status: u.status,
            joinedAt: u.createdAt,
            lastActiveAt: u.lastLoginAt,
            stats: {
              sessions: pro?.totalSessions ?? 0,
              rating: pro?.averageRating ?? 0,
              reviews: pro?.totalReviews ?? 0,
              verificationStatus: pro?.verificationStatus ?? 'PENDING',
              isAcceptingClients: pro?.isAcceptingClients ?? false,
            },
          };
        }),
        'Professionals loaded',
      );
    }

    // ── VENDOR panel ──────────────────────────────────────────────────────────
    if (panel === 'VENDOR') {
      const users = await prisma.user.findMany({
        where: { role: 'VENDOR', ...nameFilter },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
          vendorProfile: {
            select: {
              businessName: true,
              serviceType: true,
              phone: true,
              isOnline: true,
              isAvailable: true,
            },
          },
          _count: {
            select: {
              vendorAssignments: true, // EmergencyAlert[] @relation("VendorAssignments")
            },
          },
        },
      });

      return successResponse(
        users.map((u) => ({
          id: u.id,
          name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
          email: u.email,
          status: u.status,
          joinedAt: u.createdAt,
          lastActiveAt: u.lastLoginAt,
          vendorProfile: u.vendorProfile,
          stats: {
            totalAssignments: u._count.vendorAssignments,
            isOnline: u.vendorProfile?.isOnline ?? false,
            isAvailable: u.vendorProfile?.isAvailable ?? false,
          },
        })),
        'Vendors loaded',
      );
    }

    // ── ENTERPRISE panel ──────────────────────────────────────────────────────
    if (panel === 'ENTERPRISE') {
      const orgFilter = search
        ? {
            OR: [
              { organizationName: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const orgs = await prisma.organizationApplication.findMany({
        where: { status: 'APPROVED', ...orgFilter },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          orgName: true,
          orgType: true,
          email: true,
          contactName: true,
          contactPhone: true,
          employeeCount: true,
          city: true,
          state: true,
          status: true,
          createdAt: true,
        },
      });

      return successResponse(
        orgs.map((o) => ({
          id: o.id,
          name: o.orgName,
          email: o.email,
          status: o.status,
          joinedAt: o.createdAt,
          lastActiveAt: null,
          stats: {
            employeeCount: o.employeeCount ?? 0,
            industry: o.orgType ?? 'N/A',
            contactPerson: o.contactName,
            phone: o.contactPhone,
          },
        })),
        'Enterprises loaded',
      );
    }

    return errorResponse('Invalid panel type. Must be USER, PROFESSIONAL, VENDOR, or ENTERPRISE.', 400);
  } catch (error: any) {
    console.error('Panel users fetch error:', error);
    return errorResponse('Failed to fetch panel users: ' + (error?.message ?? 'Unknown'), 500);
  }
}
