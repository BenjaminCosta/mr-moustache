import type { ShopLocation } from "@/types";
import {
  DIRECTIONS_URL_BROADBEACH,
  DIRECTIONS_URL_SURFERS_PARADISE,
  GOOGLE_MAPS_URL_BROADBEACH,
  GOOGLE_MAPS_URL_SURFERS_PARADISE,
  SQUARE_BOOKING_URL_BROADBEACH,
  SQUARE_BOOKING_URL_SURFERS_PARADISE,
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

// Listed for Surfers Paradise first: it is the original shop.
export const locations = [
  {
    id: "surfers-paradise",
    name: "Surfers Paradise",
    fullName: "Mr Moustache Barbershop Surfers Paradise",
    address: {
      street: "3 Orchid Ave",
      suburb: "Surfers Paradise",
      state: "QLD",
      postcode: "4217",
      country: "Australia",
      countryCode: "AU",
    },
    // TODO: Confirm; this number is currently listed for both shops.
    phone: { display: "0421 574 445", href: "tel:+61421574445" },
    // TODO: Add the confirmed Surfers Paradise opening hours.
    hours: null,
    openingHours: [],
    geo: null,
    links: {
      booking: SQUARE_BOOKING_URL_SURFERS_PARADISE,
      maps: GOOGLE_MAPS_URL_SURFERS_PARADISE,
      directions: DIRECTIONS_URL_SURFERS_PARADISE,
    },
    // TODO: Replace with a photo taken inside the Surfers Paradise shop.
    image: {
      src: "/images/locations/barber-clipper-fade.webp",
      alt: "Barber finishing a skin fade with clippers at Mr Moustache",
      position: "center 30%",
    },
  },
  {
    id: "broadbeach",
    name: "Broadbeach",
    fullName: "Mr Moustache Barbershop Broadbeach",
    address: {
      street: "Unit 5/2623 Gold Coast Hwy",
      suburb: "Broadbeach",
      state: "QLD",
      postcode: "4218",
      country: "Australia",
      countryCode: "AU",
    },
    phone: { display: "0421 574 445", href: "tel:+61421574445" },
    hours: { summary: "Open from 10:00 am", detail: "7 days a week" },
    // TODO: Confirm closing times. Structured data only publishes opening
    // hours once every day has a closing time.
    openingHours: days.map((day) => ({ day, opens: "10:00", closes: null })),
    // TODO: Add the exact pin from the Google Business Profile (5+ decimals).
    geo: null,
    links: {
      booking: SQUARE_BOOKING_URL_BROADBEACH,
      maps: GOOGLE_MAPS_URL_BROADBEACH,
      directions: DIRECTIONS_URL_BROADBEACH,
    },
    image: {
      src: "/images/backgrounds/broadbeach-gold-coast-aerial.webp",
      alt: "Aerial view of the Broadbeach coastline on the Gold Coast",
      position: "center 45%",
    },
  },
] satisfies ShopLocation[];

export function addressLines(location: ShopLocation) {
  const { address } = location;
  return [
    address.street,
    `${address.suburb} ${address.state} ${address.postcode}`,
  ] as const;
}
