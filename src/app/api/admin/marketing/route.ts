import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase-server'

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const slug = String(body.slug ?? '').trim()
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

  const record = {
    slug,
    name: String(body.name ?? ''),
    path: String(body.path ?? ''),
    seo_title: String(body.seo_title ?? ''),
    seo_description: String(body.seo_description ?? ''),
    hero_heading: String(body.hero_heading ?? ''),
    hero_subheading: String(body.hero_subheading ?? ''),
    body: String(body.body ?? ''),
    published: body.published !== false,
    updated_at: new Date().toISOString(),
  }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from('marketing_pages').upsert(record, { onConflict: 'slug' })
    if (error) {
      return NextResponse.json(
        { error: 'Could not save. Apply supabase/migration-marketing.sql, then try again.', detail: error.message },
        { status: 500 }
      )
    }
  } catch (e) {
    return NextResponse.json(
      { error: 'Storage not configured. Apply supabase/migration-marketing.sql to enable saving.' },
      { status: 503 }
    )
  }

  return NextResponse.json({ success: true })
}
