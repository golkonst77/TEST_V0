import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// Локальное хранилище отзывов
let localReviews: any[] = []

// Функция для парсинга русских дат
function parseRussianDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString()
  
  try {
    // Парсим русские даты типа "4 марта", "15 февраля", "3 января"
    const monthMap: { [key: string]: number } = {
      'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
      'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
    }
    
    const parts = dateStr.trim().split(' ')
    if (parts.length === 2) {
      const day = parseInt(parts[0])
      const monthName = parts[1].toLowerCase()
      const month = monthMap[monthName]
      
      if (!isNaN(day) && month !== undefined) {
        const currentYear = new Date().getFullYear()
        const date = new Date(currentYear, month, day)
        return date.toISOString()
      }
    }
    
    // Если не удалось распарсить, возвращаем текущую дату
    return new Date().toISOString()
  } catch (error) {
    return new Date().toISOString()
  }
}

// Загружаем отзывы из JSON файла при запуске
function loadLocalReviews() {
  try {
    // Сначала пробуем загрузить файл со всеми отзывами
    let jsonPath = path.join(process.cwd(), 'public', 'yandex-180493814174-all.json')
    if (!fs.existsSync(jsonPath)) {
      // Если нет, загружаем старый файл
      jsonPath = path.join(process.cwd(), 'public', 'yandex-180493814174.json')
    }
    if (!fs.existsSync(jsonPath)) {
      // Если нет, загружаем локальный файл
      jsonPath = path.join(process.cwd(), 'data', 'local-reviews.json')
    }
    
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf-8')
      const data = JSON.parse(content)
      localReviews = data.reviews || []
      console.log(`Загружено ${localReviews.length} отзывов из ${path.basename(jsonPath)}`)
    }
  } catch (error) {
    console.error('Error loading local reviews:', error)
  }
}

// Загружаем отзывы при импорте модуля
loadLocalReviews()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '9', 10), 50)

  // Перемешиваем отзывы и преобразуем данные
  const shuffled = [...localReviews].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, limit).map(review => ({
    id: review.id,
    name: review.author || review.name || 'Гость',
    company: review.company,
    rating: review.rating || 5,
    text: review.text || '',
    source: review.source || 'yandex-maps',
    created_at: parseRussianDate(review.date),
    published_at: parseRussianDate(review.date),
    author: review.author,
    date: review.date
  }))

  return NextResponse.json({ 
    success: true, 
    reviews: selected,
    total: localReviews.length,
    source: 'local-json'
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jsonFile } = body

    if (!jsonFile) {
      return NextResponse.json({ error: 'Не указано имя файла' }, { status: 400 })
    }

    const jsonPath = path.join(process.cwd(), 'public', jsonFile)
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
    }

    const content = fs.readFileSync(jsonPath, 'utf-8')
    const data = JSON.parse(content)
    localReviews = data.reviews || []

    return NextResponse.json({ 
      success: true, 
      message: `Загружено ${localReviews.length} отзывов из ${jsonFile}`,
      count: localReviews.length
    })
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
