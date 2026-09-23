import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { barbers } from "@/data/barbers";

const galleryImages = [
  {
    src: "/images/gallery/gallery-placeholder-1.svg",
    alt: "Placeholder for a finished haircut photograph",
  },
  {
    src: "/images/gallery/gallery-placeholder-2.svg",
    alt: "Placeholder for a barber working photograph",
  },
  {
    src: "/images/gallery/gallery-placeholder-3.svg",
    alt: "Placeholder for the Broadbeach barbershop interior",
  },
];

export function OurWorkAndBarbers() {
  return (
    <section id="work" className="py-[var(--space-section)]">
      <Container>
        <SectionHeading
          eyebrow="Our work + barbers"
          title="The work and the team [Placeholder]"
          description="Approved haircut, in-action, interior and team photography will replace these placeholders."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          {galleryImages.map((image, index) => (
            <div
              key={image.src}
              className={`relative overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface ${
                index === 0
                  ? "aspect-[4/3] lg:col-span-7"
                  : "aspect-[4/3] lg:col-span-5"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  index === 0
                    ? "(min-width: 1024px) 58vw, 100vw"
                    : "(min-width: 1024px) 42vw, 100vw"
                }
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-10">
          <h3 className="text-xl font-semibold">Broadbeach barbers [Placeholder]</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {barbers.map((barber) => (
              <article
                key={barber.id}
                className="grid overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface sm:grid-cols-[11rem_1fr]"
              >
                <div className="relative aspect-[4/3] bg-surface sm:aspect-auto sm:min-h-56">
                  <Image
                    src={barber.image}
                    alt={barber.imageAlt}
                    fill
                    sizes="(min-width: 640px) 176px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold">{barber.name}</h4>
                  <p className="mt-1 text-sm font-medium text-muted">{barber.role}</p>
                  <p className="mt-4 text-base text-muted">{barber.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
