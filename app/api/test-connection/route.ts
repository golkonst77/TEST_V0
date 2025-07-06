import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
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
    
    const { data, error } = await supabase
      .from('reviews')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 