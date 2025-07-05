// Простой тест подключения к Supabase
const { createClient } = require('@supabase/supabase-js');

// Читаем переменные окружения
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Проверка переменных окружения:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'НЕ УСТАНОВЛЕНА');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'УСТАНОВЛЕНА' : 'НЕ УСТАНОВЛЕНА');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || 
    supabaseUrl === 'your_supabase_url_here' || 
    supabaseKey === 'your_service_role_key_here') {
  console.log('❌ ОШИБКА: Переменные окружения не настроены!');
  console.log('📝 Настройте файл .env.local с реальными данными из Supabase Dashboard');
  process.exit(1);
}

console.log('✅ Переменные окружения настроены');

// Создаем клиент Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔗 Тестирование подключения к Supabase...');
    
    // Проверяем подключение
    const { data, error } = await supabase
      .from('reviews')
      .select('id', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('❌ Ошибка подключения к базе данных:', error.message);
      return;
    }
    
    console.log('✅ Подключение к базе данных успешно!');
    
    // Получаем отзывы
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .limit(3);
    
    if (reviewsError) {
      console.log('❌ Ошибка получения отзывов:', reviewsError.message);
      return;
    }
    
    console.log(`✅ Найдено ${reviews.length} опубликованных отзывов`);
    
    if (reviews.length > 0) {
      console.log('\n📋 Примеры отзывов:');
      reviews.forEach((review, index) => {
        console.log(`${index + 1}. ${review.name} (${review.rating}⭐): ${review.text.substring(0, 50)}...`);
      });
    }
    
    console.log('\n🎉 Система отзывов работает корректно!');
    
  } catch (error) {
    console.log('❌ Неожиданная ошибка:', error.message);
  }
}

testConnection(); 