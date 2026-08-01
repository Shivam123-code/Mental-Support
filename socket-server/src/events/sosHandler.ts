import { Server, Socket } from 'socket.io';
import { PrismaClient } from '../../../frontend/node_modules/@prisma/client';
import { haversineKm } from '../utils/haversine';
import {
  startDispatch,
  claimAlert,
  abortDispatch,
  noteDecline,
  wasOffered,
  logDispatch,
  notifyCaller,
} from './dispatch';
import { notifyEmergencyContacts } from '../utils/notify';

// Identity is never taken from these payloads — it comes from socket.data, which
// is set only from a verified token in index.ts. Client-supplied userId/vendorId/
// adminId fields are gone deliberately; do not reintroduce them.
interface SOSData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  message?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

interface AlertRef {
  alertId: string;
}

const VALID_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM'] as const;
const VALID_DISPATCH_STATUSES = ['EN_ROUTE', 'NEARBY', 'ARRIVED', 'RESOLVED'] as const;
const MAX_MESSAGE_LENGTH = 500;

/** A vendor must be physically near the scene to claim they have arrived. */
const ARRIVAL_PROXIMITY_KM = 0.5;

/** Reject non-finite or out-of-range coordinates before they reach the DB or Haversine. */
function validCoords(lat: unknown, lon: unknown): lat is number {
  return (
    typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    typeof lon === 'number' && Number.isFinite(lon) && lon >= -180 && lon <= 180
  );
}

// Per-caller SOS flood control. The REST path is rate-limited but the socket path
// was not, and it is the path the app prefers.
const sosRecent = new Map<string, number[]>();
const SOS_MAX = 3;
const SOS_WINDOW_MS = 10 * 60 * 1000;

/**
 * Flood-control key. Signed-in callers key on userId. Guests have no account,
 * and keying them on socket.id would be free to bypass — reconnect, new bucket —
 * so they key on remote address instead.
 *
 * ponytail: handshake.address is the immediate peer, which behind a reverse
 * proxy is the proxy itself, putting every guest in one shared bucket. Ceiling:
 * one guest tripping the limit locks out the rest. Upgrade path: read the
 * rightmost untrusted x-forwarded-for entry, as frontend getClientIp already does.
 */
function callerKey(socket: Socket): string {
  const userId: string | undefined = socket.data.userId;
  return userId ? `u:${userId}` : `ip:${socket.handshake.address}`;
}

/**
 * WHERE fragment proving this socket owns the alert it names, or null if it
 * does not. Signed-in callers are scoped by userId. A guest owns exactly the
 * alert their own connection raised — that id is held server-side in
 * socket.data, so naming someone else's alert matches nothing here. Identity is
 * still never read from the payload.
 */
function ownedAlertWhere(socket: Socket, alertId: unknown): { id: string; userId?: string } | null {
  if (typeof alertId !== 'string' || !alertId) return null;
  const userId: string | undefined = socket.data.userId;
  if (userId) return { id: alertId, userId };
  if (socket.data.isGuest && socket.data.guestAlertId === alertId) return { id: alertId };
  return null;
}

function sosRateLimited(userId: string): boolean {
  const now = Date.now();
  const hits = (sosRecent.get(userId) ?? []).filter(t => now - t < SOS_WINDOW_MS);
  if (hits.length >= SOS_MAX) {
    sosRecent.set(userId, hits);
    return true;
  }
  hits.push(now);
  sosRecent.set(userId, hits);
  return false;
}

