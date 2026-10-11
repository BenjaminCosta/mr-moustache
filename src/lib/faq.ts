import { addressLine, otherLocation } from "@/data/locations";
import { services as siteServices } from "@/data/services";
import type { Locale } from "@/i18n/locales";
import { serviceDescription } from "@/i18n/services";
import { hoursSentence, joinList } from "@/lib/opening-hours";
import type { Service, ShopLocation } from "@/types";

export type Faq = { question: string; answer: string };

/**
 * Questions people ask before booking a barber, answered from the shop data
 * (prices, hours, address), so the answers never drift from the rest of the page.
 */
export function locationFaqs(
  location: ShopLocation,
  services: Service[] = siteServices,
  locale: Locale = "en",
): Faq[] {
  const other = otherLocation(location.id);
  const priced = services
    .filter((service) => service.price)
    .map((service) => `${service.name} ${service.price}`);
  const kids = services.find((service) => service.id === "kids-seniors");
  const kidsNote = kids && serviceDescription(kids, locale).replace(/\.$/, "").toLowerCase();
  const shop = `Mr Moustache ${location.name}`;

  const faqs: Faq[] =
    locale === "es"
      ? [
          {
            question: `¿Los barberos de ${shop} hablan español?`,
            answer:
              "Sí. Nuestros barberos hablan español e inglés, así que puedes explicar el corte que quieres en tu idioma.",
          },
          {
            question: `¿Cuánto cuesta un corte en ${shop}?`,
            answer: `Precios en ${shop}: ${joinList(priced, locale)}.`,
          },
          {
            question: `¿Qué horario tiene la barbería en ${location.name}?`,
            answer: hoursSentence(location.openingHours, locale),
          },
          {
            question: "¿Cómo reservo una cita?",
            answer: `Reserva online con Square: elige el servicio, el barbero y el horario en ${shop}. También puedes llamar al ${location.phone.display}.`,
          },
          {
            question: `¿Dónde queda ${shop}?`,
            answer: `${addressLine(location)}. Nuestro otro local en la Gold Coast está en ${addressLine(other)}.`,
          },
        ]
      : [
          {
            question: `Do the barbers at ${shop} speak Spanish?`,
            answer:
              "Yes. Our barbers speak English and Spanish, so you can explain the cut you want in either language. Hablamos español.",
          },
          {
            question: `How much is a haircut at ${shop}?`,
            answer: `Prices at ${shop}: ${joinList(priced)}.`,
          },
          {
            question: `What are the opening hours in ${location.name}?`,
            answer: hoursSentence(location.openingHours),
          },
          {
            question: "How do I book an appointment?",
            answer: `Book online through Square: choose your service, your barber and a time at ${shop}. You can also call ${location.phone.display}.`,
          },
          {
            question: `Where is ${shop}?`,
            answer: `${addressLine(location)}. Our other Gold Coast shop is at ${addressLine(other)}.`,
          },
        ];

  if (kids?.price) {
    faqs.push(
      locale === "es"
        ? {
            question: "¿Cortan el pelo a niños?",
            answer: `Sí. El corte ${kids.name} cuesta ${kids.price} (${kidsNote}).`,
          }
        : {
            question: "Do you cut kids' hair?",
            answer: `Yes. ${kids.name} cuts are ${kids.price} (${kidsNote}).`,
          },
    );
  }

  return faqs;
}
