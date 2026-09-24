import { business } from "@/data/business";
import { services } from "@/data/services";
import { SITE_URL, isConfiguredUrl } from "@/lib/constants";

const BUSINESS_ID = `${SITE_URL}/#barbershop`;

function parsePrice(price: string) {
  return price.replace(/[^\d.]/g, "");
}

function openingHoursSpecification() {
  const hours = business.openingHours;

  // Google treats a missing closing time as invalid, so wait for full hours.
  if (hours.some((item) => !item.opens || !item.closes)) {
    return undefined;
  }

  return hours.map((item) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${item.day}`,
    opens: item.opens,
    closes: item.closes,
  }));
}

/**
 * LocalBusiness JSON-LD for the Broadbeach shop. Schema.org has no barber
 * type, so HairSalon is the most specific one that applies. Ratings are left
 * out on purpose: Google ignores self-served LocalBusiness reviews.
 */
export function localBusinessJsonLd() {
  const { address, geo, links } = business;
  const bookingUrl = isConfiguredUrl(links.booking) ? links.booking : undefined;
  const sameAs = [links.instagram, links.google].filter(
    (url) => isConfiguredUrl(url) && !url.includes("/maps/search/"),
  );

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": BUSINESS_ID,
    name: business.name,
    description:
      "Barbershop in Broadbeach, Gold Coast offering classic cuts, skin fades, tapers and beard trims.",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/opengraph-image.jpg`,
    logo: `${SITE_URL}/images/branding/mr-moustache-logo.webp`,
    telephone: business.phone.href.replace("tel:", ""),
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
      { "@type": "Place", name: "Broadbeach" },
      { "@type": "Place", name: "Gold Coast" },
    ],
    openingHoursSpecification: openingHoursSpecification(),
    parentOrganization: {
      "@type": "Organization",
      name: "Mr Moustache Barbershop",
    },
    ...(sameAs.length > 0 && { sameAs }),
    ...(bookingUrl && {
      acceptsReservations: true,
      potentialAction: {
        "@type": "ReserveAction",
        target: bookingUrl,
      },
    }),
    hasOfferCatalog: {
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
    },
  };
}
