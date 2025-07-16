import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      error: 'Missing environment variables',
      details: {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      }
    }, { status: 500 })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // SQL для создания таблицы settings
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        site_name VARCHAR(255) DEFAULT 'ПростоБюро',
        site_description TEXT DEFAULT 'Профессиональные бухгалтерские услуги',
        phone VARCHAR(50) DEFAULT '+7 953 330-17-77',
        email VARCHAR(255) DEFAULT 'info@prostoburo.ru',
        address TEXT DEFAULT 'г. Калуга',
        telegram VARCHAR(255) DEFAULT 'https://t.me/prostoburo',
        vk VARCHAR(255) DEFAULT 'https://m.vk.com/buh_urist?from=groups',
        maintenance_mode BOOLEAN DEFAULT FALSE,
        analytics_enabled BOOLEAN DEFAULT TRUE,
        quiz_mode VARCHAR(20) DEFAULT 'custom',
        quiz_url TEXT,
        working_hours JSONB DEFAULT '{"monday_friday": "9:00 - 18:00", "saturday": "10:00 - 15:00", "sunday": "Выходной"}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT settings_single_row CHECK (id = 1)
      );

      INSERT INTO settings (id, site_name, site_description, phone, email, address, telegram, vk, maintenance_mode, analytics_enabled, quiz_mode, working_hours)
      VALUES (1, 'ПростоБюро', 'Профессиональные бухгалтерские услуги', '+7 953 330-17-77', 'info@prostoburo.ru', 'г. Калуга', 'https://t.me/prostoburo', 'https://m.vk.com/buh_urist?from=groups', false, true, 'custom', '{"monday_friday": "9:00 - 18:00", "saturday": "10:00 - 15:00", "sunday": "Выходной"}'::jsonb)
      ON CONFLICT (id) DO NOTHING;
    `

    // Выполняем SQL через rpc (если доступно)
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL })

    if (error) {
      console.error('Create table error:', error)
      return NextResponse.json({ 
        error: 'Failed to create settings table',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings table created successfully',
      data: data
    })

  } catch (error) {
    console.error('Create settings table error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 