'use client'

import { useState } from 'react'
import { MOCK_DOCUMENTS, WorkerDocument } from '@/lib/mock-worker'

const TYPE_LABELS: Record<WorkerDocument['type'], string> = {
  cv: 'CV / Resume',
  reference: 'Reference Letter',
  certificate: 'Certificate',
  id: 'ID Document',
  other: 'Other',
}

const TYPE_COLORS: Record<WorkerDocument['type'], string> = {
  cv: 'bg-gray-100 text-gray-800',
  reference: 'bg-blue-50 text-blue-700',
  certificate: 'bg-amber-50 text-amber-700',
  id: 'bg-purple-50 text-purple-700',
  other: 'bg-gray-100 text-gray-600',
}

const TYPE_ICON: Record<WorkerDocument['type'], React.ReactNode> = {
  cv: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  reference: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  certificate: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  id: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c0 1.306.835 2.417 2 2.83M9 14a3.001 3.001 0 00-2.83 2M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 20h2a2 2 0 002-2v-1" />
    </svg>
  ),
  other: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
}

function fmtSize(kb: number) {
  if (kb >= 1000) return `${(kb / 1000).toFixed(1)} MB`
  return `${kb} KB`
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<WorkerDocument[]>(MOCK_DOCUMENTS)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<WorkerDocument['type']>('cv')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  function simulateUpload() {
    if (!newName.trim()) return
    setUploading(true)
    setTimeout(() => {
      const doc: WorkerDocument = {
        id: `doc-${Date.now()}`,
        name: newName.trim(),
        type: newType,
        file_name: `${newName.trim().replace(/\s+/g, '_')}.pdf`,
        size_kb: Math.floor(100 + Math.random() * 400),
        uploaded_at: new Date().toISOString(),
        used_in: 0,
      }
      setDocs(prev => [doc, ...prev])
      setNewName('')
      setNewType('cv')
      setUploading(false)
      setShowUpload(false)
    }, 1200)
  }

  function deleteDoc(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id))
    setDeleteConfirm(null)
  }

  const cvDoc = docs.find(d => d.type === 'cv')

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your CV, references, and certificates</p>
        </div>
        <button onClick={() => setShowUpload(o => !o)}
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition shrink-0 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload
        </button>
      </div>

      {/* CV callout */}
      {!cvDoc && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-amber-800 text-sm">No CV uploaded</p>
            <p className="text-sm text-amber-700 mt-0.5">Upload your CV to apply to jobs faster and let employers find you.</p>
          </div>
        </div>
      )}

      {/* Upload form */}
      {showUpload && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Upload document</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Document name <span className="text-gray-900">*</span></label>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="e.g. My CV, Reference from The Test Kitchen"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Document type</label>
            <select value={newType} onChange={e => setNewType(e.target.value as WorkerDocument['type'])}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white">
              {(Object.keys(TYPE_LABELS) as WorkerDocument['type'][]).map(t => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 hover:border-gray-300 transition cursor-pointer"
            onClick={simulateUpload}>
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 text-gray-700 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Uploading...</p>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm font-medium">Click to upload PDF</p>
                <p className="text-xs mt-1">Max 5 MB</p>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={simulateUpload} disabled={!newName.trim() || uploading}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button onClick={() => setShowUpload(false)}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Document list */}
      {docs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No documents uploaded</p>
          <p className="text-sm mt-1">Upload your CV to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map(doc => (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[doc.type]}`}>
                {TYPE_ICON[doc.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{doc.name}</p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[doc.type]}`}>
                    {TYPE_LABELS[doc.type]}
                  </span>
                  <span className="text-[11px] text-gray-400">{doc.file_name}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{fmtSize(doc.size_kb)}</span>
                  <span>·</span>
                  <span>Uploaded {fmt(doc.uploaded_at)}</span>
                  {doc.used_in > 0 && (
                    <>
                      <span>·</span>
                      <span>Used in {doc.used_in} {doc.used_in === 1 ? 'application' : 'applications'}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                  title="Download">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                {deleteConfirm === doc.id ? (
                  <div className="flex items-center gap-1.5 ml-1">
                    <button onClick={() => deleteDoc(doc.id)}
                      className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="text-xs text-gray-400 hover:underline">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(doc.id)}
                    title="Delete"
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 items-start">
        <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          Your documents are shared with employers when you apply. Make sure your CV is up to date.
          We accept PDF files only, up to 5 MB each.
        </p>
      </div>
    </div>
  )
}
