type MatchScoreBadgeProps = {
  score: number;
  className?: string;
};

// NYU Violet background (shared/CLAUDE.md). Score is the search/CLAUDE.md
// match-score algorithm output (0-100).
export default function MatchScoreBadge({ score, className = "" }: MatchScoreBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-nyu-violet text-on-primary font-label-caps text-label-caps px-2 py-1 rounded shadow-sm ${className}`}
    >
      <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">bolt</span>
      {score}% Match
    </span>
  );
}
