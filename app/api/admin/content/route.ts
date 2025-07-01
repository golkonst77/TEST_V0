import { NextRequest, NextResponse } from 'next/server'

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

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      pages: pages 
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, pageId, status } = body

    if (action === 'updateStatus') {
      const pageIndex = pages.findIndex(page => page.id === pageId)
      if (pageIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        )
      }

      pages[pageIndex].status = status
      pages[pageIndex].updated = new Date().toISOString().split('T')[0]

      return NextResponse.json({ 
        success: true, 
        message: `Page ${status === 'published' ? 'published' : 'unpublished'} successfully`,
        page: pages[pageIndex]
      })
    }

    if (action === 'delete') {
      const pageIndex = pages.findIndex(page => page.id === pageId)
      if (pageIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        )
      }

      const deletedPage = pages.splice(pageIndex, 1)[0]
      return NextResponse.json({ 
        success: true, 
        message: 'Page deleted successfully',
        page: deletedPage
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    )
  }
} 