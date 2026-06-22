'use client'

import { useState } from 'react'
import { MOCK_INTERVIEWS, Interview } from '@/lib/mock-recruitment'

const TYPE_ICONS: Record<string, string> = {
  'in-person': '🤝',
  phone: '📞',
  video: '💻',
}

const OUTCOME_STYLES: Record<string, string> = {
  pending: 'bg-blue-50 text-blue-700',
  offered: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-50 text-red-600',
  'no-show': 'bg-gray-100 text-gray-500',
}

const OUTCOME_LABELS: Record<string, string> = {
  pending: 'Upcoming',
  offered: 'Offer extended',
  rejected: 'Not selected',
  'no-show': 'No-show',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(MOCK_INTERVIEWS)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const now = new Date().toISOString().split('T')[0]

  const filtered = interviews.filter(i => {
    if (filter === 'upcoming') return i.date >= now && i.outcome === 'pending'
    if (filter === 'past') return i.date < now || i.outcome !== 'pending'
    return true
  }).sort((a, b) => a.date.localeCompare(b.date))

  const upcoming = interviews.filter(i => i.date >= now && i.outcome === 'pending')
  const past = interviews.filter(i => i.date < now || i.outcome !== 'pending')

  function setOutcome(id: string, outcome: Interview['outcome']) {
    setInterviews(prev => prev.map(i => i.id === id ? { ...i, outcome } : i))
    setUpdatingId(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">{upcoming.length} upcoming · {past.length} completed</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Upcoming', value: upcoming.length, color: 'text-blue-600' },
          { label: 'Offers extended', value: interviews.filter(i => i.outcome === 'offered').length, color: 'text-gray-900' },
          { label: 'Not selected', value: interviews.filter(i => i.outcome === 'rejected').length, color: 'text-red-500' },
          { label: 'No-shows', value: interviews.filter(i => i.outcome === 'no-show').length, color: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all','upcoming','past'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition capitalize ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">No interviews in this view</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(i => {
            const isPast = i.date < now || i.outcome !== 'pending'
            return (
              <div key={i.id} className={`bg-white border rounded-xl p-5 transition ${
                i.outcome === 'offered' ? 'border-gray-200' :
                i.outcome === 'rejected' ? 'border-red-100' :
                'border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  {/* Date badge */}
                  <div className={`rounded-xl px-3 py-2 text-center shrink-0 min-w-[52px] ${
                    isPast ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-lg font-bold leading-none">{new Date(i.date).getDate()}</p>
                    <p className="text-[11px] leading-none mt-1">{new Date(i.date).toLocaleDateString('en-ZA', { month: 'short' })}</p>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <a href={`/employer/applicants/${i.applicant_id}`}
                          className="font-semibold text-gray-900 hover:text-gray-800 transition">
                          {i.applicant_name}
                        </a>
                        <p className="text-sm text-gray-500 mt-0.5">{i.job_title}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${OUTCOME_STYLES[i.outcome]}`}>
                        {OUTCOME_LABELS[i.outcome]}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <span>{TYPE_ICONS[i.type]}</span>
                        <span className="capitalize">{i.type.replace('-', ' ')}</span>
                      </span>
                      <span className="text-sm text-gray-500">{i.time}</span>
                      {i.location && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <circle cx="12" cy="11" r="3"/>
                          </svg>
                          {i.location}
                        </span>
                      )}
                    </div>

                    {i.notes && (
                      <p className="text-xs text-gray-400 italic mt-2 border-l-2 border-gray-200 pl-2">{i.notes}</p>
                    )}
                  </div>
                </div>

                {/* Outcome actions */}
                {i.outcome === 'pending' && (
                  <div className="mt-4">
                    {updatingId === i.id ? (
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-500 self-center mr-2">Mark outcome:</span>
                        <button onClick={() => setOutcome(i.id, 'offered')}
                          className="text-xs font-semibold px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                          Offer extended
                        </button>
                        <button onClick={() => setOutcome(i.id, 'rejected')}
                          className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition">
                          Not selected
                        </button>
                        <button onClick={() => setOutcome(i.id, 'no-show')}
                          className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                          No-show
                        </button>
                        <button onClick={() => setUpdatingId(null)}
                          className="text-xs text-gray-400 px-2 py-1.5 hover:text-gray-600">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${i.applicant_name.toLowerCase().replace(' ', '.')}@gmail.com`}
                          className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                          Send reminder
                        </a>
                        <button onClick={() => setUpdatingId(i.id)}
                          className="text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition">
                          Record outcome
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
