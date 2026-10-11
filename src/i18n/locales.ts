export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

/** BCP 47 tags for `<html lang>`, hreflang and JSON-LD `inLanguage`. */
export const LANGUAGE_TAGS: Record<Locale, string> = { en: "en-AU", es: "es" };

/** Open Graph locales. */
export const OG_LOCALES: Record<Locale, string> = { en: "en_AU", es: "es_ES" };

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}

/**
 * A page's path in a language. English pages live at the root and Spanish ones
 * under /es: localePath("es", "/broadbeach") → "/es/broadbeach",
 * localePath("es", "/#services") → "/es#services".
 */
export function localePath(locale: Locale, path: string) {
  if (locale === "en") return path;
  if (path === "/") return "/es";
  if (path.startsWith("/#")) return `/es${path.slice(1)}`;
  return `/es${path}`;
}
