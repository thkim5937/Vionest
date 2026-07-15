import { useState } from "react";

// Table 4.1-1 — Borough -> Neighborhood mapping (PRD 4.1 / search/CLAUDE.md)
const BOROUGH_NEIGHBORHOODS: Record<string, string[]> = {
  Manhattan: [
    "Greenwich Village",
    "East Village",
    "Lower East Side",
    "Chelsea",
    "Union Square/Gramercy",
    "Upper East Side",
    "Upper West Side",
    "Harlem",
    "Financial District",
    "Other",
  ],
  Brooklyn: ["Williamsburg", "Bushwick", "Park Slope", "Brooklyn Heights", "Bed-Stuy", "DUMBO", "Other"],
  Queens: ["Astoria", "Long Island City", "Flushing", "Other"],
  Bronx: ["Other"],
  "Staten Island": ["Other"],
};

const BOROUGHS = Object.keys(BOROUGH_NEIGHBORHOODS);

type ListingCardData = {
  id: string;
  buildingName: string;
  neighborhood: string;
  price: number;
  moveInLabel: string;
  residentCount: number;
  matchScore: number;
  nyuVerified: boolean;
  transit: string;
  posterName: string;
  posterInitial: string;
};

// TODO: replace with GET /api/listings response (borough/neighborhood/price filters + gender hard filter + match-score sort)
const SAMPLE_LISTINGS: ListingCardData[] = [
  {
    id: "1",
    buildingName: "The Palladium, 140 E 14th St",
    neighborhood: "East Village",
    price: 2100,
    moveInLabel: "Move-in: Aug 1",
    residentCount: 2,
    matchScore: 95,
    nyuVerified: true,
    transit: "L, N, Q, R, W, 4, 5, 6 at Union Sq (3 min walk)",
    posterName: "Sarah",
    posterInitial: "S",
  },
  {
    id: "2",
    buildingName: "Washington Square Village",
    neighborhood: "Greenwich Village",
    price: 1850,
    moveInLabel: "Move-in: Sep 1",
    residentCount: 3,
    matchScore: 88,
    nyuVerified: false,
    transit: "A, B, C, D, E, F, M at W 4th St (5 min walk)",
    posterName: "Michael",
    posterInitial: "M",
  },
  {
    id: "3",
    buildingName: "Gramercy Green, 310 3rd Ave",
    neighborhood: "Gramercy Park",
    price: 2400,
    moveInLabel: "Move-in: Immediate",
    residentCount: 1,
    matchScore: 82,
    nyuVerified: true,
    transit: "6 at 23rd St (2 min walk)",
    posterName: "David",
    posterInitial: "D",
  },
];

