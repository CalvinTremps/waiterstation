'use client'

import { useState, useMemo } from 'react'
import { MOCK_COMPANIES } from '@/lib/mock-companies'
import CompanyBadge from '@/components/CompanyBadge'

function StarBar({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span className="text-amber-400 text-sm leading-none" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </span>
  )
}

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')

  const sorted = useMemo(
    () => [...MOCK_COMPANIES].sort((a, b) => b.overall_rating - a.overall_rating),
    []
  )

  const industries = useMemo(
    () => Array.from(new Set(sorted.map(c => c.industry))).sort(),
    [sorted]
  )

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return sorted.filter(company => {
      const matchesSearch =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.location.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q)
      const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry
      return matchesSearch && matchesIndustry
    })
  }, [sorted, searchQuery, selectedIndustry])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-10">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Company reviews{' '}
          <span className="text-base font-normal text-gray-400">{filtered.length} companies</span>
        </h1>
        <p className="text-sm text-gray-400">
          Read honest reviews from hospitality workers across South Africa. Salaries, benefits, culture.
        </p>
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search by name, location, or industry..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scroll-no-bar pb-1 mb-6 -mx-4 px-4">
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
        {industries.map(industry => (
          <button
            key={industry}
            onClick={() => setSelectedIndustry(industry === selectedIndustry ? '' : industry)}
            className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${
              selectedIndustry === industry
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {industry}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">No companies match your search.</p>
        )}
        {filtered.map(company => {
          const reviewCount = company.reviews.length
          return (
            <a
              key={company.id}
              href={`/companies/${company.id}`}
              className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <CompanyBadge name={company.name} size="md" logoUrl={company.logo_url} />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 group-hover:text-emerald-700 transition leading-tight">
                    {company.name}
                  </p>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{company.industry} · {company.location} · {company.size}</p>

                <div className="flex items-center gap-2 mt-2">
                  <StarBar rating={company.overall_rating} />
                  <span className="text-sm font-semibold text-gray-700">{company.overall_rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {company.benefits.slice(0, 3).map(b => (
                    <span key={b} className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {b}
                    </span>
                  ))}
                  {company.benefits.length > 3 && (
                    <span className="text-[11px] text-gray-400 px-2 py-0.5">+{company.benefits.length - 3} more</span>
                  )}
                </div>
              </div>

            </a>
          )
        })}
      </div>

      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="font-semibold text-gray-900 mb-1">Know a workplace not listed here?</p>
        <p className="text-sm text-gray-500 mb-4">Share your experience in the community to help other hospitality workers.</p>
        <a href="/community" className="text-sm font-semibold text-white bg-emerald-600 px-5 py-2.5 rounded-md hover:bg-emerald-700 transition inline-block">
          Go to Community
        </a>
      </div>

    </div>
  )
}
