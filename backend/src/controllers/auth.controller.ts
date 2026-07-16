import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AUTH_COOKIE_NAME } from "../middleware/auth";

const NYU_NETID_EMAIL_REGEX = /^[a-zA-Z0-9]+@nyu\.edu$/;
const SALT_ROUNDS = 10;
const TOKEN_TTL = "7d";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, { expiresIn: TOKEN_TTL });
}

function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!NYU_NETID_EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Email must be a valid NetID@nyu.edu address" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, passwordHash, isVerified: true },
  });

  return res.status(201).json({ userId: user.id, isVerified: user.isVerified });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(user.id);
  setAuthCookie(res, token);

  return res.status(200).json({ userId: user.id, isVerified: user.isVerified });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME);
  return res.status(200).json({ success: true });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  return res.status(200).json({
    userId: user.id,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    hasProfile: profile !== null,
  });
}
