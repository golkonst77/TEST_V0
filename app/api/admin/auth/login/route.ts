import { type NextRequest, NextResponse } from "next/server"

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "prostoburo2024",
}

// Простая функция для создания токена без JWT библиотеки
function createSimpleToken(username: string) {
  const payload = {
    username,
    role: "admin",
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
  }

  // Простое кодирование в base64
  return btoa(JSON.stringify(payload))
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Проверяем учетные данные
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Создаем простой токен
      const token = createSimpleToken(username)

      return NextResponse.json({
        success: true,
        token,
        message: "Успешный вход в систему",
      })
    } else {
      return NextResponse.json({ success: false, message: "Неверный логин или пароль" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 })
  }
}