export function setupSOSHandlers(io: Server, socket: Socket, prisma: PrismaClient) {

  // ── Emergency SOS Alert ────────────────────────────────────────────────────
  socket.on('emergency:sos', async (data: SOSData) => {
    try {
      // Identity from the verified socket session, never from the payload —
      // otherwise anyone could file an alert in another user's name. A guest has
      // no identity by definition and files an alert with userId null, exactly as
      // the public REST /api/sos does; what must never happen is a caller
      // *claiming* to be someone.
      const userId: string | null = socket.data.userId ?? null;
      if (!userId && !socket.data.isGuest) {
        socket.emit('emergency:error', { error: 'Not authenticated' });
        return;
      }

      if (!validCoords(data?.latitude, data?.longitude)) {
        socket.emit('emergency:error', { error: 'Invalid coordinates' });
        return;
      }

      const severity = VALID_SEVERITIES.includes(data.severity) ? data.severity : 'CRITICAL';
      const message = typeof data.message === 'string'
        ? data.message.slice(0, MAX_MESSAGE_LENGTH)
        : 'Emergency SOS activated';
      const { latitude, longitude } = data;
      const accuracy = typeof data.accuracy === 'number' && Number.isFinite(data.accuracy)
        ? data.accuracy
        : null;

      // Panic taps produce several presses in a few seconds. Without this each
      // one starts its own dispatch chain, and they compete for the same
      // vendors while a genuinely separate emergency waits.
      // A guest cannot be looked up by account, so their live alert is tracked on
      // the socket. Same panic-tap protection, scoped to the connection that
      // raised it — reconnecting and pressing again is a genuinely new alert.
      const existing = userId
        ? await (prisma as any).emergencyAlert.findFirst({
            where: { userId, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
            orderBy: { createdAt: 'desc' },
          })
        : socket.data.guestAlertId
          ? await (prisma as any).emergencyAlert.findFirst({
              where: { id: socket.data.guestAlertId, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
            })
          : null;

      if (existing) {
        await (prisma as any).emergencyAlert.update({
          where: { id: existing.id },
          data: { latitude, longitude, locationAccuracy: accuracy, locationUpdatedAt: new Date() },
        });
        await logDispatch(prisma, existing.id, 'LOCATION_UPDATE', { detail: 'duplicate SOS press merged' });

        socket.emit('emergency:confirmed', {
          alertId: existing.id,
          message: 'Your emergency is already active. Help is being coordinated.',
          timestamp: existing.createdAt,
          emergencyNumber: '112',
        });
        io.to('admin-room').emit('emergency:location_update', {
          alertId: existing.id, latitude, longitude, accuracy,
        });
        return;
      }

      if (sosRateLimited(callerKey(socket))) {
        socket.emit('emergency:error', {
          error: 'Too many SOS alerts. If this is a real emergency, call 112 now.',
          emergencyNumber: '112',
        });
        return;
      }

      // Coordinates are deliberately not logged at full precision — these are
      // crisis locations and the log file is unencrypted.
      console.log(`🚨 EMERGENCY SOS from ${userId ?? 'guest'} (severity ${severity})`);

      const alert = await (prisma as any).emergencyAlert.create({
        data: {
          userId,
          latitude,
          longitude,
          locationAccuracy: accuracy,
          locationUpdatedAt: new Date(),
          message,
          severity,
          status: 'ACTIVE',
          dispatchStatus: 'PENDING',
        },
      });

      await logDispatch(prisma, alert.id, 'CREATED', { detail: `severity ${severity}` });

      // Every caller listens on their alert's room — this is what carries live
      // dispatch status to a guest, who has no user room to receive it in.
      socket.join(`alert-${alert.id}`);
      if (!userId) socket.data.guestAlertId = alert.id;

      // 1. Admins immediately
      io.to('admin-room').emit('emergency:alert', {
        id: alert.id,
        userId,
        latitude,
        longitude,
        accuracy,
        message,
        severity,
        timestamp: alert.createdAt,
        status: 'ACTIVE',
        dispatchStatus: 'PENDING',
      });

      // 2. Confirm to the caller, and always surface the emergency number.
      //    Their safety must never depend on our dispatch chain succeeding.
      socket.emit('emergency:confirmed', {
        alertId: alert.id,
        message: 'Emergency alert sent. Finding help near you...',
        timestamp: alert.createdAt,
        emergencyNumber: '112',
      });

      // 3. Emergency contacts are notified in PARALLEL with vendor dispatch.
      //    Waiting for the vendor chain to fail first would cost a full minute.
      (async () => {
        try {
          // A guest has no stored contacts to notify. findUnique with a null id
          // would throw, so skip straight past it.
          if (!userId) return;
          const caller = await (prisma as any).user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, profile: true },
          });
          const contacts = [
            {
              name: caller?.profile?.emergencyContact ?? null,
              phone: caller?.profile?.emergencyPhone ?? null,
            },
          ].filter(c => c.phone);
          if (contacts.length) {
            await notifyEmergencyContacts(
              contacts,
              `${caller?.firstName ?? 'A KleverKlues user'} ${caller?.lastName ?? ''}`.trim(),
              { alertId: alert.id, severity, latitude, longitude }
            );
          }
        } catch (err) {
          console.error('emergency contact notification failed:', err);
        }
      })();

      // 4. Start the dispatch chain (fan-out, escalation on exhaustion).
      void startDispatch(io, prisma, alert.id);

    } catch (error) {
      console.error('Emergency SOS error:', error);
      socket.emit('emergency:error', {
        error: 'Failed to send alert. Call 112 immediately.',
        emergencyNumber: '112',
      });
    }
  });

  // ── Caller streams an updated position ─────────────────────────────────────
  // Someone fleeing, or in a vehicle, is not where they were when they pressed
  // the button. Responders need the current position, not the original one.
  socket.on('sos:location_update', async (data: { alertId: string; latitude: number; longitude: number; accuracy?: number }) => {
    try {
      const owned = ownedAlertWhere(socket, data?.alertId);
      if (!owned || !validCoords(data?.latitude, data?.longitude)) return;

      const updated = await (prisma as any).emergencyAlert.updateMany({
        where: { ...owned, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          locationAccuracy: typeof data.accuracy === 'number' ? data.accuracy : undefined,
          locationUpdatedAt: new Date(),
        },
      });
      if (updated.count === 0) return;

      const payload = {
        alertId: data.alertId,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy ?? null,
      };
      io.to('admin-room').emit('emergency:location_update', payload);

      const alert = await (prisma as any).emergencyAlert.findUnique({
        where: { id: data.alertId },
        select: { assignedVendorId: true },
      });
      if (alert?.assignedVendorId) {
        io.to(`vendor-${alert.assignedVendorId}`).emit('sos:location_update', payload);
      }
    } catch (error) {
      console.error('Location update error:', error);
    }
  });

  // ── Caller cancels (false alarm) ───────────────────────────────────────────
  socket.on('emergency:cancel', async (data: AlertRef) => {
    try {
      // Scoped to the owner, so nobody can cancel someone else's emergency.
      const owned = ownedAlertWhere(socket, data?.alertId);
      if (!owned) return;

      const cancelled = await (prisma as any).emergencyAlert.updateMany({
        where: { ...owned, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
        data: { status: 'CANCELLED', dispatchStatus: 'CANCELLED', cancelledAt: new Date() },
      });
      if (cancelled.count === 0) return;

      abortDispatch(data.alertId);
      await logDispatch(prisma, data.alertId, 'CANCELLED', { detail: 'cancelled by caller' });

      const alert = await (prisma as any).emergencyAlert.findUnique({
        where: { id: data.alertId },
        select: { assignedVendorId: true },
      });
      if (alert?.assignedVendorId) {
        await (prisma as any).vendorProfile
          .update({ where: { userId: alert.assignedVendorId }, data: { isAvailable: true } })
          .catch(() => {});
        io.to(`vendor-${alert.assignedVendorId}`).emit('vendor:case_resolved', { alertId: data.alertId });
      }

      // Admins still see it. A cancellation can be made under duress, so it is
      // recorded and shown rather than silently erased.
      io.to('admin-room').emit('emergency:cancelled', { alertId: data.alertId, by: 'caller' });
      socket.emit('emergency:cancel_confirmed', { alertId: data.alertId });
    } catch (error) {
      console.error('Cancel error:', error);
    }
  });

  // ── Vendor accepts dispatch ────────────────────────────────────────────────
  socket.on('vendor:accept', async (data: AlertRef) => {
    try {
      const { alertId } = data ?? {};
      const vendorId: string | undefined = socket.data.userId;
      if (!vendorId || socket.data.role !== 'VENDOR') {
        socket.emit('error', { message: 'Vendor role required' });
        return;
      }

      if (!wasOffered(alertId, vendorId)) {
        socket.emit('vendor:accept_rejected', { alertId, reason: 'This alert was not offered to you.' });
        return;
      }

      // Atomic claim — with several vendors pinged at once, exactly one wins.
      const won = await claimAlert(prisma, alertId, vendorId);
      if (!won) {
        socket.emit('vendor:accept_rejected', { alertId, reason: 'Another responder already accepted.' });
        return;
      }

      const alert = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
      const vendorProfile = await (prisma as any).vendorProfile.findUnique({
        where: { userId: vendorId },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      const vendorName = vendorProfile?.user
        ? `${vendorProfile.user.firstName} ${vendorProfile.user.lastName}`.trim()
        : 'Your responder';

      console.log(`✅ Vendor ${vendorId} ACCEPTED alert ${alertId}`);

      notifyCaller(io, alert?.userId ?? null, {
        alertId,
        dispatchStatus: 'VENDOR_ACCEPTED',
        vendorName,
        vendorPhone: vendorProfile?.phone,
        message: `✅ ${vendorName} has accepted and is on the way. Stay where you are if it is safe.`,
      });

      io.to('admin-room').emit('sos:vendor_assigned', {
        alertId, vendorId, vendorName, dispatchStatus: 'VENDOR_ACCEPTED',
      });

      socket.emit('vendor:accept_confirmed', {
        alertId,
        message: 'You are now dispatched. Head to the location.',
        latitude: alert?.latitude,
        longitude: alert?.longitude,
      });
    } catch (error) {
      console.error('Vendor accept error:', error);
      socket.emit('error', { message: 'Failed to accept dispatch' });
    }
  });

  // ── Vendor declines dispatch ───────────────────────────────────────────────
  socket.on('vendor:decline', async (data: AlertRef) => {
    try {
      const { alertId } = data ?? {};
      const vendorId: string | undefined = socket.data.userId;
      if (!vendorId || socket.data.role !== 'VENDOR') return;
      if (!wasOffered(alertId, vendorId)) return;

      console.log(`❌ Vendor ${vendorId} DECLINED alert ${alertId}`);
      await logDispatch(prisma, alertId, 'DECLINED', { vendorId });

      // If everyone in this round declines, the next round starts immediately
      // instead of waiting out the timeout.
      noteDecline(alertId, vendorId);
    } catch (error) {
      console.error('Vendor decline error:', error);
    }
  });

  // ── Vendor updates journey status (EN_ROUTE / NEARBY / ARRIVED / RESOLVED) ──
  socket.on('vendor:status_update', async (data: { alertId: string; status: string; latitude?: number; longitude?: number }) => {
    try {
      const { alertId, status } = data ?? {};
      const vendorId: string | undefined = socket.data.userId;
      if (!vendorId || socket.data.role !== 'VENDOR') {
        socket.emit('error', { message: 'Vendor role required' });
        return;
      }

      // Whitelist the status — this string was previously written to the DB
      // verbatim from the payload.
      if (!VALID_DISPATCH_STATUSES.includes(status as any)) {
        socket.emit('vendor:status_ack', { alertId, status, success: false, error: 'Invalid status' });
        return;
      }

      // Only the vendor actually assigned to this alert may move it.
      const assigned = await (prisma as any).emergencyAlert.findUnique({
        where: { id: alertId },
        select: { assignedVendorId: true, latitude: true, longitude: true, userId: true },
      });
      if (!assigned || assigned.assignedVendorId !== vendorId) {
        socket.emit('vendor:status_ack', { alertId, status, success: false, error: 'Not assigned to this alert' });
        return;
      }

      // ARRIVED is a claim that can be made from the sofa. Require the vendor to
      // actually be near the scene before it is accepted.
      if (status === 'ARRIVED') {
        const hasFix = validCoords(data.latitude, data.longitude);
        const distanceKm = hasFix
          ? haversineKm(assigned.latitude, assigned.longitude, data.latitude!, data.longitude!)
          : null;

        if (distanceKm === null || distanceKm > ARRIVAL_PROXIMITY_KM) {
          await logDispatch(prisma, alertId, 'ARRIVED', {
            vendorId,
            detail: `rejected — vendor ${distanceKm === null ? 'sent no location' : `${distanceKm.toFixed(2)}km away`}`,
            distanceKm: distanceKm ?? undefined,
          });
          socket.emit('vendor:status_ack', {
            alertId, status, success: false,
            error: 'You must be at the location to mark arrival. Share your live location and try again.',
          });
          return;
        }
        await logDispatch(prisma, alertId, 'ARRIVED', { vendorId, distanceKm });
      }

      const statusMessages: Record<string, string> = {
        EN_ROUTE: '🚗 Your responder is on the way. Stay where you are if it is safe.',
        NEARBY:   '📍 Your responder is very close — they will be with you any moment.',
        ARRIVED:  '🟢 Your responder has arrived.',
        RESOLVED: '✅ Your responder marked this case resolved. Please confirm you are safe.',
      };

      const alert = await (prisma as any).emergencyAlert.update({
        where: { id: alertId },
        data: { dispatchStatus: status },
      }).catch((e: any) => { console.error('DB update failed:', e); return null; });

      if (!alert) {
        socket.emit('vendor:status_ack', { alertId, status, success: false, error: 'Alert not found' });
        return;
      }

      notifyCaller(io, alert.userId, {
        alertId,
        dispatchStatus: status,
        message: statusMessages[status],
        // RESOLVED from a vendor is unconfirmed until the caller says so.
        awaitingConfirmation: status === 'RESOLVED',
      });

      io.to('admin-room').emit('sos:vendor_status_update', {
        alertId, vendorId, dispatchStatus: status, message: statusMessages[status], timestamp: new Date(),
      });

      if (status === 'RESOLVED') {
        abortDispatch(alertId);
        await logDispatch(prisma, alertId, 'RESOLVED', { vendorId, detail: 'vendor-reported, awaiting caller confirmation' });

        await (prisma as any).vendorProfile.update({
          where: { userId: vendorId },
          data: { isAvailable: true },
        }).catch(console.error);

        io.to(`vendor-${vendorId}`).emit('vendor:case_resolved', { alertId });
        console.log(`✅ Alert ${alertId} marked RESOLVED by vendor ${vendorId} (unconfirmed)`);
      }

      socket.emit('vendor:status_ack', { alertId, status, success: true });
    } catch (error) {
      console.error('Vendor status update error:', error);
      socket.emit('error', { message: 'Failed to update status' });
    }
  });

  // ── Caller confirms they are safe ──────────────────────────────────────────
  socket.on('emergency:confirm_resolved', async (data: AlertRef) => {
    try {
      const owned = ownedAlertWhere(socket, data?.alertId);
      if (!owned) return;

      const confirmed = await (prisma as any).emergencyAlert.updateMany({
        where: owned,
        data: { status: 'RESOLVED', resolvedAt: new Date(), resolutionConfirmedAt: new Date() },
      });
      if (confirmed.count === 0) return;

      await logDispatch(prisma, data.alertId, 'RESOLVED', { detail: 'confirmed by caller' });
      io.to('admin-room').emit('emergency:resolved', { alertId: data.alertId, confirmedByCaller: true });
      socket.emit('emergency:resolve_confirmed', { alertId: data.alertId });
    } catch (error) {
      console.error('Confirm resolve error:', error);
    }
  });

  // ── Admin acknowledges alert ───────────────────────────────────────────────
  socket.on('emergency:acknowledge', async (data: AlertRef) => {
    try {
      // Admin-only. This handler previously had no check at all, and wrote the
      // client-supplied adminId straight into the acknowledgedBy audit column.
      const adminId: string | undefined = socket.data.userId;
      if (!adminId || socket.data.role !== 'ADMIN') {
        socket.emit('error', { message: 'Admin role required' });
        return;
      }

      const alert = await (prisma as any).emergencyAlert.update({
        where: { id: data.alertId },
        data: { status: 'ACKNOWLEDGED', acknowledgedBy: adminId, acknowledgedAt: new Date() },
      });

      await logDispatch(prisma, data.alertId, 'ACKNOWLEDGED', { vendorId: adminId, detail: 'admin' });

      io.to('admin-room').emit('emergency:acknowledged', {
        alertId: data.alertId,
        adminId,
        timestamp: alert.acknowledgedAt,
      });

      notifyCaller(io, alert.userId, {
        alertId: data.alertId,
        message: 'Your emergency has been acknowledged by our team',
      });

      console.log(`Alert ${data.alertId} acknowledged by admin ${adminId}`);
    } catch (error) {
      console.error('Acknowledge error:', error);
      socket.emit('error', { message: 'Failed to acknowledge alert' });
    }
  });

  // ── Admin resolves alert ───────────────────────────────────────────────────
  socket.on('emergency:resolve', async (data: AlertRef) => {
    try {
      // Admin-only. Unauthenticated resolve let anyone silently close a live
      // emergency and tell the victim in crisis that help had already arrived.
      const adminId: string | undefined = socket.data.userId;
      if (!adminId || socket.data.role !== 'ADMIN') {
        socket.emit('error', { message: 'Admin role required' });
        return;
      }

      // Cancel the dispatch chain before closing, or a later round pings a new
      // vendor for a resolved alert.
      abortDispatch(data.alertId);

      const alert = await (prisma as any).emergencyAlert.update({
        where: { id: data.alertId },
        data: { status: 'RESOLVED', resolvedAt: new Date(), dispatchStatus: 'RESOLVED' },
      });

      await logDispatch(prisma, data.alertId, 'RESOLVED', { vendorId: adminId, detail: 'closed by admin' });

      if (alert.assignedVendorId) {
        await (prisma as any).vendorProfile.update({
          where: { userId: alert.assignedVendorId },
          data: { isAvailable: true },
        });
        io.to(`vendor-${alert.assignedVendorId}`).emit('vendor:case_resolved', { alertId: data.alertId });
      }

      io.to('admin-room').emit('emergency:resolved', {
        alertId: data.alertId,
        adminId,
        timestamp: alert.resolvedAt,
      });

      notifyCaller(io, alert.userId, {
        alertId: data.alertId,
        dispatchStatus: 'RESOLVED',
        message: '✅ This emergency case has been resolved. Stay safe.',
      });

      console.log(`Alert ${data.alertId} resolved by admin ${adminId}`);
    } catch (error) {
      console.error('Resolve error:', error);
      socket.emit('error', { message: 'Failed to resolve alert' });
    }
  });
}
