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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка калькулятора...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <CalculatorIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Калькулятор стоимости услуг
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Рассчитайте стоимость бухгалтерских услуг для вашего бизнеса
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Параметры вашего бизнеса</CardTitle>
              <CardDescription>Заполните информацию о вашей компании для расчета стоимости</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyType">Тип компании</Label>
                  <Select
                    value={state.companyType}
                    onValueChange={(value) => setState((prev) => ({ ...prev, companyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип компании" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ip">ИП</SelectItem>
                      <SelectItem value="ooo">ООО</SelectItem>
                      <SelectItem value="ao">АО</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxSystem">Система налогообложения</Label>
                  <Select
                    value={state.taxSystem}
                    onValueChange={(value) => setState((prev) => ({ ...prev, taxSystem: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите налоговую систему" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usn">УСН</SelectItem>
                      <SelectItem value="osn">ОСН</SelectItem>
                      <SelectItem value="envd">ЕНВД</SelectItem>
                      <SelectItem value="patent">Патент</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees">Количество сотрудников</Label>
                  <Input
                    id="employees"
                    type="number"
                    placeholder="0"
                    value={state.employees || ""}
                    onChange={(e) => setState((prev) => ({ ...prev, employees: Number.parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documents">Количество документов в месяц</Label>
                  <Input
                    id="documents"
                    type="number"
                    placeholder="0"
                    value={state.documents || ""}
                    onChange={(e) => setState((prev) => ({ ...prev, documents: Number.parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Необходимые услуги</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accounting"
                      checked={state.services.includes("accounting")}
                      onCheckedChange={(checked) => handleServiceChange("accounting", checked as boolean)}
                    />
                    <Label htmlFor="accounting" className="text-sm font-normal">
                      Бухгалтерский учет (от {servicePrices.accounting.price.toLocaleString()} руб/мес)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payroll"
                      checked={state.services.includes("payroll")}
                      onCheckedChange={(checked) => handleServiceChange("payroll", checked as boolean)}
                    />
                    <Label htmlFor="payroll" className="text-sm font-normal">
                      Зарплата и кадры (от {servicePrices.payroll.price.toLocaleString()} руб/мес)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="legal"
                      checked={state.services.includes("legal")}
                      onCheckedChange={(checked) => handleServiceChange("legal", checked as boolean)}
                    />
                    <Label htmlFor="legal" className="text-sm font-normal">
                      Юридическое сопровождение (от {servicePrices.legal.price.toLocaleString()} руб/мес)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terminal"
                      checked={state.services.includes("terminal")}
                      onCheckedChange={(checked) => handleServiceChange("terminal", checked as boolean)}
                    />
                    <Label htmlFor="terminal" className="text-sm font-normal">
                      Кассовый терминал (от {servicePrices.terminal.price.toLocaleString()} руб)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Блок с итоговой стоимостью - показываем всегда */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-100">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ориентировочная стоимость</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-4">
                    {totalPrice > 0 ? `${totalPrice.toLocaleString()} руб/мес` : "Выберите услуги"}
                  </div>
                  {totalPrice > 0 && (
                    <p className="text-gray-600 mb-6">
                      Точная стоимость рассчитывается индивидуально после консультации
                    </p>
                  )}
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={openContactForm}
                  >
                    {totalPrice > 0 ? "Получить точный расчет" : "Получить консультацию"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
