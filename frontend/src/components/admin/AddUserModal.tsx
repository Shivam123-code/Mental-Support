'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, UserPlus, FileSpreadsheet, Upload, Download, CheckCircle2, AlertCircle, SkipForward, Copy, Check } from 'lucide-react';

export interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'USER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'VENDOR';
  onSuccess: () => void;
}

const ORG_TYPES = ['CORPORATE', 'HEALTHCARE', 'SCHOOL', 'UNIVERSITY', 'MANUFACTURING', 'GOVERNMENT'];

const CSV_TEMPLATES: Record<string, string> = {
  USER: 'firstName,lastName,email,password\nJohn,Doe,john@example.com,auto\n',
  PROFESSIONAL: 'firstName,lastName,email,password,specialization,licenseNumber\nJane,Smith,jane@example.com,auto,COUNSELOR,LIC-12345\n',
  ENTERPRISE: 'orgName,contactName,email,password,orgType,employeeCount,city,state\nAcme Corp,John Doe,hr@acme.com,auto,CORPORATE,200,Mumbai,Maharashtra\n',
  VENDOR: 'firstName,lastName,email,password,businessName,serviceType,phone\nRaj,Kumar,raj@vendor.com,auto,RapidCare,First Responder,9876543210\n',
};

function getRoleLabel(role: string) {
  if (role === 'USER') return 'User';
  if (role === 'PROFESSIONAL') return 'Professional';
  if (role === 'ENTERPRISE') return 'Enterprise';
  if (role === 'VENDOR') return 'Vendor';
  return role;
}

