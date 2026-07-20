import { Profile } from "@prisma/client";

const TOTAL_BLOCKS = 12;

const WEIGHTS = {
  sleepSchedule: 5,
  pets: 4,
  smoking: 3,
  guestFrequency: 2,
  cooking: 1,
} as const;

const TOTAL_WEIGHT =
  WEIGHTS.sleepSchedule +
  WEIGHTS.pets +
  WEIGHTS.smoking +
  WEIGHTS.guestFrequency +
  WEIGHTS.cooking;

const GUEST_FREQUENCY_ORDER = ["WEEKLY", "MONTHLY", "QUARTERLY", "RARE"] as const;

function circularBlockDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % TOTAL_BLOCKS;
  return Math.min(diff, TOTAL_BLOCKS - diff);
}

function sleepScheduleScore(a: Profile, b: Profile): number {
  const bedTimeDistance = circularBlockDistance(a.bedTimeBlock, b.bedTimeBlock);
  const wakeTimeDistance = circularBlockDistance(a.wakeTimeBlock, b.wakeTimeBlock);

  const bedTimeSimilarity = 1 - bedTimeDistance / 6;
  const wakeTimeSimilarity = 1 - wakeTimeDistance / 6;

  return ((bedTimeSimilarity + wakeTimeSimilarity) / 2) * WEIGHTS.sleepSchedule;
}

function guestFrequencyScore(a: Profile, b: Profile): number {
  const levelDifference = Math.abs(
    GUEST_FREQUENCY_ORDER.indexOf(a.guestFrequency) -
      GUEST_FREQUENCY_ORDER.indexOf(b.guestFrequency)
  );

  if (levelDifference === 0) return WEIGHTS.guestFrequency;
  if (levelDifference === 1) return WEIGHTS.guestFrequency * 0.5;
  return 0;
}

function exactMatchScore(a: boolean, b: boolean, weight: number): number {
  return a === b ? weight : 0;
}

export function calculateMatchScore(a: Profile, b: Profile): number {
  const points =
    sleepScheduleScore(a, b) +
    exactMatchScore(a.pets, b.pets, WEIGHTS.pets) +
    exactMatchScore(a.smoking, b.smoking, WEIGHTS.smoking) +
    guestFrequencyScore(a, b) +
    exactMatchScore(a.cooking, b.cooking, WEIGHTS.cooking);

  return Math.round((points / TOTAL_WEIGHT) * 100 * 10) / 10;
}
