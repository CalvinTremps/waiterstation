'use client'

import { useState } from 'react'
import { MOCK_REVIEWS, MOCK_EMPLOYEES, type PerformanceReview } from '@/lib/mock-recruitment'

function Stars({ value, max = 5, size = 'sm' }: { value: number; max?: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= Math.round(value)
        return (
          <svg key={i} className={`${sz} ${filled ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        )
      })}
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

const RATING_DIMS = [
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'presentation', label: 'Presentation' },
  { key: 'attitude', label: 'Attitude' },
  { key: 'quality', label: 'Quality of work' },
] as const

export default function PerformancePage() {
  const employees = MOCK_EMPLOYEES
  const [reviews, setReviews] = useState<PerformanceReview[]>(MOCK_REVIEWS)
  const [selectedEmp, setSelectedEmp] = useState<string>('all')
  const [showAddReview, setShowAddReview] = useState(false)

  // New review form
  const [newEmpId, setNewEmpId] = useState('')
  const [newShiftDate, setNewShiftDate] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newRatings, setNewRatings] = useState({ punctuality: 5, presentation: 5, attitude: 5, quality: 5 })

  function empById(id: string) { return employees.find(e => e.id === id) }

  // Per-employee averages
  const empStats = employees.filter(e => e.status !== 'terminated').map(emp => {
    const empReviews = reviews.filter(r => r.employee_id === emp.id)
    if (!empReviews.length) return { emp, avg: null, count: 0 }
    const avg = empReviews.reduce((s, r) => s + r.overall, 0) / empReviews.length
    return { emp, avg: Math.round(avg * 10) / 10, count: empReviews.length }
  }).sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0))

  const filtered = (selectedEmp === 'all' ? reviews : reviews.filter(r => r.employee_id === selectedEmp))
    .sort((a, b) => b.date.localeCompare(a.date))

  function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmpId || !newShiftDate) return
    const overall = Object.values(newRatings).reduce((s, v) => s + v, 0) / 4
    const review: PerformanceReview = {
      id: `pr-${Date.now()}`,
      employee_id: newEmpId,
      date: new Date().toISOString().split('T')[0],
      shift_date: newShiftDate,
      ratings: { ...newRatings },
      overall: Math.round(overall * 100) / 100,
      notes: newNotes,
      reviewer: 'You',
    }
    setReviews(prev => [review, ...prev])
    setShowAddReview(false)
    setNewEmpId(''); setNewShiftDate(''); setNewNotes('')
    setNewRatings({ punctuality: 5, presentation: 5, attitude: 5, quality: 5 })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
          <p className="text-sm text-gray-500 mt-0.5">{reviews.length} reviews across {employees.filter(e => e.status !== 'terminated').length} staff</p>
        </div>
        <button onClick={() => setShowAddReview(true)}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Add Review
        </button>
      </div>

      {/* Leaderboard */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Staff Rankings</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {empStats.map(({ emp, avg, count }, i) => (
            <button key={emp.id} onClick={() => setSelectedEmp(emp.id === selectedEmp ? 'all' : emp.id)}
              className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 text-left hover:border-gray-300 transition ${
                selectedEmp === emp.id ? 'border-gray-900 shadow-sm' : 'border-gray-200'
              }`}>
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-sm font-bold`}>
                  {emp.avatar_initials}
                </div>
                {i < 3 && avg !== null && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : '#b45309' }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{emp.name}</p>
                {avg !== null ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Stars value={avg} />
                    <span className="text-xs text-gray-500">{avg} ({count})</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No reviews yet</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      {selectedEmp !== 'all' && (
        <button onClick={() => setSelectedEmp('all')}
          className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Clear filter — showing {empById(selectedEmp)?.name}
        </button>
      )}

      {/* Review cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">No reviews yet</p>
          </div>
        )}
        {filtered.map(review => {
          const emp = empById(review.employee_id)
          if (!emp) return null
          return (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {emp.avatar_initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-400">Shift: {formatDate(review.shift_date)} · Reviewed by {review.reviewer}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Stars value={review.overall} size="lg" />
                      <span className="text-sm font-bold text-gray-900">{review.overall}</span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {RATING_DIMS.map(dim => (
                      <div key={dim.key} className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{dim.label}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Stars value={review.ratings[dim.key]} />
                          <span className="text-xs font-semibold text-gray-700">{review.ratings[dim.key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {review.notes && (
                    <p className="text-xs text-gray-600 mt-3 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">&ldquo;{review.notes}&rdquo;</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add review modal */}
      {showAddReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddReview(false)}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-900">Add Performance Review</h2>
              <button onClick={() => setShowAddReview(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={submitReview} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Employee *</label>
                <select value={newEmpId} onChange={e => setNewEmpId(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option value="">Select employee</option>
                  {employees.filter(e => e.status !== 'terminated').map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Shift date *</label>
                <input type="date" value={newShiftDate} onChange={e => setNewShiftDate(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-700">Ratings (1–5)</p>
                {RATING_DIMS.map(dim => (
                  <div key={dim.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-gray-600">{dim.label}</label>
                      <Stars value={newRatings[dim.key]} size="lg" />
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} type="button"
                          onClick={() => setNewRatings(r => ({ ...r, [dim.key]: v }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${
                            newRatings[dim.key] === v
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'border-gray-200 text-gray-500 hover:border-gray-400'
                          }`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
                <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} rows={3}
                  placeholder="What stood out this shift?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"/>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-600 font-medium">Overall score</p>
                <div className="flex items-center gap-2">
                  <Stars value={Object.values(newRatings).reduce((s, v) => s + v, 0) / 4} size="lg" />
                  <span className="text-sm font-bold text-gray-900">
                    {(Object.values(newRatings).reduce((s, v) => s + v, 0) / 4).toFixed(2)}
                  </span>
                </div>
              </div>
              <button type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                Save review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
