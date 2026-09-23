import Image from "next/image";

type LogoProps = {
  size: number;
  className?: string;
  preload?: boolean;
};

export function Logo({ size, className = "", preload = false }: LogoProps) {
  return (
    <Image
      src="/images/branding/mr-moustache-logo.webp"
      alt="Mr Moustache Barbershop, Gold Coast, Australia"
      width={size}
      height={size}
      preload={preload}
      className={className}
    />
  );
}
