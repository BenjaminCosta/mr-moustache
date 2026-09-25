import Link from "next/link";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { Logo } from "@/components/ui/Logo";
import { business } from "@/data/business";
import { navigation } from "@/data/navigation";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

/** Logo, primary navigation and Book Now, shared by every page. */
export function SiteHeader() {
  return (
    <header className="shell flex items-start justify-between pl-[1.625rem] pr-[1.25rem] pt-[1.4375rem] lg:items-center lg:px-10 lg:pt-8">
      <Link href="/" aria-label={`${business.name}, home`}>
        <Logo size={112} eager className="size-[5.3125rem] lg:size-[7rem]" />
      </Link>

      <nav aria-label="Primary navigation" className="hidden lg:block">
        <ul className="flex items-center gap-7 xl:gap-10">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
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
            <a
              href={business.links.booking}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book now through Square (opens in a new tab)"
              className="btn-sweep btn-sweep--invert-primary inline-flex h-11 items-center whitespace-nowrap rounded-full border-[1.5px] border-primary bg-primary px-7 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-white"
              {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
            >
              Book now
            </a>
          </li>
        </ul>
      </nav>

      <div className="pt-[0.6rem] lg:hidden">
        <SiteMenu />
      </div>
    </header>
  );
}
