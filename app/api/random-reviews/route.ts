import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = "force-dynamic"
export const revalidate = 0

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
let supabase: any = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase не настроен' }, { status: 500 })
  }
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '9', 10), 50)

  const { data, error } = await supabase
    .from('reviews')
    .select('id, name, rating, text, source, created_at, published_at')
    .eq('is_published', true)

  if (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }

  const all = data || []
  const total = all.length
  const averageRating =
    total > 0
      ? all.reduce((sum, r) => sum + (Number.isFinite(Number(r?.rating)) ? Number(r.rating) : 5), 0) / total
      : 5

  // Перемешиваем (Fisher–Yates)
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  const selected = all.slice(0, limit)

  return NextResponse.json(
    {
      success: true,
      reviews: selected,
      total,
      average_rating: Number(averageRating.toFixed(1)),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}
