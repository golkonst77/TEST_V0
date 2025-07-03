// Тест реального API ключа Sendsay
const fs = require('fs');
require('isomorphic-fetch');
const Sendsay = require('sendsay-api');

// Функция для загрузки переменных из .env.local
function loadEnvLocal() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки .env.local:', error.message);
  }
}

async function testRealSendsayAPI() {
  console.log('🧪 Тестирование реального Sendsay API...\n');
  
  try {
    // Загружаем переменные окружения
    loadEnvLocal();
    
    const apiKey = process.env.SENDSAY_API_KEY;
    
    if (!apiKey) {
      console.log('❌ API ключ не найден в .env.local');
      console.log('💡 Проверьте содержимое файла .env.local');
      return;
    }
    
    console.log('🔑 API ключ найден:', apiKey.substring(0, 15) + '...');
    
    // Инициализируем Sendsay
    const sendsay = new Sendsay({ apiKey });
    
    // Проверяем соединение
    console.log('📡 Проверка соединения с Sendsay...');
    
    const response = await sendsay.request({
      action: 'sys.settings.get',
      list: ['about.id', 'about.name', 'about.owner.email']
    });
    
    console.log('✅ Соединение установлено!');
    console.log('📊 Информация об аккаунте:');
    console.log(`   ID: ${response.list['about.id']}`);
    console.log(`   Название: ${response.list['about.name'] || 'Не указано'}`);
    console.log(`   Email: ${response.list['about.owner.email']}`);
    
    // Проверяем возможность добавления подписчика
    console.log('\n👤 Тестирование добавления подписчика...');
    
    const addResponse = await sendsay.request({
      action: 'member.set',
      email: 'test@prostoburo.example',
      return_fresh: 1
    });
    
    console.log('✅ Тестовый подписчик добавлен');
    
    console.log('\n🎉 Все тесты прошли успешно!');
    console.log('\n💡 Теперь система работает с реальным Sendsay API!');
    console.log('📍 Перейдите в админ панель и проверьте статус интеграции');
    console.log('🌐 Админ панель: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.log('\n💡 Ошибка авторизации:');
      console.log('- Проверьте правильность API ключа');
      console.log('- Убедитесь что API пользователь активен в Sendsay');
      console.log('- Проверьте права API пользователя');
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      console.log('\n💡 Недостаточно прав для выполнения операции');
      console.log('- Проверьте права API пользователя в Sendsay');
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      console.log('\n💡 Проблемы с сетью:');
      console.log('- Проверьте подключение к интернету');
      console.log('- Возможно, Sendsay API временно недоступен');
    }
    
    console.log('\n🔧 Что делать:');
    console.log('1. Проверьте API ключ в личном кабинете Sendsay');
    console.log('2. Убедитесь что API пользователь активен');
    console.log('3. Проверьте права API пользователя');
    console.log('4. Попробуйте позже, если проблемы с сетью');
  }
}

// Запускаем тест
testRealSendsayAPI(); 