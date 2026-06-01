"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Globe, ChevronDown, Check, X } from "lucide-react";

// Popular languages (code matches Google Translate lang codes)
const LANGUAGES = [
  { code: "en",    label: "English",             native: "English" },
  { code: "hi",    label: "Hindi",               native: "हिन्दी" },
  { code: "bn",    label: "Bengali",             native: "বাংলা" },
  { code: "ta",    label: "Tamil",               native: "தமிழ்" },
  { code: "te",    label: "Telugu",              native: "తెలుగు" },
  { code: "mr",    label: "Marathi",             native: "मराठी" },
  { code: "gu",    label: "Gujarati",            native: "ગુજરાતી" },
  { code: "kn",    label: "Kannada",             native: "ಕನ್ನಡ" },
  { code: "ml",    label: "Malayalam",           native: "മലയാളം" },
  { code: "pa",    label: "Punjabi",             native: "ਪੰਜਾਬੀ" },
  { code: "ur",    label: "Urdu",                native: "اردو" },
  { code: "or",    label: "Odia",                native: "ଓଡ଼ିଆ" },
  { code: "as",    label: "Assamese",            native: "অসমীয়া" },
  { code: "ar",    label: "Arabic",              native: "العربية" },
  { code: "zh-CN", label: "Chinese (Simplified)",native: "中文(简体)" },
  { code: "zh-TW", label: "Chinese (Traditional)",native: "中文(繁體)" },
  { code: "es",    label: "Spanish",             native: "Español" },
  { code: "fr",    label: "French",              native: "Français" },
  { code: "de",    label: "German",              native: "Deutsch" },
  { code: "pt",    label: "Portuguese",          native: "Português" },
  { code: "ru",    label: "Russian",             native: "Русский" },
  { code: "ja",    label: "Japanese",            native: "日本語" },
  { code: "ko",    label: "Korean",              native: "한국어" },
  { code: "tr",    label: "Turkish",             native: "Türkçe" },
  { code: "id",    label: "Indonesian",          native: "Bahasa Indonesia" },
  { code: "ms",    label: "Malay",               native: "Bahasa Melayu" },
  { code: "th",    label: "Thai",                native: "ภาษาไทย" },
  { code: "vi",    label: "Vietnamese",          native: "Tiếng Việt" },
  { code: "fa",    label: "Persian",             native: "فارسی" },
  { code: "sw",    label: "Swahili",             native: "Kiswahili" },
];

// Extend window type for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          opts: { pageLanguage: string; autoDisplay?: boolean },
          id: string
        ) => void;
      };
    };
  }
}

// Initialize Google Translate (loads script once)
function initGoogleTranslate() {
  if (document.getElementById("google-translate-script")) return;

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    new window.google.translate.TranslateElement(
      { pageLanguage: "en", autoDisplay: false },
      "google_translate_element_hidden"
    );
  };

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}

// Programmatically change language via Google Translate's hidden select
function applyGoogleTranslate(langCode: string) {
  if (langCode === "en") {
    // Restore original — find the "show original" link Google injects
    const showOriginal = document.querySelector<HTMLElement>(
      ".goog-te-menu-value span:first-child"
    );
    showOriginal?.click();

    // Cookie-based restore
    const hostname = window.location.hostname;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`;
    window.location.reload();
    return;
  }

  // Method 1: Direct select manipulation (most reliable)
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  // Method 2: Cookie + reload fallback (works even before widget is ready)
  const hostname = window.location.hostname;
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${hostname}`;
  window.location.reload();
}

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("en");
  const [search, setSearch] = useState("");
  const [widgetReady, setWidgetReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Load Google Translate on mount
  useEffect(() => {
    initGoogleTranslate();

    // Poll until the hidden select is available
    const interval = setInterval(() => {
      const sel = document.querySelector(".goog-te-combo");
      if (sel) {
        setWidgetReady(true);
        clearInterval(interval);
      }
    }, 500);

    // Read current language from cookie
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match?.[1]) setCurrentCode(match[1]);

    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const handleSelect = useCallback((code: string) => {
    setCurrentCode(code);
    setIsOpen(false);
    setSearch("");
    applyGoogleTranslate(code);
  }, []);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  const currentLang = LANGUAGES.find((l) => l.code === currentCode) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      {/* Hidden Google Translate mount point */}
      <div
        id="google_translate_element_hidden"
        className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
        aria-hidden="true"
      />

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--surface-container)] rounded-lg transition-all duration-200"
        aria-label="Select language"
        title="Translate this page"
      >
        <Globe size={15} />
        <span className="text-xs font-semibold hidden sm:inline">
          {currentLang.code === "en" ? "EN" : currentLang.code.toUpperCase().slice(0, 2)}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-2xl shadow-2xl z-[999] overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-[var(--outline-variant)]/50">
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--surface-container)] rounded-xl">
              <Globe size={13} className="text-[var(--outline)] flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language…"
                className="flex-1 text-xs bg-transparent outline-none text-[var(--on-surface)] placeholder-[var(--outline)]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-[var(--outline)] hover:text-[var(--on-surface)]">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Language list */}
          <div className="overflow-y-auto max-h-64 p-1.5">
            {filtered.length === 0 ? (
              <p className="text-xs text-[var(--outline)] text-center py-4">No language found</p>
            ) : (
              filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                    currentCode === lang.code
                      ? "bg-[var(--primary-fixed)] text-[var(--primary)] font-semibold"
                      : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="font-medium">{lang.native}</span>
                    <span className="opacity-50 text-[10px]">{lang.label}</span>
                  </div>
                  {currentCode === lang.code && (
                    <Check size={13} className="flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 border-t border-[var(--outline-variant)]/50 bg-[var(--surface-container)]/50">
            <p className="text-[10px] text-[var(--outline)] text-center">
              Powered by Google Translate · 100+ languages
            </p>
          </div>
        </div>
      )}

      {/* Suppress Google's injected UI */}
      <style>{`
        body > .skiptranslate,
        .goog-te-banner-frame,
        #goog-gt-tt,
        .goog-tooltip,
        .goog-te-balloon-frame {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0 !important;
          position: static !important;
        }
        .goog-te-gadget {
          font-size: 0 !important;
          color: transparent !important;
        }
        .goog-te-gadget a { display: none !important; }
        .goog-te-combo {
          opacity: 0 !important;
          position: absolute !important;
          pointer-events: none !important;
          width: 1px !important;
          height: 1px !important;
        }
      `}</style>
    </div>
  );
}
