"use client"

import { Hero } from "@/components/hero"
import { TrustSection } from "@/components/trust-section"
import { CtaFinalSection } from "@/components/cta-final-section"
import { CasesSection } from "@/components/cases-section"
import { CaseDetailedSection } from "@/components/case-detailed-section"
import { ComparisonSection } from "@/components/comparison-section"
import { useHomepageSections } from "@/hooks/use-homepage-sections"
import { useDeviceType } from "@/hooks/use-device-type"
import { useEffect } from "react"

// Lazy load компонентов для ускорения загрузки
import dynamicImport from 'next/dynamic'

const Services = dynamicImport(() => import("@/components/services").then(mod => ({ default: mod.Services })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Guarantees = dynamicImport(() => import("@/components/guarantees").then(mod => ({ default: mod.Guarantees })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const PricingSection = dynamicImport(() => import("@/components/pricing-section").then(mod => ({ default: mod.PricingSection })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const FAQ = dynamicImport(() => import("@/components/faq").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Calculator = dynamicImport(() => import("@/components/calculator").then(mod => ({ default: mod.Calculator })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Reviews = dynamicImport(() => import("@/components/reviews").then(mod => ({ default: mod.Reviews })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const News = dynamicImport(() => import("@/components/news").then(mod => ({ default: mod.News })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Contacts = dynamicImport(() => import("@/components/contacts").then(mod => ({ default: mod.Contacts })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const Technologies = dynamicImport(() => import("@/components/technologies").then(mod => ({ default: mod.Technologies })), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
})
const AIDocuments = dynamicImport(() => import("@/components/ai-documents").then(mod => ({ default: mod.AIDocuments })), {
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

  const check = (sectionKey: string) =>
    isSectionVisible(sectionKey, deviceTypeForVisibility)

  return (
    <main id="home-page" className="min-h-screen">
      {check('hero') && <Hero />}
      {check('trust') && <TrustSection />}
      {(check("about") || check("guarantees")) && <Guarantees />}
      {check('services') && <Services showTitle />}
      {check('technologies') && <Technologies />}
      {check('ai-documents') && <AIDocuments />}
      {check('pricing') && <PricingSection />}
      {check('cta-final') && <CtaFinalSection />}
      {check('cases') && <CasesSection />}
      {check('case-detailed') && <CaseDetailedSection />}
      {check('comparison') && <ComparisonSection />}
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
