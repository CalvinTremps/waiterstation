'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'waiterstation_saved_jobs'

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function setSavedIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export default function SaveButton({ jobId, size = 'sm' }: { jobId: string; size?: 'sm' | 'lg' }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(getSavedIds().includes(jobId))
  }, [jobId])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const ids = getSavedIds()
    const next = ids.includes(jobId) ? ids.filter(id => id !== jobId) : [...ids, jobId]
    setSavedIds(next)
    setSaved(next.includes(jobId))
  }

  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  const btnSize = size === 'lg'
    ? 'p-2.5 rounded-xl border border-gray-200 bg-white hover:border-emerald-300'
    : 'p-1.5 rounded-lg hover:bg-gray-100'

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
      aria-pressed={saved}
      className={`shrink-0 transition ${btnSize}`}
    >
      <svg
        className={`${iconSize} transition-colors ${saved ? 'text-emerald-600 fill-emerald-600' : 'text-gray-400 fill-none'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    </button>
  )
}
