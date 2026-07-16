import { Request, Response } from "express";
import { Gender, GuestFrequency } from "@prisma/client";
import { prisma } from "../lib/prisma";

const GENDER_VALUES = Object.values(Gender);
const GUEST_FREQUENCY_VALUES = Object.values(GuestFrequency);

interface ProfileInput {
  gender: Gender;
  bedTimeBlock: number;
  wakeTimeBlock: number;
  smoking: boolean;
  cooking: boolean;
  pets: boolean;
  guestFrequency: GuestFrequency;
}

function isTimeBlock(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 11;
}

function parseProfileInput(body: unknown): ProfileInput | null {
  if (typeof body !== "object" || body === null) return null;

  const { gender, bedTimeBlock, wakeTimeBlock, smoking, cooking, pets, guestFrequency } = body as Record<string, unknown>;

  if (typeof gender !== "string" || !GENDER_VALUES.includes(gender as Gender)) return null;
  if (!isTimeBlock(bedTimeBlock) || !isTimeBlock(wakeTimeBlock)) return null;
  if (typeof smoking !== "boolean" || typeof cooking !== "boolean" || typeof pets !== "boolean") return null;
  if (typeof guestFrequency !== "string" || !GUEST_FREQUENCY_VALUES.includes(guestFrequency as GuestFrequency)) return null;

  return {
    gender: gender as Gender,
    bedTimeBlock,
    wakeTimeBlock,
    smoking,
    cooking,
    pets,
    guestFrequency: guestFrequency as GuestFrequency,
  };
}

export async function upsertProfile(req: Request, res: Response) {
  const input = parseProfileInput(req.body);

  if (!input) {
    return res.status(400).json({
      error:
        `Invalid profile payload. Expected gender (${GENDER_VALUES.join("/")}), ` +
        `bedTimeBlock/wakeTimeBlock (integer 0-11), smoking/cooking/pets (boolean), ` +
        `and guestFrequency (${GUEST_FREQUENCY_VALUES.join("/")}).`,
    });
  }

  const userId = req.userId as string;

  const profile = await prisma.profile.upsert({
    where: { userId },
    create: { userId, ...input },
    update: input,
  });

  return res.status(200).json(profile);
}

export async function getMyProfile(req: Request, res: Response) {
  const profile = await prisma.profile.findUnique({ where: { userId: req.userId as string } });

  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  return res.status(200).json(profile);
}
