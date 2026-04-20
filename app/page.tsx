import Directory from "@/components/Directory";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import HeroSequence from "@/components/HeroSequence";
import Navbar from "@/components/Navbar";
import Strategy from "@/components/Strategy";
import StructuredData from "@/components/StructuredData";
import Waitlist from "@/components/Waitlist";
import { loadPrograms } from "@/lib/load-programs";

export default function Home() {
  const { programs, refreshedAt } = loadPrograms();

  return (
    <main className="relative min-h-screen bg-bg text-fg">
      <StructuredData programs={programs} />
      <Navbar />
      <HeroSequence />
      <Waitlist />
      <Directory programs={programs} refreshedAt={refreshedAt} />
      <Strategy />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
