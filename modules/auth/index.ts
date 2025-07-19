/**
 * @file: index.ts
 * @description: Главный экспорт модуля аутентификации
 * @created: 2024-12-19
 */

// Компоненты
export { AuthForm } from './components/auth-form'
export { AuthGuard } from './components/auth-guard'
export { ReCAPTCHAComponent } from './components/recaptcha'

// Хуки
export { useAuth, AuthProvider } from './hooks/use-auth'

// Функции
export { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  updateProfile, 
  isAuthenticated 
} from './lib/auth'

// Типы
export type {
  User,
  AuthFormData,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
  AuthResponse,
  ReCAPTCHAResponse,
  AuthMode,
  AuthContextType
} from './lib/types'

// Конфигурация
export { supabase } from './lib/supabase'
export type { Database } from './lib/supabase' 