function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-200">
      <div className="relative w-full pt-[75%] bg-surface-variant">
        {/* TODO: replace with listing.photos[0] */}
        <div className="absolute top-3 right-3 bg-nyu-violet text-on-primary font-label-caps text-label-caps px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">verified</span>
          {listing.matchScore}% Match
        </div>
        {listing.nyuVerified && (
          <div className="absolute bottom-3 left-3 bg-[#008542] text-white font-label-caps text-label-caps px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] [font-variation-settings:'FILL'_1]">school</span>
            NYU Verified
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-stack-sm">
        {/* Header & Price */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">{listing.buildingName}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{listing.neighborhood}</p>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="font-display-price text-display-price text-on-surface block">${listing.price.toLocaleString()}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/ mo</span>
          </div>
        </div>
        {/* Meta Details */}
        <div className="flex gap-4 border-y border-outline-variant py-2 my-1">
          <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {listing.moveInLabel}
          </div>
          <div className="w-px bg-outline-variant" />
          <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">group</span>
            {listing.residentCount} {listing.residentCount === 1 ? "Resident" : "Residents"}
          </div>
        </div>
        {/* Transit */}
        <div className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant">
          <span className="material-symbols-outlined shrink-0 mt-0.5 text-[18px]">subway</span>
          <span>{listing.transit}</span>
        </div>
        {/* Footer / Poster */}
        <div className="flex items-center gap-2 mt-2 pt-2">
          <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-sm">
            {listing.posterInitial}
          </div>
          <span className="font-label-sm text-label-sm text-on-surface">Posted by {listing.posterName}</span>
        </div>
      </div>
    </article>
  );
}

export default function SearchPage() {
  // Local UI-only state for the 2-step borough -> neighborhood dropdown (no API wiring yet).
  const [borough, setBorough] = useState(BOROUGHS[0]);

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 md:pb-0">
      {/* TopAppBar (desktop/tablet) */}
      <header className="hidden md:flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto bg-surface-container-lowest border-b border-outline-variant top-0 sticky z-50">
        <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface cursor-pointer active:opacity-80">
          <span>VioNest</span>
          <div className="w-px h-5 bg-outline-variant" />
          <span className="material-symbols-outlined text-nyu-violet text-[20px] [font-variation-settings:'FILL'_1]">local_fire_department</span>
        </div>
        <nav className="flex gap-6 items-center">
          <a className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" href="#">
            Home
          </a>
          <a className="text-primary font-bold font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" href="#">
            Search
          </a>
          <a className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" href="#">
            Saved
          </a>
          <a className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" href="#">
            Inbox
          </a>
        </nav>
        <div className="flex items-center gap-3 cursor-pointer active:opacity-80 hover:bg-surface-container-high transition-colors px-2 py-1 rounded-full">
          <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">person</span>
          </div>
        </div>
      </header>

      {/* Mobile Search Filter Bar (Sticky Top) */}
      <div className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant shadow-sm w-full md:hidden">
        <div className="flex items-center gap-2 px-margin-mobile pt-4 pb-2">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">VioNest</span>
          <div className="w-px h-5 bg-outline-variant" />
          <span className="material-symbols-outlined text-nyu-violet text-[20px] [font-variation-settings:'FILL'_1]">local_fire_department</span>
        </div>
        <div className="px-margin-mobile pb-4 flex flex-col gap-stack-sm">
          {/* Row 1: Borough & Neighborhood */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              {/* TODO: bind to search filter — borough */}
              <select
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                onChange={(e) => setBorough(e.target.value)}
                value={borough}
              >
                {BOROUGHS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
            <div className="relative flex-1">
              {/* TODO: bind to search filter — neighborhood (options depend on selected borough) */}
              <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet">
                {BOROUGH_NEIGHBORHOODS[borough].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>
          {/* Row 2: Min & Max Price */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">$</span>
              {/* TODO: bind to search filter — minPrice */}
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                placeholder="Min"
                type="number"
              />
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">$</span>
              {/* TODO: bind to search filter — maxPrice */}
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                placeholder="Max"
                type="number"
              />
            </div>
          </div>
          {/* Row 3: Search Button */}
          {/* TODO: wire onClick -> GET /api/listings?borough=&neighborhood=&minPrice=&maxPrice= */}
          <button className="w-full bg-nyu-violet text-on-primary font-headline-sm text-headline-sm py-3 rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform" type="button">
            <span className="material-symbols-outlined text-[20px]">search</span>
            Search
          </button>
        </div>
      </div>

      {/* Main Content: Scrollable Listing Cards */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-gutter">
        {/* Results Summary */}
        <div className="flex justify-between items-end pb-2 border-b border-outline-variant md:hidden">
          {/* TODO: replace with listings.length */}
          <h1 className="font-headline-sm text-headline-sm text-on-surface">{SAMPLE_LISTINGS.length} properties found</h1>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">sort</span>
            Match Score
          </span>
        </div>

        {SAMPLE_LISTINGS.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}

        {/* Loading Indicator for infinite scroll */}
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 pb-safe bg-surface border-t border-outline-variant shadow-sm z-50">
        <a className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:text-nyu-violet transition-all active:scale-95 duration-150 w-16 h-12" href="#">
          <span className="material-symbols-outlined mb-1 text-[24px]">home</span>
          <span className="truncate">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary font-bold font-label-sm text-label-sm hover:text-nyu-violet transition-all active:scale-95 duration-150 w-16 h-12" href="#">
          <span className="material-symbols-outlined mb-1 text-[24px] [font-variation-settings:'FILL'_1]">search</span>
          <span className="truncate">Search</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:text-nyu-violet transition-all active:scale-95 duration-150 w-16 h-12" href="#">
          <span className="material-symbols-outlined mb-1 text-[24px]">bookmark</span>
          <span className="truncate">Saved</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:text-nyu-violet transition-all active:scale-95 duration-150 w-16 h-12" href="#">
          <span className="material-symbols-outlined mb-1 text-[24px]">mail</span>
          <span className="truncate">Inbox</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:text-nyu-violet transition-all active:scale-95 duration-150 w-16 h-12" href="#">
          <span className="material-symbols-outlined mb-1 text-[24px]">person</span>
          <span className="truncate">Profile</span>
        </a>
      </nav>
    </div>
  );
}
