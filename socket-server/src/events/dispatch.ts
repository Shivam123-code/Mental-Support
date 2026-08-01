/**
 * Emergency dispatch engine.
 *
 * Replaces the original serial chain, which pinged one vendor at a time and
 * waited 30 seconds for each. Three stale or sleeping vendors meant 90 seconds
 * before anyone real was even asked, and when the list ran out the alert simply
 * stopped with the caller still reading "Searching...".
 *
 * The design rule here is: assume the vendor does not answer.
 *   - fan out to several vendors at once, first to accept wins
 *   - bound the search radius, because a vendor 400km away is not help
 *   - rank by reliability, not distance alone
 *   - never terminate; running out of vendors escalates to a human
 */
import { Server } from 'socket.io';
import { PrismaClient } from '../../../frontend/node_modules/@prisma/client';
import { haversineKm } from '../utils/haversine';
import { notifyVendor, pageOnCallAdmin, DispatchNotice } from '../utils/notify';

// ── Severity tiers ───────────────────────────────────────────────────────────
// severity was previously collected and then ignored — every alert behaved
// identically. A CRITICAL alert now searches wider, asks more people at once,
// and gives up on each round faster.
interface Tier {
  radiusKm: number;
  fanOut: number;       // vendors pinged simultaneously per round
  roundMs: number;      // how long to wait for that round to answer
  maxRounds: number;
}

const TIERS: Record<string, Tier> = {
  CRITICAL: { radiusKm: 25, fanOut: 5, roundMs: 20_000, maxRounds: 4 },
  HIGH:     { radiusKm: 15, fanOut: 3, roundMs: 25_000, maxRounds: 3 },
  MEDIUM:   { radiusKm: 10, fanOut: 2, roundMs: 30_000, maxRounds: 2 },
};

/** A vendor location older than this is treated as unknown, not as "here". */
const STALE_LOCATION_MS = 30 * 60 * 1000;

/** Vendors with fewer pings than this are not yet judged on their accept rate. */
const MIN_PINGS_FOR_RATING = 3;
const NEUTRAL_RELIABILITY = 0.7;

// ── In-flight dispatch state ─────────────────────────────────────────────────
// ponytail: process-local. Ceiling — correct only while the socket server runs a
// single instance (ecosystem.config.js pins instances:1). The *accept* path is
// already safe across instances because it claims the alert with an atomic
// conditional UPDATE; it is only this bookkeeping that is local. Upgrade path:
// move these two maps to Redis alongside the socket.io Redis adapter.
const activeDispatch = new Set<string>();
const acceptWaiters = new Map<string, () => void>();
/** Vendors pinged in the round currently running, per alert. */
const currentBatch = new Map<string, Set<string>>();
/** Vendors who declined the current round. */
const roundDeclines = new Map<string, Set<string>>();
/** Every vendor ever offered this alert — an offer from round 1 stays valid. */
const offered = new Map<string, Set<string>>();

/** Was this vendor actually offered this alert? Stops a vendor accepting a case never sent to them. */
export function wasOffered(alertId: string, vendorId: string): boolean {
  return offered.get(alertId)?.has(vendorId) ?? false;
}

/**
 * Record a decline. If every vendor in the current round has declined, wake the
 * round immediately instead of sitting out the remaining timeout — five instant
 * declines should cost ~0 seconds, not the full 20.
 */
export function noteDecline(alertId: string, vendorId: string): void {
  const batch = currentBatch.get(alertId);
  if (!batch?.has(vendorId)) return;

  const declined = roundDeclines.get(alertId) ?? new Set<string>();
  declined.add(vendorId);
  roundDeclines.set(alertId, declined);

  if ([...batch].every(v => declined.has(v))) {
    console.log(`⏩ Alert ${alertId}: entire round declined, advancing early`);
    acceptWaiters.get(alertId)?.();
  }
}

export interface VendorCandidate {
  userId: string;
  businessName: string;
  phone: string;
  pushSubscription: string | null;
  smsOptOut: boolean;
  distanceKm: number;
  score: number;
}

