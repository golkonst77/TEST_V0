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
  console.log('POST /api/reset-reviews called');
  console.log('Supabase config:', { supabaseUrl, supabaseKey: supabaseKey ? '***' : undefined });
  if (!supabase) {
    console.error('Supabase not configured:', { supabaseUrl, supabaseKey });
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    console.log('🗑️  Начинаю сброс отзывов...')
    // Удаляем все отзывы
    const result = await supabase
      .from('reviews')
      .delete()
      .not('id', 'is', null)
    console.log('Результат удаления:', result)
    const { error, data, status, statusText } = result
    if (error) {
      console.error('Ошибка при сбросе отзывов:', error)
      return NextResponse.json({ error: 'Failed to reset reviews', details: error, status, statusText, data }, { status: 500 })
    }
    console.log('✅ Отзывы успешно сброшены, удалено:', data?.length)
    return NextResponse.json({ 
      success: true, 
      message: 'Reviews reset successfully',
      deleted: data?.length,
      status,
      statusText
    })
  } catch (error) {
    console.error('Ошибка в API сброса отзывов:', error);
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 })
  }
} 