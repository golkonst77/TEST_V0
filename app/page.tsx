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
import { AIDocuments } from "@/components/ai-documents"
import { useHomepageSections } from "@/hooks/use-homepage-sections"
import { useEffect } from "react"

export default function HomePage() {
  const { isSectionVisible, loading } = useHomepageSections()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.location.hash) return
    if (loading) return // Ждем загрузки конфигурации
    let attempts = 0
    function tryScroll() {
      const el = document.getElementById(window.location.hash.substring(1))
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else if (attempts < 5) {
        attempts++
        setTimeout(tryScroll, 200)
      }
    }
    tryScroll()
  }, [typeof window !== "undefined" ? window.location.hash : null, loading])

  if (loading) {
    return (
      <main id="home-page" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </main>
    )
  }

  return (
    <main id="home-page" className="min-h-screen">
      {isSectionVisible('hero') && <Hero />}
      {isSectionVisible('guarantees') && <Guarantees />}
      {isSectionVisible('services') && <Services showTitle />}
      {isSectionVisible('technologies') && <Technologies />}
      {isSectionVisible('ai-documents') && <AIDocuments />}
      {isSectionVisible('pricing') && <PricingSection />}
      {isSectionVisible('faq') && <FAQ />}
      {isSectionVisible('calculator') && <Calculator />}
      {isSectionVisible('reviews') && <Reviews />}
      {isSectionVisible('news') && <News />}
      {isSectionVisible('contacts') && <Contacts />}
    </main>
  )
}
