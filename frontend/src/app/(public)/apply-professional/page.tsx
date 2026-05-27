"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, CheckCircle, Upload, Shield, User,
  Award, Briefcase, Heart, FileText, Clock, Star
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Identity Verification", icon: User },
  { id: 2, label: "Qualification Upload", icon: Award },
  { id: 3, label: "Specialization", icon: Briefcase },
  { id: 4, label: "Safety & Ethics", icon: Shield },
  { id: 5, label: "Review & Submit", icon: FileText },
];

const professionalCategories = [
  "Counsellor", "Psychologist", "Clinical Psychologist",
  "Coach / Life Coach", "Mentor", "Wellness Expert",
  "EQ Trainer", "Therapist", "Social Worker", "Other",
];

const specializationOptions = [
  "Anxiety & Stress", "Burnout Recovery", "Relationship Counselling",
  "Student Wellbeing", "Parenting Guidance", "Career & Work-Life",
  "Trauma Recovery", "Grief & Loss", "Sleep & Rest", "Addiction Support",
  "Child & Adolescent", "Corporate Wellness", "Leadership Coaching",
  "Crisis Intervention", "Emotional Intelligence",
];

const sessionTypes = [
  "One-on-One Sessions", "Group Sessions", "Workshops",
  "Online Only", "Offline Only", "Both Online & Offline",
];

const languages = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada",
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Other",
];

