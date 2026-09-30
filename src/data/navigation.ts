import { locationPath } from "@/data/locations";
import type { LocationId } from "@/types";

export type NavItem = { label: string; href: string; current?: boolean };

/**
 * Primary navigation. Each shop links to its own page; on a shop page
 * "Services" jumps to that shop's price list, elsewhere to the landing page's.
 */
export function navigationFor(currentLocation?: LocationId): NavItem[] {
  const shop = (label: string, id: LocationId) => ({
    label,
    href: locationPath(id),
    current: id === currentLocation,
  });

  return [
    {
      label: "Services",
      href: currentLocation ? `${locationPath(currentLocation)}#services` : "/#services",
    },
    shop("Surfers Paradise", "surfers-paradise"),
    shop("Broadbeach", "broadbeach"),
    { label: "Work With Us", href: "/#work-with-us" },
  ];
}
