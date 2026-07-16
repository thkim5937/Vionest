type NyuVerifiedBadgeProps = {
  className?: string;
};

// Solid green (#008542) badge with a "school" icon, matching SearchPage.tsx's
// original design — the reconciled canonical style (shared/CLAUDE.md).
export default function NyuVerifiedBadge({ className = "" }: NyuVerifiedBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 bg-[#008542] text-white font-label-caps text-label-caps px-2 py-1 rounded shadow-sm ${className}`}>
      <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">school</span>
      NYU Verified
    </span>
  );
}
