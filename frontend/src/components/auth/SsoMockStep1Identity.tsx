/**
 * No Stitch source file exists for this screen (see documents/vionest/ui/ split summary).
 * Built from PRD 4.1 / TRD 5 description, matching the card + watermark visual
 * language established in SsoMockStep2Password.tsx and SsoMockStep3DuoPush.tsx.
 */
export default function SsoMockStep1Identity() {
  return (
    <div className="bg-nyu-violet min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-margin-mobile md:px-margin-desktop font-body-lg text-body-lg text-on-surface">
      {/* Background Watermark */}
      <div className="absolute inset-0 bg-watermark pointer-events-none z-0" />

      {/* Main Authentication Card */}
      <main className="bg-surface-container-lowest w-full max-w-[440px] rounded-xl border border-secondary-container shadow-sm relative z-10 flex flex-col pt-stack-lg pb-stack-lg px-stack-lg md:px-8">
        {/* Header / Logo */}
        <header className="flex items-center gap-2 mb-stack-lg w-full">
          <span className="material-symbols-outlined text-nyu-violet text-[28px] [font-variation-settings:'FILL'_1]">
            local_fire_department
          </span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">NYU</span>
          <div className="h-6 w-px bg-outline-variant mx-1" />
          <span className="font-label-caps text-label-caps text-on-surface-variant">SSO Login</span>
        </header>

        {/* Entered Email */}
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-sm w-full">
          {/* TODO: replace with signup form email value (NetID@nyu.edu) */}
          tk2846@nyu.edu
        </p>

        {/* Heading */}
        <h1 className="font-headline-md text-headline-md text-on-surface mb-stack-sm w-full">Confirm your identity</h1>

        {/* Notice */}
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg w-full">
          Approved via MFA (Duo) — you will be redirected to complete sign-in.
        </p>

        {/* Continue Affordance */}
        {/* TODO: wire to useSsoMockFlow — advances step1 -> step2 (auto-advance is also acceptable per TRD 5) */}
        <button
          className="w-full bg-nyu-violet text-on-primary py-3 rounded-lg font-headline-sm text-headline-sm hover:opacity-90 transition-opacity mb-stack-lg"
          type="button"
        >
          Continue
        </button>

        {/* Static Warning / Help Block (identical content to SsoMockStep2Password, per PRD 4.1) */}
        <div className="text-on-surface font-body-md text-[13px] flex flex-col gap-4 leading-relaxed border-t border-secondary-container pt-stack-md">
          <p className="font-bold">ATTENTION: Do not use your personal email.</p>
          <p className="font-bold">
            Sign in with your NetID followed by @nyu.edu
            <br />
            (NetID@nyu.edu), then your NYU password.
            <br />
            <a className="text-nyu-violet hover:underline font-normal" href="#">
              Need Help?
            </a>
          </p>
          <p>
            <a className="text-nyu-violet hover:underline" href="#">
              Review troubleshooting tips
            </a>
            , including{" "}
            <a className="text-nyu-violet hover:underline" href="#">
              how to trust this is the real NYU Login.
            </a>
          </p>
          <p>
            By logging in, you agree to abide by the{" "}
            <a className="text-nyu-violet hover:underline" href="#">
              Policy on Responsible Use of NYU Computers and Data
            </a>
            .
          </p>
          <p>
            <a className="text-nyu-violet hover:underline" href="#">
              Accessibility
            </a>
          </p>
          <p>
            When using a public or shared computer, quitting
            <br />
            your browser does not securely log you out.{" "}
            <a className="text-nyu-violet hover:underline" href="#">
              You must sign or log out of your NYU account.
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
