import type { Metadata } from "next";
import {
  Cherry_Swash,
  Comforter_Brush,
  Instrument_Sans,
  Roboto,
} from "next/font/google";
import { business } from "@/data/business";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const cherrySwash = Cherry_Swash({
  variable: "--font-cherry-swash",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Accent only: the hand-lettered taglines in the location card and footer.
const comforterBrush = Comforter_Brush({
  variable: "--font-comforter-brush",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Google's UI typeface, used only inside the Google review cards.
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mr Moustache Barbershop Broadbeach",
    template: "%s | Mr Moustache Broadbeach",
  },
  description:
    "Mr Moustache Barbershop in Broadbeach, Gold Coast. Book men's haircuts and skin fades through Square.",
  keywords: [
    "barber Broadbeach",
    "barbershop Broadbeach",
    "men's haircut Broadbeach",
    "skin fade Broadbeach",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: "Mr Moustache Barbershop Broadbeach",
    title: "Mr Moustache Barbershop Broadbeach",
    description:
      "Mr Moustache Barbershop in Broadbeach, Gold Coast. Book online through Square.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mr Moustache Barbershop Broadbeach",
    description:
      "Mr Moustache Barbershop in Broadbeach, Gold Coast. Book online through Square.",
  },
  // Favicon, app icons and share images come from the file conventions in
  // src/app (favicon.ico, icon.png, apple-icon.png, opengraph-image.jpg,
  // twitter-image.jpg), all generated from the real Mr Moustache logo.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.suburb,
      addressRegion: business.address.state,
      postalCode: business.address.postcode,
      addressCountry: business.address.countryCode,
    },
    telephone: business.phone.href.replace("tel:", ""),
    areaServed: "Broadbeach, Gold Coast",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: business.openingHours.map((item) => item.day),
      opens: business.openingHours[0].opens,
    },
    // TODO: Add confirmed geo, closing times, price range and public URL.
  };

  return (
    <html
      lang="en-AU"
      className={`${instrumentSans.variable} ${cherrySwash.variable} ${comforterBrush.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
