import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function GET(request: NextRequest) {
  // Если Supabase не настроен, возвращаем пустые данные
  if (!supabase) {
    return NextResponse.json([])
  }

  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const source = searchParams.get('source')

    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    // Фильтр по статусу публикации
    if (published === 'true') {
      query = query.eq('is_published', true)
    } else if (published === 'false') {
      query = query.eq('is_published', false)
    }

    // Фильтр по рекомендуемым
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Фильтр по источнику
    if (source) {
      query = query.eq('source', source)
    }

    // Лимит результатов
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(reviews || [])
  } catch (error) {
    console.error('Error in reviews API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { name, company, email, phone, rating, text, source = 'manual', is_published = false, is_featured = false, admin_notes, created_at } = body

    // Валидация обязательных полей
    if (!name || !rating || !text) {
      return NextResponse.json({ error: 'Name, rating, and text are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const reviewData = {
      name,
      company,
      email,
      phone,
      rating,
      text,
      source,
      is_published,
      is_featured,
      admin_notes,
      published_at: is_published ? new Date().toISOString() : null,
      created_at: created_at || new Date().toISOString()
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error in reviews POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 