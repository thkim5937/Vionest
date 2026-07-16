type NavTabKey = "search" | "messages" | "profile";

type BottomNavBarProps = {
  active: NavTabKey;
  hasUnreadMessages?: boolean;
};

const TABS: { key: NavTabKey; label: string; icon: string }[] = [
  { key: "search", label: "Search", icon: "search" },
  { key: "messages", label: "Messages", icon: "chat_bubble" },
  { key: "profile", label: "Profile", icon: "person" },
];

// Bottom navigation bar: Search / Messages / Profile tabs (shared/CLAUDE.md).
export default function BottomNavBar({ active, hasUnreadMessages = false }: BottomNavBarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface border-t border-surface-variant shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-16 w-full px-4 pb-safe">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <a
              className={`flex flex-col items-center justify-center active:scale-90 transition-transform duration-200 w-16 h-full rounded-lg relative ${
                isActive ? "text-primary font-bold" : "text-secondary hover:bg-surface-container-low"
              }`}
              href="#"
              key={tab.key}
            >
              {tab.key === "messages" && hasUnreadMessages && (
                <div className="absolute top-1 right-2 w-2 h-2 bg-nyu-violet rounded-full" />
              )}
              <span className={`material-symbols-outlined mb-1 ${isActive ? "[font-variation-settings:'FILL'_1]" : ""}`}>{tab.icon}</span>
              <span className="font-label-sm text-label-sm">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
