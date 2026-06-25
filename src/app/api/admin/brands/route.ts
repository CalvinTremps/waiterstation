import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const c = await cookies()
  return verifySession(c.get(ADMIN_COOKIE)?.value)
}

function dbErr(msg = 'Database not configured. Apply supabase/migration-brands.sql.') {
  return NextResponse.json({ error: msg }, { status: 503 })
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  try {
    const sb = createServiceClient()
    if (id) {
      // Single brand with reviews and linked jobs count
      const [brandRes, reviewsRes, jobsRes] = await Promise.all([
        sb.from('brands').select('*').eq('id', id).single(),
        sb.from('brand_reviews').select('*').eq('brand_id', id).order('created_at', { ascending: false }),
        sb.from('jobs').select('id, title, location, employment_type, status, created_at').eq('brand_id', id).order('created_at', { ascending: false }),
      ])
      if (brandRes.error) return NextResponse.json({ error: 'Brand not found.' }, { status: 404 })
      return NextResponse.json({
        brand: brandRes.data,
        reviews: reviewsRes.data ?? [],
        jobs: jobsRes.data ?? [],
      })
    }
    const { data, error } = await sb
      .from('brands')
      .select('id, name, industry, size, location, description, website, logo_url, is_active, overall_rating, claimed, created_at')
      .order('name')
    if (error) return dbErr()
    return NextResponse.json({ brands: data ?? [] })
  } catch { return dbErr() }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const action = String(body.action ?? 'create')

  try {
    const sb = createServiceClient()

    // ── Brand CRUD ────────────────────────────────────────────────────────────
    if (action === 'create' || action === 'update') {
      const payload: Record<string, unknown> = {
        name: String(body.name ?? '').trim(),
        industry: String(body.industry ?? '').trim(),
        size: String(body.size ?? '').trim(),
        location: String(body.location ?? '').trim(),
        description: String(body.description ?? '').trim(),
        website: String(body.website ?? '').trim() || null,
        logo_url: String(body.logo_url ?? '').trim() || null,
        is_active: body.is_active !== false,
        claimed: body.claimed === true,
      }
      if (!payload.name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })

      // Optional v2 fields (ratings, benefits)
      if (body.overall_rating !== undefined) {
        payload.overall_rating = body.overall_rating === '' ? null : Number(body.overall_rating)
      }
      if (body.ratings !== undefined) {
        payload.ratings = body.ratings
      }
      if (Array.isArray(body.benefits)) {
        payload.benefits = body.benefits.map(String).filter(Boolean)
      }

      if (action === 'update') {
        const { error } = await sb.from('brands').update(payload).eq('id', body.id)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      } else {
        const { error } = await sb.from('brands').insert(payload)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === 'delete') {
      await sb.from('brands').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    // ── Review CRUD ───────────────────────────────────────────────────────────
    if (action === 'review-create' || action === 'review-update') {
      const rev: Record<string, unknown> = {
        brand_id: body.brand_id,
        role: String(body.role ?? '').trim(),
        employment_status: body.employment_status === 'Current' ? 'Current' : 'Former',
        rating: Math.max(1, Math.min(5, Number(body.rating) || 3)),
        pros: String(body.pros ?? '').trim(),
        cons: String(body.cons ?? '').trim(),
        anonymous: body.anonymous !== false,
        author_name: body.anonymous !== false ? null : (String(body.author_name ?? '').trim() || null),
        salary: String(body.salary ?? '').trim() || null,
        status: body.status ?? 'approved',
      }
      if (action === 'review-update') {
        const { error } = await sb.from('brand_reviews').update(rev).eq('id', body.id)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      } else {
        const { error } = await sb.from('brand_reviews').insert(rev)
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === 'review-delete') {
      await sb.from('brand_reviews').delete().eq('id', body.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch { return dbErr() }
}
