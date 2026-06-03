import { Server, Socket } from 'socket.io';
import { PrismaClient } from '../../../frontend/node_modules/@prisma/client';
import { haversineKm } from '../utils/haversine';

interface SOSData {
  userId: string;
  latitude: number;
  longitude: number;
  message?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

interface AcknowledgeData {
  alertId: string;
  adminId: string;
}

// Active dispatch timers: alertId -> NodeJS.Timeout
const dispatchTimers = new Map<string, NodeJS.Timeout>();

// Vendor dispatch state per alert: alertId -> sorted list of candidate vendorIds
const dispatchQueue = new Map<string, string[]>();

// Track which vendorId is currently being pinged per alert
const currentPing = new Map<string, string>(); // alertId -> vendorId

/**
 * Find all online+available vendors, sort by Haversine distance to the alert,
 * and return their userIds in ascending distance order.
 */
async function findSortedVendors(
  prisma: PrismaClient,
  alertLat: number,
  alertLon: number
): Promise<{ userId: string; distanceKm: number; businessName: string; phone: string }[]> {
  const vendors = await (prisma as any).vendorProfile.findMany({
    where: {
      isOnline: true,
      isAvailable: true,
      latitude: { not: null },
      longitude: { not: null },
    },
    select: {
      userId: true,
      businessName: true,
      phone: true,
      latitude: true,
      longitude: true,
    },
  });

  return vendors
    .map((v: any) => ({
      userId: v.userId,
      businessName: v.businessName,
      phone: v.phone,
      distanceKm: haversineKm(alertLat, alertLon, v.latitude!, v.longitude!),
    }))
    .sort((a: any, b: any) => a.distanceKm - b.distanceKm);
}

/**
 * Ping the next vendor in the queue for a given alert.
 * Sets a 30-second timeout; if vendor doesn't accept, moves to next.
 */
function pingNextVendor(
  io: Server,
  prisma: PrismaClient,
  alertId: string,
  alertData: { latitude: number; longitude: number; severity: string; message?: string; userId?: string },
  candidateUserIds: string[]
): void {
  // Clear any existing timer
  const existingTimer = dispatchTimers.get(alertId);
  if (existingTimer) clearTimeout(existingTimer);

  if (candidateUserIds.length === 0) {
    // No more vendors — update status to SEARCHING, notify user
    console.log(`⚠️ No vendors available for alert ${alertId}`);
    (prisma as any).emergencyAlert.update({
      where: { id: alertId },
      data: { dispatchStatus: 'SEARCHING' },
    }).catch(console.error);

    if (alertData.userId) {
      io.to(`user-${alertData.userId}`).emit('sos:status_update', {
        alertId,
        dispatchStatus: 'SEARCHING',
        message: '🔍 Searching for nearby vendors. Stay calm, help is being coordinated.',
      });
    }
    return;
  }

  const vendorId = candidateUserIds[0];
  const remaining = candidateUserIds.slice(1);

  currentPing.set(alertId, vendorId);
  dispatchQueue.set(alertId, remaining);

  console.log(`📡 Pinging vendor ${vendorId} for alert ${alertId} (${remaining.length} backups remaining)`);

  // Mark alert as VENDOR_ALERTED in DB
  (prisma as any).emergencyAlert.update({
    where: { id: alertId },
    data: {
      assignedVendorId: vendorId,
      vendorAssignedAt: new Date(),
      dispatchStatus: 'VENDOR_ALERTED',
    },
  }).catch(console.error);

  // Emit dispatch event to vendor
  io.to(`vendor-${vendorId}`).emit('vendor:dispatch', {
    alertId,
    latitude: alertData.latitude,
    longitude: alertData.longitude,
    severity: alertData.severity,
    message: alertData.message || 'Emergency SOS — someone needs help near you.',
    timeoutSeconds: 30,
  });

  // Notify user that a vendor is being alerted
  if (alertData.userId) {
    io.to(`user-${alertData.userId}`).emit('sos:status_update', {
      alertId,
      dispatchStatus: 'VENDOR_ALERTED',
      message: '📡 A nearby vendor has been alerted. Hang tight!',
    });
  }

  // Notify admin
  io.to('admin-room').emit('sos:vendor_assigned', {
    alertId,
    vendorId,
    dispatchStatus: 'VENDOR_ALERTED',
  });

  // 30-second timeout — if vendor doesn't accept, try next
  const timer = setTimeout(() => {
    const stillPinging = currentPing.get(alertId) === vendorId;
    if (!stillPinging) return; // vendor already accepted or another flow cleared this

    console.log(`⏰ Vendor ${vendorId} timed out for alert ${alertId}. Trying next vendor.`);
    currentPing.delete(alertId);

    // Notify vendor their window expired
    io.to(`vendor-${vendorId}`).emit('vendor:dispatch_expired', { alertId });

    // Try next vendor
    pingNextVendor(io, prisma, alertId, alertData, remaining);
  }, 30_000);

  dispatchTimers.set(alertId, timer);
}

export function setupSOSHandlers(io: Server, socket: Socket, prisma: PrismaClient) {

  // ── Emergency SOS Alert ────────────────────────────────────────────────────
  socket.on('emergency:sos', async (data: SOSData) => {
    try {
      console.log('🚨 EMERGENCY SOS RECEIVED:', {
        userId: data.userId,
        severity: data.severity,
        location: `${data.latitude}, ${data.longitude}`,
      });

      // Save to database
      const alert = await (prisma as any).emergencyAlert.create({
        data: {
          userId: data.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          message: data.message || 'Emergency SOS activated',
          severity: data.severity,
          status: 'ACTIVE',
          dispatchStatus: 'PENDING',
        },
      });

      // 1. Broadcast to ALL admins immediately
      io.to('admin-room').emit('emergency:alert', {
        id: alert.id,
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        message: data.message,
        severity: data.severity,
        timestamp: alert.createdAt,
        status: 'ACTIVE',
        dispatchStatus: 'PENDING',
      });

      // 2. Confirm to user immediately
      socket.emit('emergency:confirmed', {
        alertId: alert.id,
        message: 'Emergency alert sent. Finding help near you...',
        timestamp: alert.createdAt,
      });

      // 3. Send initial status to user
      if (data.userId) {
        io.to(`user-${data.userId}`).emit('sos:status_update', {
          alertId: alert.id,
          dispatchStatus: 'SEARCHING',
          message: '🔍 Finding the nearest vendor to you...',
        });
      }

      // 4. Find nearest vendors and start dispatch chain
      const sortedVendors = await findSortedVendors(prisma, data.latitude, data.longitude);
      console.log(`🗺️ Found ${sortedVendors.length} available vendor(s) for dispatch`);
      sortedVendors.forEach((v, i) => console.log(`  ${i + 1}. ${v.businessName} — ${v.distanceKm.toFixed(2)}km`));

      const candidateIds = sortedVendors.map(v => v.userId);

      pingNextVendor(
        io,
        prisma,
        alert.id,
        { latitude: data.latitude, longitude: data.longitude, severity: data.severity, message: data.message, userId: data.userId },
        candidateIds
      );

      console.log(`✅ Alert ${alert.id} dispatched to admin + vendor queue started`);
    } catch (error) {
      console.error('Emergency SOS error:', error);
      socket.emit('emergency:error', {
        error: 'Failed to send alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ── Vendor accepts dispatch ────────────────────────────────────────────────
  socket.on('vendor:accept', async (data: { alertId: string; vendorId: string }) => {
    try {
      const { alertId, vendorId } = data;

      // Ensure this vendor is still the current ping (prevent double-accept)
      const expectedVendor = currentPing.get(alertId);
      if (expectedVendor !== vendorId) {
        socket.emit('vendor:accept_rejected', { alertId, reason: 'Alert already assigned to another vendor or expired.' });
        return;
      }

      // Clear the 30-sec timeout
      const timer = dispatchTimers.get(alertId);
      if (timer) clearTimeout(timer);
      dispatchTimers.delete(alertId);
      dispatchQueue.delete(alertId);
      currentPing.delete(alertId);

      // Update DB
      const alert = await (prisma as any).emergencyAlert.update({
        where: { id: alertId },
        data: {
          dispatchStatus: 'VENDOR_ACCEPTED',
          vendorAcceptedAt: new Date(),
          assignedVendorId: vendorId,
        },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      // Mark vendor as unavailable
      await (prisma as any).vendorProfile.update({
        where: { userId: vendorId },
        data: { isAvailable: false },
      });

      console.log(`✅ Vendor ${vendorId} ACCEPTED alert ${alertId}`);

      // Get vendor info for user notification
      const vendorProfile = await (prisma as any).vendorProfile.findUnique({
        where: { userId: vendorId },
        include: { user: { select: { firstName: true, lastName: true } } },
      });

      const vendorName = vendorProfile?.user
        ? `${vendorProfile.user.firstName} ${vendorProfile.user.lastName}`.trim()
        : 'Your vendor';

      // Notify user — VENDOR_ACCEPTED
      if (alert.userId) {
        io.to(`user-${alert.userId}`).emit('sos:status_update', {
          alertId,
          dispatchStatus: 'VENDOR_ACCEPTED',
          vendorName,
          vendorPhone: vendorProfile?.phone,
          message: `✅ ${vendorName} has accepted and is on the way to you! Stay where you are.`,
        });
      }

      // Notify admin dashboard
      io.to('admin-room').emit('sos:vendor_assigned', {
        alertId,
        vendorId,
        vendorName,
        dispatchStatus: 'VENDOR_ACCEPTED',
      });

      // Confirm to vendor
      socket.emit('vendor:accept_confirmed', { alertId, message: 'You are now dispatched. Head to the location.' });

    } catch (error) {
      console.error('Vendor accept error:', error);
      socket.emit('error', { message: 'Failed to accept dispatch' });
    }
  });

  // ── Vendor declines dispatch ───────────────────────────────────────────────
  socket.on('vendor:decline', async (data: { alertId: string; vendorId: string }) => {
    try {
      const { alertId, vendorId } = data;
      const expectedVendor = currentPing.get(alertId);
      if (expectedVendor !== vendorId) return;

      console.log(`❌ Vendor ${vendorId} DECLINED alert ${alertId}`);

      const timer = dispatchTimers.get(alertId);
      if (timer) clearTimeout(timer);
      currentPing.delete(alertId);

      const remaining = dispatchQueue.get(alertId) || [];

      // Fetch original alert for location data
      const alert = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
      if (!alert) return;

      pingNextVendor(
        io, prisma, alertId,
        { latitude: alert.latitude, longitude: alert.longitude, severity: alert.severity, message: alert.message, userId: alert.userId },
        remaining
      );
    } catch (error) {
      console.error('Vendor decline error:', error);
    }
  });

  // ── Admin acknowledges alert ───────────────────────────────────────────────
  socket.on('emergency:acknowledge', async (data: AcknowledgeData) => {
    try {
      const alert = await (prisma as any).emergencyAlert.update({
        where: { id: data.alertId },
        data: { status: 'ACKNOWLEDGED', acknowledgedBy: data.adminId, acknowledgedAt: new Date() },
      });

      io.to('admin-room').emit('emergency:acknowledged', {
        alertId: data.alertId,
        adminId: data.adminId,
        timestamp: alert.acknowledgedAt,
      });

      if (alert.userId) {
        io.to(`user-${alert.userId}`).emit('emergency:acknowledged', {
          alertId: data.alertId,
          message: 'Your emergency has been acknowledged by our team',
        });
      }

      console.log(`Alert ${data.alertId} acknowledged by admin ${data.adminId}`);
    } catch (error) {
      console.error('Acknowledge error:', error);
      socket.emit('error', { message: 'Failed to acknowledge alert' });
    }
  });

  // ── Admin resolves alert ───────────────────────────────────────────────────
  socket.on('emergency:resolve', async (data: AcknowledgeData) => {
    try {
      const alert = await (prisma as any).emergencyAlert.update({
        where: { id: data.alertId },
        data: { status: 'RESOLVED', resolvedAt: new Date(), dispatchStatus: 'RESOLVED' },
      });

      // Free up the vendor if one was assigned
      if (alert.assignedVendorId) {
        await (prisma as any).vendorProfile.update({
          where: { userId: alert.assignedVendorId },
          data: { isAvailable: true },
        });
        io.to(`vendor-${alert.assignedVendorId}`).emit('vendor:case_resolved', { alertId: data.alertId });
      }

      io.to('admin-room').emit('emergency:resolved', {
        alertId: data.alertId,
        adminId: data.adminId,
        timestamp: alert.resolvedAt,
      });

      if (alert.userId) {
        io.to(`user-${alert.userId}`).emit('sos:status_update', {
          alertId: data.alertId,
          dispatchStatus: 'RESOLVED',
          message: '✅ This emergency case has been resolved. Stay safe.',
        });
      }

      console.log(`Alert ${data.alertId} resolved`);
    } catch (error) {
      console.error('Resolve error:', error);
      socket.emit('error', { message: 'Failed to resolve alert' });
    }
  });
}
