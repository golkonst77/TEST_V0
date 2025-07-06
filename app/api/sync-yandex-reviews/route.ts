import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function POST() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    console.log('🔄 Начинаю синхронизацию отзывов с Яндекс.Карт...')
    
    // 1. Получаем отзывы с Яндекс.Карт
    const yandexResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/yandex-reviews`)
    
    if (!yandexResponse.ok) {
      throw new Error('Не удалось получить отзывы с Яндекс.Карт')
    }
    
    const yandexData = await yandexResponse.json()
    
    if (!yandexData.reviews || yandexData.reviews.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Отзывы с Яндекса не найдены'
      })
    }
    
    console.log(`📥 Получено ${yandexData.reviews.length} отзывов с Яндекса`)
    
    // 2. Получаем существующие отзывы из БД
    const { data: existingReviews } = await supabase
      .from('reviews')
      .select('name, text, source')
      .eq('source', 'yandex')
    
    console.log(`📊 В БД уже есть ${existingReviews?.length || 0} отзывов с Яндекса`)
    
    // 3. Фильтруем новые отзывы (избегаем дубликатов)
    const newReviews = yandexData.reviews.filter((yandexReview: any) => {
      const isDuplicate = existingReviews?.some(dbReview => 
        dbReview.name === yandexReview.name && 
        dbReview.text === yandexReview.text
      )
      return !isDuplicate
    })
    
    console.log(`✨ Найдено ${newReviews.length} новых отзывов для импорта`)
    
    if (newReviews.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Все отзывы с Яндекса уже импортированы',
        imported: 0,
        total: yandexData.reviews.length
      })
    }
    
    // 4. Форматируем отзывы для БД
    const reviewsToInsert = newReviews.map((review: any) => ({
      name: review.name || 'Гость',
      rating: Math.min(Math.max(parseInt(review.rating) || 5, 1), 5), // Убеждаемся что рейтинг 1-5
      text: review.text || 'Отзыв без текста',
      source: 'yandex',
      is_published: true, // Автоматически публикуем отзывы с Яндекса
      is_featured: false, // Рекомендуемые можно выбрать вручную
      published_at: new Date().toISOString(),
      admin_notes: `Импортировано с Яндекс.Карт ${new Date().toLocaleString('ru-RU')}`
    }))
    
    // 5. Сохраняем в БД
    const { data: insertedReviews, error } = await supabase
      .from('reviews')
      .insert(reviewsToInsert)
      .select()
    
    if (error) {
      console.error('❌ Ошибка при сохранении отзывов:', error)
      throw error
    }
    
    console.log(`✅ Успешно импортировано ${insertedReviews?.length || 0} отзывов`)
    
    // 6. Статистика после импорта
    const { data: stats } = await supabase
      .from('reviews')
      .select('source, is_published')
    
    const totalReviews = stats?.length || 0
    const yandexReviews = stats?.filter(r => r.source === 'yandex').length || 0
    const publishedReviews = stats?.filter(r => r.is_published).length || 0
    
    return NextResponse.json({
      success: true,
      message: `Успешно импортировано ${insertedReviews?.length} новых отзывов`,
      imported: insertedReviews?.length || 0,
      total: yandexData.reviews.length,
      skipped: yandexData.reviews.length - newReviews.length,
      stats: {
        totalReviews,
        yandexReviews,
        publishedReviews
      }
    })
    
  } catch (error) {
    console.error('❌ Ошибка синхронизации отзывов:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  }
} 