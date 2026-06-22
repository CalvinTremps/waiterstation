'use client'

import { useState } from 'react'
import { EMPLOYER_JOBS, ANALYTICS_SERIES } from '@/lib/mock-recruitment'

const BAR_MAX_H = 80

function BarChart({ data, maxVal, color }: { data: { label: string; value: number }[]; maxVal: number; color: string }) {
  return (
    <div className="flex items-end gap-0.5" style={{ height: `${BAR_MAX_H + 20}px` }}>
      {data.map((d, i) => {
        const barH = maxVal > 0 ? Math.max(3, Math.round((d.value / maxVal) * BAR_MAX_H)) : 3
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group relative" style={{ height: `${BAR_MAX_H + 20}px` }}>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
              {d.value}
            </div>
            <div className={`w-full ${color} rounded-t`} style={{ height: `${barH}px` }} />
            <span className="text-[9px] text-gray-400 leading-none shrink-0">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function AnalyticsPage() {
  const [selectedJob, setSelectedJob] = useState<string>('all')

  const liveJobs = EMPLOYER_JOBS.filter(j => j.status !== 'draft')

  const viewsData = ANALYTICS_SERIES.map(s => ({ label: s.date.split(' ')[0], value: s.views }))
  const appliesData = ANALYTICS_SERIES.map(s => ({ label: s.date.split(' ')[0], value: s.applies }))

  const maxViews = Math.max(...viewsData.map(d => d.value))
  const maxApplies = Math.max(...appliesData.map(d => d.value))

  const totalViews = EMPLOYER_JOBS.reduce((s, j) => s + j.views, 0)
  const totalApplicants = EMPLOYER_JOBS.reduce((s, j) => s + j.applicants, 0)
  const avgConversion = totalViews > 0 ? ((totalApplicants / totalViews) * 100).toFixed(1) : '0.0'

  const topJob = [...EMPLOYER_JOBS].sort((a, b) => b.views - a.views)[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Last 14 days across all listings</p>
        </div>
        <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500">
          <option value="all">All listings</option>
          {liveJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total views', value: totalViews.toLocaleString(), change: '+12%', up: true },
          { label: 'Applications', value: totalApplicants.toLocaleString(), change: '+8%', up: true },
          { label: 'Apply rate', value: `${avgConversion}%`, change: '+0.4pp', up: true },
          { label: 'Avg. time to apply', value: '2.3 days', change: '-0.5d', up: true },
        ].map(k => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-medium">{k.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{k.value}</p>
            <p className={`text-xs font-semibold mt-1 ${k.up ? 'text-gray-900' : 'text-red-500'}`}>{k.change} vs prev period</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Daily Views</h2>
            <span className="text-xs text-gray-400">Last 14 days</span>
          </div>
          <div className="overflow-x-auto">
            <div style={{ minWidth: '280px' }}>
              <BarChart data={viewsData} maxVal={maxViews} color="bg-white0" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Daily Applications</h2>
            <span className="text-xs text-gray-400">Last 14 days</span>
          </div>
          <div className="overflow-x-auto">
            <div style={{ minWidth: '280px' }}>
              <BarChart data={appliesData} maxVal={maxApplies} color="bg-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Per-listing breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Per-listing Performance</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="hidden md:grid grid-cols-[2fr_80px_80px_100px_120px] gap-4 px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span>Listing</span>
            <span>Views</span>
            <span>Applied</span>
            <span>Conv. rate</span>
            <span>Trend</span>
          </div>
          {liveJobs.map(j => {
            const conv = j.views > 0 ? ((j.applicants / j.views) * 100).toFixed(1) : '0.0'
            const max = Math.max(...j.daily_views, 1)
            return (
              <div key={j.id} className="px-5 py-4">
                {/* Mobile */}
                <div className="md:hidden">
                  <p className="font-semibold text-sm text-gray-900">{j.title}</p>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span>{j.views} views</span>
                    <span>{j.applicants} applied</span>
                    <span>{conv}% conv.</span>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[2fr_80px_80px_100px_120px] gap-4 items-center">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 truncate">{j.title}</p>
                    <p className="text-xs text-gray-400 truncate">{j.location}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{j.views}</span>
                  <span className="text-sm font-semibold text-gray-800">{j.applicants}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-700 rounded-full"
                        style={{ width: `${Math.min(100, parseFloat(conv) * 10)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-10">{conv}%</span>
                  </div>
                  <div className="flex items-end gap-px h-8 w-28">
                    {(j.daily_views.length ? j.daily_views : [0]).slice(-10).map((v, i) => (
                      <div key={i} className="flex-1 bg-gray-300 rounded-sm"
                        style={{ height: `${Math.max(15, (v / max) * 100)}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Hiring Funnel — All Listings</h2>
        <div className="space-y-2">
          {[
            { label: 'Views', value: totalViews, color: 'bg-gray-200' },
            { label: 'Applications', value: totalApplicants, color: 'bg-blue-300' },
            { label: 'Shortlisted', value: 6, color: 'bg-gray-300' },
            { label: 'Interviewed', value: 4, color: 'bg-purple-300' },
            { label: 'Offered', value: 2, color: 'bg-amber-300' },
            { label: 'Hired', value: 0, color: 'bg-gray-900' },
          ].map((f, i, arr) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24 text-right shrink-0">{f.label}</span>
              <div className="flex-1 bg-white rounded-full h-6 overflow-hidden">
                <div className={`h-full ${f.color} rounded-full flex items-center justify-end pr-2 transition-all`}
                  style={{ width: `${Math.max(2, (f.value / totalViews) * 100)}%` }}>
                  <span className="text-xs font-bold text-white">{f.value}</span>
                </div>
              </div>
              {i > 0 && arr[i-1].value > 0 && (
                <span className="text-xs text-gray-400 shrink-0 w-12">
                  {((f.value / arr[i-1].value) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
