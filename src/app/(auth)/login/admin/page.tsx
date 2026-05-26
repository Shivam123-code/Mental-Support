"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    // Mock verification
    if (trimmedEmail === "admin@kleverklues.com" && trimmedPass === "adminsecure123") {
      setIsLoading(true);
      // Simulate network verification lag for a premium feel
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard/admin");
      }, 1500);
    } else {
      setErrorMsg("Invalid credentials. Please use the demo credentials provided below.");
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail("admin@kleverklues.com");
    setPassword("adminsecure123");
    setErrorMsg("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] flex flex-col lg:flex-row bg-[var(--surface)]">
      
      {/* Left Panel - Secured Admin Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div className="w-full max-w-md space-y-8 bg-[var(--surface-container-lowest)] p-8 sm:p-10 rounded-2xl border border-[var(--outline-variant)]/60 shadow-ambient">
          
          {/* Back navigation */}
          <Link href="/role-selection" className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-semibold hover:gap-2 transition-all">
            <ArrowLeft size={12} /> Back to Role Selection
          </Link>

          {/* Logo & Header */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 relative">
                <img src="/logo.jpg" alt="KleverKlues" width={36} height={36} className="object-contain" />
              </div>
              <span className="text-lg font-display font-medium text-[var(--on-surface)]">KleverKlues&trade;</span>
            </div>
            <div>
              <h1 className="text-headline-md text-[var(--on-surface)] flex items-center gap-2">
                <Shield className="text-indigo-600" size={24} /> Admin Portal
              </h1>
              <p className="text-xs text-[var(--on-surface-variant)] mt-1">
                Enter your administrative credentials to access the console.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleAdminLoginSubmit}>
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block text-xs">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kleverklues.com"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] text-sm placeholder:text-[var(--outline)]/55 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-55"
                />
              </div>
            </div>

            <div>
              <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block text-xs">Security Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full pl-11 pr-11 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] text-sm placeholder:text-[var(--outline)]/55 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-55"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)] hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying Security Token...
                </>
              ) : (
                <>
                  Verify & Enter <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Helper Box */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/15 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
              <Shield size={14} /> Demo Credentials
            </div>
            <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed">
              Use the following sandbox credentials to bypass authentication and audit the Admin Dashboard:
            </p>
            <div className="text-[11px] font-mono bg-[var(--surface-container-low)] p-2 rounded border border-[var(--outline-variant)]/40 space-y-1">
              <div>Email: <span className="font-semibold text-indigo-600 dark:text-indigo-400">admin@kleverklues.com</span></div>
              <div>Pass: <span className="font-semibold text-indigo-600 dark:text-indigo-400">adminsecure123</span></div>
            </div>
            <button
              onClick={handleFillDemoCredentials}
              disabled={isLoading}
              className="w-full text-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider pt-1 disabled:opacity-50"
            >
              Auto-fill Credentials
            </button>
          </div>

        </div>
      </div>

      {/* Right Panel - Secured Visual Info */}
      <div className="hidden lg:flex flex-1 bg-indigo-950 items-center justify-center relative overflow-hidden text-white border-l border-indigo-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/8 rounded-full" />
        
        <div className="relative z-10 text-center px-12 max-w-md space-y-6">
          <Shield size={64} className="mx-auto text-indigo-400 animate-pulse-soft" />
          <h2 className="text-3xl font-display font-medium text-white">Administrative Portal</h2>
          <p className="text-indigo-200/60 text-sm leading-relaxed">
            All administrative actions are monitored and logged. Access is governed under strict ethical AI safety guidelines and local privacy regulations.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {["System Health Logs", "Audit Interventions", "Credential Logs"].map((item) => (
              <span key={item} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-indigo-200/80 border border-white/10">{item}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
