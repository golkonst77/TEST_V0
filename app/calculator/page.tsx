import { Calculator } from "@/components/calculator"
import Head from "next/head"

export default function CalculatorPage() {
  return (
    <>
      <Head>
        <title>Калькулятор | ПростоБюро</title>
      </Head>
      <div id="calculator-page" className="min-h-screen bg-gray-50 py-2">
        <Calculator />
      </div>
    </>
  )
}
