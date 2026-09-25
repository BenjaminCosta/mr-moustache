import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { OurWork } from "@/components/sections/OurWork";
import { Reputation } from "@/components/sections/Reputation";
import { Services } from "@/components/sections/Services";
import { WorkWithUs } from "@/components/sections/WorkWithUs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <Services />
        <OurWork />
        <Reputation />
        <Location />
        <WorkWithUs />
      </main>
      <Footer />
    </div>
  );
}
