"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AdminPolicyPage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/admin/policy")
      .then(res => res.json())
      .then(data => setText(data.text || ""))
      .catch(() => setMessage("Ошибка загрузки политики"))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })
      if (res.ok) setMessage("Политика сохранена")
      else setMessage("Ошибка сохранения политики")
    } catch {
      setMessage("Ошибка сохранения политики")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Политика конфиденциальности" description="Редактирование политики сайта">
      <div className="p-6 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500">Загрузка...</div>
        ) : (
          <>
            <Textarea
              className="w-full min-h-[400px] text-sm font-mono"
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={saving}
            />
            <div className="flex gap-4 mt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
              {message && <span className="text-sm text-gray-600 mt-2">{message}</span>}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
} 