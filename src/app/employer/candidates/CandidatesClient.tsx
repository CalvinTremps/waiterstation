'use client'

import { useState, useTransition } from 'react'
import { ROLE_LABELS, ROLE_CATEGORIES, type RoleCategory } from '@/lib/types'

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

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500',
  'bg-cyan-500', 'bg-teal-500', 'bg-orange-500', 'bg-gray-700',
]

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const certs = candidate.certifications
    ? candidate.certifications.split(',').map(c => c.trim()).filter(Boolean)
    : []

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-gray-300 transition">
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
          <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">
            {candidate.experience_summary}
          </p>
        )}

        {certs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {certs.slice(0, 3).map(cert => (
              <span key={cert} className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                {cert}
              </span>
            ))}
            {certs.length > 3 && (
              <span className="text-[11px] text-gray-400">+{certs.length - 3} more</span>
            )}
          </div>
        )}
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

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
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

  return (
    <div className="space-y-6 max-w-2xl">
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
              {ROLE_CATEGORIES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Cape Town"
              className={input}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Candidates
            </>
          )}
        </button>
      </form>

      {/* Scoring legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span className="font-semibold text-gray-700">Match score:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          8–10 Strong match
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          5–7 Partial match
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          1–4 Weak match
        </span>
      </div>

      {/* Scoring criteria */}
      {!searched && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">How matching works</p>
          <div className="space-y-2">
            {[
              { label: 'Role match', pts: '5 pts', desc: 'Candidate's role matches your search' },
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
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {candidates.length === 0 ? 'No candidates found' : `${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} found`}
            </p>
            {candidates.length > 0 && (
              <p className="text-xs text-gray-400">Sorted by match score</p>
            )}
          </div>

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
              {candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
