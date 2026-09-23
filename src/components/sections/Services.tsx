import Image from "next/image";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@/components/ui/Icons";
import { Moustache } from "@/components/ui/Moustache";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { business } from "@/data/business";
import { backgrounds } from "@/data/media";
import { services } from "@/data/services";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

const bookingLinkProps = {
  href: business.links.booking,
  target: "_blank",
  rel: "noopener noreferrer",
  ...analyticsAttributes(ANALYTICS_EVENTS.bookingClick),
} as const;

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative isolate overflow-hidden bg-background pb-[1.9rem] pt-[4.6rem]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {backgrounds.services ? (
          <Image
            src={backgrounds.services}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(90%_22%_at_30%_0%,#1b1b1b_0%,transparent_100%),radial-gradient(90%_18%_at_80%_100%,#1b1b1b_0%,transparent_100%)]" />
        )}
      </div>

      <div className="px-[1.35rem]">
        <RuleLabel className="gap-[0.8rem] px-[0.5rem]" lineClassName="bg-foreground/85">
          <p className="text-[0.5rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground">
            Services
          </p>
        </RuleLabel>

        <h2
          id="services-title"
          className="mt-[1.15rem] text-center text-[1.87rem] leading-none tracking-[-0.02em] text-white"
        >
          Tried. True. Tailored.
        </h2>
        <p className="mt-[0.5rem] text-center text-[0.857rem] leading-tight text-foreground/80">
          Choose your service and book your time online.
        </p>

        <ul className="mt-[1.3rem] border-t border-white/35">
          {services.map((service) => (
            <li key={service.id} className="border-b border-white/35">
              <a
                {...bookingLinkProps}
                aria-label={`Book ${service.name} through Square (opens in a new tab)`}
                className="group grid grid-cols-[1fr_4.625rem_0.5rem] items-center gap-x-[1.25rem] py-[0.72rem] pl-[0.22rem]"
              >
                <span>
                  <span className="block font-display text-[1.05rem] font-bold leading-[1.15] text-white">
                    {service.name}
                  </span>
                  <span className="mt-[0.15rem] block whitespace-pre-line text-[0.67rem] leading-[1.22] text-foreground/75">
                    {service.description}
                  </span>
                </span>
                <span className="whitespace-nowrap text-foreground">
                  {service.price ? (
                    <>
                      <span className="text-[0.8rem]">{service.price}</span>
                      <span className="text-[0.71rem]">
                        <span className="px-[0.3rem]">·</span>
                        {service.duration}
                      </span>
                    </>
                  ) : (
                    <span className="pl-[0.15rem] text-[0.78rem]">Price varies</span>
                  )}
                </span>
                <ChevronRightIcon className="h-[0.95rem] w-[0.55rem] text-primary transition-transform group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
          <li className="border-b border-white/35">
            <a
              {...bookingLinkProps}
              aria-label="View all services on Square (opens in a new tab)"
              className="group flex h-[2.75rem] items-center justify-between pl-[0.35rem] text-primary hover:text-primary-hover"
            >
              <span className="flex items-center gap-[0.5rem] text-[0.62rem] font-semibold uppercase tracking-[0.15em]">
                View all services
                <PlusIcon className="size-[0.6rem]" />
              </span>
              <ChevronRightIcon className="mr-[0.25rem] h-[0.95rem] w-[0.55rem] transition-transform group-hover:translate-x-0.5" />
            </a>
          </li>
        </ul>

        <a
          {...bookingLinkProps}
          aria-label="Book your appointment through Square (opens in a new tab)"
          className="mt-[1.05rem] flex h-[2.6rem] items-center justify-center gap-[1.1rem] rounded-[0.1875rem] border-[1.5px] border-primary text-primary hover:bg-primary/10"
        >
          <CalendarIcon className="mr-[0.1rem] size-[1.3rem]" />
          <span className="mr-[0.15rem] text-[0.62rem] font-semibold uppercase tracking-[0.2em]">
            Book your appointment
          </span>
          <ArrowRightIcon className="size-[0.8rem]" />
        </a>

        <div className="mt-[1.6rem] flex flex-col items-center text-foreground/45">
          <RuleLabel className="w-[7.8rem] gap-[0.6rem]" lineClassName="bg-foreground/35">
            <Moustache width={26} className="opacity-90" />
          </RuleLabel>
          <p className="mt-[0.5rem] text-[0.47rem] uppercase leading-none tracking-[0.36em]">
            Mr Moustache
          </p>
          <p className="mt-[0.4rem] text-[0.34rem] uppercase leading-none tracking-[0.45em]">
            Broadbeach
          </p>
        </div>
      </div>
    </section>
  );
}
