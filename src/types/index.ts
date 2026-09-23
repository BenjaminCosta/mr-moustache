export type OpeningHours = {
  day: string;
  opens: string | null;
  closes: string | null;
  note: string;
};

export type BusinessInfo = {
  name: string;
  shortName: string;
  locationName: string;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
    countryCode: string;
  };
  phone: string | null;
  email: string | null;
  openingHours: OpeningHours[];
  links: {
    booking: string;
    maps: string;
    instagram: string;
  };
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  isPlaceholder: boolean;
};

export type Barber = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageAlt: string;
  isPlaceholder: boolean;
};

export type Review = {
  id: string;
  quote: string;
  author: string;
  source: string;
  isPlaceholder: boolean;
};
