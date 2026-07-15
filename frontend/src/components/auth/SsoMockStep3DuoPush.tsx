import { useEffect, useState } from "react";

type AuthPhase = "waiting" | "success";

export default function SsoMockStep3DuoPush() {
  const [phase, setPhase] = useState<AuthPhase>("waiting");

  // Spinner starts on mount (no send button) and auto-completes after ~4s, per PRD 4.1 / TRD 5.
  // Cancellable via the cleanup function, per TRD 5 technical notes.
  useEffect(() => {
    const timer = setTimeout(() => setPhase("success"), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-nyu-violet min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-margin-mobile md:px-margin-desktop font-body-lg text-body-lg text-on-surface">
      {/* Background Watermark */}
      <div className="absolute inset-0 bg-watermark pointer-events-none z-0" />

      {/* Main Authentication Card */}
      <main className="bg-surface-container-lowest w-full max-w-[420px] rounded-xl border border-secondary-container shadow-sm relative z-10 flex flex-col pt-stack-lg pb-stack-lg px-stack-lg md:px-8">
        {/* Header / Logo */}
        <header className="flex items-center gap-2 mb-stack-lg w-full">
          <span className="material-symbols-outlined text-nyu-violet text-[28px] [font-variation-settings:'FILL'_1]">
            local_fire_department
          </span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">NYU</span>
          <div className="h-6 w-px bg-outline-variant mx-1" />
          <span className="font-label-caps text-label-caps text-on-surface-variant">SSO Login</span>
        </header>

        {/* Content Area */}
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-stack-sm w-full">Duo Push Confirmation</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-1 w-full max-w-[300px]">
            Approve the notification to verify your identity.
          </p>
          {/* Fixed mock device identifier, per PRD 4.1 */}
          <p className="font-label-sm text-label-sm text-secondary mb-stack-lg w-full">Sent to 'iOS' (••-••-••••-5937)</p>

          {/* Illustration & Animation State Container */}
          <div className="flex flex-col items-center w-full min-h-[220px]">
            {phase === "waiting" && (
              <div className="flex flex-col items-center w-full transition-opacity duration-300">
                {/* Phone Illustration */}
                <div className="relative w-20 h-40 border-4 border-outline rounded-xl mb-stack-md flex flex-col items-center pt-3 px-1 bg-surface-container-lowest overflow-hidden shadow-sm animate-pulse-glow">
                  {/* Camera Notch */}
                  <div className="w-8 h-1 bg-outline rounded-full mb-3" />
                  {/* Notification Bubble */}
                  <div className="w-full bg-surface-container-high rounded p-1.5 flex items-start gap-1 border border-outline-variant shadow-sm relative z-10">
                    <div className="bg-nyu-violet rounded-sm p-0.5 mt-0.5 flex-shrink-0">
                      <span className="material-symbols-outlined text-on-primary text-[10px] [font-variation-settings:'FILL'_1]">
                        security
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="h-1 bg-outline-variant w-3/4 rounded" />
                      <div className="h-1 bg-outline-variant w-1/2 rounded" />
                    </div>
                  </div>
                </div>
                {/* Spinner */}
                <div className="flex items-center gap-3">
                  <svg className="animate-spin w-5 h-5 text-nyu-violet" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="font-body-md text-body-md text-on-surface-variant">Waiting for approval...</span>
                </div>
              </div>
            )}

            {phase === "success" && (
              <div className="flex flex-col items-center justify-center h-full w-full opacity-100 transition-opacity duration-500 pt-stack-md">
                <div className="w-16 h-16 bg-[#008542] rounded-full flex items-center justify-center mb-stack-md shadow-sm">
                  <span className="material-symbols-outlined text-on-primary text-[32px] [font-variation-settings:'FILL'_1]">
                    check
                  </span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Success</h2>
                {/* TODO: wire to useSsoMockFlow — on success, advance to signup screen with isVerified = true */}
                <p className="font-body-md text-body-md text-on-surface-variant">Logging you in...</p>
              </div>
            )}
          </div>
        </div>

        {/* Inner Links */}
        <div className="mt-stack-lg w-full flex justify-center border-t border-secondary-container pt-stack-md">
          <a className="font-label-sm text-label-sm text-nyu-violet hover:text-primary transition-colors cursor-pointer font-medium" href="#">
            Other options
          </a>
        </div>
      </main>

      {/* Outer Help Link */}
      <div className="mt-stack-md relative z-10">
        <a className="font-body-md text-body-md text-primary-fixed hover:text-white transition-colors cursor-pointer" href="#">
          Need help?
        </a>
      </div>
    </div>
  );
}
