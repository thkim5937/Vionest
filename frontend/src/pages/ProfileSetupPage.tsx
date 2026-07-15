// 12 fixed 2-hour blocks (index 0-11), per PRD 4.1 / TRD 3.2 Profile.bedTimeBlock / wakeTimeBlock.
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

// 4 fixed levels, per PRD 4.1 / TRD 3.2 Profile.guestFrequency (corrected from the Stitch
// mock's mismatched "yearly" option to match the documented WEEKLY/MONTHLY/QUARTERLY/RARE enum).
const GUEST_FREQUENCIES: { value: string; label: string }[] = [
  { value: "WEEKLY", label: "At least once a week" },
  { value: "MONTHLY", label: "1–2 times a month" },
  { value: "QUARTERLY", label: "1–2 times a quarter" },
  { value: "RARE", label: "Almost never" },
];

export default function ProfileSetupPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased">
      {/* Top Navigation (Transactional, minimal nav) */}
      <header className="flex justify-between items-center px-margin-mobile py-4 w-full sticky top-0 bg-surface-container-lowest z-10">
        <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface">
          VioNest
          <div className="w-px h-5 bg-outline-variant mx-1" />
          <span className="material-symbols-outlined text-nyu-violet [font-variation-settings:'FILL'_1]">local_fire_department</span>
        </div>
        <button className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-high transition-colors" type="button">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="px-margin-mobile pb-24 max-w-md mx-auto w-full">
        {/* Header Section */}
        <div className="py-stack-lg">
          <h1 className="font-headline-md text-headline-md mb-stack-sm text-nyu-violet">Set Up Your Lifestyle Profile</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            This helps us match you with compatible listings and tenants.
          </p>
        </div>

        <form className="flex flex-col gap-stack-lg">
          {/* Gender Section */}
          <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
            <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Gender</legend>
            <div className="flex flex-col gap-3">
              {/* TODO: values match Profile.gender enum (MALE/FEMALE/OTHER) — hard filter, not a scoring item */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="gender" type="radio" value="MALE" />
                <span className="font-body-md text-body-md">Male</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="gender" type="radio" value="FEMALE" />
                <span className="font-body-md text-body-md">Female</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="gender" type="radio" value="OTHER" />
                <span className="font-body-md text-body-md">Other</span>
              </label>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 border-t border-outline-variant pt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">info</span> Used to filter listings by same gender
            </p>
          </fieldset>

          {/* Sleep Schedule Section */}
          <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
            <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Sleep Schedule</legend>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="bedtime">
                  Bedtime
                </label>
                {/* TODO: bind to Profile.bedTimeBlock (int 0-11) */}
                <select
                  className="w-full rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md font-body-md focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                  id="bedtime"
                  name="bedtime"
                >
                  {TIME_BLOCKS.map((label, blockIndex) => (
                    <option key={blockIndex} value={blockIndex}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="wakeup">
                  Wake-up Time
                </label>
                {/* TODO: bind to Profile.wakeTimeBlock (int 0-11) */}
                <select
                  className="w-full rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md font-body-md focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                  id="wakeup"
                  name="wakeup"
                >
                  {TIME_BLOCKS.map((label, blockIndex) => (
                    <option key={blockIndex} value={blockIndex}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Smoking Section */}
          <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
            <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Smoking</legend>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="smoking" type="radio" value="true" />
                <span className="font-body-md text-body-md">Yes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="smoking" type="radio" value="false" />
                <span className="font-body-md text-body-md">No</span>
              </label>
            </div>
          </fieldset>

          {/* Cooking Section */}
          <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
            <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Cooking</legend>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="cooking" type="radio" value="true" />
                <span className="font-body-md text-body-md">Yes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="cooking" type="radio" value="false" />
                <span className="font-body-md text-body-md">No</span>
              </label>
            </div>
          </fieldset>

          {/* Pets Section */}
          <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
            <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Pets</legend>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="pets" type="radio" value="true" />
                <span className="font-body-md text-body-md">Yes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full" name="pets" type="radio" value="false" />
                <span className="font-body-md text-body-md">No</span>
              </label>
            </div>
          </fieldset>

          {/* Guest Frequency Section */}
          <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
            <legend className="font-headline-sm text-headline-sm text-on-surface mb-3">Guest Frequency</legend>
            <div className="flex flex-wrap gap-2">
              {GUEST_FREQUENCIES.map(({ value, label }) => (
                <label className="cursor-pointer" key={value}>
                  <input className="peer sr-only" name="guests" type="radio" value={value} />
                  <div className="px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-body-md text-body-md peer-checked:bg-nyu-violet peer-checked:text-on-primary peer-checked:border-nyu-violet transition-colors">
                    {label}
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </form>
      </main>

      {/* Sticky CTA Bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant p-margin-mobile shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20">
        {/* TODO: wire onClick -> POST /api/profile, then navigate to listing creation or search */}
        <button className="w-full bg-nyu-violet text-on-primary font-headline-sm text-headline-sm py-3 rounded-lg hover:opacity-90 transition-colors active:scale-[0.98]" type="button">
          Complete Profile
        </button>
      </div>
    </div>
  );
}
