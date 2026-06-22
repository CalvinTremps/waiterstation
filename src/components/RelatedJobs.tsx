import { createServerClient } from '@/lib/supabase-server'
import { Job, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import { MOCK_JOBS } from '@/lib/mock-jobs'

async function getRelated(roleCategory: string, excludeId: string): Promise<Job[]> {
  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'approved')
      .eq('role_category', roleCategory)
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(3)
    if (data && data.length > 0) return data
  } catch {}
  return MOCK_JOBS.filter(j => j.role_category === roleCategory && j.id !== excludeId).slice(0, 3)
}

export default async function RelatedJobs({ roleCategory, excludeId }: { roleCategory: string; excludeId: string }) {
  const jobs = await getRelated(roleCategory, excludeId)
  if (jobs.length === 0) return null

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-gray-800 mb-4">
        More {ROLE_LABELS[roleCategory as keyof typeof ROLE_LABELS] ?? 'hospitality'} jobs
      </p>
      <div className="space-y-2">
        {jobs.map(job => {
          const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 86400000)
          return (
            <a
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition group"
            >
              <div className="w-9 h-9 rounded border border-gray-200 bg-white flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
                {job.employer_name.trim().charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-gray-800 transition truncate">{job.title}</p>
                <p className="text-xs text-gray-500">{job.employer_name} · {job.location}</p>
              </div>
              <div className="text-right shrink-0">
                {job.pay && <p className="text-xs font-semibold text-gray-800">{job.pay}</p>}
                <p className="text-xs text-gray-400">{daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1d' : daysAgo + 'd'}</p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
