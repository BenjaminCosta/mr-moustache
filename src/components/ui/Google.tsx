import Image from "next/image";
import { StarIcon } from "@/components/ui/Icons";

type StarsProps = {
  rating: number;
  className?: string;
  starClassName?: string;
};

/**
 * Five Google-yellow stars; a fractional rating fills the last star partially
 * (4.9 shows four full stars and a 90% star), like Google Maps.
 */
export function GoogleStars({ rating, className = "", starClassName = "" }: StarsProps) {
  return (
    <span
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
      className={`flex ${className}`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, rating - index));
        return (
          <span key={index} className={`relative block shrink-0 ${starClassName}`}>
            <StarIcon className="absolute inset-0 size-full text-[#5f6368]" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon className={`h-full text-google-star ${starClassName}`} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

type LogoProps = { className?: string };

export function GoogleWordmark({ className = "" }: LogoProps) {
  return (
    <Image
      src="/images/brands/google-wordmark.svg"
      alt="Google"
      width={512}
      height={168}
      unoptimized
      className={className}
    />
  );
}

export function GoogleG({ className = "" }: LogoProps) {
  return (
    <Image
      src="/images/brands/google-g.svg"
      alt=""
      width={256}
      height={262}
      unoptimized
      className={className}
    />
  );
}
