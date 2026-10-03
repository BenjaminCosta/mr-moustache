import { cache } from "react";
import { locations as siteLocations } from "@/data/locations";
import { googleRatings, reviews as siteReviews } from "@/data/reviews";
import { services as siteServices } from "@/data/services";
import { GOOGLE_PLACE_IDS, SQUARE_LOCATION_IDS } from "@/lib/constants";
import { fetchPlace, type PlaceData } from "@/lib/google-places";
import { hasFullWeek } from "@/lib/opening-hours";
import { fetchCatalogServices, mergeServices } from "@/lib/square-catalog";
import type { GoogleRating, LocationId, Review, Service, ShopLocation } from "@/types";

/** Cards shown per shop; Google's reviews come first, the saved ones fill in. */
const REVIEWS_PER_SHOP = 3;

export type SiteData = {
  locations: ShopLocation[];
  ratings: GoogleRating[];
  reviews: Review[];
  services: Service[];
};

function shopReviews(location: ShopLocation, live: PlaceData | null) {
  const saved = siteReviews.filter((review) => review.location === location.name);
  const fromGoogle = live?.reviews ?? [];
  const authors = new Set(fromGoogle.map((review) => review.author));
  const fill = saved.filter((review) => !authors.has(review.author));
  return [...fromGoogle, ...fill].slice(0, Math.max(REVIEWS_PER_SHOP, fromGoogle.length));
}

/**
 * Pure merge, kept apart for tests: live data where Google or Square answered,
 * the site's own data everywhere else.
 */
export function mergeSiteData(
  places: Partial<Record<LocationId, PlaceData | null>>,
  catalog: Parameters<typeof mergeServices>[1] | null,
): SiteData {
  const locations = siteLocations.map((location) => {
    const live = places[location.id];
    const hours = live?.openingHours && hasFullWeek(live.openingHours) ? live.openingHours : null;
    return {
      ...location,
      openingHours: hours ?? location.openingHours,
      specialHours: live?.specialHours ?? [],
    };
  });

  const ratings = googleRatings.map((rating) => {
    const live = places[rating.id];
    return live?.rating != null && live.reviewCount != null
      ? { ...rating, rating: live.rating, reviewCount: live.reviewCount, exact: true }
      : rating;
  });

  return {
    locations,
    ratings,
    // Same shop order as the rating cards above the reviews.
    reviews: ratings.flatMap((rating) => {
      const location = locations.find((item) => item.id === rating.id)!;
      return shopReviews(location, places[location.id] ?? null);
    }),
    services: catalog ? mergeServices(siteServices, catalog) : siteServices,
  };
}

/**
 * Everything on the site that changes on its own: Google ratings, reviews and
 * hours (every 6 h) and Square's services and prices (daily). Pages stay
 * static and are regenerated in the background; with no API key or a failed
 * call, the site's saved data is used, so a page never breaks.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const [places, catalog] = await Promise.all([
    Promise.all(
      siteLocations.map(async (location) => [location.id, await fetchPlace(GOOGLE_PLACE_IDS[location.id], location.name)] as const),
    ),
    fetchCatalogServices(Object.values(SQUARE_LOCATION_IDS)),
  ]);

  return mergeSiteData(Object.fromEntries(places), catalog);
});

export async function getSiteLocation(id: LocationId) {
  const { locations } = await getSiteData();
  return locations.find((location) => location.id === id)!;
}
