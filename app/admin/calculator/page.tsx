"use client"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export default function AdminCalculatorPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div>
      <h1>Admin Calculator Page</h1>
      {/* Add calculator components here */}
    </div>
  )
}
