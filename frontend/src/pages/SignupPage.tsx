import { FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import NyuLogo from "../components/shared/NyuLogo";
import { useAuth } from "../hooks/useAuth";

interface SignupLocationState {
  email?: string;
  verified?: boolean;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const locationState = location.state as SignupLocationState | null;
  const [email, setEmail] = useState(locationState?.email ?? "");
  const [password, setPassword] = useState("");
  const [isVerified] = useState(Boolean(locationState?.verified));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    if (!email) return;
    navigate("/sso/step1", { state: { email } });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isVerified) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await signup(email, password);
      navigate("/profile/setup");
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setError(message ?? "Could not create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center p-margin-mobile font-body-md text-on-surface">
      <main className="w-full max-w-[400px] flex flex-col gap-stack-lg">
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-stack-sm">
          <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface mb-4">
            <span>VioNest</span>
            <div className="w-px h-5 bg-outline-variant" />
            <NyuLogo size={64} />
          </div>
          <h1 className="font-display-price text-display-price text-on-surface">Create Your Account</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">VioNest is exclusively for NYU students.</p>
        </header>

        {/* Form */}
        <form className="flex flex-col gap-stack-md w-full" onSubmit={handleSubmit}>
          {/* Email Field Group */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="email">
              NYU Email (NetID@nyu.edu)
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline">mail</span>
              <input
                className="w-full bg-surface py-3 pl-10 pr-[88px] border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors read-only:bg-surface-container-low"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="netid@nyu.edu"
                readOnly={isVerified}
                type="email"
                value={email}
              />
              {isVerified ? (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-nyu-violet font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_1]">check_circle</span>
                  Verified
                </span>
              ) : (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-nyu-violet text-on-primary font-label-sm text-label-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!email}
                  onClick={handleVerify}
                  type="button"
                >
                  Verify
                </button>
              )}
            </div>
          </div>

          {/* Password Field Group */}
          <div className={`flex flex-col gap-1 mt-2 ${isVerified ? "" : "opacity-50 pointer-events-none"}`}>
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="password">
              Create Password
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline">lock</span>
              <input
                className="w-full bg-surface py-3 pl-10 pr-4 border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                disabled={!isVerified}
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                value={password}
              />
            </div>
            <p className="font-label-sm text-label-sm text-outline ml-1">
              {isVerified ? "Choose a password for your account" : "Verify your email to continue"}
            </p>
          </div>

          {error && <p className="font-label-sm text-label-sm text-error ml-1">{error}</p>}

          {/* Primary CTA */}
          <button
            className="w-full mt-4 bg-nyu-violet text-on-primary py-3 rounded-lg font-headline-sm text-headline-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isVerified || !password || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Complete Sign-Up"}
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
