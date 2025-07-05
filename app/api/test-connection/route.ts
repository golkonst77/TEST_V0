import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Проверяем наличие переменных окружения
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Environment variables not configured',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          url: supabaseUrl === 'your_supabase_url_here' ? 'PLACEHOLDER' : 'SET',
          key: supabaseKey === 'your_service_role_key_here' ? 'PLACEHOLDER' : 'SET'
        }
      }, { status: 500 })
    }

    // Создаем клиент Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Проверяем подключение
    const { data, error } = await supabase
      .from('reviews')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        error: 'Database connection failed',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      data: data
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 