import Image from "next/image";

type LogoProps = {
  size: number;
  className?: string;
  /** Load immediately (above the fold) without competing with the hero preload. */
  eager?: boolean;
};

export function Logo({ size, className = "", eager = false }: LogoProps) {
  return (
    <Image
      src="/images/branding/mr-moustache-logo.webp"
      alt="Mr Moustache Barbershop, Gold Coast, Australia"
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      className={className}
    />
  );
}