export default function AddUserModal({ isOpen, onClose, role, onSuccess }: AddUserModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ email: string; generatedPassword: string | null } | null>(null);
  const [csvResults, setCsvResults] = useState<{
    created: Array<{ email: string; generatedPassword: string | null }>;
    skipped: Array<{ email: string; reason: string }>;
    errors: Array<{ row: number; email: string; error: string }>;
    summary: { total: number; created: number; skipped: number; errors: number };
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Manual form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    passwordMode: 'auto' as 'auto' | 'manual',
    password: '',
    // Professional
    specialization: '',
    licenseNumber: '',
    // Enterprise
    orgName: '',
    orgType: 'CORPORATE',
    employeeCount: '',
    city: '',
    state: '',
    // Vendor
    businessName: '',
    serviceType: '',
    phone: '',
  });

  // CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  function resetAll() {
    setForm({
      firstName: '', lastName: '', email: '', passwordMode: 'auto', password: '',
      specialization: '', licenseNumber: '', orgName: '', orgType: 'CORPORATE',
      employeeCount: '', city: '', state: '', businessName: '', serviceType: '', phone: '',
    });
    setCsvFile(null);
    setSuccessData(null);
    setCsvResults(null);
    setErrorMsg(null);
    setLoading(false);
    setCopied(false);
  }

  function handleClose() {
    resetAll();
    onClose();
  }

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const body: any = {
      role,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.passwordMode === 'auto' ? 'auto' : form.password,
    };

    if (role === 'PROFESSIONAL') {
      body.specialization = form.specialization;
      body.licenseNumber = form.licenseNumber;
    }
    if (role === 'ENTERPRISE') {
      body.orgName = form.orgName;
      body.orgType = form.orgType;
      body.employeeCount = parseInt(form.employeeCount) || undefined;
      body.city = form.city;
      body.state = form.state;
    }
    if (role === 'VENDOR') {
      body.businessName = form.businessName;
      body.serviceType = form.serviceType;
      body.phone = form.phone;
    }

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Failed to create user');
      } else {
        setSuccessData({ email: data.data.user.email, generatedPassword: data.data.generatedPassword });
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCsvUpload() {
    if (!csvFile) return;
    setErrorMsg(null);
    setLoading(true);
    const fd = new FormData();
    fd.append('file', csvFile);
    fd.append('role', role);

    try {
      const res = await fetch('/api/admin/create-user/csv', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Upload failed');
      } else {
        setCsvResults(data.data);
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  function downloadTemplate() {
    const content = CSV_TEMPLATES[role] || CSV_TEMPLATES['USER'];
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kleverklues_${role.toLowerCase()}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith('.csv')) setCsvFile(f);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <UserPlus size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Add {getRoleLabel(role)} Manually</h2>
                  <p className="text-[11px] text-gray-500">Create account & send welcome email</p>
                </div>
              </div>
              <button
                id="add-user-modal-close"
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
              <button
                onClick={() => { setActiveTab('manual'); setErrorMsg(null); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <UserPlus size={13} /> Manual Entry
              </button>
              <button
                onClick={() => { setActiveTab('csv'); setErrorMsg(null); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'csv'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <FileSpreadsheet size={13} /> CSV Upload
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* ── Manual Tab ── */}
              {activeTab === 'manual' && (
                <>
                  {successData ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                        <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-emerald-800">Account Created!</p>
                          <p className="text-xs text-emerald-700 mt-0.5">Welcome email sent to <strong>{successData.email}</strong></p>
                        </div>
                      </div>
                      {successData.generatedPassword && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                          <p className="text-xs font-bold text-amber-800">Generated Password — share securely:</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-gray-900 tracking-wider">
                              {successData.generatedPassword}
                            </code>
                            <button
                              onClick={() => copyToClipboard(successData.generatedPassword!)}
                              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition cursor-pointer flex-shrink-0"
                            >
                              {copied ? <Check size={13} /> : <Copy size={13} />}
                              {copied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-[11px] text-amber-700">This password expires in 24 hours. The user should reset it via the link in their email.</p>
                        </div>
                      )}
                      <button
                        onClick={() => { resetAll(); }}
                        className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                      >
                        Add Another {getRoleLabel(role)}
                      </button>
                    </div>
                  ) : (
                    <form id="add-user-manual-form" onSubmit={handleManualSubmit} className="space-y-4">
                      {/* Common fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>First Name *</label>
                          <input id="add-user-firstName" required value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} className={inputClass} placeholder="John" />
                        </div>
                        <div>
                          <label className={labelClass}>Last Name *</label>
                          <input id="add-user-lastName" required value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} className={inputClass} placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Email Address *</label>
                        <input id="add-user-email" type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} className={inputClass} placeholder="john@example.com" />
                      </div>

                      {/* Password section */}
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <p className={labelClass}>Password</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="passwordMode" value="auto" checked={form.passwordMode === 'auto'} onChange={() => setField('passwordMode', 'auto')} className="accent-indigo-600" />
                            <span className="text-xs font-semibold text-gray-700">Auto-generate</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="passwordMode" value="manual" checked={form.passwordMode === 'manual'} onChange={() => setField('passwordMode', 'manual')} className="accent-indigo-600" />
                            <span className="text-xs font-semibold text-gray-700">Set manually</span>
                          </label>
                        </div>
                        {form.passwordMode === 'manual' && (
                          <input
                            id="add-user-password"
                            type="password"
                            required
                            value={form.password}
                            onChange={(e) => setField('password', e.target.value)}
                            className={inputClass}
                            placeholder="Enter a secure password"
                            minLength={8}
                          />
                        )}
                        {form.passwordMode === 'auto' && (
                          <p className="text-[11px] text-gray-500">A secure password will be auto-generated and emailed to the user.</p>
                        )}
                      </div>

                      {/* PROFESSIONAL fields */}
                      {role === 'PROFESSIONAL' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Specialization</label>
                            <input id="add-user-specialization" value={form.specialization} onChange={(e) => setField('specialization', e.target.value)} className={inputClass} placeholder="e.g. THERAPIST" />
                          </div>
                          <div>
                            <label className={labelClass}>License Number</label>
                            <input id="add-user-licenseNumber" value={form.licenseNumber} onChange={(e) => setField('licenseNumber', e.target.value)} className={inputClass} placeholder="LIC-12345" />
                          </div>
                        </div>
                      )}

                      {/* ENTERPRISE fields */}
                      {role === 'ENTERPRISE' && (
                        <div className="space-y-3">
                          <div>
                            <label className={labelClass}>Organization Name *</label>
                            <input id="add-user-orgName" required value={form.orgName} onChange={(e) => setField('orgName', e.target.value)} className={inputClass} placeholder="Acme Corporation" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Org Type</label>
                              <select id="add-user-orgType" value={form.orgType} onChange={(e) => setField('orgType', e.target.value)} className={inputClass}>
                                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className={labelClass}>Employee Count</label>
                              <input id="add-user-employeeCount" type="number" min={1} value={form.employeeCount} onChange={(e) => setField('employeeCount', e.target.value)} className={inputClass} placeholder="500" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>City</label>
                              <input id="add-user-city" value={form.city} onChange={(e) => setField('city', e.target.value)} className={inputClass} placeholder="Mumbai" />
                            </div>
                            <div>
                              <label className={labelClass}>State</label>
                              <input id="add-user-state" value={form.state} onChange={(e) => setField('state', e.target.value)} className={inputClass} placeholder="Maharashtra" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VENDOR fields */}
                      {role === 'VENDOR' && (
                        <div className="space-y-3">
                          <div>
                            <label className={labelClass}>Business Name</label>
                            <input id="add-user-businessName" value={form.businessName} onChange={(e) => setField('businessName', e.target.value)} className={inputClass} placeholder="RapidCare Services" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Service Type</label>
                              <input id="add-user-serviceType" value={form.serviceType} onChange={(e) => setField('serviceType', e.target.value)} className={inputClass} placeholder="First Responder" />
                            </div>
                            <div>
                              <label className={labelClass}>Phone</label>
                              <input id="add-user-phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
                            </div>
                          </div>
                        </div>
                      )}

                      {errorMsg && (
                        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                          <AlertCircle size={14} className="flex-shrink-0" />
                          {errorMsg}
                        </div>
                      )}

                      <button
                        id="add-user-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <UserPlus size={14} />
                        )}
                        {loading ? 'Creating Account…' : 'Create Account & Send Welcome Email'}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* ── CSV Tab ── */}
              {activeTab === 'csv' && (
                <div className="space-y-4">
                  {/* Download template */}
                  <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-indigo-800">Download CSV Template</p>
                      <p className="text-[11px] text-indigo-600 mt-0.5">Pre-filled with the correct columns for {getRoleLabel(role)} accounts</p>
                    </div>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer flex-shrink-0"
                    >
                      <Download size={13} /> Template
                    </button>
                  </div>

                  {/* Drag & drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                      dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    />
                    <Upload size={28} className="mx-auto mb-3 text-gray-400" />
                    {csvFile ? (
                      <div>
                        <p className="text-sm font-bold text-indigo-700">{csvFile.name}</p>
                        <p className="text-[11px] text-gray-500 mt-1">{(csvFile.size / 1024).toFixed(1)} KB · Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Drop CSV file here or click to browse</p>
                        <p className="text-[11px] text-gray-400 mt-1">Max 500 rows · .csv files only</p>
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <button
                    onClick={handleCsvUpload}
                    disabled={!csvFile || loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <Upload size={14} />
                    )}
                    {loading ? 'Uploading…' : 'Upload & Create Accounts'}
                  </button>

                  {/* Results */}
                  {csvResults && (
                    <div className="space-y-3">
                      {/* Summary badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 size={13} /> {csvResults.summary.created} created
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold">
                          <SkipForward size={13} /> {csvResults.summary.skipped} skipped
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold">
                          <AlertCircle size={13} /> {csvResults.summary.errors} errors
                        </span>
                      </div>

                      {/* Results table */}
                      <div className="border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="max-h-56 overflow-y-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr className="text-gray-500 font-semibold">
                                <th className="px-3 py-2 text-left">Row</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-left">Password</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {csvResults.created.map((r, i) => (
                                <tr key={`c-${i}`} className="bg-emerald-50/40">
                                  <td className="px-3 py-2 text-gray-400">—</td>
                                  <td className="px-3 py-2 font-medium text-gray-800">{r.email}</td>
                                  <td className="px-3 py-2"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">Created</span></td>
                                  <td className="px-3 py-2 font-mono text-gray-700">{r.generatedPassword || '(custom)'}</td>
                                </tr>
                              ))}
                              {csvResults.skipped.map((r, i) => (
                                <tr key={`s-${i}`} className="bg-amber-50/40">
                                  <td className="px-3 py-2 text-gray-400">—</td>
                                  <td className="px-3 py-2 font-medium text-gray-800">{r.email}</td>
                                  <td className="px-3 py-2"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-bold">Skipped</span></td>
                                  <td className="px-3 py-2 text-gray-500">{r.reason}</td>
                                </tr>
                              ))}
                              {csvResults.errors.map((r, i) => (
                                <tr key={`e-${i}`} className="bg-rose-50/40">
                                  <td className="px-3 py-2 text-gray-500">Row {r.row}</td>
                                  <td className="px-3 py-2 font-medium text-gray-800">{r.email}</td>
                                  <td className="px-3 py-2"><span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold">Error</span></td>
                                  <td className="px-3 py-2 text-gray-500 truncate max-w-[120px]">{r.error}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
