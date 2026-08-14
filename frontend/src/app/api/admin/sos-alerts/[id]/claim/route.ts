// POST   /api/admin/sos-alerts/[id]/claim — take ownership of an alert
// DELETE /api/admin/sos-alerts/[id]/claim — hand it back
//
// Every admin received every alert and every update, because admin-room is a
// broadcast channel. At a handful of alerts a day that is a dispatch board; at
// a thousand it is noise nobody can act on, and two admins can work the same
// emergency while a third goes unattended.
//
// Claiming is the fix, and the pattern already exists: startDispatch offers a
// job to several vendors and the first to accept owns it. EmergencyAlert has
// carried acknowledgedBy since the schema was written and nothing ever set it.

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { logAdminAction } from '@/lib/server/audit';

/** Tell every admin, so a claimed alert leaves the others' queues. */
async function broadcast(event: string, payload: Record<string, unknown>) {
  const url = process.env.SOCKET_SERVER_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!url || !secret) return;
  // Fire and forget: the claim is already committed, so a socket server that is
  // down must not fail it. Other admins see the claim on their next load.
  fetch(`${url}/internal/admin-broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-secret': secret },
    body: JSON.stringify({ event, payload }),
    signal: AbortSignal.timeout(3000),
  }).catch(err => console.warn('[claim] broadcast failed:', err?.message));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse('Admin access required');
    const { id } = await params;

    const alert = await prisma.emergencyAlert.findUnique({
      where: { id },
      select: { id: true, status: true, acknowledgedBy: true },
    });
    if (!alert) return errorResponse('Alert not found', 404);
    if (['RESOLVED', 'CANCELLED'].includes(alert.status)) {
      return errorResponse(`This alert is already ${alert.status.toLowerCase()}`, 409);
    }

    // Conditional update: the WHERE clause requires acknowledgedBy to still be
    // null, so of two admins clicking at the same moment exactly one writes.
    // Reading first and then writing would let both believe they had it.
    const { count } = await prisma.emergencyAlert.updateMany({
      where: { id, acknowledgedBy: null },
      data: { acknowledgedBy: admin.id, acknowledgedAt: new Date(), status: 'ACKNOWLEDGED' },
    });

    if (count === 0) {
      if (alert.acknowledgedBy === admin.id) {
        return successResponse({ alertId: id, claimedBy: admin.id, alreadyMine: true }, 'You already have this alert');
      }
      const holder = alert.acknowledgedBy
        ? await prisma.user.findUnique({
            where: { id: alert.acknowledgedBy },
            select: { firstName: true, lastName: true, email: true },
          })
        : null;
      const who = holder
        ? `${holder.firstName ?? ''} ${holder.lastName ?? ''}`.trim() || holder.email
        : 'another admin';
      return errorResponse(`Already claimed by ${who}`, 409);
    }

    await logAdminAction(request, admin.id, 'sos.claim', { resource: 'EmergencyAlert', resourceId: id });

    const me = await prisma.user.findUnique({
      where: { id: admin.id }, select: { firstName: true, lastName: true, email: true },
    });
    const name = `${me?.firstName ?? ''} ${me?.lastName ?? ''}`.trim() || me?.email || 'An admin';

    await broadcast('sos:claimed', { alertId: id, claimedBy: admin.id, claimedByName: name });

    return successResponse({ alertId: id, claimedBy: admin.id, claimedByName: name }, 'Alert claimed');
  } catch (error: any) {
    console.error('Claim error:', error);
    return errorResponse('Failed to claim: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return unauthorizedResponse('Admin access required');
    const { id } = await params;

    // Only the holder may release it, so nobody can quietly take an emergency
    // off the person already working it.
    const { count } = await prisma.emergencyAlert.updateMany({
      where: { id, acknowledgedBy: admin.id },
      data: { acknowledgedBy: null, acknowledgedAt: null, status: 'ACTIVE' },
    });
    if (count === 0) return errorResponse('You do not hold this alert', 409);

    await logAdminAction(request, admin.id, 'sos.release', { resource: 'EmergencyAlert', resourceId: id });
    await broadcast('sos:released', { alertId: id, releasedBy: admin.id });

    return successResponse({ alertId: id }, 'Alert released back to the queue');
  } catch (error: any) {
    console.error('Release error:', error);
    return errorResponse('Failed to release: ' + (error?.message ?? 'Unknown'), 500);
  }
}
