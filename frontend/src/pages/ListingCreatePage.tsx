import { ChangeEvent, FormEvent, useState } from "react";
import BottomNavBar from "../components/shared/BottomNavBar";
import BoroughNeighborhoodDropdown from "../components/shared/BoroughNeighborhoodDropdown";
import NyuLogo from "../components/shared/NyuLogo";
import PrimaryButton from "../components/shared/PrimaryButton";

// Auto-inserts "." separators as the user types digits: "260901" -> "26.09.01".
function formatMoveInDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)].filter(Boolean).join(".");
}

// yy.mm.dd -> ISO YYYY-MM-DD, or null if it isn't a real calendar date.
// Two-digit years are treated as 2000 + yy since sublets are always near-future.
function parseMoveInDateInput(value: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yy, mm, dd] = match;
  const year = 2000 + Number(yy);
  const month = Number(mm);
  const day = Number(dd);

  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  return isRealDate ? `${year}-${mm}-${dd}` : null;
}

export default function ListingCreatePage() {
  const [moveInDateText, setMoveInDateText] = useState("");
  const [moveInDateError, setMoveInDateError] = useState<string | null>(null);

  // Ready to send once POST /api/listings is wired up.
  const moveInDateIso = parseMoveInDateInput(moveInDateText);

  const validateMoveInDate = () => {
    if (!moveInDateText) {
      setMoveInDateError("Move-in date is required.");
      return false;
    }
    if (!moveInDateIso) {
      setMoveInDateError("Enter a valid date in yy.mm.dd format.");
      return false;
    }
    setMoveInDateError(null);
    return true;
  };

  const handleMoveInDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMoveInDateText(formatMoveInDateInput(e.target.value));
    setMoveInDateError(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateMoveInDate()) return;
    // TODO: wire onSubmit -> POST /api/listings (multipart, requires auth + profile completed)
  };

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
            <NyuLogo />
          </div>
          <div className="cursor-pointer active:opacity-80">
            {/* TODO: replace with current user's avatar image */}
            <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden" />
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow w-full max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
        <h1 className="font-display-price text-display-price mb-stack-lg text-primary">Post Your Sublet</h1>
        <form className="space-y-stack-lg" onSubmit={handleSubmit}>
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
          {/* TODO: bind onChange -> Listing.borough / Listing.neighborhood */}
          <BoroughNeighborhoodDropdown variant="labeled" />

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
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface" htmlFor="moveInDate">
              Move-in Date
            </label>
            <div className="relative">
              <input
                aria-invalid={moveInDateError ? true : undefined}
                className={`w-full bg-surface-container-lowest border rounded-DEFAULT px-4 py-3 pr-12 font-body-lg text-body-lg text-on-surface focus:outline-none focus:ring-1 ${
                  moveInDateError ? "border-error focus:border-error focus:ring-error" : "border-outline focus:border-primary focus:ring-primary"
                }`}
                id="moveInDate"
                inputMode="numeric"
                lang="en"
                maxLength={8}
                onBlur={validateMoveInDate}
                onChange={handleMoveInDateChange}
                placeholder="yy.mm.dd"
                type="text"
                value={moveInDateText}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="material-symbols-outlined text-outline">calendar_today</span>
              </span>
            </div>
            {moveInDateError && <p className="mt-1 font-label-sm text-label-sm text-error">{moveInDateError}</p>}
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
            <PrimaryButton type="submit">
              <span>Post Listing</span>
              <span className="material-symbols-outlined">check_circle</span>
            </PrimaryButton>
          </div>
        </form>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <BottomNavBar active="profile" />
    </div>
  );
}
