'use client'

import { useState, useMemo } from 'react'
import { Icon } from '@/components/Icon'
import { MOCK_TIMESHEETS, MOCK_EMPLOYEES, type TimesheetEntry } from '@/lib/mock-recruitment'

const STATUS_STYLES: Record<TimesheetEntry['status'], string> = {
  clocked_in: 'bg-blue-50 text-blue-700',
  completed:  'bg-green-50 text-green-700',
  missed:     'bg-red-50 text-red-600',
}
const STATUS_LABELS: Record<TimesheetEntry['status'], string> = {
  clocked_in: 'Clocked in', completed: 'Completed', missed: 'Missed',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
}

function variance(actual?: number, scheduled?: number) {
  if (actual == null || scheduled == null) return null
  const diff = Math.round((actual - scheduled) * 10) / 10
  return diff
}

export default function TimesheetsPage() {
  const [timesheets] = useState<TimesheetEntry[]>(MOCK_TIMESHEETS)
  const employees = MOCK_EMPLOYEES
  const [filterEmp, setFilterEmp] = useState('all')
  const [filterStatus, setFilterStatus] = useState<'all' | TimesheetEntry['status']>('all')

  function empById(id: string) { return employees.find(e => e.id === id) }

  const filtered = timesheets.filter(t => {
    const empMatch = filterEmp === 'all' || t.employee_id === filterEmp
    const statusMatch = filterStatus === 'all' || t.status === filterStatus
    return empMatch && statusMatch
  }).sort((a, b) => b.date.localeCompare(a.date))

  const totalScheduled = timesheets.reduce((s, t) => s + t.scheduled_hours, 0)
  const totalActual = timesheets.filter(t => t.actual_hours).reduce((s, t) => s + (t.actual_hours ?? 0), 0)
  const missed = timesheets.filter(t => t.status === 'missed').length
  const clockedIn = timesheets.filter(t => t.status === 'clocked_in').length

  // Per-employee summary
  const empSummaries = useMemo(() =>
    employees.filter(e => e.status !== 'terminated').map(emp => {
      const empTs = timesheets.filter(t => t.employee_id === emp.id)
      const schHrs = empTs.reduce((s, t) => s + t.scheduled_hours, 0)
      const actHrs = empTs.filter(t => t.actual_hours).reduce((s, t) => s + (t.actual_hours ?? 0), 0)
      const missedCount = empTs.filter(t => t.status === 'missed').length
      const lateCount = empTs.filter(t => {
        if (!t.clock_in) return false
        const [sh, sm] = t.scheduled_start.split(':').map(Number)
        const [ch, cm] = t.clock_in.split(':').map(Number)
        return ch * 60 + cm > sh * 60 + sm + 5
      }).length
      return { emp, schHrs, actHrs, missedCount, lateCount, entries: empTs.length }
    }),
    [timesheets, employees]
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
        <p className="text-sm text-gray-500 mt-0.5">Clock-in/out records and hours worked</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalScheduled}h</p>
          <p className="text-xs text-gray-500 mt-0.5">Scheduled</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{Math.round(totalActual * 10) / 10}h</p>
          <p className="text-xs text-gray-500 mt-0.5">Actual worked</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className={`text-2xl font-bold ${missed > 0 ? 'text-red-500' : 'text-gray-400'}`}>{missed}</p>
          <p className="text-xs text-gray-500 mt-0.5">Missed shifts</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className={`text-2xl font-bold ${clockedIn > 0 ? 'text-blue-500' : 'text-gray-400'}`}>{clockedIn}</p>
          <p className="text-xs text-gray-500 mt-0.5">Currently in</p>
        </div>
      </div>

      {/* Per-employee summary */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Employee Summary</p>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b border-gray-100 px-4 py-2.5">
            {['Employee', 'Scheduled', 'Actual', 'Missed', 'Late arrivals'].map(h => (
              <p key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
            ))}
          </div>
          {empSummaries.map(({ emp, schHrs, actHrs, missedCount, lateCount }) => (
            <div key={emp.id} className="flex sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-3 sm:gap-0 px-4 py-3 border-t border-gray-100 first:border-t-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {emp.avatar_initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-400 sm:hidden">{schHrs}h sched · {Math.round(actHrs * 10) / 10}h actual</p>
                </div>
              </div>
              <p className="hidden sm:block text-sm text-gray-700">{schHrs}h</p>
              <p className="hidden sm:block text-sm font-medium text-gray-700">{Math.round(actHrs * 10) / 10}h</p>
              <p className={`hidden sm:block text-sm font-medium ${missedCount > 0 ? 'text-red-500' : 'text-gray-400'}`}>{missedCount}</p>
              <p className={`hidden sm:block text-sm font-medium ${lateCount > 0 ? 'text-amber-500' : 'text-gray-400'}`}>{lateCount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select value={filterEmp} onChange={e => setFilterEmp(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option value="all">All employees</option>
          {employees.filter(e => e.status !== 'terminated').map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['all', 'completed', 'clocked_in', 'missed'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition ${
                filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {s === 'all' ? 'All' : s === 'clocked_in' ? 'Active' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timesheet entries */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">No timesheet entries</p>
          </div>
        )}
        {filtered.map(entry => {
          const emp = empById(entry.employee_id)
          if (!emp) return null
          const v = variance(entry.actual_hours, entry.scheduled_hours)
          const isLate = entry.clock_in && (() => {
            const [sh, sm] = entry.scheduled_start.split(':').map(Number)
            const [ch, cm] = entry.clock_in!.split(':').map(Number)
            return ch * 60 + cm > sh * 60 + sm + 5
          })()
          return (
            <div key={entry.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {emp.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[entry.status]}`}>
                      {STATUS_LABELS[entry.status]}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Scheduled</p>
                      <p className="text-xs font-medium text-gray-700">{entry.scheduled_start} – {entry.scheduled_end} ({entry.scheduled_hours}h)</p>
                    </div>
                    {entry.clock_in && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Actual</p>
                        <p className="text-xs font-medium text-gray-700">
                          {entry.clock_in} – {entry.clock_out ?? 'active'}
                          {entry.actual_hours && ` (${entry.actual_hours}h)`}
                        </p>
                      </div>
                    )}
                    {v !== null && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Variance</p>
                        <p className={`text-xs font-semibold ${v > 0 ? 'text-green-600' : v < -0.25 ? 'text-red-500' : 'text-gray-500'}`}>
                          {v > 0 ? '+' : ''}{v}h
                        </p>
                      </div>
                    )}
                  </div>
                  {isLate && (
                    <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1"><Icon name="warning" className="w-3 h-3" /> Late arrival</p>
                  )}
                  {entry.notes && (
                    <p className="text-[11px] text-gray-500 mt-1 italic">{entry.notes}</p>
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