/** Append one row to the alert's audit trail. Never throws into dispatch. */
export async function logDispatch(
  prisma: PrismaClient,
  alertId: string,
  event: string,
  opts: { vendorId?: string; detail?: string; distanceKm?: number } = {}
): Promise<void> {
  try {
    await (prisma as any).sosDispatchLog.create({
      data: {
        alertId,
        event,
        vendorId: opts.vendorId ?? null,
        detail: opts.detail ?? null,
        distanceKm: opts.distanceKm ?? null,
      },
    });
  } catch (err) {
    console.error('audit log write failed:', err);
  }
}

/**
 * Find dispatchable vendors within the tier radius, best first.
 *
 * A bounding box narrows the query in SQL before any distance maths runs, so
 * this does not load every online vendor and compute Haversine for each in JS.
 * The box is a superset of the circle; the exact Haversine filter below trims
 * the corners.
 */
export async function findNearbyVendors(
  prisma: PrismaClient,
  lat: number,
  lon: number,
  radiusKm: number
): Promise<VendorCandidate[]> {
  const latDelta = radiusKm / 111;
  // Longitude degrees shrink toward the poles; guard the cos() near ±90.
  const lonDelta = radiusKm / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.01));
  const freshSince = new Date(Date.now() - STALE_LOCATION_MS);

  const vendors = await (prisma as any).vendorProfile.findMany({
    where: {
      isOnline: true,
      isAvailable: true,
      latitude: { gte: lat - latDelta, lte: lat + latDelta },
      longitude: { gte: lon - lonDelta, lte: lon + lonDelta },
      // A location saved this morning is not a location. Without this a vendor
      // who went home hours ago still looks like the nearest responder.
      locationUpdatedAt: { gte: freshSince },
    },
    select: {
      userId: true, businessName: true, phone: true, latitude: true, longitude: true,
      pingCount: true, acceptCount: true, pushSubscription: true, smsOptOut: true,
    },
  });

  return vendors
    .map((v: any) => {
      const distanceKm = haversineKm(lat, lon, v.latitude, v.longitude);
      const reliability =
        v.pingCount >= MIN_PINGS_FOR_RATING
          ? v.acceptCount / v.pingCount
          : NEUTRAL_RELIABILITY;
      return {
        userId: v.userId,
        businessName: v.businessName,
        phone: v.phone,
        pushSubscription: v.pushSubscription ?? null,
        smsOptOut: Boolean(v.smsOptOut),
        distanceKm,
        // Effective distance: a reliable vendor slightly further away beats a
        // closer one who never answers. Never divides by zero (floor 0.5).
        score: distanceKm / (0.5 + reliability),
      };
    })
    .filter((v: VendorCandidate) => v.distanceKm <= radiusKm)
    .sort((a: VendorCandidate, b: VendorCandidate) => a.score - b.score);
}

/**
 * Atomically claim an alert for one vendor.
 *
 * The conditional UPDATE is the concurrency control: with several vendors
 * pinged at once, exactly one row update can match `assignedVendorId: null`, so
 * exactly one vendor can win. This holds across server instances, unlike an
 * in-memory check.
 *
 * @returns true if this vendor won the race
 */
export async function claimAlert(
  prisma: PrismaClient,
  alertId: string,
  vendorId: string
): Promise<boolean> {
  const claimed = await (prisma as any).emergencyAlert.updateMany({
    where: {
      id: alertId,
      assignedVendorId: null,
      dispatchStatus: { in: ['PENDING', 'SEARCHING', 'VENDOR_ALERTED'] },
      status: { in: ['ACTIVE', 'ACKNOWLEDGED'] },
    },
    data: {
      assignedVendorId: vendorId,
      vendorAcceptedAt: new Date(),
      dispatchStatus: 'VENDOR_ACCEPTED',
    },
  });

  if (claimed.count === 0) return false;

  await Promise.allSettled([
    (prisma as any).vendorProfile.update({
      where: { userId: vendorId },
      data: { isAvailable: false, acceptCount: { increment: 1 } },
    }),
    logDispatch(prisma, alertId, 'ACCEPTED', { vendorId }),
  ]);

  // Wake the round that is currently waiting so it stops early.
  acceptWaiters.get(alertId)?.();
  return true;
}

