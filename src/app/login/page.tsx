import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Eye, Shield, ArrowRight, CheckCircle } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <div className="w-10 h-10 relative">
              <Image src="/logo.svg" alt="KleverKlues" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-xl font-display font-medium text-[var(--on-surface)]">KleverKlues</span>
          </div>

          <h1 className="text-headline-md text-[var(--on-surface)] mb-2">Welcome back</h1>
          <p className="text-[var(--on-surface-variant)] mb-8">Sign in to access your wellbeing dashboard.</p>

          {/* Form */}
          <form className="space-y-5">
            <div>
              <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                <input type="email" placeholder="you@email.com" className="input-field !border !border-[var(--outline-variant)] !rounded-lg !pl-11 !py-3.5" />
              </div>
            </div>
            <div>
              <label className="text-label-bold text-[var(--on-surface-variant)] uppercase mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]" />
                <input type="password" placeholder="••••••••" className="input-field !border !border-[var(--outline-variant)] !rounded-lg !pl-11 !py-3.5" />
                <Eye size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)] cursor-pointer hover:text-[var(--primary)]" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[var(--on-surface-variant)] cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--outline-variant)]" />
                Remember me
              </label>
              <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary w-full !py-4 flex items-center justify-center gap-2">
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--outline-variant)]" /></div>
            <div className="relative flex justify-center"><span className="bg-[var(--surface)] px-4 text-sm text-[var(--on-surface-variant)]">or continue with</span></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary !py-3 text-sm flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="btn-secondary !py-3 text-sm flex items-center justify-center gap-2">
              <Mail size={16} />
              Email OTP
            </button>
          </div>

          {/* Sign Up */}
          <p className="text-center mt-8 text-sm text-[var(--on-surface-variant)]">
            Don&apos;t have an account? <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">Create one free</Link>
          </p>

          {/* Trust indicator */}
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-[var(--on-surface-variant)]">
            <span className="flex items-center gap-1"><Lock size={11} /> Encrypted</span>
            <span className="flex items-center gap-1"><Shield size={11} /> Private</span>
            <span className="flex items-center gap-1"><CheckCircle size={11} /> DPDP Ready</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-[var(--primary)] items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/8 rounded-full" />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <Image src="/logo.svg" alt="KleverKlues" width={80} height={80} className="object-contain brightness-200" />
          </div>
          <h2 className="text-3xl font-display font-medium text-white mb-4">You&apos;re Not Alone.</h2>
          <p className="text-white/60 max-w-sm mx-auto">Join the world&apos;s most trusted human wellbeing ecosystem. Safe. Private. Meaningful.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Anonymous Mode", "24/7 Support", "Verified Professionals"].map((item) => (
              <span key={item} className="px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
