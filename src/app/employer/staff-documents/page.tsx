'use client'

import { useState } from 'react'
import { STAFF_DOCUMENTS, MOCK_EMPLOYEES, type StaffDocument } from '@/lib/mock-recruitment'
import { Icon } from '@/components/Icon'

const TYPE_LABELS: Record<StaffDocument['type'], string> = {
  contract:      'Employment Contract',
  id_copy:       'ID Copy',
  health_cert:   'Health Certificate',
  liquor_licence: 'Liquor Licence',
  tax_form:      'Tax Form',
  other:         'Other',
}
const TYPE_ICONS: Record<StaffDocument['type'], string> = {
  contract: 'document', id_copy: 'id-card', health_cert: 'health', liquor_licence: 'document', tax_form: 'money', other: 'paperclip',
}
const STATUS_STYLES: Record<StaffDocument['status'], string> = {
  valid:          'bg-green-50 text-green-700 border-green-100',
  expiring_soon:  'bg-amber-50 text-amber-700 border-amber-100',
  expired:        'bg-red-50 text-red-600 border-red-100',
  missing:        'bg-gray-100 text-gray-500 border-gray-200',
}
const STATUS_LABELS: Record<StaffDocument['status'], string> = {
  valid: 'Valid', expiring_soon: 'Expiring soon', expired: 'Expired', missing: 'Missing',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}
function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
}