export default function ApplyProfessional() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    // Step 1
    fullName: "", category: "", email: "", phone: "", country: "", password: "",
    // Step 2
    qualification: "", license: "", yearsExp: "", institution: "",
    certName: "", certYear: "",
    // Step 3
    specializations: [] as string[], sessionTypes: [] as string[],
    languages: [] as string[], bio: "",
    // Step 4
    agreePrivacy: false, agreeConduct: false, agreeCrisis: false,
    agreeChildSafety: false, agreeTerms: false, agreeAI: false,
  });

  const update = (field: string, value: string | boolean | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field: "specializations" | "sessionTypes" | "languages", value: string) => {
    setForm(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const canNext = () => {
    if (step === 1) return form.fullName && form.category && form.email && form.phone && form.password && form.password.length >= 8;
    if (step === 2) return form.qualification && form.yearsExp;
    if (step === 3) return form.specializations.length > 0 && form.languages.length > 0;
    if (step === 4) return form.agreePrivacy && form.agreeConduct && form.agreeCrisis && form.agreeChildSafety && form.agreeTerms && form.agreeAI;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const names = form.fullName.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName,
          lastName,
          role: 'PROFESSIONAL',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[var(--surface)] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          {/* Calming animation */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-[var(--primary-bright)]/10 animate-ping opacity-40" />
            <div className="w-28 h-28 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center">
              <Clock size={48} className="text-[var(--primary)]" />
            </div>
          </div>
          <div className="chip mx-auto mb-4"><Star size={13} /> Under Review</div>
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-body-md text-[var(--on-surface-variant)] mb-6 leading-relaxed">
            Thank you, <strong>{form.fullName}</strong>. Your professional application is now <strong>under review</strong> by our verification team.
          </p>
          <div className="card text-left mb-8 space-y-3">
            {[
              { icon: User, label: "Identity & credentials are being verified" },
              { icon: Shield, label: "Background and ethics review in progress" },
              { icon: CheckCircle, label: "You will be notified via email within 5–7 business days" },
              { icon: Award, label: "Once approved, you'll receive your Verification Badge" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--primary-fixed)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={14} className="text-[var(--primary)]" />
                </div>
                <p className="text-sm text-[var(--on-surface-variant)]">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--on-surface-variant)]/60 mb-6 italic">
            &ldquo;Every professional on KleverKlues™ is verified for your safety and trust.&rdquo;
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Back to Home <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--surface-container-lowest)]">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--outline-variant)] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="chip mb-3"><Heart size={13} /> Professional Application</div>
          <h1 className="text-headline-md text-[var(--on-surface)]">Apply as a Professional</h1>
          <p className="text-sm text-[var(--on-surface-variant)] mt-1">
            Join KleverKlues™ — The World&apos;s Most Trusted Human Wellbeing Ecosystem
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-[var(--surface)] border-b border-[var(--outline-variant)] px-4 py-5 overflow-x-auto">
        <div className="max-w-3xl mx-auto flex items-center gap-0 min-w-max sm:min-w-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step > s.id ? "bg-[var(--primary)] text-white" :
                  step === s.id ? "bg-[var(--primary-bright)] text-white shadow-lg" :
                  "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                }`}>
                  {step > s.id ? <CheckCircle size={16} /> : <s.icon size={16} />}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${
                  step >= s.id ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]/60"
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-10 sm:w-16 mx-1 transition-all duration-300 ${step > s.id ? "bg-[var(--primary)]" : "bg-[var(--outline-variant)]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="card">

          {/* ── STEP 1: Identity Verification ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Identity Verification</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  We verify every professional&apos;s identity to ensure trust and safety for all users.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Full Name *</label>
                  <input type="text" placeholder="Your legal full name" value={form.fullName}
                    onChange={e => update("fullName", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Professional Category *</label>
                  <select value={form.category} onChange={e => update("category", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all">
                    <option value="">Select category</option>
                    {professionalCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Email Address *</label>
                  <input type="email" placeholder="you@email.com" value={form.email}
                    onChange={e => update("email", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Phone Number *</label>
                  <input type="tel" placeholder="+91-XXXXX-XXXXX" value={form.phone}
                    onChange={e => update("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Create Password * (min 8 chars)</label>
                  <input type="password" placeholder="Choose a secure password" value={form.password}
                    onChange={e => update("password", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Country / Region</label>
                  <input type="text" placeholder="e.g. India" value={form.country}
                    onChange={e => update("country", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all"
                  />
                </div>
              </div>
              {/* ID Upload */}
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Government ID Proof</label>
                <div className="border-2 border-dashed border-[var(--outline-variant)] rounded-xl p-8 text-center hover:border-[var(--primary-bright)] transition-colors cursor-pointer group">
                  <Upload size={28} className="mx-auto mb-3 text-[var(--outline)] group-hover:text-[var(--primary)]" />
                  <p className="text-sm font-medium text-[var(--on-surface-variant)]">Click to upload Aadhaar / Passport / PAN</p>
                  <p className="text-xs text-[var(--outline)] mt-1">PNG, JPG, PDF — Max 5MB</p>
                </div>
              </div>
              <div className="p-4 bg-[var(--primary-fixed)]/30 rounded-lg flex gap-3">
                <Shield size={16} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--on-surface-variant)]">Your identity documents are encrypted and used only for verification. They are never shared with users.</p>
              </div>
            </div>
          )}

          {/* ── STEP 2: Qualification Upload ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Qualification & Experience</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">Upload your credentials and share your professional background.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Highest Qualification *</label>
                  <input type="text" placeholder="e.g. M.Sc. Clinical Psychology" value={form.qualification}
                    onChange={e => update("qualification", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Years of Experience *</label>
                  <select value={form.yearsExp} onChange={e => update("yearsExp", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary-bright)] transition-all">
                    <option value="">Select</option>
                    {["Less than 1 year", "1–2 years", "2–5 years", "5–10 years", "10+ years"].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">License / Registration No.</label>
                  <input type="text" placeholder="RCI / BCI / Other (if applicable)" value={form.license}
                    onChange={e => update("license", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Institution / University</label>
                  <input type="text" placeholder="Where did you study?" value={form.institution}
                    onChange={e => update("institution", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Primary Certification</label>
                  <input type="text" placeholder="e.g. ICF Coaching Certification" value={form.certName}
                    onChange={e => update("certName", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Certification Year</label>
                  <input type="text" placeholder="e.g. 2021" value={form.certYear}
                    onChange={e => update("certYear", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] transition-all"
                  />
                </div>
              </div>
              {/* Upload Area */}
              <div className="grid sm:grid-cols-2 gap-4">
                {["Degree / Certificate", "License / Registration", "Training Certificates", "Portfolio (Optional)"].map(doc => (
                  <div key={doc} className="border-2 border-dashed border-[var(--outline-variant)] rounded-xl p-5 text-center hover:border-[var(--primary-bright)] transition-colors cursor-pointer group">
                    <Upload size={20} className="mx-auto mb-2 text-[var(--outline)] group-hover:text-[var(--primary)]" />
                    <p className="text-xs font-medium text-[var(--on-surface-variant)]">{doc}</p>
                    <p className="text-[10px] text-[var(--outline)] mt-0.5">PDF, JPG, PNG</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Specialization Selection ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Specialization & Profile</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">Tell us what you specialize in so we can match you with the right people.</p>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Areas of Specialization * <span className="text-xs normal-case font-normal">(Select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {specializationOptions.map(s => (
                    <button key={s} type="button"
                      onClick={() => toggleMulti("specializations", s)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.specializations.includes(s)
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary-bright)]"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Session Types *</label>
                <div className="flex flex-wrap gap-2">
                  {sessionTypes.map(s => (
                    <button key={s} type="button"
                      onClick={() => toggleMulti("sessionTypes", s)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.sessionTypes.includes(s)
                          ? "bg-[var(--secondary)] text-white border-[var(--secondary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--secondary-muted)]"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Languages Spoken *</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map(l => (
                    <button key={l} type="button"
                      onClick={() => toggleMulti("languages", l)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.languages.includes(l)
                          ? "bg-[var(--tertiary)] text-white border-[var(--tertiary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--tertiary-bright)]"
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Professional Bio</label>
                <textarea rows={4} placeholder="Tell users about yourself — your approach, values, and what you help people with..."
                  value={form.bio} onChange={e => update("bio", e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Safety & Ethics Agreement ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Safety & Ethics Agreement</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  KleverKlues™ is built on trust. Every professional must uphold our ethical standards to protect the community.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { key: "agreePrivacy", title: "Privacy & Confidentiality Policy", desc: "I will protect user privacy and maintain strict confidentiality of all sessions and personal information." },
                  { key: "agreeConduct", title: "Professional Conduct Standards", desc: "I commit to ethical, non-judgmental, empathetic, and respectful communication at all times." },
                  { key: "agreeCrisis", title: "Crisis Escalation Protocol", desc: "I will follow platform protocols for crisis situations and escalate immediately when user safety is at risk." },
                  { key: "agreeChildSafety", title: "Child Safety Compliance", desc: "I will strictly follow child safety guidelines and report any concerns involving minors immediately." },
                  { key: "agreeAI", title: "Ethical AI Policy", desc: "I understand that AI assists but never replaces human judgment. I will use AI tools responsibly." },
                  { key: "agreeTerms", title: "Platform Terms & Non-Exploitative Practices", desc: "I agree to KleverKlues™ terms of service and commit to not using the platform for exploitative monetization." },
                ].map(item => (
                  <label key={item.key} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    form[item.key as keyof typeof form]
                      ? "border-[var(--primary)] bg-[var(--primary-fixed)]/20"
                      : "border-[var(--outline-variant)] hover:border-[var(--primary-fixed-dim)]"
                  }`}>
                    <input type="checkbox"
                      checked={!!form[item.key as keyof typeof form]}
                      onChange={e => update(item.key, e.target.checked)}
                      className="mt-1 w-4 h-4 flex-shrink-0 accent-[var(--primary)]"
                    />
                    <div>
                      <p className="font-semibold text-sm text-[var(--on-surface)]">{item.title}</p>
                      <p className="text-xs text-[var(--on-surface-variant)] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="p-4 bg-[var(--tertiary-fixed)]/40 rounded-lg flex gap-3">
                <Heart size={16} className="text-[var(--tertiary)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--on-surface-variant)] italic">
                  &ldquo;We believe emotional support is sacred. Every professional on KleverKlues™ is held to the highest standards of human care.&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 5: Review & Submit ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Review & Submit</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">Please review your application before submitting. Our team will review it within 5–7 business days.</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: form.fullName },
                  { label: "Category", value: form.category },
                  { label: "Email", value: form.email },
                  { label: "Phone", value: form.phone },
                  { label: "Qualification", value: form.qualification },
                  { label: "Experience", value: form.yearsExp },
                  { label: "Specializations", value: form.specializations.join(", ") || "—" },
                  { label: "Languages", value: form.languages.join(", ") || "—" },
                  { label: "Session Types", value: form.sessionTypes.join(", ") || "—" },
                ].map(row => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-[var(--outline-variant)] last:border-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--on-surface-variant)] sm:w-36 flex-shrink-0">{row.label}</span>
                    <span className="text-sm text-[var(--on-surface)]">{row.value || <span className="text-[var(--outline)] italic">Not provided</span>}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--primary-fixed)]/30 rounded-lg">
                <p className="text-xs text-[var(--on-surface-variant)]">
                  By submitting, your application enters our <strong>manual review process</strong>. You will receive an email notification once a decision is made. Verified professionals receive the <strong>KleverKlues™ Verification Badge</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--outline-variant)]">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-3 border border-[var(--outline-variant)] rounded-lg text-sm font-medium text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft size={15} /> Previous
            </button>
            <div className="text-xs text-[var(--on-surface-variant)]">
              Step {step} of {STEPS.length}
            </div>
            {step < STEPS.length ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-container)] transition-all shadow-lg"
              >
                Submit Application <CheckCircle size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
