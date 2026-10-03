import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ArrowRightIcon, StarIcon } from "@/components/ui/Icons";
import { googleRatings } from "@/data/reviews";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import { reviewCountLabel } from "@/lib/relative-time";
import type { ShopLocation } from "@/types";

/** Top of a shop's page: breadcrumb, the "Barber in …" H1, booking and directions. */
export function LocationHero({ location }: { location: ShopLocation }) {
  const rating = googleRatings.find((item) => item.id === location.id);

  return (
    <section id="top" className="relative isolate overflow-hidden bg-background">
      <div className="relative isolate flex min-h-[40rem] flex-col lg:min-h-[max(40rem,calc(100svh-6rem))]">
        <div className="absolute inset-0 -z-10">
          {/* Desktop: the portrait photo sits on the right and fades into the copy. */}
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            <Image
              src={location.image.src}
              alt={location.image.alt}
              fill
              preload
              fetchPriority="high"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              style={{ objectPosition: location.image.position }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-black/40 lg:bg-black/20" />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-black via-black/60 to-transparent lg:block"
            />
          </div>
          {/* Keeps the logo and nav legible, and the copy crisp over the photo. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[9rem] bg-gradient-to-b from-black/70 to-transparent lg:h-[11rem] lg:from-black/75"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-b from-transparent via-black/80 to-black lg:h-1/2 lg:via-black/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 hidden w-[65%] bg-gradient-to-r from-black/85 via-black/45 to-transparent lg:block"
          />
        </div>

        <SiteHeader location={location.id} bookingUrl={location.links.booking} />

        <div className="shell mt-auto px-[1.625rem] pb-[2.75rem] pt-12 lg:px-10 lg:pb-20">
          <div className="lg:max-w-[46rem]">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-[0.6rem] text-[0.75rem] font-medium uppercase leading-none tracking-[0.2em] text-foreground/75 lg:text-[0.8rem] lg:tracking-[0.28em]">
                <li>
                  <Link href="/" className="transition-colors duration-200 hover:text-primary focus-visible:text-primary">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-primary">
                  {location.name}
                </li>
              </ol>
            </nav>

            <p className="mt-[1.1rem] text-[0.75rem] font-medium uppercase leading-none tracking-[0.19em] text-foreground/90 lg:mt-8 lg:text-[0.8rem] lg:tracking-[0.3em]">
              Mr Moustache Barbershop · {location.tag}
            </p>
            <h1 className="mt-[0.55rem] text-balance font-display text-[2.4rem] font-bold leading-[0.95] tracking-[-0.015em] text-white lg:mt-5 lg:text-[4.5rem] xl:text-[5.25rem]">
              {location.page.heading}
            </h1>
            <p className="mt-[0.75rem] text-[0.95rem] leading-[1.35] text-foreground/85 lg:mt-6 lg:max-w-[34rem] lg:text-[1.2rem] lg:leading-[1.45]">
              {location.page.intro}
            </p>

            <div className="mt-[1.2rem] flex flex-col gap-[0.6rem] lg:mt-9 lg:flex-row lg:gap-4">
              <a
                href={location.links.booking}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Book at ${location.name} through Square (opens in a new tab)`}
                className="btn-sweep btn-sweep--invert-primary group flex h-[2.6rem] items-center justify-center gap-[1.15rem] rounded-full border-[1.5px] border-primary bg-primary text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white lg:h-14 lg:px-10 lg:text-[0.85rem] lg:tracking-[0.24em]"
                {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick, location.id)}
              >
                Book at {location.name}
                <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
              </a>
              <a
                href={location.links.directions}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to Mr Moustache ${location.name} in Google Maps (opens in a new tab)`}
                className="btn-sweep btn-sweep--fill-white group flex h-[2.6rem] items-center justify-center gap-[1.15rem] rounded-full border-[1.5px] border-foreground text-[0.75rem] font-medium uppercase tracking-[0.2em] text-foreground lg:h-14 lg:px-10 lg:text-[0.85rem] lg:tracking-[0.24em]"
                {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick, location.id)}
              >
                Get Directions
                <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
              </a>
            </div>

            {rating ? (
              <p className="mt-[1.1rem] flex items-center gap-[0.5rem] text-[0.8rem] leading-none text-foreground lg:mt-8 lg:gap-3 lg:text-[0.95rem]">
                <span className="flex gap-[0.15rem] text-star lg:gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon key={index} className="size-[0.85rem] lg:size-[1.05rem]" />
                  ))}
                </span>
                <span>
                  {rating.rating.toFixed(1)} from {reviewCountLabel(rating.reviewCount)} Google reviews
                </span>
              </p>
            ) : null}
            <p className="mt-[0.5rem] text-[0.8rem] leading-tight tracking-[0.02em] text-foreground/80 lg:mt-3 lg:text-[0.9rem]">
              Spanish-speaking barbers ·{" "}
              <span lang="es" className="text-primary">
                Hablamos español
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
