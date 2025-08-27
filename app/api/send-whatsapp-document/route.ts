import { NextRequest } from 'next/server';
import { appendFileSync } from 'fs';
import { join } from 'path';

// Функция для записи логов в файл
function writeLog(message: string) {
  const logPath = join(process.cwd(), 'whapi-debug.log');
  const timestamp = new Date().toISOString();
  appendFileSync(logPath, `[${timestamp}] ${message}\n`);
  console.log(message);
}

export async function POST(request: NextRequest) {
  try {
    const { phone, filePath, caption } = await request.json();
    
    writeLog(`[WHAPI] Начинаем отправку для номера: ${phone}`);
    writeLog(`[WHAPI] URL файла: ${filePath}`);
    
    // Приводим номер к формату 79XXXXXXXXX
    const cleanPhone = phone.replace(/\D/g, '').replace(/^8/, '7');
    if (cleanPhone.length !== 11) {
      writeLog(`[WHAPI] Неверный формат номера: ${phone}`);
      return new Response(JSON.stringify({ error: 'Неверный формат номера' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Проверяем доступность файла
    try {
      const fileCheck = await fetch(filePath, { method: 'HEAD' });
      if (!fileCheck.ok) {
        writeLog(`[WHAPI] Файл недоступен: ${filePath}, статус: ${fileCheck.status}`);
        return new Response(JSON.stringify({ error: 'Файл недоступен' }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      writeLog(`[WHAPI] Файл доступен, статус: ${fileCheck.status}`);
    } catch (error) {
      writeLog(`[WHAPI] Ошибка проверки файла: ${error}`);
      return new Response(JSON.stringify({ error: 'Файл недоступен' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Отправляем запрос в WHAPI
    writeLog(`[WHAPI] Отправляем запрос в WHAPI для номера: ${cleanPhone}`);
    
    const payload = {
      to: cleanPhone,
      media: filePath,
      caption: caption || ''
    };
    writeLog(`[WHAPI] Payload: ${JSON.stringify(payload)}`);

    // Используем правильный URL согласно документации
    const requestBody = JSON.stringify(payload);
    writeLog(`[WHAPI] Request body: ${requestBody}`);
    
    const whapiResponse = await fetch('https://gate.whapi.cloud/messages/document', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer K9edm63ZcOVma3QQQZy4vQM7JQOSI1RF',
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    // Получаем текст ответа для анализа
    const responseText = await whapiResponse.text();
    writeLog(`[WHAPI] Ответ от сервера: ${responseText}`);
    writeLog(`[WHAPI] Статус: ${whapiResponse.status}`);

    if (!whapiResponse.ok) {
      writeLog(`[WHAPI] Ошибка отправки: ${whapiResponse.status} ${responseText}`);
      return new Response(JSON.stringify({ error: 'Ошибка отправки в WhatsApp', status: whapiResponse.status, responseText, payload }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const result = JSON.parse(responseText);
      writeLog(`[WHAPI] Успешно отправлено: ${JSON.stringify(result)}`);
      return new Response(JSON.stringify(result), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      writeLog(`[WHAPI] Ошибка парсинга ответа: ${error} ${responseText}`);
      return new Response(JSON.stringify({ error: 'Ошибка обработки ответа сервера', responseText }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    writeLog(`[WHAPI] Необработанная ошибка: ${error}`);
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервера' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 