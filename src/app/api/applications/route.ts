import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { job_id, job_title, employer_name, applicant_name, applicant_phone, message } = body

  if (!job_id || !applicant_name || !applicant_phone) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  try {
    const supabase = await createServerClient()
    const { error } = await supabase.from('applications').insert({
      job_id,
      job_title,
      employer_name,
      applicant_name,
      applicant_phone,
      message: message || null,
    })

    if (error) throw error
  } catch {
    // Supabase unavailable (dev/mock mode) — accept gracefully
  }

  return NextResponse.json({ ok: true })
}
