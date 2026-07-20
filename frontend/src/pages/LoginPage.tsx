import { FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import nyuLogo from "../assets/nyu-logo.png";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);
    try {
      const loggedInUser = await login(email, password);
      navigate(loggedInUser.hasProfile ? "/" : "/profile/setup");
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setError(message ?? "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center font-sans antialiased">
      {/* Login Container */}
      <main className="w-full max-w-md px-margin-mobile md:px-0">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-8 md:p-10 flex flex-col items-center">
          {/* Logo Section */}
          <div className="mb-stack-lg flex justify-center w-full">
            {/* TODO: replace with actual VioNest logo asset (currently reusing NYU logo placeholder) */}
            <img alt="VioNest Logo" className="h-16 object-contain" src={nyuLogo} />
          </div>

          {/* Heading */}
          <h1 className="font-headline-md text-headline-md text-on-surface mb-stack-lg text-center w-full">Welcome Back</h1>

          {/* Form */}
          <form className="w-full flex flex-col gap-stack-md" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">
                NYU Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="NetID@nyu.edu"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <button
                  className="font-label-sm text-label-sm text-primary hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                  type="button"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                <input
                  className="w-full pl-10 pr-10 py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                />
                {/* TODO: wire show/hide password toggle */}
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors" type="button">
                  <span className="material-symbols-outlined">visibility_off</span>
                </button>
              </div>
            </div>

            {error && <p className="font-label-sm text-label-sm text-error">{error}</p>}

            {/* Submit Button */}
            <button
              className="mt-stack-sm w-full bg-nyu-violet text-on-primary py-3 px-4 rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-stack-lg font-body-md text-body-md text-on-surface-variant text-center">
            Don't have an account?{" "}
            <Link className="text-primary font-semibold hover:underline" to="/signup">
              Sign up
            </Link>
          </p>

          {/* Security Badge */}
          <div className="mt-stack-lg flex items-center justify-center gap-2 bg-surface-container py-2 px-4 rounded-full border border-outline-variant w-full max-w-[200px]">
            <span className="material-symbols-outlined text-primary [font-variation-settings:'FILL'_1]">verified_user</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">NYU SSO Secured</span>
          </div>
        </div>
      </main>

      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </div>
  );
}
