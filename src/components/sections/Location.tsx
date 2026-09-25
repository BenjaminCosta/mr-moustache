import Image from "next/image";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { backgrounds } from "@/data/media";
import { LocationTabs } from "./LocationTabs";

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
          <p className="text-balance font-display font-bold mt-[0.75rem] whitespace-nowrap text-[2.02rem] leading-[1.05] tracking-[-0.03em] text-ink lg:mt-6 lg:text-[2.75rem] lg:leading-[1.15] xl:text-[3.2rem]">
            Two spots.
            <br />
            Same standards.
          </p>
          <p className="mt-[0.6rem] max-w-[18.5rem] text-[0.86rem] leading-[1.2] text-ink-muted lg:mt-5 lg:max-w-none lg:text-[1.15rem] lg:leading-[1.4]">
            Find your nearest Mr&nbsp;Moustache and book your appointment.
          </p>

          <LocationTabs />
        </div>

        <figure className="relative isolate mx-[0.85rem] mt-[1.25rem] h-[18rem] overflow-hidden rounded-[0.8rem] bg-[linear-gradient(180deg,#9fc3d6_0%,#d9e6ea_34%,#2e8a98_58%,#136d7c_100%)] lg:mx-0 lg:mt-0 lg:h-[36rem] lg:rounded-[1rem]">
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
