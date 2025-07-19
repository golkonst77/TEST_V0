/**
 * @file: basic-usage.tsx
 * @description: Пример использования модуля аутентификации
 * @created: 2024-12-19
 */

'use client'

import { AuthProvider, useAuth, AuthForm, AuthGuard } from '../index'

// Компонент приложения с провайдером аутентификации
export function AppWithAuth({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

// Компонент навигации с кнопками входа/выхода
export function Navigation() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-xl font-bold">Мое приложение</div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span>Привет, {user.full_name || user.email}!</span>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Выйти
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <a
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Войти
            </a>
            <a
              href="/register"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Регистрация
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

// Страница входа
export function LoginPage() {
  const { signIn } = useAuth()

  const handleSuccess = () => {
    // Перенаправление после успешного входа
    window.location.href = '/dashboard'
  }

  const handleError = (error: string) => {
    console.error('Ошибка входа:', error)
    // Показать уведомление об ошибке
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в систему
          </h2>
        </div>
        <AuthForm
          mode="login"
          onSuccess={handleSuccess}
          onError={handleError}
          className="mt-8 space-y-6"
        />
      </div>
    </div>
  )
}

// Страница регистрации
export function RegisterPage() {
  const { signUp } = useAuth()

  const handleSuccess = () => {
    // Перенаправление после успешной регистрации
    window.location.href = '/dashboard'
  }

  const handleError = (error: string) => {
    console.error('Ошибка регистрации:', error)
    // Показать уведомление об ошибке
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Регистрация
          </h2>
        </div>
        <AuthForm
          mode="register"
          onSuccess={handleSuccess}
          onError={handleError}
          className="mt-8 space-y-6"
        />
      </div>
    </div>
  )
}

// Защищенная страница
export function ProtectedPage() {
  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Защищенная страница</h1>
        <p>Эта страница доступна только авторизованным пользователям.</p>
      </div>
    </AuthGuard>
  )
}

// Профиль пользователя
export function ProfilePage() {
  const { user, updateProfile } = useAuth()

  const handleUpdateProfile = async (data: any) => {
    const response = await updateProfile(data)
    if (response.success) {
      alert('Профиль обновлен!')
    } else {
      alert('Ошибка обновления профиля: ' + response.error)
    }
  }

  if (!user) {
    return <div>Не авторизован</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>
      <div className="space-y-4">
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Имя:</strong> {user.full_name || 'Не указано'}
        </div>
        <div>
          <strong>Телефон:</strong> {user.phone || 'Не указан'}
        </div>
        <div>
          <strong>Вопрос:</strong> {user.question || 'Не указан'}
        </div>
      </div>
    </div>
  )
} 