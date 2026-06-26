'use client';

import { useState } from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AutoMatchModal from './AutoMatchModal';
import Link from 'next/link';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AutoMatchButton({ size = 'md', className = '' }: Props) {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const iconSize = { sm: 13, md: 15, lg: 18 }[size];

  if (!isAuthenticated) {
    // Show a "login to use" prompt for guests
    return (
      <Link
        href="/role-selection"
        className={`inline-flex items-center font-bold rounded-xl border-2 border-dashed border-[var(--primary)]/40 text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all ${sizeClasses[size]} ${className}`}
      >
        <Lock size={iconSize} />
        <span>Auto Match Me</span>
        <span className="text-[10px] opacity-60 font-normal">(login required)</span>
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center font-bold rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all ${sizeClasses[size]} ${className}`}
      >
        <Sparkles size={iconSize} className="animate-pulse" />
        <span>Auto Match Me</span>
      </button>

      <AutoMatchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
