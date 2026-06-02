"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, ArrowRight, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--surface)] section-gap !pb-10 relative overflow-hidden">
        <div className="absolute bottom-0 left-[5%] w-[250px] h-[250px] border border-[var(--primary-bright)]/8 rounded-full pointer-events-none hidden lg:block" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-display-xl text-[var(--on-surface)] mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-body-lg text-[var(--on-surface-variant)] max-w-2xl mx-auto">
            Have a question, feedback, or need support? We&apos;re here to help. Reach out through any channel.
          </p>
        </div>
      </section>

      {/* Contact Methods + Form */}
      <section className="section-gap bg-[var(--surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Left - Contact Methods */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-headline-md text-[var(--on-surface)] mb-6">Reach Us</h2>

              <div className="card !p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--on-surface)] text-sm">Email</h3>
                    <p className="text-sm text-[var(--primary)] mt-1">support@kleverklues.com</p>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">We respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="card !p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--on-surface)] text-sm">Phone</h3>
                    <p className="text-sm text-[var(--primary)] mt-1">+91-XXXX-XXXXXX</p>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">Mon–Sat, 9 AM – 7 PM IST</p>
                  </div>
                </div>
              </div>

              <div className="card !p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--on-surface)] text-sm">WhatsApp</h3>
                    <p className="text-sm text-green-600 mt-1">Chat with us on WhatsApp</p>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">Quick responses, Mon–Sat</p>
                    <a
                      href="https://wa.me/8976234036"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-green-600 hover:underline"
                    >
                      Open WhatsApp <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="card !p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--on-surface)] text-sm">Office</h3>
                    <p className="text-sm text-[var(--on-surface-variant)] mt-1">India (Global Operations)</p>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">Serving clients worldwide</p>
                  </div>
                </div>
              </div>

              <div className="card !p-5 !bg-[var(--error-container)]/30 !border-[var(--error)]/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--error-container)] flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[var(--error)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--on-surface)] text-sm">Crisis Support</h3>
                    <p className="text-xs text-[var(--on-surface-variant)] mt-1">If you&apos;re in crisis, don&apos;t wait.</p>
                    <Link href="/sos" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[var(--error)] hover:underline">
                      Go to SOS Page <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div className="lg:col-span-3">
              <div className="card">
                <h2 className="text-headline-md text-[var(--on-surface)] mb-2">Send Us a Message</h2>
                <p className="text-sm text-[var(--on-surface-variant)] mb-8">Fill out the form and our team will get back to you within 24 hours.</p>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[var(--primary-fixed)] flex items-center justify-center mb-4">
                      <CheckCircle size={32} className="text-[var(--primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-2">Message Sent!</h3>
                    <p className="text-[var(--on-surface-variant)] text-sm">We&apos;ll get back to you within 24 hours. Thank you for reaching out.</p>
                  </div>
                ) : (
                  <form
                    className="space-y-5"
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          required
                          className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Email</label>
                        <input
                          type="email"
                          placeholder="you@email.com"
                          required
                          className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Subject</label>
                      <select className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all text-sm">
                        <option>General Inquiry</option>
                        <option>Support Request</option>
                        <option>Enterprise Solutions</option>
                        <option>Partnership Opportunity</option>
                        <option>Feedback</option>
                        <option>Report a Concern</option>
                        <option>Join as Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Message</label>
                      <textarea
                        rows={5}
                        placeholder="Tell us how we can help..."
                        required
                        className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all text-sm resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <input type="checkbox" required className="mt-1 w-4 h-4 accent-[var(--primary-bright)]" />
                      <label className="text-xs text-[var(--on-surface-variant)]">
                        I agree to the Privacy Policy and consent to KleverKlues&trade; processing my data to respond to my inquiry.
                      </label>
                    </div>

                    <button type="submit" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                      <Send size={16} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Response time */}
              <div className="mt-6 flex items-center gap-3 text-sm text-[var(--on-surface-variant)]">
                <Clock size={16} className="text-[var(--primary-bright)]" />
                Average response time: <strong className="text-[var(--on-surface)]">within 24 hours</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
