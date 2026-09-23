import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import {
  CalendarIcon,
  ChevronRightIcon,
  GoogleIcon,
  InstagramIcon,
  PhoneIcon,
  PinIcon,
} from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { Moustache } from "@/components/ui/Moustache";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { addressLines, business } from "@/data/business";
import { backgrounds } from "@/data/media";
import {
  ANALYTICS_EVENTS,
  analyticsAttributes,
  type AnalyticsEvent,
} from "@/lib/analytics";

type SocialLink = {
  label: string;
  href: string;
  ariaLabel: string;
  event: AnalyticsEvent;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent?: boolean;
};

const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: business.links.instagram,
    ariaLabel: "Instagram (opens in a new tab)",
    event: ANALYTICS_EVENTS.instagramClick,
    Icon: InstagramIcon,
  },
  {
    label: "Google",
    href: business.links.google,
    ariaLabel: "Google reviews (opens in a new tab)",
    event: ANALYTICS_EVENTS.googleClick,
    Icon: GoogleIcon,
  },
  {
    label: "Book online",
    href: business.links.booking,
    ariaLabel: "Book online through Square (opens in a new tab)",
    event: ANALYTICS_EVENTS.bookingClick,
    Icon: CalendarIcon,
    accent: true,
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-background pb-[2.6rem] pt-[2.2rem] text-foreground lg:pb-10 lg:pt-20">
      {backgrounds.footer ? (
        <Image
          src={backgrounds.footer}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-bottom"
        />
      ) : null}

      <RuleLabel
        className="mx-auto w-[17rem] gap-[0.95rem] lg:w-[40rem] lg:gap-8"
        lineClassName="bg-foreground/90"
      >
        <Moustache width={34} className="lg:w-[3.25rem]" />
      </RuleLabel>

      <div className="shell lg:mt-16 lg:grid lg:grid-cols-3 lg:items-center lg:gap-x-12 lg:px-10">
        <div className="mt-[1.3rem] flex flex-col items-center text-center lg:mt-0">
          <Logo size={144} className="size-[7.25rem] lg:size-[9rem]" />
          <p className="mt-[0.6rem] font-display text-[2.15rem] font-bold leading-none tracking-[-0.02em] text-white lg:mt-5 lg:whitespace-nowrap lg:text-[2.25rem] xl:text-[2.6rem]">
            {business.shortName}
          </p>
          <p className="mt-[0.55rem] text-[0.58rem] uppercase leading-none tracking-[0.38em] lg:mt-3 lg:text-[0.7rem]">
            Broadbeach · Gold Coast
          </p>
          <p className="mt-[1.25rem] text-[0.55rem] uppercase leading-[1.95] tracking-[0.46em] text-foreground/90 lg:mt-6 lg:text-[0.64rem]">
            Two Gold Coast locations.
            <br />
            One Mr Moustache.
          </p>
        </div>

        <div>
          <ul className="mx-auto mt-[1.15rem] grid w-[19.7rem] grid-cols-3 divide-x divide-white/35 lg:mt-0 lg:w-full">
            {socialLinks.map(
              ({ label, href, ariaLabel, event, Icon, accent }) => (
                <li key={label} className="flex justify-center">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    className={`group flex flex-col items-center gap-[0.62rem] py-[0.1rem] text-[0.53rem] font-medium uppercase leading-none tracking-[0.12em] transition-colors lg:gap-4 lg:py-1 lg:text-[0.66rem] duration-200 ${
                      accent
                        ? "text-primary hover:text-white focus-visible:text-white"
                        : "text-foreground hover:text-primary focus-visible:text-primary"
                    }`}
                    {...analyticsAttributes(event)}
                  >
                    <Icon className="size-[1.45rem] lg:size-7 transition-transform duration-300 ease-out group-hover:-translate-y-[0.2rem] group-focus-visible:-translate-y-[0.2rem]" />
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>

          <div className="mx-auto mt-[1.3rem] w-[18.8rem] border-t border-white/40 lg:mt-8 lg:w-full">
            <a
              href={business.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${addressLines.join(", ")}, get directions (opens in a new tab)`}
              className="group grid grid-cols-[2.25rem_1fr_auto] items-center pb-[0.55rem] pl-[3.55rem] pr-[0.9rem] pt-[1.4rem] transition-colors lg:grid-cols-[2.75rem_1fr_auto] lg:pb-3 lg:pl-6 lg:pr-4 lg:pt-7 duration-200 hover:text-primary focus-visible:text-primary"
              {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
            >
              <PinIcon className="h-[1.2rem] w-[0.95rem] text-white transition-transform duration-300 ease-out group-hover:-translate-y-[0.15rem]" />
              <span className="text-[0.74rem] leading-[1.3] tracking-[0.02em] lg:text-[0.95rem]">
                {addressLines[0]}
                <br />
                {addressLines[1]}
              </span>
              <ChevronRightIcon className="h-[0.85rem] w-[0.5rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
            </a>
            <a
              href={business.phone.href}
              className="group grid grid-cols-[2.25rem_1fr_auto] items-center pb-[1.3rem] pl-[3.55rem] pr-[0.9rem] pt-[0.55rem] transition-colors lg:grid-cols-[2.75rem_1fr_auto] lg:pb-7 lg:pl-6 lg:pr-4 lg:pt-3 duration-200 hover:text-primary focus-visible:text-primary"
              {...analyticsAttributes(ANALYTICS_EVENTS.phoneClick)}
            >
              <PhoneIcon className="size-[1.1rem] origin-bottom-left text-white transition-transform duration-300 ease-out group-hover:-rotate-12" />
              <span className="text-[0.74rem] leading-[1.3] tracking-[0.03em] lg:text-[0.95rem]">
                {business.phone.display}
              </span>
              <ChevronRightIcon className="h-[0.85rem] w-[0.5rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
            </a>
            <span
              aria-hidden="true"
              className="mx-auto block h-px w-[17.6rem] bg-white/40 lg:w-full"
            />
          </div>
        </div>

        <p className="relative mx-auto mt-[1.6rem] w-fit -rotate-[14deg] pr-[1.2rem] font-script text-[2.6rem] leading-[1] text-foreground/70 lg:mt-0 lg:text-[4rem]">
          Good Hair
          <br />
          <span className="pl-[0.2rem]">Better People</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 120 20"
            className="absolute -bottom-[0.7rem] left-[1.4rem] w-[6.2rem] text-primary lg:-bottom-4 lg:left-10 lg:w-[9.5rem]"
            preserveAspectRatio="none"
          >
            <path
              d="M2 17C35 7 80 3 118 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </p>
      </div>

      <div className="shell lg:px-10">
        <p className="mt-[2.5rem] text-center text-[0.48rem] uppercase leading-none tracking-[0.22em] text-foreground/85 lg:mt-20 lg:border-t lg:border-white/20 lg:pt-8 lg:text-[0.66rem] lg:tracking-[0.3em]">
          © {new Date().getFullYear()} Mr Moustache Barbershop
        </p>
      </div>
    </footer>
  );
}
