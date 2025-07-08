// Утилита для отправки событий в Яндекс.Метрику
export const sendYandexMetric = (eventName: string, parameters?: Record<string, any>) => {
  try {
    // Проверяем, что Яндекс.Метрика загружена
    if (typeof window !== 'undefined' && (window as any).ym) {
      const counterId = process.env.NEXT_PUBLIC_YANDEX_METRICS_ID || '12345678' // Замените на ваш ID счетчика
      
      // Отправляем событие в Яндекс.Метрику
      (window as any).ym(counterId, 'reachGoal', eventName, parameters)
      
      console.log(`📊 Яндекс.Метрика: отправлено событие "${eventName}"`, parameters)
    } else {
      console.warn('📊 Яндекс.Метрика не загружена')
    }
  } catch (error) {
    console.error('📊 Ошибка отправки события в Яндекс.Метрику:', error)
  }
}

// Константы для названий событий
export const YANDEX_METRICS_EVENTS = {
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_TARIFF_COMPLETED: 'quiz_tariff_completed',
} as const 