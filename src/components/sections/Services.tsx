import Image from "next/image";
import { ArrowRightIcon, CalendarIcon } from "@/components/ui/Icons";
import { Moustache } from "@/components/ui/Moustache";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { business } from "@/data/business";
import { backgrounds } from "@/data/media";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { ServiceList } from "./ServiceList";

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
      className="relative isolate overflow-clip bg-background pb-[2.65rem] pt-[5rem] lg:py-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {backgrounds.services ? (
          <>
            <Image
              src={backgrounds.services}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* Tools only peek in at the top and bottom edges, as in the mockup;
                the very edges fade to black so the section blends into its neighbours. */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.5)_9%,rgba(0,0,0,0.9)_19%,rgba(0,0,0,0.95)_50%,rgba(0,0,0,0.9)_82%,rgba(0,0,0,0.45)_92%,rgba(0,0,0,1)_100%)]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(90%_22%_at_30%_0%,#1b1b1b_0%,transparent_100%),radial-gradient(90%_18%_at_80%_100%,#1b1b1b_0%,transparent_100%)] lg:bg-[radial-gradient(45%_55%_at_10%_30%,#1b1b1b_0%,transparent_100%),radial-gradient(35%_45%_at_90%_55%,#161616_0%,transparent_100%)]" />
        )}
      </div>

      <div className="shell flex flex-col px-[1.35rem] lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-start lg:gap-x-14 lg:px-10 xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] xl:gap-x-24">
        {/* Heading, booking CTA and brand mark stay pinned beside the list on desktop. */}
        <div className="contents lg:sticky lg:top-12 lg:block">
          <RuleLabel
            className="gap-[0.8rem] px-[0.5rem] lg:gap-5 lg:px-0 lg:[&>span:first-child]:hidden"
            lineClassName="bg-foreground/85"
          >
            <h2 id="services-title" className="text-[0.5rem] font-sans font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
              Barber services &amp; prices
            </h2>
          </RuleLabel>

          <p className="text-balance font-display font-bold mt-[1.15rem] text-center text-[1.87rem] leading-none tracking-[-0.02em] text-white lg:mt-8 lg:text-left lg:text-[3.25rem] lg:leading-[1.02] xl:text-[4rem]">
            Tried. True. <br className="hidden lg:inline" />
            Tailored.
          </p>
          <p className="mt-[0.5rem] text-center text-[0.857rem] leading-tight text-foreground/80 lg:mt-6 lg:text-left lg:text-[1.1rem] lg:leading-normal">
            Book your next cut at Mr Moustache.
          </p>

          <a
            {...bookingLinkProps}
            aria-label="Book your appointment through Square (opens in a new tab)"
            className="btn-sweep btn-sweep--fill-white group order-last mt-[1.05rem] flex h-[2.6rem] items-center justify-center gap-[1.1rem] rounded-[0.1875rem] border-[1.5px] border-foreground text-foreground lg:mt-10 lg:h-14 lg:gap-4 xl:gap-5"
          >
            <CalendarIcon className="mr-[0.1rem] size-[1.3rem] lg:size-6" />
            <span className="mr-[0.15rem] whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.2em] lg:text-[0.7rem] xl:text-[0.78rem] xl:tracking-[0.26em]">
              Book your appointment
            </span>
            <ArrowRightIcon className="size-[0.8rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-4" />
          </a>

          <div className="order-last mt-[1.6rem] flex flex-col items-center text-foreground/45 lg:mt-14 lg:items-start">
            <RuleLabel
              className="w-[7.8rem] gap-[0.6rem] lg:w-auto lg:[&>span:not(:nth-child(2))]:w-12 lg:[&>span:not(:nth-child(2))]:flex-none"
              lineClassName="bg-foreground/35"
            >
              <Moustache width={26} className="opacity-90 lg:w-10" />
            </RuleLabel>
            <p className="mt-[0.5rem] text-[0.47rem] uppercase leading-none tracking-[0.36em] lg:mt-3 lg:text-[0.66rem]">
              Mr Moustache
            </p>
            <p className="mt-[0.4rem] text-[0.34rem] uppercase leading-none tracking-[0.45em] lg:mt-2 lg:text-[0.5rem]">
              Gold Coast
            </p>
          </div>
        </div>

        <ServiceList />
      </div>
    </section>
  );
}
