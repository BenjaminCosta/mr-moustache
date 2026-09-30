import { LocationPage, locationPageMetadata } from "@/components/pages/LocationPage";

export const metadata = locationPageMetadata("surfers-paradise");

export default function SurfersParadisePage() {
  return <LocationPage id="surfers-paradise" />;
}
