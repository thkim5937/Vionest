import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileMenuButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="flex items-center cursor-pointer active:opacity-80 hover:bg-surface-container-high transition-colors px-2 py-1 rounded-full"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary">person</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            className="w-full flex items-center gap-2 px-4 py-2.5 text-left font-body-md text-body-md text-on-surface hover:bg-surface-container transition-colors"
            onClick={() => {
              setIsOpen(false);
              navigate("/profile");
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
            View My Profile
          </button>
          <button
            className="w-full flex items-center gap-2 px-4 py-2.5 text-left font-body-md text-body-md text-error hover:bg-surface-container transition-colors"
            onClick={handleLogout}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
