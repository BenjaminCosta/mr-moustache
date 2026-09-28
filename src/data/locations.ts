import type { ShopLocation } from "@/types";
import {
  DIRECTIONS_URL_BROADBEACH,
  DIRECTIONS_URL_SURFERS_PARADISE,
  GOOGLE_MAPS_URL_BROADBEACH,
  GOOGLE_MAPS_URL_SURFERS_PARADISE,
  SQUARE_BOOKING_URL_BROADBEACH,
  SQUARE_BOOKING_URL_SURFERS_PARADISE,
} from "@/lib/constants";

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
    hours: null as ShopLocation["hours"],
    // Read from Square Appointments availability (any staff), 28 Sep 2026.
    // TODO: Confirm with the client they match the official shop hours.
    openingHours: [
      { day: "Monday", opens: null, closes: null, closed: true },
      { day: "Tuesday", opens: "09:00", closes: "18:00" },
      { day: "Wednesday", opens: "09:00", closes: "18:00" },
      { day: "Thursday", opens: "09:00", closes: "18:00" },
      { day: "Friday", opens: "09:00", closes: "18:30" },
      { day: "Saturday", opens: "09:00", closes: "17:00" },
      { day: "Sunday", opens: "10:00", closes: "15:00" },
    ],
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
    hours: null as ShopLocation["hours"],
    // Read from Square Appointments availability (any staff), 28 Sep 2026.
    // TODO: Confirm with the client they match the official shop hours.
    openingHours: [
      { day: "Monday", opens: null, closes: null, closed: true },
      { day: "Tuesday", opens: "10:00", closes: "18:30" },
      { day: "Wednesday", opens: "10:00", closes: "18:30" },
      { day: "Thursday", opens: "09:30", closes: "19:00" },
      { day: "Friday", opens: "09:00", closes: "19:00" },
      { day: "Saturday", opens: "09:00", closes: "16:00" },
      { day: "Sunday", opens: null, closes: null, closed: true },
    ],
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
