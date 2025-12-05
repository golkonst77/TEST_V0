import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Инициализация Supabase клиента
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { essential, analytics, marketing, timestamp, version } = body

    // Получаем IP адрес пользователя
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Получаем User-Agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Сохраняем согласие в базу данных
    const { data, error } = await supabase
      .from('cookie_consents')
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        essential,
        analytics,
        marketing,
        consent_timestamp: timestamp,
        policy_version: version,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Ошибка сохранения согласия в БД:', error)
      // Не возвращаем ошибку клиенту, чтобы не нарушать UX
      // Просто логируем
      return NextResponse.json(
        { 
          success: true, 
          message: 'Согласие принято (сохранение в БД отложено)',
          saved: false 
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Согласие успешно сохранено',
        saved: true,
        id: data?.[0]?.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Ошибка обработки согласия:', error)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Согласие принято',
        saved: false 
      },
      { status: 200 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Cookie Consent API',
      version: '1.0',
      endpoints: {
        POST: 'Сохранение согласия пользователя'
      }
    },
    { status: 200 }
  )
}





