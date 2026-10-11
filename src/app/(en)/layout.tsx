import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import { LANGUAGE_TAGS } from "@/i18n/locales";
import { rootMetadata } from "@/lib/seo";
import { htmlClassName } from "../site-fonts";
import "../globals.css";

// English pages (/, /surfers-paradise, /broadbeach). Spanish ones under /es
// have their own root layout so each document declares its own language.
export const metadata = rootMetadata("en");

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={LANGUAGE_TAGS.en} className={htmlClassName}>
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
