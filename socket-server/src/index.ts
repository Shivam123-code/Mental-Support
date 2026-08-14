// Load environment variables first using require to avoid hoisting issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '../../frontend/node_modules/@prisma/client';
import { PrismaPg } from '../../frontend/node_modules/@prisma/adapter-pg';
import { validateToken, extractTokenFromHeader } from './utils/jwtValidator';
import { setupSOSHandlers } from './events/sosHandler';
import { startDispatch, escalate, logDispatch } from './events/dispatch';

const app = express();
const httpServer = createServer(app);

// Initialize Prisma with PrismaPg adapter (Prisma v7 requirement)
// Pass connection string directly — PrismaPg creates the pool internally
// No fallback: a missing DATABASE_URL must fail loudly, never silently connect
// with a credential committed to the repo.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('FATAL: DATABASE_URL is not set. Add it to socket-server/.env before starting.');
}
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 3001;
// Fail closed: only an explicit NODE_ENV=development opens CORS. An unset or
// misspelled NODE_ENV gets production rules, not reflect-any-origin.
const isDev = process.env.NODE_ENV === 'development';

// In dev: allow all origins so any localhost port works.
// In prod: ALLOWED_ORIGINS is mandatory — no localhost default to fall back on.
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) ?? [];
if (!isDev && allowedOrigins.length === 0) {
  throw new Error('FATAL: ALLOWED_ORIGINS must be set when NODE_ENV is not "development".');
}
const corsOrigin = isDev
  ? true  // socket.io accepts boolean true as "reflect any origin"
  : allowedOrigins;

// Configure CORS
app.use(cors({
  origin: corsOrigin as any,
  credentials: true,
}));

app.use(express.json());

// Socket.io server with CORS
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin as any,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'kleverklues-socket-server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Stats endpoint — admin only. Connected-admin counts tell an attacker whether
// anyone is watching the emergency queue, so this is not public.
app.get('/stats', (req, res) => {
  const payload = validateToken(extractTokenFromHeader(req.headers.authorization) ?? '');
  if (!payload || payload.role !== 'ADMIN') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const sockets = io.sockets.sockets;
  res.json({
    connectedClients: sockets.size,
    admins: connectedAdmins.size,
    users: connectedUsers.size,
  });
});

/**
 * Internal dispatch trigger, called by the Next.js REST route.
 *
 * The public POST /api/sos path used to save an alert and reply "Help is on the
 * way" while dispatching to nobody — the dispatch chain only ever ran on the
 * socket path. Anyone whose socket had dropped got a black hole. This endpoint
 * lets the REST route start the same chain.
 *
 * Protected by a shared secret rather than a user token: the caller is our own
 * backend, not a browser.
 */
app.post('/internal/dispatch', async (req, res) => {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    console.error('❌ INTERNAL_API_SECRET not set — REST-originated SOS cannot dispatch.');
    res.status(500).json({ error: 'Internal dispatch not configured' });
    return;
  }
  if (req.headers['x-internal-secret'] !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { alertId } = req.body ?? {};
  if (!alertId || typeof alertId !== 'string') {
    res.status(400).json({ error: 'alertId required' });
    return;
  }

  // Respond immediately; dispatch runs for minutes and must not block the
  // caller's HTTP request.
  res.json({ ok: true });
  void startDispatch(io, prisma, alertId);
});

