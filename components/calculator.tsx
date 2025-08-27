"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalculatorIcon, ArrowRight } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"

interface CalculatorConfig {
  services: {
    [key: string]: {
      price: number
      description: string
    }
  }
  multipliers: {
    taxSystems: { [key: string]: number }
    employees: { [key: string]: number }
  }
}

interface CalculatorState {
  companyType: string
  taxSystem: string
  employees: number
  documents: number
  services: string[]
}

export function Calculator() {
  const { openContactForm } = useContactForm()
  const [config, setConfig] = useState<CalculatorConfig | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [state, setState] = useState<CalculatorState>({
    companyType: "",
    taxSystem: "",
    employees: 0,
    documents: 0,
    services: [],
  })

  useEffect(() => {
    fetchCalculatorConfig()
  }, [])

  const fetchCalculatorConfig = async () => {
    try {
      const response = await fetch("/api/calculator/config")
      const configData = await response.json()
      setConfig(configData)
    } catch (error) {
      console.error("Error fetching calculator config:", error)
      // Fallback к дефолтным значениям если API недоступен
      setConfig({
        services: {
          accounting: { price: 3000, description: "Бухгалтерский учет" },
          payroll: { price: 1500, description: "Зарплата и кадры" },
          legal: { price: 2000, description: "Юридическое сопровождение" },
          terminal: { price: 1200, description: "Кассовый терминал" },
        },
        multipliers: {
          taxSystems: { usn: 1, osn: 1.5, envd: 0.8, patent: 0.7 },
          employees: { "0": 1, "1-5": 1.2, "6-15": 1.5, "16-50": 2, "50+": 3 },
        },
      })
    } finally {
      setConfigLoading(false)
    }
  }

  // Используем данные из конфигурации или fallback значения
  const servicePrices = config?.services || {
    accounting: { price: 3000, description: "Бухгалтерский учет" },
    payroll: { price: 1500, description: "Зарплата и кадры" },
    legal: { price: 2000, description: "Юридическое сопровождение" },
    terminal: { price: 1200, description: "Кассовый терминал" },
  }

  const taxSystemMultipliers = config?.multipliers.taxSystems || {
    usn: 1,
    osn: 1.5,
    envd: 0.8,
    patent: 0.7,
  }

  const employeeMultipliers = config?.multipliers.employees || {
    "0": 1,
    "1-5": 1.2,
    "6-15": 1.5,
    "16-50": 2,
    "50+": 3,
  }

  // Коэффициенты для количества документов в месяц
  const documentMultipliers = {
    "0-50": 1,
    "51-100": 1.1,
    "101-200": 1.2,
    "201-500": 1.4,
    "500+": 1.6,
  }

  const calculatePrice = () => {
    let basePrice = 0

    console.log("Calculator state:", state)
    console.log("Service prices:", servicePrices)

    // Добавляем стоимость выбранных услуг
    state.services.forEach((service) => {
      const serviceConfig = servicePrices[service as keyof typeof servicePrices]
      if (serviceConfig) {
        basePrice += serviceConfig.price
        console.log(`Added service ${service}: ${serviceConfig.price}, total: ${basePrice}`)
      }
    })

    // Применяем коэффициент для налоговой системы
    if (state.taxSystem && taxSystemMultipliers[state.taxSystem as keyof typeof taxSystemMultipliers]) {
      const multiplier = taxSystemMultipliers[state.taxSystem as keyof typeof taxSystemMultipliers]
      basePrice *= multiplier
      console.log(`Applied tax system ${state.taxSystem} multiplier ${multiplier}, total: ${basePrice}`)
    }

    // Применяем коэффициент для количества сотрудников
    const employeeRange = getEmployeeRange(state.employees)
    if (employeeMultipliers[employeeRange as keyof typeof employeeMultipliers]) {
      const multiplier = employeeMultipliers[employeeRange as keyof typeof employeeMultipliers]
      basePrice *= multiplier
      console.log(`Applied employee ${employeeRange} multiplier ${multiplier}, total: ${basePrice}`)
    }

    // Применяем коэффициент для количества документов
    const documentRange = getDocumentRange(state.documents)
    if (documentMultipliers[documentRange as keyof typeof documentMultipliers]) {
      const multiplier = documentMultipliers[documentRange as keyof typeof documentMultipliers]
      basePrice *= multiplier
      console.log(`Applied document ${documentRange} multiplier ${multiplier}, total: ${basePrice}`)
    }

    const finalPrice = Math.round(basePrice)
    console.log("Final calculated price:", finalPrice)
    return finalPrice
  }

  const getEmployeeRange = (count: number) => {
    if (count === 0) return "0"
    if (count <= 5) return "1-5"
    if (count <= 15) return "6-15"
    if (count <= 50) return "16-50"
    return "50+"
  }

  const getDocumentRange = (count: number) => {
    if (count <= 50) return "0-50"
    if (count <= 100) return "51-100"
    if (count <= 200) return "101-200"
    if (count <= 500) return "201-500"
    return "500+"
  }

  const handleServiceChange = (service: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      services: checked ? [...prev.services, service] : prev.services.filter((s) => s !== service),
    }))
  }

  const totalPrice = calculatePrice()

  // Показываем лоадер пока загружается конфигурация
  if (configLoading) {
    return (
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-lg mx-auto w-fit">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <p className="mt-4 text-gray-700 font-medium">Загрузка калькулятора...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20 relative z-10 min-h-screen overflow-hidden" id="calculator"
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
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 md:p-4 shadow-2xl ring-2 md:ring-4 ring-blue-200">
              <CalculatorIcon className="h-8 w-8 md:h-12 md:w-12 text-white" />
            </div>
          </div>
                     <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-4">
             Калькулятор стоимости услуг
           </h2>
           <p className="text-lg md:text-xl text-white drop-shadow-md max-w-3xl mx-auto leading-relaxed text-center">
             Рассчитайте стоимость бухгалтерских услуг для вашего бизнеса
           </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/60 to-purple-50/70 backdrop-blur-xl shadow-2xl border-0 ring-2 ring-white/50 hover:shadow-3xl transition-all duration-300 rounded-xl">
            {/* Внутренний декоративный фон */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-1/2 h-1/2 bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-pink-200/30 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tr from-pink-200/40 via-purple-100/30 to-blue-100/30 rounded-full blur-2xl opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-white/30 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="relative z-10">
                             <CardHeader className="bg-white text-gray-900 rounded-t-lg border-b-2 border-gray-200">
                 <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">Параметры вашего бизнеса</CardTitle>
                 <CardDescription className="text-gray-600 text-sm md:text-base">Заполните информацию о вашей компании для расчета стоимости</CardDescription>
               </CardHeader>
              <CardContent className="space-y-6 p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyType" className="text-sm font-semibold text-gray-900">Тип компании</Label>
                    <Select
                      value={state.companyType}
                      onValueChange={(value) => setState((prev) => ({ ...prev, companyType: value }))}
                    >
                      <SelectTrigger className="border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-200 ring-2 ring-blue-100 focus:ring-blue-300 focus:ring-4 bg-transparent">
                        <SelectValue placeholder="Выберите тип компании" />
                      </SelectTrigger>
                      <SelectContent className="shadow-2xl border-blue-200 rounded-lg bg-white z-50">
                        <SelectItem value="ip" className="hover:bg-blue-50 focus:bg-blue-50">ИП</SelectItem>
                        <SelectItem value="ooo" className="hover:bg-blue-50 focus:bg-blue-50">ООО</SelectItem>
                        <SelectItem value="ao" className="hover:bg-blue-50 focus:bg-blue-50">АО</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxSystem" className="text-sm font-semibold text-gray-900">Система налогообложения</Label>
                    <Select
                      value={state.taxSystem}
                      onValueChange={(value) => setState((prev) => ({ ...prev, taxSystem: value }))}
                    >
                      <SelectTrigger className="border-purple-200 hover:border-purple-300 shadow-md hover:shadow-lg transition-all duration-200 ring-2 ring-purple-100 focus:ring-purple-300 focus:ring-4 bg-transparent">
                        <SelectValue placeholder="Выберите налоговую систему" />
                      </SelectTrigger>
                      <SelectContent className="shadow-2xl border-purple-200 rounded-lg bg-white z-50">
                        <SelectItem value="usn" className="hover:bg-purple-50 focus:bg-purple-50">УСН</SelectItem>
                        <SelectItem value="osn" className="hover:bg-purple-50 focus:bg-purple-50">ОСН</SelectItem>
                        <SelectItem value="envd" className="hover:bg-purple-50 focus:bg-purple-50">ЕНВД</SelectItem>
                        <SelectItem value="patent" className="hover:bg-purple-50 focus:bg-purple-50">Патент</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employees" className="text-sm font-semibold text-gray-900">Количество сотрудников</Label>
                    <Input
                      id="employees"
                      type="number"
                      placeholder="0"
                      value={state.employees || ""}
                      onChange={(e) => setState((prev) => ({ ...prev, employees: Number.parseInt(e.target.value) || 0 }))}
                      className="border-green-200 hover:border-green-300 shadow-md hover:shadow-lg transition-all duration-200 ring-2 ring-green-100 focus:ring-green-300 focus:ring-4 bg-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documents" className="text-sm font-semibold text-gray-900">Количество документов в месяц</Label>
                    <Input
                      id="documents"
                      type="number"
                      placeholder="0"
                      value={state.documents || ""}
                      onChange={(e) => setState((prev) => ({ ...prev, documents: Number.parseInt(e.target.value) || 0 }))}
                      className="border-orange-200 hover:border-orange-300 shadow-md hover:shadow-lg transition-all duration-200 ring-2 ring-orange-100 focus:ring-orange-300 focus:ring-4 bg-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-900">Необходимые услуги</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent">
                      <Checkbox
                        id="accounting"
                        checked={state.services.includes("accounting")}
                        onCheckedChange={(checked) => handleServiceChange("accounting", checked as boolean)}
                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <Label htmlFor="accounting" className="text-sm font-normal text-gray-900 flex-1">
                        Бухгалтерский учет (от {servicePrices.accounting.price.toLocaleString()} руб/мес)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent">
                      <Checkbox
                        id="payroll"
                        checked={state.services.includes("payroll")}
                        onCheckedChange={(checked) => handleServiceChange("payroll", checked as boolean)}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <Label htmlFor="payroll" className="text-sm font-normal text-gray-900 flex-1">
                        Зарплата и кадры (от {servicePrices.payroll.price.toLocaleString()} руб/мес)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent">
                      <Checkbox
                        id="legal"
                        checked={state.services.includes("legal")}
                        onCheckedChange={(checked) => handleServiceChange("legal", checked as boolean)}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <Label htmlFor="legal" className="text-sm font-normal text-gray-900 flex-1">
                        Юридическое сопровождение (от {servicePrices.legal.price.toLocaleString()} руб/мес)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 bg-transparent">
                      <Checkbox
                        id="terminal"
                        checked={state.services.includes("terminal")}
                        onCheckedChange={(checked) => handleServiceChange("terminal", checked as boolean)}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                                             <Label htmlFor="terminal" className="text-sm font-normal text-gray-900 flex-1">
                        Кассовый терминал (от {servicePrices.terminal.price.toLocaleString()} руб)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Блок с итоговой стоимостью - показываем всегда */}
                <div className={`bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8 rounded-xl border-2 border-gradient-to-r border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-300 ${totalPrice > 0 ? 'animate-pulse-glow ring-4 ring-blue-200' : ''}`}>
                  <style jsx>{`
                    @keyframes pulse-glow {
                      0%, 100% {
                        background: linear-gradient(to bottom right, rgb(219 234 254), rgb(237 233 254), rgb(252 231 243));
                        border-color: rgb(147 197 253);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.05);
                      }
                      50% {
                        background: linear-gradient(to bottom right, rgb(191 219 254), rgb(221 214 254), rgb(251 207 232));
                        border-color: rgb(99 102 241);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px 10px rgba(59, 130, 246, 0.2);
                      }
                    }
                    .animate-pulse-glow {
                      animation: pulse-glow 2s ease-in-out infinite;
                    }
                  `}</style>
                  <div className="text-center">
                    <div className="mb-4 mx-auto w-fit p-2 md:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
                      <CalculatorIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                      Стоимость вашего тарифа
                    </h3>
                    <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                      {totalPrice > 0 ? `${totalPrice.toLocaleString()} руб/мес` : "Выберите услуги"}
                    </div>
                    {totalPrice > 0 && (
                      <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-lg">
                        Точная стоимость рассчитывается индивидуально после консультации
                      </p>
                    )}
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
                      onClick={openContactForm}
                    >
                      {totalPrice > 0 ? "Получить точный расчет" : "Получить консультацию"}
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
