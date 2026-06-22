'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyBadge from '@/components/CompanyBadge'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)))
        return (
          <span key={i} className="relative inline-block w-3.5 h-3.5">
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-gray-200" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-amber-400" fill="currentColor">
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

const BROWSE_INDUSTRIES = [
  {
    label: 'Hotels & Accommodation',
    filter: 'hotel',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="4" y="10" width="32" height="26" rx="2" fill="#3B82F6"/>
        <rect x="8" y="4" width="24" height="8" rx="2" fill="#1D4ED8"/>
        <rect x="10" y="18" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
        <rect x="22" y="18" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
        <rect x="16" y="26" width="8" height="10" rx="1" fill="white" opacity="0.9"/>
        <rect x="17" y="7" width="6" height="1.5" rx="0.75" fill="#93C5FD"/>
      </svg>
    ),
  },
  {
    label: 'Restaurants & Dining',
    filter: 'dining',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="20" cy="20" r="14" fill="#F97316"/>
        <circle cx="20" cy="20" r="10" fill="#FED7AA"/>
        <path d="M14 15 Q20 13 26 15 Q26 22 20 24 Q14 22 14 15Z" fill="#F97316" opacity="0.5"/>
        <path d="M16 20 Q20 18.5 24 20" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="19" y="10" width="2" height="4" rx="1" fill="#EA580C"/>
        <rect x="15" y="11" width="1.5" height="3" rx="0.75" fill="#EA580C" transform="rotate(-15 15 11)"/>
        <rect x="24" y="11" width="1.5" height="3" rx="0.75" fill="#EA580C" transform="rotate(15 24 11)"/>
      </svg>
    ),
  },
  {
    label: 'Safari & Game Lodges',
    filter: 'safari',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <ellipse cx="20" cy="22" rx="13" ry="10" fill="#F59E0B"/>
        <circle cx="20" cy="18" r="9" fill="#FBBF24"/>
        <circle cx="15" cy="13" r="5" fill="#F59E0B"/>
        <circle cx="25" cy="13" r="5" fill="#F59E0B"/>
        <ellipse cx="15" cy="12" rx="2" ry="2.5" fill="#1C1917"/>
        <ellipse cx="25" cy="12" rx="2" ry="2.5" fill="#1C1917"/>
        <circle cx="14.5" cy="11.5" r="0.7" fill="white"/>
        <circle cx="24.5" cy="11.5" r="0.7" fill="white"/>
        <ellipse cx="20" cy="19" rx="3" ry="2" fill="#D97706"/>
        <path d="M17 21 Q20 23 23 21" stroke="#92400E" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="18" cy="19.5" r="0.8" fill="#1C1917"/>
        <circle cx="22" cy="19.5" r="0.8" fill="#1C1917"/>
      </svg>
    ),
  },
  {
    label: 'Fast Food & QSR',
    filter: 'fast food',
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <ellipse cx="20" cy="28" rx="14" ry="3.5" fill="#92400E"/>
        <rect x="6" y="22" width="28" height="6" rx="0" fill="#D97706"/>
        <rect x="7" y="19" width="26" height="4" rx="1" fill="#16A34A"/>
        <rect x="7" y="15" width="26" height="5" rx="0" fill="#EF4444"/>
        <ellipse cx="20" cy="15" rx="13" ry="5" fill="#F59E0B"/>
        <ellipse cx="20" cy="12" rx="12" ry="4" fill="#D97706"/>
        <circle cx="15" cy="11" r="1.5" fill="#92400E" opacity="0.5"/>
        <circle cx="20" cy="10" r="1.5" fill="#92400E" opacity="0.5"/>
        <circle cx="25" cy="11" r="1.5" fill="#92400E" opacity="0.5"/>
      </svg>
    ),
  },
  {
    label: 'Coffee & Cafés',
    filter: 'coffee',
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="8" y="18" width="20" height="14" rx="2" fill="#92400E"/>
        <rect x="9" y="19" width="18" height="12" rx="1.5" fill="#B45309"/>
        <path d="M28 21 Q34 21 34 26 Q34 31 28 31" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="18" cy="32" rx="12" ry="2" fill="#78350F"/>
        <path d="M13 14 Q13 11 16 11 Q16 8 19 9 Q20 6 23 7 Q26 6 27 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
        <rect x="9" y="21" width="18" height="6" rx="1" fill="#D97706" opacity="0.3"/>
      </svg>
    ),
  },
  {
    label: 'Casinos & Entertainment',
    filter: 'casino',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="5" y="8" width="30" height="24" rx="3" fill="#7C3AED"/>
        <rect x="7" y="10" width="26" height="20" rx="2" fill="#6D28D9"/>
        <rect x="10" y="13" width="6" height="10" rx="1" fill="#A78BFA"/>
        <rect x="11" y="14" width="4" height="3" rx="0.5" fill="#C4B5FD"/>
        <rect x="11" y="18" width="4" height="1" rx="0.5" fill="#EDE9FE"/>
        <rect x="11" y="20" width="4" height="1" rx="0.5" fill="#EDE9FE"/>
        <rect x="18" y="13" width="6" height="10" rx="1" fill="#A78BFA"/>
        <rect x="19" y="14" width="4" height="3" rx="0.5" fill="#C4B5FD"/>
        <rect x="19" y="18" width="4" height="1" rx="0.5" fill="#EDE9FE"/>
        <rect x="19" y="20" width="4" height="1" rx="0.5" fill="#EDE9FE"/>
        <rect x="26" y="13" width="6" height="10" rx="1" fill="#A78BFA"/>
        <rect x="27" y="14" width="4" height="3" rx="0.5" fill="#C4B5FD"/>
        <rect x="27" y="18" width="4" height="1" rx="0.5" fill="#EDE9FE"/>
        <rect x="27" y="20" width="4" height="1" rx="0.5" fill="#EDE9FE"/>
        <circle cx="12" cy="30" r="1.5" fill="#F59E0B"/>
        <circle cx="20" cy="30" r="1.5" fill="#EF4444"/>
        <circle cx="28" cy="30" r="1.5" fill="#10B981"/>
      </svg>
    ),
  },
  {
    label: 'Wine Estates',
    filter: 'wine',
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M14 6 L26 6 L28 18 Q28 28 20 28 Q12 28 12 18 Z" fill="#BE123C"/>
        <path d="M15 6 L25 6 L27 17 Q27 26 20 26 Q13 26 13 17 Z" fill="#E11D48"/>
        <rect x="19" y="28" width="2" height="8" fill="#9F1239"/>
        <rect x="15" y="35" width="10" height="2" rx="1" fill="#BE123C"/>
        <path d="M13 16 Q20 20 27 16" stroke="#FB7185" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <ellipse cx="20" cy="14" rx="5" ry="3" fill="#9F1239" opacity="0.4"/>
      </svg>
    ),
  },
  {
    label: 'Spas & Wellness',
    filter: 'spa',
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="20" cy="20" r="14" fill="#0D9488"/>
        <circle cx="20" cy="20" r="11" fill="#14B8A6"/>
        <path d="M20 10 Q24 14 24 18 Q24 22 20 24 Q16 22 16 18 Q16 14 20 10Z" fill="white" opacity="0.9"/>
        <path d="M20 10 Q24 14 24 18" stroke="#0F766E" strokeWidth="1" fill="none"/>
        <path d="M12 20 Q16 16 20 20 Q24 24 28 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
        <circle cx="20" cy="10" r="2" fill="#F0FDFA"/>
      </svg>
    ),
  },
  {
    label: 'Contract Catering',
    filter: 'catering',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="6" y="22" width="28" height="4" rx="2" fill="#15803D"/>
        <rect x="10" y="14" width="8" height="9" rx="2" fill="#16A34A"/>
        <rect x="22" y="14" width="8" height="9" rx="2" fill="#16A34A"/>
        <rect x="11" y="15" width="6" height="3" rx="1" fill="#4ADE80" opacity="0.7"/>
        <rect x="23" y="15" width="6" height="3" rx="1" fill="#4ADE80" opacity="0.7"/>
        <ellipse cx="14" cy="14" rx="4" ry="2" fill="#22C55E"/>
        <ellipse cx="26" cy="14" rx="4" ry="2" fill="#22C55E"/>
        <rect x="18" y="10" width="4" height="13" rx="1" fill="#15803D"/>
        <ellipse cx="20" cy="10" rx="3" ry="2" fill="#22C55E"/>
        <rect x="8" y="26" width="24" height="3" rx="1.5" fill="#14532D"/>
      </svg>
    ),
  },
]

