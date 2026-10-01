import {
  GOOGLE_REVIEW_URL_BROADBEACH,
  GOOGLE_REVIEW_URL_SURFERS_PARADISE,
  SQUARE_BOOKING_URL_BROADBEACH,
  SQUARE_BOOKING_URL_SURFERS_PARADISE,
} from "../constants";
import { optionalEnv } from "./env";

export interface AutomationLocation {
  key: "surfers-paradise" | "broadbeach";
  name: string;
  squareLocationId: string;
  reviewUrl?: string;
  bookingUrl?: string;
}

// Each shop's Google "write a review" link and Square booking page, as the
// site uses them; GOOGLE_REVIEW_URL_* overrides the review link.
const LOCATIONS = [
  {
    key: "surfers-paradise",
    name: "Surfers Paradise",
    envSuffix: "SURFERS_PARADISE",
    defaultReviewUrl: GOOGLE_REVIEW_URL_SURFERS_PARADISE,
    bookingUrl: SQUARE_BOOKING_URL_SURFERS_PARADISE,
  },
  {
    key: "broadbeach",
    name: "Broadbeach",
    envSuffix: "BROADBEACH",
    defaultReviewUrl: GOOGLE_REVIEW_URL_BROADBEACH,
    bookingUrl: SQUARE_BOOKING_URL_BROADBEACH,
  },
] as const;

/** Shops whose Square location ID has been configured in the environment. */
export function automationLocations(): AutomationLocation[] {
  return LOCATIONS.flatMap(({ key, name, envSuffix, defaultReviewUrl, bookingUrl }) => {
    const squareLocationId = optionalEnv(`SQUARE_LOCATION_ID_${envSuffix}`);
    if (!squareLocationId) return [];

    return [
      {
        key,
        name,
        squareLocationId,
        reviewUrl: optionalEnv(`GOOGLE_REVIEW_URL_${envSuffix}`) || defaultReviewUrl,
        bookingUrl,
      },
    ];
  });
}

/**
 * Where /review/{shop} and /book/{shop} on our own domain send people. Emails
 * use those short links: a link on the sender's own domain looks personal and
 * trustworthy, while long third-party URLs look like marketing mail.
 */
export function shopLinks(key: string) {
  const shop = LOCATIONS.find((location) => location.key === key);
  if (!shop) return undefined;
  return {
    reviewUrl: optionalEnv(`GOOGLE_REVIEW_URL_${shop.envSuffix}`) || shop.defaultReviewUrl,
    bookingUrl: shop.bookingUrl,
  };
}

export function locationForSquareId(locationId: string | undefined) {
  if (!locationId) return undefined;
  return automationLocations().find((location) => location.squareLocationId === locationId);
}
