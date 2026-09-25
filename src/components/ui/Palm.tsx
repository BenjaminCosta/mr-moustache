import type { CSSProperties } from "react";

type PalmProps = {
  /** Rendered width in CSS px at the 390px design width (scales with rem). */
  width: number;
  /** Extra classes; a responsive `w-*` overrides `width`. */
  className?: string;
};

const MASK = "url(/images/icons/palm.png) center / contain no-repeat";

/** Brand palm mark, tinted with the current text colour. */
export function Palm({ width, className = "" }: PalmProps) {
  return (
    <span
      aria-hidden="true"
      className={`block w-(--palm-w) shrink-0 bg-current ${className}`}
      style={
        {
          "--palm-w": `${width / 16}rem`,
          aspectRatio: "136 / 160",
          mask: MASK,
          WebkitMask: MASK,
        } as CSSProperties
      }
    />
  );
}
