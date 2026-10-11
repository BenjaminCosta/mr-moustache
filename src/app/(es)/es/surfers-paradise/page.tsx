import { LocationPage, locationPageMetadata } from "@/components/pages/LocationPage";

export const metadata = locationPageMetadata("surfers-paradise", "es");

export default function SpanishSurfersParadisePage() {
  return <LocationPage id="surfers-paradise" locale="es" />;
}
