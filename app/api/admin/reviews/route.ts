import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate stats
    const total = reviews.length
    const published = reviews.filter(r => r.is_published).length
    const featured = reviews.filter(r => r.is_featured).length
    const avgRating = reviews.length > 0 ? 
      Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 : 0

    return NextResponse.json({
      reviews,
      stats: {
        total,
        published,
        featured,
        avgRating
      }
    })
  } catch (error) {
    console.error('Error in admin reviews API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Специальная логика для публикации отзыва
    if (updates.is_published === true) {
      // Проверяем, не был ли отзыв уже опубликован
      const { data: currentReview } = await supabase
        .from('reviews')
        .select('is_published, published_at')
        .eq('id', id)
        .single()

      if (currentReview && !currentReview.is_published && !currentReview.published_at) {
        updates.published_at = new Date().toISOString()
      }
    } else if (updates.is_published === false) {
      updates.published_at = null
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating review:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error in admin reviews PATCH API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting review:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in admin reviews DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 