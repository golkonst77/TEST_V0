"use client"

import dynamic from 'next/dynamic'
import { Hero } from "@/components/hero"
import { useHomepageSections } from "@/hooks/use-homepage-sections"
import { useDeviceType } from "@/hooks/use-device-type"
import { useEffect } from "react"

// Lazy load компонентов для ускорения загрузки
const Services = dynamic(() => import("@/components/services").then(mod => ({ default: mod.Services })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Guarantees = dynamic(() => import("@/components/guarantees").then(mod => ({ default: mod.Guarantees })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const PricingSection = dynamic(() => import("@/components/pricing-section").then(mod => ({ default: mod.PricingSection })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const FAQ = dynamic(() => import("@/components/faq").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Calculator = dynamic(() => import("@/components/calculator").then(mod => ({ default: mod.Calculator })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Reviews = dynamic(() => import("@/components/reviews").then(mod => ({ default: mod.Reviews })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const News = dynamic(() => import("@/components/news").then(mod => ({ default: mod.News })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Contacts = dynamic(() => import("@/components/contacts").then(mod => ({ default: mod.Contacts })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Technologies = dynamic(() => import("@/components/technologies").then(mod => ({ default: mod.Technologies })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const AIDocuments = dynamic(() => import("@/components/ai-documents").then(mod => ({ default: mod.AIDocuments })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})

export default function HomePage() {
  const { isSectionVisible, loading } = useHomepageSections()
  const deviceType = useDeviceType()

  // Скролл на верх при загрузке страницы
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // Сначала скроллим наверх
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    
    // Только если есть hash в URL - скроллим к элементу
    if (window.location.hash && !loading) {
      const hash = window.location.hash.substring(1)
      // Даём время на рендер секций
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 500)
    }
  }, [loading])

  const deviceTypeForVisibility = deviceType === 'tablet' ? 'desktop' : deviceType

  return (
    <main id="home-page" className="min-h-screen">
      {isSectionVisible('hero', deviceTypeForVisibility) && <Hero />}
      {isSectionVisible('guarantees', deviceTypeForVisibility) && <Guarantees />}
      {isSectionVisible('services', deviceTypeForVisibility) && <Services showTitle />}
      {isSectionVisible('technologies', deviceTypeForVisibility) && <Technologies />}
      {isSectionVisible('ai-documents', deviceTypeForVisibility) && <AIDocuments />}
      {isSectionVisible('pricing', deviceTypeForVisibility) && <PricingSection />}
      {isSectionVisible('faq', deviceTypeForVisibility) && <FAQ />}
      {isSectionVisible('calculator', deviceTypeForVisibility) && <Calculator />}
      {isSectionVisible('reviews', deviceTypeForVisibility) && <Reviews />}
      {isSectionVisible('news', deviceTypeForVisibility) && <News />}
      {isSectionVisible('contacts', deviceTypeForVisibility) && <Contacts />}
    </main>
  )
}