function CompaniesPageInner() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [showAll, setShowAll] = useState(!!(searchParams.get('q')))

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
  const popularCompanies = sorted.slice(0, 6)
  const displayList = isSearching ? filtered : (showAll ? filtered : filtered.slice(0, 30))

  function handleBrowse(filter: string) {
    setSelectedIndustry(prev => prev === filter ? '' : filter)
    setShowAll(true)
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 50)
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

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-1 shadow-sm rounded-lg overflow-hidden border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition bg-white">
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
            </div>
            <button
              onClick={() => setShowAll(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition whitespace-nowrap"
            >
              Find Companies
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-24 md:pb-12">

        {/* ── Browse by industry ── */}
        {!isSearching && !showAll && (
          <section className="py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Browse companies by industry</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BROWSE_INDUSTRIES.map(ind => (
                <button
                  key={ind.filter}
                  onClick={() => handleBrowse(ind.filter)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 text-center transition cursor-pointer ${
                    selectedIndustry === ind.filter
                      ? 'border-blue-500 bg-blue-50'
                      : `border-transparent ${ind.bg} hover:border-gray-200 hover:shadow-sm`
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${ind.iconBg} flex items-center justify-center`}>
                    {ind.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 leading-tight">{ind.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setShowAll(true); setSelectedIndustry('') }}
                className="text-sm font-semibold text-blue-600 hover:underline border border-gray-200 rounded-full px-6 py-2 hover:border-gray-300 transition bg-white"
              >
                See all industries
              </button>
            </div>
          </section>
        )}

        {/* ── Popular companies — 3×2 card grid ── */}
        {!isSearching && !showAll && (
          <section className="py-6 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Popular companies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {popularCompanies.map(company => {
                const reviewCount = company.reviews.length
                return (
                  <div
                    key={company.id}
                    className="flex flex-col p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 transition-all group"
                  >
                    <a href={`/companies/${company.id}`} className="block">
                      <CompanyBadge name={company.name} size="md" logoUrl={company.logo_url} />
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition text-sm mt-3 leading-tight line-clamp-2">
                        {company.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <StarRating rating={company.overall_rating} />
                        <span className="text-xs font-semibold text-gray-700 ml-0.5">{company.overall_rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-0.5">
                        {reviewCount.toLocaleString()} review{reviewCount !== 1 ? 's' : ''}
                      </p>
                    </a>
                    <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                      <a href={`/companies/${company.id}?tab=salaries`} className="text-xs text-blue-600 hover:underline font-medium">Salaries</a>
                      <a href={`/companies/${company.id}?tab=reviews`} className="text-xs text-blue-600 hover:underline font-medium">Reviews</a>
                      <a href={`/?q=${encodeURIComponent(company.name)}`} className="text-xs text-blue-600 hover:underline font-medium">Open jobs</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Search / browse results ── */}
        {(isSearching || showAll) && (
          <section className="py-6" id="results">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {isSearching
                  ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
                  : `All companies (${filtered.length})`}
              </h2>
              <button
                onClick={() => { setSearchQuery(''); setSelectedIndustry(''); setShowAll(false) }}
                className="text-xs text-blue-600 hover:underline"
              >
                ← Back
              </button>
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
                  {ind.label}
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
                  <div
                    key={company.id}
                    className="flex items-center gap-4 py-4 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition"
                  >
                    <a href={`/companies/${company.id}`} className="shrink-0">
                      <CompanyBadge name={company.name} size="md" logoUrl={company.logo_url} />
                    </a>
                    <a href={`/companies/${company.id}`} className="flex-1 min-w-0">
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
                    </a>
                    <div className="hidden sm:flex gap-4 text-xs text-blue-600 shrink-0">
                      <a href={`/companies/${company.id}?tab=salaries`} className="hover:underline">Salaries</a>
                      <a href={`/companies/${company.id}?tab=reviews`} className="hover:underline">Reviews</a>
                      <a href={`/?q=${encodeURIComponent(company.name)}`} className="hover:underline">Open jobs</a>
                    </div>
                  </div>
                )
              })}
            </div>

            {!isSearching && displayList.length < filtered.length && (
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
        {!showAll && !isSearching && (
          <div className="mt-10 bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="font-semibold text-gray-900 mb-1">Know a workplace not listed here?</p>
            <p className="text-sm text-gray-500 mb-4">Share your experience in the community to help other hospitality workers.</p>
            <a href="/community" className="text-sm font-semibold text-white bg-gray-900 px-5 py-2.5 rounded-md hover:bg-gray-800 transition inline-block">
              Go to Community
            </a>
          </div>
        )}

      </div>
    </div>
  )
}

import { Suspense } from 'react'
export default function CompaniesPage() {
  return <Suspense><CompaniesPageInner /></Suspense>
}
