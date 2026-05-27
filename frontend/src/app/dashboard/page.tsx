'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to role selection
        router.push('/role-selection');
      } else {
        // Redirect based on user role
        switch (user.role) {
          case 'ADMIN':
            router.replace('/dashboard/admin');
            break;
          case 'PROFESSIONAL':
            router.replace('/dashboard/professional');
            break;
          case 'ENTERPRISE':
            router.replace('/dashboard/enterprise');
            break;
          case 'USER':
          default:
            router.replace('/dashboard/user');
            break;
        }
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-[var(--primary)] mx-auto mb-4" />
        <p className="text-[var(--on-surface-variant)]">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
