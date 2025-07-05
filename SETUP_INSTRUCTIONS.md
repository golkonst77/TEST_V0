# 🚀 Настройка системы отзывов

## ❗ ПРОБЛЕМА: "Не удалось загрузить отзывы, показаны примеры"

### 🔧 Решение:

1. **Откройте файл `.env.local`** в корне проекта
2. **Замените заглушки на реальные данные:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key_here
```

### 📍 Где взять данные Supabase:

1. Зайдите в [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings → API**
4. Скопируйте:
   - **URL**: Project URL
   - **ANON KEY**: anon/public key  
   - **SERVICE ROLE KEY**: service_role key

### 🗄️ Создание таблицы отзывов:

1. Откройте файл `supabase-reviews-setup.sql`
2. Скопируйте весь код
3. Вставьте в **Supabase SQL Editor** и выполните

### 🔐 Исправление безопасности:

1. Откройте файл `fix-all-security-issues.sql`
2. Скопируйте весь код
3. Вставьте в **Supabase SQL Editor** и выполните

### ✅ Проверка:

После настройки откройте: `http://localhost:3000/api/test-connection`

Если видите `"success": true` - всё работает! 🎉

### 🔄 Перезапуск сервера:

```bash
# Остановите сервер (Ctrl+C)
# Запустите заново:
npm run dev
```

---

## 📁 Важные файлы:

- `.env.local` - настройки подключения
- `supabase-reviews-setup.sql` - создание таблицы
- `fix-all-security-issues.sql` - исправление безопасности
- `components/reviews.tsx` - компонент отзывов
- `app/api/reviews/route.ts` - API отзывов

## 🆘 Если проблемы:

1. Проверьте правильность URL и ключей
2. Убедитесь, что таблица `reviews` создана
3. Проверьте консоль браузера на ошибки
4. Откройте `/api/test-connection` для диагностики 