/** Stop any in-flight dispatch for an alert (accepted, resolved, or cancelled). */
export function abortDispatch(alertId: string): void {
  acceptWaiters.get(alertId)?.();
  acceptWaiters.delete(alertId);
  activeDispatch.delete(alertId);
  currentBatch.delete(alertId);
  roundDeclines.delete(alertId);
  offered.delete(alertId);
}

/** Resolve early if someone accepts, otherwise after ms. */
function waitForRound(alertId: string, ms: number): Promise<void> {
  return new Promise(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      acceptWaiters.delete(alertId);
      resolve();
    };
    const timer = setTimeout(finish, ms);
    acceptWaiters.set(alertId, finish);
  });
}

/** Has this alert been taken, cancelled, or closed since the round started? */
async function isStillSearching(prisma: PrismaClient, alertId: string): Promise<boolean> {
  const a = await (prisma as any).emergencyAlert.findUnique({
    where: { id: alertId },
    select: { assignedVendorId: true, status: true, dispatchStatus: true },
  });
  if (!a) return false;
  if (a.assignedVendorId) return false;
  if (a.status === 'RESOLVED' || a.status === 'CANCELLED') return false;
  return true;
}

/**
 * Run the full dispatch chain for one alert.
 *
 * Safe to call from both the socket path and the REST path; a second call for an
 * alert already being dispatched is ignored.
 */
export async function startDispatch(
  io: Server,
  prisma: PrismaClient,
  alertId: string
): Promise<void> {
  if (activeDispatch.has(alertId)) return;
  activeDispatch.add(alertId);

  try {
    const alert = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
    if (!alert) return;

    const tier = TIERS[alert.severity] ?? TIERS.CRITICAL;
    const notice: DispatchNotice = {
      alertId,
      severity: alert.severity,
      latitude: alert.latitude,
      longitude: alert.longitude,
      message: alert.message ?? undefined,
      expiresInSeconds: Math.round(tier.roundMs / 1000),
    };

    const candidates = await findNearbyVendors(prisma, alert.latitude, alert.longitude, tier.radiusKm);

    if (candidates.length === 0) {
      await logDispatch(prisma, alertId, 'NO_VENDORS', {
        detail: `no dispatchable vendor within ${tier.radiusKm}km`,
      });
      await escalate(io, prisma, alertId, notice, `no vendor available within ${tier.radiusKm}km`);
      return;
    }

    const tried = new Set<string>();

    for (let round = 0; round < tier.maxRounds; round++) {
      if (!(await isStillSearching(prisma, alertId))) return;

      const batch = candidates.filter(c => !tried.has(c.userId)).slice(0, tier.fanOut);
      if (batch.length === 0) break;
      batch.forEach(c => tried.add(c.userId));

      currentBatch.set(alertId, new Set(batch.map(c => c.userId)));
      roundDeclines.set(alertId, new Set());
      const everOffered = offered.get(alertId) ?? new Set<string>();
      batch.forEach(c => everOffered.add(c.userId));
      offered.set(alertId, everOffered);

      await (prisma as any).emergencyAlert.updateMany({
        where: { id: alertId, assignedVendorId: null },
        data: { dispatchStatus: 'VENDOR_ALERTED', vendorAssignedAt: alert.vendorAssignedAt ?? new Date() },
      });

      console.log(`📡 Alert ${alertId} round ${round + 1}: pinging ${batch.length} vendor(s)`);

      // Ping the whole batch at once — this is the change that turns a 90-second
      // serial walk into a single 20-second round.
      await Promise.allSettled(
        batch.map(async v => {
          await Promise.allSettled([
            (prisma as any).vendorProfile.update({
              where: { userId: v.userId },
              data: { pingCount: { increment: 1 }, lastPingedAt: new Date() },
            }),
            logDispatch(prisma, alertId, 'PINGED', { vendorId: v.userId, distanceKm: v.distanceKm }),
          ]);

          await notifyVendor(
            () =>
              io.to(`vendor-${v.userId}`).emit('vendor:dispatch', {
                alertId,
                latitude: alert.latitude,
                longitude: alert.longitude,
                severity: alert.severity,
                message: alert.message ?? 'Emergency SOS — someone needs help near you.',
                distanceKm: Number(v.distanceKm.toFixed(2)),
                timeoutSeconds: Math.round(tier.roundMs / 1000),
              }),
            v,
            { ...notice, distanceKm: v.distanceKm }
          );
        })
      );

      notifyCaller(io, alert.userId, {
        alertId,
        dispatchStatus: 'VENDOR_ALERTED',
        message: `📡 ${batch.length} nearby responder(s) alerted. Hang tight.`,
      });

      io.to('admin-room').emit('sos:vendor_assigned', {
        alertId,
        vendorIds: batch.map(v => v.userId),
        round: round + 1,
        dispatchStatus: 'VENDOR_ALERTED',
      });

      await waitForRound(alertId, tier.roundMs);

      if (!(await isStillSearching(prisma, alertId))) return; // someone accepted

      await Promise.allSettled(
        batch.map(v => logDispatch(prisma, alertId, 'TIMEOUT', { vendorId: v.userId }))
      );
      batch.forEach(v => io.to(`vendor-${v.userId}`).emit('vendor:dispatch_expired', { alertId }));
    }

    if (await isStillSearching(prisma, alertId)) {
      await escalate(io, prisma, alertId, notice, `${tried.size} vendor(s) did not respond`);
    }
  } catch (err) {
    console.error(`Dispatch error for ${alertId}:`, err);
    // Even a crash in dispatch must not leave the caller waiting silently.
    try {
      const a = await (prisma as any).emergencyAlert.findUnique({ where: { id: alertId } });
      if (a && !a.assignedVendorId) {
        await escalate(
          io, prisma, alertId,
          { alertId, severity: a.severity, latitude: a.latitude, longitude: a.longitude },
          'dispatch engine error'
        );
      }
    } catch { /* already logged */ }
  } finally {
    activeDispatch.delete(alertId);
    acceptWaiters.delete(alertId);
    currentBatch.delete(alertId);
    roundDeclines.delete(alertId);
    offered.delete(alertId);
  }
}

