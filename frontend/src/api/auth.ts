import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export interface AuthUser {
  userId: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  hasProfile: boolean;
}

export interface SignupResult {
  userId: string;
  isVerified: boolean;
}

export interface LoginResult {
  userId: string;
  isVerified: boolean;
}

export async function signup(email: string, password: string): Promise<SignupResult> {
  const { data } = await client.post<SignupResult>("/api/auth/signup", { email, password });
  return data;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const { data } = await client.post<LoginResult>("/api/auth/login", { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await client.post("/api/auth/logout");
}

export async function me(): Promise<AuthUser> {
  const { data } = await client.get<AuthUser>("/api/auth/me");
  return data;
}
