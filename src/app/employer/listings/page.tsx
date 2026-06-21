import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Job } from '@/lib/types'
import ListingsClient from './ListingsClient'

export default async function ListingsPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login?next=/employer/listings')

  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', session.user.id)
    .order('created_at', { ascending: false })

  const jobs: Job[] = data ?? []

  return <ListingsClient initialJobs={jobs} />
}
