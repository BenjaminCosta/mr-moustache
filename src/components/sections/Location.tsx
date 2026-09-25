import Image from "next/image";
import {
  ArrowRightIcon,
  ClockIcon,
  PhoneIcon,
  PinOutlineIcon,
} from "@/components/ui/Icons";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { addressLines, locations } from "@/data/locations";
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
          className="-z-10 object-cover lg:object-contain lg:object-right-top"
        />
      ) : null}

      <div className="shell lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:px-10">
        <div className="px-[1.8rem] lg:px-0">
          <h2 id="location-title" className="text-[0.66rem] font-sans font-semibold uppercase leading-none tracking-[0.5em] text-teal-dark lg:text-[0.78rem]">
            Find us
          </h2>
          <p className="text-balance font-display font-bold mt-[0.75rem] whitespace-nowrap text-[2.02rem] leading-[1.22] tracking-[-0.03em] text-ink lg:mt-6 lg:text-[2.75rem] lg:leading-[1.15] xl:text-[3.2rem]">
            Two barbershops
            <br />
            on the Gold Coast
          </p>
          <p className="mt-[0.6rem] text-[0.91rem] leading-[1.25] text-ink-muted lg:mt-5 lg:text-[1.15rem] lg:leading-[1.4]">
            Find Mr&nbsp;Moustache in Surfers Paradise and Broadbeach, and book
            at the shop closest to you.
          </p>

          {locations.map((location) => {
            const [street, suburb] = addressLines(location);
            return (
              <article
                key={location.id}
                id={location.id}
                aria-labelledby={`${location.id}-title`}
                className="mt-[1.6rem] scroll-mt-6 border-t border-ink/15 pt-[1.4rem] lg:mt-12 lg:pt-10"
              >
                <h3
                  id={`${location.id}-title`}
                  className="font-display text-[1.45rem] font-bold leading-none tracking-[-0.02em] text-ink lg:text-[2rem]"
                >
                  {location.name}
                </h3>

                <ul className="mt-[1.1rem] space-y-[1.2rem] text-[0.91rem] leading-[1.15] lg:mt-8 lg:space-y-8 lg:text-[1.15rem] lg:leading-[1.3]">
                  <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
                    <PinOutlineIcon className="ml-[0.2rem] mt-[0.05rem] h-[1.5rem] w-[1.15rem] lg:h-7 lg:w-[1.35rem]" />
                    <address className="not-italic">
                      {street}
                      <br />
                      {suburb}
                    </address>
                  </li>
                  <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
                    <ClockIcon className="-mt-[0.05rem] size-[1.55rem] lg:size-7" />
                    {location.hours ? (
                      <p>
                        {location.hours.summary}
                        <span className="mt-[0.2rem] block text-ink-muted">
                          {location.hours.detail}
                        </span>
                      </p>
                    ) : (
                      // Placeholder until the shop's hours are confirmed.
                      <p>
                        Opening hours
                        <span className="mt-[0.2rem] block text-ink-muted">
                          To be confirmed
                        </span>
                      </p>
                    )}
                  </li>
                  <li className="grid grid-cols-[2.95rem_1fr] items-start lg:grid-cols-[3.75rem_1fr]">
                    <PhoneIcon className="ml-[0.1rem] size-[1.4rem] lg:size-[1.6rem]" />
                    <a
                      href={location.phone.href}
                      className="w-fit transition-colors duration-200 hover:text-teal-dark focus-visible:text-teal-dark"
                      {...analyticsAttributes(ANALYTICS_EVENTS.phoneClick)}
                    >
                      {location.phone.display}
                    </a>
                  </li>
                </ul>

                <div className="mt-[1.3rem] grid grid-cols-2 gap-[0.5rem] lg:mt-10 lg:flex lg:gap-4">
                  <a
                    href={location.links.booking}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Book now at ${location.name} through Square (opens in a new tab)`}
                    className="btn-sweep btn-sweep--invert-primary group flex h-[2.55rem] items-center justify-center gap-[0.9rem] rounded-full border-[1.5px] border-primary bg-primary text-[0.8rem] font-medium text-white lg:h-14 lg:w-[15rem] lg:gap-[1.3rem] lg:text-[1rem]"
                    {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
                  >
                    Book Now
                    <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
                  </a>
                  <a
                    href={location.links.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to Mr Moustache ${location.name} in Google Maps (opens in a new tab)`}
                    className="btn-sweep btn-sweep--fill-ink group flex h-[2.55rem] items-center justify-center gap-[0.9rem] rounded-full border-[1.5px] border-ink text-[0.8rem] font-medium lg:h-14 lg:w-[15rem] lg:gap-[1.3rem] lg:text-[1rem]"
                    {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
                  >
                    Get Directions
                    <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <figure className="relative isolate mx-[0.85rem] mt-[1.9rem] h-[18rem] overflow-hidden rounded-[0.8rem] bg-[linear-gradient(180deg,#9fc3d6_0%,#d9e6ea_34%,#2e8a98_58%,#136d7c_100%)] lg:mx-0 lg:mt-0 lg:h-[36rem] lg:rounded-[1rem]">
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
            <span className="block origin-bottom-left -rotate-[12deg] font-script text-[3.4rem] leading-[0.8] lg:text-[6.5rem]">
              Gold Coast
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
