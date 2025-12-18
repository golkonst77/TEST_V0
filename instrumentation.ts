function fingerprint(value: string | undefined, keepStart = 6, keepEnd = 4): string {
  if (!value) return 'NOT SET'
  const v = value.trim()
  if (v.length <= keepStart + keepEnd + 3) return `${v.substring(0, Math.min(v.length, keepStart))}…`
  return `${v.substring(0, keepStart)}…${v.substring(v.length - keepEnd)}`
}

function envFlag(name: string): string {
  const v = process.env[name]
  return v && String(v).trim() ? 'SET' : 'NOT SET'
}

export async function register() {
  const enabled = process.env.DEBUG_ENV === '1' || process.env.DEBUG_API_ERRORS === '1'
  if (!enabled) return

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  let host = 'NOT SET'
  try {
    host = url ? new URL(url).host : 'NOT SET'
  } catch {
    host = url ? 'INVALID_URL' : 'NOT SET'
  }

  console.log('[env] runtime:', process.env.NEXT_RUNTIME || 'nodejs')
  console.log('[env] NODE_ENV:', process.env.NODE_ENV)
  console.log('[env] NEXT_PUBLIC_SUPABASE_URL:', host)
  console.log('[env] NEXT_PUBLIC_SUPABASE_ANON_KEY:', fingerprint(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  console.log('[env] SUPABASE_KEY:', fingerprint(process.env.SUPABASE_KEY))
  console.log('[env] SUPABASE_SERVICE_ROLE_KEY:', fingerprint(process.env.SUPABASE_SERVICE_ROLE_KEY))
  console.log('[env] RESEND_API_KEY:', envFlag('RESEND_API_KEY'))
  console.log('[env] YANDEX_EMAIL:', envFlag('YANDEX_EMAIL'))
  console.log('[env] SENDSAY_API_KEY:', envFlag('SENDSAY_API_KEY'))
}
