'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Company, CompanyReview, MOCK_COMPANIES } from '@/lib/mock-companies'

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
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-36 shrink-0">{label}</span>
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
    <div className="border-b border-gray-100 py-5 last:border-0">
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
          <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full shrink-0">
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
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 rounded-t-2xl">
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
                    className={`text-3xl transition ${n <= displayRating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
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

// ─── Salary benchmarks ────────────────────────────────────────────────────────

const SALARY_BENCHMARKS = [
  { role: 'Waiter / Waitress', min: 4000, max: 8000, unit: '/month + tips' },
  { role: 'Chef / Sous Chef', min: 8000, max: 22000, unit: '/month' },
  { role: 'Bartender', min: 5000, max: 9000, unit: '/month + tips' },
  { role: 'Hotel Front Desk', min: 6000, max: 12000, unit: '/month' },
  { role: 'Housekeeping', min: 4500, max: 9000, unit: '/month' },
  { role: 'Barista', min: 4500, max: 7000, unit: '/month' },
  { role: 'Restaurant Manager', min: 15000, max: 30000, unit: '/month' },
  { role: 'Game Ranger / Guide', min: 8000, max: 18000, unit: '/month + gratuities' },
  { role: 'Spa Therapist', min: 6000, max: 12000, unit: '/month + tips' },
]

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = 'overview' | 'reviews' | 'salaries' | 'benefits'

export default function CompanyClient({ company }: { company: Company }) {
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'salaries', label: 'Salaries' },
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
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
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
                  <h1 className="font-bold text-gray-900 text-base truncate">{company.name}</h1>
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
                  {following ? '✓ Following' : 'Follow'}
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
                <div className="grid grid-cols-3 gap-4">
                  {wellbeing.map(w => (
                    <div key={w.label} className={`${w.bg} rounded-xl p-4 text-center`}>
                      <div className={`text-2xl font-bold ${w.color}`}>{Math.round(w.value * 20)}%</div>
                      <div className="text-sm font-semibold text-gray-700 mt-1">{w.label}</div>
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
                  <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
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
                <div className="flex flex-col sm:flex-row gap-8 items-center">
                  {/* Big number */}
                  <div className="text-center shrink-0">
                    <div className="text-5xl font-bold text-gray-900">{overallRating.toFixed(1)}</div>
                    <StarRating rating={overallRating} size="md" />
                    <div className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                  </div>
                  {/* Radar chart */}
                  <div className="shrink-0">
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
                    <span key={b} className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
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
            <section className="bg-white border border-gray-200 rounded-xl p-5">
              {/* Rating summary bar */}
              <div className="flex items-center gap-6 pb-5 mb-5 border-b border-gray-100">
                <div className="text-center shrink-0">
                  <div className="text-4xl font-bold text-gray-900">{overallRating.toFixed(1)}</div>
                  <StarRating rating={overallRating} size="md" />
                  <div className="text-xs text-gray-400 mt-1">{reviews.length} reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(star => {
                    const count = reviews.filter(r => Math.round(r.rating) === star).length
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <svg className="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-6">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'Current', 'Former'] as const).map(f => (
                    <button key={f} onClick={() => setReviewFilter(f)}
                      className={`text-sm font-medium px-4 py-1.5 rounded-full border transition ${
                        reviewFilter === f
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}>
                      {f === 'all' ? 'All reviews' : `${f} employees`}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowModal(true)}
                  className="text-sm font-semibold text-blue-600 hover:underline">
                  + Write a review
                </button>
              </div>

              {filteredReviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No reviews match this filter.</p>
              ) : (
                <div>
                  {filteredReviews.map(r => <ReviewCard key={r.id} review={r} />)}
                </div>
              )}
            </section>
          )}

          {/* ── SALARIES ── */}
          {activeTab === 'salaries' && (
            <section className="bg-white border border-gray-200 rounded-xl p-5">
              {company.reviews.filter(r => r.salary).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-base font-bold text-gray-900 mb-1">Reported at {company.name}</h2>
                  <p className="text-xs text-gray-400 mb-4">Self-reported by employees — actual salaries may vary</p>
                  <div className="space-y-2">
                    {company.reviews.filter(r => r.salary).map(r => (
                      <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-800">{r.role}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${r.employment_status === 'Current' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {r.employment_status}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-700">{r.salary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={company.reviews.filter(r => r.salary).length > 0 ? 'border-t border-gray-100 pt-6' : ''}>
                <h2 className="text-base font-bold text-gray-900 mb-1">SA hospitality salary benchmarks</h2>
                <p className="text-xs text-gray-400 mb-4">Typical ranges across the industry. Varies by location and experience.</p>
                <div className="space-y-2">
                  {SALARY_BENCHMARKS.map(b => (
                    <div key={b.role} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                      <span className="text-sm font-medium text-gray-700">{b.role}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">
                          R{b.min.toLocaleString()} – R{b.max.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">{b.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── BENEFITS ── */}
          {activeTab === 'benefits' && (
            <section className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-bold text-gray-900 mb-1">Benefits at {company.name}</h2>
              <p className="text-xs text-gray-400 mb-5">As reported by employees</p>
              <div className="flex flex-wrap gap-2">
                {company.benefits.map(b => (
                  <span key={b} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
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
