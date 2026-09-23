"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Moustache } from "@/components/ui/Moustache";
import { business } from "@/data/business";
import { ANALYTICS_EVENTS, analyticsAttributes } from "@/lib/analytics";

const navigation = [
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "Find Us", href: "#location" },
];

export function SiteMenu() {
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
      aria-label="Menu"
      className="fixed inset-0 z-50 bg-background/97 backdrop-blur-sm"
    >
      <button
        ref={closeRef}
        type="button"
        className="group absolute right-[0.5rem] top-[1.6rem] grid size-11 place-items-center text-foreground transition-colors duration-200 hover:text-primary"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
      >
        <CloseIcon className="size-6 transition-transform duration-300 ease-out group-hover:rotate-90" />
      </button>
      <nav
        aria-label="Primary navigation"
        className="flex h-full flex-col items-center justify-center gap-10 px-6 text-center"
      >
        <Moustache width={40} className="opacity-90" />
        <ul className="flex flex-col gap-6">
          {navigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-display text-[2rem] font-bold leading-none transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={business.links.booking}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sweep btn-sweep--invert-primary rounded-full border-[1.5px] border-primary bg-primary px-8 py-3 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-white"
          aria-label="Book now through Square (opens in a new tab)"
          {...analyticsAttributes(ANALYTICS_EVENTS.bookingClick)}
        >
          Book Now
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
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="h-[0.9375rem] w-[1.0625rem]" />
      </button>
      {open ? createPortal(panel, document.body) : null}
    </>
  );
}
