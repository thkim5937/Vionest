import { describe, expect, it } from "vitest";
import { Profile } from "@prisma/client";
import { calculateMatchScore } from "../matchScore";

function makeProfile(overrides: Partial<Profile>): Profile {
  return {
    id: "profile-id",
    userId: "user-id",
    gender: "OTHER",
    bedTimeBlock: 0,
    wakeTimeBlock: 0,
    smoking: false,
    cooking: false,
    pets: false,
    guestFrequency: "RARE",
    ...overrides,
  } as Profile;
}

describe("calculateMatchScore", () => {
  it("scores a perfect match at 100.0", () => {
    const a = makeProfile({
      bedTimeBlock: 3,
      wakeTimeBlock: 9,
      smoking: false,
      cooking: true,
      pets: true,
      guestFrequency: "MONTHLY",
    });
    const b = makeProfile({
      bedTimeBlock: 3,
      wakeTimeBlock: 9,
      smoking: false,
      cooking: true,
      pets: true,
      guestFrequency: "MONTHLY",
    });

    expect(calculateMatchScore(a, b)).toBe(100.0);
  });

  it("scores complete opposites at 0.0", () => {
    const a = makeProfile({
      bedTimeBlock: 0,
      wakeTimeBlock: 0,
      smoking: false,
      cooking: false,
      pets: false,
      guestFrequency: "WEEKLY",
    });
    const b = makeProfile({
      bedTimeBlock: 6,
      wakeTimeBlock: 6,
      smoking: true,
      cooking: true,
      pets: true,
      guestFrequency: "RARE",
    });

    // sleep: 0 pts, pets: 0, smoking: 0, guest (3-level gap): 0, cooking: 0
    expect(calculateMatchScore(a, b)).toBe(0.0);
  });

  it("gives half sleep-schedule credit when bed and wake times are each 3 blocks apart", () => {
    const a = makeProfile({ bedTimeBlock: 0, wakeTimeBlock: 0 });
    const b = makeProfile({ bedTimeBlock: 3, wakeTimeBlock: 3 });

    // bed distance 3 -> similarity 1 - 3/6 = 0.5; wake same -> 0.5
    // avg 0.5 * weight 5 = 2.5; pets/smoking/cooking match (false=false) = 4+3+1=8
    // guest matches (RARE=RARE) = 2; total = 2.5 + 8 + 2 = 12.5
    // 12.5 / 15 * 100 = 83.3
    expect(calculateMatchScore(a, b)).toBe(83.3);
  });

  it("gives zero sleep-schedule credit when bed and wake times are maximally apart (6 blocks)", () => {
    const a = makeProfile({ bedTimeBlock: 0, wakeTimeBlock: 0 });
    const b = makeProfile({ bedTimeBlock: 6, wakeTimeBlock: 6 });

    // bed/wake distance 6 -> similarity 0 each -> sleep points = 0
    // pets/smoking/cooking match = 4+3+1=8; guest matches = 2
    // total = 10 / 15 * 100 = 66.7
    expect(calculateMatchScore(a, b)).toBe(66.7);
  });

  it("handles asymmetric bed/wake distances with wraparound across midnight", () => {
    const a = makeProfile({ bedTimeBlock: 11, wakeTimeBlock: 2 });
    const b = makeProfile({ bedTimeBlock: 1, wakeTimeBlock: 5 });

    // bed: |11-1|=10 -> circular min(10, 12-10)=2 -> similarity 1-2/6=0.6667
    // wake: |2-5|=3 -> circular min(3,9)=3 -> similarity 1-3/6=0.5
    // avg = 0.58333 * 5 = 2.9167
    // pets/smoking/cooking match (all false) = 8; guest matches (RARE) = 2
    // total = 2.9167 + 8 + 2 = 12.9167 -> /15*100 = 86.1
    expect(calculateMatchScore(a, b)).toBe(86.1);
  });

  it("awards 50% guest-frequency credit for a 1-level gap (WEEKLY vs MONTHLY)", () => {
    const a = makeProfile({ guestFrequency: "WEEKLY" });
    const b = makeProfile({ guestFrequency: "MONTHLY" });

    // sleep matches (both 0,0) = 5; pets/smoking/cooking match = 8
    // guest 1-level gap = 2*0.5 = 1; total = 5+8+1=14 -> /15*100 = 93.3
    expect(calculateMatchScore(a, b)).toBe(93.3);
  });

  it("awards 50% guest-frequency credit for a 1-level gap (MONTHLY vs QUARTERLY)", () => {
    const a = makeProfile({ guestFrequency: "MONTHLY" });
    const b = makeProfile({ guestFrequency: "QUARTERLY" });

    expect(calculateMatchScore(a, b)).toBe(93.3);
  });

  it("awards 0% guest-frequency credit for a 2-level gap (WEEKLY vs QUARTERLY)", () => {
    const a = makeProfile({ guestFrequency: "WEEKLY" });
    const b = makeProfile({ guestFrequency: "QUARTERLY" });

    // sleep matches = 5; pets/smoking/cooking match = 8; guest 2-level gap = 0
    // total = 13 -> /15*100 = 86.7
    expect(calculateMatchScore(a, b)).toBe(86.7);
  });

  it("awards 0% guest-frequency credit for a 3-level gap (WEEKLY vs RARE)", () => {
    const a = makeProfile({ guestFrequency: "WEEKLY" });
    const b = makeProfile({ guestFrequency: "RARE" });

    expect(calculateMatchScore(a, b)).toBe(86.7);
  });

  it("scores a mismatch on pets only", () => {
    const a = makeProfile({ pets: true });
    const b = makeProfile({ pets: false });

    // sleep matches = 5; smoking/cooking match = 4; guest matches = 2; pets = 0
    // total = 11 -> /15*100 = 73.3
    expect(calculateMatchScore(a, b)).toBe(73.3);
  });

  it("scores a mismatch on smoking only", () => {
    const a = makeProfile({ smoking: true });
    const b = makeProfile({ smoking: false });

    // sleep matches = 5; pets/cooking match = 5; guest matches = 2; smoking = 0
    // total = 12 -> /15*100 = 80.0
    expect(calculateMatchScore(a, b)).toBe(80.0);
  });

  it("scores a mismatch on cooking only", () => {
    const a = makeProfile({ cooking: true });
    const b = makeProfile({ cooking: false });

    // sleep matches = 5; pets/smoking match = 7; guest matches = 2; cooking = 0
    // total = 14 -> /15*100 = 93.3
    expect(calculateMatchScore(a, b)).toBe(93.3);
  });

  it("is symmetric regardless of argument order", () => {
    const a = makeProfile({
      bedTimeBlock: 2,
      wakeTimeBlock: 10,
      smoking: true,
      cooking: false,
      pets: true,
      guestFrequency: "QUARTERLY",
    });
    const b = makeProfile({
      bedTimeBlock: 8,
      wakeTimeBlock: 4,
      smoking: false,
      cooking: true,
      pets: false,
      guestFrequency: "WEEKLY",
    });

    expect(calculateMatchScore(a, b)).toBe(calculateMatchScore(b, a));
  });

  it("computes a mixed-signal combination across all five categories", () => {
    const a = makeProfile({
      bedTimeBlock: 0,
      wakeTimeBlock: 0,
      smoking: false,
      cooking: true,
      pets: true,
      guestFrequency: "WEEKLY",
    });
    const b = makeProfile({
      bedTimeBlock: 2,
      wakeTimeBlock: 1,
      smoking: true,
      cooking: false,
      pets: true,
      guestFrequency: "MONTHLY",
    });

    // bed distance 2 -> similarity 1-2/6=0.6667; wake distance 1 -> 1-1/6=0.8333
    // avg = 0.75 * 5 = 3.75
    // pets match = 4; smoking mismatch = 0; cooking mismatch = 0
    // guest 1-level gap = 2*0.5 = 1
    // total = 3.75 + 4 + 0 + 0 + 1 = 8.75 -> /15*100 = 58.3
    expect(calculateMatchScore(a, b)).toBe(58.3);
  });
});
