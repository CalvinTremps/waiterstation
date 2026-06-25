import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase-server'
import { moderateReview } from '@/lib/review-moderation'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { brand_id, role, employment_status, rating, pros, cons, salary, anonymous, author_name } = body

  if (!brand_id || !role || !pros || !cons || !rating) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // Optional: check auth (reviews can be submitted anonymously or by logged-in users)
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const moderation = moderateReview({ pros, cons, role, rating: Number(rating) })

  if (moderation.status === 'rejected') {
    return NextResponse.json({
      error: 'Your review could not be submitted. ' + moderation.reason,
      status: 'rejected',
    }, { status: 422 })
  }

  const sb = createServiceClient()
  const { error } = await sb.from('brand_reviews').insert({
    brand_id,
    author_id: user?.id ?? null,
    role: String(role).trim(),
    employment_status: employment_status === 'Current' ? 'Current' : 'Former',
    rating: Math.max(1, Math.min(5, Number(rating))),
    pros: String(pros).trim(),
    cons: String(cons).trim(),
    anonymous: anonymous !== false,
    author_name: anonymous !== false ? null : (String(author_name ?? '').trim() || null),
    salary: String(salary ?? '').trim() || null,
    status: moderation.status,
    helpful_count: 0,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to save review.' }, { status: 500 })
  }

  return NextResponse.json({ status: moderation.status })
}
