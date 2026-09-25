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

// Mr Moustache's Square Online booking site, covering both barbershops.
export const SQUARE_BOOKING_URL =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL?.trim() ||
  "https://mr-moustache-barbershop.square.site/";

// TODO: Replace with each shop's own Square Appointments deep link. Until then
// both fall back to the shared Square site above.
export const SQUARE_BOOKING_URL_SURFERS_PARADISE =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_SURFERS_PARADISE?.trim() ||
  SQUARE_BOOKING_URL;

export const SQUARE_BOOKING_URL_BROADBEACH =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_BROADBEACH?.trim() ||
  SQUARE_BOOKING_URL;

function mapsSearchUrl(query: string, placeId?: string) {
  const params = new URLSearchParams({ api: "1", query });
  if (placeId) params.set("query_place_id", placeId);
  return `https://www.google.com/maps/search/?${params}`;
}

function mapsDirectionsUrl(destination: string) {
  const params = new URLSearchParams({ api: "1", destination });
  return `https://www.google.com/maps/dir/?${params}`;
}

// Searching by name and address opens each shop's listing, not a bare pin.
export const GOOGLE_MAPS_URL_SURFERS_PARADISE = mapsSearchUrl(
  "Mr. Moustache Barbershop Surfers Paradise",
  "ChIJMUVO7fEFkWsRsYBHrfV0y7Y",
);

export const GOOGLE_MAPS_URL_BROADBEACH = mapsSearchUrl(
  "Mr Moustache Barbershop Broadbeach, Unit 5/2623 Gold Coast Hwy, Broadbeach QLD 4218",
);

export const DIRECTIONS_URL_SURFERS_PARADISE = mapsDirectionsUrl(
  "Mr. Moustache Barbershop, 3 Orchid Ave, Surfers Paradise QLD 4217, Australia",
);

export const DIRECTIONS_URL_BROADBEACH = mapsDirectionsUrl(
  "Mr. Moustache Barbershop, Unit 5/2623 Gold Coast Hwy, Broadbeach QLD 4218, Australia",
);

// TODO: Replace with the Google Business Profile (reviews) URL once confirmed.
export const GOOGLE_PROFILE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL?.trim() ||
  GOOGLE_MAPS_URL_SURFERS_PARADISE;

// Handle taken from the downloaded clips in mr-moustache-material/.
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
  "https://www.instagram.com/mr.moustache.barbers/";

/** False while a link still points at a launch placeholder. */
export function isConfiguredUrl(url: string) {
  return !/placeholder|example\.com/i.test(url);
}
