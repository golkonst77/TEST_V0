"use client"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AdminCalculatorPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [services, setServices] = useState([
    { id: 1, name: "Ведение учета ИП", price: 3000, active: true },
    { id: 2, name: "Ведение учета ООО", price: 5000, active: true },
    { id: 3, name: "Подача отчетности", price: 1500, active: true },
    { id: 4, name: "Консультации", price: 1000, active: true },
  ])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleSave = () => {
    alert("Настройки калькулятора сохранены!")
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-center space-x-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Редактор калькулятора</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Услуги и цены</CardTitle>
            <CardDescription>Настройка услуг для калькулятора стоимости</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Switch
                  checked={service.active}
                  onCheckedChange={(checked) => {
                    setServices(services.map((s) => (s.id === service.id ? { ...s, active: checked } : s)))
                  }}
                />
                <div className="flex-1">
                  <Label>{service.name}</Label>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    value={service.price}
                    onChange={(e) => {
                      setServices(
                        services.map((s) =>
                          s.id === service.id ? { ...s, price: Number.parseInt(e.target.value) } : s,
                        ),
                      )
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">₽/мес</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Множители</CardTitle>
            <CardDescription>Коэффициенты для расчета стоимости</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>УСН (коэффициент)</Label>
                <Input type="number" defaultValue="1.0" step="0.1" />
              </div>
              <div>
                <Label>ОСНО (коэффициент)</Label>
                <Input type="number" defaultValue="1.5" step="0.1" />
              </div>
              <div>
                <Label>1-5 сотрудников</Label>
                <Input type="number" defaultValue="1.0" step="0.1" />
              </div>
              <div>
                <Label>6-20 сотрудников</Label>
                <Input type="number" defaultValue="1.3" step="0.1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button onClick={handleSave} className="flex-1">
            Сохранить настройки
          </Button>
          <Button variant="outline" asChild>
            <Link href="/calculator">Предпросмотр калькулятора</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
