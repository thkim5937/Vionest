type UnreadBadgeProps = {
  count: number;
  className?: string;
};

// Small numeric badge, NYU violet background (shared/CLAUDE.md). Caps display at "9+".
export default function UnreadBadge({ count, className = "" }: UnreadBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-nyu-violet text-white text-[10px] font-bold leading-none rounded-full ${className}`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
