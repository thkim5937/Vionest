import nyuLogo from "../../assets/nyu-logo.png";

type NyuLogoProps = {
  // Controls the rendered size (px, square). Uses inline style rather than a
  // Tailwind height utility so it's a single deterministic source of truth.
  size?: number;
  className?: string;
};

// Real NYU logo image (torch icon + "NYU" wordmark baked into a single square
// lockup), placed alongside the VioNest logo wherever the main logo appears
// (design rule, shared/CLAUDE.md).
export default function NyuLogo({ size = 24, className = "" }: NyuLogoProps) {
  return (
    <img alt="NYU" className={`inline-block object-contain shrink-0 ${className}`} src={nyuLogo} style={{ height: size, width: size }} />
  );
}
