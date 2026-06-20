'use client'

import { useState, useEffect } from 'react'
import { Company, CompanyReview } from '@/lib/mock-companies'

const SALARY_BENCHMARKS = [
  { role: 'Waiter / Waitress', range: 'R4,000 – R8,000/month + tips' },
  { role: 'Chef / Sous Chef', range: 'R8,000 – R22,000/month' },
  { role: 'Bartender', range: 'R5,000 – R9,000/month + tips' },
  { role: 'Hotel Front Desk', range: 'R6,000 – R12,000/month' },
  { role: 'Housekeeping', range: 'R4,500 – R9,000/month' },
  { role: 'Barista', range: 'R4,500 – R7,000/month' },
  { role: 'Restaurant Manager', range: 'R15,000 – R30,000/month' },
]

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const cls = size === 'lg' ? 'text-2xl' : 'text-base'
  return (
    <span className={`${cls} text-amber-400 leading-none`}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
    </span>
  )
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-1.5 bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-8 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

function ReviewCard({ review }: { review: CompanyReview }) {
  const [helpful, setHelpful] = useState(review.helpful_count)
  const [marked, setMarked] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <StarDisplay rating={review.rating} />
            <span className="text-sm font-semibold text-gray-800">{review.role}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              review.employment_status === 'Current'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {review.employment_status} employee
            </span>
            <span className="text-xs text-gray-400">{review.date}</span>
            {review.anonymous && (
              <span className="text-[11px] text-gray-400">Anonymous</span>
            )}
            {!review.anonymous && review.author_name && (
              <span className="text-xs text-gray-500 font-medium">{review.author_name}</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2.5">
          <span className="text-emerald-500 mt-0.5 shrink-0 text-sm font-bold">+</span>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pros</span>
            <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{review.pros}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="text-red-400 mt-0.5 shrink-0 text-sm font-bold">–</span>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Cons</span>
            <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{review.cons}</p>
          </div>
        </div>
      </div>

      {review.salary && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-100">
          💰 <span className="font-semibold">Reported salary:</span> {review.salary}
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{helpful} found this helpful</span>
        <button
          onClick={() => { if (!marked) { setHelpful(h => h + 1); setMarked(true) } }}
          aria-label="Mark review as helpful"
          aria-pressed={marked}
          className={`text-xs font-medium px-3 py-1 rounded-full border transition ${
            marked
              ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
              : 'border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
          }`}
        >
          👍 Helpful
        </button>
      </div>
    </div>
  )
}

function WriteReviewModal({ companyName, onClose, onSubmit }: {
  companyName: string
  onClose: () => void
  onSubmit: (review: CompanyReview) => void
}) {
  const [rating, setRating] = useState(0)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])
  const [hovered, setHovered] = useState(0)
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<'Current' | 'Former'>('Current')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [salary, setSalary] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !role || !pros || !cons) return
    const review: CompanyReview = {
      id: `user-${Date.now()}`,
      role,
      employment_status: status,
      rating,
      date: new Date().toISOString().slice(0, 7),
      pros,
      cons,
      anonymous: true,
      helpful_count: 0,
      salary: salary || undefined,
    }
    onSubmit(review)
    setSubmitted(true)
    setTimeout(onClose, 1500)
  }

  const displayRating = hovered || rating
  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 flex items-center justify-between px-6 py-4">
          <div>
            <h3 className="font-bold text-gray-900">Write a review</h3>
            <p className="text-xs text-gray-400 mt-0.5">{companyName}</p>
          </div>
          <button onClick={onClose} aria-label="Close review modal" className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-bold text-gray-900">Thanks for your review!</p>
            <p className="text-sm text-gray-500 mt-1">Your review helps other hospitality workers.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Overall rating */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-2">Overall rating <span className="text-emerald-600">*</span></label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${n} star${n !== 1 ? 's' : ''}`}
                    className={`text-2xl transition ${n <= displayRating ? 'text-amber-400' : 'text-gray-200'}`}
                  >
                    ★
                  </button>
                ))}
                {displayRating > 0 && (
                  <span className="text-sm text-gray-500 ml-2">{starLabels[displayRating]}</span>
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Your role <span className="text-emerald-600">*</span></label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Waiter, Chef, Front Desk"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-2">Employment status</label>
              <div className="flex gap-2">
                {(['Current', 'Former'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 text-sm font-medium py-2 rounded-xl border transition ${
                      status === s ? 'bg-emerald-600 text-white border-emerald-600' : 'text-gray-600 border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {s} employee
                  </button>
                ))}
              </div>
            </div>

            {/* Pros */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Pros <span className="text-emerald-600">*</span></label>
              <textarea
                value={pros}
                onChange={e => setPros(e.target.value)}
                placeholder="What did you like about working here?"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>

            {/* Cons */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Cons <span className="text-emerald-600">*</span></label>
              <textarea
                value={cons}
                onChange={e => setCons(e.target.value)}
                placeholder="What could be improved?"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>

            {/* Salary (optional) */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Salary <span className="text-xs font-normal text-gray-400">(optional)</span></label>
              <input
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="e.g. R7 500/month + tips"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <p className="text-xs text-gray-400">Your review will be posted anonymously.</p>

            <button
              type="submit"
              disabled={!rating || !role || !pros || !cons}
              className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-full hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit review
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

type Tab = 'overview' | 'reviews' | 'salaries' | 'benefits'
type Filter = 'all' | 'Current' | 'Former'

export default function CompanyClient({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [reviewFilter, setReviewFilter] = useState<Filter>('all')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviews, setReviews] = useState<CompanyReview[]>(company.reviews)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'salaries', label: 'Salaries' },
    { id: 'benefits', label: 'Benefits' },
  ]

  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviews.filter(r => r.employment_status === reviewFilter)

  const overallRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : company.overall_rating

  const ratingLabels: { key: keyof Company['ratings']; label: string }[] = [
    { key: 'work_life_balance', label: 'Work-life balance' },
    { key: 'culture', label: 'Culture & values' },
    { key: 'management', label: 'Management' },
    { key: 'career_growth', label: 'Career growth' },
    { key: 'compensation', label: 'Compensation' },
  ]

  const companyInitial = company.name.trim().charAt(0).toUpperCase()

  function handleNewReview(review: CompanyReview) {
    setReviews(prev => [review, ...prev])
    setActiveTab('reviews')
  }

  return (
    <>
      {showReviewModal && (
        <WriteReviewModal
          companyName={company.name}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleNewReview}
        />
      )}

      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-8 py-8">

          {/* Back link */}
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition mb-6">
            ← Back to jobs
          </a>

          {/* Hero card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-5">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-lg border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-1.5" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <span className="text-2xl font-semibold text-gray-400">{companyInitial}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">{company.industry} · {company.size} · {company.location}</p>
                  {company.website && (
                    <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline mt-0.5 inline-block">{company.website} ↗</a>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <StarDisplay rating={overallRating} size="lg" />
                    <span className="text-lg font-bold text-gray-800">{overallRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="shrink-0 bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition"
              >
                Write a review
              </button>
            </div>
          </div>

          {/* Tab nav */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3.5 text-sm font-medium border-b-2 transition -mb-px ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-gray-800 mb-2">About {company.name}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800 mb-4">Ratings breakdown</h2>
                  <div className="space-y-3 max-w-xl">
                    {ratingLabels.map(({ key, label }) => (
                      <RatingBar key={key} label={label} value={company.ratings[key]} />
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800 mb-3">Key benefits</h2>
                  <div className="flex flex-wrap gap-2">
                    {company.benefits.map(b => (
                      <span key={b} className="flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                        <span className="text-emerald-500 text-xs font-bold">✓</span>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(['all', 'Current', 'Former'] as Filter[]).map(f => (
                      <button
                        key={f}
                        onClick={() => setReviewFilter(f)}
                        className={`text-sm font-medium px-4 py-1.5 rounded-full border transition ${
                          reviewFilter === f
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'text-gray-600 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {f === 'all' ? 'All reviews' : `${f} employees`}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-sm font-semibold text-emerald-600 hover:underline"
                  >
                    + Add yours
                  </button>
                </div>
                <div className="space-y-4">
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-sm">No reviews match this filter.</p>
                      <button onClick={() => setReviewFilter('all')} className="mt-2 text-sm text-emerald-600 hover:underline">View all</button>
                    </div>
                  ) : (
                    filteredReviews.map(r => <ReviewCard key={r.id} review={r} />)
                  )}
                </div>
              </div>
            )}

            {/* Salaries */}
            {activeTab === 'salaries' && (
              <div className="p-6">
                {company.reviews.filter(r => r.salary).length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-base font-bold text-gray-800 mb-1">Reported by employees at {company.name}</h2>
                    <p className="text-xs text-gray-400 mb-4">Self-reported — actual salaries may vary by experience</p>
                    <div className="space-y-2">
                      {company.reviews.filter(r => r.salary).map(r => (
                        <div key={r.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                          <span className="text-sm text-gray-700 font-medium">{r.role}</span>
                          <span className="text-sm text-emerald-700 font-semibold">{r.salary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={company.reviews.filter(r => r.salary).length > 0 ? 'border-t border-gray-100 pt-6' : ''}>
                  <h2 className="text-base font-bold text-gray-800 mb-1">SA hospitality benchmarks</h2>
                  <p className="text-xs text-gray-400 mb-4">Typical ranges across the industry. Varies by location, experience, and establishment.</p>
                  <div className="space-y-2">
                    {SALARY_BENCHMARKS.map(b => (
                      <div key={b.role} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100">
                        <span className="text-sm text-gray-700 font-medium">{b.role}</span>
                        <span className="text-sm text-gray-500">{b.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {activeTab === 'benefits' && (
              <div className="p-6">
                <h2 className="text-base font-bold text-gray-800 mb-1">Benefits at {company.name}</h2>
                <p className="text-xs text-gray-400 mb-5">As reported by employees</p>
                <div className="flex flex-wrap gap-2">
                  {company.benefits.map(b => (
                    <span
                      key={b}
                      className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full"
                    >
                      <span className="text-emerald-500 text-xs font-bold">✓</span>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
