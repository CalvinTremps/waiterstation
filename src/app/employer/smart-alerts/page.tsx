'use client'

import { useState } from 'react'
import { SMART_ALERTS, type SmartAlert } from '@/lib/mock-recruitment'

const TYPE_STYLES: Record<SmartAlert['type'], { icon: string; bg: string; dot: string }> = {
  new_match:       { icon: '🎯', bg: 'bg-blue-50 border-blue-100',   dot: 'bg-blue-500' },
  trial_reminder:  { icon: '📅', bg: 'bg-green-50 border-green-100', dot: 'bg-green-500' },
  offer_expiring:  { icon: '⏰', bg: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
  pool_suggestion: { icon: '💡', bg: 'bg-purple-50 border-purple-100', dot: 'bg-purple-500' },
}

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function SmartAlertsPage() {
  const [alerts, setAlerts] = useState<SmartAlert[]>(SMART_ALERTS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  function markRead(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }

  function markAllRead() {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })))
  }

  function dismiss(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const unread = alerts.filter(a => !a.read).length
  const visible = filter === 'unread' ? alerts.filter(a => !a.read) : alerts

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Alerts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unread > 0 ? `${unread} unread alert${unread !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAllRead}
              className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition capitalize ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {f === 'all' ? `All (${alerts.length})` : `Unread (${unread})`}
          </button>
        ))}
      </div>

      {/* Alert list */}
      {visible.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm font-semibold text-gray-400">No alerts</p>
          <p className="text-xs text-gray-400 mt-1">New candidate matches and reminders will appear here</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {visible.map(alert => {
            const style = TYPE_STYLES[alert.type]
            return (
              <div key={alert.id}
                className={`border rounded-xl p-4 transition ${style.bg} ${!alert.read ? 'ring-1 ring-inset ring-blue-200' : ''}`}
                onClick={() => markRead(alert.id)}
              >
                <div className="flex gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                        {!alert.read && (
                          <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
                        )}
                      </div>
                      <button onClick={e => { e.stopPropagation(); dismiss(alert.id) }}
                        className="shrink-0 text-gray-300 hover:text-gray-500 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.body}</p>

                    <div className="flex items-center justify-between gap-3 mt-2.5 flex-wrap">
                      <span className="text-[11px] text-gray-400">{timeAgo(alert.created_at)}</span>
                      <div className="flex gap-2">
                        {alert.type === 'new_match' && (
                          <a href="/employer/candidates"
                            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-300 bg-white px-2.5 py-1 rounded-lg transition">
                            View candidates →
                          </a>
                        )}
                        {alert.type === 'offer_expiring' && (
                          <a href="/employer/applicants"
                            className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 border border-amber-200 bg-white px-2.5 py-1 rounded-lg transition">
                            Follow up →
                          </a>
                        )}
                        {alert.type === 'trial_reminder' && (
                          <a href="/employer/pipeline"
                            className="text-[11px] font-semibold text-green-700 hover:text-green-900 border border-green-200 bg-white px-2.5 py-1 rounded-lg transition">
                            View pipeline →
                          </a>
                        )}
                        {alert.type === 'pool_suggestion' && (
                          <a href="/employer/pools"
                            className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 border border-purple-200 bg-white px-2.5 py-1 rounded-lg transition">
                            View pools →
                          </a>
                        )}
                      </div>
                    </div>
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
