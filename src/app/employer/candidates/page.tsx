import { redirect } from 'next/navigation'
import { getSession } from '@/lib/supabase-server'
import CandidatesClient from './CandidatesClient'

export const metadata = {
  title: 'Find Candidates | Waiterstation',
}

export default async function CandidatesPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login?next=/employer/candidates')
  return <CandidatesClient />
}
