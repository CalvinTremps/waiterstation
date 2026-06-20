import { createServerClient, getSession } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Job, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import EmployerJobActions from './EmployerJobActions'
import RenewButton from './RenewButton'
import SignOutButton from './SignOutButton'

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  expired: 'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  approved: 'Live',
  pending: 'Under review',
  expired: 'Expired',
}

export default async function EmployerDashboard() {
  const session = await getSession()
  if (!session) redirect('/auth/login?next=/employer')

  const supabase = await createServerClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', session.user.id)
    .order('created_at', { ascending: false })

  const live = jobs?.filter(j => j.status === 'approved').length ?? 0
  const pending = jobs?.filter(j => j.status === 'pending').length ?? 0
  const expired = jobs?.filter(j => j.status === 'expired').length ?? 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{session.user.email}</p>
        </div>
        <SignOutButton />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Live" value={live} color="text-emerald-600" />
        <StatCard label="In review" value={pending} color="text-amber-600" />
        <StatCard label="Expired" value={expired} color="text-gray-400" />
      </div>

      {/* Post new job CTA */}
      <a
        href="/post-job"
        className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-4 rounded-lg hover:bg-gray-50 transition mb-5 text-sm"
      >
        + Post a new job
      </a>

      {/* Job list */}
      {(!jobs || jobs.length === 0) && (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium text-gray-600">No listings yet</p>
          <p className="text-sm mt-1">Post your first job above</p>
        </div>
      )}

      <div className="space-y-3">
        {jobs?.map((job: Job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
                {job.employer_name.trim().charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 leading-tight">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{job.location} · {EMPLOYMENT_TYPE_LABELS[job.employment_type]}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded ${STATUS_STYLES[job.status]}`}>
                    {STATUS_LABELS[job.status]}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span>Posted {new Date(job.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                  {job.pay && <><span>·</span><span className="text-emerald-700 font-medium">{job.pay}</span></>}
                </div>
              </div>
            </div>
            <EmployerJobActions jobId={job.id} status={job.status} />
            {job.status === 'expired' && <div className="mt-2"><RenewButton jobId={job.id} /></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}
