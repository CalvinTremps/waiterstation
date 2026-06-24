import { createServerClient } from '@/lib/supabase-server'
import DeleteUserButton from './DeleteUserButton'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>
}) {
  const { tab = 'workers', q = '' } = await searchParams
  const supabase = await createServerClient()

  const isWorkers = tab !== 'employers'

  const [{ data: workers }, { data: employers }] = await Promise.all([
    supabase.from('worker_profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('employer_profiles').select('*').order('created_at', { ascending: false }),
  ])

  const workerList = (workers ?? []) as {
    id: string; name: string; role_category: string; location: string;
    phone: string; availability: string; created_at: string
  }[]
  const employerList = (employers ?? []) as {
    id: string; contact_name: string; business_name: string; phone: string;
    website: string; created_at: string
  }[]

  const lq = q.toLowerCase()
  const filteredWorkers = lq
    ? workerList.filter(w =>
        w.name?.toLowerCase().includes(lq) ||
        w.location?.toLowerCase().includes(lq) ||
        w.role_category?.toLowerCase().includes(lq))
    : workerList

  const filteredEmployers = lq
    ? employerList.filter(e =>
        e.contact_name?.toLowerCase().includes(lq) ||
        e.business_name?.toLowerCase().includes(lq) ||
        e.website?.toLowerCase().includes(lq))
    : employerList

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage worker and employer accounts.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'workers', label: 'Workers', count: workerList.length },
          { key: 'employers', label: 'Employers', count: employerList.length },
        ].map(t => (
          <a key={t.key} href={`/admin/users?tab=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              (isWorkers ? 'workers' : 'employers') === t.key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {t.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
              (isWorkers ? 'workers' : 'employers') === t.key ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'
            }`}>{t.count}</span>
          </a>
        ))}
      </div>

      {/* Search */}
      <form method="GET" action="/admin/users" className="flex gap-2 mb-5">
        <input type="hidden" name="tab" value={tab} />
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input name="q" defaultValue={q} placeholder="Search by name, location…"
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <button type="submit" className="bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition">
          Search
        </button>
        {q && (
          <a href={`/admin/users?tab=${tab}`} className="text-sm text-gray-400 hover:text-gray-700 px-3 py-2.5 rounded-xl border border-gray-200 bg-white transition">
            Clear
          </a>
        )}
      </form>

      {/* Workers table */}
      {isWorkers && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {filteredWorkers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No workers found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3">Name</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3">Role</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Location</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Phone</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3">Joined</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredWorkers.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{w.name || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-600 capitalize">{w.role_category?.replace('_', ' ') || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{w.location || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{w.phone || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(w.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <DeleteUserButton userId={w.id} type="worker" name={w.name || 'this user'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Employers table */}
      {!isWorkers && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {filteredEmployers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No employers found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3">Contact</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3">Business</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Phone</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Website</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3">Joined</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployers.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{e.contact_name || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{e.business_name || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{e.phone || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">{e.website || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(e.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <DeleteUserButton userId={e.id} type="employer" name={e.contact_name || 'this user'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
