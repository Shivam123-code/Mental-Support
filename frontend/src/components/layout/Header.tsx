"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Phone, ChevronDown, Heart, Brain, Users, Building2, GraduationCap, BookOpen, Shield, LogOut, User as UserIcon } from "lucide-react";
import SearchModal from "@/components/ui/SearchModal";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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
      { name: "AI Companion", href: "/ai-companion", desc: "AI-powered wellbeing support", icon: Brain },
    ],
  },
  {
    label: "Explore",
    items: [
      { name: "Community", href: "/community", desc: "Join support circles", icon: Users },
      { name: "Academy", href: "/academy", desc: "Learn & get certified", icon: GraduationCap },
      { name: "Resources", href: "/resources", desc: "Articles, videos & tools", icon: BookOpen },
      { name: "Enterprise", href: "/enterprise", desc: "Workplace wellbeing", icon: Building2 },
      { name: "Impact", href: "/impact", desc: "Make a difference", icon: Heart },
      { name: "Research", href: "/research", desc: "Wellbeing intelligence", icon: Brain },
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

const topLevelLinks = [{ name: "Home", href: "/" }];

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
        className={`flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
          isOpen
            ? "text-[var(--primary)] bg-white shadow-sm"
            : "text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-white/50"
        }`}
      >
        {group.label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-[280px] bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl shadow-ambient-hover p-2 z-50 origin-top-left"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav border-b border-hairline" : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 sm:h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 relative">
                <img src="/logo.jpg" alt="KleverKlues" width={40} height={40} className="object-contain w-full h-full" />
              </div>
              <span className="text-lg sm:text-xl font-display font-medium text-[var(--on-surface)]">
                KleverKlues&trade;
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-1 bg-white/40 backdrop-blur-md border border-white/60 rounded-full px-1.5 py-1 shadow-sm mx-auto translate-x-6">
              {topLevelLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-[var(--primary)] bg-white shadow-sm"
                        : "text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-white/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
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
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-red-200 text-[var(--error)] bg-white text-xs font-semibold rounded-full hover:bg-red-50 transition-all duration-200 shadow-sm"
              >
                <Phone size={12} />
                SOS
              </Link>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--surface-container)] rounded-full border border-[var(--outline-variant)]/40 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                      <UserIcon size={12} className="text-[var(--primary)]" />
                    </div>
                    <span className="hidden md:block text-xs font-semibold text-[var(--on-surface)]">
                      {user.firstName || user.email}
                    </span>
                    <ChevronDown size={12} className={`hidden md:block transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl shadow-ambient-hover p-2 z-50">
                      <div className="px-3 py-2 border-b border-[var(--outline-variant)] mb-2">
                        <p className="text-sm font-semibold text-[var(--on-surface)]">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-[var(--on-surface-variant)]">{user.email}</p>
                        <p className="text-xs text-[var(--primary)] mt-1">{user.role}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--surface-container)] transition-all">
                        <UserIcon size={16} className="text-[var(--on-surface-variant)]" />
                        <span className="text-sm text-[var(--on-surface)]">Dashboard</span>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--error-container)] text-[var(--error)] transition-all">
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/role-selection"
                  className="hidden sm:flex items-center px-4 py-2 text-xs font-semibold text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-full transition-all duration-200"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/assessments"
                className="!hidden md:!inline-block bg-[#E07846] text-white text-xs font-semibold py-2.5 px-5 rounded-full hover:bg-[#c96c3e] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Start Assessment
              </Link>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center justify-center w-9 h-9 text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-full transition-all duration-200"
              >
                <Search size={16} />
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

        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </header>

      <div className="h-16 sm:h-[72px]" />

      {/* Mobile Navigation — OUTSIDE header so backdrop-blur doesn't break fixed positioning */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Tap outside to close */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Top-right corner dropdown card */}
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              style={{ transformOrigin: "top right" }}
              className="fixed top-[68px] right-3 w-[92vw] max-w-[320px] bg-white border border-[var(--outline-variant)]/30 rounded-2xl shadow-2xl z-[70] lg:hidden overflow-hidden"
            >
              {/* Scrollable nav area */}
              <nav className="max-h-[70vh] overflow-y-auto px-4 pt-4 pb-2">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-2 py-2 text-base font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all"
                >
                  Home
                </Link>

                {navGroups.map((group) => (
                  <div key={group.label} className="mt-4">
                    <p className="px-2 text-xs font-bold text-[var(--outline)] uppercase tracking-wider mb-2">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-base font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0">
                          <item.icon size={15} className="text-[var(--primary)]" />
                        </div>
                        <div>
                          <span className="block text-sm font-medium">{item.name}</span>
                          <span className="block text-xs text-[var(--on-surface-variant)]/70">{item.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>

              {/* Footer CTAs */}
              <div className="px-4 py-4 border-t border-[var(--outline-variant)] flex flex-col gap-3">
                <Link
                  href="/sos"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-[var(--error)] border border-red-200 text-sm font-semibold rounded-xl hover:bg-red-100 transition-all"
                >
                  <Phone size={14} />
                  SOS — Get Help Now
                </Link>
                <Link
                  href="/assessments"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md"
                >
                  Start Free Assessment
                </Link>
                {isAuthenticated && user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="btn-secondary text-center text-[var(--error)] border-[var(--error)] hover:bg-red-50"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link
                    href="/role-selection"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-secondary text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
