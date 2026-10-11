import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { htmlClassName } from "./site-fonts";
import "./globals.css";

// With one root layout per language there is no layout around URLs that match
// no page, so this file renders their 404 on its own (experimental.globalNotFound).
// Next marks this page noindex on its own.
export const metadata: Metadata = {
  title: "Page not found | Mr Moustache Barbershop",
};

export default function GlobalNotFound() {
  return (
    <html lang="en-AU" className={htmlClassName}>
      <body className="flex min-h-full flex-col items-center justify-center bg-background px-6 py-16 text-center">
        <Logo size={112} eager className="size-[6rem] lg:size-[7rem]" />
        <h1 className="mt-8 font-display text-[2.4rem] font-bold leading-none text-white lg:text-[3.5rem]">
          Page not found
        </h1>
        <p className="mt-4 max-w-[26rem] text-[1rem] leading-[1.45] text-foreground/80">
          That page doesn&rsquo;t exist, but your next cut does.
        </p>
        <p lang="es" className="mt-2 text-[0.9rem] text-foreground/60">
          Esta página no existe.
        </p>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[0.8rem] font-medium uppercase tracking-[0.2em]">
          <Link
            href="/"
            className="btn-sweep btn-sweep--invert-primary rounded-full border-[1.5px] border-primary bg-primary px-7 py-3 text-white"
          >
            Home
          </Link>
          <Link
            href="/es"
            lang="es"
            hrefLang="es"
            className="btn-sweep btn-sweep--fill-white rounded-full border-[1.5px] border-foreground px-7 py-3 text-foreground"
          >
            Inicio en español
          </Link>
        </nav>
      </body>
    </html>
  );
}
