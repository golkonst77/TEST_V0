/**
 * @file: auth.ts
 * @description: Функции аутентификации
 * @dependencies: supabase.ts
 * @created: 2024-12-19
 */

import { supabase } from './supabase'
import type { User, AuthResponse, RegisterFormData, ProfileFormData } from './types'

/**
 * Вход в систему
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Пользователь не найден'
      }
    }

    // Получаем профиль пользователя
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return {
      success: true,
      user: profile || {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at!
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Ошибка входа в систему'
    }
  }
}

/**
 * Регистрация нового пользователя
 */
export async function signUp(data: RegisterFormData): Promise<AuthResponse> {
  try {
    // Создаем пользователя в Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })

    if (authError) {
      return {
        success: false,
        error: authError.message
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Ошибка создания пользователя'
      }
    }

    // Создаем профиль пользователя
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        question: data.question
      })

    if (profileError) {
      return {
        success: false,
        error: 'Ошибка создания профиля'
      }
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        question: data.question,
        created_at: authData.user.created_at,
        updated_at: authData.user.updated_at!
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Ошибка регистрации'
    }
  }
}

/**
 * Выход из системы
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

/**
 * Получение текущего пользователя
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile || {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
      updated_at: user.updated_at!
    }
  } catch (error) {
    return null
  }
}

/**
 * Обновление профиля пользователя
 */
export async function updateProfile(data: ProfileFormData): Promise<AuthResponse> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return {
        success: false,
        error: 'Пользователь не авторизован'
      }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        phone: data.phone,
        question: data.question,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: 'Ошибка обновления профиля'
      }
    }

    return {
      success: true,
      user: profile
    }
  } catch (error) {
    return {
      success: false,
      error: 'Ошибка обновления профиля'
    }
  }
}

/**
 * Проверка аутентификации
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
} 