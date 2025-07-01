import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Имитация базы данных статусов страниц
const pageStatuses: Record<string, 'published' | 'draft'> = {
  '/': 'published',
  '/about': 'published',
  '/services': 'published',
  '/contacts': 'published',
  '/calculator': 'published',
  '/pricing': 'published',
  '/lk': 'published',
  '/blog': 'published',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем API маршруты, админку, статические файлы и системные маршруты
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return NextResponse.next()
  }

  // Проверяем статус публикации страницы
  const pageStatus = pageStatuses[pathname]
  
  if (pageStatus === 'draft') {
    // Если страница в черновике, показываем 404
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Страница не найдена</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0; 
              background: #f8fafc;
              color: #374151;
            }
            .container { 
              text-align: center; 
              max-width: 500px; 
              padding: 2rem;
            }
            h1 { 
              font-size: 4rem; 
              margin: 0; 
              color: #ef4444;
              font-weight: bold;
            }
            h2 { 
              font-size: 1.5rem; 
              margin: 1rem 0; 
              color: #1f2937;
            }
            p { 
              color: #6b7280; 
              margin-bottom: 2rem;
            }
            a { 
              background: linear-gradient(to right, #3b82f6, #8b5cf6); 
              color: white; 
              padding: 0.75rem 1.5rem; 
              border-radius: 0.5rem; 
              text-decoration: none; 
              font-weight: 500;
              display: inline-block;
            }
            a:hover { 
              opacity: 0.9; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <h2>Страница не найдена</h2>
            <p>Запрашиваемая страница временно недоступна или находится в разработке.</p>
            <a href="/">Вернуться на главную</a>
          </div>
        </body>
      </html>
      `,
      { 
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Применяем middleware ко всем маршрутам, кроме:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 