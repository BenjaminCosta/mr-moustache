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

// TODO: Replace with the confirmed Square deep link for Broadbeach.
export const SQUARE_BOOKING_URL =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL?.trim() ||
  "https://squareup.com/appointments/book/PLACEHOLDER";

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=5%2F2623%20Gold%20Coast%20Hwy%2C%20Broadbeach%20QLD%204218%2C%20Australia";

// TODO: Replace with the Google Business Profile (reviews) URL once confirmed.
export const GOOGLE_PROFILE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL ?? GOOGLE_MAPS_URL;

// TODO: Replace with the confirmed Mr Moustache Instagram profile URL.
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ||
  "https://www.instagram.com/PLACEHOLDER";
