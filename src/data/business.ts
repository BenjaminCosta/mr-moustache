import type { BusinessInfo } from "@/types";
import {
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  SQUARE_BOOKING_URL,
} from "@/lib/constants";

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
  // TODO: Confirm before publishing.
  phone: null,
  // TODO: Confirm before publishing.
  email: null,
  // TODO: Replace every placeholder row with confirmed trading hours.
  openingHours: [
    { day: "Monday", opens: null, closes: null, note: "To be confirmed" },
    { day: "Tuesday", opens: null, closes: null, note: "To be confirmed" },
    { day: "Wednesday", opens: null, closes: null, note: "To be confirmed" },
    { day: "Thursday", opens: null, closes: null, note: "To be confirmed" },
    { day: "Friday", opens: null, closes: null, note: "To be confirmed" },
    { day: "Saturday", opens: null, closes: null, note: "To be confirmed" },
    { day: "Sunday", opens: null, closes: null, note: "To be confirmed" },
  ],
  links: {
    booking: SQUARE_BOOKING_URL,
    maps: GOOGLE_MAPS_URL,
    instagram: INSTAGRAM_URL,
  },
} satisfies BusinessInfo;

export const formattedAddress = [
  business.address.street,
  `${business.address.suburb} ${business.address.state} ${business.address.postcode}`,
  business.address.country,
].join(", ");
