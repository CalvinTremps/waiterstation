'use client'

import { useEffect, useState, useCallback } from 'react'

interface Admin {
  id: string
  email: string
  name: string | null
  totp_enabled: boolean
  is_active: boolean
  last_login_at: string | null
}

const FIELD = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [twofa, setTwofa] = useState<{ id: string; secret: string; otpauth: string; qr?: string; code: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setErr('')
    const res = await fetch('/api/admin/admins')
    const json = await res.json().catch(() => ({}))
    if (res.ok) setAdmins(json.admins ?? [])
    else setErr(json.error ?? 'Could not load admins.')
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function act(payload: Record<string, unknown>) {
    const res = await fetch('/api/admin/admins', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) { setErr(json.error ?? 'Action failed.'); return null }
    setErr('')
    return json
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (await act({ action: 'create', email, name, password })) {
      setEmail(''); setName(''); setPassword(''); load()
    }
  }

  async function reset(a: Admin) {
    const pw = prompt(`New password for ${a.email} (8+ characters):`)
    if (pw && await act({ action: 'reset', id: a.id, password: pw })) alert('Password updated.')
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
        <p className="text-sm text-gray-500 mt-1">Manage admin accounts, passwords, and two-factor authentication.</p>
      </div>

      {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{err}</div>}

      {/* Create */}
      <form onSubmit={create} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
          <input className={`${FIELD} w-full`} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
          <input className={`${FIELD} w-full`} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Password (8+)</label>
          <input className={`${FIELD} w-full`} type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Add admin</button>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : admins.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400">
          No admin accounts yet. You logged in with the break-glass password — add your first account above.
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{a.name || a.email}</p>
                  {a.totp_enabled && <span className="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">2FA on</span>}
                  {!a.is_active && <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Disabled</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{a.email}{a.last_login_at ? ` · last login ${new Date(a.last_login_at).toLocaleDateString()}` : ''}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs font-semibold">
                <button onClick={() => reset(a)} className="text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg">Reset password</button>
                {a.totp_enabled ? (
                  <button onClick={async () => { if (confirm('Disable 2FA for this admin?') && await act({ action: '2fa-disable', id: a.id })) load() }}
                    className="text-amber-700 hover:text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg">Disable 2FA</button>
                ) : (
                  <button onClick={async () => { const r = await act({ action: '2fa-setup', id: a.id }); if (r) setTwofa({ id: a.id, secret: r.secret, otpauth: r.otpauth, qr: r.qr, code: '' }) }}
                    className="text-violet-700 hover:text-violet-900 border border-violet-200 px-3 py-1.5 rounded-lg">Set up 2FA</button>
                )}
                <button onClick={async () => { if (await act({ action: 'toggle', id: a.id, is_active: !a.is_active })) load() }}
                  className="text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg">{a.is_active ? 'Disable' : 'Enable'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2FA setup modal */}
      {twofa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTwofa(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-gray-900 mb-1">Set up two-factor authentication</h3>
            <p className="text-xs text-gray-500 mb-4">Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code to confirm.</p>
            {twofa.qr ? (
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={twofa.qr} alt="2FA QR code" className="w-48 h-48 border border-gray-200 rounded-xl" />
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 break-all">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Secret</p>
                <p className="font-mono text-sm text-gray-800 select-all">{twofa.secret}</p>
              </div>
            )}
            <p className="text-[10px] text-gray-400 text-center mb-3">Can&apos;t scan? Enter this secret manually: <span className="font-mono select-all text-gray-600">{twofa.secret}</span></p>
            <input className={`${FIELD} w-full tracking-[0.3em] text-center`} placeholder="6-digit code" inputMode="numeric"
              value={twofa.code} onChange={e => setTwofa({ ...twofa, code: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setTwofa(null)} className="text-sm font-medium text-gray-500 px-4 py-2">Cancel</button>
              <button onClick={async () => { if (await act({ action: '2fa-enable', id: twofa.id, code: twofa.code })) { setTwofa(null); load() } }}
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Confirm & enable</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
