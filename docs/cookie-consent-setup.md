# Cookie Consent Banner - Инструкция по настройке

## Описание

Полнофункциональный компонент cookie consent banner для соответствия ФЗ-152 и требованиям Роскомнадзора.

## Компоненты

### 1. React компонент
- **Файл**: `components/cookie-consent.tsx`
- **Функциональность**: Баннер согласия + модальное окно настроек
- **Хранение**: localStorage + cookie + БД

### 2. API endpoint
- **Файл**: `app/api/cookie-consent/route.ts`
- **URL**: `POST /api/cookie-consent`
- **Функция**: Сохранение согласий в БД с IP и User-Agent

### 3. БД миграция
- **Файл**: `supabase/migrations/cookie_consents.sql`
- **Таблица**: `cookie_consents`
- **RLS**: Включен (только администраторы читают, сервис пишет)

## Установка

### Шаг 1: Применить миграцию БД

Выполните SQL из файла `supabase/migrations/cookie_consents.sql` в Supabase Dashboard:

```bash
# Или через CLI
supabase db push
```

### Шаг 2: Проверить переменные окружения

В `.env.local` должны быть:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_YANDEX_METRIKA_ID=your_metrika_id
```

### Шаг 3: Компонент уже интегрирован

Cookie consent уже добавлен в `app/layout.tsx`:

```tsx
<CookieConsent ymId={ymId} />
```

## Как работает

1. **Первый визит**: Баннер появляется внизу страницы
2. **Выбор пользователя**:
   - "Согласен" - принять все
   - "Настройки" - детальная настройка
   - "Отклонить" - отклонить необязательные
3. **Сохранение**: 
   - Локально в localStorage
   - Cookie `cookie_consent_accepted`
   - Отправка на сервер для записи в БД
4. **Загрузка метрики**: Яндекс.Метрика загружается ТОЛЬКО если пользователь согласился на аналитику

## Типы cookies

| Тип | Обязателен | Описание |
|-----|-----------|----------|
| Essential | ✅ Да | Безопасность, аутентификация, функциональность |
| Analytics | ❌ Нет | Яндекс.Метрика, веб-аналитика |
| Marketing | ❌ Нет | Персонализированные предложения |

## Соответствие законодательству

- ✅ ФЗ-152 "О персональных данных"
- ✅ Требования Роскомнадзора
- ✅ Явное согласие перед обработкой
- ✅ Возможность отзыва согласия (email: urist40@gmail.com)
- ✅ Хранение истории согласий
- ✅ Timestamp и версия политики

## Тестирование

### Локальное тестирование

1. Откройте сайт в режиме инкогнито
2. Должен появиться баннер внизу
3. Попробуйте все 3 кнопки
4. Откройте DevTools → Application → Local Storage → Проверьте `cookie_consent`
5. Проверьте консоль - должны быть логи о загрузке/отключении метрики

### Удалить согласие для повторного теста

```javascript
// В консоли браузера
localStorage.removeItem('cookie_consent')
document.cookie = 'cookie_consent_accepted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
location.reload()
```

## Мониторинг

### Просмотр согласий в БД

```sql
-- В Supabase SQL Editor
SELECT 
  id,
  ip_address,
  analytics,
  marketing,
  consent_timestamp,
  created_at
FROM cookie_consents
ORDER BY created_at DESC
LIMIT 100;
```

### Статистика согласий

```sql
SELECT 
  analytics,
  marketing,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM cookie_consents
GROUP BY analytics, marketing
ORDER BY count DESC;
```

## Контакты для отзыва согласия

**Email**: urist40@gmail.com

Пользователи могут отозвать согласие, отправив письмо на этот адрес.

## Дата внедрения

**28 ноября 2025 г.**

**Версия**: 1.0.18





