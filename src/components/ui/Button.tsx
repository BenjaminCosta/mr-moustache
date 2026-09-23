import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "secondary";
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border px-5 py-2.5 text-center text-base font-semibold leading-tight no-underline";

const variantClasses = {
  primary:
    "border-primary bg-primary text-black hover:border-primary-hover hover:bg-primary-hover",
  secondary:
    "border-border bg-background text-foreground hover:border-foreground hover:bg-surface",
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
