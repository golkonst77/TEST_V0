import { NextRequest, NextResponse } from 'next/server'

// Проверяем, подключен ли Supabase
const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (hasSupabase) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  } catch (error) {
    console.warn('Supabase не подключен:', error)
  }
}

// GET - получить опубликованные видеоотзывы
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        reviews: [],
        message: 'База данных не подключена' 
      })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '3')
    const random = searchParams.get('random') === 'true'

    let query = supabase
      .from('video_reviews')
      .select('*')
      .eq('is_published', true)

    if (random) {
      // Получаем случайные отзывы
      const { data: allReviews, error: countError } = await supabase
        .from('video_reviews')
        .select('id')
        .eq('is_published', true)

      if (countError) {
        console.error('Ошибка получения количества отзывов:', countError)
        return NextResponse.json({ 
          reviews: [],
          error: 'Ошибка получения отзывов' 
        })
      }

      if (allReviews.length === 0) {
        return NextResponse.json({ 
          reviews: [],
          message: 'Нет опубликованных видеоотзывов' 
        })
      }

      // Выбираем случайные ID
      const shuffled = allReviews.sort(() => 0.5 - Math.random())
      const selectedIds = shuffled.slice(0, limit).map(r => r.id)

      const { data, error } = await supabase
        .from('video_reviews')
        .select('*')
        .in('id', selectedIds)
        .eq('is_published', true)

      if (error) {
        console.error('Ошибка получения случайных видеоотзывов:', error)
        return NextResponse.json({ 
          reviews: [],
          error: 'Ошибка получения отзывов' 
        })
      }

      // Перемешиваем еще раз для лучшей случайности
      const randomizedReviews = (data || []).sort(() => 0.5 - Math.random())

      return NextResponse.json({ 
        reviews: randomizedReviews,
        success: true 
      })
    } else {
      // Получаем последние отзывы
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Ошибка получения видеоотзывов:', error)
        return NextResponse.json({ 
          reviews: [],
          error: 'Ошибка получения отзывов' 
        })
      }

      return NextResponse.json({ 
        reviews: data || [],
        success: true 
      })
    }

  } catch (error) {
    console.error('Ошибка API видеоотзывов:', error)
    return NextResponse.json({ 
      reviews: [],
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
} 