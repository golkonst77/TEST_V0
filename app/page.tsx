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

  const check = (sectionKey: string) => {
    const visible = isSectionVisible(sectionKey, deviceTypeForVisibility)
    console.log("SECTION CHECK", sectionKey, visible, deviceTypeForVisibility)
    return visible
  }

  return (
    <main id="home-page" className="min-h-screen">
      {check('hero') && <Hero />}
      {check('guarantees') && <Guarantees />}
      {check('services') && <Services showTitle />}
      {check('technologies') && <Technologies />}
      {check('ai-documents') && <AIDocuments />}
      {check('pricing') && <PricingSection />}
      {check('faq') && <FAQ />}
      {check('calculator') && <Calculator />}
      {check('reviews') && (
        <>
          <section className="bg-white/60">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <p className="text-sm text-gray-600 text-center">
                Работаем по договору, всегда на связи и отвечаем за результат
              </p>
            </div>
          </section>
          <Reviews />
        </>
      )}
      {check('news') && <News />}
      {check('contacts') && <Contacts />}
    </main>
  )
}
