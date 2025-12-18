# Настройка Email

Текущая реализация отправки писем находится в `lib/email-service.ts`.

## Провайдеры (приоритет)

1. **Resend API** (основной)
2. **Yandex SMTP** (fallback)

Также поддерживаются **вложения** (например, PDF чек-лист для клиента в квизе).

## Переменные окружения

### Вариант A: Resend (рекомендуется)

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Вариант B: Yandex SMTP (fallback)

```env
YANDEX_EMAIL=your-email@yandex.ru
YANDEX_PASSWORD=your-app-password
```

## Использование в квизе

Endpoint: `POST /api/quiz-lead`

Отправляет 2 письма:
- **клиенту**: купон + (опционально) PDF чек-лист во вложении
- **админу**: подробный отчёт + купон

## Тестирование

1. Запусти dev сервер
```bash
npm run dev
```

2. Прогони квиз на сайте, либо отправь запрос на `POST /api/quiz-lead`.
