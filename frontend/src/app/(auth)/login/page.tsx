'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneralLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/role-selection');
  }, [router]);

  return null;
}
