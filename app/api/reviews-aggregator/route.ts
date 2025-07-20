import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) throw new Error('Supabase not configured')
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return NextResponse.json({
      success: true,
      reviews: reviews || [],
      total: (reviews || []).length,
      summary: {
        totalReviews: (reviews || []).length,
        averageRating: reviews && reviews.length > 0 ? Math.round((reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length) * 10) / 10 : 5.0
      },
      sources: [
        {
          name: 'Supabase',
          status: 'success',
          count: (reviews || []).length
        }
      ]
    })
  } catch (error) {
    // fallback: демо-отзывы
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
    return NextResponse.json({
      success: false,
      reviews: demoReviews,
      total: demoReviews.length,
      summary: {
        totalReviews: demoReviews.length,
        averageRating: 5.0
      },
      sources: [
        {
          name: 'Demo',
          status: 'success',
          count: demoReviews.length
        }
      ],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 })
  }
} 