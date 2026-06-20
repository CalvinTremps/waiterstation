import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, getSession } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!rateLimit(`worker-profile:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute before trying again.' }, { status: 429 })
  }

  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, role_category, location, experience_summary, availability, phone, certifications } = body

  if (!name || !location || !phone) {
    return NextResponse.json({ error: 'Name, location, and phone are required.' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { error } = await supabase
    .from('worker_profiles')
    .upsert({
      id: session.user.id,
      name: name.trim(),
      role_category: role_category || null,
      location: location.trim(),
      experience_summary: experience_summary?.trim() || null,
      availability: availability?.trim() || null,
      phone: phone.trim(),
      certifications: certifications?.trim() || null,
    })

  if (error) return NextResponse.json({ error: 'Failed to save profile. Please try again.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
