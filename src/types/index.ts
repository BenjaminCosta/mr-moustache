export type OpeningHours = {
  day: string;
  /** 24-hour "HH:MM", or null when unknown or closed. */
  opens: string | null;
  closes: string | null;
  /** True when the shop is closed all day. */
  closed?: boolean;
};

/** Hours for one specific date (a public holiday, a special event), from Google. */
export type SpecialHours = {
  /** "YYYY-MM-DD" in the shop's time zone. */
  date: string;
  opens: string | null;
  closes: string | null;
  closed?: boolean;
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
  /** Short label shown above the shop name, e.g. "The original". */
  tag: string;
  address: Address;
  phone: { display: string; href: string };
  /**
   * Opening hours as shown on the page, or null while they are unconfirmed
   * (the UI then shows a clearly marked "to be confirmed" line).
   */
  hours: { summary: string; detail: string } | null;
  /** Structured hours; only published in JSON-LD once every day has a close. */
  openingHours: OpeningHours[];
  /** Date-specific hours that override the weekly ones (holidays), when known. */
  specialHours?: SpecialHours[];
  geo: { latitude: number; longitude: number } | null;
  links: {
    booking: string;
    maps: string;
    directions: string;
  };
  image: { src: string; alt: string; position: string };
  /** Copy for the shop's own landing page (`/surfers-paradise`, `/broadbeach`). */
  page: {
    /** Full <title>; keep it under ~60 characters. */
    title: string;
    /** Meta description; keep it under ~155 characters. */
    description: string;
    /** Visible H1, e.g. "Barber in Broadbeach". */
    heading: string;
    intro: string;
    /** Neighbouring suburbs the shop serves (copy and JSON-LD `areaServed`). */
    nearby: string[];
  };
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  /** Square Appointments service ID; the same at both shops. */
  squareId: string;
};

export type GoogleRating = {
  id: LocationId;
  location: string;
  rating: number;
  /** Google review total: a lower bound ("60+") unless `exact` (live from Google). */
  reviewCount: number;
  exact?: boolean;
  href: string;
};

export type Review = {
  id: string;
  author: string;
  /** Avatar background, like Google's initial avatars. */
  avatarColor: string;
  rating: number;
  text: string;
  /** Day the review was posted (ISO "YYYY-MM-DD"); shown as "2 weeks ago". */
  publishedAt: string;
  /** The reviewer's Google profile, linked from their name (Google's attribution rules). */
  authorUrl?: string;
  location: string;
};

export type WorkVideo = {
  src: string;
  /** Short description of what the clip shows. */
  label: string;
  poster: string | null;
};
