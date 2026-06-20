import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { RoleCategory, EmploymentType, ROLE_CATEGORIES } from '@/lib/types'
import { rateLimit } from '@/lib/rate-limit'

const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'seasonal', 'event']

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!rateLimit(`job-post:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute before trying again.' }, { status: 429 })
  }

  const body = await req.json()

  const { title, role_category, location, employment_type, pay, description, employer_name, contact_method } = body

  if (!title || !role_category || !location || !employment_type || !description || !employer_name || !contact_method) {
    return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
  }

  if (!ROLE_CATEGORIES.includes(role_category as RoleCategory)) {
    return NextResponse.json({ error: 'Invalid role category.' }, { status: 400 })
  }

  if (!EMPLOYMENT_TYPES.includes(employment_type as EmploymentType)) {
    return NextResponse.json({ error: 'Invalid employment type.' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { error } = await supabase.from('jobs').insert({
    title: title.trim(),
    role_category,
    location: location.trim(),
    employment_type,
    pay: pay?.trim() || null,
    description: description.trim(),
    employer_name: employer_name.trim(),
    contact_method: contact_method.trim(),
    status: 'pending',
    employer_id: session?.user.id ?? null,
  })

  if (error) {
    console.error('Insert error:', error)
    return NextResponse.json({ error: 'Failed to save job. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
