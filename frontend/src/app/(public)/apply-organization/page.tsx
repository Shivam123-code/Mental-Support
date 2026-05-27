"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, CheckCircle, Upload, Shield,
  Building2, Users, FileText, BarChart3, Clock, Star, Briefcase
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Business Verification", icon: Building2 },
  { id: 2, label: "Representative", icon: Users },
  { id: 3, label: "Needs Assessment", icon: BarChart3 },
  { id: 4, label: "Compliance", icon: Shield },
  { id: 5, label: "Review & Submit", icon: FileText },
];

const industries = [
  "Corporate / Business", "Healthcare", "Education / School",
  "University / College", "Government / Public Sector", "Manufacturing",
  "Logistics / Supply Chain", "Armed Forces", "NGO / Non-Profit",
  "Startup / Tech", "Wellness Institution", "Other",
];

const employeeRanges = [
  "1–50", "51–200", "201–500", "501–1000", "1001–5000", "5000+",
];

const wellbeingGoals = [
  "Reduce Employee Burnout", "Improve Work-Life Balance", "Mental Health Support",
  "Stress Management", "Leadership Emotional Resilience", "Prevent Absenteeism",
  "Improve Team Engagement", "Student Wellbeing", "Crisis Intervention",
  "Workforce Productivity", "Anonymous Support Access", "Wellbeing Analytics",
];

const interestedServices = [
  "Employee Assistance Program (EAP)", "Burnout Risk Analytics",
  "Wellbeing Dashboards", "Leadership Coaching", "Anonymous Emotional Support",
  "Workshops & Group Programs", "1-on-1 Professional Sessions",
  "Mental Health Assessments", "Crisis Response System",
];

