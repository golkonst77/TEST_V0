export type QuizMode = "default" | "custom" | "disabled"

export function normalizeQuizMode(raw?: string | null): QuizMode {
  if (!raw) return "custom"

  const value = raw.trim().toLowerCase()
  if (value === "disabled") return "disabled"
  if (value === "custom") return "custom"
  if (value === "default" || value === "external") return "default"

  return "custom"
}

export function quizModeToStorageValue(mode: QuizMode): string {
  return mode
}

export function quizModeFromStorageValue(raw?: string | null): QuizMode {
  return normalizeQuizMode(raw)
}

export function getDefaultCtaLabel(mode: QuizMode): string {
  if (mode === "disabled") {
    return "Получить консультацию"
  }
  return "Получить консультацию"
}
