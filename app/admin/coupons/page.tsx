"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Copy, Phone, Calendar, Gift, Check } from "lucide-react"

interface Coupon {
  id: number
  code: string
  phone: string
  discount: number
  createdAt: string
  used: boolean
  usedAt?: string
}

export default function AdminCouponsPage() {
  const { toast } = useToast()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const response = await fetch('/api/coupons')
      const data = await response.json()
      
      if (response.ok) {
        // Сортируем по дате создания (новые сверху)
        const sortedCoupons = data.coupons.sort((a: Coupon, b: Coupon) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setCoupons(sortedCoupons)
      } else {
        throw new Error(data.error || 'Ошибка при загрузке купонов')
      }
    } catch (error) {
      console.error('Ошибка загрузки купонов:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить купоны",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsUsed = async (couponId: number, code: string) => {
    setUpdating(couponId)
    try {
      const response = await fetch('/api/coupons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      })
      
      if (response.ok) {
        await loadCoupons() // Перезагружаем данные
        toast({
          title: "Успешно",
          description: "Купон отмечен как использованный",
        })
      } else {
        throw new Error('Ошибка при обновлении купона')
      }
    } catch (error) {
      console.error('Ошибка обновления купона:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить купон",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Скопировано",
      description: "Текст скопирован в буфер обмена",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const getStats = () => {
    const total = coupons.length
    const used = coupons.filter(c => c.used).length
    const unused = total - used
    const totalDiscount = coupons.reduce((sum, c) => sum + c.discount, 0)
    
    return { total, used, unused, totalDiscount }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Загрузка купонов...</span>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Управление купонами</h1>
        <p className="text-gray-600">Просмотр и управление купонами, полученными через квизы</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Всего купонов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Использовано</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.used}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Не использовано</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unused}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Общая скидка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDiscount.toLocaleString()} ₽</div>
          </CardContent>
        </Card>
      </div>

      {/* Список купонов */}
      <Card>
        <CardHeader>
          <CardTitle>Все купоны</CardTitle>
          <CardDescription>
            Список всех купонов с контактными данными клиентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Купоны пока не созданы</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`border rounded-lg p-4 ${
                    coupon.used ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {coupon.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Badge variant={coupon.used ? "default" : "secondary"}>
                          {coupon.used ? "Использован" : "Активен"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{coupon.phone}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(coupon.phone)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-gray-500" />
                          <span>{coupon.discount.toLocaleString()} ₽ скидка</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(coupon.createdAt)}</span>
                        </div>
                      </div>
                      
                      {coupon.used && coupon.usedAt && (
                        <div className="mt-2 text-sm text-green-600">
                          Использован: {formatDate(coupon.usedAt)}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {!coupon.used && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsUsed(coupon.id, coupon.code)}
                          disabled={updating === coupon.id}
                        >
                          {updating === coupon.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Отметить использованным
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 