import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase-server'

// Fields employers are allowed to edit on their brand profile.
// Ratings, overall_rating, benefits (crowdsourced), and reviews are EXCLUDED.
const ALLOWED_FIELDS = ['company_name', 'company_description', 'company_logo_url', 'company_location', 'company_website', 'company_industry', 'company_size'] as const

async function getEmployer() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('employer_profiles').select('*').eq('id', user.id).single()
  return data ?? null
}

export async function GET() {
  const employer = await getEmployer()
  if (!employer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = createServiceClient()

  // If they have a linked brand, return brand data + their overrides
  let brand = null
  if (employer.brand_id) {
    const { data } = await sb.from('brands')
      .select('id, name, industry, size, location, description, website, logo_url, overall_rating, ratings, claimed')
      .eq('id', employer.brand_id)
      .single()
    brand = data
  }

  return NextResponse.json({ employer, brand })
}

export async function PUT(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))

  // Build a safe update payload — only allowed employer_profile fields
  const profileUpdate: Record<string, string | null> = {}
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      profileUpdate[field] = String(body[field] ?? '').trim() || null
    }
  }

  if (Object.keys(profileUpdate).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('employer_profiles')
    .upsert({ id: user.id, ...profileUpdate }, { onConflict: 'id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
