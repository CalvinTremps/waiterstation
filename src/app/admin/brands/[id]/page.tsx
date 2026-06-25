'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ratings {
  work_life_balance: number
  culture: number
  management: number
  career_growth: number
  compensation: number
}

interface Brand {
  id: string
  name: string
  industry: string
  size: string
  location: string
  description: string
  website: string | null
  logo_url: string | null
  is_active: boolean
  claimed: boolean
  overall_rating: number | null
  ratings: Ratings | null
  benefits: string[]
  created_at: string
}

interface Review {
  id: string
  brand_id: string
  role: string
  employment_status: 'Current' | 'Former'
  rating: number
  pros: string
  cons: string
  anonymous: boolean
  author_name: string | null
  salary: string | null
  helpful_count: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface Job {
  id: string
  title: string
  location: string
  employment_type: string
  status: string
  created_at: string
}

type Tab = 'info' | 'ratings' | 'reviews' | 'jobs'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FIELD = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400'
const INDUSTRIES = ['Restaurant Group', 'Restaurant Chain', 'Fine Dining Restaurant', 'Hotel Group', 'Luxury Hotel', 'Luxury Boutique Hotel', 'International Hotel Group', 'Hotel & Casino Group', 'Fast Food', 'Café / Restaurant', 'Café / Bakery / Restaurant', 'Bar / Nightclub', 'Catering', 'Hospitality Group', 'Cruise Line', 'Luxury Safari & Lodges', 'Wine Estate', 'Steakhouse', 'Other']
const SIZES = ['1–10 employees', '11–50 employees', '51–100 employees', '51–200 employees', '101–200 employees', '201–500 employees', '500–1 000 employees', '1 000+ employees']
const BLANK_RATINGS: Ratings = { work_life_balance: 3, culture: 3, management: 3, career_growth: 3, compensation: 3 }
const RATING_LABELS: [keyof Ratings, string][] = [
  ['work_life_balance', 'Work-life balance'],
  ['culture', 'Culture & values'],
  ['management', 'Management'],
  ['career_growth', 'Career growth'],
  ['compensation', 'Pay & compensation'],
]
const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-600',
}

function Stars({ v }: { v: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(v) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )
}

