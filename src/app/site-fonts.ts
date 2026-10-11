import { Cherry_Swash, Instrument_Sans, Roboto } from "next/font/google";
import localFont from "next/font/local";

// Shared by the English and Spanish root layouts.

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const cherrySwash = Cherry_Swash({
  variable: "--font-cherry-swash",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Accent only: the hand-lettered taglines in the location card and footer.
// Self-hosted subset of Comforter Brush with just those glyphs (35 KB instead
// of 133 KB); regenerate it if the taglines change (see src/app/fonts).
const comforterBrush = localFont({
  src: "./fonts/comforter-brush-taglines.woff2",
  variable: "--font-comforter-brush",
  weight: "400",
  display: "swap",
  preload: false,
});

// Google's UI typeface, used only inside the Google review cards (below the fold).
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/** Class names for <html>: every font's CSS variable plus the base layout. */
export const htmlClassName = `${instrumentSans.variable} ${cherrySwash.variable} ${comforterBrush.variable} ${roboto.variable} h-full antialiased`;
