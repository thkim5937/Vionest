import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import BottomNavBar from "../components/shared/BottomNavBar";
import ListingCard from "../components/shared/ListingCard";
import NyuLogo from "../components/shared/NyuLogo";
import PrimaryButton from "../components/shared/PrimaryButton";
import ProfileMenuButton from "../components/shared/ProfileMenuButton";
import RegionMultiSelectFilter, { RegionSelection } from "../components/shared/RegionMultiSelectFilter";
import { searchListings, ListingSearchResult } from "../api/listings";

// The dropdown's "Staten Island" display label doesn't match the Borough enum's
// StatenIsland value (no space) — translate before sending to the backend.
const BOROUGH_ENUM_VALUES: Record<string, string> = {
  Manhattan: "Manhattan",
  Brooklyn: "Brooklyn",
  Queens: "Queens",
  Bronx: "Bronx",
  "Staten Island": "StatenIsland",
};

const EMPTY_REGION_SELECTION: RegionSelection = { boroughs: [], neighborhoods: [] };

const SEARCH_STATE_STORAGE_KEY = "vionest_search_state";

interface StoredSearchState {
  region: RegionSelection;
  minPrice: string;
  maxPrice: string;
  listings: ListingSearchResult[];
}

export default function SearchPage() {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();

  const [region, setRegion] = useState<RegionSelection>(EMPTY_REGION_SELECTION);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listings, setListings] = useState<ListingSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchListings({
        borough: region.boroughs.length > 0 ? region.boroughs.map((b) => BOROUGH_ENUM_VALUES[b] ?? b) : undefined,
        neighborhood: region.neighborhoods.length > 0 ? region.neighborhoods : undefined,
        minPrice: minPrice !== "" ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
      });
      setListings(results);
      setHasSearched(true);
      const stateToStore: StoredSearchState = { region, minPrice, maxPrice, listings: results };
      sessionStorage.setItem(SEARCH_STATE_STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setError(message ?? "Could not load listings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [region, minPrice, maxPrice]);

  useEffect(() => {
    if (navigationType === "POP") {
      const saved = sessionStorage.getItem(SEARCH_STATE_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StoredSearchState;
          setRegion(parsed.region);
          setMinPrice(parsed.minPrice);
          setMaxPrice(parsed.maxPrice);
          setListings(parsed.listings);
          setHasSearched(true);
          setError(null);
          setIsLoading(false);
          return;
        } catch {
          // fall through to empty state below on malformed saved state
        }
      }
    }
    setRegion(EMPTY_REGION_SELECTION);
    setMinPrice("");
    setMaxPrice("");
    setListings([]);
    setHasSearched(false);
    setError(null);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 md:pb-0">
      {/* Post a Listing FAB (mobile only — desktop has the header CTA) */}
      <button
        className="md:hidden fixed bottom-36 right-4 z-50 flex items-center gap-1.5 bg-nyu-violet text-on-primary font-label-sm text-label-sm px-4 py-2.5 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        onClick={() => navigate("/listings/new")}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Post a Listing
      </button>

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
          <Link className="text-primary font-bold font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/search">
            Search
          </Link>
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/inbox">
            Inbox
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

      {/* Desktop Search Filter Bar */}
      <div className="hidden md:flex items-center gap-3 px-margin-desktop py-4 w-full max-w-container-max mx-auto bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex-1 max-w-md">
          <RegionMultiSelectFilter onChange={setRegion} value={region} />
        </div>
        <div className="relative w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">$</span>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
            min={0}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            type="number"
            value={minPrice}
          />
        </div>
        <div className="relative w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">$</span>
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
            min={0}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            type="number"
            value={maxPrice}
          />
        </div>
        <button
          className="flex items-center gap-1.5 bg-nyu-violet text-on-primary font-label-sm text-label-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          onClick={runSearch}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          Search
        </button>
      </div>

      {/* Mobile Search Filter Bar (Sticky Top) */}
      <div className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant shadow-sm w-full md:hidden">
        <div className="flex items-center justify-between gap-2 px-margin-mobile pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">VioNest</span>
            <div className="w-px h-5 bg-outline-variant" />
            <NyuLogo size={20} />
          </div>
          <ProfileMenuButton />
        </div>
        <div className="px-margin-mobile pb-4 flex flex-col gap-stack-sm">
          {/* Row 1: Borough & Neighborhood */}
          <RegionMultiSelectFilter onChange={setRegion} value={region} />
          {/* Row 2: Min & Max Price */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">$</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                min={0}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                type="number"
                value={minPrice}
              />
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">$</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                min={0}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                type="number"
                value={maxPrice}
              />
            </div>
          </div>
          {/* Row 3: Search Button */}
          <PrimaryButton onClick={runSearch}>
            <span className="material-symbols-outlined text-[20px]">search</span>
            Search
          </PrimaryButton>
        </div>
      </div>

      {/* Main Content: Scrollable Listing Cards */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-gutter">
        {/* Results Summary */}
        <div className="flex justify-between items-end pb-2 border-b border-outline-variant md:hidden">
          <h1 className="font-headline-sm text-headline-sm text-on-surface">{listings.length} properties found</h1>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">sort</span>
            Match Score
          </span>
        </div>

        {error && <p className="font-label-sm text-label-sm text-error text-center py-4">{error}</p>}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
          </div>
        ) : listings.length === 0 && !error && !hasSearched ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">tune</span>
            <p className="font-body-md text-body-md text-on-surface-variant">Select filters and press Search to find listings.</p>
          </div>
        ) : listings.length === 0 && !error ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
            <p className="font-body-md text-body-md text-on-surface-variant">No listings match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
        )}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <BottomNavBar active="search" />
    </div>
  );
}
