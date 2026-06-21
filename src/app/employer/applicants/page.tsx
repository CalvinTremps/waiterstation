import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ApplicantsClient, { RealApplication } from './ApplicantsClient'

export default async function ApplicantsPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login?next=/employer/applicants')

  const [{ data: applications }, { data: jobs }] = await Promise.all([
    supabase
      .from('applications')
      .select('*')
      .eq('employer_id', session.user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('jobs')
      .select('id, title')
      .eq('employer_id', session.user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <ApplicantsClient
      initialApplications={(applications ?? []) as RealApplication[]}
      jobs={jobs ?? []}
    />
  )
}
