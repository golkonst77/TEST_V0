import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    
    // Проверяем существование таблицы settings
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Settings table error:', error)
      return NextResponse.json({ 
        error: 'Settings table not found or error',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings table exists',
      data: data,
      count: data?.length || 0
    })

  } catch (error) {
    console.error('Test settings table error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 