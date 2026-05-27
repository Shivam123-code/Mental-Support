import Link from "next/link";
import { Shield, AlertTriangle } from "lucide-react";

export default function SafetyDisclaimer({ variant = "default" }: { variant?: "default" | "crisis" }) {
  if (variant === "crisis") {
    return (
      <div className="bg-[var(--error-container)]/30 border border-[var(--error)]/15 rounded-xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-[var(--error)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--on-surface)] mb-1">
              In immediate danger?
            </p>
            <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
              If you or someone you know is in immediate danger, please call{" "}
              <strong>112</strong> (India Emergency) or go to your nearest emergency room.{" "}
              <Link href="/sos" className="text-[var(--error)] font-medium hover:underline">
                Access SOS support →
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-xl p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Shield size={18} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[var(--on-surface)] mb-1">
            Safety & Clinical Disclaimer
          </p>
          <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
            KleverKlues&trade; provides emotional wellbeing support and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a mental health emergency, please contact your local emergency services or visit our{" "}
            <Link href="/sos" className="text-[var(--primary)] font-medium hover:underline">
              SOS page
            </Link>
            . All professionals on our platform are verified but sessions do not constitute a clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}
