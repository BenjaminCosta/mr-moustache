import type { LocationId, ShopLocation } from "@/types";
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
    tag: "The original",
    address: {
      street: "3 Orchid Ave",
      suburb: "Surfers Paradise",
      state: "QLD",
      postcode: "4217",
      country: "Australia",
      countryCode: "AU",
    },
    // Confirmed by the client: one number for both shops.
    phone: { display: "0421 574 445", href: "tel:+61421574445" },
    hours: null as ShopLocation["hours"],
    // Official hours, confirmed by the client (September 2026).
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
    // TODO: Swap for a photo the client confirms was taken in this shop.
    image: {
      src: "/images/locations/mr-moustache-barber-clipper-cut.webp",
      alt: "Mr Moustache barber cutting a client's hair with clippers",
      position: "60% 30%",
    },
    page: {
      title: "Barber in Surfers Paradise – Fades & Beard Trims | Mr Moustache",
      description:
        "Mr Moustache Barbershop, 3 Orchid Ave, Surfers Paradise. Skin fades, taper fades, classic cuts and beard trims by Spanish-speaking barbers. Book online.",
      heading: "Barber in Surfers Paradise",
      intro:
        "The original Mr Moustache, on Orchid Ave in the heart of Surfers Paradise. Skin fades, taper fades, classic cuts and beard trims by Spanish-speaking barbers.",
      nearby: ["Main Beach", "Bundall", "Chevron Island", "Broadbeach"],
    },
  },
  {
    id: "broadbeach",
    name: "Broadbeach",
    fullName: "Mr Moustache Barbershop Broadbeach",
    tag: "Now open",
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
    // Official hours, confirmed by the client (September 2026).
    openingHours: [
      { day: "Monday", opens: null, closes: null, closed: true },
      { day: "Tuesday", opens: "10:00", closes: "18:30" },
      { day: "Wednesday", opens: "10:00", closes: "18:30" },
      { day: "Thursday", opens: "09:30", closes: "19:00" },
      { day: "Friday", opens: "09:00", closes: "19:00" },
      { day: "Saturday", opens: "09:00", closes: "16:00" },
      { day: "Sunday", opens: null, closes: null, closed: true },
    ],
    // Not needed: Google places the shop from its address and Business Profile.
    geo: null,
    links: {
      booking: SQUARE_BOOKING_URL_BROADBEACH,
      maps: GOOGLE_MAPS_URL_BROADBEACH,
      directions: DIRECTIONS_URL_BROADBEACH,
    },
    // TODO: Swap for a photo the client confirms was taken in this shop.
    image: {
      src: "/images/locations/mr-moustache-barber-haircut-mirror.webp",
      alt: "Mr Moustache barber lining up a client's beard, seen in the shop mirror",
      position: "center 35%",
    },
    page: {
      title: "Barber in Broadbeach – Fades & Beard Trims | Mr Moustache",
      description:
        "Mr Moustache Barbershop, Unit 5/2623 Gold Coast Hwy, Broadbeach. Skin fades, taper fades, haircuts and beard trims by Spanish-speaking barbers. Book online.",
      heading: "Barber in Broadbeach",
      intro:
        "Our second Gold Coast shop, on the Gold Coast Hwy in Broadbeach. Skin fades, taper fades, classic cuts and beard trims by Spanish-speaking barbers, with the same standards as Surfers Paradise.",
      nearby: ["Mermaid Beach", "Broadbeach Waters", "Mermaid Waters", "Surfers Paradise"],
    },
  },
] satisfies ShopLocation[];

export function getLocation(id: LocationId) {
  const location = locations.find((item) => item.id === id);
  if (!location) throw new Error(`Unknown location: ${id}`);
  return location as ShopLocation;
}

/** The shop that is not `id` (each page links to the other one). */
export function otherLocation(id: LocationId) {
  return locations.find((item) => item.id !== id) as ShopLocation;
}

/** Path of the shop's own landing page. */
export function locationPath(id: LocationId) {
  return `/${id}`;
}

/** One-line postal address, e.g. "3 Orchid Ave, Surfers Paradise QLD 4217". */
export function addressLine(location: ShopLocation) {
  return addressLines(location).join(", ");
}

export function addressLines(location: ShopLocation) {
  const { address } = location;
  return [
    address.street,
    `${address.suburb} ${address.state} ${address.postcode}`,
  ] as const;
}
