import type { CSSProperties } from "react";

type MoustacheProps = {
  /** Rendered width in CSS px at the 390px design width (scales with rem). */
  width: number;
  /** Extra classes; a responsive `w-*` (e.g. `lg:w-14`) overrides `width`. */
  className?: string;
};

const MASK = "url(/images/icons/moustache.png) center / contain no-repeat";

/** Brand moustache mark, tinted with the current text colour. */
export function Moustache({ width, className = "" }: MoustacheProps) {
  return (
    <span
      aria-hidden="true"
      className={`block w-(--moustache-w) shrink-0 bg-current ${className}`}
      style={
        {
          "--moustache-w": `${width / 16}rem`,
          aspectRatio: "240 / 79",
          mask: MASK,
          WebkitMask: MASK,
        } as CSSProperties
      }
    />
  );
}
