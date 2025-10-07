import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Not configured',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Not configured',
    NEXT_PUBLIC_YANDEX_METRIKA_ID: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || 'Not configured',
    EMAIL_USER: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Configured' : 'Not configured',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'Not configured'
  }

  return NextResponse.json({
    message: 'Environment variables status',
    variables: envVars,
    timestamp: new Date().toISOString()
  })
}


