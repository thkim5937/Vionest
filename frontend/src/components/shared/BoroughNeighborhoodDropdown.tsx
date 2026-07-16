import { useState } from "react";

// Table 4.1-1 — Borough -> Neighborhood mapping (PRD 4.1 / listing/CLAUDE.md / search/CLAUDE.md)
export const BOROUGH_NEIGHBORHOODS: Record<string, string[]> = {
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

export const BOROUGHS = Object.keys(BOROUGH_NEIGHBORHOODS);

type BoroughNeighborhoodValue = { borough: string; neighborhood: string };

type BoroughNeighborhoodDropdownProps = {
  // "default" matches the compact inline pair used on SearchPage (with a chevron icon).
  // "labeled" matches the full-width stacked pair with a "Location" heading used on ListingCreatePage.
  variant?: "default" | "labeled";
  onChange?: (value: BoroughNeighborhoodValue) => void;
};

export default function BoroughNeighborhoodDropdown({ variant = "default", onChange }: BoroughNeighborhoodDropdownProps) {
  const [borough, setBorough] = useState(BOROUGHS[0]);
  const [neighborhood, setNeighborhood] = useState(BOROUGH_NEIGHBORHOODS[BOROUGHS[0]][0]);

  const handleBoroughChange = (nextBorough: string) => {
    const nextNeighborhood = BOROUGH_NEIGHBORHOODS[nextBorough][0];
    setBorough(nextBorough);
    setNeighborhood(nextNeighborhood);
    onChange?.({ borough: nextBorough, neighborhood: nextNeighborhood });
  };

  const handleNeighborhoodChange = (nextNeighborhood: string) => {
    setNeighborhood(nextNeighborhood);
    onChange?.({ borough, neighborhood: nextNeighborhood });
  };

  if (variant === "labeled") {
    return (
      <section className="space-y-stack-md">
        <label className="block font-headline-sm text-headline-sm text-on-surface">Location</label>
        <div>
          <select
            className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
            onChange={(e) => handleBoroughChange(e.target.value)}
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
          <select
            className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none text-on-surface-variant"
            onChange={(e) => handleNeighborhoodChange(e.target.value)}
            value={neighborhood}
          >
            {BOROUGH_NEIGHBORHOODS[borough].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </section>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <select
          className="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
          onChange={(e) => handleBoroughChange(e.target.value)}
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
        <select
          className="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
          onChange={(e) => handleNeighborhoodChange(e.target.value)}
          value={neighborhood}
        >
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
  );
}
