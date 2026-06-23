'use client'

import { useState } from 'react'
import { DEFAULT_AVAILABILITY, AvailabilityGrid, ShiftSlot } from '@/lib/mock-worker'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SHIFTS: { key: ShiftSlot; label: string; time: string; color: string }[] = [
  { key: 'morning',   label: 'Morning',   time: '06:00–12:00', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { key: 'afternoon', label: 'Afternoon', time: '12:00–17:00', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'evening',   label: 'Evening',   time: '17:00–23:00', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { key: 'night',     label: 'Night',     time: '23:00–06:00', color: 'bg-gray-100 text-gray-700 border-gray-200' },
]

export default function AvailabilityPage() {
  const [grid, setGrid] = useState<AvailabilityGrid>(
    JSON.parse(JSON.stringify(DEFAULT_AVAILABILITY))
  )
  const [saved, setSaved] = useState(false)
  const [openToWork, setOpenToWork] = useState(true)
  const [notice, setNotice] = useState('immediate')

  function toggle(day: number, shift: ShiftSlot) {
    setGrid(prev => {
      const slots = prev[day] ?? []
      const next = slots.includes(shift) ? slots.filter(s => s !== shift) : [...slots, shift]
      return { ...prev, [day]: next }
    })
    setSaved(false)
  }

  function setFullDay(day: number, on: boolean) {
    setGrid(prev => ({ ...prev, [day]: on ? SHIFTS.map(s => s.key) : [] }))
    setSaved(false)
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const totalSlots = Object.values(grid).reduce((acc, slots) => acc + slots.length, 0)
  const activeDays = Object.values(grid).filter(slots => slots.length > 0).length

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
        <p className="text-sm text-gray-500 mt-0.5">Employers see your availability before reaching out. Keep it accurate.</p>
      </div>

      {/* Open to work toggle */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-900">Open to work</p>
          <p className="text-xs text-gray-500 mt-0.5">When on, your profile is visible to employers searching for candidates</p>
        </div>
        <button onClick={() => setOpenToWork(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${openToWork ? 'bg-gray-900' : 'bg-gray-200'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${openToWork ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Notice period */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="font-semibold text-gray-900 mb-3">Notice period</p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'immediate', label: 'Immediately available' },
            { key: '1week', label: '1 week' },
            { key: '2weeks', label: '2 weeks' },
            { key: '1month', label: '1 month' },
          ].map(opt => (
            <button key={opt.key} onClick={() => setNotice(opt.key)}
              className={`text-sm px-4 py-2 rounded-lg border font-medium transition ${notice === opt.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{activeDays}</p>
          <p className="text-xs text-gray-500">days available</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalSlots}</p>
          <p className="text-xs text-gray-500">shift slots open</p>
        </div>
        <p className="text-xs text-gray-400 flex-1">Employers can see this on your profile and filter candidates by availability.</p>
      </div>

      {/* Grid */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-900">Weekly schedule</p>
          <p className="text-xs text-gray-400 mt-0.5">Tap a shift to toggle availability</p>
        </div>

        <div className="divide-y divide-gray-100">
          {DAYS.map((day, di) => {
            const slots = grid[di] ?? []
            const allOn = slots.length === SHIFTS.length
            const noneOn = slots.length === 0
            return (
              <div key={day} className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${noneOn ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white'}`}>
                      {day}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{DAY_FULL[di]}</span>
                    {noneOn && <span className="text-xs text-gray-400">Unavailable</span>}
                  </div>
                  <button onClick={() => setFullDay(di, !allOn)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition">
                    {allOn ? 'Clear all' : 'All day'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SHIFTS.map(s => {
                    const on = slots.includes(s.key)
                    return (
                      <button key={s.key} onClick={() => toggle(di, s.key)}
                        className={`flex flex-col items-start px-3 py-2 rounded-lg border text-left transition ${on ? s.color + ' font-semibold' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300'}`}>
                        <span className="text-xs font-semibold">{s.label}</span>
                        <span className="text-[10px] opacity-70">{s.time}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Save */}
      <button onClick={save}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition ${saved ? 'bg-green-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
        {saved ? 'Availability saved' : 'Save availability'}
      </button>
    </div>
  )
}
