import { business } from "@/data/business";
import { locations } from "@/data/locations";
import { services } from "@/data/services";
import { SITE_URL, isConfiguredUrl } from "@/lib/constants";
import type { ShopLocation } from "@/types";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

function parsePrice(price: string) {
  return price.replace(/[^\d.]/g, "");
}

function openingHoursSpecification(location: ShopLocation) {
  const hours = location.openingHours;

  // Google treats a missing closing time as invalid, so wait for full hours.
  if (hours.length === 0 || hours.some((item) => !item.opens || !item.closes)) {
    return undefined;
  }

  return hours.map((item) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${item.day}`,
    opens: item.opens,
    closes: item.closes,
  }));
}

const offerCatalog = {
  "@type": "OfferCatalog",
  name: "Barber services",
  itemListElement: services.map((service) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: service.name },
    ...(service.price && {
      price: parsePrice(service.price),
      priceCurrency: "AUD",
    }),
  })),
};

/**
 * One HairSalon per shop. Schema.org has no barber type, so HairSalon is the
 * most specific one that applies. Ratings are left out on purpose: Google
 * ignores self-served LocalBusiness reviews.
 */
function shopJsonLd(location: ShopLocation) {
  const { address, geo, links } = location;
  const bookingUrl = isConfiguredUrl(links.booking) ? links.booking : undefined;

  return {
    "@type": "HairSalon",
    "@id": `${SITE_URL}/#${location.id}`,
    name: location.fullName,
    description: `Barbershop in ${address.suburb}, Gold Coast offering classic cuts, skin fades, tapers and beard trims.`,
    url: `${SITE_URL}/#${location.id}`,
    image: `${SITE_URL}/opengraph-image.jpg`,
    telephone: location.phone.href.replace("tel:", ""),
    priceRange: business.priceRange,
    currenciesAccepted: "AUD",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.suburb,
      addressRegion: address.state,
      postalCode: address.postcode,
      addressCountry: address.countryCode,
    },
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    hasMap: links.maps,
    areaServed: [
      { "@type": "Place", name: address.suburb },
      { "@type": "Place", name: "Gold Coast" },
    ],
    openingHoursSpecification: openingHoursSpecification(location),
    parentOrganization: { "@id": ORGANIZATION_ID },
    ...(bookingUrl && {
      acceptsReservations: true,
      potentialAction: { "@type": "ReserveAction", target: bookingUrl },
    }),
    hasOfferCatalog: offerCatalog,
  };
}

export function siteJsonLd() {
  const sameAs = [business.links.instagram, business.links.google].filter(
    (url) => isConfiguredUrl(url) && !url.includes("/maps/"),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: business.name,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/branding/mr-moustache-logo.webp`,
        ...(sameAs.length > 0 && { sameAs }),
        subOrganization: locations.map((location) => ({
          "@id": `${SITE_URL}/#${location.id}`,
        })),
      },
      ...locations.map(shopJsonLd),
    ],
  };
}
