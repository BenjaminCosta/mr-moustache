import { addressLine, otherLocation } from "@/data/locations";
import { services as siteServices } from "@/data/services";
import { hoursSentence, joinList } from "@/lib/opening-hours";
import type { Service, ShopLocation } from "@/types";

export type Faq = { question: string; answer: string };

/**
 * Questions people ask before booking a barber, answered from the shop data
 * (prices, hours, address), so the answers never drift from the rest of the page.
 */
export function locationFaqs(location: ShopLocation, services: Service[] = siteServices): Faq[] {
  const other = otherLocation(location.id);
  const priced = services
    .filter((service) => service.price)
    .map((service) => `${service.name} ${service.price}`);
  const kids = services.find((service) => service.id === "kids-seniors");

  const faqs: Faq[] = [
    {
      question: `Do the barbers at Mr Moustache ${location.name} speak Spanish?`,
      answer:
        "Yes. Our barbers speak English and Spanish, so you can explain the cut you want in either language. Hablamos español.",
    },
    {
      question: `How much is a haircut at Mr Moustache ${location.name}?`,
      answer: `Prices at Mr Moustache ${location.name}: ${joinList(priced)}.`,
    },
    {
      question: `What are the opening hours in ${location.name}?`,
      answer: hoursSentence(location.openingHours),
    },
    {
      question: "How do I book an appointment?",
      answer: `Book online through Square: choose your service, your barber and a time at Mr Moustache ${location.name}. You can also call ${location.phone.display}.`,
    },
    {
      question: `Where is Mr Moustache ${location.name}?`,
      answer: `${addressLine(location)}. Our other Gold Coast shop is at ${addressLine(other)}.`,
    },
  ];

  if (kids?.price) {
    faqs.push({
      question: "Do you cut kids' hair?",
      answer: `Yes. ${kids.name} cuts are ${kids.price} (${kids.description.replace(/\.$/, "").toLowerCase()}).`,
    });
  }

  return faqs;
}
