import { ChevronRightIcon } from "@/components/ui/Icons";
import { getLocation } from "@/data/locations";
import { services } from "@/data/services";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { squareServiceUrl } from "@/lib/constants";
import type { LocationId } from "@/types";

/** Every service with its price; each row opens it in Square at `location`. */
export function ServiceRows({ location }: { location: LocationId }) {
  const locationName = getLocation(location).name;

  return (
    <ul>
      {services.map((service) => (
        <li key={service.id} className="border-b border-white/35">
          <a
            href={squareServiceUrl(location, service.squareId)}
            target="_blank"
            rel="noopener noreferrer"
            {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick, location)}
            className="btn-sweep btn-sweep--row group grid grid-cols-[1fr_4.625rem_0.5rem] items-center gap-x-[1.1rem] py-[0.72rem] pl-[0.22rem] pr-[0.25rem] lg:grid-cols-[1fr_7.75rem_0.75rem] lg:gap-x-6 lg:py-7 lg:pl-4 lg:pr-4 xl:grid-cols-[1fr_9rem_0.75rem] xl:gap-x-8"
          >
            <span>
              <span className="block font-display text-[1.05rem] font-bold leading-[1.15] text-white transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary lg:text-[1.45rem] xl:text-[1.65rem]">
                {service.name}
              </span>
              <span className="mt-[0.15rem] block whitespace-pre-line text-[0.75rem] leading-[1.25] text-foreground/75 lg:mt-2 lg:whitespace-normal lg:text-[0.95rem] lg:leading-normal">
                {service.description}
              </span>
            </span>
            <span className="whitespace-nowrap text-foreground">
              {service.price ? (
                <span className="text-[0.8rem] lg:text-[1.1rem] xl:text-[1.2rem]">{service.price}</span>
              ) : (
                <span className="pl-[0.15rem] text-[0.78rem] lg:pl-0 lg:text-[1.1rem]">
                  Price varies
                </span>
              )}
            </span>
            <span className="sr-only">
              Book at {locationName} through Square (opens in a new tab)
            </span>
            <ChevronRightIcon className="h-[0.95rem] w-[0.55rem] text-primary transition-transform duration-300 ease-out group-hover:translate-x-[0.2rem] group-focus-visible:translate-x-[0.2rem] lg:h-5 lg:w-3" />
          </a>
        </li>
      ))}
    </ul>
  );
}
