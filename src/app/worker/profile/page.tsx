'use client'

import { useState } from 'react'
import { MOCK_WORKER_PROFILE, MOCK_EXPERIENCES, WorkerExperience } from '@/lib/mock-worker'

const ROLE_OPTIONS = [
  { key: 'waiter', label: 'Waiter / Waitress' },
  { key: 'barista', label: 'Barista' },
  { key: 'bartender', label: 'Bartender' },
  { key: 'chef', label: 'Chef / Cook' },
  { key: 'manager', label: 'Manager / Supervisor' },
  { key: 'host', label: 'Host / Hostess' },
  { key: 'other', label: 'Other' },
]

const AVAILABILITY_OPTIONS = [
  'Available immediately',
  'Available in 1 week',
  'Available in 2 weeks',
  'Available in 1 month',
  'Not currently looking',
]

const SKILL_OPTIONS = [
  'Fine dining', 'Wine service', 'Cocktail mixing', 'Cash handling', 'POS systems',
  'Upselling', 'Team leadership', 'Training staff', 'Allergen knowledge', 'Banqueting',
  'Coffee art', 'Flair bartending', 'Stock management', 'Menu design', 'HACCP',
]

const LANGUAGE_OPTIONS = ['English', 'Afrikaans', 'Xhosa', 'Zulu', 'Sotho', 'Tswana', 'Venda', 'Portuguese', 'French']

const CERT_OPTIONS = ['WSET Level 1', 'WSET Level 2', 'WSET Level 3', 'Food Handlers Certificate', 'RASA Member', 'Flair Certificate', 'First Aid', 'Responsible Service of Alcohol']

