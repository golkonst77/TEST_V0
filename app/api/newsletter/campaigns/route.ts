import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Функция для создания таблиц если их нет
async function ensureTablesExist() {
  try {
    // Проверяем существование таблицы newsletter_campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('newsletter_campaigns')
      .select('count')
      .limit(1)

    if (campaignsError && campaignsError.code === '42P01') {
      // Таблица не существует, создаем её
      console.log('Создаю таблицу newsletter_campaigns...')
      
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS newsletter_campaigns (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            subject VARCHAR(500) NOT NULL,
            content TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
            scheduled_at TIMESTAMP WITH TIME ZONE,
            sent_at TIMESTAMP WITH TIME ZONE,
            sent_count INTEGER DEFAULT 0,
            failed_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
          
          CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status)
          CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created ON newsletter_campaigns(created_at)
        `
      })
      
      if (createError) {
        console.error('Ошибка создания таблицы newsletter_campaigns:', createError)
      } else {
        console.log('Таблица newsletter_campaigns создана успешно')
      }
    }
    
    // Проверяем существование таблицы newsletter_subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('count')
      .limit(1)

    if (subscribersError && subscribersError.code === '42P01') {
      // Таблица не существует, создаем её
      console.log('Создаю таблицу newsletter_subscribers...')
      
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
          
          CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email)
          CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active)
          
          INSERT INTO newsletter_subscribers (email, subscribed_at, is_active) VALUES
            ('test1@example.com', NOW() - INTERVAL '10 days', TRUE),
            ('test2@example.com', NOW() - INTERVAL '5 days', TRUE)
          ON CONFLICT (email) DO NOTHING
        `
      })
      
      if (createError) {
        console.error('Ошибка создания таблицы newsletter_subscribers:', createError)
      } else {
        console.log('Таблица newsletter_subscribers создана успешно')
      }
    }
    
  } catch (error) {
    console.error('Ошибка при проверке/создании таблиц:', error)
  }
}

// Получение списка кампаний
export async function GET() {
  try {
    // Убеждаемся что таблицы существуют
    await ensureTablesExist()
    
    const { data: campaigns, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Создание новой кампании
export async function POST(request: NextRequest) {
  try {
    // Убеждаемся что таблицы существуют
    await ensureTablesExist()
    
    const { subject, content, scheduledAt } = await request.json()

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    const campaignData: any = {
      subject,
      content,
      status: scheduledAt ? 'scheduled' : 'draft',
    }

    if (scheduledAt) {
      campaignData.scheduled_at = scheduledAt
    }

    const { data: campaign, error } = await supabase
      .from('newsletter_campaigns')
      .insert([campaignData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 