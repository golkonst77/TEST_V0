import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Проверяем переменные окружения
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      adminEmail: process.env.ADMIN_EMAIL || 'admin@prostoburo.com'
    }
    
    console.log('🔍 Проверка переменных окружения:', envCheck)
    
    return NextResponse.json({
      success: true,
      message: 'Тест API email доступен',
      environment: envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Ошибка в тестовом API:', error)
    return NextResponse.json(
      { error: 'Ошибка тестирования' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📧 Тестовый POST запрос:', body)
    
    // Простая проверка без реальной отправки email
    const testResult = {
      received: body,
      timestamp: new Date().toISOString(),
      status: 'test_success'
    }
    
    console.log('✅ Тестовый запрос обработан:', testResult)
    
    return NextResponse.json({
      success: true,
      message: 'Тестовый запрос обработан успешно',
      result: testResult
    })
  } catch (error) {
    console.error('Ошибка обработки тестового запроса:', error)
    return NextResponse.json(
      { error: 'Ошибка обработки запроса' },
      { status: 500 }
    )
  }
}