export default function StaffDocumentsPage() {
  const employees = MOCK_EMPLOYEES.filter(e => e.status !== 'terminated')
  const [documents, setDocuments] = useState<StaffDocument[]>(STAFF_DOCUMENTS)
  const [filterEmp, setFilterEmp] = useState('all')
  const [filterStatus, setFilterStatus] = useState<'all' | StaffDocument['status']>('all')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadEmpId, setUploadEmpId] = useState('')
  const [uploadType, setUploadType] = useState<StaffDocument['type']>('contract')
  const [uploadName, setUploadName] = useState('')
  const [uploadExpiry, setUploadExpiry] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  function empById(id: string) { return employees.find(e => e.id === id) }

  const filtered = documents.filter(d => {
    const empMatch = filterEmp === 'all' || d.employee_id === filterEmp
    const statusMatch = filterStatus === 'all' || d.status === filterStatus
    return empMatch && statusMatch
  })

  const expiring = documents.filter(d => d.status === 'expiring_soon').length
  const expired = documents.filter(d => d.status === 'expired').length
  const total = documents.length

  function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!uploadEmpId || !uploadName) return
    const emp = empById(uploadEmpId)!
    const doc: StaffDocument = {
      id: `doc-${Date.now()}`,
      employee_id: uploadEmpId,
      type: uploadType,
      name: uploadName || `${TYPE_LABELS[uploadType]} — ${emp.name}`,
      uploaded_at: new Date().toISOString().split('T')[0],
      expiry_date: uploadExpiry || undefined,
      status: uploadExpiry
        ? daysUntil(uploadExpiry) < 0 ? 'expired'
          : daysUntil(uploadExpiry) < 30 ? 'expiring_soon'
          : 'valid'
        : 'valid',
      file_size: 'just uploaded',
    }
    setDocuments(prev => [...prev, doc])
    setUploadSuccess(true)
    setTimeout(() => { setShowUpload(false); setUploadSuccess(false); setUploadName(''); setUploadExpiry(''); setUploadEmpId('') }, 1500)
  }

  // Group by employee for the overview
  const empDocMap = employees.map(emp => {
    const empDocs = documents.filter(d => d.employee_id === emp.id)
    const hasExpired = empDocs.some(d => d.status === 'expired')
    const hasExpiring = empDocs.some(d => d.status === 'expiring_soon')
    return { emp, docs: empDocs, hasExpired, hasExpiring }
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} documents · {expired} expired · {expiring} expiring soon</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Upload Document
        </button>
      </div>

      {/* Alerts */}
      {(expired > 0 || expiring > 0) && (
        <div className="space-y-2">
          {expired > 0 && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <Icon name="warning" className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">{expired} document{expired !== 1 ? 's' : ''} expired</p>
                <p className="text-xs text-red-600">
                  {documents.filter(d => d.status === 'expired').map(d => {
                    const emp = empById(d.employee_id)
                    return `${emp?.name} — ${TYPE_LABELS[d.type]}`
                  }).join(', ')}
                </p>
              </div>
            </div>
          )}
          {expiring > 0 && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <span className="text-amber-500 mt-0.5">⏰</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">{expiring} document{expiring !== 1 ? 's' : ''} expiring soon</p>
                <p className="text-xs text-amber-700">
                  {documents.filter(d => d.status === 'expiring_soon').map(d => {
                    const emp = empById(d.employee_id)
                    const days = d.expiry_date ? daysUntil(d.expiry_date) : 0
                    return `${emp?.name} — ${TYPE_LABELS[d.type]} (${days}d)`
                  }).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employee overview cards */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Document status by employee</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {empDocMap.map(({ emp, docs, hasExpired, hasExpiring }) => (
            <button key={emp.id} onClick={() => setFilterEmp(emp.id === filterEmp ? 'all' : emp.id)}
              className={`flex items-center gap-3 bg-white border rounded-xl px-3 py-3 text-left hover:border-gray-300 transition ${
                filterEmp === emp.id ? 'border-gray-900 shadow-sm' : 'border-gray-200'
              }`}>
              <div className="relative shrink-0">
                <div className={`w-9 h-9 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-xs font-bold`}>
                  {emp.avatar_initials}
                </div>
                {(hasExpired || hasExpiring) && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${hasExpired ? 'bg-red-500' : 'bg-amber-400'}`}/>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{emp.name.split(' ')[0]}</p>
                <p className="text-[11px] text-gray-400">{docs.length} doc{docs.length !== 1 ? 's' : ''}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterEmp !== 'all' && (
          <button onClick={() => setFilterEmp('all')}
            className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {empById(filterEmp)?.name}
          </button>
        )}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['all', 'valid', 'expiring_soon', 'expired'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition ${
                filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {s === 'all' ? 'All' : s === 'expiring_soon' ? 'Expiring' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">No documents found</p>
          </div>
        )}
        {filtered.map(doc => {
          const emp = empById(doc.employee_id)
          if (!emp) return null
          const daysLeft = doc.expiry_date ? daysUntil(doc.expiry_date) : null
          return (
            <div key={doc.id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:border-gray-300 transition">
              <Icon name={TYPE_ICONS[doc.type]} className="w-6 h-6 shrink-0 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <div className={`w-6 h-6 rounded-full ${emp.avatar_color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                    {emp.avatar_initials}
                  </div>
                  <p className="text-xs text-gray-500">{emp.name} · Uploaded {formatDate(doc.uploaded_at)}</p>
                  {doc.file_size && <p className="text-[11px] text-gray-400">{doc.file_size}</p>}
                </div>
                {doc.expiry_date && (
                  <p className={`text-xs mt-0.5 ${daysLeft !== null && daysLeft < 0 ? 'text-red-600 font-semibold' : daysLeft !== null && daysLeft < 30 ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
                    {daysLeft !== null && daysLeft < 0
                      ? `Expired ${Math.abs(daysLeft)}d ago`
                      : daysLeft !== null && daysLeft < 30
                      ? `Expires in ${daysLeft} days`
                      : `Expires ${formatDate(doc.expiry_date)}`}
                  </p>
                )}
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLES[doc.status]}`}>
                {STATUS_LABELS[doc.status]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowUpload(false)}/>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            {uploadSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Document uploaded</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="p-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Employee *</label>
                  <select value={uploadEmpId} onChange={e => setUploadEmpId(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">Select employee</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Document type</label>
                  <select value={uploadType} onChange={e => setUploadType(e.target.value as StaffDocument['type'])}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Document name *</label>
                  <input value={uploadName} onChange={e => setUploadName(e.target.value)} required
                    placeholder="e.g. Health Certificate 2024"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry date (optional)</label>
                  <input type="date" value={uploadExpiry} onChange={e => setUploadExpiry(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 text-center">
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold text-gray-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10 MB</p>
                </div>
                <button type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                  Upload document
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
