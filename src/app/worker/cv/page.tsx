'use client'

import { useState } from 'react'
import { MOCK_WORKER_PROFILE, MOCK_EXPERIENCES } from '@/lib/mock-worker'

type Template = 'classic' | 'modern' | 'hospitality'

const TEMPLATES: { id: Template; label: string; desc: string; accent: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Clean black & white, ATS-friendly', accent: 'border-gray-900' },
  { id: 'modern', label: 'Modern', desc: 'Blue accent, contemporary layout', accent: 'border-blue-600' },
  { id: 'hospitality', label: 'Hospitality', desc: 'Warm tones, refined presentation', accent: 'border-amber-600' },
]

const ROLE_LABELS: Record<string, string> = {
  waiter: 'Waiter / Waitress', chef: 'Chef', kitchen: 'Kitchen Staff',
  housekeeping: 'Housekeeping', front_desk: 'Front Desk', bartender: 'Bartender',
  barista: 'Barista', host: 'Host / Hostess', manager: 'Manager', other: 'Other',
}

function ClassicCV({ profile }: { profile: typeof MOCK_WORKER_PROFILE }) {
  const experiences = MOCK_EXPERIENCES
  return (
    <div className="bg-white text-gray-900 font-['Georgia',serif] text-[13px] leading-relaxed p-8 min-h-[297mm] w-[210mm]">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-5">
        <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
        <p className="text-base mt-1 text-gray-600">
          {ROLE_LABELS[profile.role_category] ?? profile.role_category}
        </p>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
          {profile.phone && <span>{profile.phone}</span>}
          {profile.email && <span>{profile.email}</span>}
          {profile.location && <span>{profile.location}</span>}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Profile</h2>
          <p className="text-gray-800 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Experience</h2>
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{exp.role}</p>
                    <p className="text-gray-600">{exp.employer}</p>
                  </div>
                  <p className="text-gray-500 text-xs shrink-0 ml-4">
                    {exp.from.split('-').reverse().slice(1).join('/')} –{' '}
                    {exp.current ? 'Present' : (exp.to?.split('-').reverse().slice(1).join('/') ?? '')}
                  </p>
                </div>
                {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Skills</h2>
          <p className="text-gray-800">{profile.skills.join(' · ')}</p>
        </div>
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Certifications</h2>
          <p className="text-gray-800">{profile.certifications.join(' · ')}</p>
        </div>
      )}

      {/* Languages */}
      {profile.languages.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Languages</h2>
          <p className="text-gray-800">{profile.languages.join(' · ')}</p>
        </div>
      )}
    </div>
  )
}

