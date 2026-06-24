import { createServerClient } from '@/lib/supabase-server'
import { Job } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import BrandLinkActions from '../BrandLinkActions'

export default async function AdminBrandLinksPage() {
  const supabase = await createServerClient()

  const [{ data: pending }, { data: approved }, { data: rejected }] = await Promise.all([
    supabase.from('jobs').select('*').eq('brand_link_status', 'pending').order('created_at', { ascending: false }),
    supabase.from('jobs').select('*').eq('brand_link_status', 'approved').order('created_at', { ascending: false }),
    supabase.from('jobs').select('*').eq('brand_link_status', 'rejected').order('created_at', { ascending: false }),
  ])

  function BrandLinkCard({ job, showActions }: { job: Job; showActions: boolean }) {
    const brand = MOCK_COMPANIES.find(c => c.id === job.parent_company_id)
    const domainMatch = job.franchise_email?.split('@')[1] === brand?.website

    return (
      <div className={`bg-white rounded-2xl border p-5 ${
        showActions ? 'border-gray-200' : 'border-gray-100 opacity-75'
      }`}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold shrink-0">
            {brand?.name?.[0] ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="font-bold text-gray-900">{job.franchise_name}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Claims to be a franchise of{' '}
                  <span className="font-semibold text-gray-700">{brand?.name ?? job.parent_company_id}</span>
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                job.brand_link_status === 'approved' ? 'bg-green-100 text-green-700'
                : job.brand_link_status === 'rejected' ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-700'
              }`}>{job.brand_link_status}</span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-gray-400 font-medium mb-0.5">Job posted</p>
                <p className="text-gray-800 font-semibold">{job.title} · {job.location}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-gray-400 font-medium mb-0.5">Corporate email</p>
                <p className="text-gray-800 font-semibold">{job.franchise_email ?? '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-gray-400 font-medium mb-0.5">Brand website</p>
                <p className="text-gray-800 font-semibold">{brand?.website ?? '-'}</p>
              </div>
              <div className={`rounded-lg px-3 py-2 ${domainMatch ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`font-medium mb-0.5 ${domainMatch ? 'text-green-600' : 'text-red-500'}`}>Domain match</p>
                <p className={`font-bold ${domainMatch ? 'text-green-700' : 'text-red-600'}`}>
                  {domainMatch ? 'Domains match' : 'Mismatch, review carefully'}
                </p>
              </div>
            </div>

            {showActions && <BrandLinkActions jobId={job.id} />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Brand Links</h1>
        <p className="text-sm text-gray-500 mt-1">Franchise requests claiming to be linked to a parent brand.</p>
      </div>

      {/* Pending */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-gray-900">Pending review</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{(pending ?? []).length}</span>
        </div>
        {(pending ?? []).length === 0
          ? <p className="text-sm text-gray-400">No pending brand link requests.</p>
          : <div className="space-y-3">{(pending as Job[]).map(j => <BrandLinkCard key={j.id} job={j} showActions={true} />)}</div>
        }
      </section>

      {/* Approved */}
      {(approved ?? []).length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold text-gray-900">Approved</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{(approved ?? []).length}</span>
          </div>
          <div className="space-y-3">{(approved as Job[]).map(j => <BrandLinkCard key={j.id} job={j} showActions={false} />)}</div>
        </section>
      )}

      {/* Rejected */}
      {(rejected ?? []).length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold text-gray-900">Rejected</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{(rejected ?? []).length}</span>
          </div>
          <div className="space-y-3">{(rejected as Job[]).map(j => <BrandLinkCard key={j.id} job={j} showActions={false} />)}</div>
        </section>
      )}
    </div>
  )
}
