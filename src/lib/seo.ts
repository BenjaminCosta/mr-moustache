import type { Metadata } from "next";
import { business } from "@/data/business";
import { SITE_URL } from "@/lib/constants";
import type { LocationId } from "@/types";

export const HOME_TITLE =
  "Gold Coast Barbers in Surfers Paradise & Broadbeach | Mr Moustache";

export const HOME_DESCRIPTION =
  "Gold Coast barbershop in Surfers Paradise and Broadbeach. Skin fades, taper fades, classic cuts and beard trims by Spanish-speaking barbers. Book online.";

type PageSeo = {
  /** Full <title>, used as is (no template). */
  title: string;
  description: string;
  /** Path of the page, starting with "/"; it becomes the canonical URL. */
  path: string;
};

/**
 * Title, description, canonical, Open Graph and Twitter tags for one page.
 * Each page sets its own: nested metadata (openGraph, alternates) is replaced,
 * not merged, so a page that relied on the layout's would advertise "/".
 * The share image comes from src/app/opengraph-image.jpg for every page.
 */
export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url: path,
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
