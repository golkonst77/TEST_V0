'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Play, Trash2, Star, CheckCircle, XCircle } from 'lucide-react'

interface VideoReview {
  id: number
  name: string
  company?: string
  rating: number
  text: string
  video_url: string
  is_published: boolean
  created_at: string
}

export default function VideoReviewsAdmin() {
  const [reviews, setReviews] = useState<VideoReview[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    rating: 5,
    text: '',
    video_url: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/video-reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (err) {
      console.error('Ошибка загрузки видеоотзывов:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = async (file: File) => {
    try {
      setUploading(true)
      setError('')
      
      const formData = new FormData()
      formData.append('video', file)
      
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Ошибка загрузки видео')
      }
      
      setFormData(prev => ({ ...prev, video_url: result.videoUrl }))
      
    } catch (error) {
      console.error('Ошибка загрузки видео:', error)
      setError(error instanceof Error ? error.message : 'Не удалось загрузить видео')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.text || !formData.video_url) {
      setError('Заполните все обязательные поля')
      return
    }
    
    try {
      const response = await fetch('/api/admin/video-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setFormData({
          name: '',
          company: '',
          rating: 5,
          text: '',
          video_url: ''
        })
        setError('')
        fetchReviews()
      } else {
        const error = await response.json()
        setError(error.error || 'Ошибка сохранения отзыва')
      }
    } catch (err) {
      setError('Ошибка сохранения отзыва')
    }
  }

  const togglePublish = async (id: number, is_published: boolean) => {
    try {
      const response = await fetch(`/api/admin/video-reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !is_published }),
      })
      
      if (response.ok) {
        fetchReviews()
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err)
    }
  }

  const deleteReview = async (id: number) => {
    if (!confirm('Удалить этот видеоотзыв?')) return
    
    try {
      const response = await fetch(`/api/admin/video-reviews/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchReviews()
      }
    } catch (err) {
      console.error('Ошибка удаления:', err)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Управление видеоотзывами</h1>
      
      {/* Форма добавления нового отзыва */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Добавить новый видеоотзыв</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Имя клиента *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Компания</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="rating">Рейтинг</Label>
              <select
                id="rating"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={5}>5 звезд</option>
                <option value={4}>4 звезды</option>
                <option value={3}>3 звезды</option>
                <option value={2}>2 звезды</option>
                <option value={1}>1 звезда</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="text">Текст отзыва *</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label>Видео *</Label>
              <div className="mt-2">
                {formData.video_url ? (
                  <div className="space-y-2">
                    <video 
                      src={formData.video_url} 
                      controls 
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                    >
                      Удалить видео
                    </Button>
                  </div>
                ) : (
                  <label className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}>
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Загрузить видео
                      </>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleVideoUpload(file)
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <Button type="submit" disabled={uploading}>
              Сохранить отзыв
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Список существующих отзывов */}
      <Card>
        <CardHeader>
          <CardTitle>Существующие видеоотзывы ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Загрузка...</p>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Видеоотзывов пока нет</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{review.name}</h3>
                        {review.company && (
                          <Badge variant="secondary">{review.company}</Badge>
                        )}
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{review.text}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={review.is_published ? "default" : "secondary"}>
                          {review.is_published ? 'Опубликован' : 'Черновик'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <video 
                        src={review.video_url} 
                        controls 
                        className="w-full max-w-md h-32 object-cover rounded"
                      />
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant={review.is_published ? "outline" : "default"}
                        onClick={() => togglePublish(review.id, review.is_published)}
                      >
                        {review.is_published ? (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Скрыть
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Опубликовать
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Удалить
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
  )
} 