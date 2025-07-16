import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Guarantees } from "@/components/guarantees"
import { PricingSection } from "@/components/pricing-section"
import { FAQ } from "@/components/faq"
import { Calculator } from "@/components/calculator"
import { Reviews } from "@/components/reviews"
import { News } from "@/components/news"
import { Contacts } from "@/components/contacts"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Главная | ПростоБюро",
}

export default function HomePage() {
  return (
    <main id="home-page" className="min-h-screen">
      <Hero />
      <Services />
      <Guarantees />
      <PricingSection />
      <FAQ />
      <Calculator />
      <Reviews />
      <News />
      <Contacts />
    </main>
  )
}
