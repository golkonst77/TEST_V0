import { NextRequest, NextResponse } from 'next/server'

// Явно загружаем переменные окружения из .env.local
require('dotenv').config({ path: '.env.local' })

// Проверяем, подключен ли Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any = null

if (supabaseUrl && supabaseKey) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase client created successfully for video-reviews')
  } catch (error) {
    console.warn('Supabase не подключен:', error)
  }
} else {
  console.warn('Missing Supabase environment variables for video-reviews')
}

// GET - получить все видеоотзывы
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        reviews: [],
        message: 'База данных не подключена' 
      })
    }

    const { data, error } = await supabase
      .from('video_reviews')
      .select('*')
      .order('created_at', { ascending: false })

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

  } catch (error) {
    console.error('Ошибка API видеоотзывов:', error)
    return NextResponse.json({ 
      reviews: [],
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}

// POST - создать новый видеоотзыв
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'База данных не подключена' 
      }, { status: 500 })
    }

    const body = await request.json()
    const { name, company, rating, text, video_url } = body

    if (!name || !text || !video_url) {
      return NextResponse.json({ 
        error: 'Заполните все обязательные поля' 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('video_reviews')
      .insert([
        {
          name,
          company: company || null,
          rating: parseInt(rating) || 5,
          text,
          video_url,
          is_published: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Ошибка создания видеоотзыва:', error)
      return NextResponse.json({ 
        error: 'Ошибка сохранения отзыва' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      review: data[0] 
    })

  } catch (error) {
    console.error('Ошибка API создания видеоотзыва:', error)
    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
} 