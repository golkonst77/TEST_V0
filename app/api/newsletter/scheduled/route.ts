import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Обработка запланированных рассылок
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию (можно добавить API ключ)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем запланированные кампании, которые пора отправить
    const { data: campaigns, error: campaignsError } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())

    if (campaignsError) {
      console.error('Error fetching scheduled campaigns:', campaignsError)
      return NextResponse.json({ error: 'Ошибка получения кампаний' }, { status: 500 })
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ message: 'Нет запланированных кампаний для отправки' })
    }

    const results = []

    // Обрабатываем каждую кампанию
    for (const campaign of campaigns) {
      try {
        // Получаем активных подписчиков
        const { data: subscribers, error: subscribersError } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .eq('is_active', true)

        if (subscribersError) {
          console.error('Error fetching subscribers:', subscribersError)
          continue
        }

        if (!subscribers || subscribers.length === 0) {
          continue
        }

        // Отправляем письма всем подписчикам
        const emailPromises = subscribers.map(async (subscriber) => {
          try {
            // Здесь должна быть интеграция с email сервисом
            console.log(`Отправка запланированного письма на ${subscriber.email}:`)
            console.log(`Тема: ${campaign.subject}`)
            console.log(`Содержание: ${campaign.content}`)
            
            // Записываем в лог
            await supabase
              .from('newsletter_logs')
              .insert([
                {
                  campaign_id: campaign.id,
                  email: subscriber.email,
                  status: 'sent',
                  sent_at: new Date().toISOString()
                }
              ])

            return { email: subscriber.email, status: 'sent' }
          } catch (error) {
            console.error(`Error sending to ${subscriber.email}:`, error)
            
            // Записываем ошибку в лог
            await supabase
              .from('newsletter_logs')
              .insert([
                {
                  campaign_id: campaign.id,
                  email: subscriber.email,
                  status: 'failed',
                  error_message: error instanceof Error ? error.message : 'Unknown error',
                  sent_at: new Date().toISOString()
                }
              ])

            return { email: subscriber.email, status: 'failed' }
          }
        })

        const emailResults = await Promise.all(emailPromises)
        
        // Подсчитываем результаты
        const sentCount = emailResults.filter(r => r.status === 'sent').length
        const failedCount = emailResults.filter(r => r.status === 'failed').length

        // Обновляем статус кампании
        await supabase
          .from('newsletter_campaigns')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            sent_count: sentCount,
            failed_count: failedCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', campaign.id)

        results.push({
          campaign_id: campaign.id,
          subject: campaign.subject,
          sent_count: sentCount,
          failed_count: failedCount,
          total_subscribers: subscribers.length
        })

      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error)
        results.push({
          campaign_id: campaign.id,
          subject: campaign.subject,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed_campaigns: results.length,
      results
    })

  } catch (error) {
    console.error('Error processing scheduled campaigns:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
} 