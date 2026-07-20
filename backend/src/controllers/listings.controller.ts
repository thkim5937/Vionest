import fs from "fs";
import { Request, Response } from "express";
import { Borough } from "@prisma/client";
import { displayNameFromEmail } from "../lib/displayName";
import { prisma } from "../lib/prisma";
import { calculateMatchScore } from "../services/matchScore";

const BOROUGH_VALUES = Object.values(Borough);

interface ListingInput {
  borough: Borough;
  neighborhood: string;
  price: number;
  moveInDate: Date;
  nearestStation: string;
  residentCount: number;
}

function parseListingInput(body: unknown): ListingInput | null {
  if (typeof body !== "object" || body === null) return null;

  const { borough, neighborhood, price, moveInDate, nearestStation, residentCount } = body as Record<string, unknown>;

  if (typeof borough !== "string" || !BOROUGH_VALUES.includes(borough as Borough)) return null;
  if (typeof neighborhood !== "string" || neighborhood.trim().length === 0) return null;
  if (typeof nearestStation !== "string" || nearestStation.trim().length === 0) return null;

  const priceNum = Number(price);
  if (!Number.isInteger(priceNum) || priceNum <= 0) return null;

  const residentCountNum = Number(residentCount);
  if (!Number.isInteger(residentCountNum) || residentCountNum <= 0) return null;

  if (typeof moveInDate !== "string") return null;
  const moveInDateValue = new Date(moveInDate);
  if (Number.isNaN(moveInDateValue.getTime())) return null;

  return {
    borough: borough as Borough,
    neighborhood,
    price: priceNum,
    moveInDate: moveInDateValue,
    nearestStation,
    residentCount: residentCountNum,
  };
}

function serializeListing<T extends { photos: string }>(listing: T) {
  return { ...listing, photos: JSON.parse(listing.photos) as string[] };
}

function deleteUploadedFiles(files: Express.Multer.File[]) {
  for (const file of files) {
    fs.unlink(file.path, () => {});
  }
}

interface ListingSearchFilters {
  borough?: Borough[];
  neighborhood?: string[];
  minPrice?: number;
  maxPrice?: number;
}

function parseListingSearchFilters(query: Request["query"]): ListingSearchFilters | null {
  const { borough, neighborhood, minPrice, maxPrice } = query;
  const filters: ListingSearchFilters = {};

  if (borough !== undefined) {
    const boroughValues = Array.isArray(borough) ? borough : [borough];
    if (!boroughValues.every((b): b is Borough => typeof b === "string" && BOROUGH_VALUES.includes(b as Borough))) {
      return null;
    }
    filters.borough = boroughValues as Borough[];
  }

  if (neighborhood !== undefined) {
    const neighborhoodValues = Array.isArray(neighborhood) ? neighborhood : [neighborhood];
    if (!neighborhoodValues.every((n): n is string => typeof n === "string" && n.trim().length > 0)) {
      return null;
    }
    filters.neighborhood = neighborhoodValues as string[];
  }

  if (minPrice !== undefined) {
    if (typeof minPrice !== "string") return null;
    const minPriceNum = Number(minPrice);
    if (!Number.isInteger(minPriceNum) || minPriceNum < 0) return null;
    filters.minPrice = minPriceNum;
  }

  if (maxPrice !== undefined) {
    if (typeof maxPrice !== "string") return null;
    const maxPriceNum = Number(maxPrice);
    if (!Number.isInteger(maxPriceNum) || maxPriceNum < 0) return null;
    filters.maxPrice = maxPriceNum;
  }

  return filters;
}

export async function createListing(req: Request, res: Response) {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  if (files.length === 0) {
    return res.status(400).json({ error: "At least one photo is required" });
  }

  const userId = req.userId as string;

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    deleteUploadedFiles(files);
    return res.status(403).json({ error: "Complete your profile before posting a listing" });
  }

  const input = parseListingInput(req.body);
  if (!input) {
    deleteUploadedFiles(files);
    return res.status(400).json({
      error:
        `Invalid listing payload. Expected borough (${BOROUGH_VALUES.join("/")}), neighborhood, ` +
        `price (positive integer), moveInDate (date), nearestStation, and residentCount (positive integer).`,
    });
  }

  const photoUrls = files.map((file) => `/uploads/${file.filename}`);

  const listing = await prisma.listing.create({
    data: {
      posterId: userId,
      photos: JSON.stringify(photoUrls),
      ...input,
    },
  });

  return res.status(201).json(serializeListing(listing));
}

export async function listListings(req: Request, res: Response) {
  const userId = req.userId as string;

  const requesterProfile = await prisma.profile.findUnique({ where: { userId } });
  if (!requesterProfile) {
    return res.status(403).json({ error: "Complete your profile before searching listings" });
  }

  const filters = parseListingSearchFilters(req.query);
  if (!filters) {
    return res.status(400).json({
      error:
        `Invalid search filters. Expected borough (${BOROUGH_VALUES.join("/")}), neighborhood, ` +
        `minPrice, and maxPrice (non-negative integers).`,
    });
  }

  const listings = await prisma.listing.findMany({
    where: {
      ...(filters.borough && { borough: { in: filters.borough } }),
      ...(filters.neighborhood && {
        OR: filters.neighborhood.map((neighborhood) => ({ neighborhood: { contains: neighborhood } })),
      }),
      ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
        price: {
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        },
      }),
      poster: { profile: { gender: requesterProfile.gender } },
    },
    include: { poster: { include: { profile: true } } },
  });

  const results = listings.map((listing) => {
    const posterProfile = listing.poster.profile!;

    return {
      id: listing.id,
      posterName: displayNameFromEmail(listing.poster.email),
      borough: listing.borough,
      neighborhood: listing.neighborhood,
      price: listing.price,
      matchScore: calculateMatchScore(requesterProfile, posterProfile),
      photos: JSON.parse(listing.photos) as string[],
      moveInDate: listing.moveInDate,
      nearestStation: listing.nearestStation,
      residentCount: listing.residentCount,
    };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);

  return res.status(200).json({ listings: results });
}

export async function getListing(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId as string;

  const requesterProfile = await prisma.profile.findUnique({ where: { userId } });
  if (!requesterProfile) {
    return res.status(403).json({ error: "Complete your profile before viewing listings" });
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      poster: {
        include: { profile: true },
      },
    },
  });

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const { poster, ...rest } = listing;

  return res.status(200).json({
    ...serializeListing(rest),
    matchScore: poster.profile ? calculateMatchScore(requesterProfile, poster.profile) : null,
    poster: poster.profile
      ? {
          name: displayNameFromEmail(poster.email),
          gender: poster.profile.gender,
          bedTimeBlock: poster.profile.bedTimeBlock,
          wakeTimeBlock: poster.profile.wakeTimeBlock,
          smoking: poster.profile.smoking,
          cooking: poster.profile.cooking,
          pets: poster.profile.pets,
          guestFrequency: poster.profile.guestFrequency,
        }
      : null,
  });
}
