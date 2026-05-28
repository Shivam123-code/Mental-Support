'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import jwt from 'jsonwebtoken';

export default function DebugTokenPage() {
  const { user } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [rawToken, setRawToken] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setRawToken(token);
      try {
        // Decode without verification to see the payload
        const decoded = jwt.decode(token);
        setTokenInfo(decoded);
      } catch (error) {
        console.error('Token decode error:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Token Debug Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Token Payload (Decoded)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Raw Token</h2>
          <div className="bg-gray-100 p-4 rounded overflow-auto break-all text-xs">
            {rawToken || 'No token found'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <button
            onClick={() => {
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Token & Logout
          </button>
        </div>
      </div>
    </div>
  );
}
