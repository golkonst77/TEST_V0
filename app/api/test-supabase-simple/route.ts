import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Простой запрос для проверки подключения
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      data: data,
      count: data?.length || 0
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unknown error',
      stack: error.stack
    })
  }
}
