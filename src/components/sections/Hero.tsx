import Image from "next/image";
import { BookingLink } from "@/components/ui/BookingLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { business, formattedAddress } from "@/data/business";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

export function Hero() {
  return (
    <section id="top" className="py-[var(--space-section)]">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Broadbeach, Gold Coast
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            {business.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            [Placeholder] Final headline and supporting copy will be added after
            brand and content approval.
          </p>
          <p className="mt-4 text-base text-foreground">{formattedAddress}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookingLink />
            <Button
              href={business.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              aria-label="Get directions in Google Maps (opens in a new tab)"
              {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
            >
              Get Directions
            </Button>
          </div>
        </div>

        <div className="relative aspect-[8/5] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface lg:aspect-[5/4]">
          <Image
            src="/images/hero/hero-placeholder.svg"
            alt="Placeholder for the approved Mr Moustache Broadbeach hero photograph"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
