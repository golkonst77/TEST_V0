"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Service {
  id: number
  service_name: string
  base_price: number
  description: string
  is_active: boolean
}

interface Multiplier {
  id: number
  key: string
  value: number
  label: string
  is_active: boolean
}

interface CalculatorData {
  services: Service[]
  multipliers: {
    tax_systems: Multiplier[]
    employees: Multiplier[]
  }
}

export default function AdminCalculatorPage() {
  const { toast } = useToast()
  const [data, setData] = useState<CalculatorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCalculatorData()
  }, [])

  const fetchCalculatorData = async () => {
    try {
      const response = await fetch("/api/admin/calculator")
      const calculatorData = await response.json()
      setData(calculatorData)
    } catch (error) {
      console.error("Error fetching calculator data:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные калькулятора",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleServiceChange = (serviceId: number, field: string, value: any) => {
    if (!data) return

    setData({
      ...data,
      services: data.services.map((service) => (service.id === serviceId ? { ...service, [field]: value } : service)),
    })
  }

  const handleMultiplierChange = (
    type: "tax_systems" | "employees",
    multiplierId: number,
    field: string,
    value: any,
  ) => {
    if (!data) return

    setData({
      ...data,
      multipliers: {
        ...data.multipliers,
        [type]: data.multipliers[type].map((multiplier) =>
          multiplier.id === multiplierId ? { ...multiplier, [field]: value } : multiplier,
        ),
      },
    })
  }

  const handleSave = async () => {
    if (!data) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/calculator", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
      console.error("Error saving calculator data:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных калькулятора...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <p className="text-red-600">Ошибка загрузки данных</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Редактирование калькулятора</h1>
          <p className="text-gray-600 mt-2">Управление ценами услуг и множителями</p>
        </div>
        <div className="flex space-x-4">
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Услуги */}
        <Card>
          <CardHeader>
            <CardTitle>Базовые цены услуг</CardTitle>
            <CardDescription>Настройка базовых цен для расчета в калькуляторе</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">{service.description}</Label>
                  <Switch
                    checked={service.is_active}
                    onCheckedChange={(checked) => handleServiceChange(service.id, "is_active", checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`price-${service.id}`}>Цена (руб/мес)</Label>
                    <Input
                      id={`price-${service.id}`}
                      type="number"
                      value={service.base_price}
                      onChange={(e) =>
                        handleServiceChange(service.id, "base_price", Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`desc-${service.id}`}>Описание</Label>
                    <Input
                      id={`desc-${service.id}`}
                      value={service.description}
                      onChange={(e) => handleServiceChange(service.id, "description", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Множители */}
        <div className="space-y-8">
          {/* Налоговые системы */}
          <Card>
            <CardHeader>
              <CardTitle>Множители по налоговым системам</CardTitle>
              <CardDescription>Коэффициенты для разных систем налогообложения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.multipliers.tax_systems.map((multiplier) => (
                <div key={multiplier.id} className="flex items-center space-x-4">
                  <Switch
                    checked={multiplier.is_active}
                    onCheckedChange={(checked) =>
                      handleMultiplierChange("tax_systems", multiplier.id, "is_active", checked)
                    }
                  />
                  <div className="flex-1">
                    <Input
                      value={multiplier.label}
                      onChange={(e) => handleMultiplierChange("tax_systems", multiplier.id, "label", e.target.value)}
                      placeholder="Название"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      step="0.1"
                      value={multiplier.value}
                      onChange={(e) =>
                        handleMultiplierChange(
                          "tax_systems",
                          multiplier.id,
                          "value",
                          Number.parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="Коэф."
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Количество сотрудников */}
          <Card>
            <CardHeader>
              <CardTitle>Множители по количеству сотрудников</CardTitle>
              <CardDescription>Коэффициенты в зависимости от размера компании</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.multipliers.employees.map((multiplier) => (
                <div key={multiplier.id} className="flex items-center space-x-4">
                  <Switch
                    checked={multiplier.is_active}
                    onCheckedChange={(checked) =>
                      handleMultiplierChange("employees", multiplier.id, "is_active", checked)
                    }
                  />
                  <div className="flex-1">
                    <Input
                      value={multiplier.label}
                      onChange={(e) => handleMultiplierChange("employees", multiplier.id, "label", e.target.value)}
                      placeholder="Название"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      step="0.1"
                      value={multiplier.value}
                      onChange={(e) =>
                        handleMultiplierChange(
                          "employees",
                          multiplier.id,
                          "value",
                          Number.parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="Коэф."
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
