import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto'
import { createServiceClient } from './supabase-server'

/**
 * Node-only admin auth crypto: password hashing (scrypt) + TOTP (RFC 6238).
 * Do NOT import this from middleware (it uses node:crypto). Middleware uses
 * admin-session.ts instead.
 */

export interface AdminUser {
  id: string
  email: string
  name: string | null
  password_hash: string
  totp_secret: string | null
  totp_enabled: boolean
  is_active: boolean
}

// ── Password hashing (scrypt) ──────────────────────────────────────────
export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const key = scryptSync(password, salt, 32)
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, keyHex] = (stored || '').split('$')
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false
  const key = Buffer.from(keyHex, 'hex')
  const test = scryptSync(password, Buffer.from(saltHex, 'hex'), key.length)
  return key.length === test.length && timingSafeEqual(key, test)
}

// ── TOTP (RFC 6238, SHA1, 6 digits, 30s) ───────────────────────────────
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Decode(s: string): Buffer {
  const clean = s.replace(/=+$/, '').toUpperCase().replace(/\s/g, '')
  let bits = 0, value = 0
  const out: number[] = []
  for (const c of clean) {
    const idx = B32.indexOf(c)
    if (idx < 0) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8 }
  }
  return Buffer.from(out)
}

export function generateTotpSecret(): string {
  const bytes = randomBytes(20)
  let bits = 0, value = 0, out = ''
  for (const b of bytes) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5 }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31]
  return out
}

function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const h = createHmac('sha1', secret).update(buf).digest()
  const offset = h[h.length - 1] & 0xf
  const code =
    ((h[offset] & 0x7f) << 24) |
    ((h[offset + 1] & 0xff) << 16) |
    ((h[offset + 2] & 0xff) << 8) |
    (h[offset + 3] & 0xff)
  return (code % 1_000_000).toString().padStart(6, '0')
}

export function verifyTotp(secretB32: string, token: string, window = 1): boolean {
  if (!/^\d{6}$/.test(token || '')) return false
  const secret = base32Decode(secretB32)
  const counter = Math.floor(Date.now() / 1000 / 30)
  for (let w = -window; w <= window; w++) {
    if (hotp(secret, counter + w) === token) return true
  }
  return false
}

export function otpauthUrl(secret: string, label: string, issuer = 'Waiterstation'): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}` +
    `?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
}

// ── admin_users data access (service role) ─────────────────────────────
export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .single()
    return (data as AdminUser) ?? null
  } catch {
    return null
  }
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase.from('admin_users').select('*').eq('id', id).single()
    return (data as AdminUser) ?? null
  } catch {
    return null
  }
}
