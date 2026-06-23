'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Job, ROLE_LABELS, ROLE_CATEGORIES, RoleCategory } from '@/lib/types'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyBadge from './CompanyBadge'

const ROLE_ICONS: Record<string, string> = {
  waiter: '🍽️',
  bartender: '🍸',
  chef: '👨‍🍳',
  kitchen: '🔪',
  housekeeping: '🏨',
  front_desk: '🛎️',
  barista: '☕',
  host: '🤝',
  manager: '📋',
  other: '⭐',
}

const ROLE_COLORS: Record<string, string> = {
  waiter: 'bg-amber-50 border-amber-100 hover:border-amber-300',
  bartender: 'bg-purple-50 border-purple-100 hover:border-purple-300',
  chef: 'bg-orange-50 border-orange-100 hover:border-orange-300',
  kitchen: 'bg-red-50 border-red-100 hover:border-red-300',
  housekeeping: 'bg-blue-50 border-blue-100 hover:border-blue-300',
  front_desk: 'bg-teal-50 border-teal-100 hover:border-teal-300',
  barista: 'bg-yellow-50 border-yellow-100 hover:border-yellow-300',
  host: 'bg-pink-50 border-pink-100 hover:border-pink-300',
  manager: 'bg-gray-50 border-gray-200 hover:border-gray-400',
  other: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300',
}

const SA_CITIES = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein']

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function NearbyJobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const co = MOCK_COMPANIES.find(c => c.name === job.employer_name)

  return (
    <button onClick={onClick} className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-400 hover:shadow-md transition-all group">
      <div className="flex items-start gap-3">
        <CompanyBadge name={job.employer_name} size="md" logoUrl={co?.logo_url} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400 truncate">{job.employer_name}</p>
          <p className="font-semibold text-sm text-gray-900 leading-snug mt-0.5 line-clamp-2 group-hover:text-gray-700">{job.title}</p>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {job.location}
            </span>
            {job.pay && <span className="text-xs font-bold text-gray-800">{job.pay}</span>}
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">{timeAgo(job.created_at)}</p>
        </div>
      </div>
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
    router.push(`/?${p.toString()}`)
  }

  function goToRole(role: RoleCategory) {
    router.push(`/?role=${role}`)
  }

  function viewAllNearby() {
    router.push(`/?location=${encodeURIComponent(detectedCity)}`)
  }

  function viewAllJobs() {
    router.push('/?q=hospitality')
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/80 tracking-wide">
              {totalLive > 0 ? `${totalLive.toLocaleString()} open positions` : 'South Africa\'s hospitality job board'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Find your next<br />
            <span className="text-emerald-400">hospitality job</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Waiters, chefs, bartenders and more across South Africa.<br className="hidden sm:block" />
            Apply in seconds — no CV required.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2.5 flex-1 bg-white rounded-xl px-4 h-14 border-2 border-transparent focus-within:border-emerald-400 transition-all shadow-lg">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Job title or keyword…"
                className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none font-medium"
              />
            </div>
            <div className="flex items-center gap-2.5 sm:w-52 bg-white rounded-xl px-4 h-14 border-2 border-transparent focus-within:border-emerald-400 transition-all shadow-lg">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City…"
                className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none font-medium"
              />
            </div>
            <button type="submit"
              className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg transition-all sm:shrink-0">
              Search Jobs
            </button>
          </form>

          {/* Quick city links */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {SA_CITIES.map(city => (
              <button key={city} onClick={() => router.push(`/?location=${encodeURIComponent(city)}`)}
                className="text-xs font-medium text-white/60 hover:text-white/90 transition-colors px-3 py-1 rounded-full hover:bg-white/10">
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Jobs near you ── */}
      {nearbyJobs.length > 0 && (
        <section className="py-12 px-6 max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Based on your location</p>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Jobs near <span className="text-emerald-600">{detectedCity}</span>
              </h2>
            </div>
            <button onClick={viewAllNearby}
              className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-gray-600 border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-xl transition-all">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nearbyJobs.slice(0, 6).map(job => (
              <NearbyJobCard
                key={job.id}
                job={job}
                onClick={() => router.push(`/?location=${encodeURIComponent(detectedCity)}`)}
              />
            ))}
          </div>

          <div className="mt-6 text-center">
            <button onClick={viewAllNearby}
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 px-8 py-3.5 rounded-xl shadow-sm transition-all">
              View all jobs in {detectedCity}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* ── Browse by role ── */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">Browse by role</h2>
          <p className="text-sm text-gray-500 mt-1">Find positions that match your skills and experience</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {ROLE_CATEGORIES.filter(r => r !== 'other').map(role => {
            const count = roleCounts[role] ?? 0
            return (
              <button key={role} onClick={() => goToRole(role)}
                className={`flex flex-col items-start gap-3 border rounded-2xl p-4 transition-all text-left ${ROLE_COLORS[role]}`}>
                <span className="text-2xl">{ROLE_ICONS[role]}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{ROLE_LABELS[role]}</p>
                  {count > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{count} open</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Employer CTA ── */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-3xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">For employers</p>
            <h3 className="text-xl font-extrabold text-white">Hire hospitality staff in minutes</h3>
            <p className="text-white/60 text-sm mt-1">Post a job, get applications from verified candidates. Free to start.</p>
          </div>
          <a href="/post-job"
            className="shrink-0 bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm px-8 py-3.5 rounded-xl transition-all whitespace-nowrap">
            Post a job →
          </a>
        </div>
      </section>

    </div>
  )
}
