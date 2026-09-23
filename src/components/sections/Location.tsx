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
      className="relative isolate overflow-hidden bg-cold-white pb-[1.5rem] pt-[3.3rem] text-ink lg:pb-14 lg:pt-32"
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

      <div className="shell lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:px-10">
        <div className="px-[1.8rem] lg:px-0">
          <p className="text-[0.66rem] font-semibold uppercase leading-none tracking-[0.5em] text-teal-dark lg:text-[0.78rem]">
            Find us
          </p>
          <h2
            id="location-title"
            className="mt-[0.75rem] whitespace-nowrap text-[2.02rem] leading-[1.22] tracking-[-0.03em] text-ink lg:mt-6 lg:text-[2.75rem] lg:leading-[1.15] xl:text-[3.2rem]"
          >
            Right in the
            <br />
            Heart of Broadbeach
          </h2>

          <ul className="mt-[1.5rem] space-y-[1.2rem] text-[0.91rem] leading-[1.15] lg:mt-12 lg:space-y-8 lg:text-[1.15rem] lg:leading-[1.3]">
            <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
              <PinOutlineIcon className="ml-[0.2rem] mt-[0.05rem] h-[1.5rem] w-[1.15rem] lg:h-7 lg:w-[1.35rem]" />
              <address className="not-italic">
                {addressLines[0]}
                <br />
                {addressLines[1]}
              </address>
            </li>
            <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
              <ClockIcon className="-mt-[0.05rem] size-[1.55rem] lg:size-7" />
              <p>
                {business.hours.summary}
                <span className="mt-[0.2rem] block text-ink-muted">
                  {business.hours.detail}
                </span>
              </p>
            </li>
            <li className="flex items-start justify-between lg:block">
              <a
                href={business.phone.href}
                className="group grid grid-cols-[2.95rem_1fr] items-center transition-colors duration-200 hover:text-teal-dark focus-visible:text-teal-dark lg:inline-grid lg:grid-cols-[3.75rem_auto]"
                {...analyticsAttributes(ANALYTICS_EVENTS.phoneClick)}
              >
                <PhoneIcon className="ml-[0.1rem] size-[1.4rem] origin-bottom-left transition-transform duration-300 ease-out group-hover:-rotate-12 lg:size-[1.6rem]" />
                {business.phone.display}
              </a>
              <a
                href={business.links.maps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get directions in Google Maps (opens in a new tab)"
                className="btn-sweep btn-sweep--fill-ink group -mr-[0.75rem] mt-[0.3rem] flex h-[2.55rem] w-[10.7rem] items-center justify-center gap-[1.3rem] rounded-full border-[1.5px] border-ink text-[0.85rem] font-medium lg:mr-0 lg:mt-12 lg:h-14 lg:w-[15rem] lg:text-[1rem]"
                {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
              >
                Get Directions
                <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
              </a>
            </li>
          </ul>
        </div>

        <figure className="relative isolate mx-[0.85rem] mt-[1.2rem] h-[18rem] overflow-hidden rounded-[0.8rem] bg-[linear-gradient(180deg,#9fc3d6_0%,#d9e6ea_34%,#2e8a98_58%,#136d7c_100%)] lg:mx-0 lg:mt-0 lg:h-[36rem] lg:rounded-[1rem]">
          {backgrounds.locationFeature ? (
            <Image
              src={backgrounds.locationFeature}
              alt="Aerial view of the Broadbeach coastline and skyline"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="-z-10 object-cover"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent"
          />
          <figcaption className="absolute bottom-[1.1rem] left-[0.75rem] text-white lg:bottom-10 lg:left-10">
            <span className="block origin-bottom-left -rotate-[12deg] font-script text-[3.4rem] leading-[0.8] lg:text-[6.5rem]">
              Broadbeach
            </span>
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
        <p className="text-[0.48rem] font-medium uppercase leading-none tracking-[0.32em] text-ink/70 lg:text-[0.72rem] lg:tracking-[0.4em]">
          Cuts <span className="px-[0.4em]">•</span> Community{" "}
          <span className="px-[0.4em]">•</span> Coastline
        </p>
      </RuleLabel>
    </section>
  );
}
