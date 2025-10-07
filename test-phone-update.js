const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Проверяем подключение к Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Set' : 'Not set')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Переменные окружения не настроены')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testPhoneUpdate() {
  try {
    console.log('\n📱 Проверяем текущий номер телефона в базе...')
    
    // Получаем текущие настройки
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error) {
      console.error('❌ Ошибка получения данных:', error)
      return
    }
    
    console.log('📞 Текущий номер в базе:', data.phone)
    
    // Обновляем номер телефона
    const newPhone = '+7930 759 00 77'
    console.log(`\n🔄 Обновляем номер на: ${newPhone}`)
    
    const { data: updateData, error: updateError } = await supabase
      .from('settings')
      .update({ phone: newPhone })
      .eq('id', 1)
      .select()
    
    if (updateError) {
      console.error('❌ Ошибка обновления:', updateError)
      return
    }
    
    console.log('✅ Номер успешно обновлен!')
    console.log('📞 Новый номер в базе:', updateData[0].phone)
    
    // Проверяем еще раз
    const { data: verifyData, error: verifyError } = await supabase
      .from('settings')
      .select('phone')
      .eq('id', 1)
      .single()
    
    if (verifyError) {
      console.error('❌ Ошибка проверки:', verifyError)
      return
    }
    
    console.log('🔍 Проверка: номер в базе =', verifyData.phone)
    
  } catch (error) {
    console.error('❌ Общая ошибка:', error)
  }
}

testPhoneUpdate()
