"use client"

import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Settings, Calculator, DollarSign } from "lucide-react"
import Link from "next/link"

export function AdminQuickAccess() {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg space-y-2">
        <h3 className="text-sm font-medium">Быстрый доступ</h3>
        <div className="flex space-x-2">
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin">
              <Settings className="h-4 w-4 mr-1" />
              Админка
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/calculator">
              <Calculator className="h-4 w-4 mr-1" />
              Калькулятор
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/pricing">
              <DollarSign className="h-4 w-4 mr-1" />
              Тарифы
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
