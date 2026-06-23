'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FEED_JOBS, FeedJob } from '@/lib/mock-worker'

const SCORE_COLOR = (s: number) =>
  s >= 9 ? 'text-green-700 bg-green-50' :
  s >= 7 ? 'text-amber-700 bg-amber-50' :
  'text-gray-600 bg-gray-100'

const SCORE_LABEL = (s: number) =>
  s === 10 ? 'Perfect match' : s >= 9 ? 'Excellent match' : s >= 7 ? 'Good match' : 'Possible match'

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < score ? (score >= 9 ? 'bg-green-500' : score >= 7 ? 'bg-amber-400' : 'bg-gray-400') : 'bg-gray-200'}`} />
      ))}
    </div>
  )
}

export default function JobFeedPage() {
  const [jobs, setJobs] = useState<FeedJob[]>(FEED_JOBS)
  const [filter, setFilter] = useState<'all' | 'saved' | 'applied'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [justApplied, setJustApplied] = useState<string | null>(null)

  const displayed = jobs.filter(j => {
    if (filter === 'saved') return j.saved
    if (filter === 'applied') return j.applied
    return true
  })

  function toggleSave(id: string) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, saved: !j.saved } : j))
  }

  function applyNow(id: string) {
    setJustApplied(id)
    setJobs(prev => prev.map(j => j.id === id ? { ...j, applied: true } : j))
    setTimeout(() => setJustApplied(null), 3000)
  }

  const newCount = jobs.filter(j => j.posted_days_ago === 0).length
  const highMatchCount = jobs.filter(j => j.match_score >= 9).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Feed</h1>
        <p className="text-sm text-gray-500 mt-0.5">Personalised matches based on your profile, location, and availability</p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {highMatchCount > 0 && (
          <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
            {highMatchCount} excellent match{highMatchCount > 1 ? 'es' : ''}
          </span>
        )}
        {newCount > 0 && (
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
            {newCount} posted today
          </span>
        )}
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
          {jobs.filter(j => !j.applied).length} not yet applied
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['all', 'saved', 'applied'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition capitalize ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f === 'all' ? `All (${jobs.length})` : f === 'saved' ? `Saved (${jobs.filter(j => j.saved).length})` : `Applied (${jobs.filter(j => j.applied).length})`}
          </button>
        ))}
      </div>

      {/* Job cards */}
      <div className="space-y-3">
        {displayed.map(job => {
          const expanded = expandedId === job.id
          return (
            <div key={job.id}
              className={`bg-white border rounded-xl overflow-hidden transition-all ${job.match_score >= 9 ? 'border-green-200' : 'border-gray-200'}`}>
              {/* Main row */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Logo */}
                  <div className={`w-11 h-11 rounded-xl ${job.logo_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {job.logo_initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      {job.urgent && (
                        <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full shrink-0">Urgent</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{job.employer}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {job.location} · {job.distance_km}km
                      </span>
                      <span className="text-xs font-semibold text-gray-700">{job.pay}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{job.shift_type}</span>
                    </div>
                  </div>

                  {/* Save button */}
                  <button onClick={() => toggleSave(job.id)}
                    className={`mt-0.5 p-1.5 rounded-lg transition shrink-0 ${job.saved ? 'text-gray-900 bg-gray-100' : 'text-gray-300 hover:text-gray-500'}`}>
                    <svg className="w-4 h-4" fill={job.saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                  </button>
                </div>

                {/* Match score */}
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SCORE_COLOR(job.match_score)}`}>
                      {job.match_score}/10 · {SCORE_LABEL(job.match_score)}
                    </span>
                    <ScoreDots score={job.match_score} />
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {job.posted_days_ago === 0 ? 'Posted today' : job.posted_days_ago === 1 ? '1 day ago' : `${job.posted_days_ago} days ago`}
                  </span>
                </div>

                {/* Match reasons (expandable) */}
                <button onClick={() => setExpandedId(expanded ? null : job.id)}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition">
                  <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                  Why this match?
                </button>

                {expanded && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {job.match_reasons.map((r, i) => (
                      <span key={i} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-3 flex items-center gap-2">
                  {job.applied ? (
                    <span className={`flex-1 text-center text-sm font-semibold py-2 rounded-lg transition ${justApplied === job.id ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {justApplied === job.id ? 'Applied!' : 'Applied'}
                    </span>
                  ) : (
                    <button onClick={() => applyNow(job.id)}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2 rounded-lg transition">
                      One-tap Apply
                    </button>
                  )}
                  <Link href="/jobs"
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    View
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
        {displayed.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No jobs in this filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
