'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmergencyAlerts } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';

interface Alert {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  timestamp: Date;
}

export default function EmergencyDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const { alerts, acknowledgeAlert, resolveAlert, isConnected, isAuthenticated: socketAuth } = 
    useEmergencyAlerts(user?.id, token || undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    // Request notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }
  }, [isAuthenticated, user, router]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-red-500 text-white';
      case 'ACKNOWLEDGED':
        return 'bg-blue-500 text-white';
      case 'RESOLVED':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚨 Emergency Dashboard</h1>
          <p className="text-gray-600">Real-time emergency alerts and response management</p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">System Status</h2>
              <p className="text-sm text-gray-600">WebSocket connection and notification settings</p>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">WebSocket</div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    isConnected && socketAuth
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected && socketAuth ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  />
                  {isConnected && socketAuth ? 'Connected' : 'Disconnected'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Notifications</div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    notificationPermission === 'granted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {notificationPermission === 'granted' ? '✓ Enabled' : '⚠ Disabled'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts Count */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600">
                  {alerts.filter((a) => a.status === 'ACTIVE').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Acknowledged</p>
                <p className="text-3xl font-bold text-blue-600">
                  {alerts.filter((a) => a.status === 'ACKNOWLEDGED').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Emergency Alerts</h2>
          </div>

          {alerts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-gray-600 font-medium mb-1">No Active Alerts</p>
              <p className="text-sm text-gray-500">All clear - no emergencies at the moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>User ID:</strong> {alert.userId}
                      </p>
                      <p className="text-sm text-gray-900 mb-3">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openInMaps(alert.latitude, alert.longitude)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          📍 View Location ({alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)})
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status === 'ACKNOWLEDGED' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
