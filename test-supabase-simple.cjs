// Простой тест подключения к Supabase
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

async function testConnection() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('URL:', supabaseUrl)
    console.log('Key:', supabaseKey ? 'Configured' : 'Not configured')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables')
      return
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Тестируем подключение
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error:', error)
    } else {
      console.log('Success! Data:', data)
    }
    
  } catch (error) {
    console.error('Exception:', error)
  }
}

testConnection() 