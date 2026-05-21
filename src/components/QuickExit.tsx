"use client";

import { X } from "lucide-react";

export default function QuickExit() {
  const handleQuickExit = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <button
      onClick={handleQuickExit}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-800 text-white text-sm font-medium rounded-full shadow-lg hover:bg-gray-900 transition-all hover:scale-105"
      aria-label="Quick Exit - Leave this site immediately"
      title="Quick Exit"
    >
      <X size={16} />
      <span className="hidden sm:inline">Quick Exit</span>
    </button>
  );
}
