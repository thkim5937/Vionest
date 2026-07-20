import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type GuestFrequency = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "RARE";

export interface ProfileInput {
  gender: Gender;
  bedTimeBlock: number;
  wakeTimeBlock: number;
  smoking: boolean;
  cooking: boolean;
  pets: boolean;
  guestFrequency: GuestFrequency;
}

export interface Profile extends ProfileInput {
  id: string;
  userId: string;
}

export async function createProfile(data: ProfileInput): Promise<Profile> {
  const { data: profile } = await client.post<Profile>("/api/profile", data);
  return profile;
}

export async function getProfile(): Promise<Profile> {
  const { data: profile } = await client.get<Profile>("/api/profile/me");
  return profile;
}
