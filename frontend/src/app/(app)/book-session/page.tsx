"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Video, MessageCircle, Phone, Clock, CheckCircle, ArrowRight, Star, Globe, Shield, Loader2 } from "lucide-react";

/**
 * Booking.
 *
 * The page collected a type, a date and a time, listed three invented
 * professionals, quoted a fixed price regardless of who you picked, and then
 * Confirm Booking did nothing at all — no handler, no request. Everything a
 * person filled in here was discarded.
 *
 * It books now, against POST /api/bookings, with the professional's own rate.
 */

/** `duration` in minutes; `api` is the sessionType the booking API accepts. */
const sessionTypes = [
  { id: "video", api: "video", icon: Video, label: "Video Session", desc: "Face-to-face via secure video call", duration: 50 },
  { id: "chat", api: "chat", icon: MessageCircle, label: "Chat Session", desc: "Text-based real-time support", duration: 45 },
  { id: "call", api: "audio", icon: Phone, label: "Voice Call", desc: "Audio-only phone session", duration: 45 },
];

// ponytail: a fixed grid rather than the professional's real availability.
// ProfessionalAvailability exists in the schema and nothing writes to it, so
// there is no calendar to read. The server rejects a clash with a clear 409,
// which is shown below, so the worst case is one retry rather than a
// double-booking. Upgrade path: let professionals set their hours, then filter
// this list against them and against existing bookings.
const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
];

interface Professional {
  id: string;
  displayName: string;
  type: string;
  specializations: string[];
  averageRating: number;
  totalReviews: number;
  profileImage: string | null;
  hourlyRate: number | null;
  currency: string;
}

const TYPE_LABELS: Record<string, string> = {
  THERAPIST: "Therapist",
  PSYCHOLOGIST: "Psychologist",
  COUNSELOR: "Counsellor",
  COACH: "Wellness Coach",
  PSYCHIATRIST: "Psychiatrist",
  SOCIAL_WORKER: "Social Worker",
  MENTOR: "Mentor & Coach",
};

/** "9:00 AM" + "2026-08-30" -> a Date in the visitor's own timezone. */
function combine(dateValue: string, slot: string): Date | null {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot);
  if (!dateValue || !m) return null;
  let hour = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") hour += 12;
  const [y, mo, d] = dateValue.split("-").map(Number);
  return new Date(y, mo - 1, d, hour, Number(m[2]), 0, 0);
}

