import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Guarantees } from "@/components/guarantees"
import { PricingSection } from "@/components/pricing-section"
import { Calculator } from "@/components/calculator"
import { Reviews } from "@/components/reviews"
import { News } from "@/components/news"
import { Contacts } from "@/components/contacts"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Guarantees />
      <PricingSection />
      <Calculator />
      <Reviews />
      <News />
      <Contacts />
    </main>
  )
}
