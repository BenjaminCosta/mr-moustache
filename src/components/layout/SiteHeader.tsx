import Link from "next/link";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { Logo } from "@/components/ui/Logo";
import { business } from "@/data/business";
import { alternateLanguagePath, navigationFor } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
import { localePath, type Locale } from "@/i18n/locales";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import type { LocationId } from "@/types";

type SiteHeaderProps = {
  /** The shop whose page this is: marks its link and books at that shop. */
  location?: LocationId;
  /** Book Now target; defaults to the brand's booking site. */
  bookingUrl?: string;
  locale?: Locale;
};

/** Logo, primary navigation and Book Now, shared by every page. */
export function SiteHeader({ location, bookingUrl = business.links.booking, locale = "en" }: SiteHeaderProps) {
  const t = getDictionary(locale).nav;
  const navigation = navigationFor(location, locale);
  const switchHref = alternateLanguagePath(location, locale);

  return (
    <header className="shell flex items-start justify-between pl-[1.625rem] pr-[1.25rem] pt-[1.4375rem] lg:items-center lg:px-10 lg:pt-8">
      <Link href={localePath(locale, "/")} aria-label={t.home(business.name)}>
        <Logo size={112} eager className="size-[5.3125rem] lg:size-[7rem]" />
      </Link>

      <nav aria-label={t.label} className="hidden lg:block">
        <ul className="flex items-center gap-7 xl:gap-10">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className="group relative whitespace-nowrap py-2 text-[0.75rem] font-medium uppercase tracking-[0.28em] text-foreground transition-colors duration-200 hover:text-primary focus-visible:text-primary"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
                />
              </Link>
            </li>
          ))}
          <li>
            <LanguageSwitch
              locale={locale}
              href={switchHref}
              className="py-2 text-[0.75rem] font-semibold tracking-[0.2em] text-foreground/80 transition-colors duration-200 hover:text-primary focus-visible:text-primary"
            />
          </li>
          <li>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.bookNowLabel}
              className="btn-sweep btn-sweep--invert-primary inline-flex h-11 items-center whitespace-nowrap rounded-full border-[1.5px] border-primary bg-primary px-7 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-white"
              {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick, location)}
            >
              {t.bookNow}
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-[1.4rem] pt-[0.6rem] lg:hidden">
        <LanguageSwitch
          locale={locale}
          href={switchHref}
          className="-my-3 py-3 text-[0.75rem] font-semibold tracking-[0.18em] text-foreground/85 transition-colors duration-200 hover:text-primary focus-visible:text-primary"
        />
        <SiteMenu location={location} bookingUrl={bookingUrl} locale={locale} />
      </div>
    </header>
  );
}
