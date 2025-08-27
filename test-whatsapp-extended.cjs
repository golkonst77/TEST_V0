const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWhatsAppExtended() {
  console.log('🧪 Расширенное тестирование WhatsApp API...\n');
  
  const token = 'QlZ00L1DXVAv17SfAoTtarbseCNIKaIo';
  const testPhone = '79106000612';
  
  // Тест 1: Проверка с разными заголовками
  console.log('1️⃣ Тестируем с разными заголовками...');
  try {
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        to: testPhone,
        body: 'Тестовое сообщение от расширенного API',
        preview_url: false
      }),
    });
    
    const result = await response.text();
    console.log('📤 Статус:', response.status);
    console.log('📤 Ответ:', result);
    
    if (response.ok) {
      console.log('✅ Сообщение отправлено успешно!\n');
    } else {
      console.log('❌ Ошибка отправки\n');
    }
  } catch (error) {
    console.log('❌ Ошибка:', error.message, '\n');
  }
  
  // Тест 2: Проверка информации о каналах
  console.log('2️⃣ Проверяем информацию о каналах...');
  try {
    const response = await fetch('https://gate.whapi.cloud/channels', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });
    
    const result = await response.text();
    console.log('📊 Статус:', response.status);
    console.log('📊 Ответ:', result);
    
    if (response.ok) {
      console.log('✅ Каналы получены!\n');
    } else {
      console.log('❌ Не удалось получить каналы\n');
    }
  } catch (error) {
    console.log('❌ Ошибка:', error.message, '\n');
  }
  
  // Тест 3: Проверка информации об аккаунте
  console.log('3️⃣ Проверяем информацию об аккаунте...');
  try {
    const response = await fetch('https://gate.whapi.cloud/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });
    
    const result = await response.text();
    console.log('👤 Статус:', response.status);
    console.log('👤 Ответ:', result);
    
    if (response.ok) {
      console.log('✅ Информация об аккаунте получена!\n');
    } else {
      console.log('❌ Не удалось получить информацию об аккаунте\n');
    }
  } catch (error) {
    console.log('❌ Ошибка:', error.message, '\n');
  }
  
  // Тест 4: Проверка с другим форматом номера
  console.log('4️⃣ Тестируем с другим форматом номера...');
  try {
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: `+${testPhone}`,
        body: 'Тестовое сообщение с + в номере',
      }),
    });
    
    const result = await response.text();
    console.log('📤 Статус:', response.status);
    console.log('📤 Ответ:', result);
    
    if (response.ok) {
      console.log('✅ Сообщение отправлено успешно!\n');
    } else {
      console.log('❌ Ошибка отправки\n');
    }
  } catch (error) {
    console.log('❌ Ошибка:', error.message, '\n');
  }
  
  console.log('🏁 Расширенное тестирование завершено!');
}

testWhatsAppExtended().catch(console.error);
