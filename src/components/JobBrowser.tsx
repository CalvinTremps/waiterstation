'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Job, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS, ROLE_CATEGORIES, EmploymentType } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyBadge from './CompanyBadge'
import ApplyModal from './ApplyModal'

const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'seasonal', 'event']

const EMP_COLORS: Record<string, string> = {
  permanent: 'bg-gray-100 text-gray-800',
  seasonal:  'bg-blue-50 text-blue-700',
  event:     'bg-purple-50 text-purple-700',
}

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function isNew(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000) <= 2
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function JobBrowser({
  jobs,
  currentRole,
  currentType,
  currentLocation,
  currentQuery,
  payOnly,
  totalLive,
  isMockData = false,
  isLoggedIn = false,
}: {
  jobs: Job[]
  currentRole: string
  currentType: string
  currentLocation: string
  currentQuery: string
  payOnly: boolean
  totalLive: number
  isMockData?: boolean
  isLoggedIn?: boolean
}) {
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null)
  const [visibleCount, setVisibleCount] = useState(20)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    setSelectedId(jobs[0]?.id ?? null)
    setVisibleCount(20)
  }, [jobs])

  const selected = jobs.find(j => j.id === selectedId) ?? null
  const hasFilters = currentRole || currentType || currentLocation || currentQuery || payOnly

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams()
    if (currentRole && key !== 'role') next.set('role', currentRole)
    if (currentType && key !== 'type') next.set('type', currentType)
    if (currentLocation && key !== 'location') next.set('location', currentLocation)
    if (currentQuery && key !== 'q') next.set('q', currentQuery)
    if (payOnly && key !== 'payOnly') next.set('payOnly', '1')
    if (value) next.set(key, value)
    router.push(`/?${next.toString()}`)
  }

  function clearFilters() { router.push('/') }

  function toggleSave(id: string) {
    setSavedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      {isMockData && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-700 font-medium">
          Live listings are temporarily unavailable — showing example data.
        </div>
      )}

      {/* ── MOBILE ── */}
      <div className="md:hidden">
        <MobileFilters
          currentRole={currentRole}
          currentType={currentType}
          currentLocation={currentLocation}
          currentQuery={currentQuery}
          onUpdate={updateFilter}
          onClear={clearFilters}
        />
        <div className="mt-3 pb-24">
          {jobs.length > 0 && (
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest px-4 pb-2">
              {jobs.length} position{jobs.length !== 1 ? 's' : ''}
            </p>
          )}
          {jobs.length === 0 && <EmptyState onClear={clearFilters} hasFilters={!!hasFilters} />}
          <div className="space-y-2 px-4">
            {jobs.slice(0, visibleCount).map(job => (
              <MobileJobCard key={job.id} job={job} saved={savedIds.has(job.id)} onToggleSave={() => toggleSave(job.id)} />
            ))}
          </div>
          {visibleCount < jobs.length && (
            <div className="text-center pt-4 pb-2">
              <button onClick={() => setVisibleCount(c => c + 20)}
                className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-5 py-2.5 rounded-full hover:border-gray-400 hover:shadow-sm transition-all">
                Show {Math.min(jobs.length - visibleCount, 20)} more jobs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-col bg-gray-50" style={{ height: 'calc(100vh - var(--header-height))' }}>

        {/* Search + filters */}
        <div className="bg-white border-b border-gray-200 shrink-0 px-6 pt-6 pb-0">
          <div className="max-w-[1440px] mx-auto">
            <DesktopSearchBar
              currentRole={currentRole}
              currentLocation={currentLocation}
              currentQuery={currentQuery}
              onSearch={(role, query, location) => {
                const next = new URLSearchParams()
                if (currentType) next.set('type', currentType)
                if (payOnly) next.set('payOnly', '1')
                if (role) next.set('role', role)
                if (query) next.set('q', query)
                if (location) next.set('location', location)
                router.push(`/?${next.toString()}`)
              }}
            />
            {/* Row 1: Employment type tabs */}
            <div className="flex items-center border-t border-gray-100">
              {([['', 'All jobs'], ...EMPLOYMENT_TYPES.map(t => [t, t === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[t]])] as Array<[string, string]>).map(([val, label]) => (
                <button key={val || 'all'} onClick={() => updateFilter('type', val)}
                  className={`text-sm py-3.5 px-5 border-b-2 transition whitespace-nowrap font-medium ${
                    currentType === val
                      ? 'border-gray-900 text-gray-800'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Row 2: Role pills + pay toggle */}
            <div className="flex items-center gap-3 border-t border-gray-100 py-4">
              <div className="flex gap-1.5 overflow-x-auto flex-1 no-scrollbar">
                <button onClick={() => updateFilter('role', '')}
                  className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${
                    !currentRole ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}>
                  All roles
                </button>
                {ROLE_CATEGORIES.map(r => (
                  <button key={r} onClick={() => updateFilter('role', currentRole === r ? '' : r)}
                    className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${
                      currentRole === r ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}>
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" checked={payOnly}
                    onChange={e => {
                      const next = new URLSearchParams()
                      if (currentRole) next.set('role', currentRole)
                      if (currentType) next.set('type', currentType)
                      if (currentLocation) next.set('location', currentLocation)
                      if (currentQuery) next.set('q', currentQuery)
                      if (e.target.checked) next.set('payOnly', '1')
                      router.push(`/?${next.toString()}`)
                    }}
                    className="w-3.5 h-3.5 accent-gray-900 cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Pay listed</span>
                </label>
                <span className="text-xs text-gray-400 font-medium">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</span>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-gray-800 font-semibold hover:underline">Clear</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column split */}
        <div className="flex flex-1 min-h-0 max-w-[1440px] mx-auto w-full">

          {/* LEFT: job list */}
          <div className="w-[400px] shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 scrollbar-thin">
            {jobs.length === 0 && <EmptyState onClear={clearFilters} hasFilters={!!hasFilters} />}
            <div className="p-3 space-y-2">
              {jobs.slice(0, visibleCount).map(job => (
                <DesktopJobCard
                  key={job.id}
                  job={job}
                  selected={selectedId === job.id}
                  saved={savedIds.has(job.id)}
                  onSelect={() => setSelectedId(job.id)}
                  onToggleSave={e => { e.stopPropagation(); toggleSave(job.id) }}
                />
              ))}
              {visibleCount < jobs.length && (
                <div className="text-center py-3">
                  <button onClick={() => setVisibleCount(c => c + 20)}
                    className="text-sm font-medium text-gray-800 hover:underline">
                    Show {Math.min(jobs.length - visibleCount, 20)} more
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: detail panel */}
          <div className="flex-1 overflow-y-auto bg-white scrollbar-thin">
            {selected
              ? <DesktopJobDetail job={selected} isLoggedIn={isLoggedIn} />
              : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Select a job to see details</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Desktop search bar ────────────────────────────────────────────────────────

function DesktopSearchBar({ currentRole, currentLocation, currentQuery, onSearch }: {
  currentRole: string; currentLocation: string; currentQuery: string
  onSearch: (role: string, query: string, location: string) => void
}) {
  const roleRef = useRef<HTMLSelectElement>(null)
  const queryRef = useRef<HTMLInputElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(roleRef.current?.value ?? '', queryRef.current?.value ?? '', locationRef.current?.value ?? '')
  }

  return (
    <form onSubmit={handleSubmit}
      className="flex items-center w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Role */}
      <div className="flex items-center gap-2 px-4 h-11 shrink-0" style={{ width: 190 }}>
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <select ref={roleRef} defaultValue={currentRole}
          className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none appearance-none cursor-pointer">
          <option value="">All roles</option>
          {ROLE_CATEGORIES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>
      <div className="w-px h-6 bg-gray-200 shrink-0" />
      {/* Keyword */}
      <div className="flex items-center gap-2 px-4 h-11 flex-1 min-w-0">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <input ref={queryRef} type="text" defaultValue={currentQuery}
          placeholder="Job title or keyword…"
          className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent focus:outline-none min-w-0" />
      </div>
      <div className="w-px h-6 bg-gray-200 shrink-0" />
      {/* Location */}
      <div className="flex items-center gap-2 px-4 h-11 flex-1 min-w-0">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <input ref={locationRef} type="text" defaultValue={currentLocation}
          placeholder="City or province…"
          className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent focus:outline-none min-w-0" />
      </div>
      <button type="submit"
        className="bg-gray-900 hover:bg-gray-800 transition text-white text-sm font-semibold px-6 h-11 shrink-0 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
        Search
      </button>
    </form>
  )
}

// ─── Desktop job card (left panel) ────────────────────────────────────────────

function DesktopJobCard({ job, selected, saved, onSelect, onToggleSave }: {
  job: Job; selected: boolean; saved: boolean
  onSelect: () => void; onToggleSave: (e: React.MouseEvent) => void
}) {
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)

  return (
    <div role="button" tabIndex={0} onClick={onSelect}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect() }}
      className={`w-full text-left rounded-xl border p-4 transition-all group cursor-pointer ${
        selected
          ? 'border-gray-500 bg-white shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}>
      <div className="flex items-start gap-3">
        <CompanyBadge name={job.employer_name} size="sm" />
        <div className="flex-1 min-w-0">
          {/* Top row: company + time + save */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-xs text-gray-500 truncate leading-none">{job.employer_name}</p>
              {job.franchise_name && job.brand_link_status === 'approved' && (
                <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full shrink-0">Franchise</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isNew(job.created_at) && (
                <span className="text-[10px] font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">New</span>
              )}
              <span className="text-[11px] text-gray-400">{timeAgo(job.created_at)}</span>
              <button onClick={onToggleSave}
                className="p-0.5 text-gray-300 hover:text-gray-700 transition opacity-0 group-hover:opacity-100">
                <svg className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  style={{ color: saved ? '#10b981' : undefined }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Title */}
          <p className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2 mb-1">{job.title}</p>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="truncate">{job.location}</span>
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${EMP_COLORS[job.employment_type] ?? 'bg-gray-100 text-gray-600'}`}>
              {job.employment_type === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[job.employment_type]}
            </span>
            {job.pay && (
              <span className="text-[11px] font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                {job.pay}
              </span>
            )}
          </div>

          {/* Rating */}
          {co && (
            <div className="mt-2">
              <StarRating rating={co.overall_rating} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Desktop job detail (right panel) ─────────────────────────────────────────

function DesktopJobDetail({ job, isLoggedIn }: { job: Job; isLoggedIn: boolean }) {
  const [showApply, setShowApply] = useState(false)
  const router = useRouter()
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)

  const postedDate = new Date(job.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  function handleApply() {
    if (!isLoggedIn) { router.push('/auth/login?next=/'); return }
    setShowApply(true)
  }

  return (
    <div className="flex flex-col h-full">
      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}

      {/* Sticky header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-8 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <CompanyBadge name={job.employer_name} size="md" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">{job.employer_name}</p>
              <h1 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {job.location}
                </span>
                {job.pay && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs font-semibold text-gray-800">{job.pay}</span>
                  </>
                )}
                <span className="text-gray-300">·</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${EMP_COLORS[job.employment_type] ?? 'bg-gray-100 text-gray-600'}`}>
                  {job.employment_type === 'event' ? 'Event / Once-off' : EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {job.source_url && (
              <a href={job.source_url} target="_blank" rel="noopener noreferrer"
                className="text-xs border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 font-medium px-3 py-2 rounded-lg transition">
                Original ↗
              </a>
            )}
            <button onClick={handleApply}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition">
              Apply now
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

        {/* Quick details pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: '🏢', label: ROLE_LABELS[job.role_category] },
            { icon: '📍', label: job.location },
            { icon: '📅', label: postedDate },
            ...(job.pay ? [{ icon: '💰', label: job.pay }] : []),
          ].map(d => (
            <div key={d.label} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>

        {!isLoggedIn && (
          <p className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5">
            <a href="/auth/login?next=/" className="text-gray-900 font-semibold hover:underline">Sign in</a> or{' '}
            <a href="/auth/login?next=/" className="text-gray-900 font-semibold hover:underline">create a free account</a> to apply — takes 30 seconds.
          </p>
        )}

        {/* Description */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>About this role</span>
            <div className="flex-1 h-px bg-gray-100" />
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</div>
        </div>

        {/* Job details */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>Job details</span>
            <div className="flex-1 h-px bg-gray-100" />
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Employment type', value: job.employment_type === 'event' ? 'Event / Once-off' : EMPLOYMENT_TYPE_LABELS[job.employment_type] },
              { label: 'Location', value: job.location },
              { label: 'Role category', value: ROLE_LABELS[job.role_category] },
              ...(job.pay ? [{ label: 'Pay', value: job.pay }] : []),
              ...(job.category_label ? [{ label: 'Industry', value: job.category_label }] : []),
              { label: 'Date posted', value: postedDate },
            ].map(d => (
              <div key={d.label}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{d.label}</p>
                <p className={`text-sm font-medium ${d.label === 'Pay' ? 'text-gray-800' : 'text-gray-800'}`}>{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>About the employer</span>
            <div className="flex-1 h-px bg-gray-100" />
          </h2>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CompanyBadge name={job.employer_name} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{job.employer_name}</p>
                {co ? (
                  <>
                    <div className="mt-1.5">
                      <StarRating rating={co.overall_rating} count={co.reviews.length} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{co.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {co.benefits.slice(0, 4).map(b => (
                        <span key={b} className="text-[11px] text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{b}</span>
                      ))}
                    </div>
                    <a href={`/companies/${co.id}`} className="inline-block mt-3 text-xs font-semibold text-gray-800 hover:underline">
                      See company profile & reviews →
                    </a>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Responds via Waiterstation</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom apply */}
        <div className="pt-2 pb-6">
          <button onClick={handleApply}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-sm transition">
            Apply for this position
          </button>
          {!isLoggedIn && (
            <p className="text-xs text-center text-gray-400 mt-2">
              <a href="/auth/login?next=/" className="text-gray-900 font-medium hover:underline">Sign in</a> required to apply
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Mobile job card ───────────────────────────────────────────────────────────

function MobileJobCard({ job, saved, onToggleSave }: {
  job: Job; saved: boolean; onToggleSave: () => void
}) {
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)

  return (
    <a href={`/jobs/${job.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <CompanyBadge name={job.employer_name} size="sm" />
          <p className="text-xs text-gray-500 truncate">{job.employer_name}</p>
          {job.franchise_name && job.brand_link_status === 'approved' && (
            <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full shrink-0">Franchise</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isNew(job.created_at) && (
            <span className="text-[10px] font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">New</span>
          )}
          <button onClick={e => { e.preventDefault(); onToggleSave() }}
            className="text-gray-300 hover:text-gray-700 transition">
            <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              style={{ color: saved ? '#10b981' : undefined }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
        </div>
      </div>
      <p className="font-semibold text-sm text-gray-900 mb-1 leading-snug">{job.title}</p>
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        {job.location}
        <span className="text-gray-300 mx-1">·</span>
        {timeAgo(job.created_at)}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${EMP_COLORS[job.employment_type] ?? 'bg-gray-100 text-gray-600'}`}>
          {job.employment_type === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[job.employment_type]}
        </span>
        {job.pay && (
          <span className="text-[11px] font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
            {job.pay}
          </span>
        )}
      </div>
      {co && (
        <div className="mt-2">
          <StarRating rating={co.overall_rating} />
        </div>
      )}
    </a>
  )
}

// ─── Mobile filters ────────────────────────────────────────────────────────────

function MobileFilters({ currentRole, currentType, currentLocation, currentQuery, onUpdate, onClear }: {
  currentRole: string; currentType: string; currentLocation: string; currentQuery: string
  onUpdate: (key: string, value: string) => void; onClear: () => void
}) {
  const hasFilters = currentRole || currentType || currentLocation || currentQuery
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const locationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(val: string) {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => onUpdate('q', val), 400)
  }
  function handleLocation(val: string) {
    if (locationTimer.current) clearTimeout(locationTimer.current)
    locationTimer.current = setTimeout(() => onUpdate('location', val), 400)
  }

  return (
    <div className="space-y-3 px-4 pt-5">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </span>
        <input type="search" placeholder="Job title or keyword…" defaultValue={currentQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm" />
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </span>
        <input type="search" placeholder="City or province…" defaultValue={currentLocation}
          onChange={e => handleLocation(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm" />
      </div>
      {/* Role pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        <MobilePill active={!currentRole} onTap={() => onUpdate('role', '')}>All roles</MobilePill>
        {ROLE_CATEGORIES.map(r => (
          <MobilePill key={r} active={currentRole === r} onTap={() => onUpdate('role', currentRole === r ? '' : r)}>
            {ROLE_LABELS[r]}
          </MobilePill>
        ))}
      </div>
      {/* Employment type */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(['', ...EMPLOYMENT_TYPES] as const).map(t => (
          <button key={t || 'all'} onClick={() => onUpdate('type', t)}
            className={`flex-1 text-xs font-medium py-2 rounded-lg transition whitespace-nowrap ${
              currentType === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === '' ? 'All' : t === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      {hasFilters && (
        <button onClick={onClear} className="text-xs text-gray-800 font-semibold underline underline-offset-2">
          Clear filters
        </button>
      )}
    </div>
  )
}

function MobilePill({ active, onTap, children }: { active: boolean; onTap: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onTap}
      className={`shrink-0 text-xs font-medium px-3.5 py-2 rounded-full border transition whitespace-nowrap ${
        active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
      }`}>
      {children}
    </button>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <p className="font-semibold text-gray-700 text-sm">No jobs found</p>
      <p className="text-xs text-gray-400 mt-1 mb-4">
        {hasFilters ? 'Try adjusting your filters' : 'Check back soon — new listings go live daily'}
      </p>
      {hasFilters && (
        <button onClick={onClear}
          className="text-xs font-semibold text-gray-800 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-100 transition">
          Clear all filters
        </button>
      )}
    </div>
  )
}
