import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User, LoginCredentials, RegisterCredentials, AuthState } from '../types/auth'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  // Проверка текущей сессии
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Получаем профиль пользователя
          const profile = await getUserProfile(user.email!)
          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    checkUser()

    // Слушаем изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await getUserProfile(session.user.email!)
          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Получение профиля пользователя
  const getUserProfile = async (email: string): Promise<User | null> => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Вход в систему
  const login = async (credentials: LoginCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword(credentials)
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Регистрация
  const register = async (credentials: RegisterCredentials) => {
    try {
      // Создаем пользователя в Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      })
      
      if (authError) throw authError

      // Автоматически входим после регистрации
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })
      
      if (loginError) throw loginError

      // Создаем профиль пользователя
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          name: credentials.name,
          phone: credentials.phone,
          question: credentials.question
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create profile')
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Выход из системы
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Обновление профиля
  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.user?.email,
          ...updates
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      setState(prev => ({
        ...prev,
        user: updatedProfile
      }))

      return { success: true, user: updatedProfile }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile
  }
} 