/**
 * Persistent admin audit trail.
 *
 * The admin dashboard recorded every approval, rejection and deletion into a
 * React string array, so the entire trail vanished on refresh. "Who approved
 * this professional" and "who deleted this account" have to outlive a page
 * reload on a platform holding crisis data.
 *
 * Writes to the existing ActivityLog table rather than a new one — it already
 * has the right shape (actor, action, resource, metadata, ip, userAgent) and
 * had no writers at all. Admin actions are namespaced `admin.*` so they can be
 * queried apart from ordinary user activity.
 */

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getClientIp } from '@/lib/server/rate-limit';

export const ADMIN_ACTION_PREFIX = 'admin.';

export interface AuditDetails {
  resource?: string;
  resourceId?: string;
  /** Anything needed to explain the action later. Never put secrets here. */
  metadata?: Record<string, unknown>;
}

/**
 * Record one admin action. Never throws: an audit write must not be able to
 * fail the operation the admin actually asked for, but a failure to record is
 * itself worth shouting about in the logs.
 */
export async function logAdminAction(
  request: NextRequest,
  adminId: string,
  action: string,
  details: AuditDetails = {}
): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        action: `${ADMIN_ACTION_PREFIX}${action}`,
        resource: details.resource ?? null,
        resourceId: details.resourceId ?? null,
        metadata: (details.metadata ?? {}) as any,
        ipAddress: getClientIp(request),
        userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
      },
    });
  } catch (err) {
    console.error(`[audit] FAILED to record ${action}:`, err);
  }
}
