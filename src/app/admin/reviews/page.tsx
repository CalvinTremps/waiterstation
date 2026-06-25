'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Review {
  id: string
  brand_id: string
  role: string
  employment_status: string
  rating: number
  pros: string
  cons: string
  anonymous: boolean
  author_name: string | null
  salary: string | null
  helpful_count: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  brands?: { name: string }
}

const STATUS_TABS = ['pending', 'approved', 'rejected'] as const
type StatusTab = typeof STATUS_TABS[number]

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

export default function ReviewQueuePage() {
  const [tab, setTab] = useState<StatusTab>('pending')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState<Record<StatusTab, number>>({ pending: 0, approved: 0, rejected: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/reviews')
    const json = await res.json().catch(() => ({}))
    if (res.ok) {
      setReviews(json.reviews ?? [])
      setCounts(json.counts ?? { pending: 0, approved: 0, rejected: 0 })
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function setStatus(reviewId: string, brandId: string, status: 'approved' | 'rejected') {
    await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'review-update', id: reviewId, brand_id: brandId, status }),
    })
    load()
  }

  async function deleteReview(reviewId: string, brandId: string) {
    if (!confirm('Delete this review? This cannot be undone.')) return
    await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'review-delete', id: reviewId, brand_id: brandId }),
    })
    load()
  }

  const filtered = reviews.filter(r => r.status === tab)

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Moderate employee reviews across all brands. Auto-approved and auto-rejected reviews are shown here too.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 -mb-px capitalize ${
              tab === s ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}>
            {s}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === s ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-400'}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
          {tab === 'pending' ? 'No reviews pending — queue is clear.' : `No ${tab} reviews.`}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/admin/brands/${r.brand_id}`}
                      className="font-semibold text-gray-900 hover:text-violet-700 transition">
                      {r.brands?.name ?? 'Unknown brand'}
                    </Link>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-600">{r.role}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{r.employment_status} employee</span>
                    {r.salary && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{r.salary}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Stars v={r.rating} />
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-ZA')}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                    {!r.anonymous && r.author_name && (
                      <span className="text-xs text-gray-500">by {r.author_name}</span>
                    )}
                    {r.anonymous && <span className="text-xs text-gray-400 italic">anonymous</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {r.status !== 'approved' && (
                    <button onClick={() => setStatus(r.id, r.brand_id, 'approved')}
                      className="text-xs font-semibold text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition">
                      Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button onClick={() => setStatus(r.id, r.brand_id, 'rejected')}
                      className="text-xs font-semibold text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition">
                      Reject
                    </button>
                  )}
                  <button onClick={() => deleteReview(r.id, r.brand_id)}
                    className="text-xs font-semibold text-red-600 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 text-sm text-gray-700 bg-gray-50 rounded-xl p-4">
                {r.pros && (
                  <p><span className="font-semibold text-gray-900">Pros: </span>{r.pros}</p>
                )}
                {r.cons && (
                  <p><span className="font-semibold text-gray-900">Cons: </span>{r.cons}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
