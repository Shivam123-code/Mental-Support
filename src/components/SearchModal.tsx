"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Heart, Brain, Users, BookOpen, Shield, GraduationCap, Building2, Phone } from "lucide-react";

interface SearchItem {
  name: string;
  href: string;
  category: string;
  icon: React.ElementType;
}

const searchableItems: SearchItem[] = [
  // Support
  { name: "Get Support", href: "/get-support", category: "Support", icon: Heart },
  { name: "Anxiety Support", href: "/get-support", category: "Support", icon: Heart },
  { name: "Depression Help", href: "/get-support", category: "Support", icon: Heart },
  { name: "Stress Management", href: "/get-support", category: "Support", icon: Heart },
  { name: "Relationship Counselling", href: "/get-support", category: "Support", icon: Heart },
  { name: "Burnout Recovery", href: "/get-support", category: "Support", icon: Heart },
  { name: "Grief Support", href: "/get-support", category: "Support", icon: Heart },
  { name: "Parenting Support", href: "/get-support", category: "Support", icon: Heart },
  { name: "Career Counselling", href: "/get-support", category: "Support", icon: Heart },
  { name: "Addiction Recovery", href: "/get-support", category: "Support", icon: Heart },
  // Assessments
  { name: "Anxiety Assessment", href: "/assessments", category: "Assessments", icon: Brain },
  { name: "Stress Score", href: "/assessments", category: "Assessments", icon: Brain },
  { name: "Burnout Meter", href: "/assessments", category: "Assessments", icon: Brain },
  { name: "EQ Assessment", href: "/assessments", category: "Assessments", icon: Brain },
  { name: "Personality Insights", href: "/assessments", category: "Assessments", icon: Brain },
  { name: "Career Aptitude", href: "/assessments", category: "Assessments", icon: Brain },
  { name: "Relationship Wellness", href: "/assessments", category: "Assessments", icon: Brain },
  // Programs
  { name: "Anxiety Reset Program", href: "/programs", category: "Programs", icon: BookOpen },
  { name: "Burnout Recovery Program", href: "/programs", category: "Programs", icon: BookOpen },
  { name: "Sleep Recovery", href: "/programs", category: "Programs", icon: BookOpen },
  { name: "Confidence Building", href: "/programs", category: "Programs", icon: BookOpen },
  { name: "Mindfulness Journey", href: "/programs", category: "Programs", icon: BookOpen },
  { name: "Couple Reconnection", href: "/programs", category: "Programs", icon: BookOpen },
  // Professionals
  { name: "Find a Counsellor", href: "/professionals", category: "Professionals", icon: Users },
  { name: "Find a Psychologist", href: "/professionals", category: "Professionals", icon: Users },
  { name: "Book a Session", href: "/book-session", category: "Professionals", icon: Users },
  { name: "Wellness Coach", href: "/professionals", category: "Professionals", icon: Users },
  // Community
  { name: "Support Circles", href: "/community", category: "Community", icon: Users },
  { name: "Student Wellness Group", href: "/community", category: "Community", icon: Users },
  { name: "Parenting Community", href: "/community", category: "Community", icon: Users },
  // Enterprise
  { name: "Enterprise Solutions", href: "/enterprise", category: "Enterprise", icon: Building2 },
  { name: "Corporate Wellness", href: "/enterprise", category: "Enterprise", icon: Building2 },
  { name: "EAP Programs", href: "/enterprise", category: "Enterprise", icon: Building2 },
  // Academy
  { name: "Counsellor Training", href: "/academy", category: "Academy", icon: GraduationCap },
  { name: "EQ Certification", href: "/academy", category: "Academy", icon: GraduationCap },
  { name: "Leadership EQ", href: "/academy", category: "Academy", icon: GraduationCap },
  // Resources
  { name: "Articles", href: "/resources", category: "Resources", icon: BookOpen },
  { name: "Meditation", href: "/resources", category: "Resources", icon: BookOpen },
  { name: "Sleep Audio", href: "/resources", category: "Resources", icon: BookOpen },
  { name: "Podcasts", href: "/resources", category: "Resources", icon: BookOpen },
  // Pages
  { name: "About KleverKlues", href: "/about", category: "Pages", icon: Heart },
  { name: "Trust & Safety", href: "/trust", category: "Pages", icon: Shield },
  { name: "Pricing & Plans", href: "/pricing", category: "Pages", icon: BookOpen },
  { name: "Contact Us", href: "/contact", category: "Pages", icon: Phone },
  { name: "FAQ", href: "/faq", category: "Pages", icon: BookOpen },
  { name: "SOS Crisis Support", href: "/sos", category: "Crisis", icon: Phone },
  { name: "Join as Professional", href: "/careers", category: "Pages", icon: Users },
  { name: "Dashboard", href: "/dashboard", category: "Pages", icon: Brain },
  { name: "Login / Sign Up", href: "/login", category: "Pages", icon: Shield },
];

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = query.length > 0
    ? searchableItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const quickLinks = [
    { name: "Get Support", href: "/get-support", icon: Heart },
    { name: "Take Assessment", href: "/assessments", icon: Brain },
    { name: "Book Session", href: "/book-session", icon: Users },
    { name: "SOS Crisis", href: "/sos", icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-[var(--surface-container-lowest)] rounded-xl shadow-2xl border border-[var(--outline-variant)] overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--outline-variant)]">
          <Search size={20} className="text-[var(--outline)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for support, assessments, programs..."
            className="flex-1 bg-transparent text-[var(--on-surface)] placeholder:text-[var(--outline)] text-base outline-none"
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-3">
          {query.length === 0 ? (
            <div>
              <p className="px-3 py-2 text-xs font-semibold text-[var(--outline)] uppercase tracking-wider">Quick Links</p>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--surface-container)] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--primary-fixed)] flex items-center justify-center">
                    <link.icon size={14} className="text-[var(--primary)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">{link.name}</span>
                  <ArrowRight size={14} className="ml-auto text-[var(--outline)] group-hover:text-[var(--primary)] transition-colors" />
                </Link>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div>
              <p className="px-3 py-2 text-xs font-semibold text-[var(--outline)] uppercase tracking-wider">
                {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
              </p>
              {filteredItems.map((item, idx) => (
                <Link
                  key={`${item.name}-${idx}`}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--surface-container)] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--primary-fixed)] flex items-center justify-center">
                    <item.icon size={14} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors block truncate">{item.name}</span>
                    <span className="text-xs text-[var(--on-surface-variant)]">{item.category}</span>
                  </div>
                  <ArrowRight size={14} className="text-[var(--outline)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-[var(--on-surface-variant)]">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[var(--outline)] mt-1">Try searching for &quot;anxiety&quot;, &quot;counsellor&quot;, or &quot;programs&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--outline-variant)] bg-[var(--surface-container-low)] flex items-center justify-between text-xs text-[var(--outline)]">
          <span>Type to search</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-container)] border border-[var(--outline-variant)] text-[10px]">ESC</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}
