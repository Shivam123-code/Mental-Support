"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/91XXXXXXXXXX?text=Hi%20KleverKlues%2C%20I%20need%20support"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1DA851] transition-all duration-200 hover:scale-[1.03] group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={18} className="group-hover:animate-pulse" />
      <span className="hidden sm:inline text-sm">WhatsApp</span>
    </a>
  );
}
