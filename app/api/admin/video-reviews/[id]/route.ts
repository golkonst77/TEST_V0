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

// PATCH - обновить видеоотзыв
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'База данных не подключена' 
      }, { status: 500 })
    }

    const id = params.id
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('video_reviews')
      .update(body)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Ошибка обновления видеоотзыва:', error)
      return NextResponse.json({ 
        error: 'Ошибка обновления отзыва' 
      }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'Отзыв не найден' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      review: data[0] 
    })

  } catch (error) {
    console.error('Ошибка API обновления видеоотзыва:', error)
    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}

// DELETE - удалить видеоотзыв
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'База данных не подключена' 
      }, { status: 500 })
    }

    const id = params.id
    
    const { data, error } = await supabase
      .from('video_reviews')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      console.error('Ошибка удаления видеоотзыва:', error)
      return NextResponse.json({ 
        error: 'Ошибка удаления отзыва' 
      }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'Отзыв не найден' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Отзыв удален' 
    })

  } catch (error) {
    console.error('Ошибка API удаления видеоотзыва:', error)
    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
} 