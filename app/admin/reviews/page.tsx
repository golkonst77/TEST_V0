"use client"

import { useState, useEffect } from 'react'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Star, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Review } from '@/types/review'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    featured: 0,
    avgRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/reviews')
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      
      if (data.reviews) {
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncYandexReviews = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/sync-yandex-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.message}\n\nИмпортировано: ${data.imported}\nВсего на Яндексе: ${data.total}\nПропущено дублей: ${data.skipped}`)
        // Обновляем список отзывов
        fetchReviews()
      } else {
        alert(`❌ Ошибка: ${data.error || data.message}`)
      }
    } catch (error) {
      console.error('Ошибка синхронизации:', error)
      alert('❌ Ошибка синхронизации отзывов')
    } finally {
      setSyncing(false)
    }
  }

  const resetAndFillReviews = async () => {
    const confirmReset = confirm(
      '⚠️ ВНИМАНИЕ!\n\nЭта операция удалит ВСЕ отзывы из базы данных и заполнит ее новыми отзывами с Яндекса.\n\nВы уверены, что хотите продолжить?'
    )
    
    if (!confirmReset) return
    
    setResetting(true)
    try {
      const response = await fetch('/api/reset-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.message}\n\nУдалено: ${data.deleted} отзывов\nДобавлено: ${data.inserted} отзывов\n\nСтатистика:\n- Всего: ${data.stats.totalReviews}\n- С Яндекса: ${data.stats.yandexReviews}\n- Ручных: ${data.stats.manualReviews}\n- Опубликовано: ${data.stats.publishedReviews}\n- Рекомендуемых: ${data.stats.featuredReviews}\n- Средняя оценка: ${data.stats.avgRating}`)
        // Обновляем список отзывов
        fetchReviews()
      } else {
        alert(`❌ Ошибка: ${data.error}`)
      }
    } catch (error) {
      console.error('Ошибка сброса:', error)
      alert('❌ Ошибка при сбросе отзывов')
    } finally {
      setResetting(false)
    }
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          updates: { is_published: !currentStatus }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update review')
      }

      fetchReviews()
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          updates: { is_featured: !currentStatus }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update review')
      }

      fetchReviews()
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm('Удалить отзыв?')) return

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })

      if (!response.ok) {
        throw new Error('Failed to delete review')
      }

      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Отзывы</h1>
            <p className="text-muted-foreground">
              Управление отзывами клиентов
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={syncYandexReviews}
              disabled={syncing || resetting}
            >
              {syncing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Синхронизация...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Импорт с Яндекса
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={resetAndFillReviews}
              disabled={syncing || resetting}
            >
              {resetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Сброс...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Сбросить и заполнить
                </>
              )}
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить отзыв
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <Eye className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Средняя оценка</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <Card>
          <CardHeader>
            <CardTitle>Список отзывов</CardTitle>
            <CardDescription>
              Управляйте отзывами: публикуйте, добавляйте в рекомендуемые или удаляйте
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Отзывов пока нет</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
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
                            <Badge variant="destructive">Рекомендуемый</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.text}</p>
                        {review.position && (
                          <p className="text-xs text-gray-500">{review.position}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublished(review.id, review.is_published)}
                        >
                          {review.is_published ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(review.id, review.is_featured)}
                        >
                          <Star className={`h-4 w-4 ${review.is_featured ? 'text-yellow-400 fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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