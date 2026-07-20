import { FormEvent, useState } from "react";
import PrimaryButton from "../shared/PrimaryButton";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

// Pure UI mock (no backend call, no password is ever changed) — same
// "mocked feature" pattern as the SSO signup flow (see components/auth/SsoMock*).
export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "confirm">("email");
  const [email, setEmail] = useState("");

  function handleSendResetLink(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("confirm");
  }

  return (
    <div className="fixed inset-0 bg-inverse-surface/50 flex items-center justify-center z-[60] p-margin-mobile" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-lg w-full max-w-sm p-6 relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-3 right-3 text-on-surface-variant hover:bg-surface-container-low p-1.5 rounded-full transition-colors active:scale-95"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {step === "email" ? (
          <form className="flex flex-col gap-4 pt-2" onSubmit={handleSendResetLink}>
            <h2 className="font-headline-sm text-headline-sm text-on-surface text-center">Reset your password</h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-center">
              Enter your NYU email and we'll send you a link to reset your password.
            </p>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="reset-email">
                NYU Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  id="reset-email"
                  name="reset-email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="NetID@nyu.edu"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>
            <PrimaryButton type="submit">Send Reset Link</PrimaryButton>
          </form>
        ) : (
          <div className="flex flex-col gap-4 pt-2 items-center text-center">
            <span className="material-symbols-outlined text-nyu-violet text-[40px]">mark_email_read</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Check your email</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              A password reset link has been sent to <span className="font-semibold text-on-surface">{email}</span>.
            </p>
            <PrimaryButton onClick={onClose}>OK</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
