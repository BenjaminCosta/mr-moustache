import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { LocationFaq } from "@/components/sections/LocationFaq";
import { LocationHero } from "@/components/sections/LocationHero";
import { LocationVisit } from "@/components/sections/LocationVisit";
import { OtherLocation } from "@/components/sections/OtherLocation";
import { Reputation } from "@/components/sections/Reputation";
import { Services } from "@/components/sections/Services";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocation, locationPath } from "@/data/locations";
import { pageMetadata } from "@/lib/seo";
import { getSiteData } from "@/lib/site-data";
import { locationJsonLd } from "@/lib/structured-data";
import type { LocationId } from "@/types";

export function locationPageMetadata(id: LocationId): Metadata {
  const { page } = getLocation(id);
  return pageMetadata({ title: page.title, description: page.description, path: locationPath(id) });
}

/**
 * A shop's own landing page (`/surfers-paradise`, `/broadbeach`): the URL each
 * Google Business Profile links to, so every shop has one page about it alone.
 */
export async function LocationPage({ id }: { id: LocationId }) {
  const { locations, services } = await getSiteData();
  const location = locations.find((item) => item.id === id) ?? getLocation(id);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <LocationHero location={location} />
        <Services location={id} />
        <Reputation location={id} />
        <LocationVisit location={location} />
        <LocationFaq location={location} services={services} />
        <OtherLocation location={id} />
      </main>
      <Footer />
      <JsonLd data={locationJsonLd(location, services)} />
    </div>
  );
}
