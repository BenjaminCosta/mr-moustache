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
import { ANALYTICS_EVENTS, analyticsAttributes, type AnalyticsEvent } from "@/lib/analytics";

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
    <footer className="relative isolate overflow-hidden bg-background pb-[2.6rem] pt-[2.2rem] text-foreground">
      {backgrounds.footer ? (
        <Image
          src={backgrounds.footer}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-bottom"
        />
      ) : null}

      <RuleLabel className="mx-auto w-[17rem] gap-[0.95rem]" lineClassName="bg-foreground/90">
        <Moustache width={34} />
      </RuleLabel>

      <div className="mt-[1.3rem] flex flex-col items-center text-center">
        <Logo size={116} className="size-[7.25rem]" />
        <p className="mt-[0.6rem] font-display text-[2.15rem] font-bold leading-none tracking-[-0.02em] text-white">
          {business.shortName}
        </p>
        <p className="mt-[0.55rem] text-[0.58rem] uppercase leading-none tracking-[0.38em]">
          Broadbeach · Gold Coast
        </p>
        <p className="mt-[1.25rem] text-[0.55rem] uppercase leading-[1.95] tracking-[0.46em] text-foreground/90">
          Two Gold Coast locations.
          <br />
          One Mr Moustache.
        </p>
      </div>

      <ul className="mx-auto mt-[1.15rem] grid w-[19.7rem] grid-cols-3 divide-x divide-white/35">
        {socialLinks.map(({ label, href, ariaLabel, event, Icon, accent }) => (
          <li key={label} className="flex justify-center">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className={`group flex flex-col items-center gap-[0.62rem] py-[0.1rem] text-[0.53rem] font-medium uppercase leading-none tracking-[0.12em] transition-colors duration-200 ${
                accent
                  ? "text-primary hover:text-white focus-visible:text-white"
                  : "text-foreground hover:text-primary focus-visible:text-primary"
              }`}
              {...analyticsAttributes(event)}
            >
              <Icon className="size-[1.45rem] transition-transform duration-300 ease-out group-hover:-translate-y-[0.2rem] group-focus-visible:-translate-y-[0.2rem]" />
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-[1.3rem] w-[18.8rem] border-t border-white/40">
        <a
          href={business.links.maps}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${addressLines.join(", ")}, get directions (opens in a new tab)`}
          className="group grid grid-cols-[2.25rem_1fr_auto] items-center pb-[0.55rem] pl-[3.55rem] pr-[0.9rem] pt-[1.4rem] transition-colors duration-200 hover:text-primary focus-visible:text-primary"
          {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
        >
          <PinIcon className="h-[1.2rem] w-[0.95rem] text-white transition-transform duration-300 ease-out group-hover:-translate-y-[0.15rem]" />
          <span className="text-[0.74rem] leading-[1.3] tracking-[0.02em]">
            {addressLines[0]}
            <br />
            {addressLines[1]}
          </span>
          <ChevronRightIcon className="h-[0.85rem] w-[0.5rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
        </a>
        <a
          href={business.phone.href}
          className="group grid grid-cols-[2.25rem_1fr_auto] items-center pb-[1.3rem] pl-[3.55rem] pr-[0.9rem] pt-[0.55rem] transition-colors duration-200 hover:text-primary focus-visible:text-primary"
          {...analyticsAttributes(ANALYTICS_EVENTS.phoneClick)}
        >
          <PhoneIcon className="size-[1.1rem] origin-bottom-left text-white transition-transform duration-300 ease-out group-hover:-rotate-12" />
          <span className="text-[0.74rem] leading-[1.3] tracking-[0.03em]">{business.phone.display}</span>
          <ChevronRightIcon className="h-[0.85rem] w-[0.5rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
        </a>
        <span aria-hidden="true" className="mx-auto block h-px w-[17.6rem] bg-white/40" />
      </div>

      <p className="relative mx-auto mt-[1.6rem] w-fit -rotate-[14deg] pr-[1.2rem] font-script text-[2.6rem] leading-[1] text-foreground/70">
        Good Hair
        <br />
        <span className="pl-[0.2rem]">Better People</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 120 20"
          className="absolute -bottom-[0.7rem] left-[1.4rem] w-[6.2rem] text-primary"
          preserveAspectRatio="none"
        >
          <path d="M2 17C35 7 80 3 118 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </p>

      <p className="mt-[2.5rem] text-center text-[0.48rem] uppercase leading-none tracking-[0.22em] text-foreground/85">
        © {new Date().getFullYear()} Mr Moustache Barbershop
      </p>
    </footer>
  );
}
