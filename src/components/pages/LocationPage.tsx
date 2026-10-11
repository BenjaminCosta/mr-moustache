import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { LocationFaq } from "@/components/sections/LocationFaq";
import { LocationHero } from "@/components/sections/LocationHero";
import { LocationVisit } from "@/components/sections/LocationVisit";
import { OtherLocation } from "@/components/sections/OtherLocation";
import { Reputation } from "@/components/sections/Reputation";
import { Services } from "@/components/sections/Services";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocation, locationCopy, locationPath } from "@/data/locations";
import type { Locale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/seo";
import { getSiteData } from "@/lib/site-data";
import { locationJsonLd } from "@/lib/structured-data";
import type { LocationId } from "@/types";

export function locationPageMetadata(id: LocationId, locale: Locale = "en"): Metadata {
  const { title, description } = locationCopy(getLocation(id), locale);
  return pageMetadata({ title, description, path: locationPath(id), locale });
}

/**
 * A shop's own landing page (`/surfers-paradise`, `/broadbeach`, and the
 * Spanish ones under /es): the URL each Google Business Profile links to, so
 * every shop has one page about it alone.
 */
export async function LocationPage({ id, locale = "en" }: { id: LocationId; locale?: Locale }) {
  const { locations, services } = await getSiteData();
  const location = locations.find((item) => item.id === id) ?? getLocation(id);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <LocationHero location={location} locale={locale} />
        <Services location={id} locale={locale} />
        <Reputation location={id} locale={locale} />
        <LocationVisit location={location} locale={locale} />
        <LocationFaq location={location} services={services} locale={locale} />
        <OtherLocation location={id} locale={locale} />
      </main>
      <Footer locale={locale} languagePaths={{ en: locationPath(id), es: locationPath(id, "es") }} />
      <JsonLd data={locationJsonLd(location, services, locale)} />
    </div>
  );
}