export default function ApplyOrganization() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    // Step 1 - Business
    orgName: "", industry: "", website: "", regNumber: "",
    country: "", employeeCount: "",
    // Step 2 - Representative
    repName: "", repEmail: "", repPhone: "", repDesignation: "",
    // Step 3 - Needs
    goals: [] as string[], services: [] as string[], challenges: "",
    // Step 4 - Compliance
    agreePrivacy: false, agreeEthical: false, agreeConsent: false,
    agreeConfidential: false, agreeTerms: false,
  });

  const update = (field: string, value: string | boolean | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field: "goals" | "services", value: string) => {
    setForm(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const canNext = () => {
    if (step === 1) return form.orgName && form.industry && form.employeeCount;
    if (step === 2) return form.repName && form.repEmail && form.repPhone && form.repDesignation;
    if (step === 3) return form.goals.length > 0 && form.services.length > 0;
    if (step === 4) return form.agreePrivacy && form.agreeEthical && form.agreeConsent && form.agreeConfidential && form.agreeTerms;
    return true;
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[var(--surface)] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-[var(--secondary-muted)]/10 animate-ping opacity-40" />
            <div className="w-28 h-28 rounded-full bg-[var(--secondary-fixed)] flex items-center justify-center">
              <Clock size={48} className="text-[var(--secondary)]" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--secondary-fixed)] text-[var(--secondary)] text-sm font-semibold mb-4">
            <Star size={13} /> Enterprise Application Received
          </div>
          <h1 className="text-headline-lg text-[var(--on-surface)] mb-4">
            Application Submitted!
          </h1>
          <p className="text-body-md text-[var(--on-surface-variant)] mb-6 leading-relaxed">
            Thank you, <strong>{form.repName}</strong> from <strong>{form.orgName}</strong>. Your enterprise application is now under review.
          </p>
          <div className="card text-left mb-8 space-y-3">
            {[
              { icon: Building2, label: "Business verification is in progress" },
              { icon: Shield, label: "Compliance and ethics review underway" },
              { icon: Users, label: "Representative credentials being verified" },
              { icon: CheckCircle, label: "You'll hear from us within 5–7 business days" },
              { icon: BarChart3, label: "Upon approval, your Enterprise Dashboard will be activated" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--secondary-fixed)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={14} className="text-[var(--secondary)]" />
                </div>
                <p className="text-sm text-[var(--on-surface-variant)]">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--on-surface-variant)]/60 mb-6 italic">
            &ldquo;Revenue should never compromise emotional trust.&rdquo; — KleverKlues™ Manifesto
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
      <div className="bg-[var(--inverse-surface)] text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[var(--primary-fixed-dim)] text-sm font-medium mb-3">
            <Building2 size={13} /> Enterprise Application
          </div>
          <h1 className="text-headline-md text-white">Apply as an Organization</h1>
          <p className="text-sm text-white/60 mt-1">
            Build emotionally resilient teams with KleverKlues™ Enterprise
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
                  step > s.id ? "bg-[var(--secondary)] text-white" :
                  step === s.id ? "bg-[var(--secondary-muted)] text-white shadow-lg" :
                  "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                }`}>
                  {step > s.id ? <CheckCircle size={16} /> : <s.icon size={16} />}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${
                  step >= s.id ? "text-[var(--secondary)]" : "text-[var(--on-surface-variant)]/60"
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-10 sm:w-14 mx-1 transition-all duration-300 ${step > s.id ? "bg-[var(--secondary)]" : "bg-[var(--outline-variant)]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="card">

          {/* ── STEP 1: Business Verification ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Business Verification</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">Provide your organization&apos;s official details for verification.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Organization Name *</label>
                  <input type="text" placeholder="Registered organization name" value={form.orgName}
                    onChange={e => update("orgName", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] focus:ring-1 focus:ring-[var(--secondary-muted)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Industry / Sector *</label>
                  <select value={form.industry} onChange={e => update("industry", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all">
                    <option value="">Select sector</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Employee / Member Count *</label>
                  <select value={form.employeeCount} onChange={e => update("employeeCount", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all">
                    <option value="">Select range</option>
                    {employeeRanges.map(r => <option key={r} value={r}>{r} employees</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Organization Website</label>
                  <input type="url" placeholder="https://yourcompany.com" value={form.website}
                    onChange={e => update("website", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Registration / CIN No.</label>
                  <input type="text" placeholder="Business registration number" value={form.regNumber}
                    onChange={e => update("regNumber", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Country / Region</label>
                  <input type="text" placeholder="e.g. India" value={form.country}
                    onChange={e => update("country", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all"
                  />
                </div>
              </div>
              {/* Document Upload */}
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Verification Documents</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {["Registration Certificate", "Business Proof / GST", "Authorization Letter", "Tax / Business ID"].map(doc => (
                    <div key={doc} className="border-2 border-dashed border-[var(--outline-variant)] rounded-xl p-4 text-center hover:border-[var(--secondary-muted)] transition-colors cursor-pointer group">
                      <Upload size={18} className="mx-auto mb-2 text-[var(--outline)] group-hover:text-[var(--secondary)]" />
                      <p className="text-xs font-medium text-[var(--on-surface-variant)]">{doc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Representative Verification ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Authorized Representative</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">Provide details of the person authorized to represent your organization.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Full Name *</label>
                  <input type="text" placeholder="Representative's full name" value={form.repName}
                    onChange={e => update("repName", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Designation *</label>
                  <input type="text" placeholder="e.g. HR Director, CEO, Wellness Lead" value={form.repDesignation}
                    onChange={e => update("repDesignation", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Official Email *</label>
                  <input type="email" placeholder="work@yourcompany.com" value={form.repEmail}
                    onChange={e => update("repEmail", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Phone Number *</label>
                  <input type="tel" placeholder="+91-XXXXX-XXXXX" value={form.repPhone}
                    onChange={e => update("repPhone", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all"
                  />
                </div>
              </div>
              <div className="border-2 border-dashed border-[var(--outline-variant)] rounded-xl p-6 text-center hover:border-[var(--secondary-muted)] transition-colors cursor-pointer group">
                <Upload size={24} className="mx-auto mb-2 text-[var(--outline)] group-hover:text-[var(--secondary)]" />
                <p className="text-sm font-medium text-[var(--on-surface-variant)]">Representative ID Proof</p>
                <p className="text-xs text-[var(--outline)] mt-1">Government issued photo ID — PNG, JPG, PDF</p>
              </div>
              <div className="p-4 bg-[var(--secondary-fixed)]/40 rounded-lg flex gap-3">
                <Shield size={16} className="text-[var(--secondary)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--on-surface-variant)]">The representative must be an authorized signatory or HR/Wellness head of the organization.</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Needs Assessment ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Wellbeing Needs Assessment</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">Help us understand your organization&apos;s wellbeing goals so we can tailor the right solution.</p>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Wellbeing Goals * <span className="normal-case font-normal text-xs">(Select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {wellbeingGoals.map(g => (
                    <button key={g} type="button"
                      onClick={() => toggleMulti("goals", g)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.goals.includes(g)
                          ? "bg-[var(--secondary)] text-white border-[var(--secondary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--secondary-muted)]"
                      }`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-3">Services Interested In * <span className="normal-case font-normal text-xs">(Select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {interestedServices.map(s => (
                    <button key={s} type="button"
                      onClick={() => toggleMulti("services", s)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        form.services.includes(s)
                          ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                          : "bg-transparent text-[var(--on-surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary-bright)]"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-label-bold text-[var(--on-surface-variant)] uppercase mb-2">Current Challenges <span className="normal-case font-normal">(Optional)</span></label>
                <textarea rows={4} placeholder="Describe the main wellbeing challenges your employees / members face currently..."
                  value={form.challenges} onChange={e => update("challenges", e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface)] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-muted)] transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Compliance Review ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Compliance & Ethics Agreement</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  KleverKlues™ ensures that wellbeing data is never misused. Organizations must commit to ethical and responsible usage.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { key: "agreePrivacy", title: "Privacy & Data Compliance", desc: "We will comply with DPDP and applicable data protection laws. Employee wellbeing data will never be used for performance management, punitive decisions, or unauthorized purposes." },
                  { key: "agreeEthical", title: "Ethical Wellbeing Practices", desc: "We commit to using KleverKlues™ only for genuine employee wellbeing — never for monitoring, surveillance, or exploitative analytics." },
                  { key: "agreeConsent", title: "Consent-Based Participation", desc: "All employee participation will be voluntary and consent-based. We will not mandate or coerce use of the platform." },
                  { key: "agreeConfidential", title: "Employee Confidentiality", desc: "We acknowledge that individual employee session data is strictly confidential and will never be accessed or requested by our organization." },
                  { key: "agreeTerms", title: "Platform Terms & Enterprise Agreement", desc: "We agree to KleverKlues™ enterprise terms of service, usage policies, and crisis response cooperation requirements." },
                ].map(item => (
                  <label key={item.key} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    form[item.key as keyof typeof form]
                      ? "border-[var(--secondary)] bg-[var(--secondary-fixed)]/30"
                      : "border-[var(--outline-variant)] hover:border-[var(--secondary-fixed-dim)]"
                  }`}>
                    <input type="checkbox"
                      checked={!!form[item.key as keyof typeof form]}
                      onChange={e => update(item.key, e.target.checked)}
                      className="mt-1 w-4 h-4 flex-shrink-0 accent-[var(--secondary)]"
                    />
                    <div>
                      <p className="font-semibold text-sm text-[var(--on-surface)]">{item.title}</p>
                      <p className="text-xs text-[var(--on-surface-variant)] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="p-4 bg-[var(--tertiary-fixed)]/40 rounded-lg flex gap-3">
                <Briefcase size={16} className="text-[var(--tertiary)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--on-surface-variant)] italic">
                  &ldquo;We hold organizations to the same ethical standards as our professionals. Trust is non-negotiable.&rdquo; — KleverKlues™
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 5: Review & Submit ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-headline-md text-[var(--on-surface)] mb-1">Review & Submit</h2>
                <p className="text-sm text-[var(--on-surface-variant)]">Review your application details before submitting for enterprise approval.</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Organization", value: form.orgName },
                  { label: "Industry", value: form.industry },
                  { label: "Team Size", value: form.employeeCount ? `${form.employeeCount} employees` : "" },
                  { label: "Website", value: form.website },
                  { label: "Representative", value: form.repName },
                  { label: "Designation", value: form.repDesignation },
                  { label: "Official Email", value: form.repEmail },
                  { label: "Wellbeing Goals", value: form.goals.join(", ") || "—" },
                  { label: "Services Requested", value: form.services.join(", ") || "—" },
                ].map(row => (
                  <div key={row.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-[var(--outline-variant)] last:border-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--on-surface-variant)] sm:w-36 flex-shrink-0">{row.label}</span>
                    <span className="text-sm text-[var(--on-surface)]">{row.value || <span className="text-[var(--outline)] italic">Not provided</span>}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-[var(--secondary-fixed)]/30 rounded-lg">
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Your application will go through <strong>Business Verification → Representative Check → Compliance Review → Enterprise Approval</strong>. Upon approval, your organization&apos;s <strong>Enterprise Dashboard</strong> will be activated with full access to selected services.
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
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white font-semibold rounded-lg hover:bg-[var(--on-secondary-container)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white font-semibold rounded-lg hover:bg-[var(--on-secondary-container)] transition-all shadow-lg"
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
