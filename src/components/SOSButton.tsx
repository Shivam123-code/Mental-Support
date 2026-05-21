"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

export default function SOSButton() {
  return (
    <Link
      href="/sos"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-105 animate-pulse-soft"
      aria-label="SOS - Get immediate help"
    >
      <Phone size={18} />
      <span className="hidden sm:inline">SOS</span>
    </Link>
  );
}
