"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Moustache } from "@/components/ui/Moustache";
import { business } from "@/data/business";
import { navigationFor } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";
import type { LocationId } from "@/types";

type SiteMenuProps = {
  location?: LocationId;
  bookingUrl?: string;
  locale?: Locale;
};

export function SiteMenu({ location, bookingUrl = business.links.booking, locale = "en" }: SiteMenuProps) {
  const t = getDictionary(locale).nav;
  const navigation = navigationFor(location, locale);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  // The panel is portalled to <body> so it escapes the hero's stacking context.
  const panel = (
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label={t.menu}
      className="fixed inset-0 z-50 bg-background/97 backdrop-blur-sm"
    >
      <button
        ref={closeRef}
        type="button"
        className="group absolute right-[0.5rem] top-[1.6rem] grid size-11 place-items-center text-foreground transition-colors duration-200 hover:text-primary"
        aria-label={t.closeMenu}
        onClick={() => setOpen(false)}
      >
        <CloseIcon className="size-6 transition-transform duration-300 ease-out group-hover:rotate-90" />
      </button>
      <nav
        aria-label={t.label}
        className="flex h-full flex-col items-center justify-center gap-10 px-6 text-center"
      >
        <Moustache width={40} className="opacity-90" />
        <ul className="flex flex-col gap-6">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className="font-display text-[2rem] font-bold leading-none transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sweep btn-sweep--invert-primary rounded-full border-[1.5px] border-primary bg-primary px-8 py-3 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-white"
          aria-label={t.bookNowLabel}
          {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick, location)}
        >
          {t.bookNow}
        </a>
      </nav>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="group -m-3 grid size-11 place-items-center text-foreground transition-colors duration-200 hover:text-primary"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={t.openMenu}
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="h-[0.9375rem] w-[1.0625rem]" />
      </button>
      {open ? createPortal(panel, document.body) : null}
    </>
  );
}
