"use client"

import dynamic from 'next/dynamic'
import { useHomepageSections } from "@/hooks/use-homepage-sections"
import { useDeviceType } from "@/hooks/use-device-type"

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

export default function ClientHomePage() {
  const { isSectionVisible, loading } = useHomepageSections()
  const deviceType = useDeviceType()

  if (loading) {
    return null // Hero уже отображается, не показываем loader
  }

  // Определяем тип устройства для проверки видимости
  const deviceTypeForVisibility = deviceType === 'tablet' ? 'desktop' : deviceType

  return (
    <>
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
    </>
  )
}

