'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page has been merged into the main admin dashboard.
// Redirect to the SOS & Crisis tab there.
export default function EmergencyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/admin');
  }, [router]);
  return null;
}
