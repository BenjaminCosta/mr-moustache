import type { BusinessInfo } from "@/types";
import {
  GOOGLE_MAPS_URL,
  GOOGLE_PROFILE_URL,
  INSTAGRAM_URL,
  SQUARE_BOOKING_URL,
} from "@/lib/constants";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const business = {
  name: "Mr Moustache Barbershop Broadbeach",
  shortName: "Mr Moustache",
  locationName: "Broadbeach",
  address: {
    street: "Unit 5/2623 Gold Coast Hwy",
    suburb: "Broadbeach",
    state: "QLD",
    postcode: "4218",
    country: "Australia",
    countryCode: "AU",
  },
  phone: {
    display: "0421 574 445",
    href: "tel:+61421574445",
  },
  hours: {
    summary: "Open from 10:00 am",
    detail: "7 days a week",
  },
  // TODO: Confirm closing times before publishing. Structured data only
  // publishes opening hours once every day has a closing time.
  openingHours: days.map((day) => ({ day, opens: "10:00", closes: null })),
  // TODO: Add the exact pin from the Google Business Profile (5+ decimals).
  geo: null as BusinessInfo["geo"],
  priceRange: "$$",
  rating: {
    score: "5.0",
    source: "Google",
  },
  links: {
    booking: SQUARE_BOOKING_URL,
    maps: GOOGLE_MAPS_URL,
    instagram: INSTAGRAM_URL,
    google: GOOGLE_PROFILE_URL,
  },
} satisfies BusinessInfo;

export const addressLines = [
  business.address.street,
  `${business.address.suburb} ${business.address.state} ${business.address.postcode}`,
] as const;
