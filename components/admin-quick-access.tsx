"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Calculator, DollarSign } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function AdminQuickAccess() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const isValid = payload.exp * 1000 > Date.now()
        setIsAuthenticated(isValid)
      } catch {
        setIsAuthenticated(false)
      }
    }
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <Card className="mt-8 bg-blue-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Панель администратора</h3>
            <p className="text-blue-700 text-sm">Быстрый доступ к управлению сайтом</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Админка
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/calculator">
                <Calculator className="h-4 w-4 mr-2" />
                Калькулятор
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/pricing">
                <DollarSign className="h-4 w-4 mr-2" />
                Тарифы
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
