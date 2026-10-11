import { HomePage, homePageMetadata } from "@/components/pages/HomePage";

export const metadata = homePageMetadata("es");

export default function SpanishHome() {
  return <HomePage locale="es" />;
}
