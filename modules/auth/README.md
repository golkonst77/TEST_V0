# Модуль Аутентификации

Модуль для регистрации, входа и управления личным кабинетом пользователей.

## Структура модуля

```
modules/auth/
├── components/          # React компоненты
│   ├── auth-form.tsx    # Универсальная форма аутентификации
│   ├── login-form.tsx   # Форма входа
│   ├── register-form.tsx # Форма регистрации
│   ├── profile-form.tsx # Форма профиля
│   └── auth-guard.tsx   # Компонент защиты роутов
├── pages/               # Страницы Next.js
│   ├── login/           # Страница входа
│   ├── register/        # Страница регистрации
│   └── profile/         # Страница профиля
├── api/                 # API endpoints
│   ├── auth/            # Аутентификация
│   ├── user/            # Управление пользователями
│   └── verify-recaptcha/ # Проверка reCAPTCHA
├── lib/                 # Утилиты и конфигурация
│   ├── auth.ts          # Функции аутентификации
│   ├── supabase.ts      # Конфигурация Supabase
│   └── types.ts         # TypeScript типы
├── hooks/               # React хуки
│   ├── use-auth.ts      # Хук для работы с аутентификацией
│   └── use-user.ts      # Хук для работы с пользователем
└── middleware.ts        # Middleware для защиты роутов
```

## Установка

1. Скопируйте папку `modules/auth/` в ваш проект
2. Установите зависимости:
```bash
npm install @supabase/supabase-js react-google-recaptcha
```

3. Настройте переменные окружения в `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

4. Импортируйте компоненты в вашем приложении:
```tsx
import { AuthForm } from '@/modules/auth/components/auth-form'
import { AuthGuard } from '@/modules/auth/components/auth-guard'
```

## Использование

### Базовая форма аутентификации
```tsx
import { AuthForm } from '@/modules/auth/components/auth-form'

export default function LoginPage() {
  return (
    <div>
      <h1>Вход в систему</h1>
      <AuthForm mode="login" />
    </div>
  )
}
```

### Защита роутов
```tsx
import { AuthGuard } from '@/modules/auth/components/auth-guard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Защищенный контент</div>
    </AuthGuard>
  )
}
```

### Хук аутентификации
```tsx
import { useAuth } from '@/modules/auth/hooks/use-auth'

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth()

  if (loading) return <div>Загрузка...</div>
  if (!user) return <div>Не авторизован</div>

  return (
    <div>
      <h1>Профиль: {user.email}</h1>
      <button onClick={signOut}>Выйти</button>
    </div>
  )
}
```

## Конфигурация

### Supabase
Модуль использует Supabase для аутентификации. Настройте таблицы в Supabase:

```sql
-- Таблица пользователей (создается автоматически)
-- Таблица профилей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### reCAPTCHA
Для защиты от ботов используется Google reCAPTCHA v2. Настройте в Google reCAPTCHA Admin Console.

## Кастомизация

### Стили
Все компоненты используют Tailwind CSS. Переопределите стили через CSS классы или создайте собственные компоненты.

### Валидация
Формы используют библиотеку `react-hook-form` с `zod` для валидации. Измените схемы валидации в `lib/validation.ts`.

### Роутинг
По умолчанию модуль использует следующие роуты:
- `/login` - страница входа
- `/register` - страница регистрации
- `/profile` - страница профиля

Измените роуты в `pages/` папке или настройте в вашем роутере.

## Безопасность

- Все API endpoints защищены от CSRF атак
- Пароли хешируются на стороне Supabase
- reCAPTCHA защищает от ботов
- Middleware проверяет аутентификацию на сервере
- JWT токены имеют ограниченное время жизни

## Поддержка

Для вопросов и предложений создайте issue в репозитории проекта. 