// Connected clients tracking
const connectedAdmins = new Map<string, string>(); // socketId -> userId
const connectedUsers = new Map<string, string>();  // socketId -> userId
const connectedVendors = new Map<string, string>(); // socketId -> userId

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Authenticate user
  socket.on('authenticate', async (data?: { token?: string }) => {
    try {
      // Re-authenticating an already-authenticated socket would register a second
      // copy of every SOS handler, so one emit would fire N times. Bind once.
      if (socket.data.userId || socket.data.isGuest) {
        socket.emit('authenticated', { success: false, error: 'Already authenticated' });
        return;
      }

      // Every attempt costs a JWT verify and a user lookup, and nothing capped
      // how many one socket could make. A client looping on a rejected token —
      // which is what a stale tab does — could drive that lookup indefinitely,
      // multiplied by however many such tabs are open. Three tries is enough for
      // a real client: token, then the guest downgrade, plus one spare.
      const attempts = (socket.data.authAttempts ?? 0) + 1;
      socket.data.authAttempts = attempts;
      if (attempts > 3) {
        socket.emit('authenticated', { success: false, error: 'Too many authentication attempts' });
        socket.disconnect(true);
        return;
      }

      // No token — a guest. SOS is open to everyone, exactly as the public REST
      // /api/sos already is, so a caller in crisis with no account gets the same
      // realtime path rather than being stuck on "Connecting…" forever. They get
      // SOS handlers and nothing else: no admin room, no vendor room, and every
      // handler still reads identity from socket.data, never from the payload.
      if (!data?.token) {
        socket.data.isGuest = true;
        console.log(`👤 Guest session ${socket.id} — SOS enabled`);
        socket.emit('authenticated', { success: true, guest: true });
        setupSOSHandlers(io, socket, prisma);
        return;
      }

      // Validate JWT token
      const payload = validateToken(data?.token);

      if (!payload) {
        console.error('❌ Token validation failed - invalid token');
        socket.emit('authenticated', {
          success: false,
          error: 'Invalid token'
        });
        return;
      }

      // Identity and role come from the DB keyed by the *verified* token subject —
      // never from the client payload, and not from the 7-day-old JWT claim either,
      // so a demotion or suspension takes effect on the next connect.
      const account = await (prisma as any).user.findUnique({
        where: { id: payload.userId },
        select: { id: true, role: true, status: true },
      });

      if (!account || account.status !== 'ACTIVE') {
        console.error(`❌ Rejected socket auth for ${payload.userId} (missing or not ACTIVE)`);
        socket.emit('authenticated', { success: false, error: 'Invalid token' });
        return;
      }

      const userId: string = account.id;
      const role: string = account.role;

      // Bind the authenticated identity to the socket. Every handler reads these
      // and nothing else — event payloads are not trusted for identity.
      socket.data.userId = userId;
      socket.data.role = role;

      console.log(`🔐 Authenticated ${userId} as ${role}`);

      // Join appropriate rooms based on role
      if (role === 'ADMIN') {
        connectedAdmins.set(socket.id, userId);
        socket.join('admin-room');
        console.log(`✅ 👮 Admin ${userId} joined admin room`);
      } else if (role === 'VENDOR') {
        connectedVendors.set(socket.id, userId);
        socket.join(`vendor-${userId}`);
        console.log(`✅ 🚐 Vendor ${userId} joined vendor-${userId} room`);
      } else {
        connectedUsers.set(socket.id, userId);
        socket.join(`user-${userId}`);
        console.log(`✅ 👤 User ${userId} authenticated`);
      }

      socket.emit('authenticated', { 
        success: true,
        userId,
        role,
      });

      // Setup SOS event handlers
      setupSOSHandlers(io, socket, prisma);

    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('authenticated', { 
        success: false, 
        error: 'Authentication failed' 
      });
    }
  });

  // Disconnect handler
  socket.on('disconnect', async () => {
    const userId = connectedAdmins.get(socket.id) || connectedVendors.get(socket.id) || connectedUsers.get(socket.id);
    const wasVendor = connectedVendors.has(socket.id);
    connectedAdmins.delete(socket.id);
    connectedVendors.delete(socket.id);
    connectedUsers.delete(socket.id);

    // A vendor who closes the tab without toggling off would otherwise stay
    // isOnline:true forever, and every alert would burn its full 30s dispatch
    // timeout pinging an empty room before trying the next responder.
    if (wasVendor && userId) {
      await (prisma as any).vendorProfile
        .update({ where: { userId }, data: { isOnline: false } })
        .catch(() => {/* vendor may have no profile row */});
    }

    // A caller going silent mid-emergency is a WORSE signal, not a resolved one.
    // Their phone may have died, been taken, or broken. Escalate to a human
    // rather than letting the case quietly continue with nobody watching.
    if (userId && !wasVendor) {
      try {
        const open = await (prisma as any).emergencyAlert.findFirst({
          where: { userId, status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } },
          orderBy: { createdAt: 'desc' },
        });
        if (open) {
          await logDispatch(prisma, open.id, 'CALLER_OFFLINE', {
            detail: 'caller socket disconnected during active alert',
          });
          io.to('admin-room').emit('emergency:caller_offline', {
            alertId: open.id,
            userId,
            latitude: open.latitude,
            longitude: open.longitude,
            requiresImmediateAction: true,
          });
          // Only page if nobody is already on their way to them.
          if (!open.assignedVendorId) {
            await escalate(
              io, prisma, open.id,
              { alertId: open.id, severity: open.severity, latitude: open.latitude, longitude: open.longitude },
              'caller went offline before any responder accepted'
            );
          }
        }
      } catch (err) {
        console.error('caller-offline escalation failed:', err);
      }
    }

    console.log(`❌ Client disconnected: ${socket.id} (User: ${userId || 'unknown'})`);
  });

  // Error handler
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀  KleverKlues Socket Server Started');
  console.log('🚀 ========================================');
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 Stats: http://localhost:${PORT}/stats`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS: ${isDev ? 'all origins (dev mode)' : JSON.stringify(corsOrigin)}`);
  console.log(`💾 DB: ${connectionString.split('@')[1] || 'configured'}`);
  console.log('🚀 ========================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, closing server...');
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
