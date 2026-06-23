'use client'

import { useState, useTransition } from 'react'
import { ROLE_LABELS, ROLE_CATEGORIES, type RoleCategory } from '@/lib/types'
import { TALENT_POOLS, type TalentPool } from '@/lib/mock-recruitment'

interface Candidate {
  id: string
  name: string
  role_category: string | null
  location: string | null
  experience_summary: string | null
  availability: string | null
  certifications: string | null
  score: number
}

const TAGS = [
  { key: 'top', label: '⭐ Top pick', bg: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
  { key: 'consider', label: '🔄 Consider later', bg: 'bg-blue-50 border-blue-200 text-blue-700' },
  { key: 'no', label: '❌ Not a fit', bg: 'bg-red-50 border-red-200 text-red-600' },
]

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    score >= 5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-red-50 text-red-600 border-red-200'
  return (
    <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border shrink-0 ${color}`}>
      <span className="text-xl font-bold leading-none">{score}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wide mt-0.5 opacity-70">/ 10</span>
    </div>
  )
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}
const AVATAR_COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-teal-500', 'bg-orange-500', 'bg-gray-700']
function avatarColor(name: string) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] }

function CandidateCard({
  candidate, selected, onToggleSelect, cardNote, cardTags,
  onNoteChange, onTagToggle, pools, onAddToPool,
}: {
  candidate: Candidate
  selected: boolean
  onToggleSelect: () => void
  cardNote: string
  cardTags: string[]
  onNoteChange: (v: string) => void
  onTagToggle: (t: string) => void
  pools: TalentPool[]
  onAddToPool: (poolId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [poolOpen, setPoolOpen] = useState(false)

  const certs = candidate.certifications
    ? candidate.certifications.split(',').map(c => c.trim()).filter(Boolean)
    : []

  return (
    <div className={`bg-white border rounded-xl p-4 transition ${selected ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex items-start pt-0.5">
          <input type="checkbox" checked={selected} onChange={onToggleSelect}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 cursor-pointer" />
        </div>

        <ScoreBadge score={candidate.score} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full ${avatarColor(candidate.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {initials(candidate.name)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{candidate.name}</p>
                <p className="text-xs text-gray-500">
                  {candidate.role_category ? ROLE_LABELS[candidate.role_category as RoleCategory] ?? candidate.role_category : 'No role set'}
                  {candidate.location ? ` · ${candidate.location}` : ''}
                </p>
              </div>
            </div>
            {candidate.availability && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                candidate.availability.toLowerCase().includes('immediately') || candidate.availability.toLowerCase().includes('1 week')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>
                {candidate.availability}
              </span>
            )}
          </div>

          {candidate.experience_summary && (
            <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">{candidate.experience_summary}</p>
          )}

          {certs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {certs.slice(0, 3).map(cert => (
                <span key={cert} className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{cert}</span>
              ))}
              {certs.length > 3 && <span className="text-[11px] text-gray-400">+{certs.length - 3} more</span>}
            </div>
          )}

          {/* Tags display */}
          {cardTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {cardTags.map(t => {
                const tag = TAGS.find(tg => tg.key === t)
                return tag ? <span key={t} className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${tag.bg}`}>{tag.label}</span> : null
              })}
            </div>
          )}

          {/* Note preview */}
          {cardNote && !expanded && (
            <p className="text-[11px] text-gray-500 mt-1.5 italic line-clamp-1">"{cardNote}"</p>
          )}

          {/* Expanded notes/tags/pool */}
          {expanded && (
            <div className="mt-3 space-y-2.5 border-t border-gray-100 pt-3">
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Private note</p>
                <textarea value={cardNote} onChange={e => onNoteChange(e.target.value)}
                  placeholder="Add a private note about this candidate…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400 resize-none" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS.map(tag => (
                    <button key={tag.key} type="button" onClick={() => onTagToggle(tag.key)}
                      className={`text-[11px] font-medium px-2 py-1 rounded-lg border transition ${
                        cardTags.includes(tag.key) ? tag.bg : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Add to talent pool</p>
                <div className="flex flex-wrap gap-1.5">
                  {pools.map(pool => (
                    <button key={pool.id} type="button" onClick={() => onAddToPool(pool.id)}
                      className={`text-[11px] font-medium px-2 py-1 rounded-lg border transition ${pool.color} border-current/20 hover:opacity-80`}>
                      + {pool.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Card action row */}
          <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-gray-100">
            <button onClick={() => setExpanded(!expanded)}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1 transition">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {expanded ? 'Close' : 'Notes & tags'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CandidatesClient() {
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [candidates, setCandidates] = useState<Candidate[] | null>(null)
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Selection for bulk outreach
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [outreachOpen, setOutreachOpen] = useState(false)
  const [outreachMsg, setOutreachMsg] = useState('')
  const [outreachSent, setOutreachSent] = useState(false)

  // Per-card notes & tags
  const [cardNotes, setCardNotes] = useState<Record<string, string>>({})
  const [cardTags, setCardTags] = useState<Record<string, string[]>>({})

  // Talent pools
  const [pools, setPools] = useState(TALENT_POOLS)

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function sendOutreach() {
    setOutreachSent(true)
    setTimeout(() => { setOutreachOpen(false); setOutreachSent(false); setSelected(new Set()); setOutreachMsg('') }, 1800)
  }

  function addToPool(candidateId: string, poolId: string) {
    setPools(prev => prev.map(p => p.id === poolId ? {
      ...p, candidate_ids: p.candidate_ids.includes(candidateId) ? p.candidate_ids : [...p.candidate_ids, candidateId]
    } : p))
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSelected(new Set())
    startTransition(async () => {
      const params = new URLSearchParams()
      if (role) params.set('role', role)
      if (location) params.set('location', location.trim())
      const res = await fetch(`/api/employer/candidates?${params}`)
      const json = await res.json()
      setCandidates(json.candidates ?? [])
      setSearched(true)
    })
  }

  const input = 'w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400'
  const selectedCandidates = candidates?.filter(c => selected.has(c.id)) ?? []

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
        <p className="text-sm text-gray-500 mt-0.5">Search workers by role and location. Each candidate is scored 1–10 on how well they match.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className={input + ' bg-white'}>
              <option value="">Any role</option>
              {ROLE_CATEGORIES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Cape Town" className={input} />
          </div>
        </div>
        <button type="submit" disabled={isPending}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
          {isPending ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Searching...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>Search Candidates</>
          )}
        </button>
      </form>

      {/* Scoring legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span className="font-semibold text-gray-700">Match score:</span>
        {[['bg-emerald-500','8–10 Strong'],['bg-amber-400','5–7 Partial'],['bg-red-400','1–4 Weak']].map(([color, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${color} inline-block`} />
            {label}
          </span>
        ))}
      </div>

      {!searched && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">How matching works</p>
          <div className="space-y-2">
            {[
              { label: 'Role match', pts: '5 pts', desc: "Candidate's role matches your search" },
              { label: 'Location match', pts: '3 pts', desc: 'Candidate is based in or near your location' },
              { label: 'Availability', pts: '1 pt', desc: 'Available immediately or within 1 week' },
              { label: 'Experience on profile', pts: '1 pt', desc: 'Has filled in experience or certifications' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-[11px] font-bold bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded shrink-0">{item.pts}</span>
                <div>
                  <span className="text-xs font-semibold text-gray-800">{item.label}</span>
                  <span className="text-xs text-gray-500"> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searched && candidates && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-semibold text-gray-700">
              {candidates.length === 0 ? 'No candidates found' : `${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <button onClick={() => setOutreachOpen(true)}
                  className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Message {selected.size}
                </button>
              )}
              {candidates.length > 0 && (
                <p className="text-xs text-gray-400">Sorted by match score</p>
              )}
            </div>
          </div>

          {candidates.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 font-medium">
              <input type="checkbox"
                checked={selected.size === candidates.length && candidates.length > 0}
                onChange={e => setSelected(e.target.checked ? new Set(candidates.map(c => c.id)) : new Set())}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500" />
              Select all
            </label>
          )}

          {candidates.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-500">No candidates match your search</p>
              <p className="text-xs text-gray-400 mt-1">Try broadening your location or selecting a different role</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {candidates.map(c => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  selected={selected.has(c.id)}
                  onToggleSelect={() => toggleSelect(c.id)}
                  cardNote={cardNotes[c.id] ?? ''}
                  cardTags={cardTags[c.id] ?? []}
                  onNoteChange={v => setCardNotes(prev => ({ ...prev, [c.id]: v }))}
                  onTagToggle={t => setCardTags(prev => {
                    const cur = prev[c.id] ?? []
                    return { ...prev, [c.id]: cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t] }
                  })}
                  pools={pools}
                  onAddToPool={poolId => addToPool(c.id, poolId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bulk outreach modal */}
      {outreachOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => !outreachSent && setOutreachOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            {outreachSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Messages sent!</p>
                <p className="text-sm text-gray-500 mt-1">Your message was sent to {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''}.</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Message candidates</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Sending to {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Recipient chips */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidates.map(c => (
                    <span key={c.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                      {c.name}
                      <button onClick={() => toggleSelect(c.id)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea value={outreachMsg} onChange={e => setOutreachMsg(e.target.value)}
                    rows={5}
                    placeholder="Hi [Name], I came across your profile on Waiterstation and think you'd be a great fit for our current opening…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400 resize-none" />
                  <p className="text-[11px] text-gray-400 mt-1">[Name] will be replaced with each candidate's first name</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={sendOutreach} disabled={!outreachMsg.trim()}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                    Send to {selectedCandidates.length}
                  </button>
                  <button onClick={() => setOutreachOpen(false)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
