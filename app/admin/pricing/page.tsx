"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Save, Plus, Trash2 } from "lucide-react"

interface PricingPlan {
  id: number
  name: string
  price: number
  description: string
  features: string[]
  is_popular: boolean
  is_active: boolean
}

export default function AdminPricingPage() {
  const { toast } = useToast()
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPricingData()
  }, [])

  const fetchPricingData = async () => {
    try {
      const response = await fetch("/api/admin/pricing")
      const pricingData = await response.json()
      setPlans(pricingData.plans || [])
    } catch (error) {
      console.error("Error fetching pricing data:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные тарифов",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePlanChange = (planId: number, field: string, value: any) => {
    setPlans(plans.map((plan) => (plan.id === planId ? { ...plan, [field]: value } : plan)))
  }

  const handleFeatureChange = (planId: number, featureIndex: number, value: string) => {
    setPlans(
      plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: plan.features.map((feature, index) => (index === featureIndex ? value : feature)),
            }
          : plan,
      ),
    )
  }

  const addFeature = (planId: number) => {
    setPlans(plans.map((plan) => (plan.id === planId ? { ...plan, features: [...plan.features, ""] } : plan)))
  }

  const removeFeature = (planId: number, featureIndex: number) => {
    setPlans(
      plans.map((plan) =>
        plan.id === planId ? { ...plan, features: plan.features.filter((_, index) => index !== featureIndex) } : plan,
      ),
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plans }),
      })

      if (response.ok) {
        toast({
          title: "Успешно сохранено",
          description: "Тарифные планы обновлены",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving pricing data:", error)
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
      <AdminLayout title="Редактирование тарифов" description="Управление тарифными планами и ценами">
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка тарифных планов...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Редактирование тарифов" 
      description="Управление тарифными планами и ценами"
      actions={
        <Button onClick={handleSave} disabled={saving} size="sm">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      }
    >
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={`border ${plan.is_popular ? "border-blue-500" : "border-gray-200"}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Тариф #{plan.id}</CardTitle>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                      <Label htmlFor={`popular-${plan.id}`} className="text-xs">
                        Популярный
                      </Label>
                      <Switch
                        id={`popular-${plan.id}`}
                        checked={plan.is_popular}
                        onCheckedChange={(checked) => handlePlanChange(plan.id, "is_popular", checked)}
                      />
                    </div>
                    <Switch
                      checked={plan.is_active}
                      onCheckedChange={(checked) => handlePlanChange(plan.id, "is_active", checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`name-${plan.id}`} className="text-sm">Название тарифа</Label>
                  <Input
                    id={`name-${plan.id}`}
                    value={plan.name}
                    onChange={(e) => handlePlanChange(plan.id, "name", e.target.value)}
                    placeholder="Название тарифа"
                    className="h-8 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`price-${plan.id}`} className="text-sm">Цена (руб/мес)</Label>
                  <Input
                    id={`price-${plan.id}`}
                    type="number"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(plan.id, "price", Number.parseInt(e.target.value) || 0)}
                    className="h-8 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`description-${plan.id}`} className="text-sm">Описание</Label>
                  <Textarea
                    id={`description-${plan.id}`}
                    value={plan.description}
                    onChange={(e) => handlePlanChange(plan.id, "description", e.target.value)}
                    placeholder="Описание тарифа"
                    rows={2}
                    className="text-sm mt-1"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Возможности тарифа</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addFeature(plan.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleFeatureChange(plan.id, index, e.target.value)}
                          placeholder="Возможность тарифа"
                          className="h-7 text-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(plan.id, index)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
