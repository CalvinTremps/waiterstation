import { createServerClient } from '@/lib/supabase-server'
import ApplicationStatusButton from './ApplicationStatusButton'

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q = '', status = '' } = await searchParams
  const supabase = await createServerClient()

  let query = supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (q) query = query.or(`applicant_name.ilike.%${q}%,employer_name.ilike.%${q}%`)

  const { data: apps } = await query
  const applications = (apps ?? []) as {
    id: string; applicant_name: string; applicant_phone: string;
    employer_name: string; job_id: string; message: string;
    status: string; created_at: string
  }[]

  const [{ count: total }, { count: newCount }, { count: reviewed }] = await Promise.all([
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'reviewed'),
  ])

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days}d ago`
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">All job applications submitted through Waiterstation.</p>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label: 'Total', count: total ?? 0, key: '' },
          { label: 'New', count: newCount ?? 0, key: 'new' },
          { label: 'Reviewed', count: reviewed ?? 0, key: 'reviewed' },
        ].map(s => (
          <a key={s.label} href={`/admin/applications${s.key ? `?status=${s.key}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              status === s.key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {s.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
              status === s.key ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'
            }`}>{s.count}</span>
          </a>
        ))}
      </div>

      {/* Search */}
      <form method="GET" action="/admin/applications" className="flex gap-2 mb-5">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input name="q" defaultValue={q} placeholder="Search by applicant or employer…"
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <button type="submit" className="bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition">
          Search
        </button>
        {q && (
          <a href={`/admin/applications${status ? `?status=${status}` : ''}`}
            className="text-sm text-gray-400 hover:text-gray-700 px-3 py-2.5 rounded-xl border border-gray-200 bg-white transition">
            Clear
          </a>
        )}
      </form>

      {/* Applications list */}
      <div className="space-y-3">
        {applications.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-400">No applications found.</p>
          </div>
        )}
        {applications.map(app => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-bold text-gray-900">{app.applicant_name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    app.status === 'new' ? 'bg-blue-100 text-blue-700'
                    : app.status === 'reviewed' ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-500'
                  }`}>{app.status}</span>
                </div>
                <p className="text-sm text-gray-500">Applied to <span className="font-semibold text-gray-700">{app.employer_name}</span></p>
                <p className="text-xs text-gray-400 mt-0.5">Phone: {app.applicant_phone}</p>
                {app.message && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed bg-gray-50 rounded-xl p-3 italic">
                    "{app.message}"
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-xs text-gray-400">{timeAgo(app.created_at)}</p>
                <ApplicationStatusButton appId={app.id} currentStatus={app.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
