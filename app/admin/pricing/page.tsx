"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

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
      <div className="container py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка тарифных планов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Редактирование тарифов</h1>
          <p className="text-gray-600 mt-2">Управление тарифными планами и ценами</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.is_popular ? "ring-2 ring-blue-500" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Тариф #{plan.id}</CardTitle>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`popular-${plan.id}`} className="text-sm">
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
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`name-${plan.id}`}>Название тарифа</Label>
                <Input
                  id={`name-${plan.id}`}
                  value={plan.name}
                  onChange={(e) => handlePlanChange(plan.id, "name", e.target.value)}
                  placeholder="Название тарифа"
                />
              </div>

              <div>
                <Label htmlFor={`price-${plan.id}`}>Цена (руб/мес)</Label>
                <Input
                  id={`price-${plan.id}`}
                  type="number"
                  value={plan.price}
                  onChange={(e) => handlePlanChange(plan.id, "price", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor={`description-${plan.id}`}>Описание</Label>
                <Textarea
                  id={`description-${plan.id}`}
                  value={plan.description}
                  onChange={(e) => handlePlanChange(plan.id, "description", e.target.value)}
                  placeholder="Описание тарифа"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Возможности тарифа</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addFeature(plan.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(plan.id, index, e.target.value)}
                        placeholder="Возможность тарифа"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(plan.id, index)}>
                        <Trash2 className="h-4 w-4" />
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
  )
}
