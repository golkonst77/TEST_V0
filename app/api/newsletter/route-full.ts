import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 })
    }

    // Проверяем валидность email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Некорректный email адрес' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // Проверяем, не подписан ли уже этот email
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (checkError) {
      console.error('Ошибка проверки существующего подписчика:', checkError)
      return NextResponse.json({ error: 'Ошибка проверки подписки' }, { status: 500 })
    }

    if (existingSubscriber) {
      return NextResponse.json({ error: 'Этот email уже подписан на рассылку' }, { status: 409 })
    }

    // Сохраняем email в базу данных
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: cleanEmail,
          subscribed_at: new Date().toISOString(),
          is_active: true
        }
      ])
      .select()

    if (error) {
      console.error('Ошибка сохранения подписки:', error)
      return NextResponse.json({ error: 'Ошибка сохранения подписки' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Подписка успешно оформлена!',
      data: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Ошибка API newsletter:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Получаем список всех подписчиков (только для админа)
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false })

    if (error) {
      console.error('Ошибка получения подписчиков:', error)
      return NextResponse.json({ error: 'Ошибка получения данных' }, { status: 500 })
    }

    return NextResponse.json({ subscribers: data })

  } catch (error) {
    console.error('Ошибка API newsletter GET:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
} 