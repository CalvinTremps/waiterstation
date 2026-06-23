'use client'

import { useState, useMemo } from 'react'
import { MOCK_EMPLOYEES, MOCK_SHIFTS, SHIFT_TEMPLATES, type Employee, type Shift } from '@/lib/mock-recruitment'

const STATUS_STYLES: Record<Shift['status'], string> = {
  scheduled: 'bg-blue-50 text-blue-700',
  completed:  'bg-green-50 text-green-700',
  absent:     'bg-red-50 text-red-600',
  cancelled:  'bg-gray-100 text-gray-500',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const LOCATIONS = ['Main Floor', 'Bar', 'Pool Deck', 'Events', 'Kitchen', 'Reception']

function addDays(date: Date, n: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function toISO(d: Date) { return d.toISOString().split('T')[0] }

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS)
  const [employees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [weekOffset, setWeekOffset] = useState(0)
  const [filterEmployee, setFilterEmployee] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [broadcastChannel, setBroadcastChannel] = useState<'email' | 'whatsapp'>('email')
  const [showTemplates, setShowTemplates] = useState(false)
  const [applyingTemplate, setApplyingTemplate] = useState(false)

  // New shift form
  const [newEmpId, setNewEmpId] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newStart, setNewStart] = useState('09:00')
  const [newEnd, setNewEnd] = useState('17:00')
  const [newLocation, setNewLocation] = useState('Main Floor')
  const [newNotes, setNewNotes] = useState('')

  // Week range
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const weekStart = useMemo(() => {
    const d = new Date(today)
    const day = d.getDay()
    d.setDate(d.getDate() - day + weekOffset * 7)
    return d
  }, [today, weekOffset])

  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  const activeEmployees = employees.filter(e => e.status !== 'terminated')

  const filteredShifts = shifts.filter(s => {
    const inWeek = s.date >= toISO(weekDates[0]) && s.date <= toISO(weekDates[6])
    const empMatch = filterEmployee === 'all' || s.employee_id === filterEmployee
    return inWeek && empMatch
  })

  function empById(id: string) { return employees.find(e => e.id === id) }

  function hoursFromTimes(start: string, end: string) {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    let h = (eh * 60 + em - sh * 60 - sm) / 60
    if (h < 0) h += 24
    return Math.round(h * 10) / 10
  }

  function createShift(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmpId || !newDate) return
    const hrs = hoursFromTimes(newStart, newEnd)
    const emp = empById(newEmpId)!
    const shift: Shift = {
      id: `sh-${Date.now()}`,
      employee_id: newEmpId,
      date: newDate,
      start_time: newStart,
      end_time: newEnd,
      hours: hrs,
      role: emp.role,
      location: newLocation,
      status: 'scheduled',
      notes: newNotes || undefined,
    }
    setShifts(prev => [...prev, shift])
    setShowCreateModal(false)
    setNewEmpId(''); setNewDate(''); setNewStart('09:00'); setNewEnd('17:00')
    setNewLocation('Main Floor'); setNewNotes('')
  }

  function markStatus(shiftId: string, status: Shift['status']) {
    setShifts(prev => prev.map(s => s.id === shiftId ? { ...s, status } : s))
  }

  function sendBroadcast() {
    setBroadcastSent(true)
    setTimeout(() => { setShowBroadcast(false); setBroadcastSent(false) }, 2000)
  }

  function applyTemplate(templateId: string) {
    const tmpl = SHIFT_TEMPLATES.find(t => t.id === templateId)
    if (!tmpl) return
    setApplyingTemplate(true)
    const newShifts: Shift[] = tmpl.shifts.map((ts, i) => {
      const targetDate = new Date(weekDates[ts.day])
      const [sh, sm] = ts.start_time.split(':').map(Number)
      const [eh, em] = ts.end_time.split(':').map(Number)
      let hrs = (eh * 60 + em - sh * 60 - sm) / 60
      if (hrs < 0) hrs += 24
      return {
        id: `sh-tmpl-${Date.now()}-${i}`,
        employee_id: activeEmployees.find(e => e.role === ts.role)?.id ?? activeEmployees[i % activeEmployees.length].id,
        date: toISO(targetDate),
        start_time: ts.start_time,
        end_time: ts.end_time,
        hours: Math.round(hrs * 10) / 10,
        role: ts.role,
        location: ts.location,
        status: 'scheduled' as const,
      }
    })
    setShifts(prev => [...prev, ...newShifts])
    setShowTemplates(false)
    setApplyingTemplate(false)
  }

  // Build broadcast preview — upcoming shifts for each employee this week
  const broadcastLines = activeEmployees.map(emp => {
    const empShifts = filteredShifts
      .filter(s => s.employee_id === emp.id && (s.status === 'scheduled' || s.status === 'completed'))
      .sort((a, b) => a.date.localeCompare(b.date))
    if (!empShifts.length) return null
    return {
      emp,
      lines: empShifts.map(s => `${formatShortDate(s.date)} ${s.start_time}–${s.end_time} @ ${s.location}`),
    }
  }).filter(Boolean)

  const weekLabel = `${formatShortDate(toISO(weekDates[0]))} – ${formatShortDate(toISO(weekDates[6]))}`

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shifts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{weekLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-3 py-2 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12-1a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            Templates
          </button>
          <button onClick={() => setShowBroadcast(true)}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-3 py-2 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Broadcast
          </button>
          <button onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Add Shift
          </button>
        </div>
      </div>

      {/* Week nav + employee filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
          <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 rounded hover:bg-white transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button onClick={() => setWeekOffset(0)}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition ${weekOffset === 0 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            This week
          </button>
          <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded hover:bg-white transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <select value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option value="all">All employees</option>
          {activeEmployees.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {/* Calendar grid */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDates.map((d, i) => {
            const iso = toISO(d)
            const isToday = iso === toISO(today)
            return (
              <div key={i} className={`text-center py-3 border-r last:border-r-0 border-gray-100 ${isToday ? 'bg-gray-50' : ''}`}>
                <p className="text-[11px] text-gray-400 font-medium">{DAYS[d.getDay()]}</p>
                <p className={`text-sm font-bold mt-0.5 ${isToday ? 'text-gray-900' : 'text-gray-600'}`}>{d.getDate()}</p>
              </div>
            )
          })}
        </div>

        {/* Shift cells — one row per employee */}
        {activeEmployees
          .filter(e => filterEmployee === 'all' || e.id === filterEmployee)
          .map(emp => {
            const empShifts = filteredShifts.filter(s => s.employee_id === emp.id)
            if (filterEmployee === 'all' && empShifts.length === 0) return null
            return (
              <div key={emp.id} className="grid grid-cols-7 border-t border-gray-100 min-h-[64px]">
                {weekDates.map((d, i) => {
                  const iso = toISO(d)
                  const dayShifts = empShifts.filter(s => s.date === iso)
                  const isToday = iso === toISO(today)
                  return (
                    <div key={i} className={`border-r last:border-r-0 border-gray-100 p-1.5 ${isToday ? 'bg-gray-50/50' : ''}`}>
                      {dayShifts.map(shift => (
                        <div key={shift.id} className={`text-[10px] font-semibold rounded-lg px-1.5 py-1 mb-1 leading-tight ${STATUS_STYLES[shift.status]}`}>
                          <p className="font-bold truncate">{filterEmployee === 'all' ? emp.name.split(' ')[0] : emp.role}</p>
                          <p className="opacity-75">{shift.start_time}–{shift.end_time}</p>
                          <p className="opacity-60 truncate">{shift.location}</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )
          })}

        {filteredShifts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No shifts scheduled for this week</p>
            <button onClick={() => setShowCreateModal(true)}
              className="mt-3 text-sm font-semibold text-gray-900 underline">Add first shift</button>
          </div>
        )}
      </div>

      {/* Shift list below calendar */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Shift list — {weekLabel}</p>
        <div className="space-y-2">
          {filteredShifts
            .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time))
            .map(shift => {
              const emp = empById(shift.employee_id)
              if (!emp) return null
              return (
                <div key={shift.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <div className={`w-8 h-8 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {emp.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-500">{formatShortDate(shift.date)} · {shift.start_time}–{shift.end_time} ({shift.hours}h) · {shift.location}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[shift.status]}`}>
                      {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                    </span>
                    {shift.status === 'scheduled' && (
                      <div className="flex gap-1">
                        <button onClick={() => markStatus(shift.id, 'completed')}
                          className="text-[10px] font-semibold border border-green-200 text-green-700 px-2 py-0.5 rounded-lg hover:bg-green-50 transition">
                          ✓ Done
                        </button>
                        <button onClick={() => markStatus(shift.id, 'absent')}
                          className="text-[10px] font-semibold border border-red-200 text-red-600 px-2 py-0.5 rounded-lg hover:bg-red-50 transition">
                          ✗ Absent
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Create shift modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCreateModal(false)}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Add Shift</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <form onSubmit={createShift} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Employee *</label>
                <select value={newEmpId} onChange={e => setNewEmpId(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option value="">Select employee</option>
                  {activeEmployees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date *</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start time</label>
                  <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End time</label>
                  <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                <select value={newLocation} onChange={e => setNewLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes (optional)</label>
                <input value={newNotes} onChange={e => setNewNotes(e.target.value)}
                  placeholder="Any special instructions…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
              </div>
              {newStart && newEnd && (
                <p className="text-xs text-gray-500">Duration: {hoursFromTimes(newStart, newEnd)} hours</p>
              )}
              <button type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                Create shift
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast modal */}
      {showBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setShowBroadcast(false); setBroadcastSent(false) }}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Broadcast Weekly Schedule</h2>
                <p className="text-xs text-gray-500 mt-0.5">Send shift schedule to all active employees for {weekLabel}</p>
              </div>
              <button onClick={() => { setShowBroadcast(false); setBroadcastSent(false) }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            {broadcastSent ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Schedule sent!</p>
                <p className="text-sm text-gray-500">All employees have been notified of their shifts for {weekLabel}.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Channel picker */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Send via</p>
                  <div className="flex gap-2">
                    <button onClick={() => setBroadcastChannel('email')}
                      className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-semibold transition ${broadcastChannel === 'email' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      Email
                    </button>
                    <button onClick={() => setBroadcastChannel('whatsapp')}
                      className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-semibold transition ${broadcastChannel === 'whatsapp' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                  {broadcastChannel === 'whatsapp' && (
                    <p className="text-[11px] text-amber-600 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      WhatsApp Business API integration coming soon. For now, messages will be sent via email.
                    </p>
                  )}
                </div>

                {/* Preview */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Preview — {broadcastLines.length} employee{broadcastLines.length !== 1 ? 's' : ''} with shifts</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2.5">
                    {broadcastLines.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No shifts scheduled for this week</p>
                    ) : broadcastLines.map((item: any) => (
                      <div key={item.emp.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-5 h-5 rounded-full ${item.emp.avatar_color} flex items-center justify-center text-white text-[8px] font-bold`}>
                            {item.emp.avatar_initials}
                          </div>
                          <p className="text-xs font-semibold text-gray-800">{item.emp.name}</p>
                          <p className="text-[10px] text-gray-400">{item.emp.email}</p>
                        </div>
                        {item.lines.map((line: string, i: number) => (
                          <p key={i} className="text-[11px] text-gray-500 ml-7">• {line}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={sendBroadcast}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                  Send to {broadcastLines.length} employee{broadcastLines.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shift templates modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowTemplates(false)}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Shift Templates</h2>
                <p className="text-xs text-gray-500 mt-0.5">Apply a template to fill this week&apos;s schedule</p>
              </div>
              <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              {SHIFT_TEMPLATES.map(tmpl => (
                <div key={tmpl.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{tmpl.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{tmpl.description}</p>
                      <div className="mt-2 space-y-1">
                        {tmpl.shifts.map((s, i) => (
                          <p key={i} className="text-[11px] text-gray-500">
                            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][s.day]} · {s.start_time}–{s.end_time} · {s.role} @ {s.location}
                          </p>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => applyTemplate(tmpl.id)}
                      disabled={applyingTemplate}
                      className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition disabled:opacity-60">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
