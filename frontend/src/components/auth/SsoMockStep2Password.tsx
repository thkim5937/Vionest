import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NyuLogo from "../shared/NyuLogo";

interface SsoLocationState {
  email?: string;
}

export default function SsoMockStep2Password() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as SsoLocationState | null)?.email ?? "";
  const [password, setPassword] = useState("");

  // This SSO mock password is never stored/validated (PRD 7.2) — it's local to this
  // component and discarded on navigation; only the email is carried forward.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/sso/step3", { state: { email } });
  };

  return (
    <div className="bg-primary bg-nyu-diagonal bg-[length:100px_100px] min-h-screen flex flex-col justify-center items-center p-4">
      {/* Main Card */}
      <main className="bg-surface-container-lowest w-full max-w-[440px] shadow-lg flex flex-col p-[44px] mb-[20px]">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-[24px]">
          <NyuLogo size={32} />
        </div>

        {/* Back Button Row */}
        <button
          className="flex items-center gap-2 text-on-surface hover:text-on-surface transition-colors mb-[16px] w-fit"
          onClick={() => navigate("/sso/step1", { state: { email } })}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span className="font-body-md text-body-md">{email}</span>
        </button>

        {/* Heading */}
        <h1 className="text-[24px] font-bold text-on-surface mb-[16px]">Enter Password</h1>

        {/* Input Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative w-full mb-2">
            <input
              className="w-full border-0 border-b border-on-surface-variant focus:border-nyu-violet focus:ring-0 px-0 py-2 bg-transparent text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant transition-colors"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              value={password}
            />
          </div>
          <a className="font-body-md text-body-md text-nyu-violet hover:underline w-fit" href="#">
            Forgotten or expired password?
          </a>

          {/* Action Buttons */}
          <div className="flex justify-end mt-[24px]">
            <button
              className="border border-nyu-violet text-nyu-violet hover:bg-surface-container-low font-body-md font-semibold text-[14px] px-[24px] py-[6px] transition-colors focus:outline-none focus:ring-2 focus:ring-nyu-violet focus:ring-offset-2 disabled:opacity-50"
              disabled={!password}
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Static Warning / Help Block (identical content to SsoMockStep1Identity, per PRD 4.1) */}
        <div className="mt-8 text-on-surface font-body-md text-[13px] flex flex-col gap-4 leading-relaxed">
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
