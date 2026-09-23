import Image from "next/image";
import {
  ArrowRightIcon,
  ClockIcon,
  PhoneIcon,
  PinOutlineIcon,
} from "@/components/ui/Icons";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { addressLines, business } from "@/data/business";
import { backgrounds } from "@/data/media";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

export function Location() {
  return (
    <section
      id="location"
      aria-labelledby="location-title"
      className="relative isolate overflow-hidden bg-cold-white pb-[1.5rem] pt-[3.3rem] text-ink"
    >
      {backgrounds.location ? (
        <Image
          src={backgrounds.location}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
      ) : null}

      <div className="px-[1.8rem]">
        <p className="text-[0.66rem] font-semibold uppercase leading-none tracking-[0.5em] text-teal-dark">
          Find us
        </p>
        <h2
          id="location-title"
          className="mt-[0.75rem] whitespace-nowrap text-[2.02rem] leading-[1.22] tracking-[-0.03em] text-ink"
        >
          Right in the
          <br />
          Heart of Broadbeach
        </h2>

        <ul className="mt-[1.5rem] space-y-[1.2rem] text-[0.91rem] leading-[1.15]">
          <li className="grid grid-cols-[2.95rem_1fr] items-start">
            <PinOutlineIcon className="ml-[0.2rem] mt-[0.05rem] h-[1.5rem] w-[1.15rem]" />
            <address className="not-italic">
              {addressLines[0]}
              <br />
              {addressLines[1]}
            </address>
          </li>
          <li className="grid grid-cols-[2.95rem_1fr] items-start">
            <ClockIcon className="-mt-[0.05rem] size-[1.55rem]" />
            <p>
              {business.hours.summary}
              <span className="mt-[0.2rem] block text-ink-muted">
                {business.hours.detail}
              </span>
            </p>
          </li>
          <li className="flex items-start justify-between">
            <a
              href={business.phone.href}
              className="grid grid-cols-[2.95rem_1fr] items-center hover:text-teal-dark"
              {...analyticsAttributes(ANALYTICS_EVENTS.phoneClick)}
            >
              <PhoneIcon className="ml-[0.1rem] size-[1.4rem]" />
              {business.phone.display}
            </a>
            <a
              href={business.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions in Google Maps (opens in a new tab)"
              className="-mr-[0.75rem] mt-[0.3rem] flex h-[2.55rem] w-[10.7rem] items-center justify-center gap-[1.3rem] rounded-full border-[1.5px] border-ink text-[0.85rem] font-medium hover:bg-ink hover:text-cold-white"
              {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
            >
              Get Directions
              <ArrowRightIcon className="size-[1rem]" />
            </a>
          </li>
        </ul>
      </div>

      <figure className="relative isolate mx-[0.85rem] mt-[1.2rem] h-[18rem] overflow-hidden rounded-[0.8rem] bg-[linear-gradient(180deg,#9fc3d6_0%,#d9e6ea_34%,#2e8a98_58%,#136d7c_100%)]">
        {backgrounds.locationFeature ? (
          <Image
            src={backgrounds.locationFeature}
            alt="Aerial view of the Broadbeach coastline and skyline"
            fill
            sizes="100vw"
            className="-z-10 object-cover"
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent"
        />
        <figcaption className="absolute bottom-[1.1rem] left-[0.75rem] text-white">
          <span className="block origin-bottom-left -rotate-[12deg] font-script text-[3.4rem] leading-[0.8]">
            Broadbeach
          </span>
          <span className="mt-[0.4rem] block pl-[1rem] font-display text-[0.79rem] uppercase leading-[1.25] tracking-[0.42em]">
            Good looks
            <br />
            live here
          </span>
        </figcaption>
      </figure>

      <RuleLabel
        className="mt-[1.45rem] gap-[0.95rem] px-[1.6rem]"
        lineClassName="bg-ink/30"
      >
        <p className="text-[0.48rem] font-medium uppercase leading-none tracking-[0.32em] text-ink/70">
          Cuts <span className="px-[0.4em]">•</span> Community{" "}
          <span className="px-[0.4em]">•</span> Coastline
        </p>
      </RuleLabel>
    </section>
  );
}
