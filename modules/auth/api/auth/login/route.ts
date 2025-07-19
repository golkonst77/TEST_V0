/**
 * @file: route.ts
 * @description: API endpoint для входа в систему
 * @dependencies: auth.ts
 * @created: 2024-12-19
 */

import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    const response = await signIn(email, password)

    if (response.success) {
      return NextResponse.json(response)
    } else {
      return NextResponse.json(response, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 