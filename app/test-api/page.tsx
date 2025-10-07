"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (endpoint: string, method: string = "GET") => {
    setLoading(true)
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      const contentType = response.headers.get("content-type")
      let data
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      setTestResults({
        endpoint,
        method,
        status: response.status,
        statusText: response.statusText,
        contentType,
        data,
        success: response.ok
      })
    } catch (error) {
      setTestResults({
        endpoint,
        method,
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
        success: false
      })
    } finally {
      setLoading(false)
    }
  }

  const testSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteName: "Тестовое название",
          siteDescription: "Тестовое описание",
          phone: "+7 (999) 123-45-67",
          email: "test@example.com",
          maintenanceMode: false,
          analyticsEnabled: true
        }),
      })

      const contentType = response.headers.get("content-type")
      let data
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      setTestResults({
        endpoint: "/api/admin/settings",
        method: "PUT",
        status: response.status,
        statusText: response.statusText,
        contentType,
        data,
        success: response.ok
      })
    } catch (error) {
      setTestResults({
        endpoint: "/api/admin/settings",
        method: "PUT",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
        success: false
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Тестирование API</h1>
      
      <div className="grid gap-4 mb-6">
        <Button 
          onClick={() => testEndpoint("/api/admin/settings", "GET")}
          disabled={loading}
        >
          Тест GET /api/admin/settings
        </Button>
        
        <Button 
          onClick={testSettings}
          disabled={loading}
        >
          Тест PUT /api/admin/settings (с данными)
        </Button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p>Тестирование...</p>
        </div>
      )}

      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className={testResults.success ? "text-green-600" : "text-red-600"}>
              {testResults.success ? "✅ Успешно" : "❌ Ошибка"}
            </CardTitle>
            <CardDescription>
              {testResults.method} {testResults.endpoint}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Статус:</strong> {testResults.status} {testResults.statusText}</p>
              {testResults.contentType && (
                <p><strong>Content-Type:</strong> {testResults.contentType}</p>
              )}
              {testResults.error ? (
                <p><strong>Ошибка:</strong> {testResults.error}</p>
              ) : (
                <div>
                  <p><strong>Ответ:</strong></p>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}