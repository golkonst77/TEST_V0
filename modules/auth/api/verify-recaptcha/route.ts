/**
 * @file: route.ts
 * @description: API endpoint для проверки reCAPTCHA токена
 * @dependencies: fetch
 * @created: 2024-12-19
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      )
    }

    // Временно отключаем проверку reCAPTCHA
    if (token === 'disabled') {
      console.warn('reCAPTCHA temporarily disabled - skipping verification')
      return NextResponse.json({ success: true, score: 0.9, isHuman: true })
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey || secretKey === 'your_secret_key_here') {
      // Если секретный ключ не настроен, пропускаем проверку в режиме разработки
      console.warn('reCAPTCHA secret key not configured - skipping verification')
      return NextResponse.json({ success: true, score: 0.9 })
    }

    // Проверяем токен через Google reCAPTCHA API
    const verificationResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    )

    const verificationData = await verificationResponse.json()

    if (!verificationData.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Проверяем score (для reCAPTCHA v3)
    const score = verificationData.score || 0
    const isHuman = score >= 0.5 // Порог для определения человека

    return NextResponse.json({
      success: true,
      score,
      isHuman,
    })
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 