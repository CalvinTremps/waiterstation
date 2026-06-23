'use client'

import { useState } from 'react'
import { WORK_HISTORY, WorkHistoryEntry } from '@/lib/mock-worker'

const STATUS_STYLES = {
  verified: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  unverified: 'bg-gray-100 text-gray-500 border-gray-200',
}

const STATUS_LABELS = {
  verified: '✓ Verified',
  pending: '⏳ Pending',
  unverified: 'Unverified',
}

function fmtPeriod(from: string, to: string | null, current: boolean) {
  const fmt = (ym: string) => {
    const [y, m] = ym.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[parseInt(m) - 1]} ${y}`
  }
  const start = fmt(from)
  const end = current ? 'Present' : fmt(to!)
  const fromDate = new Date(from + '-01')
  const toDate = current ? new Date() : new Date(to! + '-01')
  const months = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth())
  const years = Math.floor(months / 12)
  const rem = months % 12
  const duration = years > 0 ? `${years}y${rem > 0 ? ` ${rem}m` : ''}` : `${rem}m`
  return `${start} – ${end} · ${duration}`
}

function HistoryCard({ entry }: { entry: WorkHistoryEntry }) {
  const [showRequest, setShowRequest] = useState(false)
  const [requested, setRequested] = useState(false)

  function requestVerification() {
    setRequested(true)
    setShowRequest(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900">{entry.role}</p>
                {entry.current && (
                  <span className="text-[10px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded-full">Current</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{entry.company}</p>
              <p className="text-xs text-gray-400 mt-0.5">{entry.location}</p>
            </div>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLES[entry.verification_status]}`}>
            {STATUS_LABELS[entry.verification_status]}
          </span>
        </div>

        {/* Period */}
        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {fmtPeriod(entry.from, entry.to, entry.current)}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{entry.description}</p>

        {/* Verified by */}
        {entry.verification_status === 'verified' && entry.verified_by && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <div>
              <p className="text-xs font-semibold text-green-800">Verified by {entry.verified_by}</p>
              <p className="text-[10px] text-green-600">{new Date(entry.verified_date!).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}

        {/* Pending notice */}
        {entry.verification_status === 'pending' && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-xs text-amber-700">Verification request sent — waiting for employer to confirm</p>
          </div>
        )}

        {/* Unverified — request button */}
        {entry.verification_status === 'unverified' && !requested && (
          <div className="mt-3">
            {showRequest ? (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <p className="text-xs text-gray-600">Enter the email of someone at <strong>{entry.company}</strong> who can confirm your employment.</p>
                <input placeholder="manager@company.co.za" type="email"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white" />
                <div className="flex gap-2">
                  <button onClick={requestVerification}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2 rounded-lg transition">
                    Send verification request
                  </button>
                  <button onClick={() => setShowRequest(false)}
                    className="px-3 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowRequest(true)}
                className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition">
                Request verification →
              </button>
            )}
          </div>
        )}

        {requested && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-xs text-amber-700">Verification request sent — waiting for employer to confirm</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WorkHistoryPage() {
  const verified = WORK_HISTORY.filter(e => e.verification_status === 'verified').length
  const total = WORK_HISTORY.length

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Work History</h1>
        <p className="text-sm text-gray-500 mt-0.5">Verified employment history builds trust with employers and increases match scores</p>
      </div>

      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-gray-900">Verification progress</p>
          <span className="text-sm font-bold text-gray-900">{verified}/{total} verified</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(verified / total) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Profiles with fully verified history receive 40% more employer views</p>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {WORK_HISTORY.map(entry => <HistoryCard key={entry.id} entry={entry} />)}
      </div>

      {/* Add entry prompt */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm font-semibold text-gray-600 mb-1">Missing a role?</p>
        <p className="text-xs text-gray-400 mb-3">Add it to your work history and request verification from a past employer</p>
        <button className="text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
          + Add work experience
        </button>
      </div>
    </div>
  )
}
