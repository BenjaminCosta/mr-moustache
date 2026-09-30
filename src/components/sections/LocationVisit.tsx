import Image from "next/image";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { ScriptText } from "@/components/ui/ScriptText";
import { backgrounds } from "@/data/media";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { joinList } from "@/lib/opening-hours";
import type { ShopLocation } from "@/types";
import { ShopDetails } from "./ShopDetails";

/** "Find us" on a shop's page: address, the full week of hours, phone and maps. */
export function LocationVisit({ location }: { location: ShopLocation }) {
  return (
    <section
      id="find-us"
      aria-labelledby="find-us-title"
      className="relative isolate overflow-hidden bg-cold-white pb-[2.25rem] pt-[4rem] text-ink lg:pb-14 lg:pt-32"
    >
      {backgrounds.location ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[56.6rem] [mask-image:linear-gradient(to_bottom,black_85%,transparent)] lg:h-[60rem]"
        >
          <Image
            src={backgrounds.location}
            quality={50}
            alt=""
            fill
            sizes="100vw"
            className="object-cover lg:object-contain lg:object-right-top"
          />
        </div>
      ) : null}

      <div className="shell lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16 lg:px-10">
        <div className="px-[1.8rem] lg:px-0">
          <h2
            id="find-us-title"
            className="font-sans text-[0.75rem] font-semibold uppercase leading-none tracking-[0.4em] text-teal-dark lg:text-[0.78rem] lg:tracking-[0.5em]"
          >
            Find us in {location.name}
          </h2>
          <p className="mt-[0.75rem] text-balance font-display text-[2.02rem] font-bold leading-[1.05] tracking-[-0.03em] text-ink lg:mt-6 lg:text-[2.75rem] lg:leading-[1.15] xl:text-[3.2rem]">
            See you in
            <br />
            the chair.
          </p>
          <p className="mt-[0.6rem] max-w-[20rem] text-[0.86rem] leading-[1.3] text-ink-muted lg:mt-5 lg:max-w-none lg:text-[1.15rem] lg:leading-[1.4]">
            A short trip from {joinList(location.page.nearby)}.
          </p>

          <div className="mt-[1.55rem] lg:mt-12">
            <ShopDetails location={location} showName={false} hoursOpen />
          </div>

          <p className="mt-[1.1rem] text-[0.85rem] leading-[1.5] lg:mt-8 lg:text-[1rem]">
            <a
              href={location.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-dark underline decoration-teal-dark/35 underline-offset-4 transition-colors duration-200 hover:decoration-teal-dark"
              {...analyticsAttributes(ANALYTICS_EVENTS.googleClick, location.id)}
            >
              See Mr Moustache {location.name} on Google Maps
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>

        <figure className="relative isolate mx-[0.85rem] mt-[1.5rem] h-[18rem] overflow-hidden rounded-[0.8rem] bg-[linear-gradient(180deg,#9fc3d6_0%,#d9e6ea_34%,#2e8a98_58%,#136d7c_100%)] lg:mx-0 lg:mt-[3.25rem] lg:h-[36rem] lg:rounded-[1rem]">
          {backgrounds.locationFeature ? (
            <Image
              src={backgrounds.locationFeature}
              alt="Aerial view of the Gold Coast coastline from Broadbeach to Surfers Paradise"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="-z-10 object-cover"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent lg:h-2/3 lg:from-black/50"
          />
          <figcaption className="absolute bottom-[1.1rem] left-[0.75rem] text-white lg:bottom-10 lg:left-10">
            <ScriptText className="block origin-bottom-left -rotate-[12deg] text-[3.4rem] leading-[0.8] lg:text-[6.5rem]">
              Gold Coast
            </ScriptText>
            <span className="mt-[0.4rem] block pl-[1rem] font-display text-[0.79rem] uppercase leading-[1.25] tracking-[0.42em] lg:mt-4 lg:pl-8 lg:text-[1.2rem]">
              Good looks
              <br />
              live here
            </span>
          </figcaption>
        </figure>
      </div>

      <RuleLabel
        className="shell mt-[1.45rem] gap-[0.95rem] px-[1.6rem] lg:mt-20 lg:gap-8 lg:px-10"
        lineClassName="bg-ink/30"
      >
        <p className="text-[0.6rem] font-medium uppercase leading-none tracking-[0.32em] text-ink/70 lg:text-[0.72rem] lg:tracking-[0.4em]">
          Cuts <span className="px-[0.4em]">•</span> Community{" "}
          <span className="px-[0.4em]">•</span> Coastline
        </p>
      </RuleLabel>
    </section>
  );
}
