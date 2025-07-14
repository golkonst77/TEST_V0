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
  author?: string
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
  {
    id: "4",
    name: "Дмитрий Антонов",
    company: "ИП Антонов Д.В.",
    rating: 5,
    text: "Отзывчивые сотрудники, всегда на связи. Ведут учет моего ИП уже второй год. Очень доволен сервисом.",
    source: "manual",
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    name: "Ольга Васильева",
    company: 'ООО "Медтехника"',
    rating: 5,
    text: "Доступные цены, качественный сервис. Помогли с открытием ООО и постановкой на учет. Все четко и быстро.",
    source: "manual",
    created_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6",
    name: "Игорь Михайлов",
    company: "ИП Михайлов И.С.",
    rating: 5,
    text: "Пользуюсь услугами уже год. Все отчеты сдаются вовремя, никаких штрафов. Экономлю время и нервы.",
    source: "manual",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "7",
    name: "Светлана Николаева",
    company: 'ООО "Эко-Строй"',
    rating: 4,
    text: "Грамотные консультации, разъяснили все непонятные моменты. Очень довольна сотрудничеством. Всем рекомендую!",
    source: "manual",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "8",
    name: "Александр Романов",
    company: "ИП Романов А.П.",
    rating: 5,
    text: "Быстрое оформление документов, адекватные цены. Советую всем начинающим предпринимателям.",
    source: "manual",
    created_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "9",
    name: "Татьяна Левина",
    company: 'ООО "Автосервис+"',
    rating: 5,
    text: "Профессиональная команда, индивидуальный подход к каждому клиенту. Рекомендую всем знакомым!",
    source: "manual",
    created_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "10",
    name: "Сергей Кузнецов",
    company: "ИП Кузнецов С.М.",
    rating: 4,
    text: "Оперативно решают все вопросы. Хорошая поддержка клиентов, всегда идут навстречу. Спасибо за работу!",
    source: "manual",
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "11",
    name: "Марина Жукова",
    company: 'ООО "Здоровое питание"',
    rating: 5,
    text: "Удобный сервис, понятные объяснения сложных вопросов. Работают быстро и качественно. Довольна результатом!",
    source: "manual",
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "12",
    name: "Владимир Титов",
    company: "ИП Титов В.Н.",
    rating: 5,
    text: "Доверяю им свой бизнес уже третий год. Профессионалы своего дела, всегда помогут и подскажут.",
    source: "manual",
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [videoReviews, setVideoReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [averageRating, setAverageRating] = useState(5.0)
  const [totalReviews, setTotalReviews] = useState(500)


  useEffect(() => {
    fetchReviews()
    fetchVideoReviews()
  }, [])



  const fetchReviews = async () => {
    try {
      setLoading(true)
      console.log('🔍 Начинаю загрузку отзывов...')
      
      // Используем новый агрегатор отзывов
      console.log('🔍 Загружаю отзывы через агрегатор...')
      const aggregatorResponse = await fetch("/api/reviews-aggregator")
      const aggregatorData = await aggregatorResponse.json()
      
      console.log('📊 Ответ от агрегатора:', aggregatorData)
      
      if (aggregatorResponse.ok && aggregatorData.success && aggregatorData.reviews.length > 0) {
        console.log(`✅ Агрегатор собрал ${aggregatorData.reviews.length} отзывов из ${aggregatorData.sources.length} источников`)
        
        setReviews(aggregatorData.reviews)
        setAverageRating(aggregatorData.summary.averageRating)
        setTotalReviews(aggregatorData.summary.totalReviews < 500 ? 500 : aggregatorData.summary.totalReviews)
        
        // Показываем информацию об источниках
        const sourcesInfo = aggregatorData.sources
          .filter((s: any) => s.status === 'success')
          .map((s: any) => `${s.name}: ${s.count}`)
          .join(', ')
        
        if (sourcesInfo) {
          setError(`✅ Источники отзывов: ${sourcesInfo}`)
        }
        
        setLoading(false)
        return
      }
      
      console.log('⚠️ Агрегатор не смог найти отзывы, используем fallback...')
      
      // Если агрегатор не смог найти отзывы, используем fallback
      setReviews(fallbackReviews)
      setError(`❌ Не удалось загрузить реальные отзывы. Показаны примеры. ${aggregatorData.error || 'Попробуйте добавить отзывы через админку.'}`)
      setLoading(false)
      
    } catch (err) {
      console.error('❌ Ошибка загрузки отзывов:', err)
      setReviews(fallbackReviews)
      setError("Не удалось загрузить отзывы, показаны примеры.")
      setLoading(false)
    }
  }

  const fetchVideoReviews = async () => {
    try {
      console.log('🎬 Начинаю загрузку видеоотзывов...')
      
      const response = await fetch("/api/video-reviews?random=true&limit=3")
      const data = await response.json()
      
      console.log('📊 Ответ видеоотзывов:', data)
      
      if (response.ok && data.reviews && data.reviews.length > 0) {
        console.log(`✅ Найдено ${data.reviews.length} видеоотзывов`)
        setVideoReviews(data.reviews)
      }
      
    } catch (err) {
      console.error('❌ Ошибка загрузки видеоотзывов:', err)
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4 px-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Более {totalReviews}+ довольных клиентов доверяют нам свою бухгалтерию
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            Загрузка отзывов...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 px-4">
            {reviews.map((review) => (
              <Card key={review.id} className="relative hover:shadow-lg transition-shadow rounded-xl">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 md:h-4 md:w-4 ${
                            i < review.rating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                    <Quote className="h-4 w-4 md:h-6 md:w-6 text-gray-300" />
                  </div>
<<<<<<< HEAD
                  <CardTitle className="text-lg">{review.name || review.author || "Клиент"}</CardTitle>
=======
                  <CardTitle className="text-base md:text-lg">{review.name}</CardTitle>
>>>>>>> 196ff61 (feat(hero): компактные карточки features, кастомная тень заголовка, выравнивание контента по верхнему краю)
                  {review.company && (
                    <CardDescription className="text-sm md:text-base">{review.company}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <p className="text-gray-600 mb-4 line-clamp-4 text-sm md:text-base leading-relaxed">{review.text}</p>
                  <div className="flex justify-between items-center text-xs md:text-sm text-gray-400">
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
        <div className="mt-12 md:mt-16 mb-8 md:mb-12">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 px-4">
              Отзывы клиентов
            </h3>
            <p className="text-gray-600 text-sm md:text-base px-4">
              Живые отзывы с Яндекс.Карт и видеоотзывы наших клиентов
            </p>
          </div>
          
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
                          <span className="text-lg md:text-2xl font-bold text-yellow-500">4.8</span>
                          <div className="flex ml-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">Более 50 отзывов от довольных клиентов</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-xs md:text-sm text-gray-600">г. Калуга, ул. Примерная, 123</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                        <span className="text-xs md:text-sm text-gray-600">+7 953 330-17-77</span>
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
