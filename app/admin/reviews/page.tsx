"use client"

import { useState, useEffect } from 'react'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, CheckCircle } from "lucide-react"
// import { ImportYandexReviewsJSON } from "@/components/admin/import-yandex-reviews-json"
// import { ImportYandexReviews } from "@/components/admin/import-yandex-reviews"

interface Review {
  id: string
  name: string
  text: string
  rating: number
  created_at: string
  is_published: boolean
  is_featured: boolean
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    featured: 0,
    avgRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const calculateStats = (reviewsList: Review[]) => {
    const total = reviewsList.length
    const published = reviewsList.filter(r => r.is_published).length
    const featured = reviewsList.filter(r => r.is_featured).length
    const avgRating = reviewsList.length > 0 ? 
      Math.round((reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length) * 10) / 10 : 0

    setStats({
      total,
      published,
      featured,
      avgRating
    })
  }

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Сначала пытаемся загрузить из Supabase
      const response = await fetch('/api/admin/reviews')
      
      if (response.ok) {
        const data = await response.json()
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews)
          calculateStats(data.reviews)
          return
        }
      }
      
      // Если Supabase недоступен, загружаем из локального файла
      const localResponse = await fetch('/api/local-reviews')
      
      if (localResponse.ok) {
        const localData = await localResponse.json()
        if (localData.reviews && Array.isArray(localData.reviews)) {
          setReviews(localData.reviews)
          calculateStats(localData.reviews)
          return
        }
      }
      
      setReviews([])
      calculateStats([])
      setError('Не удалось загрузить отзывы')
      
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Ошибка при загрузке отзывов')
      setReviews([])
      calculateStats([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchReviews()
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Загрузка отзывов...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Управление отзывами</h1>
            <p className="text-muted-foreground">
              Управляйте отзывами клиентов
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            Обновить
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего отзывов</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Опубликовано</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Рекомендуемые</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featured}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средний рейтинг</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating}</div>
            </CardContent>
          </Card>
        </div>



        <Card>
          <CardHeader>
            <CardTitle>Список отзывов</CardTitle>
            <CardDescription>
              {error && (
                <div className="text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Нет отзывов</h3>
                <p className="text-muted-foreground">
                  Импортируйте отзывы из Яндекс.Карт или добавьте их вручную
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{review.name}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant={review.is_published ? "default" : "secondary"}>
                            {review.is_published ? "Опубликован" : "Черновик"}
                          </Badge>
                          {review.is_featured && (
                            <Badge variant="outline">Рекомендуемый</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(review.created_at).toLocaleDateString('ru-RU')}
                        </p>
                        <p className="text-sm">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
