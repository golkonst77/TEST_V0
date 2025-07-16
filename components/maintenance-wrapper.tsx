/**
 * @file: maintenance-wrapper.tsx
 * @description: Компонент-обертка для проверки режима технического обслуживания
 * @dependencies: React, MaintenancePage
 * @created: 2025-01-07
 */

"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MaintenancePage } from "./maintenance-page"

interface MaintenanceWrapperProps {
  children: React.ReactNode
}

export function MaintenanceWrapper({ children }: MaintenanceWrapperProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  // Проверяем, находимся ли мы в админке
  const isAdminRoute = pathname?.startsWith('/admin')

  useEffect(() => {
    // Если мы в админке, не проверяем режим обслуживания
    if (isAdminRoute) {
      setIsMaintenanceMode(false)
      setIsLoading(false)
      return
    }

    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch("/api/maintenance")
        if (response.ok) {
          const data = await response.json()
          setIsMaintenanceMode(data.maintenanceMode || false)
        } else {
          setIsMaintenanceMode(false)
        }
      } catch (error) {
        console.error("Error checking maintenance mode:", error)
        setIsMaintenanceMode(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenanceMode()
  }, [isAdminRoute])

  // Показываем загрузку пока проверяем режим
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Если включен режим обслуживания, показываем страницу обслуживания
  if (isMaintenanceMode) {
    return <MaintenancePage />
  }

  // Иначе показываем обычный контент
  return <>{children}</>
} 