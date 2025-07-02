"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface Service {
  id: number
  name: string
  serviceKey: string
  price: number
  active: boolean
}

interface Multipliers {
  usn: number
  osn: number
  envd: number
  patent: number
  employees0: number
  employees1to5: number
  employees6to15: number
  employees16to50: number
  employees50plus: number
}

export default function AdminCalculatorPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Бухгалтерский учет", serviceKey: "accounting", price: 3000, active: true },
    { id: 2, name: "Зарплата и кадры", serviceKey: "payroll", price: 1500, active: true },
    { id: 3, name: "Юридическое сопровождение", serviceKey: "legal", price: 2000, active: true },
    { id: 4, name: "Регистрация фирм", serviceKey: "registration", price: 5000, active: true },
  ])

  const [multipliers, setMultipliers] = useState<Multipliers>({
    usn: 1.0,
    osn: 1.5,
    envd: 0.8,
    patent: 0.7,
    employees0: 1.0,
    employees1to5: 1.2,
    employees6to15: 1.5,
    employees16to50: 2.0,
    employees50plus: 3.0
  })

  useEffect(() => {
    loadCalculatorConfig()
  }, [])

  const loadCalculatorConfig = async () => {
    try {
      const response = await fetch("/api/calculator/config")
      if (response.ok) {
        const config = await response.json()
        
        // Преобразуем данные из API в формат для админки
        const loadedServices = Object.entries(config.services).map(([key, service]: [string, any], index) => ({
          id: index + 1,
          name: service.description,
          serviceKey: key,
          price: service.price,
          active: true
        }))
        
        setServices(loadedServices)
        
        // Загружаем множители
        setMultipliers({
          usn: config.multipliers.taxSystems.usn || 1.0,
          osn: config.multipliers.taxSystems.osn || 1.5,
          envd: config.multipliers.taxSystems.envd || 0.8,
          patent: config.multipliers.taxSystems.patent || 0.7,
          employees0: config.multipliers.employees["0"] || 1.0,
          employees1to5: config.multipliers.employees["1-5"] || 1.2,
          employees6to15: config.multipliers.employees["6-15"] || 1.5,
          employees16to50: config.multipliers.employees["16-50"] || 2.0,
          employees50plus: config.multipliers.employees["50+"] || 3.0
        })
      }
    } catch (error) {
      console.error("Error loading calculator config:", error)
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить настройки калькулятора",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Преобразуем данные в формат API
      const configData = {
        services: services.reduce((acc, service) => {
          acc[service.serviceKey] = {
            price: service.price,
            description: service.name
          }
          return acc
        }, {} as any),
        multipliers: {
          taxSystems: {
            usn: multipliers.usn,
            osn: multipliers.osn,
            envd: multipliers.envd,
            patent: multipliers.patent
          },
          employees: {
            "0": multipliers.employees0,
            "1-5": multipliers.employees1to5,
            "6-15": multipliers.employees6to15,
            "16-50": multipliers.employees16to50,
            "50+": multipliers.employees50plus
          }
        }
      }

      // Сохраняем через API (нужно будет создать PUT endpoint)
      const response = await fetch("/api/calculator/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      if (response.ok) {
        toast({
          title: "Успешно сохранено",
          description: "Настройки калькулятора обновлены",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving calculator config:", error)
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить настройки калькулятора",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Редактор калькулятора" description="Настройка услуг для калькулятора стоимости">
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка настроек калькулятора...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Редактор калькулятора" description="Настройка услуг для калькулятора стоимости">
      <div className="p-6 space-y-6">
        {/* Услуги и цены */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Услуги и цены</CardTitle>
            <CardDescription className="text-sm">Настройка услуг для калькулятора стоимости</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center space-x-3 p-3 border rounded-md">
                <Switch
                  checked={service.active}
                  onCheckedChange={(checked) => {
                    setServices(services.map((s) => (s.id === service.id ? { ...s, active: checked } : s)))
                  }}
                />
                <div className="flex-1">
                  <Label className="text-sm">{service.name}</Label>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    value={service.price}
                    onChange={(e) => {
                      setServices(
                        services.map((s) =>
                          s.id === service.id ? { ...s, price: Number.parseInt(e.target.value) || 0 } : s,
                        ),
                      )
                    }}
                    className="h-8 text-sm"
                  />
                </div>
                <span className="text-xs text-gray-500">₽/мес</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Множители налоговых систем */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Коэффициенты налоговых систем</CardTitle>
            <CardDescription className="text-sm">Множители для разных систем налогообложения</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">УСН</Label>
                <Input 
                  type="number" 
                  value={multipliers.usn}
                  onChange={(e) => setMultipliers({...multipliers, usn: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">ОСН</Label>
                <Input 
                  type="number" 
                  value={multipliers.osn}
                  onChange={(e) => setMultipliers({...multipliers, osn: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">ЕНВД</Label>
                <Input 
                  type="number" 
                  value={multipliers.envd}
                  onChange={(e) => setMultipliers({...multipliers, envd: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Патент</Label>
                <Input 
                  type="number" 
                  value={multipliers.patent}
                  onChange={(e) => setMultipliers({...multipliers, patent: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Множители по сотрудникам */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Коэффициенты по количеству сотрудников</CardTitle>
            <CardDescription className="text-sm">Множители в зависимости от размера штата</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">0 сотрудников</Label>
                <Input 
                  type="number" 
                  value={multipliers.employees0}
                  onChange={(e) => setMultipliers({...multipliers, employees0: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">1-5 сотрудников</Label>
                <Input 
                  type="number" 
                  value={multipliers.employees1to5}
                  onChange={(e) => setMultipliers({...multipliers, employees1to5: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">6-15 сотрудников</Label>
                <Input 
                  type="number" 
                  value={multipliers.employees6to15}
                  onChange={(e) => setMultipliers({...multipliers, employees6to15: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">16-50 сотрудников</Label>
                <Input 
                  type="number" 
                  value={multipliers.employees16to50}
                  onChange={(e) => setMultipliers({...multipliers, employees16to50: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">50+ сотрудников</Label>
                <Input 
                  type="number" 
                  value={multipliers.employees50plus}
                  onChange={(e) => setMultipliers({...multipliers, employees50plus: parseFloat(e.target.value) || 1})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Кнопки действий */}
        <div className="flex space-x-3">
          <Button onClick={handleSave} size="sm" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/calculator" target="_blank">Предпросмотр калькулятора</a>
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
