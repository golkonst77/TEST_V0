import { type NextRequest, NextResponse } from "next/server"

function verifySimpleToken(token: string) {
  try {
    const payload = JSON.parse(atob(token))

    // Проверяем срок действия
    if (Date.now() > payload.exp) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false, message: "Токен не предоставлен" }, { status: 401 })
    }

    const payload = verifySimpleToken(token)

    if (payload) {
      return NextResponse.json({
        valid: true,
        user: {
          username: payload.username,
          role: payload.role,
        },
      })
    } else {
      return NextResponse.json({ valid: false, message: "Недействительный токен" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ valid: false, message: "Ошибка проверки токена" }, { status: 500 })
  }
}
