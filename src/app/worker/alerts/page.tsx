'use client'

import { useState } from 'react'
import { MOCK_JOB_ALERTS, JobAlert } from '@/lib/mock-worker'

const ROLE_OPTIONS = [
  'waiter', 'waitress', 'barista', 'bartender', 'chef', 'cook', 'manager',
  'supervisor', 'host/hostess', 'food runner', 'kitchen assistant',
]
const LOCATION_OPTIONS = [
  'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Stellenbosch',
  'Franschhoek', 'Hermanus', 'Garden Route', 'Any location',
]
const TYPE_OPTIONS = ['permanent', 'seasonal', 'event', 'part-time']

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtRelative(iso: string) {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>(MOCK_JOB_ALERTS)
  const [showCreate, setShowCreate] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newType, setNewType] = useState('')
  const [newMinPay, setNewMinPay] = useState('')

  function toggleAlert(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  function deleteAlert(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  function createAlert() {
    if (!newLabel.trim()) return
    const alert: JobAlert = {
      id: `al-${Date.now()}`,
      label: newLabel.trim(),
      role: newRole || undefined,
      location: newLocation || undefined,
      employment_type: newType || undefined,
      min_pay: newMinPay ? parseInt(newMinPay) : undefined,
      active: true,
      created_at: new Date().toISOString(),
      matches_since: 0,
      last_match: undefined,
    }
    setAlerts(prev => [alert, ...prev])
    setNewLabel('')
    setNewRole('')
    setNewLocation('')
    setNewType('')
    setNewMinPay('')
    setShowCreate(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Alerts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Get notified when new jobs match your criteria</p>
        </div>
        <button onClick={() => setShowCreate(o => !o)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shrink-0 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New alert
        </button>
      </div>

      {/* Create alert form */}
      {showCreate && (
        <div className="bg-white border border-emerald-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Create new alert</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alert name <span className="text-emerald-600">*</span></label>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
              placeholder="e.g. Waiter jobs in Cape Town"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role type</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                <option value="">Any role</option>
                {ROLE_OPTIONS.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
              <select value={newLocation} onChange={e => setNewLocation(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                <option value="">Anywhere</option>
                {LOCATION_OPTIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Employment type</label>
              <select value={newType} onChange={e => setNewType(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white">
                <option value="">Any type</option>
                {TYPE_OPTIONS.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Minimum pay (R/month)</label>
              <input value={newMinPay} onChange={e => setNewMinPay(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 7000"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={createAlert} disabled={!newLabel.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
              Create alert
            </button>
            <button onClick={() => setShowCreate(false)}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="font-medium">No alerts set up</p>
          <p className="text-sm mt-1">Create an alert to be notified of new matching jobs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`bg-white border rounded-xl p-5 transition ${
              alert.active ? 'border-gray-200' : 'border-gray-100 opacity-60'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.active ? 'bg-emerald-50' : 'bg-gray-50'
                }`}>
                  <svg className={`w-4 h-4 ${alert.active ? 'text-emerald-600' : 'text-gray-400'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{alert.label}</p>
                    {!alert.active && (
                      <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Paused</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {alert.role && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{alert.role}</span>
                    )}
                    {alert.location && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{alert.location}</span>
                    )}
                    {alert.employment_type && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{alert.employment_type}</span>
                    )}
                    {alert.min_pay && (
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Min R{alert.min_pay.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{alert.matches_since} matches since {fmt(alert.created_at)}</span>
                    {alert.last_match && (
                      <>
                        <span>·</span>
                        <span>Last match {fmtRelative(alert.last_match)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleAlert(alert.id)}
                    title={alert.active ? 'Pause alert' : 'Resume alert'}
                    className={`p-2 rounded-lg transition ${
                      alert.active
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}>
                    {alert.active ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <button onClick={() => deleteAlert(alert.id)}
                    title="Delete alert"
                    className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
