// Тест структуры таблицы reviews
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

async function testTableStructure() {
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

    // Попробуем вставить тестовую запись с разными значениями source
    const testValues = ['yandex-maps', 'yandex', 'manual', 'import', 'test']
    
    for (const sourceValue of testValues) {
      console.log(`\nТестируем source: "${sourceValue}"`)
      
      try {
        const { data, error } = await supabase
          .from('reviews')
          .insert({
            name: 'Тестовый пользователь',
            text: 'Тестовый отзыв',
            rating: 5,
            source: sourceValue,
            is_published: true,
            is_featured: false,
            published_at: new Date().toISOString(),
            admin_notes: 'Тест структуры таблицы'
          })
          .select()

        if (error) {
          console.error(`Ошибка с source "${sourceValue}":`, error.message)
        } else {
          console.log(`✅ Успешно с source "${sourceValue}":`, data)
          
          // Удаляем тестовую запись
          await supabase
            .from('reviews')
            .delete()
            .eq('name', 'Тестовый пользователь')
            .eq('text', 'Тестовый отзыв')
        }
      } catch (e) {
        console.error(`Исключение с source "${sourceValue}":`, e.message)
      }
    }

  } catch (error) {
    console.error('Unhandled error:', error)
  }
}

testTableStructure()
