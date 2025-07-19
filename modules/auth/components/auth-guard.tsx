/**
 * @file: auth-guard.tsx
 * @description: Компонент для защиты роутов
 * @dependencies: use-auth.ts
 * @created: 2024-12-19
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  redirectTo = '/login',
  fallback = <div>Загрузка...</div>
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  if (loading) {
    return <>{fallback}</>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
} 