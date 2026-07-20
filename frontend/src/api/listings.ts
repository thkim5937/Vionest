import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export interface Listing {
  id: string;
  posterId: string;
  photos: string[];
  borough: string;
  neighborhood: string;
  price: number;
  moveInDate: string;
  nearestStation: string;
  residentCount: number;
  createdAt: string;
}

export async function createListing(formData: FormData): Promise<Listing> {
  const { data } = await client.post<Listing>("/api/listings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export interface ListingSearchResult {
  id: string;
  posterName: string;
  borough: string;
  neighborhood: string;
  price: number;
  matchScore: number;
  photos: string[];
  moveInDate: string;
  nearestStation: string;
  residentCount: number;
}

export interface ListingSearchParams {
  borough?: string | string[];
  neighborhood?: string | string[];
  minPrice?: number;
  maxPrice?: number;
}

export async function searchListings(params: ListingSearchParams = {}): Promise<ListingSearchResult[]> {
  const { data } = await client.get<{ listings: ListingSearchResult[] }>("/api/listings", { params });
  return data.listings;
}

export interface ListingPoster {
  name: string;
  gender: string;
  bedTimeBlock: number;
  wakeTimeBlock: number;
  smoking: boolean;
  cooking: boolean;
  pets: boolean;
  guestFrequency: string;
}

export interface ListingDetail {
  id: string;
  posterId: string;
  photos: string[];
  borough: string;
  neighborhood: string;
  price: number;
  moveInDate: string;
  nearestStation: string;
  residentCount: number;
  createdAt: string;
  matchScore: number | null;
  poster: ListingPoster | null;
}

export async function getListing(id: string): Promise<ListingDetail> {
  const { data } = await client.get<ListingDetail>(`/api/listings/${id}`);
  return data;
}
