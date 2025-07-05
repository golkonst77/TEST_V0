import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: review, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching review:', error)
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error in review GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, company, email, phone, rating, text, source, is_published, is_featured, admin_notes } = body

    // Валидация обязательных полей
    if (!name || !rating || !text) {
      return NextResponse.json({ error: 'Name, rating, and text are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const updateData: any = {
      name,
      company,
      email,
      phone,
      rating,
      text,
      source,
      is_published,
      is_featured,
      admin_notes
    }

    // Если отзыв публикуется впервые, устанавливаем published_at
    if (is_published) {
      const { data: currentReview } = await supabase
        .from('reviews')
        .select('is_published, published_at')
        .eq('id', params.id)
        .single()

      if (currentReview && !currentReview.is_published && !currentReview.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    } else {
      updateData.published_at = null
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating review:', error)
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error in review PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting review:', error)
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error in review DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}