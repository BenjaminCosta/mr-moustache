import { business } from "@/data/business";
import { locationCopy, locationPath, locations } from "@/data/locations";
import { services as siteServices } from "@/data/services";
import { locationFaqs } from "@/lib/faq";
import { SITE_URL, isConfiguredUrl, squareServiceUrl } from "@/lib/constants";
import { hasFullWeek } from "@/lib/opening-hours";
import { getDictionary } from "@/i18n/dictionary";
import { LANGUAGE_TAGS, localePath, type Locale } from "@/i18n/locales";
import { HOME_SEO } from "@/lib/seo";
import type { Service, ShopLocation } from "@/types";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/images/branding/mr-moustache-logo.webp`;
// Stable copy of the landing page's share image (the opengraph-image route's
// own URL carries a build hash).
const SHARE_IMAGE_URL = `${SITE_URL}/images/branding/mr-moustache-barbershop-logo-tee.jpg`;

/** Absolute URL of a site path ("/" → "https://site/"). */
function absolute(path: string) {
  return `${SITE_URL}${path}`;
}

function shopUrl(location: ShopLocation) {
  return absolute(locationPath(location.id));
}

/** Stable id of each shop's HairSalon node, shared by every page that mentions it. */
export function shopId(location: ShopLocation) {
  return `${shopUrl(location)}#barbershop`;
}

function parsePrice(price: string) {
  return price.replace(/[^\d.]/g, "");
}

function openingHoursSpecification(location: ShopLocation) {
  const hours = location.openingHours;

  // Google treats a missing closing time as invalid, so wait for full hours.
  if (!hasFullWeek(hours)) {
    return undefined;
  }

  return hours.filter((item) => !item.closed).map((item) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${item.day}`,
    opens: item.opens,
    closes: item.closes,
  }));
}

/** The shop's services, each linking straight to its Square booking page. */
function offerCatalog(location: ShopLocation, services: Service[]) {
  return {
    "@type": "OfferCatalog",
    name: `Barber services at ${location.fullName}`,
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      url: squareServiceUrl(location.id, service.squareId),
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description.replace(/\s*\n\s*/g, " "),
      },
      ...(service.price && {
        price: parsePrice(service.price),
        priceCurrency: "AUD",
      }),
    })),
  };
}

function organizationNode() {
  const sameAs = [business.links.instagram, business.links.google].filter(
    (url) => isConfiguredUrl(url) && !url.includes("/maps/"),
  );

  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: business.name,
    alternateName: business.shortName,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 480, height: 480 },
    image: SHARE_IMAGE_URL,
    slogan: "Good Hair Better People",
    knowsLanguage: ["en", "es"],
    ...(sameAs.length > 0 && { sameAs }),
    subOrganization: locations.map((location) => ({ "@id": shopId(location) })),
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: business.name,
    // The Surfers Paradise Google profile spells it "Mr. Moustache".
    alternateName: [business.shortName, "Mr. Moustache Barbershop"],
    inLanguage: [LANGUAGE_TAGS.en, LANGUAGE_TAGS.es],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * One HairSalon per shop. Schema.org has no barber type, so HairSalon is the
 * most specific one that applies. Ratings are left out on purpose: Google
 * ignores self-served LocalBusiness reviews.
 */
function shopNode(location: ShopLocation, services: Service[] = siteServices) {
  const { address, geo, links } = location;
  const bookingUrl = isConfiguredUrl(links.booking) ? links.booking : undefined;

  return {
    "@type": "HairSalon",
    "@id": shopId(location),
    name: location.fullName,
    description: location.page.intro,
    url: shopUrl(location),
    image: [absolute(location.image.src), SHARE_IMAGE_URL],
    logo: LOGO_URL,
    telephone: location.phone.href.replace("tel:", ""),
    priceRange: business.priceRange,
    currenciesAccepted: "AUD",
    knowsLanguage: ["en", "es"],
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
    areaServed: [address.suburb, ...location.page.nearby, "Gold Coast"].map((name) => ({
      "@type": "Place",
      name,
    })),
    openingHoursSpecification: openingHoursSpecification(location),
    parentOrganization: { "@id": ORGANIZATION_ID },
    ...(bookingUrl && {
      acceptsReservations: true,
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: bookingUrl,
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
        result: { "@type": "Reservation", name: "Barber appointment" },
      },
    }),
    hasOfferCatalog: offerCatalog(location, services),
  };
}

/** URL of the shop's page in one language (the HairSalon itself keeps the English page). */
function shopPageUrl(location: ShopLocation, locale: Locale) {
  return absolute(locationPath(location.id, locale));
}

function breadcrumbNode(location: ShopLocation, locale: Locale) {
  const url = shopPageUrl(location, locale);
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: getDictionary(locale).shopHero.home,
        item: absolute(localePath(locale, "/")),
      },
      { "@type": "ListItem", position: 2, name: location.name, item: url },
    ],
  };
}

function faqNode(location: ShopLocation, services: Service[], locale: Locale) {
  const url = shopPageUrl(location, locale);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    inLanguage: LANGUAGE_TAGS[locale],
    mainEntity: locationFaqs(location, services, locale).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Home: the brand, the website and both shops (with live hours and prices when given). */
export function homeJsonLd(
  site: { locations: ShopLocation[]; services: Service[] } = { locations, services: siteServices },
  locale: Locale = "en",
) {
  const url = absolute(localePath(locale, "/"));

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      websiteNode(),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: HOME_SEO[locale].title,
        description: HOME_SEO[locale].description,
        inLanguage: LANGUAGE_TAGS[locale],
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORGANIZATION_ID },
        primaryImageOfPage: SHARE_IMAGE_URL,
      },
      ...site.locations.map((location) => shopNode(location, site.services)),
    ],
  };
}

/**
 * A shop's landing page: that shop in full, its breadcrumb and its FAQ. The
 * Spanish page describes the same HairSalon (same @id and url) in its own
 * WebPage, breadcrumb and FAQ.
 */
export function locationJsonLd(
  location: ShopLocation,
  services: Service[] = siteServices,
  locale: Locale = "en",
) {
  const url = shopPageUrl(location, locale);
  const copy = locationCopy(location, locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      websiteNode(),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: copy.title,
        description: copy.description,
        inLanguage: LANGUAGE_TAGS[locale],
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": shopId(location) },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: absolute(location.image.src),
      },
      shopNode(location, services),
      breadcrumbNode(location, locale),
      faqNode(location, services, locale),
    ],
  };
}
