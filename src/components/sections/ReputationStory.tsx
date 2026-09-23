import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviews } from "@/data/reviews";

export function ReputationStory() {
  return (
    <section
      id="story"
      className="border-y border-border bg-surface py-[var(--space-section)]"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Reputation + brand story"
              title="Mr Moustache in Broadbeach [Placeholder]"
              description="Approved brand story and the relationship with the established Surfers Paradise location will be added here."
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold">Verified reviews [Placeholder]</h3>
            <div className="mt-6 grid gap-4">
              {reviews.map((review) => (
                <figure
                  key={review.id}
                  className="rounded-[var(--radius-md)] border border-border bg-background p-6"
                >
                  <blockquote className="text-lg leading-8">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm text-muted">
                    <span className="font-medium text-foreground">{review.author}</span>
                    <span className="mt-1 block">{review.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
