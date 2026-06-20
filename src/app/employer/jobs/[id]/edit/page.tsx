import { createServerClient, getSession } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import EditJobForm from './EditJobForm'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/auth/login?next=/employer')

  const { id } = await params
  const supabase = await createServerClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('employer_id', session.user.id)
    .single()

  if (!job) notFound()

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <a href="/employer" className="text-sm text-gray-500 hover:text-gray-800">← My listings</a>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit listing</h1>
      <p className="text-sm text-gray-500 mb-6">Changes go live immediately if your listing is already approved.</p>
      <EditJobForm job={job} />
    </div>
  )
}
