import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase не настроен' }, { status: 500 })
  }

  try {
    // SQL для создания таблицы reviews
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        text TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'yandex', 'google', 'website', 'yandex-maps', 'yandex-json')),
        is_published BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        published_at TIMESTAMP WITH TIME ZONE,
        admin_notes TEXT
      );
    `

    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
    
    if (error) {
      console.error('Error creating table:', error)
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    // Создание индексов
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
      CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
      CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
      CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);
      CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);
    `

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexesSQL })
    
    if (indexError) {
      console.error('Error creating indexes:', indexError)
      return NextResponse.json({ error: String(indexError) }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Таблица reviews успешно создана' })
  } catch (error: any) {
    console.error('Error in create-reviews-table API:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
