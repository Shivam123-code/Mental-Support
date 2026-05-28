"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [show, setShow] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const calmingQuotes = [
    "Breathing in calmness...",
    "Taking a moment for yourself...",
    "Preparing your peaceful space...",
    "Connecting with support...",
    "You are in a safe space...",
  ];

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setShow(true);
    }, 300);

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % calmingQuotes.length);
    }, 2500);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(interval);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--on-surface)] animate-fade-in">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Calming Ripple Effects */}
        <div className="absolute inset-0 rounded-full bg-[var(--primary-bright)]/10 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40" />
        <div className="absolute w-24 h-24 rounded-full bg-[var(--primary)]/10 animate-[pulse_2s_ease-in-out_infinite]" />
        
        {/* Core Heart Pulse Icon */}
        <div className="relative w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-lg border border-[var(--primary-bright)]/20">
          <svg
            className="w-8 h-8 text-[var(--primary-fixed)] animate-[pulse-soft_1.5s_ease-in-out_infinite]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      </div>

      {/* Dynamic Calming Text */}
      <h2 className="mt-8 text-headline-md font-medium text-[var(--primary)] transition-all duration-500 animate-pulse-soft">
        {calmingQuotes[quoteIndex]}
      </h2>
      <p className="mt-2 text-xs text-[var(--on-surface-variant)]/60 font-body uppercase tracking-widest">
        KleverKlues Wellbeing
      </p>
    </div>
  );
}
