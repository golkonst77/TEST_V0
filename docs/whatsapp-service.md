# WhatsApp Service Documentation

## Обзор сервиса

**Сервис**: `whapi.cloud`  
**Тип**: WhatsApp Business API  
**Статус**: Активен и оплачен  
**Дата настройки**: 2024-12-19  
**Тариф**: 600 ₽/мес  
**Оплачен до**: 27 сентября 2025

## Конфигурация

### API Endpoints
- **Текстовые сообщения**: `https://gate.whapi.cloud/messages/text`
- **Документы**: `https://gate.whapi.cloud/messages/document`
- **Статус API**: `https://gate.whapi.cloud/status`
- **Баланс**: `https://gate.whapi.cloud/balance`

### Авторизация
```
Authorization: Bearer K9edm63ZcOVma3QQQZy4vQM7JQOSI1RF
Content-Type: application/json
```

### Номер отправителя
- **WhatsApp Business**: 79533301777
- **Страна**: Россия
- **Статус**: Подтвержден и активен

## Текущий статус

### ✅ Работает
- Отправка текстовых сообщений
- Авторизация API
- Подключение к WhatsApp Business

### ✅ Работает
- Отправка текстовых сообщений
- Отправка файлов (PDF документов)
- Авторизация API
- Подключение к WhatsApp Business

## Использование в проекте

### Компонент квиза
Файл: `components/quiz-modal.tsx`

**Функция отправки текста:**
```typescript
async function sendWhatsAppMessage(phone: string, message: string) {
  const response = await fetch('https://gate.whapi.cloud/messages/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer K9edm63ZcOVma3QQQZy4vQM7JQOSI1RF',
    },
    body: JSON.stringify({
      to: cleanPhone,
      body: message,
    }),
  });
}
```

**Функция отправки файлов:**
```typescript
async function sendWhatsAppDocument(phone: string, quiz_result: string, caption: string) {
  // Использует внутренний API endpoint
  const response = await fetch('/api/send-whatsapp-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: cleanPhone,
      filePath: checklist.file_url,
      caption: caption,
    }),
  });
}
```

### API Endpoints проекта
- `/api/send-whatsapp-document` - отправка документов
- `/api/get-checklist` - получение чек-листов

## Fallback механизм

При ошибке отправки через API автоматически открывается ссылка:
```
https://wa.me/{номер}?text={сообщение}
```

## Тестирование

### Тестовый скрипт
Файл: `test-whatsapp.cjs`

Запуск:
```bash
node test-whatsapp.cjs
```

### Тестовый номер
- **Номер**: 79106000612
- **Назначение**: Тестирование API

## Проблемы и решения

### Проблема: Файлы не отправляются
**Статус**: Не решена  
**Причина**: Требуется диагностика endpoint `/api/send-whatsapp-document`  
**Решение**: Проверить логи API и формат запроса

### Проблема: Channel not found (решена)
**Статус**: Решена  
**Причина**: Канал WhatsApp не был настроен  
**Решение**: Активирован канал в панели управления whapi.cloud

## Мониторинг

### Логи
- Консоль браузера: `[WHATSAPP]` теги
- Файл: `whapi-debug.log` (если настроен)

### Метрики
- Отправка событий в Яндекс.Метрику при завершении квиза
- Отслеживание успешности отправки сообщений

## Контакты поддержки

**Сервис**: whapi.cloud  
**Документация**: https://whapi.cloud/docs  
**Поддержка**: Через панель управления whapi.cloud

## Важные заметки

1. **Токен безопасности**: Не публиковать в открытых репозиториях
2. **Тариф сервиса**: 600 ₽/мес - ежемесячная оплата за использование WhatsApp Business API
3. **Лимиты**: Проверять баланс через API
4. **Формат номеров**: Всегда использовать международный формат (7XXXXXXXXXX)
5. **Fallback**: Всегда иметь резервный механизм отправки

## Обновления

### 2024-12-19
- Настроен и активирован WhatsApp Business канал
- Обновлен токен API
- Добавлена обработка ошибок
- Реализован fallback механизм
