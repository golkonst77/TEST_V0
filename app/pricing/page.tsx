import { PricingSection } from "@/components/pricing-section"
import Head from "next/head"

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Тарифы | ПростоБюро</title>
      </Head>
      <div id="pricing-page" className="min-h-screen">
        <PricingSection />
      </div>
    </>
  )
}