export default function BookSession() {
  const [selectedType, setSelectedType] = useState("video");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPro, setSelectedPro] = useState<string>("");

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingPros, setLoadingPros] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<any>(null);
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    setSignedIn(!!localStorage.getItem("auth_token"));
    // Read straight from the URL rather than useSearchParams, so this page does
    // not need a Suspense boundary just to honour one optional query parameter.
    const preselected = new URLSearchParams(window.location.search).get("professional");

    (async () => {
      try {
        const data = await (await fetch("/api/professionals")).json();
        if (data.success) {
          setProfessionals(data.data ?? []);
          // Only trust the id if it is actually in the list we just loaded.
          if (preselected && data.data?.some((p: Professional) => p.id === preselected)) {
            setSelectedPro(preselected);
          }
        }
      } catch { /* the empty state below covers it */ }
      finally { setLoadingPros(false); }
    })();
  }, []);

  const activeType = sessionTypes.find((t) => t.id === selectedType)!;
  const pro = professionals.find((p) => p.id === selectedPro);

  // The real price: their rate, pro-rated for the session length. The page used
  // to quote a fixed figure per session type no matter who you booked.
  const price = pro?.hourlyRate != null
    ? Math.round((pro.hourlyRate * activeType.duration) / 60)
    : null;

  const ready = !!selectedDate && !!selectedTime && !!selectedPro;

  const confirmBooking = async () => {
    const when = combine(selectedDate, selectedTime);
    if (!when || !selectedPro) return;
    if (when.getTime() < Date.now()) {
      setError("That time has already passed. Pick a later slot.");
      return;
    }

    setBooking(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          professionalId: selectedPro,
          sessionType: activeType.api,
          scheduledAt: when.toISOString(),
          duration: activeType.duration,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Could not book that session");
      setConfirmed(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBooking(false);
    }
  };

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

  if (confirmed) {
    return (
      <section className="section-gap bg-[var(--surface-container-lowest)] min-h-[70vh] flex items-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <CheckCircle size={44} className="mx-auto text-emerald-500" />
          <h1 className="text-headline-md text-[var(--on-surface)]">Session booked</h1>
          <p className="text-sm text-[var(--on-surface-variant)]">
            {confirmed.professional?.name} · {new Date(confirmed.scheduledAt).toLocaleString()} ·{" "}
            {confirmed.duration} minutes
          </p>
          <p className="text-xs text-[var(--on-surface-variant)]">
            It is waiting for them to confirm. You will see it in your dashboard either way.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/dashboard/user" className="btn-primary !py-2.5 !text-sm">Go to my sessions</Link>
            <button
              onClick={() => { setConfirmed(null); setSelectedTime(""); }}
              className="btn-secondary !py-2.5 !text-sm"
            >
              Book another
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--surface)] py-10 sm:py-16 border-b border-[var(--outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-display-xl text-[var(--on-surface)] mb-4">
              Book a <span className="text-gradient">Session</span>
            </h1>
            <p className="text-body-lg text-[var(--on-surface-variant)]">
              Connect with a verified professional who understands your needs. Choose your preferred session type, date, and time.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Flow */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left - Booking Steps */}
            <div className="lg:col-span-2 space-y-10 min-w-0">
              {/* Step 1: Session Type */}
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">1. Choose Session Type</h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-6">All sessions are private, encrypted, and clinically supervised.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`card !p-5 text-left transition-all duration-200 ${
                        selectedType === type.id
                          ? "!border-[var(--primary-bright)] !bg-[var(--primary-fixed)]/20 ring-1 ring-[var(--primary-bright)]"
                          : "hover:!border-[var(--primary-fixed-dim)]"
                      }`}
                    >
                      <type.icon size={22} className={selectedType === type.id ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]"} />
                      <h3 className="font-semibold text-[var(--on-surface)] mt-3 text-sm">{type.label}</h3>
                      <p className="text-xs text-[var(--on-surface-variant)] mt-1">{type.desc}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-[var(--outline)]">{type.duration} min</span>
                        {/* Priced from whoever is selected, not a fixed figure
                            per session type. */}
                        {pro?.hourlyRate != null && (
                          <span className="text-sm font-bold text-[var(--primary)]">
                            {pro.currency} {Math.round((pro.hourlyRate * type.duration) / 60)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Date */}
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">2. Select Date</h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-6">Choose a date that works for you.</p>
                <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-full">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      className={`flex-shrink-0 w-16 sm:w-20 py-4 rounded-xl border text-center transition-all duration-200 ${
                        selectedDate === d.value
                          ? "bg-[var(--primary-bright)] text-white border-[var(--primary-bright)]"
                          : "bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary-fixed-dim)]"
                      }`}
                    >
                      <p className="text-xs font-medium">{d.label}</p>
                      <p className="text-lg font-bold mt-1">{d.date}</p>
                      <p className="text-xs mt-0.5">{d.month}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Select Time */}
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">3. Select Time</h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-6">Available time slots for the selected date.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? "bg-[var(--primary-bright)] text-white border-[var(--primary-bright)]"
                          : "bg-[var(--surface-container-lowest)] border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:border-[var(--primary-fixed-dim)]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Choose Professional */}
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">4. Choose Professional</h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-6">Select from our verified professionals or let us match you.</p>

                {loadingPros ? (
                  <p className="text-sm text-[var(--on-surface-variant)] py-4">Loading professionals…</p>
                ) : professionals.length === 0 ? (
                  <div className="card !p-5 space-y-2">
                    <p className="text-sm font-semibold text-[var(--on-surface)]">No professionals are available yet</p>
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      They appear here once their credentials have been verified. Emergency support is
                      always available in the meantime.
                    </p>
                    <Link href="/sos" className="text-[var(--primary)] text-xs font-semibold hover:underline">
                      Get emergency support →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {professionals.map((prof) => (
                      <button
                        key={prof.id}
                        onClick={() => setSelectedPro(prof.id)}
                        className={`card !p-4 text-left transition-all ${
                          selectedPro === prof.id
                            ? "!border-[var(--primary-bright)] !bg-[var(--primary-fixed)]/20 ring-1 ring-[var(--primary-bright)]"
                            : "hover:!border-[var(--primary-fixed-dim)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                            {prof.profileImage ? (
                              <Image src={prof.profileImage} alt={prof.displayName} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] flex items-center justify-center text-white text-sm font-bold">
                                {prof.displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--on-surface)] text-xs truncate">{prof.displayName}</p>
                            <p className="text-xs text-[var(--primary)]">{TYPE_LABELS[prof.type] ?? prof.type}</p>
                            {prof.totalReviews > 0 && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Star size={10} className="text-[var(--tertiary-bright)] fill-[var(--tertiary-bright)]" />
                                <span className="text-xs text-[var(--on-surface-variant)]">
                                  {prof.averageRating.toFixed(1)} ({prof.totalReviews})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {prof.specializations.length > 0 && (
                          <p className="text-xs text-[var(--on-surface-variant)] mt-2 line-clamp-2">
                            {prof.specializations.slice(0, 3).join(", ")}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <Link href="/professionals" className="inline-flex items-center gap-2 mt-4 text-[var(--primary)] text-sm font-semibold hover:gap-3 transition-all">
                  View All Professionals <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right - Summary Panel */}
            <div className="lg:col-span-1 min-w-0">
              <div className="lg:sticky lg:top-24 card !bg-[var(--surface-container-low)]">
                <h3 className="font-semibold text-[var(--on-surface)] mb-6">Booking Summary</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--on-surface-variant)]">Professional</span>
                    <span className="font-medium text-[var(--on-surface)] text-right truncate">
                      {pro?.displayName ?? "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--on-surface-variant)]">Session Type</span>
                    <span className="font-medium text-[var(--on-surface)]">{activeType.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--on-surface-variant)]">Date</span>
                    <span className="font-medium text-[var(--on-surface)]">{selectedDate || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--on-surface-variant)]">Time</span>
                    <span className="font-medium text-[var(--on-surface)]">{selectedTime || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--on-surface-variant)]">Duration</span>
                    <span className="font-medium text-[var(--on-surface)]">{activeType.duration} min</span>
                  </div>
                  <div className="border-t border-[var(--outline-variant)] pt-4 flex justify-between">
                    <span className="font-semibold text-[var(--on-surface)]">Total</span>
                    <span className="font-bold text-[var(--primary)] text-lg">
                      {price != null ? `${pro!.currency} ${price}` : pro ? "Not priced" : "—"}
                    </span>
                  </div>
                  {pro && price == null && (
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      This professional has not set a rate yet. You can still book; they will confirm the fee with you.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    {error}
                  </div>
                )}

                {!signedIn ? (
                  <Link href="/login/user" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                    Sign in to book <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button
                    onClick={confirmBooking}
                    className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-40"
                    disabled={!ready || booking}
                  >
                    {booking ? <Loader2 size={16} className="animate-spin" /> : null}
                    {booking ? "Booking…" : "Confirm Booking"}
                    {!booking && <ArrowRight size={16} />}
                  </button>
                )}

                {signedIn && !ready && (
                  <p className="mt-2 text-[11px] text-[var(--on-surface-variant)] text-center">
                    Pick a professional, a date and a time to continue.
                  </p>
                )}

                {/* Trust indicators */}
                <div className="mt-6 space-y-2">
                  {[
                    { icon: Shield, text: "100% confidential & encrypted" },
                    { icon: Clock, text: "Free cancellation up to 4 hours before" },
                    { icon: Globe, text: "Anonymous mode available" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-xs text-[var(--on-surface-variant)]">
                      <item.icon size={12} className="text-[var(--primary-bright)]" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
