import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Technologies } from "@/components/technologies"
import { Guarantees } from "@/components/guarantees"
import { PricingSection } from "@/components/pricing-section"
import { Calculator } from "@/components/calculator"
import { Reviews } from "@/components/reviews"
import { News } from "@/components/news"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Technologies />
      <Guarantees />
      <PricingSection />
      <Calculator />
      <Reviews />
      <News />
    </main>
  )
}
