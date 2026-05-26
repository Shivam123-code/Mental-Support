"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, CheckCircle, Phone, RefreshCw, AlertCircle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    // Demo User verification
    if (trimmedEmail === "user@kleverklues.com" && trimmedPass === "usersecure123") {
      setIsLoading(true);
      // Simulate network verification lag for a premium feel
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard/user");
      }, 1500);
    } else {
      setErrorMsg("Invalid credentials. Please use the demo user credentials provided below.");
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail("user@kleverklues.com");
    setPassword("usersecure123");
    setErrorMsg("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] flex flex-col lg:flex-row bg-[var(--surface)]">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div className="w-full max-w-md space-y-8 bg-[var(--surface-container-lowest)] p-8 sm:p-10 rounded-2xl border border-[var(--outline-variant)]/60 shadow-ambient">
          
          {/* Logo & Header */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 relative">
                <img src="/logo.jpg" alt="KleverKlues" width={36} height={36} className="object-contain" />
              </div>
              <span className="text-lg font-display font-medium text-[var(--on-surface)]">KleverKlues&trade;</span>
            </div>
            <div>
              <h1 className="text-headline-md text-[var(--on-surface)]">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-xs text-[var(--on-surface-variant)] mt-1">
                {isSignUp ? "Start your wellbeing journey — free & private." : "Sign in to access your wellbeing dashboard."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleUserLoginSubmit}>
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block text-xs">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your name"
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] text-sm placeholder:text-[var(--outline)]/55 focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all disabled:opacity-55"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block text-xs">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] text-sm placeholder:text-[var(--outline)]/55 focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all disabled:opacity-55"
                />
              </div>
            </div>

            <div>
              <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block text-xs">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-11 pr-11 py-3 border border-[var(--outline-variant)] rounded-lg bg-[var(--surface-container-lowest)] text-[var(--on-surface)] text-sm placeholder:text-[var(--outline)]/55 focus:outline-none focus:border-[var(--primary-bright)] focus:ring-1 focus:ring-[var(--primary-bright)] transition-all disabled:opacity-55"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)] hover:text-[var(--primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[var(--on-surface-variant)] cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[var(--outline-variant)] accent-[var(--primary-bright)]" />
                  Remember me
                </label>
                <button type="button" className="text-[var(--primary)] font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Verifying Security Token...
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Helper Box */}
          {!isSignUp && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/15 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Shield size={14} /> Demo User Credentials
              </div>
              <p className="text-[11px] text-[var(--on-surface-variant)] leading-relaxed">
                Use the following sandbox credentials to bypass authentication and audit the User Dashboard:
              </p>
              <div className="text-[11px] font-mono bg-[var(--surface-container-low)] p-2 rounded border border-[var(--outline-variant)]/40 space-y-1">
                <div>Email: <span className="font-semibold text-emerald-600 dark:text-emerald-400">user@kleverklues.com</span></div>
                <div>Pass: <span className="font-semibold text-emerald-600 dark:text-emerald-400">usersecure123</span></div>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                disabled={isLoading}
                className="w-full text-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-wider pt-1 disabled:opacity-50"
              >
                Auto-fill Credentials
              </button>
            </div>
          )}

          {/* Toggle Sign Up / Sign In */}
          <p className="text-center mt-8 text-sm text-[var(--on-surface-variant)]">
            {isSignUp ? (
              <>Already have an account?{" "}
                <button type="button" onClick={() => setIsSignUp(false)} className="text-[var(--primary)] font-semibold hover:underline">Sign In</button>
              </>
            ) : (
              <>Don&apos;t have an account?{" "}
                <button type="button" onClick={() => setIsSignUp(true)} className="text-[var(--primary)] font-semibold hover:underline">Create one free</button>
              </>
            )}
          </p>

          {/* Trust indicator */}
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-[var(--on-surface-variant)]">
            <span className="flex items-center gap-1"><Lock size={11} className="text-[var(--primary)]" /> Encrypted</span>
            <span className="flex items-center gap-1"><Shield size={11} className="text-[var(--primary)]" /> Private</span>
            <span className="flex items-center gap-1"><CheckCircle size={11} className="text-[var(--primary)]" /> DPDP Ready</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual (hidden on mobile/tablet) */}
      <div className="hidden lg:flex flex-1 bg-[var(--primary)] items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/8 rounded-full" />
        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 relative opacity-90">
            <img src="/logo.jpg" alt="KleverKlues" width={80} height={80} className="object-contain w-full h-full" />
          </div>
          <h2 className="text-3xl font-display font-medium text-white mb-4">You&apos;re Not Alone.</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Join the world&apos;s most trusted human wellbeing ecosystem. Safe. Private. Meaningful.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Anonymous Mode", "24/7 Support", "Verified Professionals"].map((item) => (
              <span key={item} className="px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80 border border-white/10">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
