import MatchScoreBadge from "../components/shared/MatchScoreBadge";
import NyuVerifiedBadge from "../components/shared/NyuVerifiedBadge";
import PrimaryButton from "../components/shared/PrimaryButton";

export default function ListingDetailPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pb-24 md:pb-0">
      {/* Top Navigation (Desktop Only) */}
      <header className="hidden md:flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto bg-surface-container-lowest sticky top-0 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface">VioNest</div>
        <nav className="flex gap-6">
          <a className="text-on-surface-variant font-body-md hover:bg-surface-container-high px-3 py-2 rounded-lg transition-colors" href="#">
            Home
          </a>
          <a className="text-primary font-body-md font-bold hover:bg-surface-container-high px-3 py-2 rounded-lg transition-colors" href="#">
            Search
          </a>
          <a className="text-on-surface-variant font-body-md hover:bg-surface-container-high px-3 py-2 rounded-lg transition-colors" href="#">
            Saved
          </a>
          <a className="text-on-surface-variant font-body-md hover:bg-surface-container-high px-3 py-2 rounded-lg transition-colors" href="#">
            Inbox
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-3xl mx-auto bg-surface-container-lowest">
        {/* Hero Image Section */}
        <div className="relative w-full h-[353px] md:h-[442px] bg-surface-variant">
          {/* TODO: replace with listing.photos[0] */}
          <a className="absolute top-4 left-4 md:hidden w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10 transition-transform active:scale-95" href="#">
            <span className="material-symbols-outlined">arrow_back</span>
          </a>
        </div>

        {/* Content Section */}
        <div className="px-margin-mobile md:px-margin-desktop py-6 flex flex-col gap-6">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                {/* TODO: replace with listing building name / address (not an explicit Listing field — derive from neighborhood/borough + nearestStation) */}
                <h1 className="font-headline-md text-headline-md text-on-surface">Gramercy Green</h1>
                <p className="font-body-md text-on-surface-variant">310 3rd Ave, New York, NY 10010</p>
              </div>
              {/* TODO: replace with computed matchScore (search/CLAUDE.md match-score algorithm) */}
              <MatchScoreBadge score={92} />
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-md mt-2">
              <span className="material-symbols-outlined text-[18px]">subway</span>
              {/* TODO: bind to listing.nearestStation */}
              <span>6 at 23rd St · 2 min walk</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface font-body-md font-medium mt-1">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              {/* TODO: bind to listing.moveInDate / listing.residentCount */}
              <span>Move-in: Immediate · 1 Resident</span>
            </div>
            <div className="mt-4 font-display-price text-display-price text-on-surface">
              {/* TODO: bind to listing.price */}
              $2,400<span className="font-body-md text-on-surface-variant font-normal">/mo</span>
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* About the Space */}
          <section className="flex flex-col gap-3">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">About the Space</h2>
            {/* TODO: not a documented Listing field (listing/CLAUDE.md) — decorative copy only, no data binding yet */}
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Beautifully sunlit room in a modern Gramercy apartment. The space features high ceilings, hardwood floors, and a spacious
              closet. You'll be sharing the common areas with one other clean and quiet NYU graduate student.
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
          <section className="flex flex-col gap-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">About Your Host</h2>
            <div className="flex items-center gap-4">
              {/* TODO: replace with poster's avatar image */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-variant" />
              <div>
                {/* TODO: bind to poster name */}
                <div className="font-headline-sm text-headline-sm text-on-surface">David</div>
                <NyuVerifiedBadge className="mt-1" />
              </div>
            </div>
            {/* TODO: bind to poster's Profile fields (gender, bedTimeBlock, wakeTimeBlock, smoking, cooking, pets, guestFrequency) */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">Male</span>
              <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">Bedtime: 10PM–12AM</span>
              <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">Wake-up: 6AM–8AM</span>
              <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">Non-smoker</span>
              <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">Cooks often</span>
              <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">No pets</span>
              <span className="bg-surface-container px-3 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant">Rarely has guests</span>
            </div>
          </section>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 w-full bg-surface-container-lowest border-t border-outline-variant p-4 z-40 md:relative md:border-none md:p-6 md:max-w-3xl md:mx-auto md:bg-transparent">
        {/* TODO: wire onClick -> POST /api/conversations (create/find conversation from this listing) */}
        <PrimaryButton>
          <span className="material-symbols-outlined">mail</span>
          Send Message
        </PrimaryButton>
      </div>
    </div>
  );
}
