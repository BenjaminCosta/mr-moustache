"use client";

import { useRef, type ReactNode } from "react";
import { useNearViewport } from "@/hooks/useNearViewport";

type ScriptTextProps = {
  as?: "span" | "p";
  className?: string;
  children: ReactNode;
};

/**
 * Hand-lettered tagline in Comforter Brush. Browsers download a web font as
 * soon as text using it renders, even far below the fold, so the font class
 * is only applied when the tagline nears the viewport; until then it is
 * off-screen text in the body font.
 */
export function ScriptText({ as = "span", className = "", children }: ScriptTextProps) {
  const ref = useRef<HTMLParagraphElement & HTMLSpanElement>(null);
  const near = useNearViewport(ref);
  const classes = `${near ? "font-script" : ""} ${className}`;

  return as === "p" ? (
    <p ref={ref} className={classes}>
      {children}
    </p>
  ) : (
    <span ref={ref} className={classes}>
      {children}
    </span>
  );
}
