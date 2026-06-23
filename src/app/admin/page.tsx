import { createServerClient } from '@/lib/supabase-server'
import { Job } from '@/lib/types'
import { timeAgoFine as timeAgo } from '@/lib/time'

export default async function AdminOverviewPage() {
  const supabase = await createServerClient()

  const [
    { count: pendingJobs },
    { count: liveJobs },
    { count: expiredJobs },
    { count: workers },
    { count: employers },
    { count: applications },
    { count: pendingBrandLinks },
    { data: recentJobs },
    { data: recentApplications },
  ] = await Promise.all([
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'expired'),
    supabase.from('worker_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('employer_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('brand_link_status', 'pending'),
    supabase.from('jobs').select('id,title,employer_name,status,created_at,location').order('created_at', { ascending: false }).limit(6),
    supabase.from('applications').select('id,applicant_name,employer_name,job_id,created_at,status').order('created_at', { ascending: false }).limit(6),
  ])

  const stats = [
    { label: 'Pending jobs', value: pendingJobs ?? 0, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/jobs?status=pending' },
    { label: 'Live jobs', value: liveJobs ?? 0, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/jobs?status=approved' },
    { label: 'Workers', value: workers ?? 0, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/users?tab=workers' },
    { label: 'Employers', value: employers ?? 0, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/users?tab=employers' },
    { label: 'Applications', value: applications ?? 0, color: 'text-gray-900', bg: 'bg-gray-100', href: '/admin/applications' },
    { label: 'Brand link requests', value: pendingBrandLinks ?? 0, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/brand-links' },
  ]


  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening on Waiterstation.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <a key={s.label} href={s.href}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition group">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <span className={`text-lg font-extrabold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{s.label}</p>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent job submissions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Recent job submissions</h2>
            <a href="/admin/jobs" className="text-xs text-blue-600 hover:underline font-medium">View all →</a>
          </div>
          {(recentJobs ?? []).length === 0
            ? <p className="text-sm text-gray-400 text-center py-6">No jobs yet.</p>
            : (
              <div className="space-y-2">
                {(recentJobs as Job[]).map(j => (
                  <div key={j.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{j.title}</p>
                      <p className="text-xs text-gray-500 truncate">{j.employer_name} · {j.location}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        j.status === 'approved' ? 'bg-green-100 text-green-700'
                        : j.status === 'pending' ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>{j.status}</span>
                      <span className="text-[10px] text-gray-400">{timeAgo(j.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Recent applications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Recent applications</h2>
            <a href="/admin/applications" className="text-xs text-blue-600 hover:underline font-medium">View all →</a>
          </div>
          {(recentApplications ?? []).length === 0
            ? <p className="text-sm text-gray-400 text-center py-6">No applications yet.</p>
            : (
              <div className="space-y-2">
                {(recentApplications as { id: string; applicant_name: string; employer_name: string; created_at: string; status: string }[]).map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{a.applicant_name}</p>
                      <p className="text-xs text-gray-500 truncate">→ {a.employer_name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.status === 'new' ? 'bg-blue-100 text-blue-700'
                        : a.status === 'reviewed' ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>{a.status}</span>
                      <span className="text-[10px] text-gray-400">{timeAgo(a.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

      </div>

      {/* Quick actions */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/jobs?status=pending"
            className="flex items-center gap-2 bg-amber-50 text-amber-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-amber-100 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Review pending jobs
          </a>
          <a href="/admin/brand-links"
            className="flex items-center gap-2 bg-purple-50 text-purple-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-purple-100 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Brand link requests
          </a>
          <a href="/admin/users"
            className="flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-100 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Manage users
          </a>
        </div>
      </div>
    </div>
  )
}