function ModernCV({ profile }: { profile: typeof MOCK_WORKER_PROFILE }) {
  const experiences = MOCK_EXPERIENCES
  return (
    <div className="bg-white text-gray-900 font-['Inter',sans-serif] text-[13px] leading-relaxed min-h-[297mm] w-[210mm] flex">
      {/* Left column */}
      <div className="w-44 shrink-0 bg-blue-600 text-white p-6 space-y-6">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
          {profile.name.charAt(0)}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Contact</p>
          <div className="space-y-1 text-xs text-blue-100">
            {profile.phone && <p>{profile.phone}</p>}
            {profile.location && <p>{profile.location}</p>}
          </div>
        </div>
        {profile.skills.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-2">Skills</p>
            <div className="space-y-1">
              {profile.skills.map(s => (
                <p key={s} className="text-xs text-blue-100">{s}</p>
              ))}
            </div>
          </div>
        )}
        {profile.languages.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-2">Languages</p>
            <div className="space-y-1">
              {profile.languages.map(l => (
                <p key={l} className="text-xs text-blue-100">{l}</p>
              ))}
            </div>
          </div>
        )}
        {profile.certifications.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-2">Certifications</p>
            <div className="space-y-1">
              {profile.certifications.map(c => (
                <p key={c} className="text-xs text-blue-100">{c}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column */}
      <div className="flex-1 p-7 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-blue-600 font-semibold text-sm mt-0.5">
            {ROLE_LABELS[profile.role_category] ?? profile.role_category}
          </p>
          {profile.experience_years && (
            <p className="text-gray-500 text-xs mt-0.5">{profile.experience_years} years experience</p>
          )}
        </div>

        {profile.bio && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-2 border-b border-blue-100 pb-1">About</h2>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-3 border-b border-blue-100 pb-1">Experience</h2>
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="flex gap-3">
                  <div className="w-1 bg-blue-100 rounded-full shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{exp.role}</p>
                    <p className="text-gray-500 text-xs">{exp.employer} · {exp.from.slice(0, 7)} – {exp.current ? 'Present' : exp.to?.slice(0, 7) ?? ''}</p>
                    {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HospitalityCV({ profile }: { profile: typeof MOCK_WORKER_PROFILE }) {
  const experiences = MOCK_EXPERIENCES
  return (
    <div className="bg-white text-gray-900 font-['Georgia',serif] text-[13px] leading-relaxed p-8 min-h-[297mm] w-[210mm]">
      {/* Header with warm accent */}
      <div className="border-l-4 border-amber-600 pl-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
        <p className="text-amber-700 font-semibold text-sm mt-1">
          {ROLE_LABELS[profile.role_category] ?? profile.role_category}
        </p>
        <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-gray-500">
          {profile.phone && <span>{profile.phone}</span>}
          {profile.location && <span>{profile.location}</span>}
          {profile.availability && <span>{profile.availability}</span>}
        </div>
      </div>

      {profile.bio && (
        <div className="mb-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
          <p className="text-gray-800 italic leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-amber-700 font-bold text-xs uppercase tracking-widest mb-3">Career History</h2>
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id} className="flex gap-4">
                <div className="text-right w-24 shrink-0 pt-0.5">
                  <p className="text-xs text-gray-400">{exp.from.slice(0, 7)}</p>
                  <p className="text-xs text-gray-400">–</p>
                  <p className="text-xs text-gray-400">{exp.current ? 'Present' : exp.to?.slice(0, 7) ?? ''}</p>
                </div>
                <div className="border-l-2 border-amber-200 pl-4 flex-1">
                  <p className="font-bold text-gray-900">{exp.role}</p>
                  <p className="text-amber-700 text-xs font-semibold">{exp.employer}</p>
                  {exp.description && <p className="text-gray-600 mt-1 text-xs">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {profile.skills.length > 0 && (
          <div>
            <h2 className="text-amber-700 font-bold text-xs uppercase tracking-widest mb-2">Skills</h2>
            <div className="space-y-1">
              {profile.skills.map(s => (
                <p key={s} className="text-xs text-gray-700">· {s}</p>
              ))}
            </div>
          </div>
        )}
        {profile.certifications.length > 0 && (
          <div>
            <h2 className="text-amber-700 font-bold text-xs uppercase tracking-widest mb-2">Certifications</h2>
            <div className="space-y-1">
              {profile.certifications.map(c => (
                <p key={c} className="text-xs text-gray-700">· {c}</p>
              ))}
            </div>
          </div>
        )}
        {profile.languages.length > 0 && (
          <div>
            <h2 className="text-amber-700 font-bold text-xs uppercase tracking-widest mb-2">Languages</h2>
            <div className="space-y-1">
              {profile.languages.map(l => (
                <p key={l} className="text-xs text-gray-700">· {l}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CVBuilderPage() {
  const [template, setTemplate] = useState<Template>('classic')
  const profile = MOCK_WORKER_PROFILE

  function handleDownload() {
    window.print()
  }

  const CVComponent = template === 'classic' ? ClassicCV : template === 'modern' ? ModernCV : HospitalityCV

  return (
    <>
      {/* Print styles, only the CV renders when printing */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #cv-print-root { display: block !important; }
          #cv-print-root * { display: revert !important; }
          @page { margin: 0; size: A4; }
        }
        #cv-print-root { display: none; }
      `}</style>

      {/* Hidden print target */}
      <div id="cv-print-root" aria-hidden="true">
        <CVComponent profile={profile} />
      </div>

      {/* Main UI */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Build Your CV</h1>
            <p className="text-sm text-gray-500 mt-0.5">Choose a template, preview your CV, then download as PDF.</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Template picker */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Choose Template</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`text-left p-4 rounded-xl border-2 transition ${
                  template === t.id ? t.accent + ' bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900 text-sm">{t.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Profile info note */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-blue-700">
            Your CV is built from your profile. To update the content,{' '}
            <a href="/worker/profile" className="font-semibold underline underline-offset-2">edit your profile</a>.
          </p>
        </div>

        {/* CV Preview */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Preview</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[210mm]">
                <CVComponent profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
