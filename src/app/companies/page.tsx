'use client'

import { useState, useMemo } from 'react'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyBadge from '@/components/CompanyBadge'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)))
        return (
          <span key={i} className="relative inline-block w-4 h-4">
            <svg viewBox="0 0 20 20" className="w-4 h-4 text-gray-200" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <svg viewBox="0 0 20 20" className="w-4 h-4 text-amber-400" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}

const INDUSTRY_ICONS: Record<string, string> = {
  'Fast Food': '🍔',
  'Hotel Chain': '🏨',
  'Luxury Safari Lodge': '🦁',
  'Fine Dining': '🍽️',
  'Casino & Entertainment': '🎰',
  'Coffee Chain': '☕',
  'Artisan Bakery': '🥖',
  'Wine Farm': '🍷',
  'Casual Dining': '🪑',
  'Contract Catering': '🍱',
  'Spa & Wellness': '💆',
}

function getIndustryIcon(industry: string) {
  for (const [key, icon] of Object.entries(INDUSTRY_ICONS)) {
    if (industry.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '🏢'
}

const BROWSE_INDUSTRIES = [
  { label: 'Hotels & Accommodation', icon: '🏨', filter: 'hotel' },
  { label: 'Restaurants & Dining', icon: '🍽️', filter: 'dining' },
  { label: 'Safari & Game Lodges', icon: '🦁', filter: 'safari' },
  { label: 'Fast Food & QSR', icon: '🍔', filter: 'fast food' },
  { label: 'Coffee & Cafés', icon: '☕', filter: 'coffee' },
  { label: 'Casinos & Entertainment', icon: '🎰', filter: 'casino' },
  { label: 'Wine Estates', icon: '🍷', filter: 'wine' },
  { label: 'Spas & Wellness', icon: '💆', filter: 'spa' },
  { label: 'Contract Catering', icon: '🍱', filter: 'catering' },
]

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(
    () => [...MOCK_COMPANIES].sort((a, b) => b.overall_rating - a.overall_rating),
    []
  )

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return sorted.filter(company => {
      const matchesSearch =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.location.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q)
      const matchesIndustry =
        !selectedIndustry ||
        company.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
      return matchesSearch && matchesIndustry
    })
  }, [sorted, searchQuery, selectedIndustry])

  const isSearching = searchQuery.length > 0 || selectedIndustry.length > 0
  const popularCompanies = sorted.slice(0, 9)
  const displayList = isSearching ? filtered : (showAll ? filtered : filtered.slice(0, 20))

  function handleBrowse(filter: string) {
    setSelectedIndustry(prev => prev === filter ? '' : filter)
    setShowAll(true)
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find great places to work</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Get access to honest reviews from hospitality workers across South Africa
          </p>

          <div className="flex gap-0 shadow-sm rounded-lg overflow-hidden border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition">
            <div className="flex items-center pl-4 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Company name or job title"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowAll(true) }}
              className="flex-1 px-4 py-3.5 text-sm outline-none bg-white text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={() => setShowAll(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3.5 transition whitespace-nowrap"
            >
              Find Companies
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-24 md:pb-12">

        {/* ── Browse by industry ── */}
        {!isSearching && (
          <section className="py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Browse companies by industry</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BROWSE_INDUSTRIES.map(ind => (
                <button
                  key={ind.filter}
                  onClick={() => handleBrowse(ind.filter)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-lg border text-center transition cursor-pointer ${
                    selectedIndustry === ind.filter
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{ind.icon}</span>
                  <span className="text-sm font-medium leading-tight">{ind.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => { setShowAll(true); setSelectedIndustry('') }}
                className="text-sm font-semibold text-blue-600 hover:underline border border-gray-200 rounded-full px-5 py-2 hover:border-gray-300 transition"
              >
                See all industries
              </button>
            </div>
          </section>
        )}

        {/* ── Popular companies (only when not searching) ── */}
        {!isSearching && (
          <section className="py-6 border-t border-gray-100" id="results">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Popular companies</h2>
            <div className="divide-y divide-gray-100">
              {popularCompanies.map(company => {
                const reviewCount = company.reviews.length
                return (
                  <a
                    key={company.id}
                    href={`/companies/${company.id}`}
                    className="flex items-center gap-4 py-4 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition"
                  >
                    <CompanyBadge name={company.name} size="md" logoUrl={company.logo_url} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition text-sm leading-tight">
                        {company.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <StarRating rating={company.overall_rating} />
                        <span className="text-xs font-semibold text-gray-700">{company.overall_rating.toFixed(1)}</span>
                        <span className="text-xs text-blue-600 hover:underline">
                          {reviewCount.toLocaleString()} review{reviewCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex gap-4 text-xs text-blue-600 shrink-0">
                      <span className="hover:underline">Salaries</span>
                      <span className="hover:underline">Open jobs</span>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Search results / full list ── */}
        {(isSearching || showAll) && (
          <section className="py-6 border-t border-gray-100" id="results">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {isSearching
                  ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
                  : 'All companies'}
              </h2>
              {isSearching && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedIndustry(''); setShowAll(false) }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Industry filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
              <button
                onClick={() => setSelectedIndustry('')}
                className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${
                  selectedIndustry === ''
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                All
              </button>
              {BROWSE_INDUSTRIES.map(ind => (
                <button
                  key={ind.filter}
                  onClick={() => setSelectedIndustry(prev => prev === ind.filter ? '' : ind.filter)}
                  className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${
                    selectedIndustry === ind.filter
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {ind.icon} {ind.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-10">No companies match your search.</p>
            )}

            <div className="divide-y divide-gray-100">
              {displayList.map(company => {
                const reviewCount = company.reviews.length
                return (
                  <a
                    key={company.id}
                    href={`/companies/${company.id}`}
                    className="flex items-center gap-4 py-4 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition"
                  >
                    <CompanyBadge name={company.name} size="md" logoUrl={company.logo_url} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition text-sm leading-tight">
                        {company.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{company.industry} · {company.location}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <StarRating rating={company.overall_rating} />
                        <span className="text-xs font-semibold text-gray-700">{company.overall_rating.toFixed(1)}</span>
                        <span className="text-xs text-blue-600">
                          {reviewCount.toLocaleString()} review{reviewCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex gap-4 text-xs text-blue-600 shrink-0">
                      <span className="hover:underline">Salaries</span>
                      <span className="hover:underline">Open jobs</span>
                    </div>
                  </a>
                )
              })}
            </div>

            {!isSearching && !showAll && filtered.length > 20 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Show all {filtered.length} companies
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── CTA ── */}
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="font-semibold text-gray-900 mb-1">Know a workplace not listed here?</p>
          <p className="text-sm text-gray-500 mb-4">Share your experience in the community to help other hospitality workers.</p>
          <a href="/community" className="text-sm font-semibold text-white bg-emerald-600 px-5 py-2.5 rounded-md hover:bg-emerald-700 transition inline-block">
            Go to Community
          </a>
        </div>

      </div>
    </div>
  )
}
