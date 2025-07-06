import { Calculator } from "@/components/calculator"
import Head from "next/head"

export default function CalculatorPage() {
  return (
    <>
      <Head>
        <title>Калькулятор | ПростоБюро</title>
      </Head>
      <div id="calculator-page" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Декоративные элементы фона */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>
        
        {/* Сетка точек для текстуры */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <Calculator />
        
        <style jsx>{`
          .bg-grid-pattern {
            background-image: radial-gradient(circle, #6366f1 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
      </div>
    </>
  )
}
