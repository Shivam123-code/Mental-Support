'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmergencySOS } from '@/hooks/useSocket';

export default function SOSButton() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const { sendSOS, isSending, isConnected } = useEmergencySOS(
    user?.id,
    user?.role,
    token || undefined
  );

  if (!isAuthenticated) return null;

  const handleSOSClick = () => {
    setIsOpen(true);
  };

  const handleSendSOS = async () => {
    setIsGettingLocation(true);

    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      // Send SOS
      await sendSOS({
        latitude,
        longitude,
        message: message || 'Emergency SOS activated',
        severity,
      });

      // Success
      alert('🚨 Emergency alert sent successfully! Help is on the way.');
      setIsOpen(false);
      setMessage('');
      setSeverity('CRITICAL');
    } catch (error) {
      console.error('SOS Error:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to send emergency alert. Please try again or call emergency services.'
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={handleSOSClick}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-lg transition-all duration-200 hover:scale-110 active:scale-95"
        title="Emergency SOS"
      >
        SOS
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency SOS</h2>
              <p className="text-gray-600 text-sm">
                Your location will be shared with our emergency response team
              </p>
            </div>

            {/* Connection Status */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 flex items-center justify-between">
              <span className="text-sm text-gray-600">Connection Status:</span>
              <span
                className={`text-sm font-medium ${
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isConnected ? '✓ Connected' : '✗ Disconnected'}
              </span>
            </div>

            {/* Severity Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSeverity('CRITICAL')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    severity === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setSeverity('HIGH')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    severity === 'HIGH'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => setSeverity('MEDIUM')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    severity === 'MEDIUM'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Medium
                </button>
              </div>
            </div>

            {/* Optional Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your emergency..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSending || isGettingLocation}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSOS}
                disabled={isSending || isGettingLocation || !isConnected}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending || isGettingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send SOS Alert'
                )}
              </button>
            </div>

            {/* Warning */}
            <p className="text-xs text-gray-500 text-center mt-4">
              For life-threatening emergencies, call emergency services immediately
            </p>
          </div>
        </div>
      )}
    </>
  );
}
