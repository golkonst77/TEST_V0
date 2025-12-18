# Настройка базы данных Supabase

## Шаги для создания базы данных:

### 1. Откройте Supabase Dashboard
- Перейдите на https://supabase.com/
- Войдите в свой аккаунт
- Выберите ваш проект: **qbjcdftphxredexkwsui**

### 2. Откройте SQL Editor
- В левом меню выберите **SQL Editor**
- Нажмите **New query**

### 3. Выполните SQL скрипт
- Скопируйте весь код из файла `create-supabase-tables.sql`
- Вставьте его в SQL Editor
- Нажмите **Run** (или Ctrl+Enter)

### 4. Проверьте результат
После выполнения скрипта должны быть созданы:

#### Таблицы:
- `newsletter_subscribers` - подписчики рассылки
- `coupons` - промокоды/купоны для маркетинга (например, `WELCOME10`)
- `coupon_usage` - использование купонов
- `quiz_leads` - лиды из квиза (если используется квиз)
- `quiz_coupons` - сгенерированные квизом купоны (отдельно от `coupons`)

#### Функции:
- `create_newsletter_table()` - создание таблицы подписчиков
- `get_newsletter_stats()` - статистика подписчиков
- `get_coupon_stats()` - статистика купонов
- `update_updated_at_column()` - обновление времени изменения

#### Индексы:
- Для быстрого поиска по email, активности, датам

#### Политики безопасности:
- RLS (Row Level Security) для контроля доступа

### 5. Проверьте таблицы
- Перейдите в **Table Editor**
- Убедитесь, что созданы все таблицы
- Проверьте тестовые данные

### 6. Обновите API
После создания базы данных замените содержимое файла `app/api/newsletter/route.ts` на полную версию с подключением к Supabase.

## Тестовые данные

Скрипт автоматически создаст:

### Подписчики:
- test@example.com
- admin@prostoburo.ru

### Купоны:
- WELCOME10 (10% скидка)
- SAVE20 (20% скидка)  
- FIRST30 (30% скидка)

## Таблица quiz_coupons (квиз)

Если используется endpoint `POST /api/quiz-lead`, нужно создать таблицу `quiz_coupons`:

```sql
create table if not exists public.quiz_coupons (
  id uuid default gen_random_uuid() primary key,
  code varchar(255) unique not null,
  email varchar(255) not null,
  phone varchar(255),
  discount_rub integer not null,
  business_type varchar(100),
  site varchar(50),
  lead_id bigint,
  created_at timestamptz default now()
);

create index if not exists idx_quiz_coupons_code on public.quiz_coupons(code);
create index if not exists idx_quiz_coupons_email on public.quiz_coupons(email);
create index if not exists idx_quiz_coupons_created_at on public.quiz_coupons(created_at);
```

## Проверка работы

1. **Подписка на рассылку**: http://localhost:3002/blog
2. **Админ панель подписчиков**: http://localhost:3002/admin/newsletter
3. **Использование купонов**: http://localhost:3002/use-coupon

## Переменные окружения

Убедитесь, что в `.env.local` правильно указаны:
```
NEXT_PUBLIC_SUPABASE_URL=https://qbjcdftphxredexkwsui.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Восстановление полной функциональности

После создания базы данных выполните:
```bash
git checkout app/api/newsletter/route.ts
```

Или замените содержимое файла на версию с Supabase подключением. 