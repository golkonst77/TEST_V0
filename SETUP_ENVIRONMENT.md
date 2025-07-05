# Настройка переменных окружения

## 🔧 Обязательные настройки

### 1. Supabase Configuration
Откройте файл `.env.local` и замените следующие значения:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Где найти эти значения:**
1. Зайдите в [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в Settings → API
4. Скопируйте:
   - **URL**: Project URL
   - **ANON KEY**: anon/public key
   - **SERVICE ROLE KEY**: service_role key

### 2. Дополнительные настройки (опционально)

```bash
# Newsletter Configuration
SENDSAY_API_KEY=your_sendsay_api_key_here
SENDSAY_LOGIN=your_sendsay_login_here

# Yandex Maps API
YANDEX_MAPS_API_KEY=your_yandex_maps_api_key_here

# Other Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 После настройки

1. Сохраните файл `.env.local`
2. Перезапустите сервер разработки:
   ```bash
   npm run dev
   ```

## 📋 Проверка настроек

После настройки переменных окружения выполните:

1. **Создайте таблицу отзывов в Supabase:**
   - Скопируйте содержимое файла `supabase-reviews-setup.sql`
   - Выполните в Supabase SQL Editor

2. **Исправьте проблемы безопасности:**
   - Скопируйте содержимое файла `fix-all-security-issues.sql`
   - Выполните в Supabase SQL Editor

3. **Проверьте API:**
   ```bash
   # Откройте в браузере
   http://localhost:3000/api/reviews
   ```

## ⚠️ Важно

- Никогда не коммитьте файл `.env.local` в Git
- Файл `.env.local` уже добавлен в `.gitignore`
- Используйте только реальные ключи для продакшена

## 🔗 Полезные ссылки

- [Supabase Dashboard](https://app.supabase.com)
- [Документация Supabase](https://supabase.com/docs)
- [Yandex Maps API](https://developer.tech.yandex.ru/services/3)
- [SendSay API](https://sendsay.ru/api/) 