import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 18 16" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <path d="M0 1h18M0 15h18" />
      {/* Middle bar shortens from the left when the parent `group` is hovered. */}
      <path
        d="M0 8h18"
        className="origin-right transition-transform duration-300 ease-out [transform-box:fill-box] group-hover:scale-x-[0.6] group-focus-visible:scale-x-[0.6]"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12h17M13.5 5.5 20 12l-6.5 6.5" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 10 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m1.5 1.5 7 7.5-7 7.5" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="m12 1.8 3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M7 4.2v15.6c0 .8.9 1.3 1.6.9l12.3-7.8c.6-.4.6-1.4 0-1.8L8.6 3.3C7.9 2.9 7 3.4 7 4.2z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="4.5" width="19" height="17" rx="1.5" />
      <path d="M2.5 9.5h19M7 2.5v4M17 2.5v4" />
      <g fill="currentColor" stroke="none">
        <rect x="11" y="12.3" width="1.8" height="1.8" rx=".3" />
        <rect x="14.6" y="12.3" width="1.8" height="1.8" rx=".3" />
        <rect x="7.4" y="16" width="1.8" height="1.8" rx=".3" />
        <rect x="11" y="16" width="1.8" height="1.8" rx=".3" />
        <rect x="14.6" y="16" width="1.8" height="1.8" rx=".3" />
      </g>
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GoogleIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M21.6 10.2H12v3.9h5.5c-.5 2.6-2.7 4.3-5.5 4.3a6.4 6.4 0 1 1 4.2-11.2l2.9-2.9A10.4 10.4 0 1 0 12 22.4c6 0 10-4.2 10-10.1 0-.7-.1-1.4-.4-2.1z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 20 26" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M10 0C4.5 0 0 4.4 0 9.8 0 16.9 8.4 24.6 9 25.1c.6.5 1.4.5 2 0 .6-.5 9-8.2 9-15.3C20 4.4 15.5 0 10 0zm0 13.4a3.7 3.7 0 1 1 0-7.4 3.7 3.7 0 0 1 0 7.4z"
      />
    </svg>
  );
}

export function PinOutlineIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 20 26" fill="none" stroke="currentColor" strokeWidth="2.4" {...props}>
      <path d="M10 1.3c-4.8 0-8.7 3.8-8.7 8.5 0 6.2 7.4 13.2 8.1 13.8.4.3.8.3 1.2 0 .7-.6 8.1-7.6 8.1-13.8 0-4.7-3.9-8.5-8.7-8.5z" />
      <circle cx="10" cy="9.8" r="3.1" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10.5" />
      <path d="M12 6.5V12l3.6 3" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M6.6 1.6c.6-.2 1.3.1 1.6.7l2 4.2c.3.6.1 1.3-.4 1.7l-1.7 1.4c-.3.2-.4.7-.2 1 1.2 2.4 3.1 4.3 5.5 5.5.3.2.8.1 1-.2l1.4-1.7c.4-.5 1.1-.7 1.7-.4l4.2 2c.6.3.9 1 .7 1.6l-.8 2.7c-.3 1-1.2 1.6-2.2 1.6C10.6 21.7 2.3 13.4 2.3 4.6c0-1 .6-1.9 1.6-2.2z" />
    </svg>
  );
}
