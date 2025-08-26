// Тест для проверки таблицы video_reviews в Supabase
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

async function testVideoReviews() {
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

    // Проверяем таблицу video_reviews
    const { data: reviews, error } = await supabase
      .from('video_reviews')
      .select('*')
      .limit(5)

    if (error) {
      console.error('Error fetching video_reviews:', error)
      
      // Если таблица не существует, попробуем создать её
      console.log('Attempting to create video_reviews table...')
      
      const { error: createError } = await supabase.rpc('create_video_reviews_table')
      
      if (createError) {
        console.error('Error creating table:', createError)
      } else {
        console.log('Table created successfully')
      }
    } else {
      console.log(`Found ${reviews.length} video reviews:`, reviews)
    }
  } catch (error) {
    console.error('Unhandled error during video_reviews test:', error)
  }
}

testVideoReviews()
