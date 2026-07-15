import { useState } from "react";

// Table 4.1-1 — Borough -> Neighborhood mapping (PRD 4.1 / listing/CLAUDE.md)
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

export default function ListingCreatePage() {
  // Local UI-only state for the 2-step borough -> neighborhood dropdown (no API/form wiring yet).
  const [borough, setBorough] = useState(BOROUGHS[0]);

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest w-full top-0 sticky border-b border-outline-variant z-40">
        <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-2 cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined text-primary">menu</span>
          </div>
          {/* Branding Section: The Dual-Logo */}
          <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface">
            <span>VioNest</span>
            <div className="w-px h-5 bg-outline-variant" />
            <span className="material-symbols-outlined text-primary [font-variation-settings:'FILL'_1]">local_fire_department</span>
          </div>
          <div className="cursor-pointer active:opacity-80">
            {/* TODO: replace with current user's avatar image */}
            <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden" />
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow w-full max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
        <h1 className="font-display-price text-display-price mb-stack-lg text-primary">List Your Sublet</h1>
        <form className="space-y-stack-lg">
          {/* Photos Section */}
          <section>
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface">Photos (at least 1 required)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-stack-sm">
              {/* Upload Box */}
              {/* TODO: wire to multer photo upload (min. 1 photo required, per listing/CLAUDE.md) */}
              <div className="border-2 border-dashed border-outline rounded-lg flex flex-col items-center justify-center p-stack-md h-32 cursor-pointer hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
                <span className="material-symbols-outlined text-outline text-3xl mb-2">photo_camera</span>
                <span className="font-label-sm text-label-sm text-outline text-center">Tap to upload photos</span>
              </div>
              {/* Uploaded Thumbnail Placeholder */}
              <div className="rounded-lg overflow-hidden h-32 relative group bg-surface-container-high">
                {/* TODO: replace with listing.photos[n] once photos are uploaded */}
                <div className="absolute inset-0 bg-on-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-on-primary">delete</span>
                </div>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="space-y-stack-md">
            <label className="block font-headline-sm text-headline-sm text-on-surface">Location</label>
            <div>
              {/* TODO: bind to Listing.borough */}
              <select
                className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                onChange={(e) => setBorough(e.target.value)}
                value={borough}
              >
                {BOROUGHS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {/* TODO: bind to Listing.neighborhood (options depend on selected borough, Table 4.1-1) */}
              <select className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none text-on-surface-variant">
                {BOROUGH_NEIGHBORHOODS[borough].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Price Section */}
          <section>
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface">Monthly Rent (USD)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-body-lg text-body-lg text-on-surface-variant">$</span>
              {/* TODO: bind to Listing.price */}
              <input
                className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT pl-8 pr-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="0"
                type="number"
              />
            </div>
          </section>

          {/* Move-in Date Section */}
          <section>
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface">Move-in Date</label>
            <div className="relative">
              {/* TODO: bind to Listing.moveInDate */}
              <input
                className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                type="date"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="material-symbols-outlined text-outline">calendar_today</span>
              </span>
            </div>
          </section>

          {/* Nearest Subway Station Section */}
          <section>
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface">Nearest Subway Station</label>
            {/* TODO: bind to Listing.nearestStation (free text, no validation per listing/CLAUDE.md) */}
            <input
              className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="e.g., 14 St–Union Sq (5 min walk)"
              type="text"
            />
          </section>

          {/* Number of Residents Section */}
          <section>
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface">
              Current Number of Residents (including you)
            </label>
            {/* TODO: bind to Listing.residentCount */}
            <input
              className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              min={1}
              type="number"
            />
          </section>

          {/* CTA */}
          <div className="pt-stack-md">
            {/* TODO: wire onClick -> POST /api/listings (multipart, requires auth + profile completed) */}
            <button
              className="w-full bg-nyu-violet text-on-primary font-headline-sm text-headline-sm py-4 rounded-lg flex justify-center items-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
              type="button"
            >
              <span>Post Listing</span>
              <span className="material-symbols-outlined">check_circle</span>
            </button>
          </div>
        </form>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 border-t border-outline-variant bg-surface shadow-sm flex justify-around items-center px-4 py-2 pb-safe">
        <a className="flex flex-col items-center justify-center text-secondary hover:text-nyu-violet transition-all active:scale-95 duration-150" href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-label-sm mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-nyu-violet transition-all active:scale-95 duration-150" href="#">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-sm text-label-sm mt-1">Search</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-nyu-violet transition-all active:scale-95 duration-150" href="#">
          <span className="material-symbols-outlined">bookmark</span>
          <span className="font-label-sm text-label-sm mt-1">Saved</span>
        </a>
        <a className="flex flex-col items-center justify-center text-secondary hover:text-nyu-violet transition-all active:scale-95 duration-150" href="#">
          <span className="material-symbols-outlined">mail</span>
          <span className="font-label-sm text-label-sm mt-1">Inbox</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary font-bold hover:text-nyu-violet transition-all active:scale-95 duration-150" href="#">
          <span className="material-symbols-outlined [font-variation-settings:'FILL'_1]">person</span>
          <span className="font-label-sm text-label-sm mt-1">Profile</span>
        </a>
      </nav>
    </div>
  );
}
