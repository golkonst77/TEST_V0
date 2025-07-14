export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">
          Загрузка...
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Пожалуйста, подождите
        </p>
      </div>
    </div>
  )
} 