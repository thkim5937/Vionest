import { useState } from "react";
import { isAxiosError } from "axios";
import PrimaryButton from "./PrimaryButton";
import { Gender, GuestFrequency, ProfileInput } from "../../api/profile";

// 12 fixed 2-hour blocks (index 0-11), per PRD 4.1 / TRD 3.2 Profile.bedTimeBlock / wakeTimeBlock.
export const TIME_BLOCKS = [
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
export const GUEST_FREQUENCIES: { value: GuestFrequency; label: string }[] = [
  { value: "WEEKLY", label: "At least once a week" },
  { value: "MONTHLY", label: "1–2 times a month" },
  { value: "QUARTERLY", label: "1–2 times a quarter" },
  { value: "RARE", label: "Almost never" },
];

interface ProfileFormProps {
  initialValues?: ProfileInput;
  submitLabel: string;
  onSubmit: (values: ProfileInput) => Promise<void>;
  onCancel?: () => void;
}

export default function ProfileForm({ initialValues, submitLabel, onSubmit, onCancel }: ProfileFormProps) {
  const [gender, setGender] = useState<Gender | null>(initialValues?.gender ?? null);
  const [bedTimeBlock, setBedTimeBlock] = useState(initialValues?.bedTimeBlock ?? 0);
  const [wakeTimeBlock, setWakeTimeBlock] = useState(initialValues?.wakeTimeBlock ?? 0);
  const [smoking, setSmoking] = useState<boolean | null>(initialValues?.smoking ?? null);
  const [cooking, setCooking] = useState<boolean | null>(initialValues?.cooking ?? null);
  const [pets, setPets] = useState<boolean | null>(initialValues?.pets ?? null);
  const [guestFrequency, setGuestFrequency] = useState<GuestFrequency | null>(initialValues?.guestFrequency ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isComplete = gender !== null && smoking !== null && cooking !== null && pets !== null && guestFrequency !== null;

  const handleSubmit = async () => {
    if (gender === null || smoking === null || cooking === null || pets === null || guestFrequency === null) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ gender, bedTimeBlock, wakeTimeBlock, smoking, cooking, pets, guestFrequency });
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setError(message ?? "Could not save your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="flex flex-col gap-stack-lg">
        {/* Gender Section */}
        <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
          <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Gender</legend>
          <div className="flex flex-col gap-3">
            {/* values match Profile.gender enum (MALE/FEMALE/OTHER) — hard filter, not a scoring item */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={gender === "MALE"}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="gender"
                onChange={() => setGender("MALE")}
                type="radio"
                value="MALE"
              />
              <span className="font-body-md text-body-md">Male</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={gender === "FEMALE"}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="gender"
                onChange={() => setGender("FEMALE")}
                type="radio"
                value="FEMALE"
              />
              <span className="font-body-md text-body-md">Female</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={gender === "OTHER"}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="gender"
                onChange={() => setGender("OTHER")}
                type="radio"
                value="OTHER"
              />
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
              <select
                className="w-full rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md font-body-md focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                id="bedtime"
                name="bedtime"
                onChange={(e) => setBedTimeBlock(Number(e.target.value))}
                value={bedTimeBlock}
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
              <select
                className="w-full rounded-DEFAULT border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md font-body-md focus:border-nyu-violet focus:ring-1 focus:ring-nyu-violet"
                id="wakeup"
                name="wakeup"
                onChange={(e) => setWakeTimeBlock(Number(e.target.value))}
                value={wakeTimeBlock}
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
              <input
                checked={smoking === true}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="smoking"
                onChange={() => setSmoking(true)}
                type="radio"
                value="true"
              />
              <span className="font-body-md text-body-md">Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={smoking === false}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="smoking"
                onChange={() => setSmoking(false)}
                type="radio"
                value="false"
              />
              <span className="font-body-md text-body-md">No</span>
            </label>
          </div>
        </fieldset>

        {/* Cooking Section */}
        <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
          <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Cooking</legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={cooking === true}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="cooking"
                onChange={() => setCooking(true)}
                type="radio"
                value="true"
              />
              <span className="font-body-md text-body-md">Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={cooking === false}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="cooking"
                onChange={() => setCooking(false)}
                type="radio"
                value="false"
              />
              <span className="font-body-md text-body-md">No</span>
            </label>
          </div>
        </fieldset>

        {/* Pets Section */}
        <fieldset className="bg-surface p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
          <legend className="font-headline-sm text-headline-sm text-on-surface mb-2">Pets</legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={pets === true}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="pets"
                onChange={() => setPets(true)}
                type="radio"
                value="true"
              />
              <span className="font-body-md text-body-md">Yes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                checked={pets === false}
                className="h-[1.15em] w-[1.15em] accent-nyu-violet border-2 border-outline-variant rounded-full"
                name="pets"
                onChange={() => setPets(false)}
                type="radio"
                value="false"
              />
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
                <input
                  checked={guestFrequency === value}
                  className="peer sr-only"
                  name="guests"
                  onChange={() => setGuestFrequency(value)}
                  type="radio"
                  value={value}
                />
                <div className="px-4 py-2 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-body-md text-body-md peer-checked:bg-nyu-violet peer-checked:text-on-primary peer-checked:border-nyu-violet transition-colors">
                  {label}
                </div>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      {/* Sticky CTA Bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant p-margin-mobile shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20">
        {error && <p className="font-label-sm text-label-sm text-error mb-2 text-center">{error}</p>}
        {onCancel ? (
          <div className="flex gap-3">
            <button
              className="flex-1 border border-outline-variant text-on-surface-variant font-headline-sm text-headline-sm py-3 rounded-lg hover:bg-surface-container transition-colors"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <PrimaryButton className="flex-1" disabled={!isComplete || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Saving..." : submitLabel}
            </PrimaryButton>
          </div>
        ) : (
          <PrimaryButton disabled={!isComplete || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Saving..." : submitLabel}
          </PrimaryButton>
        )}
      </div>
    </>
  );
}
