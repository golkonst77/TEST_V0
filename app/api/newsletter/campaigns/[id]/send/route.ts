import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSendsayService } from '@/lib/sendsay-service'

// Импортируем Sendsay API
require('isomorphic-fetch') // Полифилл для fetch
const Sendsay = require('sendsay-api')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Инициализируем Sendsay клиент
const initSendsay = () => {
  if (!process.env.SENDSAY_API_KEY) {
    console.warn('SENDSAY_API_KEY не установлен, используется режим симуляции')
    return null
  }
  
  return new Sendsay({ 
    apiKey: process.env.SENDSAY_API_KEY 
  })
}

// Функция отправки через Sendsay
const sendEmailViaSendsay = async (campaign: any, subscribers: any[]) => {
  const sendsay = initSendsay()
  
  if (!sendsay) {
    // Режим симуляции для разработки
    console.log('🔄 Режим симуляции: отправка кампании', campaign.subject)
    console.log('📧 Получатели:', subscribers.length)
    
    // Симулируем задержку отправки
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      sent: subscribers.length,
      failed: 0,
      mode: 'simulation'
    }
  }
  
  try {
    // Отправляем рассылку через Sendsay
    console.log('📨 Отправка через Sendsay API...')
    
    // Получаем список подписчиков для Sendsay
    const emailList = subscribers
      .filter(sub => sub.is_active && sub.email)
      .map(sub => sub.email)
    
    if (emailList.length === 0) {
      throw new Error('Нет активных подписчиков для отправки')
    }
    
    // Создаем кампанию в Sendsay
    const campaignData = {
      action: 'issue.send',
      letter: {
        subject: campaign.subject,
        body: {
          html: campaign.content,
          // Можно добавить текстовую версию
          text: campaign.content.replace(/<[^>]*>/g, '') // Простое удаление HTML тегов
        }
      },
      sendwhen: 'now',
      users: {
        list: emailList
      }
    }
    
    const response = await sendsay.request(campaignData)
    
    if (response.errors) {
      throw new Error(`Sendsay API ошибка: ${JSON.stringify(response.errors)}`)
    }
    
    console.log('✅ Кампания отправлена через Sendsay:', response)
    
    return {
      success: true,
      sent: emailList.length,
      failed: 0,
      sendsayResponse: response,
      mode: 'sendsay'
    }
    
  } catch (error) {
    console.error('❌ Ошибка отправки через Sendsay:', error)
    throw error
  }
}

// Функция логирования результатов
const logEmailResults = async (campaignId: string, emails: string[], success: boolean, mode: string) => {
  const logs = emails.map(email => ({
    campaign_id: campaignId,
    email: email,
    status: success ? 'sent' : 'failed',
    error_message: success ? null : 'Ошибка отправки',
    sent_at: new Date().toISOString()
  }));
  
  if (logs.length > 0) {
    const { error } = await supabase
      .from('newsletter_logs')
      .insert(logs);
    
    if (error) {
      console.error('Ошибка записи логов:', error);
    } else {
      console.log(`📝 Записано ${logs.length} логов (режим: ${mode})`);
    }
  }
};

// Отправка кампании
export async function POST(
  try {
    const campaignId = params.id
    
    // Получаем кампанию
    ) {
    const supabase = getSupabaseClient();
    $3const { data, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Кампания не найдена' }, { status: 404 })
    }

    if (campaign.status === 'sent') {
      return NextResponse.json({ error: 'Кампания уже отправлена' }, { status: 400 })
    }

    // Получаем активных подписчиков
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)

    if (subscribersError) {
      console.error('Ошибка получения подписчиков:', subscribersError)
      return NextResponse.json({ error: 'Ошибка получения подписчиков' }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'Нет активных подписчиков' }, { status: 400 })
    }

    console.log(`🚀 Начинаем отправку кампании "${campaign.subject}" для ${subscribers.length} подписчиков`)
    
    try {
      // Получаем сервис Sendsay
      const sendsayService = getSendsayService()
      
      // Подготавливаем данные для отправки
      const emailCampaign = {
        subject: campaign.subject,
        content: campaign.content,
        recipients: subscribers.map(sub => sub.email).filter(Boolean)
      }
      
      // Отправляем через Sendsay
      const sendResult = await sendsayService.sendCampaign(emailCampaign)
      
      // Логируем результаты
      await logEmailResults(
        campaignId, 
        emailCampaign.recipients, 
        sendResult.success, 
        sendResult.mode
      )
      
      // Обновляем статус кампании
      const { error: updateError } = await supabase
        .from('newsletter_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          sent_count: sendResult.sent,
          failed_count: sendResult.failed
        })
        .eq('id', campaignId)

      if (updateError) {
        console.error('Ошибка обновления кампании:', updateError)
      }
      
      const message = sendResult.mode === 'simulation' 
        ? `Кампания отправлена в режиме симуляции для ${sendResult.sent} подписчиков`
        : `Кампания успешно отправлена через Sendsay для ${sendResult.sent} подписчиков`
      
      return NextResponse.json({
        success: true,
        message,
        sent_count: sendResult.sent,
        failed_count: sendResult.failed,
        mode: sendResult.mode,
        campaign_id: campaignId,
        details: sendResult.mode === 'sendsay' ? 'Отправлено через Sendsay API' : 'Режим разработки'
      })
      
    } catch (sendError) {
      console.error('Ошибка отправки кампании:', sendError)
      
      // Логируем неудачную отправку
      await logEmailResults(
        campaignId, 
        subscribers.map(sub => sub.email).filter(Boolean), 
        false, 
        'error'
      )
      
      // Обновляем статус на ошибку
      await supabase
        .from('newsletter_campaigns')
        .update({
          status: 'draft', // Возвращаем в черновик при ошибке
          failed_count: subscribers.length
        })
        .eq('id', campaignId)
      
      return NextResponse.json({ 
        error: 'Ошибка отправки кампании',
        details: sendError instanceof Error ? sendError.message : 'Неизвестная ошибка'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Общая ошибка API:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
} 