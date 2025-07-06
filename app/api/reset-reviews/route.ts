import { NextResponse } from 'next/server'
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
    console.log('🗑️  Начинаю сброс отзывов...')
    
    // Удаляем все отзывы
    const { error } = await supabase
      .from('reviews')
      .delete()
      .neq('id', 'impossible-value') // Удаляем все записи
    
    if (error) {
      console.error('Ошибка при сбросе отзывов:', error)
      return NextResponse.json({ error: 'Failed to reset reviews' }, { status: 500 })
    }

    console.log('✅ Отзывы успешно сброшены')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Reviews reset successfully' 
    })

  } catch (error) {
    console.error('Ошибка в API сброса отзывов:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 