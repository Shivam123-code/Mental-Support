"use client";

import { X } from "lucide-react";

export default function QuickExit() {
  const handleQuickExit = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <button
      onClick={handleQuickExit}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] text-sm font-medium rounded-lg shadow-lg hover:bg-[var(--on-surface)] transition-all duration-200 hover:scale-[1.03]"
      aria-label="Quick Exit - Leave this site immediately"
      title="Quick Exit"
    >
      <X size={14} />
      <span className="hidden sm:inline">Quick Exit</span>
    </button>
  );
}
