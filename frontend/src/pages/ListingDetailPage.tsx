import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import MatchScoreBadge from "../components/shared/MatchScoreBadge";
import NyuVerifiedBadge from "../components/shared/NyuVerifiedBadge";
import PrimaryButton from "../components/shared/PrimaryButton";
import ProfileMenuButton from "../components/shared/ProfileMenuButton";
import { getListing, ListingDetail } from "../api/listings";
import { createOrFindConversation } from "../api/conversations";

// 12 fixed 2-hour blocks (index 0-11), matching ProfileSetupPage's Profile.bedTimeBlock / wakeTimeBlock labels.
const TIME_BLOCKS = [
  "00:00–02:00",
  "02:00–04:00",
  "04:00–06:00",
  "06:00–08:00",
  "08:00–10:00",
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:00",
  "20:00–22:00",
  "22:00–24:00",
];

const GUEST_FREQUENCY_LABELS: Record<string, string> = {
  WEEKLY: "Has guests at least once a week",
  MONTHLY: "Has guests 1–2 times a month",
  QUARTERLY: "Has guests 1–2 times a quarter",
  RARE: "Rarely has guests",
};

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

function formatMoveInLabel(moveInDate: string): string {
  const date = new Date(moveInDate);
  return `Move-in: ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    getListing(id)
      .then(setListing)
      .catch((err) => {
        const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
        setError(message ?? "Could not load this listing. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-background text-on-background min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center gap-2 text-center px-margin-mobile">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">error_outline</span>
        <p className="font-body-md text-body-md text-on-surface-variant">{error ?? "Listing not found."}</p>
      </div>
    );
  }

  const photoUrl = listing.photos[0] ? `${import.meta.env.VITE_API_BASE_URL ?? ""}${listing.photos[0]}` : undefined;
  const listingId = listing.id;

  async function handleSendMessage() {
    setIsMessaging(true);
    setMessageError(null);

    try {
      const conversation = await createOrFindConversation(listingId);
      navigate(`/chat/${conversation.id}`);
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setMessageError(message ?? "Could not start a conversation. Please try again.");
      setIsMessaging(false);
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pb-24 md:pb-0">
      {/* Top Navigation (Desktop Only) */}
      <header className="hidden md:flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto bg-surface-container-lowest sticky top-0 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface">VioNest</div>
        <nav className="flex gap-6">
          <Link className="text-on-surface-variant font-body-md hover:bg-surface-container-high px-3 py-2 rounded-lg transition-colors" to="/">
            Home
          </Link>
          <Link className="text-primary font-body-md font-bold hover:bg-surface-container-high px-3 py-2 rounded-lg transition-colors" to="/search">
            Search
          </Link>
          <Link className="text-on-surface-variant font-body-md hover:bg-surface-container-high px-3 py-2 rounded-lg transition-colors" to="/inbox">
            Inbox
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ProfileMenuButton />
        </div>
      </header>

      <main className="flex-grow w-full max-w-3xl mx-auto bg-surface-container-lowest">
        {/* Hero Image Section */}
        <div className="relative w-full h-[353px] md:h-[442px] bg-surface-variant">
          {photoUrl && <img alt={listing.neighborhood} className="absolute inset-0 w-full h-full object-cover" src={photoUrl} />}
          <button
            className="absolute top-4 left-4 md:hidden w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10 transition-transform active:scale-95"
            onClick={() => navigate(-1)}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="absolute top-4 right-4 md:hidden z-10">
            <ProfileMenuButton />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-margin-mobile md:px-margin-desktop py-6 flex flex-col gap-6">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface">{listing.neighborhood}</h1>
                <p className="font-body-md text-on-surface-variant">{listing.borough}</p>
              </div>
              {listing.matchScore !== null && <MatchScoreBadge score={listing.matchScore} />}
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-md mt-2">
              <span className="material-symbols-outlined text-[18px]">subway</span>
              <span>{listing.nearestStation}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface font-body-md font-medium mt-1">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>
                {formatMoveInLabel(listing.moveInDate)} · {listing.residentCount} {listing.residentCount === 1 ? "Resident" : "Residents"}
              </span>
            </div>
            <div className="mt-4 font-display-price text-display-price text-on-surface">
              ${listing.price.toLocaleString()}<span className="font-body-md text-on-surface-variant font-normal">/mo</span>
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* About the Space */}
          <section className="flex flex-col gap-3">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">About the Space</h2>
            {/* TODO: not a documented Listing field (listing/CLAUDE.md) — decorative copy only, no data binding yet */}
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Beautifully sunlit room in a modern apartment. The space features high ceilings, hardwood floors, and a spacious closet.
              You'll be sharing the common areas with your future roommate.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">wifi</span>
                <span className="font-body-md">Wifi</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
                <span className="font-body-md">Laundry</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">kitchen</span>
                <span className="font-body-md">Kitchen</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">hvac</span>
                <span className="font-body-md">Heating</span>
              </div>
            </div>
          </section>

          <hr className="border-outline-variant" />

          {/* About Your Host */}
          {listing.poster && (
            <section className="flex flex-col gap-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">About Your Host</h2>
              <div className="flex items-center gap-4">
                {/* TODO: replace with poster's avatar image */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-variant" />
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface">{listing.poster.name}</div>
                  <NyuVerifiedBadge className="mt-1" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                  {GENDER_LABELS[listing.poster.gender] ?? listing.poster.gender}
                </span>
                <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                  Bedtime: {TIME_BLOCKS[listing.poster.bedTimeBlock]}
                </span>
                <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                  Wake-up: {TIME_BLOCKS[listing.poster.wakeTimeBlock]}
                </span>
                <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                  {listing.poster.smoking ? "Smoker" : "Non-smoker"}
                </span>
                <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                  {listing.poster.cooking ? "Cooks often" : "Rarely cooks"}
                </span>
                <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                  {listing.poster.pets ? "Has pets" : "No pets"}
                </span>
                <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">
                  {GUEST_FREQUENCY_LABELS[listing.poster.guestFrequency] ?? listing.poster.guestFrequency}
                </span>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant p-4 z-40 md:relative md:border-none md:p-6 md:max-w-3xl md:mx-auto md:bg-transparent">
        {messageError && (
          <p className="font-label-sm text-label-sm text-error text-center mb-2">{messageError}</p>
        )}
        <PrimaryButton onClick={handleSendMessage} disabled={isMessaging}>
          <span className="material-symbols-outlined">mail</span>
          {isMessaging ? "Starting conversation…" : "Send Message"}
        </PrimaryButton>
      </div>
    </div>
  );
}
