import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

// Агрегатор отзывов из разных источников
export async function GET(request: NextRequest) {
  console.log('🔍 Запуск агрегатора отзывов...')
  
  const allReviews: any[] = []
  const sources: any[] = []
  
  try {
    // 1. Попытка получить отзывы из базы данных
    console.log('📊 Попытка загрузки из базы данных...')
    try {
      const dbResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reviews?published=true&limit=50`)
      const dbData = await dbResponse.json()
      
      if (dbData.reviews && dbData.reviews.length > 0) {
        console.log(`✅ Из БД получено: ${dbData.reviews.length} отзывов`)
        allReviews.push(...dbData.reviews)
        sources.push({
          name: 'database',
          count: dbData.reviews.length,
          status: 'success'
        })
      }
    } catch (error) {
      console.log('❌ БД недоступна:', error)
      sources.push({
        name: 'database',
        count: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    // 2. Попытка получить отзывы с Яндекс.Карт
    console.log('🗺️ Попытка загрузки с Яндекс.Карт...')
    try {
      const yandexResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/yandex-reviews`)
      const yandexData = await yandexResponse.json()
      
      if (yandexData.reviews && yandexData.reviews.length > 0) {
        console.log(`✅ С Яндекс.Карт получено: ${yandexData.reviews.length} отзывов`)
        
        // Конвертируем формат
        const formattedYandexReviews = yandexData.reviews.map((review: any, index: number) => ({
          id: `yandex-${Date.now()}-${index}`,
          name: review.name || 'Клиент',
          company: null,
          rating: parseInt(review.rating) || 5,
          text: review.text || '',
          source: 'yandex-maps',
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        }))
        
        allReviews.push(...formattedYandexReviews)
        sources.push({
          name: 'yandex-maps',
          count: yandexData.reviews.length,
          status: 'success',
          source: yandexData.source
        })
      } else {
        console.log('⚠️ Яндекс.Карты: отзывы не найдены')
        sources.push({
          name: 'yandex-maps',
          count: 0,
          status: 'empty',
          message: yandexData.message || 'No reviews found'
        })
      }
    } catch (error) {
      console.log('❌ Яндекс.Карты недоступны:', error)
      sources.push({
        name: 'yandex-maps',
        count: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    // 3. Добавляем готовые отзывы для демонстрации (только если других нет)
    if (allReviews.length === 0) {
      console.log('📝 Добавляю готовые отзывы для демонстрации...')
      
      const demoReviews = [
        {
          id: 'demo-1',
          name: 'Анна Петрова',
          company: 'ООО "Строй-Мастер"',
          rating: 5,
          text: 'Отличная команда! Помогли пройти налоговую проверку без единого штрафа. Всегда на связи, отвечают быстро и по делу.',
          source: 'demo',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-2',
          name: 'Михаил Сидоров',
          company: 'ИП Сидоров М.А.',
          rating: 5,
          text: 'Работаю с ПростоБюро уже 3 года. Никаких проблем с отчетностью, все сдается вовремя. Рекомендую!',
          source: 'demo',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-3',
          name: 'Елена Козлова',
          company: 'ООО "Торговый дом"',
          rating: 5,
          text: 'Профессиональный подход к делу. Оперативно решают любые вопросы. Цены адекватные, качество на высоте.',
          source: 'demo',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      allReviews.push(...demoReviews)
      sources.push({
        name: 'demo',
        count: demoReviews.length,
        status: 'fallback',
        message: 'Demo reviews used as fallback'
      })
    }
    
    // Удаляем дубликаты по тексту
    const uniqueReviews = allReviews.filter((review, index, arr) => 
      index === arr.findIndex(r => r.text === review.text && r.name === review.name)
    )
    
    // Сортируем по дате (новые сначала)
    uniqueReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    console.log(`✅ Итого уникальных отзывов: ${uniqueReviews.length}`)
    
    return NextResponse.json({
      success: true,
      reviews: uniqueReviews,
      total: uniqueReviews.length,
      sources: sources,
      aggregatedAt: new Date().toISOString(),
      summary: {
        totalSources: sources.length,
        successfulSources: sources.filter(s => s.status === 'success').length,
        totalReviews: uniqueReviews.length,
        averageRating: uniqueReviews.length > 0 
          ? Math.round((uniqueReviews.reduce((sum, r) => sum + r.rating, 0) / uniqueReviews.length) * 10) / 10 
          : 5.0
      }
    })
    
  } catch (error) {
    console.error('❌ Ошибка агрегатора:', error)
    
    return NextResponse.json({
      success: false,
      reviews: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      sources: sources,
      aggregatedAt: new Date().toISOString()
    }, { status: 500 })
  }
} 