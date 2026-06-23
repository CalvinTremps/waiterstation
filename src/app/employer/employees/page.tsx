'use client'

import { useState } from 'react'
import { MOCK_EMPLOYEES, type Employee } from '@/lib/mock-recruitment'

const STATUS_STYLES: Record<Employee['status'], string> = {
  active:     'bg-green-50 text-green-700',
  on_leave:   'bg-amber-50 text-amber-700',
  terminated: 'bg-red-50 text-red-600',
}
const STATUS_LABELS: Record<Employee['status'], string> = {
  active: 'Active', on_leave: 'On Leave', terminated: 'Terminated',
}
const PAY_LABEL: Record<Employee['pay_type'], string> = {
  per_hour: '/hr', per_shift: '/shift', monthly: '/month',
}

const COLORS = ['bg-purple-500','bg-blue-500','bg-amber-500','bg-green-500','bg-rose-500','bg-teal-500','bg-indigo-500','bg-orange-500']

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Employee['status']>('all')
  const [showInvite, setShowInvite] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Invite form state
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePhone, setInvitePhone] = useState('')
  const [inviteRole, setInviteRole] = useState('')
  const [invitePayType, setInvitePayType] = useState<Employee['pay_type']>('per_shift')
  const [invitePayRate, setInvitePayRate] = useState('')
  const [inviteSending, setInviteSending] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteName || !inviteEmail || !inviteRole) return
    setInviteSending(true)
    try {
      await fetch('/api/employer/invite-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, role: inviteRole }),
      })
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        phone: invitePhone,
        role: inviteRole,
        role_category: 'waiter',
        start_date: new Date().toISOString().split('T')[0],
        status: 'active',
        pay_type: invitePayType,
        pay_rate: parseFloat(invitePayRate) || 0,
        avatar_color: COLORS[employees.length % COLORS.length],
        avatar_initials: initials(inviteName),
        source: 'external',
        invite_status: 'pending',
      }
      setEmployees(prev => [...prev, newEmp])
      setInviteSent(true)
    } finally {
      setInviteSending(false)
    }
  }

  function resetInvite() {
    setInviteName(''); setInviteEmail(''); setInvitePhone('')
    setInviteRole(''); setInvitePayRate(''); setInvitePayType('per_shift')
    setInviteSent(false); setShowInvite(false)
  }

  const active = employees.filter(e => e.status === 'active').length
  const onLeave = employees.filter(e => e.status === 'on_leave').length
  const pending = employees.filter(e => e.invite_status === 'pending').length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-0.5">{employees.length} staff members · {active} active</p>
        </div>
        <button onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{active}</p>
          <p className="text-xs text-gray-500 mt-0.5">Active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{onLeave}</p>
          <p className="text-xs text-gray-500 mt-0.5">On Leave</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{pending}</p>
          <p className="text-xs text-gray-500 mt-0.5">Invite Pending</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or role…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"/>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['all', 'active', 'on_leave', 'terminated'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition capitalize ${
                statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {s === 'all' ? 'All' : s === 'on_leave' ? 'On Leave' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Employee list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400 font-medium">No employees found</p>
          </div>
        )}
        {filtered.map(emp => (
          <button key={emp.id} onClick={() => setSelectedEmployee(emp)}
            className="w-full flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:border-gray-300 hover:shadow-sm transition text-left">
            <div className={`w-10 h-10 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
              {emp.avatar_initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                {emp.invite_status === 'pending' && (
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full">Invite pending</span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{emp.role} · Since {formatDate(emp.start_date)}</p>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[emp.status]}`}>
                {STATUS_LABELS[emp.status]}
              </span>
              <p className="text-xs text-gray-400">R{emp.pay_rate.toLocaleString()}{PAY_LABEL[emp.pay_type]}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Employee detail drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedEmployee(null)}/>
          <div className="relative ml-auto w-full max-w-sm bg-white h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Employee Profile</h2>
              <button onClick={() => setSelectedEmployee(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${selectedEmployee.avatar_color} flex items-center justify-center text-white text-lg font-bold`}>
                  {selectedEmployee.avatar_initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.role}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_STYLES[selectedEmployee.status]}`}>
                    {STATUS_LABELS[selectedEmployee.status]}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Email', value: selectedEmployee.email },
                  { label: 'Phone', value: selectedEmployee.phone },
                  { label: 'Start date', value: formatDate(selectedEmployee.start_date) },
                  { label: 'Source', value: selectedEmployee.source === 'waiterstation' ? 'WaiterStation hire' : 'External hire' },
                  { label: 'Pay', value: `R${selectedEmployee.pay_rate.toLocaleString()}${PAY_LABEL[selectedEmployee.pay_type]}` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <p className="text-xs text-gray-400">{row.label}</p>
                    <p className="text-xs font-medium text-gray-900 text-right">{row.value}</p>
                  </div>
                ))}
              </div>
              {selectedEmployee.invite_status === 'pending' && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-800">Invite pending</p>
                  <p className="text-xs text-blue-600 mt-0.5">Employee has been invited but has not yet completed their profile setup.</p>
                </div>
              )}
              <div className="flex flex-col gap-2 pt-2">
                <a href={`/employer/shifts?employee=${selectedEmployee.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition">
                  View Shifts
                </a>
                <a href={`/employer/payroll?employee=${selectedEmployee.id}`}
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition">
                  View Payroll
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={resetInvite}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Add Employee</h2>
                <p className="text-xs text-gray-500 mt-0.5">They will receive an email to complete their profile</p>
              </div>
              <button onClick={resetInvite} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {inviteSent ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Invite sent to {inviteEmail}</p>
                <p className="text-sm text-gray-500">{inviteName} will receive an email with a link to complete their profile on WaiterStation.</p>
                <button onClick={resetInvite}
                  className="mt-2 w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full name *</label>
                    <input value={inviteName} onChange={e => setInviteName(e.target.value)} required
                      placeholder="e.g. Zanele Mokoena"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email address *</label>
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required
                      placeholder="zanele@email.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone number</label>
                    <input value={invitePhone} onChange={e => setInvitePhone(e.target.value)}
                      placeholder="071 234 5678"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Position *</label>
                    <input value={inviteRole} onChange={e => setInviteRole(e.target.value)} required
                      placeholder="e.g. Waiter, Bartender, Hostess"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pay type</label>
                    <select value={invitePayType} onChange={e => setInvitePayType(e.target.value as Employee['pay_type'])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                      <option value="per_shift">Per shift</option>
                      <option value="per_hour">Per hour</option>
                      <option value="monthly">Monthly salary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pay rate (R)</label>
                    <input type="number" value={invitePayRate} onChange={e => setInvitePayRate(e.target.value)}
                      placeholder="e.g. 300"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                  </div>
                </div>
                <button type="submit" disabled={inviteSending}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60">
                  {inviteSending ? 'Sending invite…' : 'Send invite & add employee'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
