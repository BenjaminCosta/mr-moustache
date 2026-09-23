import type { ReactNode } from "react";

type RuleLabelProps = {
  children: ReactNode;
  className?: string;
  lineClassName?: string;
};

/** A centred label framed by a thin horizontal rule on each side. */
export function RuleLabel({
  children,
  className = "",
  lineClassName = "bg-foreground/80",
}: RuleLabelProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span aria-hidden="true" className={`h-px flex-1 ${lineClassName}`} />
      {children}
      <span aria-hidden="true" className={`h-px flex-1 ${lineClassName}`} />
    </div>
  );
}
