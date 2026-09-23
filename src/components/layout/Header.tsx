import { BookingLink } from "@/components/ui/BookingLink";
import { Container } from "@/components/ui/Container";
import { business } from "@/data/business";

const navigation = [
  { label: "Services", href: "#services" },
  { label: "Our Work & Barbers", href: "#work" },
  { label: "Our Story", href: "#story" },
  { label: "Location", href: "#location" },
];

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <a
          href="#top"
          className="text-base font-semibold leading-tight tracking-tight sm:text-lg"
          aria-label={`${business.shortName} ${business.locationName}, back to top`}
        >
          {business.shortName}
          <span className="ml-2 font-normal text-muted">{business.locationName}</span>
        </a>

        <nav
          className="order-3 w-full overflow-x-auto sm:order-2 sm:w-auto"
          aria-label="Primary navigation"
        >
          <ul className="flex min-w-max items-center gap-5 text-sm font-medium text-muted">
            {navigation.map((item) => (
              <li key={item.href}>
                <a className="hover:text-foreground" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <BookingLink className="order-2 px-4 py-2 text-sm sm:order-3" />
      </Container>
    </header>
  );
}
