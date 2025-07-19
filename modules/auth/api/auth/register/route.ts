/**
 * @file: route.ts
 * @description: API endpoint для регистрации
 * @dependencies: auth.ts
 * @created: 2024-12-19
 */

import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '../../../lib/auth'
import type { RegisterFormData } from '../../../lib/types'

export async function POST(request: NextRequest) {
  try {
    const data: RegisterFormData = await request.json()

    // Валидация данных
    if (!data.email || !data.password || !data.full_name || !data.phone) {
      return NextResponse.json(
        { success: false, error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    if (data.password !== data.confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Пароли не совпадают' },
        { status: 400 }
      )
    }

    if (data.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    const response = await signUp(data)

    if (response.success) {
      return NextResponse.json(response)
    } else {
      return NextResponse.json(response, { status: 400 })
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 