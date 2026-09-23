import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export function Services() {
  return (
    <section
      id="services"
      className="border-y border-border bg-surface py-[var(--space-section)]"
    >
      <Container>
        <SectionHeading
          eyebrow="Services & pricing"
          title="Services [Placeholder]"
          description="Confirmed Square service names, durations and prices will be added here."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-[var(--radius-md)] border border-dashed border-border bg-background p-6"
            >
              <h3 className="font-display text-xl font-bold">{service.name}</h3>
              <p className="mt-3 text-base text-muted">{service.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="text-muted">Price</dt>
                  <dd className="mt-1 font-medium text-foreground">{service.price}</dd>
                </div>
                <div>
                  <dt className="text-muted">Duration</dt>
                  <dd className="mt-1 font-medium text-foreground">{service.duration}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