// ─── Review modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  brandId, review, onClose, onSaved,
}: {
  brandId: string
  review: Partial<Review> | null
  onClose: () => void
  onSaved: () => void
}) {
  const isNew = !review?.id
  const [form, setForm] = useState<Partial<Review>>(review ?? {
    brand_id: brandId, role: '', employment_status: 'Former', rating: 4,
    pros: '', cons: '', anonymous: true, author_name: null, salary: null, status: 'approved',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    setSaving(true); setErr('')
    const res = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: isNew ? 'review-create' : 'review-update', ...form, brand_id: brandId }),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setErr(json.error ?? 'Save failed'); return }
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">{isNew ? 'Add review' : 'Edit review'}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Role / Job title</label>
              <input className={FIELD} value={form.role ?? ''} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Waiter" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Employment status</label>
              <select className={FIELD} value={form.employment_status ?? 'Former'} onChange={e => setForm({ ...form, employment_status: e.target.value as 'Current' | 'Former' })}>
                <option value="Current">Current employee</option>
                <option value="Former">Former employee</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  className={`w-9 h-9 rounded-lg text-sm font-bold border transition ${form.rating === n ? 'bg-amber-400 border-amber-400 text-white' : 'border-gray-200 text-gray-500 hover:border-amber-300'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Pros</label>
            <textarea className={`${FIELD} h-20 resize-none`} value={form.pros ?? ''} onChange={e => setForm({ ...form, pros: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Cons</label>
            <textarea className={`${FIELD} h-20 resize-none`} value={form.cons ?? ''} onChange={e => setForm({ ...form, cons: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Salary (optional)</label>
              <input className={FIELD} value={form.salary ?? ''} onChange={e => setForm({ ...form, salary: e.target.value || null })} placeholder="e.g. R7 500/month + tips" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
              <select className={FIELD} value={form.status ?? 'approved'} onChange={e => setForm({ ...form, status: e.target.value as Review['status'] })}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.anonymous !== false} onChange={e => setForm({ ...form, anonymous: e.target.checked })} className="rounded" />
              Anonymous
            </label>
            {form.anonymous === false && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Author name</label>
                <input className={FIELD} value={form.author_name ?? ''} onChange={e => setForm({ ...form, author_name: e.target.value || null })} />
              </div>
            )}
          </div>
        </div>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="text-sm font-medium text-gray-500 px-4 py-2">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg">
            {saving ? 'Saving...' : 'Save review'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BrandDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('info')
  const [brand, setBrand] = useState<Brand | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  // Info tab form state
  const [info, setInfo] = useState<Partial<Brand>>({})

  // Ratings tab form state
  const [overallRating, setOverallRating] = useState('')
  const [ratings, setRatings] = useState<Ratings>(BLANK_RATINGS)
  const [benefitInput, setBenefitInput] = useState('')
  const [benefits, setBenefits] = useState<string[]>([])

  // Review modal
  const [reviewModal, setReviewModal] = useState<Partial<Review> | null | false>(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/brands?id=${id}`)
    const json = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) { setErr(json.error ?? 'Failed to load'); return }
    const b: Brand = json.brand
    setBrand(b)
    setReviews(json.reviews ?? [])
    setJobs(json.jobs ?? [])
    setInfo({
      name: b.name, industry: b.industry, size: b.size, location: b.location,
      description: b.description, website: b.website ?? '', logo_url: b.logo_url ?? '',
      is_active: b.is_active, claimed: b.claimed,
    })
    setOverallRating(b.overall_rating != null ? String(b.overall_rating) : '')
    setRatings(b.ratings ?? BLANK_RATINGS)
    setBenefits(b.benefits ?? [])
  }, [id])

  useEffect(() => { load() }, [load])

  async function saveInfo() {
    setSaving(true); setErr(''); setOk('')
    const res = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, ...info }),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setErr(json.error ?? 'Save failed'); return }
    setOk('Saved.')
    load()
  }

  async function saveRatings() {
    setSaving(true); setErr(''); setOk('')
    const res = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update', id,
        name: brand?.name,
        industry: brand?.industry ?? '',
        size: brand?.size ?? '',
        location: brand?.location ?? '',
        description: brand?.description ?? '',
        website: brand?.website,
        logo_url: brand?.logo_url,
        is_active: brand?.is_active,
        claimed: brand?.claimed,
        overall_rating: overallRating,
        ratings,
        benefits,
      }),
    })
    const json = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) { setErr(json.error ?? 'Save failed'); return }
    setOk('Saved.')
    load()
  }

  async function deleteReview(reviewId: string) {
    if (!confirm('Delete this review?')) return
    await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'review-delete', id: reviewId }),
    })
    load()
  }

  async function deleteBrand() {
    if (!confirm(`Delete "${brand?.name}"? This cannot be undone.`)) return
    await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
    router.push('/admin/brands')
  }

  if (loading) return <div className="p-8 text-sm text-gray-400">Loading...</div>
  if (!brand) return <div className="p-8 text-sm text-red-500">Brand not found.</div>

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'info', label: 'Info' },
    { id: 'ratings', label: 'Ratings & Benefits' },
    { id: 'reviews', label: 'Reviews', count: reviews.length },
    { id: 'jobs', label: 'Jobs', count: jobs.length },
  ]

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/brands" className="text-sm text-gray-400 hover:text-gray-600">← Brands</Link>
        <span className="text-gray-300">/</span>
        <div className="flex items-center gap-3 min-w-0">
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo_url} alt={brand.name} className="w-9 h-9 rounded-lg object-contain border border-gray-100 bg-white shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
              {brand.name[0]}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">{brand.name}</h1>
            <p className="text-xs text-gray-400">{brand.industry}{brand.location ? ` · ${brand.location}` : ''}</p>
          </div>
        </div>
        {brand.claimed && (
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full uppercase shrink-0">Claimed</span>
        )}
        {!brand.is_active && (
          <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase shrink-0">Inactive</span>
        )}
        <div className="ml-auto flex gap-2 shrink-0">
          {brand.website && (
            <a href={`https://${brand.website}`} target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg">
              View site ↗
            </a>
          )}
          <button onClick={deleteBrand} className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 px-3 py-1.5 rounded-lg">
            Delete brand
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setErr(''); setOk(''); setTab(t.id) }}
            className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 -mb-px ${
              tab === t.id ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}>
            {t.label}
            {t.count != null && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-400'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{err}</div>}
      {ok && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5">{ok}</div>}

      {/* ── Info tab ──────────────────────────────────────────────────────────── */}
      {tab === 'info' && (
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Brand name *</label>
            <input className={FIELD} value={info.name ?? ''} onChange={e => setInfo({ ...info, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Industry</label>
              <select className={FIELD} value={info.industry ?? ''} onChange={e => setInfo({ ...info, industry: e.target.value })}>
                <option value="">Select...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Size</label>
              <select className={FIELD} value={info.size ?? ''} onChange={e => setInfo({ ...info, size: e.target.value })}>
                <option value="">Select...</option>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Location (HQ)</label>
            <input className={FIELD} placeholder="e.g. Cape Town (HQ) · Nationwide" value={info.location ?? ''} onChange={e => setInfo({ ...info, location: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea className={`${FIELD} h-32 resize-none`} value={info.description ?? ''} onChange={e => setInfo({ ...info, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Website</label>
              <input className={FIELD} placeholder="e.g. nandos.co.za" value={info.website ?? ''} onChange={e => setInfo({ ...info, website: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Logo URL</label>
              <input className={FIELD} placeholder="https://logo.clearbit.com/..." value={info.logo_url ?? ''} onChange={e => setInfo({ ...info, logo_url: e.target.value })} />
            </div>
          </div>
          {info.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={info.logo_url} alt="Logo preview" className="w-16 h-16 rounded-xl object-contain border border-gray-200 bg-white" />
          )}
          <div className="flex gap-5 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={info.is_active ?? true} onChange={e => setInfo({ ...info, is_active: e.target.checked })} className="rounded" />
              Active (visible on site)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={info.claimed ?? false} onChange={e => setInfo({ ...info, claimed: e.target.checked })} className="rounded" />
              Claimed profile
            </label>
          </div>
          <div className="pt-2">
            <button onClick={saveInfo} disabled={saving}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg">
              {saving ? 'Saving...' : 'Save info'}
            </button>
          </div>
        </div>
      )}

      {/* ── Ratings & Benefits tab ────────────────────────────────────────────── */}
      {tab === 'ratings' && (
        <div className="space-y-6 max-w-xl">
          {/* Overall rating */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">Overall rating</h2>
            <div className="flex items-center gap-3">
              <input
                type="number" min="1" max="5" step="0.1"
                className={`${FIELD} w-28`}
                placeholder="e.g. 3.8"
                value={overallRating}
                onChange={e => setOverallRating(e.target.value)}
              />
              <span className="text-xs text-gray-400">Between 1.0 and 5.0</span>
            </div>
          </div>

          {/* Sub-ratings */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">Rating breakdown</h2>
            <div className="space-y-4">
              {RATING_LABELS.map(([key, label]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">{label}</label>
                    <span className="text-xs font-bold text-gray-900">{ratings[key].toFixed(1)}</span>
                  </div>
                  <input
                    type="range" min="1" max="5" step="0.1"
                    value={ratings[key]}
                    onChange={e => setRatings({ ...ratings, [key]: Number(e.target.value) })}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">Benefits</h2>
            <div className="flex gap-2 mb-3">
              <input
                className={`${FIELD} flex-1`}
                placeholder="e.g. Staff meals on shift"
                value={benefitInput}
                onChange={e => setBenefitInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && benefitInput.trim()) {
                    e.preventDefault()
                    setBenefits([...benefits, benefitInput.trim()])
                    setBenefitInput('')
                  }
                }}
              />
              <button
                onClick={() => { if (benefitInput.trim()) { setBenefits([...benefits, benefitInput.trim()]); setBenefitInput('') } }}
                className="text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg">
                Add
              </button>
            </div>
            {benefits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {benefits.map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                    {b}
                    <button onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}
                      className="text-gray-400 hover:text-red-500 leading-none">×</button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No benefits added yet. Type above and press Enter or click Add.</p>
            )}
          </div>

          <div className="pt-2">
            <button onClick={saveRatings} disabled={saving}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg">
              {saving ? 'Saving...' : 'Save ratings & benefits'}
            </button>
          </div>
        </div>
      )}

      {/* ── Reviews tab ───────────────────────────────────────────────────────── */}
      {tab === 'reviews' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            <button onClick={() => setReviewModal({})}
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              Add review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
              No reviews yet. Add the first one to populate the company page.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {r.anonymous ? 'Anonymous' : (r.author_name ?? 'Named')}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{r.role}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{r.employment_status} employee</span>
                        {r.salary && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.salary}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Stars v={r.rating} />
                        <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-ZA')}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[r.status] ?? ''}`}>{r.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setReviewModal(r)}
                        className="text-xs font-semibold text-violet-700 border border-violet-200 px-3 py-1 rounded-lg hover:bg-violet-50">
                        Edit
                      </button>
                      <button onClick={() => deleteReview(r.id)}
                        className="text-xs font-semibold text-red-600 border border-red-100 px-3 py-1 rounded-lg hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-gray-700 mt-2">
                    {r.pros && <p><span className="font-semibold text-gray-900">Pros: </span>{r.pros}</p>}
                    {r.cons && <p><span className="font-semibold text-gray-900">Cons: </span>{r.cons}</p>}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">{r.helpful_count} found helpful</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Jobs tab ──────────────────────────────────────────────────────────── */}
      {tab === 'jobs' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{jobs.length} job{jobs.length !== 1 ? 's' : ''} linked to this brand</p>
            <Link href="/admin/jobs/create"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              Post a job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
              No jobs linked to this brand yet.
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map(j => (
                <div key={j.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{j.title}</p>
                    <p className="text-xs text-gray-400">{j.location} · {j.employment_type}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[j.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {j.status}
                    </span>
                    <Link href={`/admin/jobs/${j.id}/edit`}
                      className="text-xs font-semibold text-violet-700 border border-violet-200 px-3 py-1 rounded-lg hover:bg-violet-50">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review modal */}
      {reviewModal !== false && (
        <ReviewModal
          brandId={id}
          review={reviewModal}
          onClose={() => setReviewModal(false)}
          onSaved={load}
        />
      )}
    </div>
  )
}
