import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import { LANGUAGE_TAGS } from "@/i18n/locales";
import { rootMetadata } from "@/lib/seo";
import { htmlClassName } from "../site-fonts";
import "../globals.css";

// Spanish pages (/es, /es/surfers-paradise, /es/broadbeach).
export const metadata = rootMetadata("es");

export default function SpanishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={LANGUAGE_TAGS.es} className={htmlClassName}>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
