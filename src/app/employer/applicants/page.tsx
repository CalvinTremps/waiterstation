'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { MOCK_APPLICANTS, EMPLOYER_JOBS, PIPELINE_STAGES, PipelineStage } from '@/lib/mock-recruitment'

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

function ApplicantsInner() {
  const searchParams = useSearchParams()
  const jobFilter = searchParams.get('job') ?? 'all'

  const [stageFilter, setStageFilter] = useState<PipelineStage | 'all'>('all')
  const [jobId, setJobId] = useState(jobFilter)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating'>('date')

  const filtered = useMemo(() => {
    let list = [...MOCK_APPLICANTS]
    if (jobId !== 'all') list = list.filter(a => a.job_id === jobId)
    if (stageFilter !== 'all') list = list.filter(a => a.stage === stageFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.job_title.toLowerCase().includes(q))
    }
    if (sortBy === 'date') list.sort((a, b) => b.applied_at.localeCompare(a.applied_at))
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    return list
  }, [jobId, stageFilter, search, sortBy])

  const stageCounts = PIPELINE_STAGES.map(s => ({
    ...s,
    count: MOCK_APPLICANTS.filter(a => a.stage === s.key && (jobId === 'all' || a.job_id === jobId)).length,
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-sm text-gray-500 mt-0.5">{MOCK_APPLICANTS.length} total applicants</p>
        </div>
      </div>

      {/* Pipeline stage tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button onClick={() => setStageFilter('all')}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
            stageFilter === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}>
          All ({MOCK_APPLICANTS.filter(a => jobId === 'all' || a.job_id === jobId).length})
        </button>
        {stageCounts.map(s => (
          <button key={s.key} onClick={() => setStageFilter(s.key as PipelineStage)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
              stageFilter === s.key
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}>
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex gap-2 flex-wrap">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          className="flex-1 min-w-[160px] text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select value={jobId} onChange={e => setJobId(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <option value="all">All listings</option>
          {EMPLOYER_JOBS.map(j => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
          <option value="date">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="rating">Highest rated</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">No applicants match your filters</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
          {filtered.map(a => (
            <a key={a.id} href={`/employer/applicants/${a.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
              <div className={`w-10 h-10 rounded-full ${a.avatar_color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                {a.avatar_initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                  {a.rating && (
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className={`w-3 h-3 ${i <= a.rating! ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{a.job_title} · {a.location}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.experience_years}y exp · {a.availability}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${PIPELINE_STAGES.find(s => s.key === a.stage)?.color}`}>
                  {PIPELINE_STAGES.find(s => s.key === a.stage)?.label}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(a.applied_at)}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ApplicantsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400 text-sm">Loading…</div>}>
      <ApplicantsInner />
    </Suspense>
  )
}
