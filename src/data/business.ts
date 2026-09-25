import type { BusinessInfo } from "@/types";
import {
  GOOGLE_PROFILE_URL,
  INSTAGRAM_URL,
  SQUARE_BOOKING_URL,
} from "@/lib/constants";

/** The Mr Moustache brand; per-shop details live in `src/data/locations.ts`. */
export const business = {
  name: "Mr Moustache Barbershop",
  shortName: "Mr Moustache",
  priceRange: "$$",
  links: {
    booking: SQUARE_BOOKING_URL,
    instagram: INSTAGRAM_URL,
    google: GOOGLE_PROFILE_URL,
  },
} satisfies BusinessInfo;
