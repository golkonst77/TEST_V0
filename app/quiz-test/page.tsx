import { notFound } from "next/navigation"
import { QuizTestPanel } from "./quiz-test-panel"

export default function QuizTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <QuizTestPanel />
}
