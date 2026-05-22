"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Get Support", href: "/get-support" },
  { name: "Assessments", href: "/assessments" },
  { name: "Programs", href: "/programs" },
  { name: "Professionals", href: "/professionals" },
  { name: "Book Session", href: "/book-session" },
  { name: "Community", href: "/community" },
  { name: "Enterprise", href: "/enterprise" },
  { name: "Academy", href: "/academy" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative">
              <Image
                src="/logo.svg"
                alt="KleverKlues"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-gradient">KleverKlues</span>
          </Link>

          {/* Desktop Navigation - only on xl screens */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* SOS - show only on desktop */}
            <Link
              href="/sos"
              className="hidden xl:flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-all animate-pulse-soft"
            >
              <Phone size={14} />
              SOS
            </Link>
            {/* Start Assessment - show only on xl desktop (with full nav) */}
            <Link
              href="/assessments"
              className="hidden xl:block px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-full hover:bg-purple-800 transition-all"
            >
              Start Assessment
            </Link>

            {/* Mobile/Tablet Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-gray-700 hover:bg-purple-50 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation */}
      {isMenuOpen && (
        <div className="xl:hidden bg-white border-t border-purple-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 text-sm sm:text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-purple-100 grid grid-cols-2 gap-2">
              <Link
                href="/sos"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-full"
              >
                <Phone size={12} />
                SOS
              </Link>
              <Link
                href="/assessments"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-3 py-2.5 bg-purple-700 text-white text-xs sm:text-sm font-medium rounded-full"
              >
                Assessment
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
