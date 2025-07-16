import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
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
    const body = await request.json()
    console.log("Test save request body:", body)
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Пытаемся сохранить тестовые данные
    const testData = {
      id: 1,
      site_name: "ПростоБюро",
      site_description: "Профессиональные бухгалтерские услуги",
      phone: "+7 953 330-17-77",
      email: "test@prostoburo.ru",
      address: "г. Калуга",
      telegram: "https://t.me/prostoburo",
      vk: "https://m.vk.com/buh_urist?from=groups",
      maintenance_mode: false,
      analytics_enabled: true,
      quiz_mode: "custom",
      working_hours: {
        monday_friday: "9:00 - 18:00",
        saturday: "10:00 - 15:00",
        sunday: "Выходной"
      }
    }
    
    console.log("Attempting to save test data:", testData)
    
    // Пытаемся вставить данные
    const { data, error } = await supabase
      .from("settings")
      .upsert([testData], { onConflict: "id" })
      .select()
    
    if (error) {
      console.error("Error saving test data:", error)
      return NextResponse.json({ 
        error: 'Failed to save test data',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    console.log("Test data saved successfully:", data)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test data saved successfully',
      data: data
    })

  } catch (error) {
    console.error("Test save error:", error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 