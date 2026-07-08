"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard/admin")) return null;

  return (
    <a
      href="https://wa.me/91XXXXXXXXXX?text=Hi%20KleverKlues%2C%20I%20need%20support"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 w-14 h-14 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-xl hover:bg-[#1DA851] transition-all duration-200 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} className="group-hover:animate-pulse" />
    </a>
  );
}
