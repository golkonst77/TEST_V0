import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Страница не найдена
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Извините, запрашиваемая страница не существует.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 