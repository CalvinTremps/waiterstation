'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Job, ROLE_LABELS, ROLE_CATEGORIES, RoleCategory, EMPLOYMENT_TYPE_LABELS } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyBadge from './CompanyBadge'

const RECENT_KEY = 'ws_recent_searches'

type RecentSearch = { label: string; href: string }

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

// ── List row (left column) ──────────────────────────────────────────
function NearbyRow({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: () => void }) {
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0 transition-colors ${
        selected ? 'bg-purple-50/60 border-l-2 border-l-purple-600' : 'hover:bg-gray-50 border-l-2 border-l-transparent'
      }`}
    >
      <CompanyBadge name={job.employer_name} size="sm" logoUrl={co?.logo_url} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-blue-700 truncate">{job.title}</p>
        <p className="text-xs text-gray-600 mt-0.5 truncate">{job.employer_name} — {job.location}</p>
        {job.pay && <p className="text-xs font-medium text-gray-700 mt-0.5">{job.pay}</p>}
      </div>
      <span className="shrink-0 text-[11px] text-gray-400 mt-0.5 whitespace-nowrap">{timeAgo(job.created_at)}</span>
    </button>
  )
}

// ── Detail panel (right column) ─────────────────────────────────────
function NearbyDetail({ job, onApply }: { job: Job; onApply: () => void }) {
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)
  const snippet = job.description.length > 360 ? job.description.slice(0, 360).trim() + '…' : job.description
  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        <CompanyBadge name={job.employer_name} size="md" logoUrl={co?.logo_url} />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{job.employer_name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{job.location}</p>
        </div>
      </div>

      <button
        onClick={onApply}
        className="mt-4 w-full h-11 flex items-center justify-center gap-1.5 text-white text-sm font-bold rounded-lg transition-colors"
        style={{ background: '#5b21b6' }}
      >
        Apply now
      </button>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-900 mb-2.5">Job details</p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center text-xs font-medium text-gray-700 bg-gray-100 rounded-md px-2.5 py-1">
            {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
          </span>
          {job.pay && (
            <span className="inline-flex items-center text-xs font-medium text-gray-700 bg-gray-100 rounded-md px-2.5 py-1">
              {job.pay}
            </span>
          )}
          <span className="inline-flex items-center text-xs font-medium text-gray-700 bg-gray-100 rounded-md px-2.5 py-1">
            {ROLE_LABELS[job.role_category]}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-900 mb-2">Description</p>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{snippet}</p>
      </div>
    </div>
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

  const displayJobs = (nearbyJobs.length > 0 ? nearbyJobs : allJobs).slice(0, 5)
  const [selectedId, setSelectedId] = useState(displayJobs[0]?.id ?? '')
  const selected = displayJobs.find(j => j.id === selectedId) ?? displayJobs[0]

  // ── Recent searches (localStorage) ──
  const [recent, setRecent] = useState<RecentSearch[]>([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) setRecent(JSON.parse(raw))
    } catch {}
  }, [])

  function pushRecent(label: string, href: string) {
    try {
      const next = [{ label, href }, ...recent.filter(r => r.href !== href)].slice(0, 6)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {}
  }

  function removeRecent(href: string) {
    const next = recent.filter(r => r.href !== href)
    setRecent(next)
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query.trim()) p.set('q', query.trim())
    if (location.trim()) p.set('location', location.trim())
    if (!query.trim() && !location.trim()) p.set('location', detectedCity)
    const href = `/jobs?${p.toString()}`
    const label = query.trim()
      ? `${query.trim()}${location.trim() ? ` in ${location.trim()}` : ''}`
      : `All jobs in ${location.trim() || detectedCity}`
    pushRecent(label, href)
    router.push(href)
  }

  function viewAllNearby() {
    const href = `/jobs?location=${encodeURIComponent(detectedCity)}`
    pushRecent(`All jobs in ${detectedCity}`, href)
    router.push(href)
  }

  function goToRole(role: RoleCategory) {
    router.push(`/jobs?role=${role}`)
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
            <a href="/auth/login" className="text-blue-600 hover:underline">Create a free profile</a>
            {' '}to apply to jobs easily.
          </p>
        </div>

        {/* ── Value-prop band ── */}
        <div className="max-w-3xl mx-auto px-5 pb-12">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Benefits card */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%)' }}>
              <p className="text-sm font-bold text-gray-900">One profile,</p>
              <p className="text-sm font-bold mb-4" style={{ color: '#5b21b6' }}>more opportunities.</p>
              <ul className="space-y-2.5">
                {['Better job matches', 'Apply with a single tap', 'Save jobs & track applications', 'Get hired faster'].map(b => (
                  <li key={b} className="flex items-center gap-2 text-xs text-gray-700">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center">
              <p className="text-base font-bold text-gray-900 mb-1.5">New to Waiterstation?</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-5 max-w-xs">
                Create a free profile to apply in seconds, save jobs, and let employers find you.
              </p>
              <a href="/auth/login"
                className="w-full max-w-[240px] h-11 flex items-center justify-center text-white text-sm font-bold rounded-lg mb-2"
                style={{ background: '#5b21b6' }}>
                Create a free profile
              </a>
              <p className="text-xs text-gray-500">
                Already have one?{' '}
                <a href="/auth/login" className="text-blue-600 hover:underline font-medium">Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent searches band ── */}
      {recent.length > 0 && (
        <div className="border-b border-gray-200" style={{ background: '#ececec' }}>
          <div className="max-w-3xl mx-auto px-5 py-5">
            <p className="text-xs font-bold text-gray-900 mb-2.5">Your Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {recent.map(r => (
                <span key={r.href}
                  className="inline-flex items-center bg-white border border-gray-200 rounded-full pl-1 pr-1 h-9 shadow-sm">
                  <button onClick={() => removeRecent(r.href)}
                    aria-label="Remove search"
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button onClick={() => router.push(r.href)}
                    className="flex items-center gap-2 pr-2.5 pl-1 text-xs font-medium text-gray-800 hover:text-gray-950">
                    {r.label}
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Content area ── */}
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">

        {/* Jobs near you — two-column preview */}
        {selected ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900 text-sm">
                {nearbyJobs.length > 0 ? 'Jobs' : 'All jobs'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {nearbyJobs.length > 0 ? `in ${detectedCity}` : 'across South Africa'}
              </p>
            </div>

            <div className="grid md:grid-cols-2">
              {/* Left list */}
              <div className="min-w-0 md:border-r border-gray-100">
                {displayJobs.map(job => (
                  <NearbyRow
                    key={job.id}
                    job={job}
                    selected={selected.id === job.id}
                    onSelect={() => setSelectedId(job.id)}
                  />
                ))}
                <div className="p-4">
                  <button onClick={viewAllNearby}
                    className="w-full h-10 border border-gray-300 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                    View All
                  </button>
                </div>
              </div>

              {/* Right detail (hidden on mobile) */}
              <div className="hidden md:block bg-white">
                <NearbyDetail job={selected} onApply={() => router.push(`/jobs/${selected.id}`)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-sm text-gray-400">No jobs available right now. Please check back soon.</p>
          </div>
        )}

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
        </div>

      </div>
    </div>
  )
}
