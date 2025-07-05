import { PricingSection } from "@/components/pricing-section"
import { FAQ } from "@/components/faq"
import Head from "next/head"

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Тарифы | ПростоБюро</title>
      </Head>
      <div id="pricing-page" className="min-h-screen">
        <PricingSection />
        <FAQ />
      </div>
    </>
  )
}
