import { createServerClient } from '@/lib/supabase-server'
import { Job, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminActions from './AdminActions'
import BrandLinkActions from './BrandLinkActions'
import AdminSignOut from './AdminSignOut'

async function checkAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  return session === process.env.ADMIN_PASSWORD
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  if (!await checkAdminSession()) {
    redirect('/admin/login')
  }

  const { tab = 'pending' } = await searchParams

  const supabase = await createServerClient()

  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: expiredCount },
    { count: workerCount },
    { count: brandLinkCount },
  ] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
    supabase.from('worker_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('brand_link_status', 'pending'),
  ])

  const isBrandTab = tab === 'brand-links'

  let jobs: Job[] = []
  if (!isBrandTab) {
    const status = tab === 'approved' ? 'approved' : tab === 'expired' ? 'expired' : 'pending'
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    jobs = data ?? []
  }

  let brandLinkJobs: Job[] = []
  if (isBrandTab) {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('brand_link_status', 'pending')
      .order('created_at', { ascending: false })
    brandLinkJobs = data ?? []
  }

  const tabs = [
    { key: 'pending', label: 'Pending', count: pendingCount ?? 0 },
    { key: 'approved', label: 'Live', count: approvedCount ?? 0 },
    { key: 'expired', label: 'Expired', count: expiredCount ?? 0 },
    { key: 'brand-links', label: 'Brand Links', count: brandLinkCount ?? 0, highlight: true },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Waiterstation</p>
        </div>
        <AdminSignOut />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pending" value={pendingCount ?? 0} color="text-amber-600" />
        <StatCard label="Live jobs" value={approvedCount ?? 0} color="text-emerald-600" />
        <StatCard label="Expired" value={expiredCount ?? 0} color="text-gray-400" />
        <StatCard label="Workers" value={workerCount ?? 0} color="text-blue-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <a
            key={t.key}
            href={`/admin?tab=${t.key}`}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition
              ${tab === t.key
                ? t.highlight ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md
              ${tab === t.key
                ? t.highlight ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-white'
                : 'bg-gray-200 text-gray-500'}`}>
              {t.count}
            </span>
          </a>
        ))}
      </div>

      {/* Brand links tab */}
      {isBrandTab && (
        <>
          {brandLinkJobs.length === 0 && (
            <p className="text-gray-400 text-center py-12">No pending brand link requests.</p>
          )}
          <div className="space-y-4">
            {brandLinkJobs.map((job: Job) => {
              const brand = MOCK_COMPANIES.find(c => c.id === job.parent_company_id)
              return (
                <div key={job.id} className="bg-white border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">
                      {brand?.name?.[0] ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="font-semibold text-gray-900">{job.franchise_name}</h2>
                          <p className="text-sm text-gray-500">
                            Claiming to be a franchise of <strong>{brand?.name ?? job.parent_company_id}</strong>
                          </p>
                        </div>
                        <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full shrink-0">
                          Brand Link
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-gray-500">
                        <p><span className="font-medium text-gray-700">Job posted:</span> {job.title} · {job.location}</p>
                        <p><span className="font-medium text-gray-700">Corporate email:</span> {job.franchise_email}</p>
                        <p><span className="font-medium text-gray-700">Brand website:</span> {brand?.website}</p>
                        <p className="text-[11px] text-gray-400">
                          Domain match: {job.franchise_email?.split('@')[1] === brand?.website
                            ? <span className="text-emerald-600 font-semibold">✓ Matches</span>
                            : <span className="text-red-500 font-semibold">✗ Mismatch — review carefully</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                  <BrandLinkActions jobId={job.id} />
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Jobs tabs */}
      {!isBrandTab && (
        <>
          {jobs.length === 0 && (
            <p className="text-gray-400 text-center py-12">No {tab} listings.</p>
          )}
          <div className="space-y-4">
            {jobs.map((job: Job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
                    {job.employer_name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-semibold text-gray-900 leading-tight">{job.title}</h2>
                        <p className="text-sm text-gray-500">
                          {job.employer_name} · {job.location}
                          {job.franchise_name && (
                            <span className="ml-1.5 inline-flex items-center text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                              Franchise · {job.brand_link_status}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(job.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1.5 flex-wrap text-xs text-gray-400">
                      <span>{ROLE_LABELS[job.role_category]}</span>
                      <span>·</span>
                      <span>{EMPLOYMENT_TYPE_LABELS[job.employment_type]}</span>
                      {job.pay && <><span>·</span><span className="text-emerald-700 font-medium">{job.pay}</span></>}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap leading-relaxed line-clamp-4">{job.description}</p>
                <p className="text-xs text-gray-400 mt-2">Contact: {job.contact_method}</p>
                <AdminActions jobId={job.id} currentStatus={job.status} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}
