import { services as siteServices } from "@/data/services";
import type { Service } from "@/types";
import { dictionaries } from "./dictionary";
import type { Locale } from "./locales";

const flatten = (text: string) => text.replace(/\s*\n\s*/g, " ").trim();

/**
 * A service's description in the page's language. The Spanish text is used
 * only while Square still has the site's English description, so a service
 * whose description changed in Square never shows a stale translation.
 */
export function serviceDescription(service: Service, locale: Locale = "en") {
  if (locale === "en") return service.description;
  const translated = dictionaries[locale].serviceDescriptions[service.id];
  const original = siteServices.find((item) => item.id === service.id)?.description;
  return translated && original && flatten(original) === flatten(service.description)
    ? translated
    : service.description;
}
