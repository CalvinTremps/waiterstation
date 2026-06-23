'use client'

import { useState, useRef } from 'react'
import { MOCK_APPLICANTS, PIPELINE_STAGES, MOCK_TRIAL_SHIFTS, type Applicant, type PipelineStage, type TrialShift } from '@/lib/mock-recruitment'

const TAGS = [
  { key: 'top', label: 'Top pick', bg: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
  { key: 'consider', label: 'Consider later', bg: 'bg-blue-50 border-blue-200 text-blue-700' },
  { key: 'trial', label: 'Trial scheduled', bg: 'bg-green-50 border-green-200 text-green-700' },
  { key: 'no', label: 'Not a fit', bg: 'bg-red-50 border-red-200 text-red-600' },
]

const STAGE_COLS: PipelineStage[] = ['new', 'reviewed', 'shortlisted', 'interview', 'offered', 'hired']

const STAGE_STYLES: Record<PipelineStage, { header: string; dot: string }> = {
  new:         { header: 'bg-gray-100',   dot: 'bg-gray-400' },
  reviewed:    { header: 'bg-blue-50',    dot: 'bg-blue-500' },
  shortlisted: { header: 'bg-amber-50',   dot: 'bg-amber-500' },
  interview:   { header: 'bg-purple-50',  dot: 'bg-purple-500' },
  offered:     { header: 'bg-gray-200',   dot: 'bg-gray-600' },
  hired:       { header: 'bg-gray-900',   dot: 'bg-green-400' },
  rejected:    { header: 'bg-red-50',     dot: 'bg-red-400' },
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

function StarRating({ n }: { n: number | null }) {
  if (!n) return null
  return (
    <div className="flex gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= n ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

interface CardState {
  note: string
  tags: string[]
  noteOpen: boolean
  trialOpen: boolean
}

interface TrialForm {
  date: string
  time: string
  location: string
  notes: string
}

export default function PipelinePage() {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS)
  const [cardState, setCardState] = useState<Record<string, CardState>>({})
  const [trialShifts, setTrialShifts] = useState<TrialShift[]>(MOCK_TRIAL_SHIFTS)
  const [trialForm, setTrialForm] = useState<TrialForm>({ date: '', time: '09:00', location: '', notes: '' })
  const [activeTrialCard, setActiveTrialCard] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<PipelineStage | null>(null)
  const [jobFilter, setJobFilter] = useState('all')

  const jobs = Array.from(new Map(applicants.map(a => [a.job_id, a.job_title])).entries())

  function getState(id: string): CardState {
    return cardState[id] ?? { note: '', tags: [], noteOpen: false, trialOpen: false }
  }

  function updateState(id: string, patch: Partial<CardState>) {
    setCardState(prev => ({ ...prev, [id]: { ...getState(id), ...patch } }))
  }

  function moveApplicant(id: string, stage: PipelineStage) {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, stage } : a))
  }

  function toggleTag(id: string, tag: string) {
    const cur = getState(id).tags
    updateState(id, { tags: cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag] })
  }

  function saveTrialShift(applicantId: string) {
    if (!trialForm.date || !trialForm.location) return
    const a = applicants.find(a => a.id === applicantId)
    if (!a) return
    const ts: TrialShift = {
      id: `ts-${Date.now()}`,
      applicant_id: applicantId,
      applicant_name: a.name,
      job_title: a.job_title,
      date: trialForm.date,
      time: trialForm.time,
      location: trialForm.location,
      notes: trialForm.notes,
      status: 'scheduled',
    }
    setTrialShifts(prev => [...prev, ts])
    toggleTag(applicantId, 'trial')
    setActiveTrialCard(null)
    setTrialForm({ date: '', time: '09:00', location: '', notes: '' })
    moveApplicant(applicantId, 'interview')
  }

  function onDragStart(id: string) { setDragId(id) }
  function onDragOver(e: React.DragEvent, col: PipelineStage) { e.preventDefault(); setDragOverCol(col) }
  function onDrop(col: PipelineStage) {
    if (dragId) moveApplicant(dragId, col)
    setDragId(null); setDragOverCol(null)
  }

  const filtered = applicants.filter(a => jobFilter === 'all' || a.job_id === jobFilter)

  const input = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag cards between stages or use the stage buttons</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={jobFilter} onChange={e => setJobFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white">
            <option value="all">All listings</option>
            {jobs.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
          </select>
          <span className="text-xs text-gray-400">{filtered.length} candidates</span>
        </div>
      </div>

      {/* Kanban board — horizontal scroll */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-3 min-w-max">
          {STAGE_COLS.map(stage => {
            const stageInfo = PIPELINE_STAGES.find(s => s.key === stage)!
            const cards = filtered.filter(a => a.stage === stage)
            const style = STAGE_STYLES[stage]
            const isOver = dragOverCol === stage

            return (
              <div key={stage}
                className={`w-64 shrink-0 rounded-xl transition ${isOver ? 'ring-2 ring-gray-400' : ''}`}
                onDragOver={e => onDragOver(e, stage)}
                onDrop={() => onDrop(stage)}
              >
                {/* Column header */}
                <div className={`${style.header} rounded-xl px-3 py-2.5 mb-2 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
                    <span className={`text-xs font-bold ${stage === 'hired' ? 'text-white' : 'text-gray-800'}`}>
                      {stageInfo.label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${stage === 'hired' ? 'text-white/70' : 'text-gray-400'}`}>
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[120px]">
                  {cards.map(a => {
                    const cs = getState(a.id)
                    const hasTrialShift = trialShifts.some(t => t.applicant_id === a.id && t.status === 'scheduled')

                    return (
                      <div key={a.id}
                        draggable
                        onDragStart={() => onDragStart(a.id)}
                        className="bg-white border border-gray-200 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-gray-300 transition select-none"
                      >
                        {/* Candidate header */}
                        <div className="flex items-start gap-2">
                          <div className={`w-8 h-8 rounded-full ${a.avatar_color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                            {initials(a.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{a.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{a.job_title}</p>
                            <StarRating n={a.rating} />
                          </div>
                        </div>

                        {/* Tags */}
                        {cs.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cs.tags.map(t => {
                              const tag = TAGS.find(tg => tg.key === t)
                              return tag ? (
                                <span key={t} className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${tag.bg}`}>
                                  {tag.label}
                                </span>
                              ) : null
                            })}
                          </div>
                        )}

                        {/* Trial shift badge */}
                        {hasTrialShift && (
                          <div className="mt-1.5 text-[10px] text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5 inline-flex items-center gap-1">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Trial shift booked
                          </div>
                        )}

                        {/* Note preview */}
                        {cs.note && (
                          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed line-clamp-2 italic">"{cs.note}"</p>
                        )}

                        {/* Note expand */}
                        {cs.noteOpen && (
                          <div className="mt-2 space-y-1.5">
                            <textarea
                              value={cs.note}
                              onChange={e => updateState(a.id, { note: e.target.value })}
                              placeholder="Add a private note…"
                              rows={2}
                              onClick={e => e.stopPropagation()}
                              className={input + ' resize-none'}
                            />
                            {/* Tag picker */}
                            <div className="flex flex-wrap gap-1">
                              {TAGS.map(tag => (
                                <button key={tag.key} type="button"
                                  onClick={e => { e.stopPropagation(); toggleTag(a.id, tag.key) }}
                                  className={`text-[10px] px-1.5 py-0.5 rounded border transition ${
                                    cs.tags.includes(tag.key) ? tag.bg : 'bg-gray-50 border-gray-200 text-gray-500'
                                  }`}>
                                  {tag.label}
                                </button>
                              ))}
                            </div>
                            <button onClick={() => updateState(a.id, { noteOpen: false })}
                              className="text-[10px] text-gray-400 hover:text-gray-600">Done</button>
                          </div>
                        )}

                        {/* Trial shift form */}
                        {activeTrialCard === a.id && (
                          <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-2" onClick={e => e.stopPropagation()}>
                            <p className="text-[10px] font-semibold text-gray-700">Schedule Trial Shift</p>
                            <input type="date" value={trialForm.date} onChange={e => setTrialForm(p => ({ ...p, date: e.target.value }))} className={input} />
                            <input type="time" value={trialForm.time} onChange={e => setTrialForm(p => ({ ...p, time: e.target.value }))} className={input} />
                            <input placeholder="Location" value={trialForm.location} onChange={e => setTrialForm(p => ({ ...p, location: e.target.value }))} className={input} />
                            <textarea placeholder="Notes (optional)" value={trialForm.notes} onChange={e => setTrialForm(p => ({ ...p, notes: e.target.value }))} rows={2} className={input + ' resize-none'} />
                            <div className="flex gap-2">
                              <button onClick={() => saveTrialShift(a.id)}
                                disabled={!trialForm.date || !trialForm.location}
                                className="text-[10px] font-semibold bg-gray-900 text-white px-2.5 py-1.5 rounded-lg disabled:opacity-40 transition">
                                Confirm
                              </button>
                              <button onClick={() => setActiveTrialCard(null)} className="text-[10px] text-gray-400">Cancel</button>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-gray-100">
                          {/* Move stage buttons */}
                          <div className="flex gap-1 flex-1">
                            {stage !== 'hired' && (
                              <button onClick={() => {
                                const idx = STAGE_COLS.indexOf(stage)
                                if (idx < STAGE_COLS.length - 1) moveApplicant(a.id, STAGE_COLS[idx + 1])
                              }}
                                className="flex-1 text-[10px] font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg transition">
                                → Move up
                              </button>
                            )}
                          </div>
                          <button onClick={() => updateState(a.id, { noteOpen: !cs.noteOpen })}
                            title="Notes & tags"
                            className="text-gray-400 hover:text-gray-600 transition p-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => setActiveTrialCard(activeTrialCard === a.id ? null : a.id)}
                            title="Schedule trial shift"
                            className="text-gray-400 hover:text-gray-600 transition p-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {cards.length === 0 && (
                    <div className={`border-2 border-dashed rounded-xl h-20 flex items-center justify-center transition ${
                      isOver ? 'border-gray-400 bg-gray-50' : 'border-gray-150'
                    }`}>
                      <p className="text-[11px] text-gray-300">Drop here</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trial shifts summary */}
      {trialShifts.filter(t => t.status === 'scheduled').length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Trial Shifts</h2>
          <div className="space-y-2">
            {trialShifts.filter(t => t.status === 'scheduled').map(ts => (
              <div key={ts.id} className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-lg px-2.5 py-1.5 text-center shrink-0">
                  <p className="text-xs font-bold text-gray-900">{new Date(ts.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</p>
                  <p className="text-[10px] text-gray-500">{ts.time}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{ts.applicant_name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{ts.job_title} · {ts.location}</p>
                  {ts.notes && <p className="text-[11px] text-gray-400 truncate">{ts.notes}</p>}
                </div>
                <button onClick={() => setTrialShifts(prev => prev.map(t => t.id === ts.id ? { ...t, status: 'completed' } : t))}
                  className="shrink-0 text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100 transition">
                  Mark done
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
