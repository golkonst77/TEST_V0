/**
 * @file: route.ts
 * @description: API endpoint для отладки переменных окружения
 * @created: 2024-12-19
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'NOT_SET',
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY ? 'SET' : 'NOT_SET',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('SUPABASE') || key.includes('RECAPTCHA')
    )
  })
} 