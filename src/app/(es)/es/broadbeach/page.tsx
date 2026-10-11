import { LocationPage, locationPageMetadata } from "@/components/pages/LocationPage";

export const metadata = locationPageMetadata("broadbeach", "es");

export default function SpanishBroadbeachPage() {
  return <LocationPage id="broadbeach" locale="es" />;
}
