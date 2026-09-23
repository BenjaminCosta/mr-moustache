type MoustacheProps = {
  /** Rendered width in CSS px at the 390px design width (scales with rem). */
  width: number;
  className?: string;
};

const MASK = "url(/images/icons/moustache.png) center / contain no-repeat";

/** Brand moustache mark, tinted with the current text colour. */
export function Moustache({ width, className = "" }: MoustacheProps) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 bg-current ${className}`}
      style={{
        width: `${width / 16}rem`,
        aspectRatio: "240 / 79",
        mask: MASK,
        WebkitMask: MASK,
      }}
    />
  );
}
