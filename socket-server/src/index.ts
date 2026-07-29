// Load environment variables first using require to avoid hoisting issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '../../frontend/node_modules/@prisma/client';
import { PrismaPg } from '../../frontend/node_modules/@prisma/adapter-pg';
import { validateToken } from './utils/jwtValidator';
import { setupSOSHandlers } from './events/sosHandler';

const app = express();
const httpServer = createServer(app);

// Initialize Prisma with PrismaPg adapter (Prisma v7 requirement)
// Pass connection string directly — PrismaPg creates the pool internally
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:kleverklues2024@localhost:5432/kleverklues?schema=public';
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 3001;
const isDev = (process.env.NODE_ENV || 'development') === 'development';

// In dev: allow all origins so any localhost port works.
// In prod: read ALLOWED_ORIGINS from env — add your live frontend URL there.
const corsOrigin = isDev
  ? true  // socket.io accepts boolean true as "reflect any origin"
  : (process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['http://localhost:3000']);

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

// Stats endpoint
app.get('/stats', (req, res) => {
  const sockets = io.sockets.sockets;
  res.json({
    connectedClients: sockets.size,
    admins: connectedAdmins.size,
    users: connectedUsers.size,
  });
});

// Connected clients tracking
const connectedAdmins = new Map<string, string>(); // socketId -> userId
const connectedUsers = new Map<string, string>();  // socketId -> userId
const connectedVendors = new Map<string, string>(); // socketId -> userId

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Authenticate user
  socket.on('authenticate', async (data: { userId: string; role: string; token: string }) => {
    try {
      console.log(`🔐 Authentication attempt for user: ${data.userId}, role: ${data.role}`);
      
      // Validate JWT token
      const payload = validateToken(data.token);
      
      if (!payload) {
        console.error('❌ Token validation failed - invalid token');
        socket.emit('authenticated', { 
          success: false, 
          error: 'Invalid token' 
        });
        return;
      }

      if (payload.userId !== data.userId) {
        console.error(`❌ User ID mismatch - token: ${payload.userId}, provided: ${data.userId}`);
        socket.emit('authenticated', { 
          success: false, 
          error: 'Invalid token' 
        });
        return;
      }

      const { userId, role } = data;

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
  socket.on('disconnect', () => {
    const userId = connectedAdmins.get(socket.id) || connectedVendors.get(socket.id) || connectedUsers.get(socket.id);
    connectedAdmins.delete(socket.id);
    connectedVendors.delete(socket.id);
    connectedUsers.delete(socket.id);
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
