// GET & POST /api/admin/dashboard
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin as checkAdmin } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { UserRole, UserStatus, VerificationStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return unauthorizedResponse();
    }

    // 1. Fetch system statistics
    const [totalUsers, regularUsers, professionals, enterprises, pendingVerifications, totalSessions] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'PROFESSIONAL' } }),
      prisma.user.count({ where: { role: 'ENTERPRISE' } }),
      prisma.user.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.session.count(),
    ]);

    // 2. Fetch professional and organization applicants
    const applicants = await prisma.user.findMany({
      where: {
        role: { in: ['PROFESSIONAL', 'ENTERPRISE'] },
        status: 'PENDING_VERIFICATION',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch professional details for those user IDs to display licenses
    const professionalDetails = await prisma.professional.findMany({
      where: {
        userId: { in: applicants.map((a) => a.id) },
      },
    });

    const mappedApplicants = applicants.map((app) => {
      const details = professionalDetails.find((d) => d.userId === app.id);
      return {
        id: app.id,
        name: `${app.firstName || ''} ${app.lastName || ''}`.trim() || app.email,
        email: app.email,
        specialty: details?.specializations?.join(', ') || (app.role === 'ENTERPRISE' ? 'Corporate Wellbeing' : 'General'),
        license: details?.licenseNumber || 'N/A',
        role: app.role,
        status: app.status,
      };
    });

    // 3. Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const mappedUsers = users.map((u) => ({
      id: u.id,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    }));

    // 4. Fetch enterprise accounts
    const enterprisesList = await prisma.user.findMany({
      where: { role: 'ENTERPRISE' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
      },
    });

    const mappedEnterprises = enterprisesList.map((ent) => ({
      id: ent.id,
      name: `${ent.firstName || ''} ${ent.lastName || ''}`.trim() || ent.email,
      email: ent.email,
      status: ent.status,
      createdAt: ent.createdAt,
    }));

    // 5. Generate dynamic safety/SOS cases based on high-intensity anxious/stressed mood logs
    const safetyLogs = await prisma.moodLog.findMany({
      where: {
        intensity: { gte: 8 },
        mood: { in: ['anxious', 'stressed', 'overwhelmed'] },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { loggedAt: 'desc' },
      take: 10,
    });

    const mappedSafetyCases = safetyLogs.map((log) => ({
      id: log.id,
      user: `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim() || log.user.email,
      region: 'Online Support',
      risk: log.intensity >= 9 ? 'CRITICAL' : 'HIGH',
      timeElapsed: getRelativeTime(log.loggedAt),
      status: log.notes?.includes('[RESOLVED]') ? 'RESOLVED' : 'PENDING',
      assignedTo: 'Clinical Team',
      details: log.notes || `Logged intense ${log.mood} (Level ${log.intensity}/10).`,
    }));

    // 6. Fetch moderation queue (posts marked isModerated: false, or check flags)
    const postsToModerate = await prisma.communityPost.findMany({
      where: { isModerated: false },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const mappedModQueue = postsToModerate.map((post) => ({
      id: post.id,
      type: post.type,
      content: post.content,
      author: `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim() || post.user.email,
      flagReason: 'New community content requiring moderation approval',
      status: 'PENDING',
    }));

    // 7. Get AI companion chat stats or logs
    const activityLogs = await prisma.activityLog.findMany({
      where: { action: 'ai_companion_chat' },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    const mappedAiLogs = activityLogs.map((log) => {
      const meta = log.metadata as any;
      return {
        id: log.id,
        user: log.userId ? `User ID ${log.userId}` : 'Anonymous User',
        prompt: meta?.prompt || 'AI Chat Session',
        response: meta?.response || 'Replied to user wellness check',
        flag: meta?.flagLevel || 'Normal',
        status: 'RESOLVED',
      };
    });

    return successResponse({
      stats: {
        totalUsers,
        regularUsers,
        professionals,
        enterprises,
        pendingVerifications,
        totalSessions,
      },
      applicants: mappedApplicants,
      users: mappedUsers,
      enterprises: mappedEnterprises,
      safetyCases: mappedSafetyCases,
      modQueue: mappedModQueue,
      aiLogs: mappedAiLogs,
    });
  } catch (error) {
    console.error('Admin dashboard fetch error:', error);
    return errorResponse('Failed to fetch administrative data', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdmin(request);
    if (!admin) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { action, targetId, updateValue } = body;

    console.log('Admin POST action received:', { action, targetId, updateValue });

    if (!action || !targetId) {
      return errorResponse('Missing required fields: action and targetId', 400);
    }

    switch (action) {
      case 'APPROVE_USER':
        // Approve applicant, activate profile, verify professional
        await prisma.$transaction([
          prisma.user.update({
            where: { id: targetId },
            data: { status: 'ACTIVE' },
          }),
          prisma.professional.updateMany({
            where: { userId: targetId },
            data: {
              verificationStatus: 'VERIFIED',
              verifiedAt: new Date(),
            },
          }),
        ]);
        return successResponse(null, 'User successfully approved and activated.');

      case 'REJECT_USER':
        await prisma.$transaction([
          prisma.user.update({
            where: { id: targetId },
            data: { status: 'INACTIVE' },
          }),
          prisma.professional.updateMany({
            where: { userId: targetId },
            data: { verificationStatus: 'REJECTED' },
          }),
        ]);
        return successResponse(null, 'User application rejected.');

      case 'SUSPENDED_USER':
      case 'SUSPEND_USER':
        await prisma.user.update({
          where: { id: targetId },
          data: { status: 'SUSPENDED' },
        });
        return successResponse(null, 'User successfully suspended.');

      case 'ACTIVATE_USER':
        await prisma.user.update({
          where: { id: targetId },
          data: { status: 'ACTIVE' },
        });
        return successResponse(null, 'User account activated.');

      case 'RESOLVE_SAFETY_CASE':
        // Update mood log notes to contain [RESOLVED] tag
        const log = await prisma.moodLog.findUnique({ where: { id: targetId } });
        if (log) {
          await prisma.moodLog.update({
            where: { id: targetId },
            data: { notes: `${log.notes || ''} [RESOLVED]`.trim() },
          });
        }
        return successResponse(null, 'Safety case resolved.');

      case 'APPROVE_POST':
        await prisma.communityPost.update({
          where: { id: targetId },
          data: { isModerated: true },
        });
        return successResponse(null, 'Post approved and published.');

      case 'DELETE_POST':
        await prisma.communityPost.delete({
          where: { id: targetId },
        });
        return successResponse(null, 'Post successfully deleted.');

      default:
        return errorResponse('Unsupported action type', 400);
    }
  } catch (error) {
    console.error('Admin action execution error:', error);
    return errorResponse('Failed to execute admin action', 500);
  }
}

function getRelativeTime(date: Date) {
  const diffMs = new Date().getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
