import { getDictionary } from "@/i18n/dictionary";
import { LANGUAGE_TAGS, otherLocale, type Locale } from "@/i18n/locales";

type LanguageSwitchProps = {
  locale: Locale;
  /** The same page in the other language. */
  href: string;
  className?: string;
  onClick?: () => void;
};

/**
 * "ES" on English pages, "EN" on Spanish ones. A plain link (not <Link>): the
 * two languages have separate root layouts, so switching is a full page load.
 */
export function LanguageSwitch({ locale, href, className = "", onClick }: LanguageSwitchProps) {
  const t = getDictionary(locale).nav;
  const target = otherLocale(locale);

  return (
    <a
      href={href}
      hrefLang={LANGUAGE_TAGS[target]}
      lang={LANGUAGE_TAGS[target]}
      aria-label={t.switchTitle}
      title={t.switchTitle}
      onClick={onClick}
      className={className}
    >
      {t.switchLabel}
    </a>
  );
}
