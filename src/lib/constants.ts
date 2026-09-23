const FALLBACK_SITE_URL = "https://example.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL
).replace(/\/$/, "");

// TODO: Replace with the confirmed Square deep link for Broadbeach.
export const SQUARE_BOOKING_URL =
  process.env.NEXT_PUBLIC_SQUARE_BOOKING_URL ??
  "https://squareup.com/appointments/book/PLACEHOLDER";

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Unit%205%2F2623%20Gold%20Coast%20Hwy%2C%20Broadbeach%20QLD%204218%2C%20Australia";

// TODO: Replace with the confirmed Mr Moustache Instagram profile URL.
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  "https://www.instagram.com/PLACEHOLDER";
