'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JobSearch({ defaultValue, status }: { defaultValue: string; status: string }) {
  const [q, setQ] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = q
      ? `/admin/jobs?status=${status}&q=${encodeURIComponent(q)}`
      : `/admin/jobs?status=${status}`
    router.push(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by title, employer, location…"
          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
      </div>
      <button type="submit" className="bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition">
        Search
      </button>
      {defaultValue && (
        <a href={`/admin/jobs?status=${status}`} className="text-sm text-gray-400 hover:text-gray-700 px-3 py-2.5 rounded-xl border border-gray-200 bg-white transition">
          Clear
        </a>
      )}
    </form>
  )
}