const input = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-400'

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
        {label}{required && <span className="text-emerald-600 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}

function ExperienceCard({ exp, onDelete }: { exp: WorkerExperience; onDelete: () => void }) {
  const fromYear = exp.from.split('-')[0]
  const fromMonth = exp.from.split('-')[1]
  const toLabel = exp.current ? 'Present' : (exp.to ? `${exp.to.split('-')[1]}/${exp.to.split('-')[0]}` : '')

  return (
    <div className="border border-gray-100 rounded-xl p-4 flex gap-3">
      <div className="w-2 shrink-0 mt-1">
        <div className={`w-2 h-2 rounded-full ${exp.current ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{exp.role}</p>
        <p className="text-sm text-gray-600">{exp.employer}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {fromMonth}/{fromYear} - {toLabel}
          {exp.current && <span className="ml-1.5 text-emerald-600 font-semibold">Current</span>}
        </p>
        {exp.description && (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{exp.description}</p>
        )}
      </div>
      <button onClick={onDelete}
        className="text-gray-300 hover:text-red-400 transition p-1 shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState(MOCK_WORKER_PROFILE)
  const [experiences, setExperiences] = useState<WorkerExperience[]>(MOCK_EXPERIENCES)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [addingExp, setAddingExp] = useState(false)
  const [newExp, setNewExp] = useState<Partial<WorkerExperience>>({ current: true })

  function set(key: string, val: string | boolean | string[]) {
    setProfile(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  function toggleSkill(s: string) {
    set('skills', profile.skills.includes(s) ? profile.skills.filter(x => x !== s) : [...profile.skills, s])
  }

  function toggleLanguage(l: string) {
    set('languages', profile.languages.includes(l) ? profile.languages.filter(x => x !== l) : [...profile.languages, l])
  }

  function toggleCert(c: string) {
    set('certifications', profile.certifications.includes(c) ? profile.certifications.filter(x => x !== c) : [...profile.certifications, c])
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function addExperience() {
    if (!newExp.employer || !newExp.role || !newExp.from) return
    const exp: WorkerExperience = {
      id: `exp-${Date.now()}`,
      employer: newExp.employer!,
      role: newExp.role!,
      from: newExp.from!,
      to: newExp.current ? null : (newExp.to ?? null),
      current: newExp.current ?? false,
      description: newExp.description ?? '',
    }
    setExperiences(prev => [exp, ...prev])
    setNewExp({ current: true })
    setAddingExp(false)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visible to employers searching for candidates</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Open to work</span>
          <button onClick={() => set('open_to_work', !profile.open_to_work)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
              profile.open_to_work ? 'bg-emerald-500' : 'bg-gray-300'
            }`}>
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
              profile.open_to_work ? 'translate-x-4.5' : 'translate-x-0.5'
            }`} style={{ transform: profile.open_to_work ? 'translateX(18px)' : 'translateX(2px)' }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['edit', 'preview'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition capitalize ${
              activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'preview' ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 h-20 relative">
            <div className="absolute -bottom-8 left-5 w-16 h-16 bg-white rounded-xl border-2 border-white shadow flex items-center justify-center text-2xl font-bold text-emerald-700">
              {profile.name.charAt(0)}
            </div>
          </div>
          <div className="px-5 pt-12 pb-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                {profile.open_to_work && (
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Open to work</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5 capitalize">
                {ROLE_OPTIONS.find(r => r.key === profile.role_category)?.label ?? profile.role_category}
                {profile.location && ` · ${profile.location}`}
              </p>
              {profile.experience_years && (
                <p className="text-sm text-gray-400 mt-0.5">{profile.experience_years} years experience</p>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
            )}

            {profile.skills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(s => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {profile.languages.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map(l => (
                    <span key={l} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{l}</span>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map(c => (
                    <span key={c} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {experiences.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Experience</p>
                <div className="space-y-3">
                  {experiences.map(exp => (
                    <div key={exp.id} className="flex gap-3">
                      <div className="w-1 shrink-0 bg-gray-100 rounded-full mt-1" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{exp.role}</p>
                        <p className="text-sm text-gray-600">{exp.employer}</p>
                        <p className="text-xs text-gray-400">
                          {exp.from.split('-').reverse().slice(1).join('/')} -{' '}
                          {exp.current ? 'Present' : exp.to?.split('-').reverse().slice(1).join('/') ?? ''}
                        </p>
                        {exp.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Basic info */}
          <Section title="Basic Information">
            <Field label="Full name" required>
              <input value={profile.name} onChange={e => set('name', e.target.value)}
                className={input} placeholder="Your full name" />
            </Field>
            <Field label="Phone number">
              <input value={profile.phone} onChange={e => set('phone', e.target.value)}
                className={input} placeholder="+27 8X XXX XXXX" />
            </Field>
            <Field label="Location">
              <input value={profile.location} onChange={e => set('location', e.target.value)}
                className={input} placeholder="e.g. Cape Town, Mitchells Plain" />
            </Field>
            <Field label="Years of experience">
              <input type="number" min={0} max={50}
                value={profile.experience_years}
                onChange={e => set('experience_years', e.target.value)}
                className={input} />
            </Field>
            <Field label="Availability">
              <select value={profile.availability} onChange={e => set('availability', e.target.value)}
                className={input + ' bg-white'}>
                {AVAILABILITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </Section>

          {/* Role */}
          <Section title="Role">
            <Field label="I am a..." required>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map(r => (
                  <button key={r.key} type="button" onClick={() => set('role_category', r.key)}
                    className={`text-sm px-3 py-2.5 rounded-lg border text-left transition ${
                      profile.role_category === r.key
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          {/* Bio */}
          <Section title="About Me">
            <Field label="Bio" hint="Shown to employers — describe your experience and what makes you stand out">
              <textarea value={profile.bio} onChange={e => set('bio', e.target.value)}
                rows={5} className={input + ' resize-none'}
                placeholder="Describe your hospitality background, strengths, and what you're looking for..." />
            </Field>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <Field label="Select all that apply">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {SKILL_OPTIONS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)}
                    className={`text-xs px-3 py-2 rounded-lg border text-left transition ${
                      profile.skills.includes(s)
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          {/* Languages */}
          <Section title="Languages">
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map(l => (
                <button key={l} type="button" onClick={() => toggleLanguage(l)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                    profile.languages.includes(l)
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </Section>

          {/* Certifications */}
          <Section title="Certifications">
            <div className="flex flex-wrap gap-2">
              {CERT_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => toggleCert(c)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                    profile.certifications.includes(c)
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </Section>

          {/* Experience */}
          <Section title="Work Experience">
            <div className="space-y-3">
              {experiences.map(exp => (
                <ExperienceCard key={exp.id} exp={exp}
                  onDelete={() => setExperiences(prev => prev.filter(e => e.id !== exp.id))} />
              ))}
            </div>

            {addingExp ? (
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-3 mt-3">
                <p className="text-sm font-semibold text-gray-800">Add experience</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Employer *</label>
                    <input value={newExp.employer ?? ''} onChange={e => setNewExp(p => ({ ...p, employer: e.target.value }))}
                      placeholder="e.g. Shortmarket Club"
                      className={input} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Role *</label>
                    <input value={newExp.role ?? ''} onChange={e => setNewExp(p => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. Senior Waiter"
                      className={input} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">From (YYYY-MM) *</label>
                    <input value={newExp.from ?? ''} onChange={e => setNewExp(p => ({ ...p, from: e.target.value }))}
                      placeholder="2022-03"
                      className={input} />
                  </div>
                  {!newExp.current && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">To (YYYY-MM)</label>
                      <input value={newExp.to ?? ''} onChange={e => setNewExp(p => ({ ...p, to: e.target.value }))}
                        placeholder="2024-01"
                        className={input} />
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newExp.current ?? false}
                    onChange={e => setNewExp(p => ({ ...p, current: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-400" />
                  <span className="text-sm text-gray-700">I currently work here</span>
                </label>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={newExp.description ?? ''} onChange={e => setNewExp(p => ({ ...p, description: e.target.value }))}
                    rows={2} className={input + ' resize-none'}
                    placeholder="Briefly describe your role and responsibilities..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={addExperience}
                    disabled={!newExp.employer || !newExp.role || !newExp.from}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
                    Add
                  </button>
                  <button onClick={() => { setAddingExp(false); setNewExp({ current: true }) }}
                    className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingExp(true)}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-emerald-300 hover:text-emerald-600 transition flex items-center justify-center gap-2 mt-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add experience
              </button>
            )}
          </Section>

          {/* Save */}
          <div className="flex items-center gap-3 pb-6">
            <button onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
              Save profile
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
