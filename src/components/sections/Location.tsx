import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { business, formattedAddress } from "@/data/business";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

export function Location() {
  return (
    <section
      id="location"
      className="border-y border-border bg-surface py-[var(--space-section)]"
    >
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow="Visit us" title="Location & opening hours" />
          <address className="mt-6 not-italic text-lg leading-8 text-muted">
            {formattedAddress}
          </address>
          <Button
            className="mt-6"
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

        <div>
          <h3 className="text-xl font-semibold">Opening hours [Placeholder]</h3>
          <dl className="mt-5 divide-y divide-border border-y border-border">
            {business.openingHours.map((item) => (
              <div
                key={item.day}
                className="grid grid-cols-2 gap-4 py-3 text-base"
              >
                <dt className="font-medium">{item.day}</dt>
                <dd className="text-right text-muted">{item.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
