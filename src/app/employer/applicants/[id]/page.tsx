'use client'

import { useState, use } from 'react'
import { MOCK_APPLICANTS, MOCK_INTERVIEWS, PIPELINE_STAGES, PipelineStage } from '@/lib/mock-recruitment'

const STAGE_ORDER: PipelineStage[] = ['new','reviewed','shortlisted','interview','offered','hired','rejected']

function StarPicker({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}>
          <svg className={`w-5 h-5 transition ${i <= (hover || value || 0) ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const initial = MOCK_APPLICANTS.find(a => a.id === id)

  const [applicant, setApplicant] = useState(initial ?? null)
  const [note, setNote] = useState(initial?.notes ?? '')
  const [notesSaved, setNotesSaved] = useState(false)
  const [showBookInterview, setShowBookInterview] = useState(false)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('10:00')
  const [interviewType, setInterviewType] = useState<'in-person' | 'phone' | 'video'>('in-person')
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS.filter(i => i.applicant_id === id))

  if (!applicant) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="font-medium">Applicant not found</p>
        <a href="/employer/applicants" className="text-emerald-600 text-sm mt-2 inline-block">Back to applicants</a>
      </div>
    )
  }

  function setStage(stage: PipelineStage) {
    setApplicant(prev => prev ? { ...prev, stage } : prev)
  }

  function saveNotes() {
    setApplicant(prev => prev ? { ...prev, notes: note } : prev)
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  function toggleSaved() {
    setApplicant(prev => prev ? { ...prev, saved: !prev.saved } : prev)
  }

  function bookInterview() {
    if (!interviewDate || !applicant) return
    setInterviews(prev => [...prev, {
      id: `int-new-${Date.now()}`,
      applicant_id: applicant.id,
      applicant_name: applicant.name,
      job_title: applicant.job_title,
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      notes: '',
      outcome: 'pending',
    }])
    setStage('interview')
    setShowBookInterview(false)
    setInterviewDate('')
  }

  const stageInfo = PIPELINE_STAGES.find(s => s.key === applicant.stage)
  const currentIdx = STAGE_ORDER.indexOf(applicant.stage)

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Back */}
      <a href="/employer/applicants" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to applicants
      </a>

      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-full ${applicant.avatar_color} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
            {applicant.avatar_initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{applicant.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{applicant.job_title}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleSaved}
                  className={`p-2 rounded-lg border transition ${applicant.saved ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}>
                  <svg className="w-4 h-4" fill={applicant.saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                </button>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${stageInfo?.color}`}>
                  {stageInfo?.label}
                </span>
              </div>
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-2 mt-3">
              <StarPicker value={applicant.rating} onChange={v => setApplicant(p => p ? { ...p, rating: v } : p)} />
              {applicant.rating && <span className="text-xs text-gray-500">{applicant.rating}/5</span>}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
          <ContactItem icon="📧" label="Email" value={applicant.email} href={`mailto:${applicant.email}`} />
          <ContactItem icon="📞" label="Phone" value={applicant.phone} href={`tel:${applicant.phone}`} />
          <ContactItem icon="📍" label="Location" value={applicant.location} />
          <ContactItem icon="⏱️" label="Experience" value={`${applicant.experience_years} years`} />
          <ContactItem icon="🗓️" label="Availability" value={applicant.availability} />
          <ContactItem icon="🌐" label="Languages" value={applicant.languages.join(', ')} />
        </div>
      </div>

      {/* Pipeline progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Move Through Pipeline</h2>
        <div className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
          {STAGE_ORDER.filter(s => s !== 'rejected').map((s, idx) => {
            const info = PIPELINE_STAGES.find(p => p.key === s)!
            const isPast = idx < currentIdx && applicant.stage !== 'rejected'
            const isCurrent = s === applicant.stage
            return (
              <button key={s} onClick={() => setStage(s)}
                className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border transition whitespace-nowrap ${
                  isCurrent ? info.color + ' border-transparent' :
                  isPast ? 'bg-emerald-50 text-emerald-600 border-transparent opacity-60' :
                  'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}>
                {isCurrent && <span className="mr-1">&#10003;</span>}
                {info.label}
              </button>
            )
          })}
          <button onClick={() => setStage('rejected')}
            className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border transition ${
              applicant.stage === 'rejected'
                ? 'bg-red-50 text-red-600 border-transparent'
                : 'bg-white text-red-400 border-gray-200 hover:border-red-200 hover:text-red-500'
            }`}>
            Reject
          </button>
        </div>

        {/* Book interview shortcut */}
        {applicant.stage !== 'hired' && applicant.stage !== 'rejected' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {!showBookInterview ? (
              <button onClick={() => setShowBookInterview(true)}
                className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Book an interview
              </button>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  <input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  <select value={interviewType} onChange={e => setInterviewType(e.target.value as typeof interviewType)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
                    <option value="in-person">In person</option>
                    <option value="phone">Phone call</option>
                    <option value="video">Video call</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={bookInterview}
                    className="text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition">
                    Confirm booking
                  </button>
                  <button onClick={() => setShowBookInterview(false)}
                    className="text-sm font-medium text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Past interviews */}
        {interviews.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            {interviews.map(i => (
              <div key={i.id} className="flex items-center gap-3 text-sm">
                <span className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </span>
                <span className="text-gray-700 font-medium">{new Date(i.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} at {i.time}</span>
                <span className="text-gray-400 capitalize">{i.type}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                  i.outcome === 'pending' ? 'bg-blue-50 text-blue-600' :
                  i.outcome === 'offered' ? 'bg-emerald-50 text-emerald-600' :
                  i.outcome === 'rejected' ? 'bg-red-50 text-red-500' :
                  'bg-gray-100 text-gray-500'
                }`}>{i.outcome}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience & Skills */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Experience & Skills</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{applicant.experience_summary}</p>
        <div className="flex flex-wrap gap-2">
          {applicant.skills.map(s => (
            <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Private Notes</h2>
          {notesSaved && <span className="text-xs text-emerald-600 font-medium">Saved!</span>}
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={4}
          placeholder="Add notes about this candidate — only visible to you..."
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none placeholder:text-gray-400"
        />
        <div className="flex justify-end mt-2">
          <button onClick={saveNotes}
            className="text-sm font-semibold bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
            Save notes
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap pb-6">
        <a href={`mailto:${applicant.email}`}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Send email
        </a>
        <a href={`tel:${applicant.phone}`}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          Call
        </a>
        {applicant.stage !== 'hired' && (
          <button onClick={() => setStage('hired')}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
            Mark as Hired
          </button>
        )}
      </div>
    </div>
  )
}

function ContactItem({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  const content = (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
    </div>
  )
  return href ? (
    <a href={href} className="flex items-start gap-2 hover:opacity-80 transition">
      <span className="text-base leading-none mt-0.5">{icon}</span>
      {content}
    </a>
  ) : (
    <div className="flex items-start gap-2">
      <span className="text-base leading-none mt-0.5">{icon}</span>
      {content}
    </div>
  )
}
