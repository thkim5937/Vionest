import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import BottomNavBar from "../components/shared/BottomNavBar";
import ListingCard from "../components/shared/ListingCard";
import NyuLogo from "../components/shared/NyuLogo";
import ProfileMenuButton from "../components/shared/ProfileMenuButton";
import UnreadBadge from "../components/shared/UnreadBadge";
import { useAuth } from "../hooks/useAuth";
import { searchListings, ListingSearchResult } from "../api/listings";

const RECOMMENDED_LISTING_COUNT = 6;

export default function HomePage() {
  const navigate = useNavigate();
  const { user, unreadCount } = useAuth();

  const [listings, setListings] = useState<ListingSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    searchListings()
      .then((results) => setListings(results.slice(0, RECOMMENDED_LISTING_COUNT)))
      .catch((err) => {
        const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
        setError(message ?? "Could not load listings. Please try again.");
      })
      .finally(() => setIsLoading(false));
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
          <Link className="text-primary font-bold font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/">
            Home
          </Link>
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/search">
            Search
          </Link>
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5" to="/inbox">
            Inbox
            <UnreadBadge count={unreadCount} />
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 bg-nyu-violet text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            onClick={() => navigate("/listings/new")}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Post a Listing
          </button>
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

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-gutter">
        {/* Welcome / Hero Section */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-stack-md">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Find a sublet that matches your lifestyle.
            </p>
          </div>
          <button
            className="w-full flex items-center gap-2 bg-surface border border-outline-variant text-on-surface-variant font-body-md text-body-md px-4 py-3 rounded-lg hover:border-nyu-violet transition-colors text-left"
            onClick={() => navigate("/search")}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            <span>Search sublets by area or price...</span>
          </button>
        </section>

        {/* Post a Listing CTA */}
        <section
          className="bg-nyu-violet text-on-primary rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-stack-sm cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate("/listings/new")}
          role="button"
        >
          <div>
            <h2 className="font-headline-sm text-headline-sm">Have a room to sublet?</h2>
            <p className="font-body-md text-body-md opacity-90 mt-1">Post a listing and get matched with compatible NYU students.</p>
          </div>
          <button
            className="flex items-center gap-1.5 bg-on-primary text-nyu-violet font-label-sm text-label-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity self-start md:self-auto shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/listings/new");
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Post a Listing
          </button>
        </section>

        {/* Recommended Listings */}
        <section className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Recommended for You</h2>

          {error && <p className="font-label-sm text-label-sm text-error text-center py-4">{error}</p>}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
            </div>
          ) : listings.length === 0 && !error ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">home_work</span>
              <p className="font-body-md text-body-md text-on-surface-variant">No listings yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <BottomNavBar active="home" unreadCount={unreadCount} />
    </div>
  );
}
