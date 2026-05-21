"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, Phone } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Get Support", href: "/get-support" },
  { name: "Assessments", href: "/assessments" },
  { name: "Programs", href: "/programs" },
  { name: "Professionals", href: "/professionals" },
  { name: "Community", href: "/community" },
  { name: "Enterprise", href: "/enterprise" },
  { name: "Academy", href: "/academy" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-hairline">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.svg"
                alt="KleverKlues"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-display font-medium text-[var(--on-surface)]">
              KleverKlues
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/sos"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[var(--error)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--on-error-container)] transition-all duration-200"
            >
              <Phone size={14} />
              SOS
            </Link>
            <Link
              href="/assessments"
              className="hidden md:block btn-primary !py-2.5 !px-5 !text-sm"
            >
              Start Assessment
            </Link>
            <button className="hidden md:flex items-center justify-center w-9 h-9 text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all duration-200">
              <Search size={18} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden flex items-center justify-center w-10 h-10 text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] rounded-lg transition-all"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="xl:hidden bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)] shadow-ambient">
          <nav className="px-6 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 mt-4 border-t border-[var(--outline-variant)] flex flex-col gap-3">
              <Link
                href="/sos"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--error)] text-white font-semibold rounded-lg"
              >
                <Phone size={16} />
                SOS — Get Help Now
              </Link>
              <Link
                href="/assessments"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-center"
              >
                Start Free Assessment
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
