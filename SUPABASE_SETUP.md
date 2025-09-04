# Настройка Supabase для Email Уведомлений

## Проблема
В Supabase 2.x нет встроенного метода `sendRawEmail` для отправки email. Вместо этого нужно использовать Edge Functions или внешние сервисы.

## Решение 1: Edge Function (Рекомендуется)

### Шаг 1: Установка Supabase CLI
```bash
npm install -g supabase
```

### Шаг 2: Логин в Supabase
```bash
supabase login
```

### Шаг 3: Связывание проекта
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Шаг 4: Развертывание Edge Function
```bash
supabase functions deploy send-email
```

### Шаг 5: Настройка переменных окружения в Supabase Dashboard
В настройках Edge Function добавьте:
- `SUPABASE_URL` - URL вашего проекта
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key

## Решение 2: Внешний Email Сервис

### Вариант A: Resend
1. Зарегистрируйтесь на [resend.com](https://resend.com)
2. Получите API ключ
3. Обновите `.env.local`:
```env
RESEND_API_KEY=your_api_key_here
```

### Вариант B: SendGrid
1. Зарегистрируйтесь на [sendgrid.com](https://sendgrid.com)
2. Получите API ключ
3. Обновите `.env.local`:
```env
SENDGRID_API_KEY=your_api_key_here
```

### Вариант C: Mailgun
1. Зарегистрируйтесь на [mailgun.com](https://mailgun.com)
2. Получите API ключ
3. Обновите `.env.local`:
```env
MAILGUN_API_KEY=your_api_key_here
MAILGUN_DOMAIN=your_domain.com
```

## Текущая реализация

### Edge Function
- Файл: `supabase/functions/send-email/index.ts`
- URL: `https://your-project.supabase.co/functions/v1/send-email`
- Функция: Сохраняет уведомления в таблицу `quiz_notifications`

### Fallback
Если Edge Function недоступен, уведомления сохраняются в БД для последующей обработки.

## Тестирование

### 1. Тест подключения
```bash
curl http://localhost:3000/api/test-supabase
```

### 2. Тест Edge Function
```bash
curl -X POST http://localhost:3000/api/test-supabase \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "admin@prostoburo.com"}'
```

### 3. Тест основного API
```bash
curl -X POST http://localhost:3000/api/admin/notify-quiz-completion \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+7 (953) 123-45-67",
    "discount": 2500,
    "businessType": "ip",
    "coupon": "TEST123-2500",
    "answers": [
      {"questionId": 1, "answer": "ip"},
      {"questionId": 2, "answer": "chaos"}
    ]
  }'
```

## Структура БД

### Таблица quiz_notifications
```sql
CREATE TABLE quiz_notifications (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    error_message TEXT
);
```

## Мониторинг

### Логи Edge Function
```bash
supabase functions logs send-email
```

### Просмотр уведомлений в БД
```sql
SELECT * FROM quiz_notifications ORDER BY created_at DESC;
```

## Устранение неполадок

### 1. Edge Function не развертывается
- Проверьте права доступа к проекту
- Убедитесь, что CLI обновлен до последней версии

### 2. Ошибки CORS
- Проверьте настройки CORS в Edge Function
- Убедитесь, что домен добавлен в allowed origins

### 3. Email не отправляется
- Проверьте логи Edge Function
- Убедитесь, что переменные окружения настроены
- Проверьте статус в таблице `quiz_notifications`

## Альтернативы

### 1. Supabase Auth Email Templates
Используйте встроенные шаблоны для auth email:
```typescript
// В настройках Supabase Dashboard
// Authentication > Email Templates
```

### 2. Database Triggers
Создайте триггер для автоматической отправки email при создании записи:
```sql
CREATE OR REPLACE FUNCTION send_email_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Логика отправки email
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Cron Jobs
Настройте периодическую проверку таблицы `quiz_notifications` и отправку email через внешний сервис.

## Заключение
Рекомендуется использовать Edge Function как основное решение, так как это:
- Нативно интегрировано с Supabase
- Легко масштабируется
- Поддерживает TypeScript
- Имеет встроенное логирование и мониторинг
