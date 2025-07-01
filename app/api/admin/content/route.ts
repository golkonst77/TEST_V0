import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

// Имитация базы данных страниц
const pages = [
  { id: 1, title: "Главная страница", slug: "/", status: "published", updated: "2024-01-15", type: "page", content: "" },
  { id: 2, title: "О компании", slug: "/about", status: "published", updated: "2024-01-10", type: "page", content: "" },
  { id: 3, title: "Услуги", slug: "/services", status: "published", updated: "2024-01-12", type: "page", content: "" },
  { id: 4, title: "Контакты", slug: "/contacts", status: "published", updated: "2024-01-14", type: "page", content: "" },
  { id: 5, title: "Калькулятор", slug: "/calculator", status: "published", updated: "2024-01-13", type: "page", content: "" },
  { id: 6, title: "Тарифы", slug: "/pricing", status: "published", updated: "2024-01-11", type: "page", content: "" },
  { id: 7, title: "Личный кабинет", slug: "/lk", status: "published", updated: "2024-01-09", type: "page", content: "" },
  { id: 8, title: "Блог", slug: "/blog", status: "published", updated: "2024-01-16", type: "page", content: "" },
]

// Функция для обновления middleware с новыми статусами
async function updateMiddlewareStatuses() {
  try {
    const middlewarePath = join(process.cwd(), 'middleware.ts')
    
    // Создаем объект статусов из массива страниц
    const statusesObject = pages.reduce((acc, page) => {
      acc[page.slug] = page.status as 'published' | 'draft'
      return acc
    }, {} as Record<string, 'published' | 'draft'>)
    
    // Читаем текущий middleware
    let middlewareContent = await readFile(middlewarePath, 'utf-8')
    
    // Заменяем объект pageStatuses
    const statusesString = JSON.stringify(statusesObject, null, 2)
      .split('\n')
      .map((line, index) => index === 0 ? line : `  ${line}`)
      .join('\n')
    
    middlewareContent = middlewareContent.replace(
      /const pageStatuses: Record<string, 'published' \| 'draft'> = \{[\s\S]*?\}/,
      `const pageStatuses: Record<string, 'published' | 'draft'> = ${statusesString}`
    )
    
    // Записываем обновленный middleware
    await writeFile(middlewarePath, middlewareContent, 'utf-8')
    
    console.log('Middleware updated with new page statuses')
  } catch (error) {
    console.error('Error updating middleware:', error)
  }
}

export async function GET() {
  try {
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, pageId } = body

    if (action === 'toggle-status') {
      const page = pages.find(p => p.id === pageId)
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      }

      // Переключаем статус
      page.status = page.status === 'published' ? 'draft' : 'published'
      page.updated = new Date().toISOString().split('T')[0]

      // Обновляем middleware
      await updateMiddlewareStatuses()

      return NextResponse.json({ 
        success: true, 
        page,
        message: `Страница "${page.title}" ${page.status === 'published' ? 'опубликована' : 'снята с публикации'}`
      })
    }

    if (action === 'delete') {
      const pageIndex = pages.findIndex(p => p.id === pageId)
      if (pageIndex === -1) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      }

      const deletedPage = pages.splice(pageIndex, 1)[0]
      
      // Обновляем middleware
      await updateMiddlewareStatuses()

      return NextResponse.json({ 
        success: true, 
        message: `Страница "${deletedPage.title}" удалена`
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
} 