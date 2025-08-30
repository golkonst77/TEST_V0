"use client"
/**
 * @file: reviews.tsx
 * @description: Компонент отзывов с динамическим получением рейтинга и адреса
 * @dependencies: API endpoints, settings store
 * @created: 2025-01-15
 */

import { useState, useEffect } from 'react'
import { Star, StarHalf } from 'lucide-react'

interface Review {
  id: string
  name: string
  company?: string
  rating: number
  text: string
  source: string
  created_at: string
  published_at?: string
  author?: string
}

interface VideoReview {
  id: string
  name: string
  company?: string
  rating: number
  text: string
  video_url: string
  created_at: string
}

interface CompanyInfo {
  name?: string
  rating?: number
}

interface Settings {
  address?: string
  phone?: string
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({})
  const [settings, setSettings] = useState<Settings>({})
  const [averageRating, setAverageRating] = useState(5.0)
  const [totalReviews, setTotalReviews] = useState(15)
  const [page, setPage] = useState(0)

  const maxPages = Math.min(3, Math.ceil(reviews.length / 3) || 0)
  const pagedReviews = reviews.slice(page * 3, page * 3 + 3)

  // Функция для расчета динамического количества клиентов
  const calculateDynamicClients = () => {
    const startDate = new Date('2024-01-01') // Начальная дата
    const currentDate = new Date()
    const monthsDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (currentDate.getMonth() - startDate.getMonth())
    const baseClients = 500
    const monthlyIncrease = 5
    return baseClients + (monthsDiff * monthlyIncrease)
  }

  const dynamicClients = calculateDynamicClients()

