import type { Metadata } from "next";
import { business } from "@/data/business";
import { LANGUAGE_TAGS, OG_LOCALES, localePath, otherLocale, type Locale } from "@/i18n/locales";
import { IS_INDEXABLE, SITE_URL } from "@/lib/constants";
import type { LocationId } from "@/types";

/** The landing page's title and description in each language. */
export const HOME_SEO: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Gold Coast Barbers in Surfers Paradise & Broadbeach | Mr Moustache",
    description:
      "Gold Coast barbershop in Surfers Paradise and Broadbeach. Skin fades, taper fades, classic cuts and beard trims by Spanish-speaking barbers. Book online.",
  },
  es: {
    title: "Barbería en Gold Coast – Hablamos español | Mr Moustache",
    description:
      "Barbería en Surfers Paradise y Broadbeach, Gold Coast. Skin fades, degradados, cortes clásicos y barba con barberos que hablan español. Reserva online.",
  },
};

export const HOME_TITLE = HOME_SEO.en.title;
export const HOME_DESCRIPTION = HOME_SEO.en.description;

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

/**
 * Defaults for every page of one language, set by that language's root layout.
 * Each page then sets its own title, description, canonical and Open Graph
 * tags through pageMetadata().
 */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: HOME_SEO[locale].title,
      template: "%s | Mr Moustache Barbershop",
    },
    description: HOME_SEO[locale].description,
    applicationName: business.name,
    robots: IS_INDEXABLE
      ? { index: true, follow: true, "max-image-preview": "large" }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale],
      siteName: business.name,
    },
    // Search Console "HTML tag" verification, if the DNS record is not an option.
    ...(googleSiteVerification && { verification: { google: googleSiteVerification } }),
    // Favicon, app icons and share images come from the file conventions in
    // src/app (favicon.ico, icon.png, apple-icon.png, opengraph-image.jpg,
    // twitter-image.jpg), all generated from the real Mr Moustache logo.
  };
}

/** hreflang links: every page exists in English (the default) and Spanish. */
export function languageAlternates(path: string) {
  return {
    [LANGUAGE_TAGS.en]: localePath("en", path),
    [LANGUAGE_TAGS.es]: localePath("es", path),
    "x-default": localePath("en", path),
  };
}

type PageSeo = {
  /** Full <title>, used as is (no template). */
  title: string;
  description: string;
  /** The page's English path, starting with "/"; the Spanish one is under /es. */
  path: string;
  locale?: Locale;
};

/**
 * Title, description, canonical, hreflang, Open Graph and Twitter tags for one
 * page. Each page sets its own: nested metadata (openGraph, alternates) is
 * replaced, not merged, so a page that relied on the layout's would advertise
 * "/". Share images come from the opengraph-image files of each route.
 */
export function pageMetadata({ title, description, path, locale = "en" }: PageSeo): Metadata {
  const url = localePath(locale, path);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale],
      alternateLocale: OG_LOCALES[otherLocale(locale)],
      url,
      siteName: business.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Website link for each shop's Google Business Profile. The UTM tags let
 * analytics count visits that come from the profile; the page's canonical
 * drops them, so Google still indexes the clean URL.
 */
export function gbpWebsiteUrl(location: LocationId) {
  const params = new URLSearchParams({
    utm_source: "google",
    utm_medium: "organic",
    utm_campaign: `gbp-${location}`,
  });
  return `${SITE_URL}/${location}?${params}`;
}
