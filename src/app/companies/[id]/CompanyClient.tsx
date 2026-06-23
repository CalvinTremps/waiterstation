'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Company, CompanyReview, MOCK_COMPANIES } from '@/lib/mock-companies'
import { MOCK_JOBS } from '@/lib/mock-jobs'
import ClaimedBadge from '@/components/ClaimedBadge'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)))
        return (
          <span key={i} className={`relative inline-block ${sz}`}>
            <svg viewBox="0 0 20 20" className={`${sz} text-gray-200`} fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 20 20" className={`${sz} text-amber-400`} fill="currentColor">
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

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <span className="text-xs md:text-sm text-gray-600 w-28 md:w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-800 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

// Pentagon / radar chart for rating overview
function RadarChart({ ratings }: { ratings: Company['ratings'] }) {
  const cx = 120, cy = 120, r = 80
  const labels = [
    { key: 'work_life_balance', label: 'Work-Life\nBalance' },
    { key: 'management', label: 'Management' },
    { key: 'career_growth', label: 'Job Growth' },
    { key: 'compensation', label: 'Compensation' },
    { key: 'culture', label: 'Culture' },
  ] as const
  const n = labels.length
  function point(i: number, radius: number) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
  }
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]
  const dataPoints = labels.map((l, i) => {
    const val = (ratings[l.key] / 5) * r
    return point(i, val)
  })
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg viewBox="0 0 240 240" className="w-48 h-48">
      {/* Grid */}
      {gridLevels.map(lvl => {
        const pts = labels.map((_, i) => point(i, r * lvl))
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        return <path key={lvl} d={path} fill="none" stroke="#E5E7EB" strokeWidth="1" />
      })}
      {/* Axes */}
      {labels.map((_, i) => {
        const outer = point(i, r)
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#E5E7EB" strokeWidth="1" />
      })}
      {/* Data */}
      <path d={dataPath} fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="2" />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3B82F6" />)}
      {/* Labels */}
      {labels.map((l, i) => {
        const outer = point(i, r + 22)
        return (
          <text key={i} x={outer.x} y={outer.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill="#6B7280" fontFamily="system-ui">
            {l.label.split('\n').map((line, li) => (
              <tspan key={li} x={outer.x} dy={li === 0 ? 0 : 10}>{line}</tspan>
            ))}
          </text>
        )
      })}
    </svg>
  )
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: CompanyReview }) {
  const [helpful, setHelpful] = useState(review.helpful_count)
  const [marked, setMarked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const prosLong = review.pros.length > 160
  const consLong = review.cons.length > 160

  return (
    <div className="py-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-blue-600">
            {review.anonymous ? '?' : (review.author_name ?? '?').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">
              {review.anonymous ? 'Anonymous' : review.author_name}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{review.role}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              review.employment_status === 'Current'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {review.employment_status} employee
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} />
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        </div>
        {review.salary && (
          <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full shrink-0">
            {review.salary}
          </span>
        )}
      </div>

      {/* Pros */}
      <div className="mb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pros</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {prosLong && !expanded ? review.pros.slice(0, 160) + '…' : review.pros}
        </p>
      </div>

      {/* Cons */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cons</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {consLong && !expanded ? review.cons.slice(0, 160) + '…' : review.cons}
        </p>
      </div>

      {(prosLong || consLong) && (
        <button onClick={() => setExpanded(e => !e)} className="text-xs text-blue-600 hover:underline mb-3">
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Helpful?</span>
        <button
          onClick={() => { if (!marked) { setHelpful(h => h + 1); setMarked(true) } }}
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border transition ${
            marked ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          Yes ({helpful})
        </button>
        <button className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition">
          No
        </button>
      </div>
    </div>
  )
}

// ─── Write review modal ───────────────────────────────────────────────────────

function WriteReviewModal({ companyName, onClose, onSubmit }: {
  companyName: string
  onClose: () => void
  onSubmit: (review: CompanyReview) => void
}) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<'Current' | 'Former'>('Current')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [salary, setSalary] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || !role || !pros || !cons) return
    onSubmit({
      id: `user-${Date.now()}`,
      role, employment_status: status, rating,
      date: new Date().toISOString().slice(0, 7),
      pros, cons, anonymous: true, helpful_count: 0,
      salary: salary || undefined,
    })
    setSubmitted(true)
    setTimeout(onClose, 1800)
  }

  const displayRating = hovered || rating
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-gray-900">Write a review</h3>
            <p className="text-xs text-gray-400 mt-0.5">{companyName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-gray-900 text-lg">Review submitted!</p>
            <p className="text-sm text-gray-500 mt-1">Thank you for helping other hospitality workers.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-2">Overall rating <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
                    className={`transition ${n <= displayRating ? 'text-amber-400' : 'text-gray-200'}`}>
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                {displayRating > 0 && <span className="text-sm text-gray-500 ml-2">{labels[displayRating]}</span>}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Your role <span className="text-red-500">*</span></label>
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Waiter, Chef, Front Desk"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-2">Employment status</label>
              <div className="flex gap-2">
                {(['Current', 'Former'] as const).map(s => (
                  <button key={s} type="button" onClick={() => setStatus(s)}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg border transition ${
                      status === s ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}>{s} employee</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Pros <span className="text-red-500">*</span></label>
              <textarea value={pros} onChange={e => setPros(e.target.value)} placeholder="What did you like about working here?" rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">Cons <span className="text-red-500">*</span></label>
              <textarea value={cons} onChange={e => setCons(e.target.value)} placeholder="What could be improved?" rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1">
                Salary <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g. R7 500/month + tips"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <p className="text-xs text-gray-400">Your review will be posted anonymously to protect your privacy.</p>
            <button type="submit" disabled={!rating || !role || !pros || !cons}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
              Submit review
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Reviews tab (Indeed layout) ─────────────────────────────────────────────

const POSITIVE_KEYWORDS = ['great team', 'good management', 'good pay', 'growth opportunities', 'nice environment', 'work-life balance', 'training', 'benefits', 'flexible hours', 'good culture']
const NEGATIVE_KEYWORDS = ['long hours', 'low pay', 'poor management', 'high turnover', 'no growth', 'understaffed', 'stressful', 'no benefits', 'poor communication', 'bad management']

function ReviewsTab({ company, reviews, overallRating, relatedCompanies, onWriteReview }: {
  company: Company
  reviews: CompanyReview[]
  overallRating: number
  relatedCompanies: Company[]
  onWriteReview: () => void
}) {
  const [roleFilter, setRoleFilter] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Current' | 'Former'>('all')
  const [page, setPage] = useState(1)
  const [comparing, setComparing] = useState<string[]>([])
  const PER_PAGE = 5

  const companyJobs = useMemo(() =>
    MOCK_JOBS.filter(j =>
      j.employer_name.toLowerCase().includes(company.name.split(' ')[0].toLowerCase()) ||
      company.name.toLowerCase().includes(j.employer_name.split(' ')[0].toLowerCase())
    ).slice(0, 3),
    [company.name]
  )

  const filtered = useMemo(() => {
    let list = [...reviews]
    if (statusFilter !== 'all') list = list.filter(r => r.employment_status === statusFilter)
    if (roleFilter) list = list.filter(r => r.role.toLowerCase().includes(roleFilter.toLowerCase()))
    if (sortBy === 'recent') list.sort((a, b) => b.date.localeCompare(a.date))
    else if (sortBy === 'helpful') list.sort((a, b) => b.helpful_count - a.helpful_count)
    else if (sortBy === 'highest') list.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'lowest') list.sort((a, b) => a.rating - b.rating)
    return list
  }, [reviews, statusFilter, roleFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Sentiment keyword extraction from pros/cons
  const allPros = reviews.map(r => r.pros.toLowerCase()).join(' ')
  const allCons = reviews.map(r => r.cons.toLowerCase()).join(' ')
  const positiveHits = POSITIVE_KEYWORDS.filter(k => allPros.includes(k.split(' ')[0]))
  const negativeHits = NEGATIVE_KEYWORDS.filter(k => allCons.includes(k.split(' ')[0]))
  const sentimentKeywords = [
    ...positiveHits.slice(0, 4).map(k => ({ label: k, positive: true })),
    ...negativeHits.slice(0, 3).map(k => ({ label: k, positive: false })),
  ]

  const ratingDimensions: { key: keyof Company['ratings']; label: string }[] = [
    { key: 'work_life_balance', label: 'Work-life balance' },
    { key: 'compensation', label: 'Pay & benefits' },
    { key: 'career_growth', label: 'Job security & advancement' },
    { key: 'management', label: 'Management' },
    { key: 'culture', label: 'Culture' },
  ]

  function toggleCompare(id: string) {
    setComparing(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    )
  }

  return (
    <div className="flex gap-5 items-start">

      {/* ── Left sidebar ── */}
      <aside className="hidden lg:block w-60 shrink-0 space-y-4">
        {/* Overall rating */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-4xl font-bold text-gray-900">{overallRating.toFixed(1)}</div>
          <StarRating rating={overallRating} size="md" />
          <p className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>

          <div className="mt-4 space-y-2.5">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => Math.round(r.rating) === star).length
              const pct = reviews.length ? (count / reviews.length) * 100 : 0
              return (
                <button key={star} onClick={() => { setStatusFilter('all'); setPage(1) }}
                  className="flex items-center gap-1.5 w-full group">
                  <span className="text-xs text-blue-600 hover:underline w-3">{star}</span>
                  <svg className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-1.5 bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Detailed ratings</p>
            {ratingDimensions.map(d => (
              <div key={d.key} className="flex items-center justify-between">
                <span className="text-xs text-blue-600 hover:underline cursor-default">{d.label}</span>
                <span className="text-xs font-semibold text-gray-700">{company.ratings[d.key].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What people are saying */}
        {sentimentKeywords.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-800 mb-3">What people are saying</p>
            <div className="space-y-2">
              {sentimentKeywords.map(k => (
                <div key={k.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${k.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-[10px] font-bold ${k.positive ? 'text-green-600' : 'text-red-500'}`}>
                      {k.positive ? '+' : '–'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-700 capitalize">{k.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Filters row */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
                placeholder="Job title, keyword"
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <button onClick={() => setPage(1)}
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Search
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'Current', 'Former'] as const).map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setPage(1) }}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                  statusFilter === f ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-600 border-gray-200 hover:border-gray-400'
                }`}>
                {f === 'all' ? 'All employees' : `${f} employees`}
              </button>
            ))}
            <div className="ml-auto">
              <select value={sortBy} onChange={e => { setSortBy(e.target.value as typeof sortBy); setPage(1) }}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700">
                <option value="recent">Most recent</option>
                <option value="helpful">Most helpful</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Review count + write */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-800">{filtered.length.toLocaleString()} review{filtered.length !== 1 ? 's' : ''}</p>
          <button onClick={onWriteReview} className="text-sm font-semibold text-blue-600 hover:underline">
            + Write a review
          </button>
        </div>

        {/* Reviews + inline jobs */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-400">No reviews match your filters.</p>
          </div>
        ) : (
          <>
            {paginated.slice(0, 3).map(r => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <ReviewCard review={r} />
              </div>
            ))}

            {/* Inline jobs section (after 3rd review) */}
            {companyJobs.length > 0 && page === 1 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Jobs at {company.name}</h3>
                  <a href={`/?q=${encodeURIComponent(company.name)}`}
                    className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                    See more jobs →
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {companyJobs.map(job => (
                    <a key={job.id} href={`/jobs/${job.id}`}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-sm hover:border-gray-300 transition group block">
                      <p className="text-xs font-semibold text-blue-600 group-hover:underline line-clamp-2">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{job.location}</p>
                      {job.pay && <p className="text-xs font-medium text-gray-700 mt-1">{job.pay}</p>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {paginated.slice(3).map(r => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <ReviewCard review={r} />
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition">
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 text-sm rounded-lg border transition ${
                        page === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}>
                      {p}
                    </button>
                  )
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition">
                  ›
                </button>
              </div>
            )}
          </>
        )}

        {/* Related companies */}
        {relatedCompanies.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">More companies you might be interested in</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedCompanies.map(c => (
                <div key={c.id} className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                      {c.logo_url
                        ? <img src={c.logo_url} alt={c.name} className="w-full h-full object-contain p-0.5" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        : <span className="text-xs font-bold text-gray-400">{c.name.charAt(0)}</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <a href={`/companies/${c.id}`} className="text-xs font-semibold text-gray-800 hover:text-blue-600 block truncate">{c.name}</a>
                      <div className="flex items-center gap-1">
                        <StarRating rating={c.overall_rating} />
                        <span className="text-xs text-gray-500">{c.overall_rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{c.description.slice(0, 80)}…</p>
                  <button
                    onClick={() => toggleCompare(c.id)}
                    className={`mt-auto text-xs font-semibold py-1.5 rounded-full border transition ${
                      comparing.includes(c.id)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {comparing.includes(c.id) ? 'Added' : 'Compare'}
                  </button>
                </div>
              ))}
            </div>
            {comparing.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                <span className="text-xs text-blue-700 font-medium">
                  Comparing: {comparing.map(id => relatedCompanies.find(c => c.id === id)?.name).filter(Boolean).join(' vs ')}
                </span>
                <button onClick={() => setComparing([])} className="text-xs text-blue-600 hover:underline">Clear</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Jobs tab (Indeed layout) ─────────────────────────────────────────────────

function JobsTab({ company, relatedCompanies, allJobs }: {
  company: Company
  relatedCompanies: Company[]
  allJobs: import('@/lib/types').Job[]
}) {
  const [titleQ, setTitleQ] = useState('')
  const [locationQ, setLocationQ] = useState('')
  const [selectedJob, setSelectedJob] = useState<import('@/lib/types').Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const baseJobs = allJobs

  const filtered = useMemo(() => {
    const tq = titleQ.toLowerCase()
    const lq = locationQ.toLowerCase()
    return baseJobs.filter(j => {
      const matchT = !tq || j.title.toLowerCase().includes(tq) || j.description.toLowerCase().includes(tq)
      const matchL = !lq || j.location.toLowerCase().includes(lq)
      return matchT && matchL
    })
  }, [baseJobs, titleQ, locationQ])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => {
    if (paginated.length > 0 && !selectedJob) setSelectedJob(paginated[0])
  }, [paginated, selectedJob])

  function toggleSave(id: string) {
    setSavedJobs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 30) return `${days} days ago`
    const months = Math.floor(days / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  }

  const empTypeColors: Record<string, string> = {
    permanent: 'bg-green-50 text-green-700',
    'part-time': 'bg-blue-50 text-blue-700',
    contract: 'bg-orange-50 text-orange-700',
    casual: 'bg-purple-50 text-purple-700',
    temporary: 'bg-yellow-50 text-yellow-700',
  }

  return (
    <div className="space-y-4">

      {/* Heading + search */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{company.name} Jobs and Careers</h2>
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={titleQ} onChange={e => { setTitleQ(e.target.value); setPage(1); setSelectedJob(null) }}
              placeholder="Job title, keywords"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input value={locationQ} onChange={e => { setLocationQ(e.target.value); setPage(1); setSelectedJob(null) }}
              placeholder="City, province"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap">
            Find Jobs
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 font-medium">
          {filtered.length.toLocaleString()} job{filtered.length !== 1 ? 's' : ''} at {company.name}
        </p>
      </div>

      {/* ── Mobile job list (stacked, full width) ── */}
      <div className="md:hidden space-y-2 mt-4">
        {paginated.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {baseJobs.length === 0 ? 'No open positions right now' : 'No jobs match your search'}
            </p>
            <p className="text-xs text-gray-400">
              {baseJobs.length === 0
                ? `${company.name} hasn't posted any jobs on Waiterstation yet.`
                : 'Try different keywords or clear your filters.'}
            </p>
          </div>
        ) : paginated.map(job => (
          <a key={job.id} href={`/jobs/${job.id}`}
            className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 active:bg-gray-50 transition">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-blue-600 leading-tight">{job.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{job.employer_name} · {job.location}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${empTypeColors[job.employment_type] ?? 'bg-gray-100 text-gray-600'}`}>
                  {job.employment_type.replace('-', ' ')}
                </span>
                {job.pay && <span className="text-[11px] text-gray-500">{job.pay}</span>}
                <span className="text-[11px] text-gray-400">{timeAgo(job.created_at)}</span>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        ))}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 pt-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => { setPage(p); setSelectedJob(null) }}
                className={`w-8 h-8 text-xs rounded-lg border transition ${
                  page === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Split panel (desktop only) */}
      <div className="hidden md:flex gap-4 items-start">

        {/* Left — job list */}
        <div className="w-72 shrink-0 space-y-1.5">
          {paginated.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {baseJobs.length === 0 ? 'No open positions right now' : 'No jobs match your search'}
              </p>
              <p className="text-xs text-gray-400">
                {baseJobs.length === 0
                  ? `${company.name} hasn't posted any jobs on Waiterstation yet.`
                  : 'Try different keywords or clear your filters.'}
              </p>
            </div>
          ) : paginated.map(job => (
            <div key={job.id} role="button" tabIndex={0} onClick={() => setSelectedJob(job)}
              onKeyDown={e => e.key === 'Enter' && setSelectedJob(job)}
              className={`w-full text-left rounded-xl border p-3.5 transition cursor-pointer ${
                selectedJob?.id === job.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-blue-600 leading-tight line-clamp-2">{job.title}</p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <p className="text-xs text-gray-500">{job.employer_name}</p>
                    {job.franchise_name && job.brand_link_status === 'approved' && (
                      <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">Franchise</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{job.location}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${empTypeColors[job.employment_type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {job.employment_type.replace('-', ' ')}
                    </span>
                    {job.pay && <span className="text-[11px] text-gray-500">{job.pay}</span>}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleSave(job.id) }}
                  className="shrink-0 mt-0.5 text-gray-300 hover:text-blue-500 transition">
                  <svg className="w-4 h-4" fill={savedJobs.has(job.id) ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    style={{ color: savedJobs.has(job.id) ? '#3B82F6' : undefined }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">{timeAgo(job.created_at)}</p>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => { setPage(p); setSelectedJob(null) }}
                  className={`w-8 h-8 text-xs rounded-lg border transition ${
                    page === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{p}</button>
              ))}
              {page < totalPages && (
                <button onClick={() => { setPage(p => p + 1); setSelectedJob(null) }}
                  className="px-3 h-8 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                  Next
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right — job detail */}
        <div className="flex-1 min-w-0">
          {selectedJob ? (() => {
            const jobCo = MOCK_COMPANIES.find(c => c.name === selectedJob.employer_name)
            return (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-[140px] max-h-[calc(100vh-180px)] flex flex-col">

              {/* Sticky header */}
              <div className="px-5 pt-5 pb-4 shrink-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {jobCo?.logo_url
                      ? <img src={jobCo.logo_url} alt={selectedJob.employer_name} className="w-full h-full object-contain p-0.5" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      : <span className="text-base font-bold text-gray-400">{selectedJob.employer_name.charAt(0)}</span>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-xs font-semibold text-gray-400">{selectedJob.employer_name}</p>
                      <ClaimedBadge claimed={jobCo?.claimed} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{selectedJob.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-500">{selectedJob.location}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${empTypeColors[selectedJob.employment_type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {selectedJob.employment_type.replace('-', ' ')}
                      </span>
                      {jobCo && (
                        <div className="flex items-center gap-1">
                          <StarRating rating={jobCo.overall_rating} />
                          <span className="text-xs font-bold text-gray-700">{jobCo.overall_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => toggleSave(selectedJob.id)}
                    className={`shrink-0 p-2 rounded-full border transition ${
                      savedJobs.has(selectedJob.id) ? 'border-blue-300 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500'
                    }`}>
                    <svg className="w-4 h-4" fill={savedJobs.has(selectedJob.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {selectedJob.pay && (
                  <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3 mb-3">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pay</p>
                      <p className="text-sm font-extrabold text-gray-900 mt-0.5">{selectedJob.pay}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <a href={`/jobs/${selectedJob.id}`}
                    className="flex-1 text-center text-sm font-bold text-white bg-blue-600 py-2.5 rounded-lg hover:bg-blue-700 transition">
                    Apply now
                  </a>
                  <a href={`/jobs/${selectedJob.id}`}
                    className="text-sm font-semibold text-blue-600 border border-blue-200 px-4 py-2.5 rounded-lg hover:bg-blue-50 transition">
                    View full job
                  </a>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">

                {/* Job description */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Job description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line line-clamp-[12]">{selectedJob.description}</p>
                  <a href={`/jobs/${selectedJob.id}`} className="block mt-2 text-xs text-blue-600 hover:underline font-medium">
                    See full description →
                  </a>
                  <p className="text-xs text-gray-400 mt-2">Posted {timeAgo(selectedJob.created_at)}</p>
                </div>

                {/* Company overview */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Company overview</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-3 mb-3">
                    {[
                      { label: 'Size', value: jobCo?.size ?? 'Not listed' },
                      { label: 'Location', value: selectedJob.location },
                      { label: 'Industry', value: jobCo?.industry ?? 'Hospitality' },
                    ].map(s => (
                      <div key={s.label}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">{s.label}</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  {jobCo
                    ? <p className="text-xs text-gray-600 leading-relaxed">{jobCo.description}</p>
                    : <p className="text-xs text-gray-400 italic">No company profile yet on Waiterstation.</p>
                  }
                </div>

                {/* Ratings */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">{selectedJob.employer_name} ratings</h4>
                  {jobCo ? (
                    <div className="flex items-start gap-4">
                      <div className="text-center shrink-0">
                        <p className="text-3xl font-extrabold text-gray-900 leading-none">{jobCo.overall_rating.toFixed(1)}</p>
                        <StarRating rating={jobCo.overall_rating} />
                        <p className="text-[10px] text-gray-400 mt-1">{jobCo.reviews.length} reviews</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        <RatingBar label="Work-life balance" value={jobCo.ratings.work_life_balance} />
                        <RatingBar label="Culture & values" value={jobCo.ratings.culture} />
                        <RatingBar label="Management" value={jobCo.ratings.management} />
                        <RatingBar label="Career growth" value={jobCo.ratings.career_growth} />
                        <RatingBar label="Compensation" value={jobCo.ratings.compensation} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No ratings yet for {selectedJob.employer_name}.</p>
                  )}
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{selectedJob.employer_name} benefits</h4>
                  {jobCo ? (
                    <div className="flex flex-wrap gap-1.5">
                      {jobCo.benefits.map(b => (
                        <span key={b} className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Benefits not listed by this employer.</p>
                  )}
                </div>

                {/* Employee reviews */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Employee reviews</h4>
                  {jobCo ? (
                    <div className="space-y-2.5">
                      {jobCo.reviews.slice(0, 2).map(r => (
                        <div key={r.id} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <p className="text-xs font-bold text-gray-900">{r.anonymous ? 'Anonymous' : r.author_name}</p>
                              <p className="text-[10px] text-gray-500">{r.role} · {r.date}</p>
                            </div>
                            <StarRating rating={r.rating} />
                          </div>
                          <p className="text-xs text-gray-700"><span className="font-semibold">Pros: </span>{r.pros}</p>
                          <p className="text-xs text-gray-700 mt-0.5"><span className="font-semibold">Cons: </span>{r.cons}</p>
                        </div>
                      ))}
                      <a href={`/companies/${jobCo.id}?tab=reviews`}
                        className="inline-block text-xs font-semibold text-gray-900 hover:underline mt-1">
                        See all reviews →
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No reviews yet for {selectedJob.employer_name}.</p>
                  )}
                </div>

              </div>
            </div>
            )
          })() : (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
              Select a job to see details
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 flex items-center gap-1">
        <a href="/companies" className="text-blue-600 hover:underline">Companies</a>
        <span>›</span>
        <a href="/companies" className="text-blue-600 hover:underline">{company.industry}</a>
        <span>›</span>
        <a href={`/companies/${company.id}`} className="text-blue-600 hover:underline">{company.name}</a>
        <span>›</span>
        <span>Jobs</span>
      </div>

      {/* Related companies */}
      {relatedCompanies.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-1">More companies you might be interested in</h3>
          <form action="/companies" method="GET" className="relative mt-3 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input name="q" placeholder="Find another company"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </form>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {relatedCompanies.map(c => (
              <a key={c.id} href={`/companies/${c.id}?tab=jobs`}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition group">
                <div className="w-8 h-8 rounded border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {c.logo_url
                    ? <img src={c.logo_url} alt={c.name} className="w-full h-full object-contain p-0.5" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    : <span className="text-xs font-bold text-gray-400">{c.name.charAt(0)}</span>
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 truncate">{c.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <StarRating rating={c.overall_rating} />
                    <span className="text-xs text-gray-500">{c.overall_rating.toFixed(1)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Salary data ──────────────────────────────────────────────────────────────

const SALARY_CATEGORIES = [
  {
    label: 'Front of House',
    roles: [
      { role: 'Waiter / Waitress', min: 4000, max: 8000, unit: '/month + tips', count: 312 },
      { role: 'Senior Waiter / Floor Captain', min: 7000, max: 12000, unit: '/month + tips', count: 88 },
      { role: 'Bartender', min: 5000, max: 9000, unit: '/month + tips', count: 204 },
      { role: 'Host / Hostess', min: 4500, max: 7500, unit: '/month', count: 67 },
      { role: 'Cashier', min: 4000, max: 6500, unit: '/month', count: 145 },
      { role: 'Barista', min: 4500, max: 7000, unit: '/month + tips', count: 189 },
    ],
  },
  {
    label: 'Kitchen & Culinary',
    roles: [
      { role: 'Chef / Head Chef', min: 15000, max: 40000, unit: '/month', count: 76 },
      { role: 'Sous Chef', min: 10000, max: 22000, unit: '/month', count: 93 },
      { role: 'Line Cook / Commis Chef', min: 5500, max: 10000, unit: '/month', count: 211 },
      { role: 'Pastry Chef', min: 8000, max: 18000, unit: '/month', count: 42 },
      { role: 'Kitchen Porter', min: 3800, max: 6000, unit: '/month', count: 158 },
      { role: 'Prep Cook', min: 4500, max: 8000, unit: '/month', count: 97 },
    ],
  },
  {
    label: 'Management',
    roles: [
      { role: 'Restaurant Manager', min: 15000, max: 35000, unit: '/month', count: 134 },
      { role: 'General Manager', min: 25000, max: 60000, unit: '/month', count: 49 },
      { role: 'Assistant Manager', min: 12000, max: 22000, unit: '/month', count: 112 },
      { role: 'Food & Beverage Manager', min: 18000, max: 40000, unit: '/month', count: 61 },
      { role: 'Shift Supervisor', min: 8000, max: 15000, unit: '/month', count: 88 },
      { role: 'Events Manager', min: 15000, max: 30000, unit: '/month', count: 37 },
    ],
  },
  {
    label: 'Hotel & Accommodation',
    roles: [
      { role: 'Front Desk Receptionist', min: 6000, max: 12000, unit: '/month', count: 178 },
      { role: 'Concierge', min: 7000, max: 14000, unit: '/month', count: 54 },
      { role: 'Housekeeping', min: 4500, max: 9000, unit: '/month', count: 264 },
      { role: 'Room Attendant', min: 4000, max: 7500, unit: '/month', count: 193 },
      { role: 'Night Auditor', min: 6500, max: 11000, unit: '/month', count: 41 },
      { role: 'Hotel Manager', min: 25000, max: 65000, unit: '/month', count: 28 },
    ],
  },
  {
    label: 'Safari & Guiding',
    roles: [
      { role: 'Game Ranger / Field Guide', min: 8000, max: 22000, unit: '/month + gratuities', count: 89 },
      { role: 'Lodge Manager', min: 20000, max: 45000, unit: '/month + accommodation', count: 34 },
      { role: 'Safari Host / Hostess', min: 7000, max: 14000, unit: '/month + gratuities', count: 47 },
      { role: 'Tracker', min: 6000, max: 12000, unit: '/month + gratuities', count: 56 },
      { role: 'Conservation Officer', min: 9000, max: 18000, unit: '/month', count: 22 },
    ],
  },
  {
    label: 'Wellness & Spa',
    roles: [
      { role: 'Spa Therapist', min: 6000, max: 12000, unit: '/month + tips', count: 103 },
      { role: 'Senior Therapist', min: 9000, max: 16000, unit: '/month + tips', count: 44 },
      { role: 'Spa Manager', min: 15000, max: 28000, unit: '/month', count: 29 },
      { role: 'Beauty Therapist', min: 5500, max: 11000, unit: '/month + tips', count: 67 },
    ],
  },
]

const SALARY_FAQS = [
  { q: 'Do people feel that they are paid fairly in the hospitality industry?', a: 'According to our survey data, approximately 38% of hospitality workers feel they are paid fairly. Pay satisfaction is higher in luxury hotels and safari lodges, and lower in quick-service restaurants.' },
  { q: 'Do hospitality workers receive overtime pay?', a: 'Yes, most hospitality employers in South Africa are required to pay overtime at 1.5× the basic rate under the BCEA. However, compliance varies and some employers offer time off in lieu instead.' },
  { q: 'How often do you get pay raises in hospitality?', a: 'Raises typically happen annually, often tied to minimum wage adjustments by the Department of Employment and Labour. High performers in fine dining and luxury lodges may receive more frequent increases.' },
  { q: 'Do you get paid sick leave in hospitality?', a: 'The BCEA entitles employees to 30 days paid sick leave in every 3-year cycle. However, casual and part-time workers may have different arrangements.' },
  { q: 'How much vacation and PTO do hospitality workers get?', a: 'Full-time hospitality employees are entitled to 21 consecutive days (15 working days) annual leave per year. Some employers offer additional leave after long service.' },
  { q: 'Is tip income significant in South African hospitality?', a: 'Yes — in fine dining and luxury settings tips can add R2 000 – R6 000+/month. At high-end hotels and safari lodges, guest gratuities often form a significant portion of total income.' },
]

const ALL_CATEGORIES = ['Accounting', 'Administrative', 'Bar & Beverage', 'Catering', 'Cleaning & Sanitation', 'Concierge', 'Customer Service', 'Events', 'Finance', 'Food & Beverage', 'Front of House', 'Guest Relations', 'Guiding & Safari', 'Hotel Operations', 'Housekeeping', 'Human Resources', 'Kitchen & Culinary', 'Lodge Management', 'Management', 'Marketing', 'Procurement', 'Recreation', 'Reservations', 'Revenue Management', 'Sales', 'Security', 'Spa & Wellness', 'Stewarding', 'Training', 'Wine & Sommelier']

// ─── Salary tab (Indeed layout) ───────────────────────────────────────────────

function DonutChart({ pct }: { pct: number }) {
  const r = 38, cx = 44, cy = 44
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg viewBox="0 0 88 88" className="w-20 h-20">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3B82F6" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fontSize="16" fontWeight="bold" fill="#1F2937">{pct}%</text>
    </svg>
  )
}

function SalariesTab({ company, reviews, relatedCompanies, onWriteReview }: {
  company: Company
  reviews: CompanyReview[]
  relatedCompanies: Company[]
  onWriteReview: () => void
}) {
  const [roleSearch, setRoleSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const reportedSalaries = reviews.filter(r => r.salary)
  const satisfactionPct = Math.round((company.ratings.compensation / 5) * 100)

  const companyJobs = useMemo(() =>
    MOCK_JOBS.filter(j =>
      j.employer_name.toLowerCase().includes(company.name.split(' ')[0].toLowerCase()) ||
      company.name.toLowerCase().includes(j.employer_name.split(' ')[0].toLowerCase())
    ).slice(0, 6),
    [company.name]
  )

  const filteredCategories = useMemo(() => {
    if (!roleSearch) return SALARY_CATEGORIES
    const q = roleSearch.toLowerCase()
    return SALARY_CATEGORIES.map(cat => ({
      ...cat,
      roles: cat.roles.filter(r => r.role.toLowerCase().includes(q)),
    })).filter(cat => cat.roles.length > 0)
  }, [roleSearch])

  return (
    <div className="space-y-5">

      {/* Hero filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          {company.name} salaries: How much does {company.name} pay?
        </h2>
        <p className="text-xs text-gray-400 mb-4">Updated {new Date().toLocaleDateString('en-ZA', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input value={roleSearch} onChange={e => setRoleSearch(e.target.value)}
              placeholder="Search job title"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700">
            <option>South Africa</option>
            <option>Cape Town</option>
            <option>Johannesburg</option>
            <option>Durban</option>
            <option>Stellenbosch</option>
          </select>
        </div>
      </div>

      {/* Reported salaries + satisfaction */}
      {reportedSalaries.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Reported at {company.name}</h3>
              <div className="space-y-2">
                {reportedSalaries.map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <span className="text-sm text-blue-600 font-medium">{r.role}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${r.employment_status === 'Current' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.employment_status}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">{r.helpful_count} salaries reported</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{r.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-center pl-6">
              <p className="text-xs font-semibold text-gray-500 mb-2">Salary satisfaction</p>
              <DonutChart pct={satisfactionPct} />
              <p className="text-[11px] text-gray-400 mt-2 max-w-[120px] leading-snug">
                {satisfactionPct}% feel fairly paid based on {reviews.length} ratings
              </p>
              <button onClick={onWriteReview} className="text-xs text-blue-600 hover:underline mt-1">Rate your salary</button>
            </div>
          </div>
        </div>
      )}

      {/* Popular jobs at company */}
      {companyJobs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Popular jobs at {company.name}</h3>
            <a href={`/?q=${encodeURIComponent(company.name)}`} className="text-xs text-blue-600 hover:underline font-medium">
              See all jobs at {company.name} →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {companyJobs.map(job => (
              <a key={job.id} href={`/jobs/${job.id}`}
                className="flex items-start justify-between border border-gray-100 rounded-lg p-3 hover:shadow-sm hover:border-gray-300 transition group">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-blue-600 font-medium group-hover:underline leading-tight">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{job.location}</p>
                  {job.pay && <p className="text-xs font-semibold text-gray-700 mt-1">{job.pay}</p>}
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Salary categories */}
      {filteredCategories.map(cat => (
        <div key={cat.label} className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">{cat.label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
            {cat.roles.map(role => (
              <div key={role.role} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm text-blue-600 hover:underline cursor-default font-medium">{role.role}</p>
                  <p className="text-xs text-gray-400">{role.count} salaries reported</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-bold text-gray-900">
                    R{role.min.toLocaleString()} – R{role.max.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{role.unit}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setRoleSearch(cat.label); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="mt-3 text-xs text-blue-600 hover:underline font-medium">
            All {company.name} — {cat.label} salaries →
          </button>
        </div>
      ))}

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Common questions about salaries at {company.name}</h3>
        <div className="space-y-1">
          {SALARY_FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex items-center justify-between w-full py-3 text-left">
                <span className="text-sm text-gray-700 font-medium pr-4">{faq.q}</span>
                <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <p className="text-sm text-gray-600 leading-relaxed pb-3">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Browse by category */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Browse all {company.name} salaries by category</h3>
        <div className="columns-2 sm:columns-3 gap-x-6 space-y-1">
          {ALL_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setRoleSearch(cat); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="block text-xs text-blue-600 hover:underline py-0.5 text-left">{cat}</button>
          ))}
        </div>
      </div>

      {/* Summary paragraph */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-2">How much does {company.name} pay in South Africa?</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Average salaries at {company.name} range from approximately R{(4000).toLocaleString()} per month for entry-level roles to R{(45000).toLocaleString()}+ per month for senior management positions. The average salary is influenced by location, experience, and the specific department. {company.name} is based in {company.location} and operates in the {company.industry} sector.
        </p>
        <p className="text-xs text-gray-400 mt-3">
          Salary estimates are based on third-party submissions to Waiterstation. Actual salaries may vary. Minimum wage may differ — always confirm with the employer for actual salary figures.
        </p>
      </div>

      {/* See what similar companies pay */}
      {relatedCompanies.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">See what similar companies pay</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {relatedCompanies.slice(0, 4).map(c => (
              <a key={c.id} href={`/companies/${c.id}?tab=salaries`}
                className="shrink-0 w-52 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition group block">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {c.logo_url
                      ? <img src={c.logo_url} alt={c.name} className="w-full h-full object-contain p-0.5" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      : <span className="text-xs font-bold text-gray-400">{c.name.charAt(0)}</span>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 truncate">{c.name}</p>
                    <div className="flex items-center gap-1">
                      <StarRating rating={c.overall_rating} />
                      <span className="text-xs text-gray-500">{c.overall_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {c.size}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {c.overall_rating.toFixed(1)} overall rating
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {c.reviews.length} review{c.reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-600 group-hover:underline">
                  View salaries →
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = 'overview' | 'reviews' | 'salaries' | 'jobs' | 'benefits'

export default function CompanyClient({ company, franchiseJobs = [] }: { company: Company; franchiseJobs?: import('@/lib/types').Job[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = (searchParams.get('tab') as Tab | null) ?? 'overview'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  const [reviewFilter, setReviewFilter] = useState<'all' | 'Current' | 'Former'>('all')
  const [showModal, setShowModal] = useState(false)
  const [reviews, setReviews] = useState<CompanyReview[]>(company.reviews)
  const [following, setFollowing] = useState(false)

  function switchTab(tab: Tab) {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'overview') params.delete('tab')
    else params.set('tab', tab)
    const qs = params.toString()
    router.replace(`/companies/${company.id}${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  const overallRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : company.overall_rating

  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviews.filter(r => r.employment_status === reviewFilter)

  const relatedCompanies = MOCK_COMPANIES
    .filter(c => c.id !== company.id && c.industry.toLowerCase().includes(company.industry.split(' ')[0].toLowerCase()))
    .slice(0, 6)

  function handleNewReview(review: CompanyReview) {
    setReviews(prev => [review, ...prev])
    switchTab('reviews')
  }

  // Work wellbeing metrics derived from ratings
  const wellbeing = [
    { label: 'Happiness', value: company.ratings.culture, color: 'text-green-600', bg: 'bg-green-50', badge: 'Good' },
    { label: 'Purpose', value: company.ratings.career_growth, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'Good' },
    { label: 'Satisfaction', value: company.ratings.work_life_balance, color: 'text-purple-600', bg: 'bg-purple-50', badge: null },
  ]

  const ratingDimensions: { key: keyof Company['ratings']; label: string }[] = [
    { key: 'work_life_balance', label: 'Work-life balance' },
    { key: 'culture', label: 'Culture & values' },
    { key: 'management', label: 'Management' },
    { key: 'career_growth', label: 'Career growth' },
    { key: 'compensation', label: 'Compensation' },
  ]

  const mockMatchedJobs = useMemo(() =>
    MOCK_JOBS.filter(j => {
      const jn = j.employer_name.toLowerCase()
      const cn = company.name.toLowerCase()
      return jn === cn || jn.includes(cn) || cn.includes(jn)
    }),
    [company.name]
  )

  // Merge real franchise jobs (from Supabase) with mock matches, deduped by id
  const allCompanyJobs = useMemo(() => {
    const seen = new Set(franchiseJobs.map(j => j.id))
    const merged = [...franchiseJobs]
    for (const j of mockMatchedJobs) {
      if (!seen.has(j.id)) merged.push(j)
    }
    return merged
  }, [franchiseJobs, mockMatchedJobs])

  const jobCount = allCompanyJobs.length

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'salaries', label: 'Salaries' },
    { id: 'jobs', label: `Jobs (${jobCount})` },
    { id: 'benefits', label: 'Benefits' },
  ]

  return (
    <>
      {showModal && (
        <WriteReviewModal
          companyName={company.name}
          onClose={() => setShowModal(false)}
          onSubmit={handleNewReview}
        />
      )}

      <div className="bg-white min-h-screen">

        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-200 sticky top-[52px] md:top-0 z-30">
          <div className="max-w-5xl mx-auto px-4">
            {/* Company identity row */}
            <div className="flex items-center justify-between py-4 gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <a href="/companies" className="text-gray-400 hover:text-gray-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </a>
                <div className="w-10 h-10 rounded border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-0.5"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <span className="text-base font-bold text-gray-400">{company.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-bold text-gray-900 text-base truncate">{company.name}</h1>
                    <ClaimedBadge claimed={company.claimed} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRating rating={overallRating} />
                    <span className="text-sm font-semibold text-gray-800">{overallRating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setFollowing(f => !f)}
                  className={`text-sm font-semibold px-4 py-2 rounded-full border transition ${
                    following
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <button onClick={() => setShowModal(true)}
                  className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition hidden sm:block">
                  Write a review
                </button>
                <a href={`/?q=${encodeURIComponent(company.name)}`}
                  className="text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition hidden sm:block">
                  Open jobs
                </a>
              </div>
            </div>

            {/* Tab nav */}
            <div className="flex gap-0 -mb-px overflow-x-auto">
              {tabs.map(t => (
                <button key={t.id} onClick={() => switchTab(t.id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                    activeTab === t.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Page body ── */}
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-10">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <>
              {/* Work wellbeing */}
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Work wellbeing</h2>
                  <button onClick={() => switchTab('reviews')} className="text-xs text-blue-600 font-medium ml-1 hover:underline">Based on reviews ↗</button>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {wellbeing.map(w => (
                    <div key={w.label} className={`${w.bg} rounded-xl p-3 md:p-4 text-center`}>
                      <div className={`text-xl md:text-2xl font-bold ${w.color}`}>{Math.round(w.value * 20)}%</div>
                      <div className="text-xs md:text-sm font-semibold text-gray-700 mt-1 leading-tight">{w.label}</div>
                      {w.badge && (
                        <span className="inline-block mt-2 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                          {w.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* About the company */}
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">About the company</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 leading-relaxed">{company.description}</p>
                    {company.website && (
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline font-medium">
                        {company.website}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <div className="pt-4 md:pt-0 md:pl-6">
                    <div className="space-y-3">
                      {[
                        { label: 'Industry', value: company.industry },
                        { label: 'Company size', value: company.size },
                        { label: 'Headquarters', value: company.location },
                        { label: 'Type', value: 'Private' },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.label}</div>
                          <div className="text-sm text-gray-800 font-medium mt-0.5">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Rating overview */}
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-bold text-gray-900 mb-5">Rating overview</h2>
                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start sm:items-center">
                  {/* Big number */}
                  <div className="text-center shrink-0">
                    <div className="text-4xl md:text-5xl font-bold text-gray-900">{overallRating.toFixed(1)}</div>
                    <StarRating rating={overallRating} size="md" />
                    <div className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                  </div>
                  {/* Radar chart — hidden on small phones */}
                  <div className="hidden sm:block shrink-0">
                    <RadarChart ratings={company.ratings} />
                  </div>
                  {/* Bar breakdown */}
                  <div className="flex-1 space-y-3 w-full">
                    {ratingDimensions.map(({ key, label }) => (
                      <RatingBar key={key} label={label} value={company.ratings[key]} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Benefits */}
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">Benefits</h2>
                <div className="flex flex-wrap gap-2">
                  {company.benefits.map(b => (
                    <span key={b} className="flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {b}
                    </span>
                  ))}
                </div>
              </section>

              {/* Recent reviews preview */}
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Reviews</h2>
                  <button onClick={() => switchTab('reviews')} className="text-sm text-blue-600 hover:underline font-medium">
                    See all {reviews.length} reviews →
                  </button>
                </div>
                <div>
                  {reviews.slice(0, 2).map(r => <ReviewCard key={r.id} review={r} />)}
                </div>
                <button onClick={() => switchTab('reviews')}
                  className="mt-4 w-full text-sm font-semibold text-blue-600 border border-blue-200 py-2.5 rounded-full hover:bg-blue-50 transition">
                  See all reviews
                </button>
              </section>

              {/* Common questions */}
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">Common questions about {company.name}</h2>
                <div className="space-y-3">
                  {[
                    `Is ${company.name} a good place to work?`,
                    `What is the salary at ${company.name}?`,
                    `Does ${company.name} offer good benefits?`,
                    `How is the work culture at ${company.name}?`,
                  ].map((q, i) => (
                    <details key={i} className="group border border-gray-100 rounded-lg">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none">
                        <span className="text-sm text-gray-700 font-medium">{q}</span>
                        <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-3">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {i === 0 && `Based on ${reviews.length} employee review${reviews.length !== 1 ? 's' : ''}, ${company.name} scores ${overallRating.toFixed(1)} out of 5 overall. ${overallRating >= 4 ? 'This is above average for the hospitality sector.' : 'Read the reviews to get a full picture.'}`}
                          {i === 1 && (company.reviews.find(r => r.salary)
                            ? `Employees at ${company.name} have reported salaries including: ${company.reviews.filter(r => r.salary).slice(0, 2).map(r => `${r.role} at ${r.salary}`).join('; ')}.`
                            : `No salary data has been reported yet for ${company.name}. See the Salaries tab for industry benchmarks.`)}
                          {i === 2 && `${company.name} offers the following benefits: ${company.benefits.slice(0, 4).join(', ')}${company.benefits.length > 4 ? `, and ${company.benefits.length - 4} more.` : '.'}`}
                          {i === 3 && `${company.name} scores ${company.ratings.culture.toFixed(1)} out of 5 for culture and values, and ${company.ratings.management.toFixed(1)} for management. ${company.ratings.culture >= 4 ? 'Reviewers highlight the workplace culture positively.' : 'Read the full reviews for employee perspectives.'}`}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Companies you might like */}
              {relatedCompanies.length > 0 && (
                <section className="bg-white border border-gray-200 rounded-xl p-5">
                  <h2 className="text-base font-bold text-gray-900 mb-4">Companies you might be interested in</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {relatedCompanies.map(c => (
                      <a key={c.id} href={`/companies/${c.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition group">
                        <div className="w-9 h-9 rounded border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {c.logo_url ? (
                            <img src={c.logo_url} alt={c.name} className="w-full h-full object-contain p-0.5"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          ) : (
                            <span className="text-sm font-bold text-gray-400">{c.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition truncate">{c.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <StarRating rating={c.overall_rating} size="sm" />
                            <span className="text-xs text-gray-500">{c.overall_rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === 'reviews' && (
            <ReviewsTab
              company={company}
              reviews={reviews}
              overallRating={overallRating}
              relatedCompanies={relatedCompanies}
              onWriteReview={() => setShowModal(true)}
            />
          )}

          {/* ── SALARIES ── */}
          {activeTab === 'salaries' && (
            <SalariesTab company={company} reviews={reviews} relatedCompanies={relatedCompanies} onWriteReview={() => setShowModal(true)} />
          )}

          {/* ── JOBS ── */}
          {activeTab === 'jobs' && (
            <JobsTab company={company} relatedCompanies={relatedCompanies} allJobs={allCompanyJobs} />
          )}

          {/* ── BENEFITS ── */}
          {activeTab === 'benefits' && (
            <section className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">Benefits at {company.name}</h2>
              <p className="text-xs text-gray-400 mb-5">As reported by employees</p>
              <div className="flex flex-wrap gap-2">
                {company.benefits.map(b => (
                  <span key={b} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-full">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </span>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  )
}