  // Получение настроек из админки
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          address: data.address || 'Калуга, Дзержинского 37, офис 20',
          phone: data.phone || '+7953 330-17-77'
        })
      }
    } catch (error) {
      console.error('Ошибка получения настроек:', error)
      setSettings({
        address: 'Калуга, Дзержинского 37, офис 20',
        phone: '+7953 330-17-77'
      })
    }
  }

  // Получение информации о компании с Яндекс.Карт
  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch('/api/yandex-reviews')
      if (response.ok) {
        const data = await response.json()
        if (data.company_info) {
          setCompanyInfo({
            name: data.company_info.name,
            rating: data.company_info.rating || 5.0
          })
        }
      }
    } catch (error) {
      console.error('Ошибка получения информации о компании:', error)
      setCompanyInfo({ rating: 5.0 })
    }
  }

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Сначала пробуем локальный API
      let response = await fetch('/api/local-reviews?limit=9')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.reviews)) {
          const fetched = data.reviews
          setReviews(fetched)
          // Пересчитать агрегаты локально
          if (fetched.length > 0) {
            const avg = fetched.reduce((s: number, r: any) => s + (r.rating || 5), 0) / fetched.length
            setAverageRating(Number(avg.toFixed(1)))
            setTotalReviews(fetched.length)
          } else {
            setAverageRating(5.0)
            setTotalReviews(0)
          }
          setPage(0)
          return
        }
      }
      
      // Если локальный API не работает, пробуем Supabase
      response = await fetch('/api/random-reviews?limit=9')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.reviews)) {
          const fetched = data.reviews
          setReviews(fetched)
          // Пересчитать агрегаты локально
          if (fetched.length > 0) {
            const avg = fetched.reduce((s: number, r: any) => s + (r.rating || 5), 0) / fetched.length
            setAverageRating(Number(avg.toFixed(1)))
            setTotalReviews(fetched.length)
          } else {
            setAverageRating(5.0)
            setTotalReviews(0)
          }
          setPage(0)
        } else {
          setError(data.error || 'Ошибка загрузки отзывов')
          setReviews([])
          setAverageRating(5.0)
          setTotalReviews(0)
        }
      } else {
        setError('Ошибка загрузки отзывов')
        setReviews([])
        setAverageRating(5.0)
        setTotalReviews(0)
      }
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error)
      setError('Ошибка загрузки отзывов')
      setReviews([])
      setAverageRating(5.0)
      setTotalReviews(0)
    } finally {
      setLoading(false)
    }
  }

  const fetchVideoReviews = async () => {
    try {
      const response = await fetch('/api/video-reviews?random=true&limit=3')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data.reviews)) {
          setVideoReviews(data.reviews)
        } else {
          setVideoReviews([])
        }
      } else {
        console.error('Ошибка ответа API видеоотзывов:', response.status)
        setVideoReviews([])
      }
    } catch (error) {
      console.error('Ошибка загрузки видеоотзывов:', error)
      setVideoReviews([])
    }
  }

  useEffect(() => {
    fetchSettings()
    fetchCompanyInfo()
    fetchReviews()
    fetchVideoReviews()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Дата не указана'
      }
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Ошибка форматирования даты:', error)
      return 'Дата не указана'
    }
  }

  const renderStars = (rating: number) => {
    try {
      const stars = []
      const validRating = typeof rating === 'number' && !isNaN(rating) ? Math.max(0, Math.min(5, rating)) : 5
      const fullStars = Math.floor(validRating)
      const hasHalfStar = validRating % 1 !== 0

      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
        )
      }

      if (hasHalfStar) {
        stars.push(
          <StarHalf key="half" className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
        )
      }

      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
      for (let i = 0; i < emptyStars; i++) {
        stars.push(
          <Star key={`empty-${i}`} className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
        )
      }

      return stars
    } catch (error) {
      console.error('Ошибка рендеринга звезд:', error)
      return Array(5).fill(null).map((_, i) => (
        <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
      ))
    }
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка отзывов...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Ошибка: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50" id="reviews">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Более {dynamicClients}+ довольных клиентов доверяют нам свою бухгалтерию
          </p>
        </div>

        {/* Карточки отзывов (3 на страницу, до 3 страниц) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {pagedReviews && pagedReviews.length > 0 ? (
            pagedReviews.map((review) => (
              <div key={review.id || Math.random()} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name || 'Анонимный клиент'}</h4>
                    {review.company && (
                      <p className="text-sm text-gray-600">{review.company}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    {renderStars(review.rating || 5)}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-4">{review.text || 'Отзыв недоступен'}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{review.created_at ? formatDate(review.created_at) : 'Дата не указана'}</span>
                  <span className="capitalize">{review.source || 'yandex-maps'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">Отзывы загружаются...</p>
            </div>
          )}
        </div>

        {/* Пагинация */}
        {maxPages > 0 && reviews.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-12">
            <button
              className="px-4 py-2 rounded border bg-white disabled:opacity-50"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Предыдущие 3
            </button>
            <div className="text-sm text-gray-600">
              Страница {Math.min(page + 1, maxPages)} из {maxPages}
            </div>
            <button
              className="px-4 py-2 rounded border bg-white disabled:opacity-50"
              onClick={() => setPage(p => Math.min(maxPages - 1, p + 1))}
              disabled={page >= maxPages - 1}
            >
              Следующие 3
            </button>
          </div>
        )}

        {/* Виджет Яндекс.Карт и видеоотзывы */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 px-4">
          {/* Левый блок - Виджет Яндекс.Карт */}
          <div className="flex flex-col">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-center">
              Найдите нас на Яндекс.Картах
            </h4>
            <div 
              className="rounded-lg shadow-lg flex-1 relative"
              style={{
                height: "400px",
                overflow: "hidden",
                position: "relative"
              }}
            >
              {/* Блок с информацией о Яндекс.Картах */}
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 flex flex-col items-center justify-center text-center p-4 md:p-8"
              >
                <div className="mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                    Мы на Яндекс.Картах
                  </h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                    Читайте отзывы о нашей работе и оставляйте свои комментарии
                  </p>
                </div>
                
                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm md:text-lg font-semibold text-gray-900">Рейтинг:</span>
                      <div className="flex items-center">
                        <span className="text-lg md:text-2xl font-bold text-yellow-500">
                          {typeof companyInfo.rating === 'number' && !isNaN(companyInfo.rating) ? companyInfo.rating.toFixed(1) : '5.0'}
                        </span>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Более {typeof totalReviews === 'number' && !isNaN(totalReviews) ? totalReviews : 0} отзывов от довольных клиентов</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs md:text-sm text-gray-600">{settings.address}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      <span className="text-xs md:text-sm text-gray-600">{settings.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <a 
                    href="https://yandex.ru/maps/org/prosto_byuro/180493814174/reviews/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/>
                    </svg>
                    Читать отзывы
                  </a>
                  <p className="text-xs text-gray-500">
                    Откроется в новом окне
                  </p>
                </div>
              </div>

              
              <a 
                href="https://yandex.ru/maps/org/prosto_byuro/180493814174/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  boxSizing: "border-box",
                  textDecoration: "none",
                  color: "#b3b3b3",
                  fontSize: "10px",
                  fontFamily: "YS Text,sans-serif",
                  padding: "0 20px",
                  position: "absolute",
                  bottom: "8px",
                  width: "100%",
                  textAlign: "center",
                  left: "0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxHeight: "14px",
                  whiteSpace: "nowrap"
                }}
              >
                Просто Бюро на карте Калуги — Яндекс Карты
              </a>
            </div>
          </div>

          {/* Правый блок - Видеоотзыв */}
          <div className="flex flex-col">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-center">
              Видеоотзыв клиента
            </h4>
            <div 
              className="rounded-lg shadow-lg flex-1 bg-gray-50 border border-gray-200 flex items-center justify-center"
              style={{
                height: "400px",
                position: "relative"
              }}
            >

              
              {videoReviews.length > 0 ? (
                /* Отображение видеоотзыва из базы данных */
                <div className="w-full h-full relative">
                  <video 
                    src={videoReviews[0].video_url}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                    style={{ maxHeight: '400px' }}
                    preload="metadata"
                  >
                    Ваш браузер не поддерживает воспроизведение видео.
                  </video>
                  
                  {/* Информация о клиенте */}
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 bg-black/70 text-white p-2 md:p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <h5 className="font-semibold text-sm md:text-base">{videoReviews[0].name}</h5>
                      <div className="flex items-center">
                        {renderStars(videoReviews[0].rating)}
                      </div>
                    </div>
                    {videoReviews[0].company && (
                      <p className="text-xs md:text-sm text-gray-300 mb-1 md:mb-2">{videoReviews[0].company}</p>
                    )}
                    <p className="text-xs md:text-sm text-gray-200 line-clamp-2">{videoReviews[0].text}</p>
                  </div>
                </div>
              ) : (
                /* Заглушка если нет видеоотзывов */
                <div className="text-center p-4 md:p-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5z"/>
                    </svg>
                  </div>
                  <h5 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                    Видеоотзывы клиентов
                  </h5>
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                    Здесь будут отображаться видеоотзывы наших клиентов
                  </p>
                  <p className="text-xs text-gray-500 mb-3 md:mb-4">
                    Видеоотзывы пока не добавлены
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12 px-4">
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Все отзывы взяты с{" "}
            <a
              href="https://yandex.ru/maps/org/prosto_byuro/180493814174/reviews/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Яндекс.Карт
            </a>
            {" "}и нашего сайта
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs md:text-sm text-gray-500">
            <span>Средняя оценка: {averageRating}</span>
            <span className="hidden sm:inline">•</span>
            <span>Всего отзывов: {totalReviews}+</span>
          </div>
        </div>
      </div>
    </section>
  )
}
