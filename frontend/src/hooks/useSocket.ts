'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useSocket(userId?: string, role?: string, token?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || !role || !token) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
      socket.emit('authenticate', { userId, role, token });
    });

    socket.on('authenticated', (data: { success: boolean }) => {
      if (data.success) {
        console.log('✅ Socket authenticated');
        setIsAuthenticated(true);
      } else {
        console.error('❌ Socket authentication failed');
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, role, token]);

  return {
    socket: socketRef.current,
    isConnected,
    isAuthenticated,
  };
}

export function useEmergencySOS(userId?: string, role?: string, token?: string) {
  const { socket, isConnected, isAuthenticated } = useSocket(userId, role, token);
  const [isSending, setIsSending] = useState(false);

  const sendSOS = async (data: {
    latitude: number;
    longitude: number;
    message?: string;
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  }) => {
    if (!socket || !isAuthenticated) {
      throw new Error('Socket not connected or authenticated');
    }

    setIsSending(true);

    return new Promise((resolve, reject) => {
      socket.emit('emergency:sos', {
        userId,
        ...data,
        severity: data.severity || 'CRITICAL',
      });

      socket.once('emergency:confirmed', (response) => {
        setIsSending(false);
        resolve(response);
      });

      socket.once('emergency:error', (error) => {
        setIsSending(false);
        // Socket server sends { error, details } — convert to real Error instance
        if (error instanceof Error) {
          reject(error);
        } else if (error && typeof error === 'object' && 'error' in error) {
          const e = error as { error: string; details?: string };
          reject(new Error(e.details || e.error || 'Emergency server error'));
        } else {
          reject(new Error('Failed to send emergency alert'));
        }
      });

      setTimeout(() => {
        setIsSending(false);
        reject(new Error('SOS timeout'));
      }, 5000);
    });
  };

  return {
    sendSOS,
    isSending,
    isConnected,
    isAuthenticated,
  };
}

export function useEmergencyAlerts(adminId?: string, token?: string) {
  const { socket, isConnected, isAuthenticated } = useSocket(adminId, 'ADMIN', token);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    socket.on('emergency:alert', (alert) => {
      console.log('🚨 New emergency alert:', alert);
      setAlerts((prev) => [alert, ...prev]);
      
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('🚨 Emergency Alert', {
            body: `${alert.severity} alert from User ${alert.userId}`,
            icon: '/logo.jpg',
          });
        }
      }
    });

    socket.on('emergency:acknowledged', (data) => {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === data.alertId
            ? { ...alert, status: 'ACKNOWLEDGED', acknowledgedBy: data.adminId }
            : alert
        )
      );
    });

    socket.on('emergency:resolved', (data) => {
      setAlerts((prev) =>
        prev.filter((alert) => alert.id !== data.alertId)
      );
    });

    return () => {
      socket.off('emergency:alert');
      socket.off('emergency:acknowledged');
      socket.off('emergency:resolved');
    };
  }, [socket, isAuthenticated]);

  const acknowledgeAlert = (alertId: string) => {
    if (!socket) return;
    socket.emit('emergency:acknowledge', { alertId, adminId });
  };

  const resolveAlert = (alertId: string) => {
    if (!socket) return;
    socket.emit('emergency:resolve', { alertId, adminId });
  };

  return {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    isConnected,
    isAuthenticated,
  };
}
