import { HomePage, homePageMetadata } from "@/components/pages/HomePage";

export const metadata = homePageMetadata("en");

export default function Home() {
  return <HomePage locale="en" />;
}
