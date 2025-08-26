// Скрипт для создания таблицы video_reviews в Supabase
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function createVideoReviewsTable() {
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

    // Читаем SQL файл
    const sqlContent = fs.readFileSync('create-video-reviews-table.sql', 'utf8')
    
    console.log('Executing SQL to create video_reviews table...')
    
    // Выполняем SQL через rpc (если доступно) или через прямой запрос
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.error('Error executing SQL:', error)
      console.log('You may need to execute the SQL manually in Supabase dashboard')
      console.log('SQL content:')
      console.log(sqlContent)
    } else {
      console.log('Table created successfully:', data)
    }

    // Проверяем, что таблица создалась
    const { data: testData, error: testError } = await supabase
      .from('video_reviews')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('Error testing table:', testError)
    } else {
      console.log('Table test successful:', testData)
    }

  } catch (error) {
    console.error('Unhandled error:', error)
  }
}

createVideoReviewsTable()
