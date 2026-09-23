import { Container } from "@/components/ui/Container";
import { business, formattedAddress } from "@/data/business";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-10">
      <Container className="flex flex-col gap-6 text-sm text-muted sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">{business.name}</p>
          <p className="mt-1 max-w-md">{formattedAddress}</p>
          <p className="mt-3">
            © {new Date().getFullYear()} {business.shortName}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a
            className="hover:text-foreground"
            href={business.links.maps}
            target="_blank"
            rel="noopener noreferrer"
            {...analyticsAttributes(ANALYTICS_EVENTS.directionsClick)}
          >
            Get directions
          </a>
          <a
            className="hover:text-foreground"
            href={business.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            {...analyticsAttributes(ANALYTICS_EVENTS.instagramClick)}
          >
            Instagram [Placeholder URL]
          </a>
        </div>
      </Container>
    </footer>
  );
}
