import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Media } from "@/payload-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getServerUrl(): string {
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

/**
 * Extract URL from a Payload Media field
 * Handles both populated Media objects and unpopulated number references
 */
export function getMediaUrl(media: number | Media | null | undefined): string | undefined {
  if (!media) return undefined;
  if (typeof media === "number") return undefined;
  return media.url || undefined;
}
