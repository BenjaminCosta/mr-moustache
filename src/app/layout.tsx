import type { Metadata } from "next";
import { Cherry_Swash, Instrument_Sans, Roboto } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@/components/Analytics";
import { business } from "@/data/business";
import { IS_INDEXABLE, SITE_URL } from "@/lib/constants";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";
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
// Self-hosted subset of Comforter Brush with just those glyphs (35 KB instead
// of 133 KB); regenerate it if the taglines change (see src/app/fonts).
const comforterBrush = localFont({
  src: "./fonts/comforter-brush-taglines.woff2",
  variable: "--font-comforter-brush",
  weight: "400",
  display: "swap",
  preload: false,
});

// Google's UI typeface, used only inside the Google review cards (below the fold).
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

// Site-wide defaults. Every page sets its own title, description, canonical
// and Open Graph tags through pageMetadata() in src/lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Mr Moustache Barbershop",
  },
  description: HOME_DESCRIPTION,
  applicationName: business.name,
  robots: IS_INDEXABLE
    ? { index: true, follow: true, "max-image-preview": "large" }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: business.name,
  },
  // Search Console "HTML tag" verification, if the DNS record is not an option.
  ...(googleSiteVerification && { verification: { google: googleSiteVerification } }),
  // Favicon, app icons and share images come from the file conventions in
  // src/app (favicon.ico, icon.png, apple-icon.png, opengraph-image.jpg,
  // twitter-image.jpg), all generated from the real Mr Moustache logo.
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${instrumentSans.variable} ${cherrySwash.variable} ${comforterBrush.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
