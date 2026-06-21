'use client'

import { useState } from 'react'
import { EMPLOYER_JOBS, MOCK_APPLICANTS, MOCK_INTERVIEWS, PIPELINE_STAGES } from '@/lib/mock-recruitment'

const stageCounts = PIPELINE_STAGES.map(s => ({
  ...s,
  count: MOCK_APPLICANTS.filter(a => a.stage === s.key).length,
}))

const upcomingInterviews = MOCK_INTERVIEWS
  .filter(i => i.outcome === 'pending')
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 3)

const recentApplicants = [...MOCK_APPLICANTS]
  .sort((a, b) => b.applied_at.localeCompare(a.applied_at))
  .slice(0, 5)

const liveJobs = EMPLOYER_JOBS.filter(j => j.status === 'live')
const totalViews = EMPLOYER_JOBS.reduce((s, j) => s + j.views, 0)
const totalApplicants = MOCK_APPLICANTS.length

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
}

const STAGE_ORDER: Record<string, number> = {
  new: 0, reviewed: 1, shortlisted: 2, interview: 3, offered: 4, hired: 5, rejected: 6,
}

export default function EmployerDashboard() {
  const [dismissedBanner, setDismissedBanner] = useState(false)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">One&Only Cape Town</p>
        </div>
        <a href="/post-job"
          className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Post a Job
        </a>
      </div>

      {/* Offer banner */}
      {!dismissedBanner && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-emerald-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </span>
            <p className="text-sm text-emerald-800 font-medium">Lerato Molefe has received your offer — waiting on response.</p>
          </div>
          <button onClick={() => setDismissedBanner(true)} className="text-emerald-500 hover:text-emerald-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Live Listings" value={liveJobs.length} sub="of 6 total" icon="📋" color="text-emerald-600" />
        <StatCard label="Total Applicants" value={totalApplicants} sub="across all listings" icon="👥" color="text-blue-600" />
        <StatCard label="Total Views" value={totalViews} sub="last 30 days" icon="👁️" color="text-purple-600" />
        <StatCard label="Interviews Booked" value={upcomingInterviews.length} sub="coming up" icon="📅" color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pipeline overview */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pipeline</h2>
            <a href="/employer/applicants" className="text-xs text-emerald-600 font-medium hover:underline">View all</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stageCounts.filter(s => !['hired','rejected'].includes(s.key)).map(s => (
              <a key={s.key} href="/employer/applicants"
                className="text-center bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition cursor-pointer">
                <p className="text-2xl font-bold text-gray-900">{s.count}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </a>
            ))}
          </div>

          {/* Recent applicants */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent applicants</p>
          <div className="space-y-1">
            {recentApplicants.map(a => (
              <a key={a.id} href={`/employer/applicants/${a.id}`}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition">
                <div className={`w-9 h-9 rounded-full ${a.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {a.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{a.name}</p>
                  <p className="text-xs text-gray-500 truncate">{a.job_title}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PIPELINE_STAGES.find(s => s.key === a.stage)?.color}`}>
                    {PIPELINE_STAGES.find(s => s.key === a.stage)?.label}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{timeAgo(a.applied_at)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Upcoming interviews */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Upcoming Interviews</h2>
              <a href="/employer/interviews" className="text-xs text-emerald-600 font-medium hover:underline">All</a>
            </div>
            {upcomingInterviews.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming interviews</p>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.map(i => (
                  <div key={i.id} className="flex items-start gap-3">
                    <div className="bg-emerald-50 text-emerald-700 rounded-xl px-3 py-2 text-center shrink-0 min-w-[48px]">
                      <p className="text-sm font-bold leading-none">{new Date(i.date).toLocaleDateString('en-ZA', { day: 'numeric' })}</p>
                      <p className="text-[11px] leading-none mt-1">{new Date(i.date).toLocaleDateString('en-ZA', { month: 'short' })}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{i.applicant_name}</p>
                      <p className="text-xs text-gray-500 truncate">{i.time} · {i.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active listings */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Active Listings</h2>
              <a href="/employer/listings" className="text-xs text-emerald-600 font-medium hover:underline">All</a>
            </div>
            <div className="space-y-3">
              {liveJobs.slice(0, 3).map(j => (
                <div key={j.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{j.title}</p>
                    <p className="text-xs text-gray-400">{j.applicants} applicants · {j.views} views</p>
                  </div>
                  <div className="shrink-0 w-16 h-6 flex items-end gap-px">
                    {j.daily_views.slice(-7).map((v, i) => (
                      <div key={i} className="flex-1 bg-emerald-200 rounded-sm"
                        style={{ height: `${Math.max(10, (v / Math.max(...j.daily_views)) * 24)}px` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, sub, icon, color }: {
  label: string; value: number; sub: string; icon: string; color: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  )
}
