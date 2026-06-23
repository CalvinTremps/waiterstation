'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Job, ROLE_LABELS, ROLE_CATEGORIES, RoleCategory } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyBadge from './CompanyBadge'

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function NearbyJobCard({ job, onViewAll }: { job: Job; onViewAll: () => void }) {
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)
  return (
    <button onClick={onViewAll}
      className="w-full text-left flex items-start justify-between gap-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-5 px-5 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <CompanyBadge name={job.employer_name} size="sm" logoUrl={co?.logo_url} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-700 hover:underline truncate">{job.title}</p>
          <p className="text-xs text-gray-600 mt-0.5">{job.employer_name} — {job.location}</p>
          {job.pay && <p className="text-xs text-gray-500 mt-0.5">{job.pay}</p>}
        </div>
      </div>
      <span className="shrink-0 text-xs text-gray-400 mt-0.5 whitespace-nowrap">{timeAgo(job.created_at)}</span>
    </button>
  )
}

export default function LandingPage({
  nearbyJobs,
  allJobs,
  detectedCity,
  totalLive,
  roleCounts,
}: {
  nearbyJobs: Job[]
  allJobs: Job[]
  detectedCity: string
  totalLive: number
  roleCounts: Record<string, number>
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState(detectedCity)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query.trim()) p.set('q', query.trim())
    if (location.trim()) p.set('location', location.trim())
    if (!query.trim() && !location.trim()) p.set('q', 'hospitality')
    router.push(`/?${p.toString()}`)
  }

  function viewAllNearby() {
    router.push(`/?location=${encodeURIComponent(detectedCity)}`)
  }

  function goToRole(role: RoleCategory) {
    router.push(`/?role=${role}`)
  }

  return (
    <div className="min-h-screen" style={{ background: '#f4f4f4' }}>

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-7 leading-tight tracking-tight">
            One Search, Thousands of Jobs
          </h1>

          <form onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch gap-2 max-w-2xl mx-auto">
            {/* Keyword field */}
            <div className="flex-1 relative">
              <label className="absolute -top-[9px] left-3 bg-white px-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wide z-10">
                Job Title, Skills or Keyword
              </label>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. Waiter, Chef, Bartender"
                className="w-full h-12 border border-gray-300 rounded-md px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 bg-white"
              />
            </div>
            {/* Location field */}
            <div className="sm:w-56 relative">
              <label className="absolute -top-[9px] left-3 bg-white px-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wide z-10">
                City or Province
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Cape Town"
                className="w-full h-12 border border-gray-300 rounded-md px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 bg-white"
              />
            </div>
            <button type="submit"
              className="h-12 px-7 font-bold text-sm text-white rounded-md transition-colors whitespace-nowrap"
              style={{ background: '#5b21b6' }}>
              Search Jobs
            </button>
          </form>

          <p className="mt-3 text-xs text-gray-500">
            <a href="/auth/signup" className="text-blue-600 hover:underline">Create a free profile</a>
            {' '}to apply to jobs easily.
          </p>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">

        {/* Jobs near you */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Jobs near you</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {nearbyJobs.length > 0
                  ? `${nearbyJobs.length} position${nearbyJobs.length !== 1 ? 's' : ''} in ${detectedCity}`
                  : `Showing all positions across South Africa`}
              </p>
            </div>
          </div>

          {/* Job list */}
          <div className="px-5">
            {nearbyJobs.length > 0
              ? nearbyJobs.slice(0, 5).map(job => (
                  <NearbyJobCard key={job.id} job={job} onViewAll={viewAllNearby} />
                ))
              : allJobs.slice(0, 5).map(job => (
                  <NearbyJobCard key={job.id} job={job} onViewAll={() => router.push('/?q=hospitality')} />
                ))
            }
            {nearbyJobs.length === 0 && allJobs.length === 0 && (
              <p className="py-6 text-sm text-gray-400 text-center">
                No jobs match your search. Please try a different query.
              </p>
            )}
          </div>

          {/* View All button */}
          <div className="px-5 py-4 border-t border-gray-100">
            <button onClick={viewAllNearby}
              className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline py-1">
              View All jobs{nearbyJobs.length > 0 ? ` in ${detectedCity}` : ' in South Africa'}
            </button>
          </div>
        </div>

        {/* Browse by role */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900 text-sm">Browse Waiterstation</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse hospitality jobs by role, view salary information, and discover top employers.
            </p>
          </div>

          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {ROLE_CATEGORIES.filter(r => r !== 'other').map(role => {
                const count = roleCounts[role]
                return (
                  <button key={role} onClick={() => goToRole(role)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium py-0.5">
                    {ROLE_LABELS[role]}{count ? ` (${count})` : ''}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-3" style={{ background: 'linear-gradient(to bottom, #f4f4f4, transparent)' }} />
        </div>

      </div>
    </div>
  )
}
