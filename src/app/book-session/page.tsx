"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Video, MessageCircle, Phone, Calendar, Clock, CheckCircle, ArrowRight, Star, Globe, Shield } from "lucide-react";

const sessionTypes = [
  { id: "video", icon: Video, label: "Video Session", desc: "Face-to-face via secure video call", duration: "50 min", price: "₹1,499" },
  { id: "chat", icon: MessageCircle, label: "Chat Session", desc: "Text-based real-time support", duration: "45 min", price: "₹999" },
  { id: "call", icon: Phone, label: "Voice Call", desc: "Audio-only phone session", duration: "45 min", price: "₹1,199" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
];

const featuredProfessionals = [
  { name: "Dr. Ananya Sharma", role: "Clinical Psychologist", rating: 4.9, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop", specialization: "Anxiety, Depression" },
  { name: "Rahul Mehta", role: "Counsellor", rating: 4.8, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop", specialization: "Burnout, Career" },
  { name: "Kavita Desai", role: "Wellness Coach", rating: 4.7, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop", specialization: "Stress, Mindfulness" },
];

export default function BookSession() {
  const [selectedType, setSelectedType] = useState("video");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

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
            <div className="lg:col-span-2 space-y-10">
              {/* Step 1: Session Type */}
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">1. Choose Session Type</h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-6">All sessions are private, encrypted, and clinically supervised.</p>
                <div className="grid sm:grid-cols-3 gap-4">
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
                        <span className="text-xs text-[var(--outline)]">{type.duration}</span>
                        <span className="text-sm font-bold text-[var(--primary)]">{type.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Date */}
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">2. Select Date</h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-6">Choose a date that works for you.</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
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
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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

                <div className="card !p-4 !bg-[var(--primary-fixed)]/20 !border-[var(--primary-fixed-dim)] mb-4 cursor-pointer hover:!bg-[var(--primary-fixed)]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
                      <CheckCircle size={18} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--on-surface)] text-sm">Auto-Match Me</p>
                      <p className="text-xs text-[var(--on-surface-variant)]">We&apos;ll match you with the best available professional</p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {featuredProfessionals.map((prof) => (
                    <div key={prof.name} className="card !p-4 cursor-pointer hover:!border-[var(--primary-fixed-dim)] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={prof.image} alt={prof.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--on-surface)] text-xs truncate">{prof.name}</p>
                          <p className="text-xs text-[var(--primary)]">{prof.role}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star size={10} className="text-[var(--tertiary-bright)] fill-[var(--tertiary-bright)]" />
                            <span className="text-xs text-[var(--on-surface-variant)]">{prof.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--on-surface-variant)] mt-2">{prof.specialization}</p>
                    </div>
                  ))}
                </div>

                <Link href="/professionals" className="inline-flex items-center gap-2 mt-4 text-[var(--primary)] text-sm font-semibold hover:gap-3 transition-all">
                  View All Professionals <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right - Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 card !bg-[var(--surface-container-low)]">
                <h3 className="font-semibold text-[var(--on-surface)] mb-6">Booking Summary</h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--on-surface-variant)]">Session Type</span>
                    <span className="font-medium text-[var(--on-surface)] capitalize">{selectedType}</span>
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
                    <span className="font-medium text-[var(--on-surface)]">
                      {sessionTypes.find((t) => t.id === selectedType)?.duration}
                    </span>
                  </div>
                  <div className="border-t border-[var(--outline-variant)] pt-4 flex justify-between">
                    <span className="font-semibold text-[var(--on-surface)]">Total</span>
                    <span className="font-bold text-[var(--primary)] text-lg">
                      {sessionTypes.find((t) => t.id === selectedType)?.price}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
                  disabled={!selectedDate || !selectedTime}
                >
                  Confirm Booking <ArrowRight size={16} />
                </button>

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
