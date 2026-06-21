'use client'

import { useState } from 'react'
import { MOCK_APPLICANTS, PIPELINE_STAGES } from '@/lib/mock-recruitment'

export default function SavedCandidatesPage() {
  const [saved, setSaved] = useState(MOCK_APPLICANTS.filter(a => a.saved))
  const [search, setSearch] = useState('')

  const filtered = saved.filter(a =>
    !search.trim() ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.job_title.toLowerCase().includes(search.toLowerCase())
  )

  function unsave(id: string) {
    setSaved(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Candidates</h1>
        <p className="text-sm text-gray-500 mt-0.5">{saved.length} saved</p>
      </div>

      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search saved candidates..."
        className="w-full max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
          <p className="font-medium">No saved candidates yet</p>
          <p className="text-sm mt-1">Save candidates from their profile page</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(a => {
            const stageInfo = PIPELINE_STAGES.find(s => s.key === a.stage)!
            return (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-full ${a.avatar_color} flex items-center justify-center text-white font-bold shrink-0`}>
                    {a.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{a.job_title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className={`w-3 h-3 ${i <= (a.rating ?? 0) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => unsave(a.id)}
                    className="text-gray-300 hover:text-red-400 transition p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {a.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${stageInfo.color}`}>
                    {stageInfo.label}
                  </span>
                  <div className="flex gap-2">
                    <a href={`mailto:${a.email}`}
                      className="text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition">
                      Email
                    </a>
                    <a href={`/employer/applicants/${a.id}`}
                      className="text-xs font-semibold bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg transition">
                      View profile
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
