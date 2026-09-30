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

// Square Appointments for Mr Moustache and each shop's Square location ID.
const SQUARE_APPOINTMENTS_URL = "https://book.squareup.com/appointments/o0xkg1fz5zxow7";

export const SQUARE_LOCATION_IDS = {
  "surfers-paradise": "LA3KEKYDA4KV3",
  broadbeach: "LS4XGMYEDQ5ER",
} as const;

/** Square page for one service at one shop: opens straight on "choose a barber". */
export function squareServiceUrl(
  location: keyof typeof SQUARE_LOCATION_IDS,
  squareServiceId: string,
) {
  return `${SQUARE_APPOINTMENTS_URL}/location/${SQUARE_LOCATION_IDS[location]}/services/${squareServiceId}`;
}

// Each shop's Square Appointments page: opens straight on that shop's services.
export const SQUARE_BOOKING_URL_SURFERS_PARADISE =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_SURFERS_PARADISE?.trim() ||
  `${SQUARE_APPOINTMENTS_URL}/location/${SQUARE_LOCATION_IDS["surfers-paradise"]}`;

export const SQUARE_BOOKING_URL_BROADBEACH =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL_BROADBEACH?.trim() ||
  `${SQUARE_APPOINTMENTS_URL}/location/${SQUARE_LOCATION_IDS.broadbeach}`;

function mapsSearchUrl(query: string, placeId?: string) {
  const params = new URLSearchParams({ api: "1", query });
  if (placeId) params.set("query_place_id", placeId);
  return `https://www.google.com/maps/search/?${params}`;
}

function mapsDirectionsUrl(destination: string) {
  const params = new URLSearchParams({ api: "1", destination });
  return `https://www.google.com/maps/dir/?${params}`;
}

// Google Business Profile place IDs (from the review links the client sent).
export const GOOGLE_PLACE_IDS = {
  "surfers-paradise": "ChIJMUVO7fEFkWsRsYBHrfV0y7Y",
  broadbeach: "ChIJ8Qbj5d4FkWsR53Iktyc_sEI",
} as const;

// Searching by name plus place ID opens each shop's listing, not a bare pin.
export const GOOGLE_MAPS_URL_SURFERS_PARADISE = mapsSearchUrl(
  "Mr. Moustache Barbershop Surfers Paradise",
  GOOGLE_PLACE_IDS["surfers-paradise"],
);

export const GOOGLE_MAPS_URL_BROADBEACH = mapsSearchUrl(
  "Mr Moustache Barbershop Broadbeach, Unit 5/2623 Gold Coast Hwy, Broadbeach QLD 4218",
  GOOGLE_PLACE_IDS.broadbeach,
);

/** Opens Google's "write a review" dialog for the shop. */
function googleWriteReviewUrl(placeId: string) {
  return `https://search.google.com/local/writereview?${new URLSearchParams({ placeid: placeId })}`;
}

export const GOOGLE_REVIEW_URL_SURFERS_PARADISE = googleWriteReviewUrl(
  GOOGLE_PLACE_IDS["surfers-paradise"],
);

export const GOOGLE_REVIEW_URL_BROADBEACH = googleWriteReviewUrl(
  GOOGLE_PLACE_IDS.broadbeach,
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

// Work With Us applications are emailed through FormSubmit. The target can be
// the inbox address or, once activated, the random alias FormSubmit provides
// (keeps the address out of the page source). Inbox confirmed by the client.
export const FORMSUBMIT_TARGET =
  process.env.NEXT_PUBLIC_FORMSUBMIT_TARGET?.trim() ||
  "aitgv0@gmail.com";

export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_TARGET}`;

/** False while a link still points at a launch placeholder. */
export function isConfiguredUrl(url: string) {
  return !/placeholder|example\.com/i.test(url);
}
