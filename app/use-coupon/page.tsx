"use client"

import { CouponUsage } from "@/components/coupon-usage"

export default function UseCouponPage() {
  const handleCouponUsed = (couponCode: string) => {
    console.log('Купон использован:', couponCode)
    // Здесь можно добавить дополнительную логику после использования купона
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Использование купона
          </h1>
          <p className="text-gray-600">
            Введите код купона для отметки его как использованного в системе
          </p>
        </div>
        
        <CouponUsage 
          onCouponUsed={handleCouponUsed}
          className="max-w-md mx-auto"
        />
        
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Как использовать купон?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Введите полный код купона (например: PROSTOBURO-PG1MXN-10000)</li>
              <li>• Нажмите кнопку "Отметить как использованный"</li>
              <li>• Купон будет помечен как использованный в системе</li>
              <li>• Дата использования будет автоматически записана</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 