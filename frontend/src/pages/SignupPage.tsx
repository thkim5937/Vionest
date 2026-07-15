import nyuLogo from "../assets/nyu-logo.png";

export default function SignupPage() {
  return (
    <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center p-margin-mobile font-body-md text-on-surface">
      <main className="w-full max-w-[400px] flex flex-col gap-stack-lg">
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-stack-sm">
          {/* TODO: replace with actual VioNest + NYU dual logo asset (currently a placeholder) */}
          <img alt="VioNest and NYU Dual Logo" className="h-24 w-auto mb-4 object-contain" src={nyuLogo} />
          <h1 className="font-display-price text-display-price text-on-surface">Create Your Account</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">VioNest is exclusively for NYU students.</p>
        </header>

        {/* Form */}
        <form className="flex flex-col gap-stack-md w-full">
          {/* Email Field Group */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="email">
              NYU Email (NetID@nyu.edu)
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline">mail</span>
              <input
                className="w-full bg-surface py-3 pl-10 pr-[88px] border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                id="email"
                name="email"
                /* TODO: replace with bound value from signup form state */
                placeholder="netid@nyu.edu"
                type="email"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-nyu-violet text-on-primary font-label-sm text-label-sm rounded hover:opacity-90 transition-opacity"
                type="button"
              >
                Verify
              </button>
            </div>
            {/* TODO: show "Verified" status (checkmark + NYU-violet text) once useSsoMockFlow reports isVerified === true */}
          </div>

          {/* Password Field Group */}
          {/* TODO: remove opacity-50/pointer-events-none/disabled once useSsoMockFlow reports isVerified === true */}
          <div className="flex flex-col gap-1 mt-2 opacity-50 pointer-events-none">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="password">
              Create Password
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline">lock</span>
              <input
                className="w-full bg-surface py-3 pl-10 pr-4 border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                disabled
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <p className="font-label-sm text-label-sm text-outline ml-1">Verify your email to continue</p>
          </div>

          {/* Primary CTA */}
          <button
            className="w-full mt-4 bg-nyu-violet text-on-primary py-3 rounded-lg font-headline-sm text-headline-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
            type="submit"
          >
            Complete Sign-Up
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-2">
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            Already have an account? <span className="font-semibold text-primary">Log in</span>
          </a>
        </div>
      </main>
    </div>
  );
}
