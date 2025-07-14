'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">500</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Что-то пошло не так
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Произошла ошибка при загрузке страницы.
          </p>
          <div className="mt-6 space-x-4">
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Попробовать снова
            </button>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              На главную
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 