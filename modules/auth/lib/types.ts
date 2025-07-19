/**
 * @file: types.ts
 * @description: TypeScript типы для модуля аутентификации
 * @created: 2024-12-19
 */

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  question?: string
  created_at: string
  updated_at: string
}

export interface AuthFormData {
  email: string
  password: string
  full_name?: string
  phone?: string
  question?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  phone: string
  question?: string
}

export interface ProfileFormData {
  full_name: string
  phone: string
  question?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  message?: string
}

export interface ReCAPTCHAResponse {
  success: boolean
  score?: number
  isHuman: boolean
  error?: string
}

export type AuthMode = 'login' | 'register' | 'profile'

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (data: RegisterFormData) => Promise<AuthResponse>
  signOut: () => Promise<void>
  updateProfile: (data: ProfileFormData) => Promise<AuthResponse>
} 