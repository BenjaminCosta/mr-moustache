const FALLBACK_SITE_URL = "https://example.com";

function resolveSiteUrl(...candidates: Array<string | undefined>) {
  for (const candidate of candidates) {
    const value = candidate?.trim();

    if (!value) {
      continue;
    }

    const absoluteValue = /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;

    try {
      return new URL(absoluteValue).origin;
    } catch {
      // Ignore malformed configuration and try the next safe fallback.
    }
  }

  return FALLBACK_SITE_URL;
}

export const SITE_URL = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
);

// Only the production deployment may be indexed; Vercel previews stay hidden.
export const IS_INDEXABLE =
  !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

// Mr Moustache's Square Online booking site. A Broadbeach-only deep link can
// override it through the environment.
export const SQUARE_BOOKING_URL =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL?.trim() ||
  "https://mr-moustache-barbershop.square.site/";

// Searching by name and address opens the Broadbeach listing, not a bare pin.
export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Mr Moustache Barbershop Broadbeach, Unit 5/2623 Gold Coast Hwy, Broadbeach QLD 4218",
)}`;

// TODO: Replace with the Google Business Profile (reviews) URL once confirmed.
export const GOOGLE_PROFILE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL?.trim() || GOOGLE_MAPS_URL;

// Handle taken from the downloaded clips in mr-moustache-material/.
// TODO: Confirm it is the account that should represent Broadbeach.
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
  "https://www.instagram.com/mr.moustache.barbers/";

/** False while a link still points at a launch placeholder. */
export function isConfiguredUrl(url: string) {
  return !/placeholder|example\.com/i.test(url);
}
