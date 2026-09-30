import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { RuleLabel } from "@/components/ui/RuleLabel";
import { addressLine, locationPath, otherLocation } from "@/data/locations";
import type { LocationId } from "@/types";

/** Link from one shop's page to the other one. */
export function OtherLocation({ location }: { location: LocationId }) {
  const other = otherLocation(location);

  return (
    <section aria-labelledby="other-shop-title" className="bg-background pb-[3.5rem] lg:pb-32">
      <div className="shell px-[1.625rem] lg:px-10">
        <RuleLabel className="gap-[0.8rem] px-[0.4rem] lg:gap-6 lg:px-0" lineClassName="bg-foreground/85">
          <h2
            id="other-shop-title"
            className="font-sans text-[0.6rem] font-medium uppercase leading-none tracking-[0.4em] text-foreground lg:text-[0.72rem]"
          >
            Also on the Gold Coast
          </h2>
        </RuleLabel>

        <Link
          href={locationPath(other.id)}
          className="group mt-[1rem] flex items-center justify-between gap-5 border-b border-white/25 py-[1.2rem] text-foreground lg:mt-10 lg:py-9"
        >
          <span>
            <span className="block text-[0.6rem] font-medium uppercase leading-none tracking-[0.3em] text-primary lg:text-[0.74rem] lg:tracking-[0.4em]">
              {other.tag}
            </span>
            <span className="mt-[0.58rem] block font-display text-[2rem] font-bold leading-none tracking-[-0.02em] text-white lg:mt-4 lg:text-[3.5rem] xl:text-[4rem]">
              {other.name}
            </span>
            <span className="mt-[0.5rem] block text-[0.85rem] leading-tight text-foreground/75 lg:mt-4 lg:text-[1.1rem]">
              Mr Moustache {other.name} · {addressLine(other)}
            </span>
          </span>
          <ArrowRightIcon className="size-[1.7rem] shrink-0 text-foreground transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-10" />
        </Link>
      </div>
    </section>
  );
}
