import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { OurWorkAndBarbers } from "@/components/sections/OurWorkAndBarbers";
import { ReputationStory } from "@/components/sections/ReputationStory";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <OurWorkAndBarbers />
        <ReputationStory />
        <Location />
      </main>
      <Footer />
    </div>
  );
}
