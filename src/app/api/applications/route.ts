import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase-server'
import { sendNewApplicationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { job_id, job_title, employer_name, applicant_name, applicant_phone, message } = body

  if (!job_id || !applicant_name || !applicant_phone) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Fetch the job to get the employer_id and employer_email
  const { data: job } = await supabase
    .from('jobs')
    .select('employer_id, employer_email')
    .eq('id', job_id)
    .single()

  const { data: application, error } = await supabase.from('applications').insert({
    job_id,
    job_title,
    employer_name,
    applicant_name,
    applicant_phone,
    message: message || null,
    employer_id: job?.employer_id ?? null,
    worker_user_id: session?.user.id ?? null,
    applicant_email: session?.user.email ?? null,
    status: 'new',
  }).select('id').single()

  if (error) {
    console.error('Application insert error:', error)
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 })
  }

  // Send email notification to employer
  const employerEmail = job?.employer_email
  if (employerEmail && application?.id) {
    await sendNewApplicationEmail({
      employerEmail,
      employerName: employer_name,
      jobTitle: job_title,
      applicantName: applicant_name,
      applicantPhone: applicant_phone,
      message,
      applicationId: application.id,
    })
  }

  return NextResponse.json({ ok: true })
}
