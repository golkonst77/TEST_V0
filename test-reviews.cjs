// Тест для проверки отзывов в Supabase
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

async function testReviews() {
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
    
    // Проверяем таблицу reviews
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('Error fetching reviews:', error)
    } else {
      console.log(`Found ${reviews.length} reviews in database:`)
      reviews.forEach((review, index) => {
        console.log(`${index + 1}. ${review.name || review.author} (${review.rating}⭐): ${review.text?.substring(0, 50)}...`)
      })
    }
    
  } catch (error) {
    console.error('Exception:', error)
  }
}

testReviews()
