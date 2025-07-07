import { Calculator } from "@/components/calculator"
import Head from "next/head"

export default function CalculatorPage() {
  return (
    <>
      <Head>
        <title>Калькулятор | ПростоБюро</title>
      </Head>
      <div 
        id="calculator-page" 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: 'url("/euro-currency-euro-cash-closeup-euro-bancnotes-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Тёмный overlay для читаемости */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        />
        
        {/* Контент калькулятора */}
        <div className="relative z-10">
          <Calculator />
        </div>
      </div>
    </>
  )
}
