/**
 * @file: use-auth.ts
 * @description: React хук для работы с аутентификацией
 * @dependencies: auth.ts, types.ts
 * @created: 2024-12-19
 */

'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { signIn, signUp, signOut, getCurrentUser, updateProfile } from '../lib/auth'
import type { User, AuthResponse, RegisterFormData, ProfileFormData, AuthContextType } from '../lib/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем текущего пользователя при загрузке
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await signIn(email, password)
    if (response.success && response.user) {
      setUser(response.user)
    }
    return response
  }

  const handleSignUp = async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await signUp(data)
    if (response.success && response.user) {
      setUser(response.user)
    }
    return response
  }

  const handleSignOut = async (): Promise<void> => {
    await signOut()
    setUser(null)
  }

  const handleUpdateProfile = async (data: ProfileFormData): Promise<AuthResponse> => {
    const response = await updateProfile(data)
    if (response.success && response.user) {
      setUser(response.user)
    }
    return response
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 