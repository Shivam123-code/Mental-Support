"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, CheckCircle, Upload, Shield, User,
  Award, Briefcase, Heart, FileText, Clock, Star, AlertCircle, Loader2, X, File
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

const sessionTypeOptions = [
  "One-on-One Sessions", "Group Sessions", "Workshops",
  "Online Only", "Offline Only", "Both Online & Offline",
];

const languageOptions = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada",
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Other",
];

// ── File Upload Box ──────────────────────────────────────────────────────────
function FileUploadBox({
  label, field, accept, file, onSelect, required
}: {
  label: string;
  field: string;
  accept: string;
  file: File | null;
  onSelect: (f: File | null) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">
        {label}{required && " *"}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all group ${
          file
            ? "border-[var(--primary)] bg-[var(--primary-fixed)]/20"
            : "border-[var(--outline-variant)] hover:border-[var(--primary-bright)]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => onSelect(e.target.files?.[0] || null)}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <File size={16} className="text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--primary)] truncate max-w-[200px]">{file.name}</span>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onSelect(null); if (inputRef.current) inputRef.current.value = ''; }}
              className="ml-1 text-rose-500 hover:text-rose-700"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={20} className="mx-auto mb-2 text-[var(--outline)] group-hover:text-[var(--primary)]" />
            <p className="text-xs font-medium text-[var(--on-surface-variant)]">{label}</p>
            <p className="text-[10px] text-[var(--outline)] mt-0.5">PDF, JPG, PNG — Max 5MB</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ApplyProfessional() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationId, setApplicationId] = useState("");

  // Email validation state
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // File uploads
  const [files, setFiles] = useState<{
    idProof: File | null;
    degreeDocument: File | null;
    licenseDocument: File | null;
    profilePhoto: File | null;
  }>({ idProof: null, degreeDocument: null, licenseDocument: null, profilePhoto: null });

  const setFile = (field: keyof typeof files) => (f: File | null) =>
    setFiles(prev => ({ ...prev, [field]: f }));

  // Form state
  const [form, setForm] = useState({
    fullName: "", category: "", email: "", phone: "", country: "",
    qualification: "", license: "", yearsExp: "", institution: "",
    certName: "", certYear: "",
    specializations: [] as string[], sessionTypes: [] as string[],
    languages: [] as string[], bio: "",
    agreePrivacy: false, agreeConduct: false, agreeCrisis: false,
    agreeChildSafety: false, agreeTerms: false, agreeAI: false,
  });

  const update = (field: string, value: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleMulti = (field: "specializations" | "sessionTypes" | "languages", value: string) =>
    setForm(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });

  // ── Real-time email validation ─────────────────────────────────────────────
  const validateEmail = useCallback(async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address.");
      setEmailValid(false);
      return;
    }
    setEmailChecking(true);
    setEmailError("");
    try {
      const res = await fetch('/api/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailValid(true);
        setEmailError("");
      } else {
        setEmailValid(false);
        setEmailError(data.error || "Invalid email domain.");
      }
    } catch {
      setEmailValid(false);
      setEmailError("Could not verify email. Please check your connection.");
    } finally {
      setEmailChecking(false);
    }
  }, []);

  const canNext = () => {
    if (step === 1) return form.fullName && form.category && form.email && form.phone && emailValid;
    if (step === 2) return form.qualification && form.yearsExp;
    if (step === 3) return form.specializations.length > 0 && form.languages.length > 0;
    if (step === 4) return form.agreePrivacy && form.agreeConduct && form.agreeCrisis && form.agreeChildSafety && form.agreeTerms && form.agreeAI;
    return true;
  };

  // ── Real Submit — multipart/form-data ────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const names = form.fullName.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";

      const fd = new FormData();
      fd.append("firstName", firstName);
      fd.append("lastName", lastName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("dateOfBirth", "");
      fd.append("gender", "");
      fd.append("address", "");
      fd.append("city", "");
      fd.append("state", form.country);
      fd.append("pincode", "");
      fd.append("highestDegree", form.qualification);
      fd.append("fieldOfStudy", form.certName);
      fd.append("institution", form.institution);
      fd.append("graduationYear", form.certYear);
      fd.append("licenseNumber", form.license);
      fd.append("licenseAuthority", "");
      fd.append("licenseExpiry", "");
      fd.append("specialty", form.category);
      fd.append("yearsOfExperience", form.yearsExp);
      fd.append("bio", form.bio);
      fd.append("languages", JSON.stringify(form.languages));
      fd.append("consultationFee", "");
      fd.append("sessionTypes", JSON.stringify(form.sessionTypes));
      fd.append("availability", JSON.stringify(form.specializations));

      if (files.idProof) fd.append("idProof", files.idProof);
      if (files.degreeDocument) fd.append("degreeDocument", files.degreeDocument);
      if (files.licenseDocument) fd.append("licenseDocument", files.licenseDocument);
      if (files.profilePhoto) fd.append("profilePhoto", files.profilePhoto);

      const res = await fetch("/api/apply/professional", { method: "POST", body: fd });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Submission failed");

      setApplicationId(data.data?.applicationId || "");
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[var(--surface)] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
            <div className="w-28 h-28 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
          </div>
          <div className="chip mx-auto mb-4"><Star size={13} /> Application Submitted</div>
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-4">Application Received!</h1>
          <p className="text-body-md text-[var(--on-surface-variant)] mb-2 leading-relaxed">
            Thank you, <strong>{form.fullName}</strong>! Your application is <strong>under review</strong>.
          </p>
          {applicationId && (
            <p className="text-xs text-[var(--outline)] mb-6 font-mono">Ref: {applicationId}</p>
          )}
          <div className="card text-left mb-8 space-y-3 border border-emerald-100 bg-emerald-50/50">
            {[
              { icon: CheckCircle, label: "A confirmation email has been sent to " + form.email },
              { icon: Shield, label: "Identity & credentials are being verified by our team" },
              { icon: Clock, label: "You will receive login credentials via email within 2–3 business days" },
              { icon: Award, label: "Use the credentials from the email to sign in to your Professional Dashboard" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={14} className="text-emerald-600" />
                </div>
                <p className="text-sm text-[var(--on-surface-variant)]">{item.label}</p>
              </div>
            ))}
          </div>
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

                {/* Email with real-time validation */}
                <div className="sm:col-span-2">
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="you@yourcompany.com"
                      value={form.email}
                      onChange={e => { update("email", e.target.value); setEmailValid(false); setEmailError(""); }}
                      onBlur={e => validateEmail(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none transition-all pr-10 ${
                        emailError ? "border-rose-500 focus:ring-rose-200" :
                        emailValid ? "border-emerald-500 focus:ring-emerald-200" :
                        "border-[var(--outline-variant)] focus:border-[var(--primary-bright)] focus:ring-[var(--primary-bright)]"
                      } focus:ring-1`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailChecking && <Loader2 size={16} className="animate-spin text-[var(--outline)]" />}
                      {!emailChecking && emailValid && <CheckCircle size={16} className="text-emerald-500" />}
                      {!emailChecking && emailError && <AlertCircle size={16} className="text-rose-500" />}
                    </div>
                  </div>
                  {emailError && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{emailError}</p>}
                  {emailValid && <p className="text-xs text-emerald-600 mt-1">✓ Valid email domain verified</p>}
                  <p className="text-[11px] text-[var(--on-surface-variant)]/60 mt-1">Login credentials will be sent to this email upon approval. Fake/disposable emails are not accepted.</p>
                </div>

                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Phone Number *</label>
                  <input type="tel" placeholder="+91-XXXXX-XXXXX" value={form.phone}
                    onChange={e => update("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Country / Region</label>
                  <input type="text" placeholder="e.g. India" value={form.country}
                    onChange={e => update("country", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all"
                  />
                </div>
              </div>

              {/* Real File Upload — ID Proof */}
              <FileUploadBox label="Government ID Proof (Aadhaar / Passport / PAN)" field="idProof"
                accept=".pdf,.jpg,.jpeg,.png" file={files.idProof} onSelect={setFile("idProof")} />

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

              {/* Real file uploads */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FileUploadBox label="Degree / Certificate" field="degreeDocument"
                  accept=".pdf,.jpg,.jpeg,.png" file={files.degreeDocument} onSelect={setFile("degreeDocument")} />
                <FileUploadBox label="License / Registration Document" field="licenseDocument"
                  accept=".pdf,.jpg,.jpeg,.png" file={files.licenseDocument} onSelect={setFile("licenseDocument")} />
                <FileUploadBox label="Profile Photo (Optional)" field="profilePhoto"
                  accept=".jpg,.jpeg,.png" file={files.profilePhoto} onSelect={setFile("profilePhoto")} />
              </div>
            </div>
          )}

          {/* ── STEP 3: Specialization ── */}
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
                    <button key={s} type="button" onClick={() => toggleMulti("specializations", s)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.specializations.includes(s)
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary-bright)]"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Session Types *</label>
                <div className="flex flex-wrap gap-2">
                  {sessionTypeOptions.map(s => (
                    <button key={s} type="button" onClick={() => toggleMulti("sessionTypes", s)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.sessionTypes.includes(s)
                          ? "bg-[var(--secondary)] text-white border-[var(--secondary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--secondary-muted)]"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Languages Spoken *</label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map(l => (
                    <button key={l} type="button" onClick={() => toggleMulti("languages", l)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.languages.includes(l)
                          ? "bg-[var(--tertiary)] text-white border-[var(--tertiary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--tertiary-bright)]"
                      }`}>{l}</button>
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

          {/* ── STEP 4: Safety & Ethics ── */}
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
                <p className="text-sm text-[var(--on-surface-variant)]">Please review your application before submitting. Our team will review within 2–3 business days.</p>
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
                  { label: "Uploaded Files", value: [
                    files.idProof && "ID Proof",
                    files.degreeDocument && "Degree",
                    files.licenseDocument && "License",
                    files.profilePhoto && "Photo",
                  ].filter(Boolean).join(", ") || "None" },
                ].map(row => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-[var(--outline-variant)] last:border-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--on-surface-variant)] sm:w-36 flex-shrink-0">{row.label}</span>
                    <span className="text-sm text-[var(--on-surface)]">{row.value || <span className="text-[var(--outline)] italic">Not provided</span>}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--primary-fixed)]/30 rounded-lg">
                <p className="text-xs text-[var(--on-surface-variant)]">
                  By submitting, your application enters our <strong>manual review process</strong>. Upon approval, you will receive your <strong>login credentials via email</strong> to access your Professional Dashboard.
                </p>
              </div>
              {submitError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
                  <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
                  <p className="text-sm text-rose-700">{submitError}</p>
                </div>
              )}
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
            <div className="text-xs text-[var(--on-surface-variant)]">Step {step} of {STEPS.length}</div>
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
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-container)] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Submit Application <CheckCircle size={15} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
