const fetch = require('node-fetch');

async function testWhatsAppAPI() {
  console.log('🧪 Тестируем WhatsApp API...\n');
  
  // Тест 1: Проверка текстового сообщения
  console.log('1️⃣ Тестируем отправку текстового сообщения...');
  try {
    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer QlZ00L1DXVAv17SfAoTtarbseCNIKaIo',
      },
      body: JSON.stringify({
        to: '79106000612', // Тестовый номер
        body: 'Тестовое сообщение от API',
      }),
    });
    
    const result = await response.text();
    console.log('📤 Статус:', response.status);
    console.log('📤 Ответ:', result);
    
    if (response.ok) {
      console.log('✅ Текстовое сообщение отправлено успешно!\n');
    } else {
      console.log('❌ Ошибка отправки текстового сообщения\n');
    }
  } catch (error) {
    console.log('❌ Ошибка при отправке текстового сообщения:', error.message, '\n');
  }
  
  // Тест 2: Проверка статуса API
  console.log('2️⃣ Проверяем статус API...');
  try {
    const response = await fetch('https://gate.whapi.cloud/status', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer QlZ00L1DXVAv17SfAoTtarbseCNIKaIo',
      },
    });
    
    const result = await response.text();
    console.log('📊 Статус:', response.status);
    console.log('📊 Ответ:', result);
    
    if (response.ok) {
      console.log('✅ API доступен!\n');
    } else {
      console.log('❌ API недоступен\n');
    }
  } catch (error) {
    console.log('❌ Ошибка при проверке статуса API:', error.message, '\n');
  }
  
  // Тест 3: Проверка баланса
  console.log('3️⃣ Проверяем баланс...');
  try {
    const response = await fetch('https://gate.whapi.cloud/balance', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer QlZ00L1DXVAv17SfAoTtarbseCNIKaIo',
      },
    });
    
    const result = await response.text();
    console.log('💰 Статус:', response.status);
    console.log('💰 Ответ:', result);
    
    if (response.ok) {
      console.log('✅ Баланс получен!\n');
    } else {
      console.log('❌ Не удалось получить баланс\n');
    }
  } catch (error) {
    console.log('❌ Ошибка при получении баланса:', error.message, '\n');
  }
  
  console.log('🏁 Тестирование завершено!');
}

testWhatsAppAPI().catch(console.error);
