import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowRightIcon, ChevronRightIcon, StarIcon } from "@/components/ui/Icons";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { business } from "@/data/business";
import { addressLines, locations } from "@/data/locations";
import { backgrounds } from "@/data/media";
import { googleRatings } from "@/data/reviews";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

const locationTags: Record<(typeof locations)[number]["id"], string> = {
  "surfers-paradise": "The original",
  broadbeach: "Now open",
};

const ratingSummary = locations
  .map((location) => {
    const rating = googleRatings.find((item) => item.id === location.id);
    return rating ? `${rating.rating.toFixed(1)} ${location.name}` : null;
  })
  .filter(Boolean)
  .join(" · ");

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-background pb-[1.9rem] lg:pb-24">
      <div className="relative isolate flex min-h-[38rem] flex-col lg:min-h-[max(40rem,calc(100svh-12rem))]">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          {backgrounds.hero ? (
            // Desktop: the portrait photo sits on the right and fades into the copy.
            <div className="absolute inset-0 lg:left-auto lg:w-[58%]">
              <Image
                src={backgrounds.hero}
                alt=""
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[70%_center] lg:object-[center_35%]"
              />
              <div className="absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r from-black to-transparent lg:block" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_80%_20%,#2a2a2a_0%,#111_45%,#000_80%)] lg:bg-[radial-gradient(70%_90%_at_75%_35%,#2a2a2a_0%,#111_45%,#000_85%)]" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-black/75 to-black lg:h-1/2 lg:via-black/40" />
          <div className="absolute inset-y-0 left-0 hidden w-[65%] bg-gradient-to-r from-black/85 via-black/45 to-transparent lg:block" />
        </div>

        <SiteHeader />

        <div className="shell mt-auto px-[1.625rem] pt-12 lg:px-10 lg:pb-14">
          <div className="lg:max-w-[52rem]">
            {/* The business name is the page's H1; the headline below stays the visual lead. */}
            <h1 className="font-sans text-[0.6rem] font-medium uppercase leading-none tracking-[0.19em] text-foreground/90 lg:text-[0.8rem] lg:tracking-[0.3em]">
              {business.name}
            </h1>
            <p className="mt-[0.4rem] text-balance font-display text-[2.4rem] font-bold leading-[0.92] tracking-[-0.015em] text-white lg:mt-5 lg:whitespace-nowrap lg:text-[4.5rem] lg:leading-[0.95] xl:text-[5.25rem]">
              Good cuts.
              <br />
              Good people.
              <br />
              Proper barbering.
            </p>
            <p className="mt-[0.55rem] text-[0.865rem] leading-[1.17] text-foreground/85 lg:mt-6 lg:max-w-[30rem] lg:text-[1.2rem] lg:leading-[1.45]">
              Classic cuts, skin fades, tapers and beard trims — in Surfers
              Paradise and Broadbeach.
            </p>

            <a
              href={business.links.booking}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book now through Square (opens in a new tab)"
              className="btn-sweep btn-sweep--invert-primary group mt-[0.95rem] flex h-[2.35rem] items-center justify-center gap-[1.15rem] rounded-full border-[1.5px] border-primary bg-primary text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white lg:mt-9 lg:inline-flex lg:h-14 lg:gap-5 lg:px-10 lg:text-[0.85rem] lg:tracking-[0.24em]"
              {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
            >
              Book Now
              <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
            </a>

            <p className="mt-[0.95rem] flex items-center gap-[0.5rem] text-[0.72rem] leading-none text-foreground lg:mt-8 lg:gap-3 lg:text-[0.95rem]">
              <span className="flex gap-[0.15rem] text-star lg:gap-1" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon key={index} className="size-[0.8rem] lg:size-[1.05rem]" />
                ))}
              </span>
              <span>{ratingSummary} on Google</span>
            </p>
            <p className="mt-[0.35rem] text-[0.66rem] leading-tight tracking-[0.03em] text-foreground/80 lg:mt-3 lg:text-[0.9rem]">
              Two Gold Coast barbershops. One Mr Moustache.
            </p>
          </div>
        </div>
      </div>

      {/* Location selector: stacked cards on phones, a split pair from 64rem. */}
      <div className="shell mt-[1.25rem] px-[1.1rem] lg:mt-6 lg:px-10">
        <RuleLabel className="gap-[0.8rem] px-[0.4rem] lg:gap-6 lg:px-0" lineClassName="bg-foreground/85">
          <p className="text-[0.5rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
            Choose your barbershop
          </p>
        </RuleLabel>

        <ul className="mt-[0.9rem] grid gap-[0.5rem] lg:mt-10 lg:grid-cols-2 lg:gap-6">
          {locations.map((location) => (
            <li
              key={location.id}
              className="relative isolate flex h-[13.5rem] flex-col justify-end overflow-hidden rounded-[0.5rem] border border-white/20 bg-[#101010] lg:h-[26rem] lg:rounded-[0.75rem]"
            >
              <Image
                src={location.image.src}
                alt={location.image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="-z-10 object-cover"
                style={{ objectPosition: location.image.position }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.7)_42%,rgba(0,0,0,0.3)_100%)]"
              />

              <div className="px-[1.05rem] pb-[1.05rem] lg:px-7 lg:pb-7 xl:px-9 xl:pb-9">
                <p className="text-[0.5rem] font-medium uppercase leading-none tracking-[0.4em] text-primary lg:text-[0.72rem]">
                  {locationTags[location.id]}
                </p>
                <h2 className="mt-[0.55rem] font-display text-[1.9rem] font-bold leading-none tracking-[-0.02em] text-white lg:mt-4 lg:whitespace-nowrap lg:text-[2.5rem] xl:text-[3.25rem]">
                  {location.name}
                </h2>
                <p className="mt-[0.5rem] text-[0.6rem] uppercase leading-snug tracking-[0.2em] text-foreground/85 lg:mt-4 lg:text-[0.8rem] lg:tracking-[0.24em]">
                  {addressLines(location).join(" · ")}
                </p>

                <div className="mt-[0.85rem] flex items-center justify-between gap-[0.75rem] lg:mt-8">
                  <a
                    href={location.links.booking}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Book now at ${location.name} through Square (opens in a new tab)`}
                    className="btn-sweep btn-sweep--invert-primary group flex h-[2.35rem] items-center gap-[0.85rem] whitespace-nowrap rounded-full border-[1.5px] border-primary bg-primary px-[1.35rem] text-[0.66rem] font-medium uppercase tracking-[0.2em] text-white lg:h-14 lg:gap-4 lg:px-7 lg:text-[0.78rem] lg:tracking-[0.22em] xl:gap-5 xl:px-9 xl:text-[0.85rem] xl:tracking-[0.24em]"
                    {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
                  >
                    Book Now
                    <ArrowRightIcon className="size-[0.9rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
                  </a>
                  <a
                    href={`#${location.id}`}
                    className="group flex items-center gap-[0.45rem] whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.2em] text-foreground transition-colors duration-200 hover:text-primary focus-visible:text-primary lg:gap-3 lg:text-[0.7rem] xl:text-[0.78rem]"
                  >
                    Hours &amp; directions
                    <ChevronRightIcon className="h-[0.7rem] w-[0.4rem] transition-transform duration-300 ease-out group-hover:translate-x-[0.2rem] group-focus-visible:translate-x-[0.2rem] lg:h-4 lg:w-2.5" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
