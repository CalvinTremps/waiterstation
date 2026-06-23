'use client'

import { useState } from 'react'
import { LEAVE_REQUESTS, LEAVE_BALANCES, MOCK_EMPLOYEES, type LeaveRequest } from '@/lib/mock-recruitment'

const TYPE_LABEL: Record<LeaveRequest['type'], string> = {
  annual: 'Annual Leave', sick: 'Sick Leave', family: 'Family Responsibility', unpaid: 'Unpaid Leave',
}
const TYPE_COLOR: Record<LeaveRequest['type'], string> = {
  annual: 'bg-blue-50 text-blue-700', sick: 'bg-amber-50 text-amber-700',
  family: 'bg-purple-50 text-purple-700', unpaid: 'bg-gray-100 text-gray-600',
}
const STATUS_COLOR: Record<LeaveRequest['status'], string> = {
  pending: 'bg-amber-50 text-amber-700', approved: 'bg-green-50 text-green-700', declined: 'bg-red-50 text-red-600',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}
function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  return `${d}d ago`
}

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(LEAVE_REQUESTS)
  const [filter, setFilter] = useState<'all' | LeaveRequest['status']>('all')

  const employees = MOCK_EMPLOYEES
  function empById(id: string) { return employees.find(e => e.id === id) }
  function balanceFor(id: string) { return LEAVE_BALANCES.find(b => b.employee_id === id) }

  function respond(id: string, status: 'approved' | 'declined') {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status, responded_at: new Date().toISOString() } : r
    ))
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)
  const pending = requests.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {pending > 0 ? `${pending} request${pending !== 1 ? 's' : ''} awaiting approval` : 'No pending requests'}
        </p>
      </div>

      {/* Leave balances */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Leave Balances</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employees.filter(e => e.status !== 'terminated').map(emp => {
            const bal = balanceFor(emp.id)
            if (!bal) return null
            const annualLeft = bal.annual_total - bal.annual_used
            const sickLeft = bal.sick_total - bal.sick_used
            const annualPct = (bal.annual_used / bal.annual_total) * 100
            return (
              <div key={emp.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {emp.avatar_initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{emp.name}</p>
                    <p className="text-xs text-gray-400 truncate">{emp.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-gray-500">Annual</span>
                      <span className="text-[11px] font-semibold text-gray-700">{annualLeft} / {bal.annual_total} days left</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${annualPct}%` }}/>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] text-gray-500">Sick</span>
                    <span className="text-[11px] font-semibold text-gray-700">{sickLeft} / {bal.sick_total} days left</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all', 'pending', 'approved', 'declined'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition capitalize relative ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pending > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">No leave requests</p>
          </div>
        )}
        {filtered.map(req => {
          const emp = empById(req.employee_id)
          if (!emp) return null
          return (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {emp.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[req.type]}`}>
                          {TYPE_LABEL[req.type]}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[req.status]}`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(req.start_date)} – {formatDate(req.end_date)} · {req.days} day{req.days !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-400 shrink-0">{timeAgo(req.submitted_at)}</p>
                  </div>
                  {req.reason && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2">&ldquo;{req.reason}&rdquo;</p>
                  )}
                  {req.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => respond(req.id, 'approved')}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        Approve
                      </button>
                      <button onClick={() => respond(req.id, 'declined')}
                        className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
