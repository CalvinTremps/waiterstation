'use client'

import { useState, useMemo } from 'react'
import { MOCK_EMPLOYEES, MOCK_SHIFTS, DEFAULT_PAYROLL_SETTINGS, type Employee } from '@/lib/mock-recruitment'

const PAY_LABEL: Record<Employee['pay_type'], string> = {
  per_hour: 'per hour', per_shift: 'per shift', monthly: 'monthly salary',
}

function getPeriodBounds(monthEndDay: number, referenceDate: Date) {
  const y = referenceDate.getFullYear()
  const m = referenceDate.getMonth()
  const d = referenceDate.getDate()

  let periodEnd: Date
  let periodStart: Date

  if (d <= monthEndDay) {
    // We're inside the current period
    periodEnd = new Date(y, m, monthEndDay)
    periodStart = new Date(y, m - 1, monthEndDay + 1)
  } else {
    // We're past the end day, we're in the next period
    periodEnd = new Date(y, m + 1, monthEndDay)
    periodStart = new Date(y, m, monthEndDay + 1)
  }
  return { periodStart, periodEnd }
}

function toISO(d: Date) { return d.toISOString().split('T')[0] }

function formatDate(d: Date) {
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface EmpPayroll {
  employee: Employee
  shiftsWorked: number
  hoursWorked: number
  absences: number
  grossPay: number
  adjustments: number
}

export default function PayrollPage() {
  const today = useMemo(() => new Date(), [])
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [monthEndDay, setMonthEndDay] = useState(DEFAULT_PAYROLL_SETTINGS.month_end_day)
  const [showSettings, setShowSettings] = useState(false)
  const [tempMonthEnd, setTempMonthEnd] = useState(monthEndDay)
  const [adjustments, setAdjustments] = useState<Record<string, number>>({})
  const [payRateEdits, setPayRateEdits] = useState<Record<string, number>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { periodStart, periodEnd } = useMemo(() => getPeriodBounds(monthEndDay, today), [monthEndDay, today])

  const periodLabel = `${formatDate(periodStart)} – ${formatDate(periodEnd)}`

  const activeEmployees = employees.filter(e => e.status !== 'terminated')

  const payrollData: EmpPayroll[] = useMemo(() =>
    activeEmployees.map(emp => {
      const payRate = payRateEdits[emp.id] ?? emp.pay_rate
      const empShifts = MOCK_SHIFTS.filter(s =>
        s.employee_id === emp.id &&
        s.date >= toISO(periodStart) &&
        s.date <= toISO(periodEnd)
      )
      const completed = empShifts.filter(s => s.status === 'completed')
      const scheduled = empShifts.filter(s => s.status === 'scheduled')
      const absent = empShifts.filter(s => s.status === 'absent').length
      const allWorked = [...completed, ...scheduled]
      const shiftsWorked = allWorked.length
      const hoursWorked = allWorked.reduce((s, sh) => s + sh.hours, 0)

      let grossPay = 0
      if (emp.pay_type === 'per_shift') grossPay = payRate * shiftsWorked
      else if (emp.pay_type === 'per_hour') grossPay = payRate * hoursWorked
      else grossPay = payRate

      const adj = adjustments[emp.id] ?? 0
      return { employee: { ...emp, pay_rate: payRate }, shiftsWorked, hoursWorked, absences: absent, grossPay, adjustments: adj }
    }),
    [activeEmployees, periodStart, periodEnd, adjustments, payRateEdits]
  )

  const totalGross = payrollData.reduce((s, r) => s + r.grossPay + r.adjustments, 0)

  function exportCSV() {
    const header = 'Name,Role,Pay Type,Rate,Shifts,Hours,Absences,Gross Pay,Adjustment,Total'
    const rows = payrollData.map(r =>
      [r.employee.name, r.employee.role, r.employee.pay_type,
       r.employee.pay_rate, r.shiftsWorked, r.hoursWorked, r.absences,
       r.grossPay.toFixed(2), r.adjustments.toFixed(2),
       (r.grossPay + r.adjustments).toFixed(2)].join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payroll-${toISO(periodStart)}-to-${toISO(periodEnd)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-500 mt-0.5">Period: {periodLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setTempMonthEnd(monthEndDay); setShowSettings(true) }}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-3 py-2 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Settings
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Total summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{activeEmployees.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Employees</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{payrollData.reduce((s, r) => s + r.shiftsWorked, 0)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Shifts</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">R{Math.round(totalGross).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Payroll</p>
        </div>
      </div>

      {/* Period info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p className="text-xs text-blue-800">
          Pay period closes on the <strong>{monthEndDay}{monthEndDay === 1 ? 'st' : monthEndDay === 2 ? 'nd' : monthEndDay === 3 ? 'rd' : 'th'}</strong> of each month.
          Scheduled future shifts are included in calculations. <button onClick={() => { setTempMonthEnd(monthEndDay); setShowSettings(true) }} className="underline font-semibold">Change</button>
        </p>
      </div>

      {/* Payroll table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 px-4 py-2.5">
          {['Employee', 'Pay type', 'Rate', 'Shifts', 'Hours', 'Absences', 'Total'].map(h => (
            <p key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
          ))}
        </div>
        {payrollData.map(row => {
          const isExpanded = expandedId === row.employee.id
          const total = row.grossPay + row.adjustments
          return (
            <div key={row.employee.id} className="border-t border-gray-100 first:border-t-0">
              <button
                onClick={() => setExpandedId(isExpanded ? null : row.employee.id)}
                className="w-full text-left hover:bg-gray-50 transition">
                <div className="flex items-center gap-3 px-4 py-3.5 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr]">
                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full ${row.employee.avatar_color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {row.employee.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{row.employee.name}</p>
                      <p className="text-xs text-gray-400 truncate md:hidden">{row.shiftsWorked} shifts · R{Math.round(total).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="hidden md:block text-xs text-gray-500 capitalize">{row.employee.pay_type.replace('_', ' ')}</p>
                  <p className="hidden md:block text-xs text-gray-700 font-medium">R{row.employee.pay_rate.toLocaleString()}</p>
                  <p className="hidden md:block text-xs text-gray-700">{row.shiftsWorked}</p>
                  <p className="hidden md:block text-xs text-gray-700">{row.hoursWorked}h</p>
                  <p className={`hidden md:block text-xs font-medium ${row.absences > 0 ? 'text-red-500' : 'text-gray-400'}`}>{row.absences}</p>
                  <div className="md:block ml-auto md:ml-0">
                    <p className="text-sm font-bold text-gray-900">R{Math.round(total).toLocaleString()}</p>
                    {row.adjustments !== 0 && (
                      <p className={`text-[10px] ${row.adjustments > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {row.adjustments > 0 ? '+' : ''}R{row.adjustments.toLocaleString()} adj
                      </p>
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded row */}
              {isExpanded && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">{row.shiftsWorked}</p>
                      <p className="text-[11px] text-gray-400">Shifts worked</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">{row.hoursWorked}h</p>
                      <p className="text-[11px] text-gray-400">Hours worked</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                      <p className={`text-lg font-bold ${row.absences > 0 ? 'text-red-500' : 'text-gray-900'}`}>{row.absences}</p>
                      <p className="text-[11px] text-gray-400">Absences</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                      <p className="text-lg font-bold text-green-600">R{Math.round(row.grossPay).toLocaleString()}</p>
                      <p className="text-[11px] text-gray-400">Gross pay</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Override pay rate (R/{row.employee.pay_type === 'per_shift' ? 'shift' : row.employee.pay_type === 'per_hour' ? 'hr' : 'month'})
                      </label>
                      <input
                        type="number"
                        value={payRateEdits[row.employee.id] ?? row.employee.pay_rate}
                        onChange={e => setPayRateEdits(p => ({ ...p, [row.employee.id]: parseFloat(e.target.value) || 0 }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Adjustment (R), bonus or deduction</label>
                      <input
                        type="number"
                        value={adjustments[row.employee.id] ?? 0}
                        onChange={e => setAdjustments(p => ({ ...p, [row.employee.id]: parseFloat(e.target.value) || 0 }))}
                        placeholder="e.g. 500 or -200"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-sm font-semibold text-gray-700">Total for {row.employee.name.split(' ')[0]}</p>
                    <p className="text-lg font-bold text-gray-900">R{Math.round(row.grossPay + (adjustments[row.employee.id] ?? 0)).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Footer total */}
        <div className="border-t-2 border-gray-200 px-4 py-4 flex items-center justify-between bg-gray-50">
          <p className="text-sm font-bold text-gray-900">Total payroll, {periodLabel}</p>
          <p className="text-xl font-bold text-gray-900">R{Math.round(totalGross).toLocaleString()}</p>
        </div>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowSettings(false)}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Payroll Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Month end day (pay period closes on this date)</label>
                <select value={tempMonthEnd} onChange={e => setTempMonthEnd(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of each month</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-400">
                Period will run from the {tempMonthEnd + 1}{tempMonthEnd + 1 === 1 ? 'st' : tempMonthEnd + 1 === 2 ? 'nd' : 'th'} of the previous month to the {tempMonthEnd}{tempMonthEnd === 1 ? 'st' : tempMonthEnd === 2 ? 'nd' : tempMonthEnd === 3 ? 'rd' : 'th'} of the current month.
              </p>
              <button onClick={() => { setMonthEndDay(tempMonthEnd); setShowSettings(false) }}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                Save settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
