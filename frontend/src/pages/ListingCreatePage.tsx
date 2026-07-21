import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../components/shared/BottomNavBar";
import BoroughNeighborhoodDropdown, { BOROUGH_NEIGHBORHOODS, BOROUGHS } from "../components/shared/BoroughNeighborhoodDropdown";
import NyuLogo from "../components/shared/NyuLogo";
import PrimaryButton from "../components/shared/PrimaryButton";
import ProfileMenuButton from "../components/shared/ProfileMenuButton";
import { useAuth } from "../hooks/useAuth";
import { createListing } from "../api/listings";

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

// The dropdown's "Staten Island" display label doesn't match the Borough enum's
// StatenIsland value (no space) — translate before sending to the backend.
const BOROUGH_ENUM_VALUES: Record<string, string> = {
  Manhattan: "Manhattan",
  Brooklyn: "Brooklyn",
  Queens: "Queens",
  Bronx: "Bronx",
  "Staten Island": "StatenIsland",
};

interface PhotoEntry {
  file: File;
  url: string;
}

export default function ListingCreatePage() {
  const navigate = useNavigate();
  const { unreadCount } = useAuth();

  const [photoEntries, setPhotoEntries] = useState<PhotoEntry[]>([]);
  const [location, setLocation] = useState({ borough: BOROUGHS[0], neighborhood: BOROUGH_NEIGHBORHOODS[BOROUGHS[0]][0] });
  const [price, setPrice] = useState("");
  const [moveInDateText, setMoveInDateText] = useState("");
  const [moveInDateError, setMoveInDateError] = useState<string | null>(null);
  const [nearestStation, setNearestStation] = useState("");
  const [residentCount, setResidentCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoEntriesRef = useRef(photoEntries);
  photoEntriesRef.current = photoEntries;

  const moveInDateIso = parseMoveInDateInput(moveInDateText);

  const priceNum = Number(price);
  const residentCountNum = Number(residentCount);
  const isFormComplete =
    photoEntries.length > 0 &&
    price !== "" &&
    Number.isFinite(priceNum) &&
    priceNum > 0 &&
    moveInDateIso !== null &&
    nearestStation.trim().length > 0 &&
    residentCount !== "" &&
    Number.isInteger(residentCountNum) &&
    residentCountNum > 0;

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

  const handleFilesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    const newEntries = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotoEntries((prev) => [...prev, ...newEntries]);
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoEntries((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateMoveInDate() || !isFormComplete || !moveInDateIso) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      photoEntries.forEach((entry) => formData.append("photos", entry.file));
      formData.append("borough", BOROUGH_ENUM_VALUES[location.borough] ?? location.borough);
      formData.append("neighborhood", location.neighborhood);
      formData.append("price", price);
      formData.append("moveInDate", moveInDateIso);
      formData.append("nearestStation", nearestStation);
      formData.append("residentCount", residentCount);

      await createListing(formData);
      photoEntriesRef.current.forEach((entry) => URL.revokeObjectURL(entry.url));
      navigate("/search");
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setError(message ?? "Could not create your listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <ProfileMenuButton />
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
              <label
                className="border-2 border-dashed border-outline rounded-lg flex flex-col items-center justify-center p-stack-md h-32 cursor-pointer hover:bg-surface-container-low transition-colors bg-surface-container-lowest"
                htmlFor="photo-upload"
              >
                <span className="material-symbols-outlined text-outline text-3xl mb-2">photo_camera</span>
                <span className="font-label-sm text-label-sm text-outline text-center">Tap to upload photos</span>
                <input
                  accept="image/*"
                  className="sr-only"
                  id="photo-upload"
                  multiple
                  onChange={handleFilesSelected}
                  type="file"
                />
              </label>

              {/* Thumbnails of selected photos */}
              {photoEntries.map((entry, index) => (
                <div className="rounded-lg overflow-hidden h-32 relative group bg-surface-container-high" key={entry.url}>
                  <img alt={`Selected photo ${index + 1}`} className="w-full h-full object-cover" src={entry.url} />
                  <button
                    aria-label="Remove photo"
                    className="absolute inset-0 bg-on-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => handleRemovePhoto(index)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-on-primary">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Location Section */}
          <BoroughNeighborhoodDropdown onChange={setLocation} variant="labeled" />

          {/* Price Section */}
          <section>
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface" htmlFor="price">
              Monthly Rent (USD)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-body-lg text-body-lg text-on-surface-variant">$</span>
              <input
                className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT pl-8 pr-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                id="price"
                min={1}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                type="number"
                value={price}
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
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface" htmlFor="nearestStation">
              Nearest Subway Station
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              id="nearestStation"
              onChange={(e) => setNearestStation(e.target.value)}
              placeholder="e.g., 14 St–Union Sq (5 min walk)"
              type="text"
              value={nearestStation}
            />
          </section>

          {/* Number of Residents Section */}
          <section>
            <label className="block font-headline-sm text-headline-sm mb-stack-sm text-on-surface" htmlFor="residentCount">
              Current Number of Residents (including you)
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              id="residentCount"
              min={1}
              onChange={(e) => setResidentCount(e.target.value)}
              type="number"
              value={residentCount}
            />
          </section>

          {/* CTA */}
          <div className="pt-stack-md">
            {error && <p className="font-label-sm text-label-sm text-error mb-2 text-center">{error}</p>}
            <PrimaryButton disabled={!isFormComplete || isSubmitting} type="submit">
              <span>{isSubmitting ? "Posting..." : "Post Listing"}</span>
              <span className="material-symbols-outlined">check_circle</span>
            </PrimaryButton>
          </div>
        </form>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <BottomNavBar unreadCount={unreadCount} />
    </div>
  );
}
