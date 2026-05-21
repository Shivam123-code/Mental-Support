"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, Phone, ChevronDown, Heart, Brain, Users, Building2, GraduationCap, BookOpen, Shield } from "lucide-react";
import SearchModal from "./SearchModal";
import LanguageSelector from "./LanguageSelector";

interface DropdownItem {
  name: string;
  href: string;
  desc: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Support",
    items: [
      { name: "Get Support", href: "/get-support", desc: "Find the right support for you", icon: Heart },
      { name: "Assessments", href: "/assessments", desc: "Understand your wellbeing", icon: Brain },
      { name: "Programs", href: "/programs", desc: "Guided wellbeing journeys", icon: BookOpen },
      { name: "Professionals", href: "/professionals", desc: "Verified therapists & coaches", icon: Users },
      { name: "Book Session", href: "/book-session", desc: "Schedule a session now", icon: Heart },
    ],
  },
  {
    label: "Explore",
    items: [
      { name: "Community", href: "/community", desc: "Join support circles", icon: Users },
      { name: "Academy", href: "/academy", desc: "Learn & get certified", icon: GraduationCap },
      { name: "Resources", href: "/resources", desc: "Articles, videos & tools", icon: BookOpen },
      { name: "Enterprise", href: "/enterprise", desc: "Workplace wellbeing", icon: Building2 },
    ],
  },
  {
    label: "About",
    items: [
      { name: "About Us", href: "/about", desc: "Our mission & story", icon: Heart },
      { name: "Trust Center", href: "/trust", desc: "Safety & privacy", icon: Shield },
      { name: "Join Us", href: "/careers", desc: "Become a professional", icon: Users },
      { name: "Pricing", href: "/pricing", desc: "Plans & pricing", icon: BookOpen },
      { name: "Contact", href: "/contact", desc: "Get in touch", icon: Heart },
      { name: "FAQ", href: "/faq", desc: "Common questions", icon: BookOpen },
    ],
  },
];

const topLevelLinks = [
  { name: "Home", href: "/" },
];

function DropdownMenu({ group, isOpen, onToggle }: { group: NavGroup; isOpen: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isOpen
            ? "text-[var(--primary)] bg-[var(--surface-container)]"
            : "text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)]"
        }`}
      >
        {group.label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[280px] bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl shadow-ambient-hover p-2 z-50">
          {group.items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onToggle}
              className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[var(--surface-container)] transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <item.icon size={14} className="text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--on-surface-variant)] mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-hairline">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 relative">
              <Image
                src="/logo.svg"
                alt="KleverKlues"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg sm:text-xl font-display font-medium text-[var(--on-surface)]">
              KleverKlues&trade;
            </span>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            {topLevelLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
            {navGroups.map((group) => (
              <DropdownMenu
                key={group.label}
                group={group}
                isOpen={openDropdown === group.label}
                onToggle={() => handleToggle(group.label)}
              />
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sos"
              className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[var(--error)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--on-error-container)] transition-all duration-200"
            >
              <Phone size={14} />
              SOS
            </Link>
            <Link
              href="/login"
              className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/assessments"
              className="hidden md:block btn-primary !py-2.5 !px-5 !text-sm"
            >
              Start Assessment
            </Link>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center justify-center w-9 h-9 text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all duration-200"
            >
              <Search size={18} />
            </button>
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] rounded-lg transition-all"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)] shadow-ambient max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="px-4 sm:px-6 py-6">
            {/* Home link */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all"
            >
              Home
            </Link>

            {/* Grouped sections */}
            {navGroups.map((group) => (
              <div key={group.label} className="mt-4">
                <p className="px-4 text-label-bold text-[var(--outline)] uppercase tracking-wider mb-2">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all"
                  >
                    <div className="w-7 h-7 rounded-md bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0">
                      <item.icon size={13} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <span className="block text-sm">{item.name}</span>
                      <span className="block text-xs text-[var(--on-surface-variant)]/70">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}

            {/* CTA Buttons */}
            <div className="pt-6 mt-6 border-t border-[var(--outline-variant)] flex flex-col gap-3">
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
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn-secondary text-center"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
