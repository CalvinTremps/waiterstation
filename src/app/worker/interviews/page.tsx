'use client'

import { useState } from 'react'
import { MOCK_WORKER_INTERVIEWS, WorkerInterview } from '@/lib/mock-worker'

const OUTCOME_STYLES: Record<string, string> = {
  upcoming: 'bg-purple-50 text-purple-700',
  went_well: 'bg-emerald-50 text-emerald-700',
  waiting: 'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-600',
  offered: 'bg-emerald-100 text-emerald-800',
  no_show: 'bg-gray-100 text-gray-500',
}

const OUTCOME_LABELS: Record<string, string> = {
  upcoming: 'Upcoming',
  went_well: 'Went well',
  waiting: 'Waiting to hear',
  rejected: 'Not progressing',
  offered: 'Offer received',
  no_show: 'No show',
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  'in-person': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  video: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function InterviewCard({ iv: initial }: { iv: WorkerInterview }) {
  const [iv, setIv] = useState(initial)
  const [prepNotes, setPrepNotes] = useState(initial.prep_notes)
  const [questions, setQuestions] = useState(initial.questions_to_ask)
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(initial.outcome === 'upcoming')

  const d = new Date(iv.date + 'T00:00:00')
  const isUpcoming = iv.outcome === 'upcoming'

  function saveNotes() {
    setIv(prev => ({ ...prev, prep_notes: prepNotes, questions_to_ask: questions }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function setOutcome(outcome: string) {
    setIv(prev => ({ ...prev, outcome: outcome as WorkerInterview['outcome'] }))
  }

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition ${
      isUpcoming ? 'border-purple-200 ring-1 ring-purple-100' : 'border-gray-200'
    }`}>
      {/* Header */}
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left">
        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${
          isUpcoming ? 'bg-purple-600' : 'bg-gray-100'
        }`}>
          <span className={`text-[10px] font-bold uppercase leading-none ${isUpcoming ? 'text-purple-200' : 'text-gray-400'}`}>
            {d.toLocaleDateString('en-ZA', { month: 'short' })}
          </span>
          <span className={`text-lg font-bold leading-tight ${isUpcoming ? 'text-white' : 'text-gray-600'}`}>
            {d.getDate()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{iv.job_title}</p>
          <p className="text-sm text-gray-500">{iv.employer_name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-gray-${isUpcoming ? '500' : '400'} flex items-center gap-1 text-xs`}>
              {TYPE_ICON[iv.type]}
              <span className="capitalize">{iv.type}</span>
            </span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-500">{iv.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${OUTCOME_STYLES[iv.outcome]}`}>
            {OUTCOME_LABELS[iv.outcome]}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
          {iv.location && (
            <div className="flex items-start gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <p className="text-gray-600">{iv.location}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Prep notes</label>
            <textarea value={prepNotes} onChange={e => { setPrepNotes(e.target.value); setSaved(false) }}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none placeholder:text-gray-400"
              placeholder="What should you prepare for this interview?" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Questions to ask them</label>
            <textarea value={questions} onChange={e => { setQuestions(e.target.value); setSaved(false) }}
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none placeholder:text-gray-400"
              placeholder="What do you want to ask the employer?" />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={saveNotes}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
              Save notes
            </button>
            {saved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
          </div>

          {!isUpcoming && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">How did it go?</p>
              <div className="flex flex-wrap gap-2">
                {(['went_well', 'waiting', 'rejected', 'offered', 'no_show'] as const).map(o => (
                  <button key={o} onClick={() => setOutcome(o)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      iv.outcome === o
                        ? 'border-transparent ' + OUTCOME_STYLES[o]
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {OUTCOME_LABELS[o]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function InterviewsPage() {
  const upcoming = MOCK_WORKER_INTERVIEWS.filter(i => i.outcome === 'upcoming')
  const past = MOCK_WORKER_INTERVIEWS.filter(i => i.outcome !== 'upcoming')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interview Tracker</h1>
        <p className="text-sm text-gray-500 mt-0.5">Prepare for interviews and track outcomes</p>
      </div>

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Upcoming</h2>
          {upcoming.map(iv => <InterviewCard key={iv.id} iv={iv} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Past interviews</h2>
          {past.map(iv => <InterviewCard key={iv.id} iv={iv} />)}
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No interviews yet</p>
          <p className="text-sm mt-1">They will appear here once an employer books you in</p>
        </div>
      )}
    </div>
  )
}
