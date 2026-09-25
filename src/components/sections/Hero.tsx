import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowRightIcon, StarIcon } from "@/components/ui/Icons";
import { Moustache } from "@/components/ui/Moustache";
import { Palm } from "@/components/ui/Palm";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { business } from "@/data/business";
import { locations } from "@/data/locations";
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
    <section id="top" className="relative isolate overflow-hidden bg-background">
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

      <div className="bg-background">
        <div className="shell grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center px-[1.625rem] py-[1.1rem] lg:min-h-[5.5rem] lg:px-10 lg:py-0">
          <div className="grid min-w-0 grid-cols-[1.85rem_1fr] items-center gap-x-[0.8rem] pr-5 lg:grid-cols-[3.4rem_1fr] lg:gap-x-6 lg:pr-16">
            <Palm width={27} className="text-primary lg:w-10" />
            <div>
              <p className="text-[0.38rem] font-medium uppercase leading-none tracking-[0.2em] text-foreground/70 lg:text-[0.68rem] lg:tracking-[0.34em]">
                Our second location
              </p>
              <p className="mt-[0.3rem] font-sans text-[0.68rem] font-semibold uppercase leading-none tracking-[0.13em] text-foreground lg:mt-2 lg:text-[1.2rem] lg:tracking-[0.24em]">
                Broadbeach
              </p>
              <p className="mt-[0.26rem] text-[0.35rem] font-medium uppercase leading-none tracking-[0.18em] text-foreground/70 lg:mt-2 lg:text-[0.62rem] lg:tracking-[0.32em]">
                After Surfers Paradise
              </p>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-[1.85rem_1fr] items-center gap-x-[0.8rem] border-l border-white/45 pl-5 lg:grid-cols-[3.4rem_1fr] lg:gap-x-6 lg:pl-16">
            <Moustache width={34} className="text-foreground lg:w-14" />
            <p className="text-[0.4rem] font-medium uppercase leading-[1.45] tracking-[0.18em] text-foreground lg:text-[0.7rem] lg:leading-[1.45] lg:tracking-[0.34em]">
              Same standards.
              <br />
              A fresh spot.
            </p>
          </div>
        </div>
      </div>

      <div className="shell mt-[1.25rem] px-[1.625rem] lg:mt-10 lg:px-10">
        <RuleLabel className="gap-[0.8rem] px-[0.4rem] lg:gap-6 lg:px-0" lineClassName="bg-foreground/85">
          <p className="text-[0.5rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]">
            Our locations
          </p>
        </RuleLabel>

        <ul className="mt-[1rem] border-b border-white/25 lg:mt-10">
          {locations.map((location) => (
            <li
              key={location.id}
              className="border-white/25 [&:not(:first-child)]:border-t"
            >
              <a
                href={`#${location.id}`}
                aria-label={`View Mr Moustache ${location.name} hours and directions`}
                className="group flex items-center justify-between gap-5 py-[1.2rem] text-left text-foreground lg:py-9"
              >
                <span>
                  <span className="block text-[0.47rem] font-medium uppercase leading-none tracking-[0.3em] text-primary lg:text-[0.74rem] lg:tracking-[0.4em]">
                    {locationTags[location.id]}
                  </span>
                  <span className="mt-[0.58rem] block font-display text-[2rem] font-bold leading-none tracking-[-0.02em] text-white lg:mt-4 lg:text-[3.5rem] xl:text-[4rem]">
                    {location.name}
                  </span>
                </span>
                <ArrowRightIcon className="size-[1.7rem] shrink-0 text-foreground transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-10" />
              </a>
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}
