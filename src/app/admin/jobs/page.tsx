import { createServerClient } from '@/lib/supabase-server'
import { Job, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import AdminActions from '../AdminActions'
import JobSearch from './JobSearch'

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status = 'pending', q = '' } = await searchParams
  const supabase = await createServerClient()

  const validStatus = ['pending', 'approved', 'expired'].includes(status) ? status : 'pending'

  let query = supabase
    .from('jobs')
    .select('*')
    .eq('status', validStatus)
    .order('created_at', { ascending: false })

  if (q) query = query.or(`title.ilike.%${q}%,employer_name.ilike.%${q}%,location.ilike.%${q}%`)

  const { data: jobs } = await query
  const jobList = (jobs ?? []) as Job[]

  const [{ count: pending }, { count: approved }, { count: expired }] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
  ])

  const tabs = [
    { key: 'pending', label: 'Pending', count: pending ?? 0, color: 'text-amber-600' },
    { key: 'approved', label: 'Live', count: approved ?? 0, color: 'text-green-600' },
    { key: 'expired', label: 'Expired', count: expired ?? 0, color: 'text-gray-500' },
  ]

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Review, approve and manage job listings.</p>
        </div>
        <a href="/admin/jobs/create"
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          Post a job
        </a>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map(t => (
          <a key={t.key} href={`/admin/jobs?status=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              validStatus === t.key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {t.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
              validStatus === t.key ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'
            }`}>{t.count}</span>
          </a>
        ))}
      </div>

      {/* Search */}
      <JobSearch defaultValue={q} status={validStatus} />

      {/* Job list */}
      <div className="space-y-3 mt-4">
        {jobList.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">No {validStatus} jobs{q ? ` matching "${q}"` : ''}.</p>
          </div>
        )}
        {jobList.map(job => (
          <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                {job.employer_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="font-bold text-gray-900 leading-tight">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {job.employer_name} · {job.location}
                      {job.franchise_name && (
                        <span className="ml-2 text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                          Franchise
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(job.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    {ROLE_LABELS[job.role_category]}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                  </span>
                  {job.pay && (
                    <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                      {job.pay}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                  {job.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">Contact: {job.contact_method}</p>
                <AdminActions jobId={job.id} currentStatus={job.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
