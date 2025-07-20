"use client"

import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Guarantees } from "@/components/guarantees"
import { PricingSection } from "@/components/pricing-section"
import { FAQ } from "@/components/faq"
import { Calculator } from "@/components/calculator"
import { Reviews } from "@/components/reviews"
import { News } from "@/components/news"
import { Contacts } from "@/components/contacts"
import { Technologies } from "@/components/technologies"
import { useHomepageSections } from "@/hooks/use-homepage-sections"

export default function HomePage() {
  const { isSectionVisible, loading } = useHomepageSections()

  if (loading) {
    return (
      <main id="home-page" className="min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="home-page" className="min-h-screen">
      {isSectionVisible('hero') && <Hero />}
      {isSectionVisible('about') && <Guarantees />}
      {isSectionVisible('services') && <Services />}
      {isSectionVisible('pricing') && <PricingSection />}
      {isSectionVisible('faq') && <FAQ />}
      {isSectionVisible('calculator') && <Calculator />}
      {isSectionVisible('reviews') && <Reviews />}
      {isSectionVisible('news') && <News />}
      {isSectionVisible('technologies') && <Technologies />}
      {isSectionVisible('contacts') && <Contacts />}
    </main>
  )
}
