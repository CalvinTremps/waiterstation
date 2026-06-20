'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Job, ROLE_LABELS, EMPLOYMENT_TYPE_LABELS, ROLE_CATEGORIES, EmploymentType } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import JobCard from './JobCard'
import CompanyBadge from './CompanyBadge'
import ApplyModal from './ApplyModal'

const EMPLOYMENT_TYPES: EmploymentType[] = ['permanent', 'seasonal', 'event']

export default function JobBrowser({
  jobs,
  currentRole,
  currentType,
  currentLocation,
  currentQuery,
  payOnly,
  totalLive,
  isMockData = false,
}: {
  jobs: Job[]
  currentRole: string
  currentType: string
  currentLocation: string
  currentQuery: string
  payOnly: boolean
  totalLive: number
  isMockData?: boolean
}) {
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null)
  const [visibleCount, setVisibleCount] = useState(20)
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

  return (
    <>
      {isMockData && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-xs text-amber-800 font-medium">
          Live listings are temporarily unavailable. Showing recent examples only.
        </div>
      )}
      {/* MOBILE */}
      <div className="md:hidden">
        <MobileFilters
          currentRole={currentRole}
          currentType={currentType}
          currentLocation={currentLocation}
          currentQuery={currentQuery}
          onUpdate={updateFilter}
          onClear={clearFilters}
        />
        <div className="mt-4 space-y-2.5 px-4 pb-24">
          {jobs.length > 0 && (
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest pb-1">
              {jobs.length} position{jobs.length !== 1 ? 's' : ''}
            </p>
          )}
          {jobs.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <p className="font-semibold text-gray-700">No jobs found</p>
              <p className="text-sm text-gray-400 mt-1">Try different filters or check back soon</p>
            </div>
          )}
          {jobs.slice(0, visibleCount).map(job => <JobCard key={job.id} job={job} />)}
          {visibleCount < jobs.length && (
            <div className="text-center pt-2 pb-4">
              <button
                onClick={() => setVisibleCount(c => c + 20)}
                className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 px-5 py-2.5 rounded-full hover:border-gray-400 hover:shadow-sm transition-all"
              >
                Show {Math.min(jobs.length - visibleCount, 20)} more jobs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP (Glassdoor layout) */}
      <div className="hidden md:flex flex-col bg-white" style={{ height: 'calc(100vh - var(--header-height))' }}>

        {/* Search bar */}
        <div className="bg-white shrink-0 pt-4 pb-0 flex flex-col items-center px-6 gap-1">
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
          {totalLive > 0 && (
            <p className="text-xs text-gray-400">{totalLive.toLocaleString()} live jobs across South Africa</p>
          )}
        </div>

        {/* Tab row */}
        <div className="bg-white border-b border-gray-200 shrink-0">
          <div className="max-w-[1440px] mx-auto w-full px-8 flex items-center gap-8">
            {(([['', 'All'], ...EMPLOYMENT_TYPES.map(t => [t, t === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[t]])] as Array<[string, string]>)).map(([val, label]) => (
              <button
                key={val || 'all'}
                onClick={() => updateFilter('type', val)}
                className={`text-sm py-3 border-b-2 transition-colors whitespace-nowrap ${
                  currentType === val
                    ? 'border-emerald-600 text-emerald-700 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 font-medium'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="flex-1" />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={payOnly}
                onChange={e => {
                  const next = new URLSearchParams()
                  if (currentRole) next.set('role', currentRole)
                  if (currentType) next.set('type', currentType)
                  if (currentLocation) next.set('location', currentLocation)
                  if (currentQuery) next.set('q', currentQuery)
                  if (e.target.checked) next.set('payOnly', '1')
                  router.push(`/?${next.toString()}`)
                }}
                className="w-3.5 h-3.5 accent-emerald-600"
              />
              <span className="text-xs text-gray-500 font-medium">Pay listed only</span>
            </label>
            <span className="text-xs text-gray-400">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
            </span>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-emerald-700 font-medium hover:underline">
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Two-column split */}
        <div className="flex flex-1 min-h-0 max-w-[1440px] mx-auto w-full">

          {/* LEFT: job list */}
          <div className="w-[420px] shrink-0 overflow-y-auto border-r border-gray-200 scrollbar-thin bg-[#F3F4F6]">
            {jobs.length === 0 && (
              <div className="text-center py-20 px-6">
                <p className="font-semibold text-gray-700">No jobs found</p>
                <p className="text-sm text-gray-400 mt-1">Try different filters</p>
              </div>
            )}
            <div className="py-2">
              {jobs.slice(0, visibleCount).map(job => (
                <DesktopJobRow
                  key={job.id}
                  job={job}
                  selected={selectedId === job.id}
                  onSelect={() => setSelectedId(job.id)}
                />
              ))}
              {visibleCount < jobs.length && (
                <div className="px-3 pb-3 pt-1 text-center">
                  <button
                    onClick={() => setVisibleCount(c => c + 20)}
                    className="text-sm font-medium text-emerald-700 hover:underline"
                  >
                    Show {Math.min(jobs.length - visibleCount, 20)} more jobs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: detail panel */}
          <div className="flex-1 overflow-y-auto bg-white scrollbar-thin">
            {selected
              ? <DesktopJobDetail job={selected} />
              : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Select a job to see details
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

/* Desktop search bar */
function DesktopSearchBar({ currentRole, currentLocation, currentQuery, onSearch }: {
  currentRole: string
  currentLocation: string
  currentQuery: string
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
    <form onSubmit={handleSubmit} className="flex items-center gap-0 max-w-3xl w-full">
      <div className="flex items-center gap-2 bg-[#F2F4F5] px-4 h-10 rounded-l-full min-w-0" style={{ flex: '0 0 auto', width: '180px' }}>
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <select
          ref={roleRef}
          defaultValue={currentRole}
          className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none appearance-none cursor-pointer min-w-0"
        >
          <option value="">All roles</option>
          {ROLE_CATEGORIES.map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>
      <div className="w-px h-6 bg-gray-300 shrink-0" />
      <div className="flex items-center gap-2 bg-[#F2F4F5] px-4 h-10 flex-1 min-w-0">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          ref={queryRef}
          type="text"
          defaultValue={currentQuery}
          placeholder="Keyword, e.g. sommelier..."
          className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent focus:outline-none min-w-0"
        />
      </div>
      <div className="w-px h-6 bg-gray-300 shrink-0" />
      <div className="flex items-center gap-2 bg-[#F2F4F5] px-4 h-10 flex-1 min-w-0">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/>
        </svg>
        <input
          ref={locationRef}
          type="text"
          defaultValue={currentLocation}
          placeholder="City, area or province..."
          className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent focus:outline-none min-w-0"
        />
      </div>
      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 transition text-white text-sm font-semibold px-5 h-10 rounded-r-full shrink-0">
        Search
      </button>
    </form>
  )
}

/* Desktop job row (left panel) */
function DesktopJobRow({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: () => void }) {
  const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 86400000)
  const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1d' : `${daysAgo}d`

  return (
    <div className="px-3 pb-2">
      <button
        onClick={onSelect}
        className={`w-full text-left rounded-xl border p-4 transition-all duration-150 ${
          selected
            ? 'border-emerald-300 bg-white shadow-md ring-1 ring-emerald-100'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:-translate-y-px'
        }`}
      >
        <div className="flex items-start gap-3">
          <CompanyBadge name={job.employer_name} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-gray-500 truncate leading-5">{job.employer_name}</p>
              <span className="text-xs text-gray-400 shrink-0 leading-5">{timeLabel}</span>
            </div>
            <p className="font-semibold text-sm leading-snug text-gray-900 mt-0.5 line-clamp-2">{job.title}</p>
            <p className="text-xs text-gray-500 mt-1">{job.location}</p>
            <div className="flex items-center gap-2 mt-2">
              {job.pay && <span className="text-xs text-gray-700 font-medium">{job.pay}</span>}
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {job.employment_type === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[job.employment_type]}
              </span>
            </div>
            {(() => {
              const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)
              return co ? (
                <p className="text-xs text-amber-500 mt-1">{'★'.repeat(Math.round(co.overall_rating))} {co.overall_rating.toFixed(1)}</p>
              ) : null
            })()}
          </div>
        </div>
      </button>
    </div>
  )
}

/* Desktop job detail (right panel) */
function DesktopJobDetail({ job }: { job: Job }) {
  const [showApply, setShowApply] = useState(false)

  const postedDate = new Date(job.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="px-10 py-8 max-w-3xl">
      {showApply && <ApplyModal job={job} onClose={() => setShowApply(false)} />}

      {/* Company row */}
      <div className="flex items-center gap-3 mb-5">
        <CompanyBadge name={job.employer_name} size="md" />
        <div>
          <p className="text-sm font-semibold text-gray-800 leading-tight">{job.employer_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{ROLE_LABELS[job.role_category]}</p>
        </div>
      </div>

      {/* Job title */}
      <h1 className="text-[26px] font-bold text-gray-900 leading-tight">{job.title}</h1>

      {/* Location / pay / type inline */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm text-gray-500">
        <span>{job.location}</span>
        {job.pay && (
          <>
            <span className="text-gray-300">·</span>
            <span className="text-gray-700 font-medium">{job.pay}</span>
          </>
        )}
        <span className="text-gray-300">·</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
          {job.employment_type === 'event' ? 'Event / Once-off' : EMPLOYMENT_TYPE_LABELS[job.employment_type]}
        </span>
      </div>

      {/* Apply button */}
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => setShowApply(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-emerald-700 transition text-sm"
        >
          Apply now
        </button>
        <span className="text-xs text-gray-400">No CV required · Takes 30 seconds</span>
      </div>

      {/* Key info box */}
      <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-800 mb-3">Why apply via Waiterstation?</p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-emerald-700">
            <span className="mt-0.5 text-emerald-500 font-bold">✓</span>
            <span>Apply in 30 seconds — no CV or account needed</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-emerald-700">
            <span className="mt-0.5 text-emerald-500 font-bold">✓</span>
            <span>Employers receive your details directly and respond fast</span>
          </li>
          {job.pay && (
            <li className="flex items-start gap-2 text-sm text-emerald-700">
              <span className="mt-0.5 text-emerald-500 font-bold">✓</span>
              <span>Advertised pay: <strong>{job.pay}</strong></span>
            </li>
          )}
        </ul>
      </div>

      {/* Job details grid */}
      <div className="mt-6 rounded-lg border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-800 mb-4">Job details</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Employment type</p>
            <p className="text-sm text-gray-700 font-medium">
              {job.employment_type === 'event' ? 'Event / Once-off' : EMPLOYMENT_TYPE_LABELS[job.employment_type]}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Location</p>
            <p className="text-sm text-gray-700 font-medium">{job.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Role</p>
            <p className="text-sm text-gray-700 font-medium">{ROLE_LABELS[job.role_category]}</p>
          </div>
          {job.pay && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Pay</p>
              <p className="text-sm text-gray-700 font-medium">{job.pay}</p>
            </div>
          )}
        </div>
      </div>

      {/* About this role */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-800 mb-3">About this role</p>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
      </div>

      {/* About the employer */}
      <div className="mt-6 rounded-lg border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-800 mb-3">About the employer</p>
        <div className="flex items-center gap-3">
          <CompanyBadge name={job.employer_name} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-800">{job.employer_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">Responds via Waiterstation</p>
          </div>
        </div>
      </div>

      {/* Company ratings */}
      {(() => {
        const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)
        if (!co) return null
        return (
          <div className="mt-4 rounded-lg border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">Company ratings</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400 text-lg leading-none">
                {'★'.repeat(Math.round(co.overall_rating))}{'☆'.repeat(5 - Math.round(co.overall_rating))}
              </span>
              <span className="text-sm font-semibold text-gray-700">{co.overall_rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">Based on {co.reviews.length} reviews</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {co.benefits.slice(0, 3).map(b => (
                <span key={b} className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded">
                  {b}
                </span>
              ))}
            </div>
            <a href={`/companies/${co.id}`} className="text-xs font-semibold text-emerald-700 hover:underline">
              See all reviews
            </a>
          </div>
        )
      })()}

      <p className="text-xs text-gray-400 mt-8 mb-4">{postedDate}</p>
    </div>
  )
}

/* Mobile filters */
function MobileFilters({ currentRole, currentType, currentLocation, currentQuery, onUpdate, onClear }: {
  currentRole: string
  currentType: string
  currentLocation: string
  currentQuery: string
  onUpdate: (key: string, value: string) => void
  onClear: () => void
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search job title or keyword..."
          defaultValue={currentQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
        />
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </span>
        <input
          type="search"
          placeholder="City or area..."
          defaultValue={currentLocation}
          onChange={e => handleLocation(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto scroll-no-bar pb-1 -mx-4 px-4">
        <MobilePill active={!currentRole} onTap={() => onUpdate('role', '')}>All roles</MobilePill>
        {ROLE_CATEGORIES.map(r => (
          <MobilePill key={r} active={currentRole === r} onTap={() => onUpdate('role', currentRole === r ? '' : r)}>
            {ROLE_LABELS[r]}
          </MobilePill>
        ))}
      </div>
      <div className="flex gap-1.5 bg-gray-100 rounded-lg p-1">
        {(['', ...EMPLOYMENT_TYPES] as const).map(t => (
          <button
            key={t || 'all'}
            onClick={() => onUpdate('type', t)}
            className={`flex-1 text-xs font-medium py-2 rounded-md transition whitespace-nowrap
              ${currentType === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t === '' ? 'All' : t === 'event' ? 'Event' : EMPLOYMENT_TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      {hasFilters && (
        <button onClick={onClear} className="text-xs text-emerald-700 font-medium underline underline-offset-2">
          Clear filters
        </button>
      )}
    </div>
  )
}

function MobilePill({ active, onTap, children }: { active: boolean; onTap: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onTap}
      className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-150 whitespace-nowrap
        ${active ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
    >
      {children}
    </button>
  )
}
