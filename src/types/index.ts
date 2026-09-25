export type OpeningHours = {
  day: string;
  opens: string | null;
  closes: string | null;
};

export type Address = {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  countryCode: string;
};

/** Brand-level details shared by both barbershops. */
export type BusinessInfo = {
  name: string;
  shortName: string;
  priceRange: string;
  links: {
    booking: string;
    instagram: string;
    google: string;
  };
};

export type LocationId = "surfers-paradise" | "broadbeach";

/** One Mr Moustache barbershop. */
export type ShopLocation = {
  id: LocationId;
  name: string;
  fullName: string;
  address: Address;
  phone: { display: string; href: string };
  /**
   * Opening hours as shown on the page, or null while they are unconfirmed
   * (the UI then shows a clearly marked "to be confirmed" line).
   */
  hours: { summary: string; detail: string } | null;
  /** Structured hours; only published in JSON-LD once every day has a close. */
  openingHours: OpeningHours[];
  geo: { latitude: number; longitude: number } | null;
  links: {
    booking: string;
    maps: string;
    directions: string;
  };
  image: { src: string; alt: string; position: string };
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  duration: string | null;
};

export type GoogleRating = {
  id: string;
  location: string;
  rating: number;
  reviewCount: number;
  href: string;
};

export type Review = {
  id: string;
  author: string;
  /** Avatar background, like Google's initial avatars. */
  avatarColor: string;
  rating: number;
  text: string;
  /** Relative date as shown on Google, e.g. "2 weeks ago". */
  when: string;
  location: string;
};

export type WorkVideo = {
  src: string;
  /** Short description of what the clip shows. */
  label: string;
  poster: string | null;
};
