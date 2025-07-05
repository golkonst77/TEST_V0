'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { useEffect, useState } from "react"

interface Review {
  id: string
  name: string
  company?: string
  rating: number
  text: string
  source: string
  created_at: string
  published_at?: string
}

const fallbackReviews = [
  {
    id: "1",
    name: "Анна Петрова",
    company: 'ООО "Строй-Мастер"',
    rating: 5,
    text: "Отличная команда! Помогли пройти налоговую проверку без единого штрафа. Всегда на связи, отвечают быстро и по делу.",
    source: "manual",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 месяца назад
    published_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    name: "Михаил Сидоров",
    company: "ИП Сидоров М.А.",
    rating: 5,
    text: "Работаю с ПростоБюро уже 3 года. Никаких проблем с отчетностью, все сдается вовремя. Рекомендую!",
    source: "manual",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 месяц назад
    published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    name: "Елена Козлова",
    company: 'ООО "Торговый дом"',
    rating: 5,
    text: "Профессиональный подход к делу. Оперативно решают любые вопросы. Цены адекватные, качество на высоте.",
    source: "manual",
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 недели назад
    published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  },
]

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [averageRating, setAverageRating] = useState(5.0)
  const [totalReviews, setTotalReviews] = useState(15)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoUploading, setVideoUploading] = useState(false)


  useEffect(() => {
    fetchReviews()
  }, [])

  // Очистка URL объекта при размонтировании компонента
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])



  const fetchReviews = async () => {
    try {
      setLoading(true)
      console.log('🔍 Начинаю загрузку отзывов...')
      
      // Сначала пробуем загрузить отзывы из базы данных
      const dbResponse = await fetch("/api/reviews?published=true&limit=6")
      const dbData = await dbResponse.json()
      
      console.log('📊 Ответ от базы данных:', dbData)
      
      if (dbResponse.ok && dbData.reviews && dbData.reviews.length > 0) {
        console.log(`✅ Найдено ${dbData.reviews.length} отзывов из базы данных`)
        setReviews(dbData.reviews)
        
        // Вычисляем среднюю оценку
        const avgRating = dbData.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / dbData.reviews.length
        setAverageRating(Math.round(avgRating * 10) / 10)
        setTotalReviews(dbData.reviews.length)
        
        setLoading(false)
        setError("")
        return
      }

      console.log('⚠️ Отзывы из БД не найдены, пробуем Яндекс.Карты...')
      
      // Если отзывов из БД нет, пробуем Яндекс.Карты
      const yandexResponse = await fetch("/api/yandex-reviews")
      const yandexData = await yandexResponse.json()
      
      console.log('📊 Ответ от Яндекс.Карт:', yandexData)
      
      if (yandexResponse.ok && yandexData.reviews && yandexData.reviews.length > 0) {
        console.log(`✅ Найдено ${yandexData.reviews.length} отзывов с Яндекс.Карт`)
        
        // Преобразуем формат отзывов Яндекса к нашему формату
        const formattedReviews = yandexData.reviews.map((review: any, index: number) => ({
          id: `yandex-${index}`,
          name: review.name || "Гость",
          company: null,
          rating: Number(review.rating) || 5,
          text: review.text || "",
          source: "yandex",
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        })).slice(0, 6) // Берем только первые 6 отзывов
        
        setReviews(formattedReviews)
        
        // Вычисляем среднюю оценку
        const avgRating = formattedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / formattedReviews.length
        setAverageRating(Math.round(avgRating * 10) / 10)
        setTotalReviews(yandexData.reviews.length)
        
        setLoading(false)
        setError("")
        return
      }

      console.log('⚠️ Отзывы с Яндекс.Карт не найдены, используем fallback...')
      
      // Если ничего не загрузилось, используем fallback отзывы
      setReviews(fallbackReviews)
      setError("Показаны примеры отзывов. Подключите базу данных для отображения реальных отзывов.")
      setLoading(false)
      
    } catch (err) {
      console.error('❌ Ошибка загрузки отзывов:', err)
      setReviews(fallbackReviews)
      setError("Не удалось загрузить отзывы, показаны примеры.")
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "вчера"
    if (diffDays < 7) return `${diffDays} дн. назад`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} нед. назад`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} мес. назад`
    return `${Math.ceil(diffDays / 365)} г. назад`
  }

  const handleVideoUpload = async (file: File) => {
    try {
      setVideoUploading(true)
      
      // Создаем FormData для загрузки файла
      const formData = new FormData()
      formData.append('video', file)
      
      // Создаем временный URL для предварительного просмотра
      const tempUrl = URL.createObjectURL(file)
      setVideoUrl(tempUrl)
      setVideoFile(file)
      
      console.log('Видео загружено:', file.name, 'Размер:', (file.size / 1024 / 1024).toFixed(2) + 'MB')
      
    } catch (error) {
      console.error('Ошибка загрузки видео:', error)
      setError('Не удалось загрузить видео')
    } finally {
      setVideoUploading(false)
    }
  }

  const removeVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    setVideoUrl(null)
    setVideoFile(null)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Более {totalReviews}+ довольных клиентов доверяют нам свою бухгалтерию
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            Загрузка отзывов...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < review.rating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-gray-300" />
                  </div>
                  <CardTitle className="text-lg">{review.name}</CardTitle>
                  {review.company && (
                    <CardDescription>{review.company}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-4">{review.text}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{formatDate(review.published_at || review.created_at)}</span>
                    {review.source === 'yandex' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Яндекс.Карты
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-amber-600 mt-4 text-sm bg-amber-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Виджет отзывов с Яндекс.Карт и видеоотзыв */}
        <div className="mt-16 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Отзывы клиентов
            </h3>
            <p className="text-gray-600">
              Живые отзывы с Яндекс.Карт и видеоотзывы наших клиентов
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
            {/* Левый блок - Виджет Яндекс.Карт */}
            <div className="flex flex-col">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Найдите нас на Яндекс.Картах
            </h4>
              <div 
                className="rounded-lg shadow-lg flex-1 relative"
                style={{
                  height: "600px",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                {/* Блок с информацией о Яндекс.Картах */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Мы на Яндекс.Картах
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Читайте отзывы о нашей работе и оставляйте свои комментарии
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-900">Рейтинг:</span>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-yellow-500">4.8</span>
                          <div className="flex ml-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Более 50 отзывов от довольных клиентов</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-sm text-gray-600">г. Калуга, ул. Примерная, 123</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                        <span className="text-sm text-gray-600">+7 953 330-17-77</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <a 
                      href="https://yandex.ru/maps/org/prosto_byuro/180493814174/reviews/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Видеоотзыв клиента
              </h4>
              <div 
                className="rounded-lg shadow-lg flex-1 bg-gray-50 border border-gray-200 flex items-center justify-center"
                style={{
                  height: "600px",
                  position: "relative"
                }}
              >
                {videoUrl ? (
                  /* Отображение загруженного видео */
                  <div className="w-full h-full relative">
                    <video 
                      src={videoUrl}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                      style={{ maxHeight: '600px' }}
                    >
                      Ваш браузер не поддерживает воспроизведение видео.
                    </video>
                    
                    {/* Кнопка удаления видео */}
                    <button
                      onClick={removeVideo}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                      title="Удалить видео"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                      </svg>
                    </button>
                    
                    {/* Информация о файле */}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
                      {videoFile?.name} ({(videoFile?.size ? videoFile.size / 1024 / 1024 : 0).toFixed(1)}MB)
                    </div>
                  </div>
                ) : (
                  /* Форма загрузки видео */
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l7-5z"/>
                      </svg>
                    </div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">
                      Загрузите видеоотзыв
                    </h5>
                    <p className="text-gray-600 text-sm mb-4">
                      Здесь будет отображаться видеоотзыв клиента о работе ПростоБюро
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Поддерживаемые форматы: MP4, WebM, MOV, AVI
                    </p>
                    <div className="mt-4">
                      <label className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        videoUploading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}>
                        {videoUploading ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Загрузка...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
                            </svg>
                            Загрузить видео
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="video/*" 
                          className="hidden"
                          disabled={videoUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleVideoUpload(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
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
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Средняя оценка: {averageRating}</span>
            <span>•</span>
            <span>Всего отзывов: {totalReviews}+</span>
          </div>
        </div>
      </div>
    </section>
  )
}
