'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MOCK_APPLICATIONS,
  MOCK_WORKER_INTERVIEWS,
  MOCK_MESSAGES,
  MOCK_WORKER_PROFILE,
} from '@/lib/mock-worker'

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-gray-100 text-gray-600',
  viewed: 'bg-blue-50 text-blue-700',
  shortlisted: 'bg-amber-50 text-amber-700',
  interview: 'bg-purple-50 text-purple-700',
  offered: 'bg-gray-100 text-gray-800',
  hired: 'bg-gray-100 text-gray-900',
  not_selected: 'bg-red-50 text-red-600',
  withdrawn: 'bg-gray-100 text-gray-400',
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  viewed: 'Viewed',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offered: 'Offered',
  hired: 'Hired',
  not_selected: 'Not Selected',
  withdrawn: 'Withdrawn',
}

function fmt(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

export default function WorkerDashboard() {
  const [dismissed, setDismissed] = useState(false)

  const activeApps = MOCK_APPLICATIONS.filter(a => !['not_selected', 'withdrawn', 'hired'].includes(a.status))
  const offers = MOCK_APPLICATIONS.filter(a => a.status === 'offered')
  const upcoming = MOCK_WORKER_INTERVIEWS.filter(i => i.outcome === 'upcoming')
  const unread = MOCK_MESSAGES.filter(m => m.unread)

  const profileFields = [
    MOCK_WORKER_PROFILE.name,
    MOCK_WORKER_PROFILE.bio,
    MOCK_WORKER_PROFILE.phone,
    MOCK_WORKER_PROFILE.skills.length > 0,
    MOCK_WORKER_PROFILE.certifications.length > 0,
  ]
  const profilePct = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100)

  const stats = [
    { label: 'Active applications', value: activeApps.length, href: '/worker/applications', color: 'text-gray-900' },
    { label: 'Offers received', value: offers.length, href: '/worker/applications', color: 'text-amber-600' },
    { label: 'Upcoming interviews', value: upcoming.length, href: '/worker/interviews', color: 'text-purple-600' },
    { label: 'Unread messages', value: unread.length, href: '/worker/messages', color: 'text-blue-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good day, {MOCK_WORKER_PROFILE.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {MOCK_WORKER_PROFILE.open_to_work
              ? 'Your profile is visible to employers'
              : 'Your profile is hidden from employers'}
          </p>
        </div>
        <Link href="/jobs"
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shrink-0">
          Browse new jobs
        </Link>
      </div>

      {/* Offer banner */}
      {offers.length > 0 && !dismissed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">You have an offer!</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {offers[0].employer_name} has made you an offer for {offers[0].job_title}. Check your messages to respond.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/worker/messages" className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition">
              View offer
            </Link>
            <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-amber-600 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition group">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Profile completeness */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-gray-900">Profile strength</h2>
            <p className="text-xs text-gray-400 mt-0.5">A complete profile gets 3x more views from employers</p>
          </div>
          <Link href="/worker/profile" className="text-xs font-semibold text-gray-900 hover:underline">
            Edit profile
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-full bg-gray-700 rounded-full transition-all" style={{ width: `${profilePct}%` }} />
          </div>
          <span className="text-sm font-bold text-gray-700 w-10 shrink-0">{profilePct}%</span>
        </div>
        {profilePct < 100 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {!MOCK_WORKER_PROFILE.bio && (
              <Link href="/worker/profile" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-800 px-2.5 py-1 rounded-full transition">
                + Add bio
              </Link>
            )}
            {!MOCK_WORKER_PROFILE.phone && (
              <Link href="/worker/profile" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-800 px-2.5 py-1 rounded-full transition">
                + Add phone
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent applications */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent applications</h2>
            <Link href="/worker/applications" className="text-xs font-semibold text-gray-900 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_APPLICATIONS.slice(0, 4).map(app => (
              <div key={app.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{app.job_title}</p>
                  <p className="text-xs text-gray-400 truncate">{app.employer_name}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold uppercase">{fmt(app.updated_at)}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[app.status]}`}>
                    {STATUS_LABELS[app.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Upcoming interviews</h2>
            <Link href="/worker/interviews" className="text-xs font-semibold text-gray-900 hover:underline">
              View all
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400">
              <p className="text-sm">No upcoming interviews</p>
              <Link href="/jobs" className="text-xs text-gray-900 hover:underline mt-1 block">Browse open roles</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.map(iv => {
                const d = new Date(iv.date + 'T00:00:00')
                return (
                  <div key={iv.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-purple-500 uppercase leading-none">
                        {d.toLocaleDateString('en-ZA', { month: 'short' })}
                      </span>
                      <span className="text-base font-bold text-purple-700 leading-tight">
                        {d.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{iv.job_title}</p>
                      <p className="text-xs text-gray-400">{iv.employer_name} · {iv.time} · {iv.type}</p>
                    </div>
                    <Link href="/worker/interviews"
                      className="text-xs font-semibold text-purple-600 hover:underline shrink-0">
                      Prep
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Messages preview */}
      {unread.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              New messages
              <span className="ml-2 text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{unread.length}</span>
            </h2>
            <Link href="/worker/messages" className="text-xs font-semibold text-gray-900 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {unread.map(msg => (
              <Link key={msg.id} href="/worker/messages"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition">
                <div className={`w-9 h-9 rounded-full ${msg.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {msg.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900 truncate">{msg.employer_name}</p>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.last_message}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{fmt(msg.last_message_at)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
