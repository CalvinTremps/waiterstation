import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ApplicationsClient, { RealWorkerApplication } from './ApplicationsClient'

export default async function ApplicationsPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login?next=/worker/applications')

  const { data } = await supabase
    .from('applications')
    .select('*')
    .eq('worker_user_id', session.user.id)
    .order('created_at', { ascending: false })

  return <ApplicationsClient initialApplications={(data ?? []) as RealWorkerApplication[]} />
}
