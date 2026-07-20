import { useNavigate } from "react-router-dom";
import NyuLogo from "../components/shared/NyuLogo";
import ProfileForm from "../components/shared/ProfileForm";
import { createProfile, ProfileInput } from "../api/profile";
import { useAuth } from "../hooks/useAuth";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (values: ProfileInput) => {
    await createProfile(values);
    await refreshUser();
    navigate("/");
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased">
      {/* Top Navigation (Transactional, minimal nav) */}
      <header className="flex justify-between items-center px-margin-mobile py-4 w-full sticky top-0 bg-surface-container-lowest z-10">
        <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface">
          VioNest
          <div className="w-px h-5 bg-outline-variant mx-1" />
          <NyuLogo />
        </div>
        <button
          className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-high transition-colors"
          onClick={() => navigate("/search")}
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="px-margin-mobile pb-24 max-w-md mx-auto w-full">
        {/* Header Section */}
        <div className="py-stack-lg">
          <h1 className="font-headline-md text-headline-md mb-stack-sm text-nyu-violet">Set Up Your Lifestyle Profile</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            This helps us match you with compatible listings and tenants.
          </p>
        </div>

        <ProfileForm onSubmit={handleSubmit} submitLabel="Complete Profile" />
      </main>
    </div>
  );
}
