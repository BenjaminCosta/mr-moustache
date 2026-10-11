import { locationPath } from "@/data/locations";
import { getDictionary } from "@/i18n/dictionary";
import { localePath, type Locale } from "@/i18n/locales";
import type { LocationId } from "@/types";

export type NavItem = { label: string; href: string; current?: boolean };

/**
 * Primary navigation, in the page's language. Each shop links to its own page;
 * on a shop page "Services" jumps to that shop's price list, elsewhere to the
 * landing page's.
 */
export function navigationFor(currentLocation?: LocationId, locale: Locale = "en"): NavItem[] {
  const t = getDictionary(locale).nav;
  const shop = (label: string, id: LocationId) => ({
    label,
    href: locationPath(id, locale),
    current: id === currentLocation,
  });

  return [
    {
      label: t.services,
      href: currentLocation
        ? `${locationPath(currentLocation, locale)}#services`
        : localePath(locale, "/#services"),
    },
    shop("Surfers Paradise", "surfers-paradise"),
    shop("Broadbeach", "broadbeach"),
    { label: t.workWithUs, href: localePath(locale, "/#work-with-us") },
  ];
}

/** The same page in the other language, for the EN / ES switch. */
export function alternateLanguagePath(currentLocation: LocationId | undefined, locale: Locale) {
  const target: Locale = locale === "en" ? "es" : "en";
  return currentLocation ? locationPath(currentLocation, target) : localePath(target, "/");
}
