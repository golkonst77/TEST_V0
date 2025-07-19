# Миграция модуля аутентификации

## Шаги для переноса модуля в новый проект

### 1. Копирование файлов

Скопируйте папку `modules/auth/` в корень вашего нового проекта:

```bash
cp -r modules/auth/ /path/to/new-project/
```

### 2. Установка зависимостей

Добавьте зависимости в `package.json` вашего проекта:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react-google-recaptcha": "^3.1.0"
  },
  "devDependencies": {
    "@types/react-google-recaptcha": "^3.0.0"
  }
}
```

Установите зависимости:

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# reCAPTCHA Configuration (опционально)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### 4. Настройка Supabase

1. Создайте новый проект в [Supabase](https://supabase.com)
2. Выполните SQL скрипт из `modules/auth/database/schema.sql` в SQL Editor
3. Скопируйте URL и Anon Key из настроек проекта

### 5. Интеграция в приложение

#### Оберните приложение в AuthProvider

```tsx
// app/layout.tsx или pages/_app.tsx
import { AuthProvider } from '@/modules/auth'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### Создайте страницы аутентификации

```tsx
// app/login/page.tsx
import { AuthForm } from '@/modules/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Вход в систему</h1>
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
```

```tsx
// app/register/page.tsx
import { AuthForm } from '@/modules/auth'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Регистрация</h1>
        <AuthForm mode="register" />
      </div>
    </div>
  )
}
```

#### Защитите роуты

```tsx
// app/dashboard/page.tsx
import { AuthGuard } from '@/modules/auth'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>
        <h1>Панель управления</h1>
        <p>Защищенный контент</p>
      </div>
    </AuthGuard>
  )
}
```

### 6. Настройка роутинга

Добавьте API роуты в ваш проект:

```bash
# Скопируйте API endpoints
cp -r modules/auth/api/ app/api/auth/
```

### 7. Кастомизация (опционально)

#### Изменение стилей

Все компоненты используют Tailwind CSS. Переопределите стили:

```css
/* app/globals.css */
.recaptcha-placeholder {
  @apply bg-gray-100 border border-gray-300 rounded p-4;
}

.auth-form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md;
}
```

#### Изменение валидации

Отредактируйте функции валидации в `modules/auth/components/auth-form.tsx`

#### Изменение сообщений

Замените тексты в компонентах на ваши собственные

### 8. Тестирование

1. Запустите сервер разработки: `npm run dev`
2. Проверьте страницы `/login` и `/register`
3. Протестируйте регистрацию и вход
4. Проверьте защищенные роуты

### 9. Продакшн настройки

#### Включение reCAPTCHA

1. Получите ключи в [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Обновите переменные окружения
3. Восстановите оригинальный код в `modules/auth/components/recaptcha.tsx`

#### Настройка Supabase

1. Настройте домены в Supabase Auth Settings
2. Включите Email подтверждение (если нужно)
3. Настройте SMTP для отправки писем

### 10. Удаление временных файлов

После успешной миграции удалите:

```bash
rm -rf modules/auth/examples/
rm modules/auth/MIGRATION.md
```

## Возможные проблемы

### Ошибка импорта модулей

Убедитесь, что в `tsconfig.json` настроены пути:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["./modules/*"]
    }
  }
}
```

### Ошибки Supabase

1. Проверьте правильность URL и ключей
2. Убедитесь, что таблица `profiles` создана
3. Проверьте RLS политики

### Ошибки reCAPTCHA

1. Проверьте правильность ключей
2. Убедитесь, что домен добавлен в Google reCAPTCHA Admin Console
3. Проверьте, что используется правильная версия reCAPTCHA (v2)

## Поддержка

При возникновении проблем:

1. Проверьте консоль браузера на ошибки
2. Проверьте логи сервера
3. Убедитесь, что все зависимости установлены
4. Проверьте настройки переменных окружения 