import { Server, Socket } from 'socket.io';
import { PrismaClient } from '../../../frontend/node_modules/@prisma/client';

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

export function setupSOSHandlers(io: Server, socket: Socket, prisma: PrismaClient) {
  
  // Emergency SOS Alert
  socket.on('emergency:sos', async (data: SOSData) => {
    try {
      console.log('🚨 EMERGENCY SOS RECEIVED:', {
        userId: data.userId,
        severity: data.severity,
        location: `${data.latitude}, ${data.longitude}`,
      });

      // Save to database
      const alert = await prisma.emergencyAlert.create({
        data: {
          userId: data.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          message: data.message || 'Emergency SOS activated',
          severity: data.severity,
          status: 'ACTIVE',
        },
      });

      // Broadcast to ALL admins immediately (sub-second latency)
      io.to('admin-room').emit('emergency:alert', {
        id: alert.id,
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        message: data.message,
        severity: data.severity,
        timestamp: alert.createdAt,
        status: 'ACTIVE',
      });

      // Confirm to user
      socket.emit('emergency:confirmed', {
        alertId: alert.id,
        message: 'Emergency alert sent successfully',
        timestamp: alert.createdAt,
      });

      console.log(`✅ Alert ${alert.id} broadcasted to admins`);
    } catch (error) {
      console.error('Emergency SOS error:', error);
      socket.emit('emergency:error', { 
        error: 'Failed to send alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Admin acknowledges alert
  socket.on('emergency:acknowledge', async (data: AcknowledgeData) => {
    try {
      const alert = await prisma.emergencyAlert.update({
        where: { id: data.alertId },
        data: {
          status: 'ACKNOWLEDGED',
          acknowledgedBy: data.adminId,
          acknowledgedAt: new Date(),
        },
      });

      // Notify all admins
      io.to('admin-room').emit('emergency:acknowledged', {
        alertId: data.alertId,
        adminId: data.adminId,
        timestamp: alert.acknowledgedAt,
      });

      // Notify user
      io.to(`user-${alert.userId}`).emit('emergency:acknowledged', {
        alertId: data.alertId,
        message: 'Your emergency has been acknowledged by our team',
      });

      console.log(`Alert ${data.alertId} acknowledged by admin ${data.adminId}`);
    } catch (error) {
      console.error('Acknowledge error:', error);
      socket.emit('error', { message: 'Failed to acknowledge alert' });
    }
  });

  // Admin resolves alert
  socket.on('emergency:resolve', async (data: AcknowledgeData) => {
    try {
      const alert = await prisma.emergencyAlert.update({
        where: { id: data.alertId },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
        },
      });

      // Notify all admins
      io.to('admin-room').emit('emergency:resolved', {
        alertId: data.alertId,
        adminId: data.adminId,
        timestamp: alert.resolvedAt,
      });

      // Notify user
      io.to(`user-${alert.userId}`).emit('emergency:resolved', {
        alertId: data.alertId,
        message: 'Your emergency has been resolved',
      });

      console.log(`Alert ${data.alertId} resolved by admin ${data.adminId}`);
    } catch (error) {
      console.error('Resolve error:', error);
      socket.emit('error', { message: 'Failed to resolve alert' });
    }
  });
}
