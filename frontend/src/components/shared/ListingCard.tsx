import { Link } from "react-router-dom";
import MatchScoreBadge from "./MatchScoreBadge";
import { ListingSearchResult } from "../../api/listings";

function formatMoveInLabel(moveInDate: string): string {
  const date = new Date(moveInDate);
  return `Move-in: ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function ListingCard({ listing }: { listing: ListingSearchResult }) {
  const photoUrl = listing.photos[0] ? `${import.meta.env.VITE_API_BASE_URL}${listing.photos[0]}` : undefined;
  const posterInitial = listing.posterName.charAt(0).toUpperCase();

  return (
    <Link
      className="block cursor-pointer bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-200"
      to={`/listings/${listing.id}`}
    >
      <div className="relative w-full pt-[75%] bg-surface-variant">
        {photoUrl && (
          <img alt={listing.neighborhood} className="absolute inset-0 w-full h-full object-cover" src={photoUrl} />
        )}
        <MatchScoreBadge className="absolute top-3 right-3 z-10" score={listing.matchScore} />
      </div>
      <div className="p-4 flex flex-col gap-stack-sm">
        {/* Header & Price */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">{listing.neighborhood}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{listing.borough}</p>
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
            {formatMoveInLabel(listing.moveInDate)}
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
          <span>{listing.nearestStation}</span>
        </div>
        {/* Footer / Poster */}
        <div className="flex items-center gap-2 mt-2 pt-2">
          <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-sm">
            {posterInitial}
          </div>
          <span className="font-label-sm text-label-sm text-on-surface">Posted by {listing.posterName}</span>
        </div>
      </div>
    </Link>
  );
}
