'use client'

import { useState, useMemo } from 'react'
import { RoleCategory, ROLE_LABELS } from '@/lib/types'
import {
  MOCK_SALARIES,
  SALARY_CITIES,
  SALARY_ROLES,
  SalarySubmission,
  aggregateSalaries,
  formatRand,
} from '@/lib/mock-salaries'

/* ─── Submit-your-salary modal ───────────────────────────── */
function SubmitSalaryModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (s: SalarySubmission) => void }) {
  const [role, setRole] = useState<RoleCategory>('waiter')
  const [city, setCity] = useState<string>(SALARY_CITIES[0])
  const [base, setBase] = useState('')
  const [tips, setTips] = useState('')
  const [exp, setExp] = useState('')
  const [venue, setVenue] = useState('')

  const valid = base.trim() !== '' && Number(base) > 0

  function handleSubmit() {
    if (!valid) return
    onSubmit({
      id: `local-${Date.now()}`,
      role,
      city,
      base_monthly: Math.round(Number(base)) || 0,
      tips_monthly: Math.round(Number(tips)) || 0,
      experience_years: Math.round(Number(exp)) || 0,
      venue_type: venue.trim() || 'Not specified',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-base">Add your salary</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-5">100% anonymous. Helps fellow workers know their worth.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Role</label>
            <div className="flex flex-wrap gap-2">
              {SALARY_ROLES.map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${role === r ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">City</label>
            <div className="flex flex-wrap gap-2">
              {SALARY_CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${city === c ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Base / month (R)</label>
              <input type="number" inputMode="numeric" value={base} onChange={e => setBase(e.target.value)} placeholder="4500"
                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Tips / month (R)</label>
              <input type="number" inputMode="numeric" value={tips} onChange={e => setTips(e.target.value)} placeholder="9000"
                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Experience (yrs)</label>
              <input type="number" inputMode="numeric" value={exp} onChange={e => setExp(e.target.value)} placeholder="3"
                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Venue type</label>
              <input type="text" value={venue} onChange={e => setVenue(e.target.value)} placeholder="Fine dining"
                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={!valid}
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed">
            Submit anonymously
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Stat card ──────────────────────────────────────────── */
function StatCard({ stat }: { stat: ReturnType<typeof aggregateSalaries>[number] }) {
  const hasTips = stat.tipsMedian > 0
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-bold text-gray-900">{stat.roleLabel}</p>
          <p className="text-xs text-gray-500 mt-0.5">{stat.city} · {stat.count} report{stat.count !== 1 ? 's' : ''} · avg {stat.avgExperience} yrs exp</p>
        </div>
        <a href={`/jobs?role=${stat.role}&location=${encodeURIComponent(stat.city)}`}
          className="shrink-0 text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap">
          See jobs →
        </a>
      </div>

      <div className="flex items-end gap-1 mb-3">
        <p className="text-2xl font-bold text-gray-900">{formatRand(stat.totalMedian)}</p>
        <p className="text-xs text-gray-400 mb-1">/ month median total</p>
      </div>

      {/* Base vs tips split */}
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Base pay</span>
            <span className="font-semibold text-gray-800">{formatRand(stat.baseMedian)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gray-800 rounded-full" style={{ width: `${Math.round((stat.baseMedian / stat.totalMedian) * 100)}%` }} />
          </div>
        </div>
        {hasTips && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Tips</span>
              <span className="font-semibold text-emerald-700">{formatRand(stat.tipsMedian)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((stat.tipsMedian / stat.totalMedian) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 mt-3">
        Range {formatRand(stat.totalLow)} – {formatRand(stat.totalHigh)}
      </p>
    </div>
  )
}

/* ─── Main explorer ──────────────────────────────────────── */
export default function SalaryExplorer() {
  const [submissions, setSubmissions] = useState<SalarySubmission[]>(MOCK_SALARIES)
  const [roleFilter, setRoleFilter] = useState<RoleCategory | null>(null)
  const [cityFilter, setCityFilter] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const stats = useMemo(() => {
    let subs = submissions
    if (roleFilter) subs = subs.filter(s => s.role === roleFilter)
    if (cityFilter) subs = subs.filter(s => s.city === cityFilter)
    return aggregateSalaries(subs)
  }, [submissions, roleFilter, cityFilter])

  return (
    <div className="max-w-3xl mx-auto">
      {showModal && (
        <SubmitSalaryModal
          onClose={() => setShowModal(false)}
          onSubmit={s => setSubmissions(prev => [s, ...prev])}
        />
      )}

      {/* Intro + CTA */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-900">Salary & Tips Explorer</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Real monthly pay reported by hospitality workers across South Africa — base plus tips.
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="shrink-0 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-gray-800 transition whitespace-nowrap">
          + Add yours
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2.5 mb-4">
        <div className="flex gap-2 overflow-x-auto scroll-no-bar pb-0.5">
          <button onClick={() => setRoleFilter(null)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${roleFilter === null ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>
            All roles
          </button>
          {SALARY_ROLES.map(r => (
            <button key={r} onClick={() => setRoleFilter(roleFilter === r ? null : r)}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${roleFilter === r ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto scroll-no-bar pb-0.5">
          <button onClick={() => setCityFilter(null)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${cityFilter === null ? 'bg-gray-100 text-gray-900 border-gray-300 font-semibold' : 'bg-white text-gray-600 border-gray-200'}`}>
            All cities
          </button>
          {SALARY_CITIES.map(c => (
            <button key={c} onClick={() => setCityFilter(cityFilter === c ? null : c)}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${cityFilter === c ? 'bg-gray-100 text-gray-900 border-gray-300 font-semibold' : 'bg-white text-gray-600 border-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {stats.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16 px-5">
          <p className="font-medium text-gray-600">No reports for this combination yet</p>
          <button onClick={() => setShowModal(true)} className="mt-3 text-sm text-gray-900 hover:underline font-medium">Be the first to add one</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {stats.map(s => <StatCard key={`${s.role}-${s.city}`} stat={s} />)}
        </div>
      )}

      <p className="text-[11px] text-gray-400 mt-5 text-center leading-relaxed">
        Figures are self-reported and for guidance only. Tips vary widely by season and venue.
      </p>
    </div>
  )
}
