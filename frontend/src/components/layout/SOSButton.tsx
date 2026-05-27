"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

export default function SOSButton() {
  return (
    <Link
      href="/sos"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-[var(--error)] text-white font-semibold rounded-lg shadow-lg hover:bg-[var(--on-error-container)] transition-all duration-200 hover:scale-[1.03] animate-pulse-soft"
      aria-label="SOS - Get immediate help"
    >
      <Phone size={16} />
      <span className="hidden sm:inline text-sm">SOS</span>
    </Link>
  );
}
