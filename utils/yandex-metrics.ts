// Утилита для отправки событий в Яндекс.Метрику
export const sendYandexMetric = (eventName: string, parameters?: Record<string, any>) => {
  try {
    // Проверяем, что Яндекс.Метрика загружена
    if (typeof window !== 'undefined' && (window as any).ym) {
      const counterId = parseInt(String(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '45860892')) // ID счетчика Яндекс.Метрики
      
      console.log(`📊 Яндекс.Метрика: отправляем событие "${eventName}" с ID ${counterId}`, parameters)
      
      // Добавляем небольшую задержку для гарантии загрузки счетчика
      setTimeout(() => {
        try {
          // Отправляем событие в Яндекс.Метрику
          (window as any).ym(counterId, 'reachGoal', eventName, parameters)
          console.log(`✅ Яндекс.Метрика: событие "${eventName}" успешно отправлено`)
        } catch (innerError) {
          console.error('📊 Ошибка при отправке события в setTimeout:', innerError)
        }
      }, 100)
      
    } else {
      console.warn('📊 Яндекс.Метрика не загружена или недоступна')
      console.log('📊 Доступные объекты:', {
        window: typeof window,
        ym: typeof (window as any)?.ym,
        ymFunction: (window as any)?.ym
      })
    }
  } catch (error) {
    console.error('📊 Ошибка отправки события в Яндекс.Метрику:', error)
    console.error('📊 Детали ошибки:', {
      eventName,
      parameters,
      error: error.message,
      stack: error.stack
    })
  }
}

// Константы для названий событий
export const YANDEX_METRICS_EVENTS = {
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_TARIFF_COMPLETED: 'quiz_tariff_completed',
} as const 