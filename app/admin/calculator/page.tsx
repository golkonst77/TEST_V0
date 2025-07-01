"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function AdminCalculatorPage() {
  const [services, setServices] = useState([
    { id: 1, name: "Ведение учета ИП", price: 3000, active: true },
    { id: 2, name: "Ведение учета ООО", price: 5000, active: true },
    { id: 3, name: "Подача отчетности", price: 1500, active: true },
    { id: 4, name: "Консультации", price: 1000, active: true },
  ])

  const [multipliers, setMultipliers] = useState({
    usn: 1.0,
    osno: 1.5,
    employees1to5: 1.0,
    employees6to20: 1.3
  })

  const handleSave = () => {
    alert("Настройки калькулятора сохранены!")
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
                          s.id === service.id ? { ...s, price: Number.parseInt(e.target.value) } : s,
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

        {/* Множители */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Множители</CardTitle>
            <CardDescription className="text-sm">Коэффициенты для расчета стоимости</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">УСН (коэффициент)</Label>
                <Input 
                  type="number" 
                  value={multipliers.usn}
                  onChange={(e) => setMultipliers({...multipliers, usn: parseFloat(e.target.value)})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">ОСНО (коэффициент)</Label>
                <Input 
                  type="number" 
                  value={multipliers.osno}
                  onChange={(e) => setMultipliers({...multipliers, osno: parseFloat(e.target.value)})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">1-5 сотрудников</Label>
                <Input 
                  type="number" 
                  value={multipliers.employees1to5}
                  onChange={(e) => setMultipliers({...multipliers, employees1to5: parseFloat(e.target.value)})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">6-20 сотрудников</Label>
                <Input 
                  type="number" 
                  value={multipliers.employees6to20}
                  onChange={(e) => setMultipliers({...multipliers, employees6to20: parseFloat(e.target.value)})}
                  step="0.1" 
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Кнопки действий */}
        <div className="flex space-x-3">
          <Button onClick={handleSave} size="sm">
            Сохранить настройки
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/calculator" target="_blank">Предпросмотр калькулятора</a>
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
