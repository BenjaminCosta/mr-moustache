export type OpeningHours = {
  day: string;
  opens: string | null;
  closes: string | null;
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
  phone: {
    display: string;
    href: string;
  };
  hours: {
    summary: string;
    detail: string;
  };
  openingHours: OpeningHours[];
  rating: {
    score: string;
    source: string;
  };
  links: {
    booking: string;
    maps: string;
    instagram: string;
    google: string;
  };
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  duration: string | null;
};

export type WorkVideo = {
  src: string;
  poster: string | null;
};
