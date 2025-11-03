import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + conditional classNames cleanly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fixes low-resolution poster images (IMDb or TMDB).
 * Returns a better-quality version of the image if possible.
 */
export function getBestPosterUrl(raw?: string | null): string | null {
  if (!raw || typeof raw !== "string") return null;

  // IMDb low-res pattern → upgrade to UX1000
  if (/_V1_UX\d+/.test(raw)) {
    return raw.replace(/_V1_UX\d+/g, "_V1_UX1000");
  }

  // IMDb generic small image → upgrade
  if (raw.includes("._V1_") && !/_V1_UX\d+/.test(raw)) {
    return raw.replace("._V1_", "._V1_UX1000_");
  }

  // TMDB relative path → add w500 prefix
  if (raw.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${raw}`;
  }

  // TMDB full URL but small size
  if (/image\.tmdb\.org\/t\/p\//.test(raw)) {
    return raw.replace(/\/w\d+\//, "/w500/");
  }

  return raw;
}