/**
 * Last automated step before a person in crisis has nobody.
 *
 * Deliberately does three things at once: marks the case, pages a human, and
 * tells the caller the truth with the emergency number — rather than leaving
 * "Searching for nearby vendors" on screen forever.
 */
export async function escalate(
  io: Server,
  prisma: PrismaClient,
  alertId: string,
  notice: DispatchNotice,
  reason: string
): Promise<void> {
  await (prisma as any).emergencyAlert.updateMany({
    where: { id: alertId, assignedVendorId: null },
    data: { dispatchStatus: 'ESCALATED', escalatedAt: new Date() },
  });

  await logDispatch(prisma, alertId, 'ESCALATED', { detail: reason });

  const alert = await (prisma as any).emergencyAlert.findUnique({
    where: { id: alertId },
    select: { userId: true },
  });

  io.to('admin-room').emit('emergency:escalated', {
    alertId,
    reason,
    severity: notice.severity,
    latitude: notice.latitude,
    longitude: notice.longitude,
    requiresImmediateAction: true,
  });

  notifyCaller(io, alert?.userId ?? null, {
    alertId,
    dispatchStatus: 'ESCALATED',
    // Honesty matters more than reassurance here.
    message:
      '⚠️ No local responder has confirmed yet. Our emergency team has been alerted. ' +
      'If you are in immediate danger, call 112 now.',
    showEmergencyNumber: true,
  });

  await pageOnCallAdmin(notice, reason);
  console.error(`🚨 Alert ${alertId} ESCALATED — ${reason}`);
}

/**
 * Push a status update to the caller.
 *
 * Routed by alert room first, user room second. A guest has no account and so
 * no `user-<id>` room — keying only on userId silently dropped every dispatch
 * update for exactly the callers least able to chase it up. Every caller joins
 * `alert-<id>` when their alert is created, signed in or not.
 *
 * Both rooms are passed in one `.to()` so a signed-in caller sitting in both
 * still receives the event once.
 */
export function notifyCaller(io: Server, userId: string | null, payload: Record<string, unknown>): void {
  const alertId = payload.alertId;
  const rooms: string[] = [];
  if (typeof alertId === 'string') rooms.push(`alert-${alertId}`);
  if (userId) rooms.push(`user-${userId}`);
  if (!rooms.length) return;
  io.to(rooms).emit('sos:status_update', payload);
}

export const dispatchConfig = { TIERS, STALE_LOCATION_MS };
