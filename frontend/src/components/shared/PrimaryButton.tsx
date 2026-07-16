import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

// NYU Violet for all primary buttons (design rule, shared/CLAUDE.md).
export default function PrimaryButton({ children, className = "", type = "button", ...rest }: PrimaryButtonProps) {
  return (
    <button
      className={`w-full bg-nyu-violet text-on-primary font-headline-sm text-headline-sm py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}
