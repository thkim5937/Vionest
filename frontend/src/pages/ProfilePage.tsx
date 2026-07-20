import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link } from "react-router-dom";
import BottomNavBar from "../components/shared/BottomNavBar";
import NyuLogo from "../components/shared/NyuLogo";
import ProfileForm, { GUEST_FREQUENCIES, TIME_BLOCKS } from "../components/shared/ProfileForm";
import ProfileMenuButton from "../components/shared/ProfileMenuButton";
import { createProfile, getProfile, Profile } from "../api/profile";

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

function guestFrequencyLabel(value: string): string {
  return GUEST_FREQUENCIES.find((entry) => entry.value === value)?.label ?? value;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = () => {
    setIsLoading(true);
    setError(null);
    return getProfile()
      .then(setProfile)
      .catch((err) => {
        const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
        setError(message ?? "Could not load your profile. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 md:pb-0">
      {/* TopAppBar (desktop/tablet) */}
      <header className="hidden md:flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto bg-surface-container-lowest border-b border-outline-variant top-0 sticky z-50">
        <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface cursor-pointer active:opacity-80">
          <span>VioNest</span>
          <div className="w-px h-5 bg-outline-variant" />
          <NyuLogo size={20} />
        </div>
        <nav className="flex gap-6 items-center">
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/">
            Home
          </Link>
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/search">
            Search
          </Link>
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/inbox">
            Inbox
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ProfileMenuButton />
        </div>
      </header>

      {/* TopAppBar (Mobile) */}
      <header className="w-full top-0 sticky bg-surface z-40 md:hidden border-b border-outline-variant">
        <div className="flex justify-between items-center px-margin-mobile py-4 w-full">
          <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface">
            <span>VioNest</span>
            <div className="w-px h-5 bg-outline-variant" />
            <NyuLogo size={20} />
          </div>
          <ProfileMenuButton />
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">error_outline</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
          </div>
        ) : !profile ? null : isEditing ? (
          <div className="max-w-md mx-auto w-full">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-stack-lg">Edit Your Profile</h1>
            <ProfileForm
              initialValues={profile}
              onCancel={() => setIsEditing(false)}
              onSubmit={async (values) => {
                await createProfile(values);
                await loadProfile();
                setIsEditing(false);
              }}
              submitLabel="Save Changes"
            />
          </div>
        ) : (
          <div className="max-w-md mx-auto w-full flex flex-col gap-stack-lg">
            <div className="flex justify-between items-center">
              <h1 className="font-headline-md text-headline-md text-on-surface">My Profile</h1>
              <button
                className="flex items-center gap-1.5 bg-nyu-violet text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit
              </button>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant shadow-sm divide-y divide-outline-variant">
              <div className="flex justify-between items-center px-stack-md py-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Gender</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">{GENDER_LABELS[profile.gender] ?? profile.gender}</span>
              </div>
              <div className="flex justify-between items-center px-stack-md py-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Bedtime</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">{TIME_BLOCKS[profile.bedTimeBlock]}</span>
              </div>
              <div className="flex justify-between items-center px-stack-md py-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Wake-up Time</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">{TIME_BLOCKS[profile.wakeTimeBlock]}</span>
              </div>
              <div className="flex justify-between items-center px-stack-md py-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Smoking</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">{profile.smoking ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center px-stack-md py-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Cooking</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">{profile.cooking ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center px-stack-md py-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Pets</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">{profile.pets ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center px-stack-md py-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Guest Frequency</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">{guestFrequencyLabel(profile.guestFrequency)}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BottomNavBar (Mobile Only) — hidden while editing so it doesn't collide with ProfileForm's fixed CTA bar */}
      {!isEditing && <BottomNavBar />}
    </div>
  );
}
