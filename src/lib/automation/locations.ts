import { optionalEnv } from "./env";

export interface AutomationLocation {
  key: "surfers-paradise" | "broadbeach";
  name: string;
  squareLocationId: string;
  reviewUrl?: string;
  bookingUrl?: string;
}

const LOCATIONS = [
  { key: "surfers-paradise", name: "Surfers Paradise", envSuffix: "SURFERS_PARADISE" },
  { key: "broadbeach", name: "Broadbeach", envSuffix: "BROADBEACH" },
] as const;

/** Shops whose Square location ID has been configured in the environment. */
export function automationLocations(): AutomationLocation[] {
  return LOCATIONS.flatMap(({ key, name, envSuffix }) => {
    const squareLocationId = optionalEnv(`SQUARE_LOCATION_ID_${envSuffix}`);
    if (!squareLocationId) return [];

    return [
      {
        key,
        name,
        squareLocationId,
        reviewUrl: optionalEnv(`GOOGLE_REVIEW_URL_${envSuffix}`),
        bookingUrl:
          optionalEnv(`NEXT_PUBLIC_SQUARE_BOOKING_URL_${envSuffix}`) ||
          optionalEnv("NEXT_PUBLIC_SQUARE_BOOKING_URL"),
      },
    ];
  });
}

export function locationForSquareId(locationId: string | undefined) {
  if (!locationId) return undefined;
  return automationLocations().find((location) => location.squareLocationId === locationId);
}
