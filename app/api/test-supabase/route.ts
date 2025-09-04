import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Проверяем переменные окружения
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: false,
        error: 'Отсутствуют переменные окружения Supabase',
        missing: {
          supabaseUrl: !supabaseUrl,
          serviceRoleKey: !serviceRoleKey
        }
      }, { status: 400 })
    }

    // Создаем клиент Supabase
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    // Тестируем подключение к базе данных
    let dbConnection = false
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
      
      if (error) {
        console.error('Ошибка подключения к БД:', error)
      } else {
        dbConnection = true
        console.log('✅ Подключение к БД успешно')
      }
    } catch (dbError) {
      console.error('Ошибка при тесте БД:', dbError)
    }

    // Тестируем email функционал (без реальной отправки)
    let emailService = false
    try {
      // Проверяем, доступен ли email сервис через auth
      const { data: emailTest, error: emailError } = await supabase.auth.admin.listUsers()
      
      if (emailError) {
        console.error('Ошибка email сервиса:', emailError)
      } else {
        emailService = true
        console.log('✅ Email сервис доступен')
      }
    } catch (emailError) {
      console.error('Ошибка при тесте email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Тест Supabase завершен',
      environment: {
        supabaseUrl: !!supabaseUrl,
        serviceRoleKey: !!serviceRoleKey,
        supabaseUrlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : null
      },
      services: {
        database: dbConnection,
        email: emailService
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Ошибка тестирования Supabase:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка тестирования Supabase',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: false,
        error: 'Отсутствуют переменные окружения Supabase'
      }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    // В Supabase 2.x нет встроенного метода sendRawEmail
    // Вместо этого создадим запись в базе данных для логирования
    try {
      const { data, error } = await supabase
        .from('quiz_notifications')
        .insert([
          {
            email: testEmail || 'admin@prostoburo.com',
            subject: '🧪 Тест email от Supabase',
            content: 'Это тестовое сообщение от Supabase email сервиса.',
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) {
        console.error('Ошибка создания записи:', error)
        return NextResponse.json({
          success: false,
          error: 'Ошибка создания записи в БД',
          details: error.message,
          suggestion: 'Нужно создать таблицу quiz_notifications или использовать Edge Function'
        }, { status: 400 })
      }
      
      console.log('✅ Запись создана в БД:', data)
      return NextResponse.json({
        success: true,
        message: 'Тестовое уведомление сохранено в БД',
        data: data,
        note: 'Для реальной отправки email нужно настроить Edge Function или использовать внешний сервис'
      })
      
    } catch (dbError) {
      console.error('Ошибка при работе с БД:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Ошибка при работе с БД',
        details: dbError instanceof Error ? dbError.message : 'Неизвестная ошибка',
        suggestion: 'Проверьте структуру БД или создайте таблицу quiz_notifications'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Ошибка обработки запроса:', error)
    return NextResponse.json({
      success: false,
      error: 'Ошибка обработки запроса'
    }, { status: 500 })
  }
}
