"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QuizModal } from "@/components/quiz-modal"

export function QuizTestPanel() {
  const [open, setOpen] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-3 py-1">
        Dev only / Quiz QA
      </p>
      <p className="text-sm text-slate-500 text-center max-w-md">
        Локальная страница для проверки квиза. Не используется на проде.
      </p>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-medium"
      >
        Открыть квиз
      </Button>
      <QuizModal open={open} onOpenChange={setOpen} />
    </main>
  )
}
