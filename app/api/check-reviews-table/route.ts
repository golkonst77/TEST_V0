import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase не настроен' }, { status: 500 })
  }

  try {
    // Пробуем получить данные из таблицы reviews
    const { data, error } = await supabase
      .from('reviews')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        exists: false, 
        error: error.message,
        code: error.code 
      })
    }

    return NextResponse.json({ 
      exists: true, 
      message: 'Таблица reviews существует',
      data: data 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      exists: false, 
      error: String(error) 
    })
  }
}
