/**
 * Signed admin session token (stateless, HMAC-SHA256).
 *
 * Uses Web Crypto only so it works in BOTH the Edge middleware and Node
 * routes. The cookie carries `base64url(payload).base64url(sig)` where the
 * payload is { sub: adminId, exp }. We never store the password in the cookie.
 *
 * Keep this file free of `node:crypto` imports — middleware runs on the edge.
 */

const enc = new TextEncoder()

function b64url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(s: string): Uint8Array {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(pad + '==='.slice((pad.length + 3) % 4))
  return Uint8Array.from(bin, c => c.charCodeAt(0))
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return new Uint8Array(sig)
}

export function sessionSecret(): string {
  // Dedicated secret if provided; otherwise fall back to ADMIN_PASSWORD so the
  // feature works with minimal config (still server-only and never exposed).
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

export async function signSession(adminId: string, ttlSeconds = 60 * 60 * 8): Promise<string> {
  const secret = sessionSecret()
  const payload = b64url(enc.encode(JSON.stringify({ sub: adminId, exp: Math.floor(Date.now() / 1000) + ttlSeconds })))
  const sig = b64url(await hmac(secret, payload))
  return `${payload}.${sig}`
}

/** Returns the admin id if the token is valid and unexpired, else null. */
export async function verifySession(token: string | undefined | null): Promise<string | null> {
  const secret = sessionSecret()
  if (!token || !secret) return null
  const dot = token.indexOf('.')
  if (dot < 1) return null
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = b64url(await hmac(secret, payload))
  if (sig.length !== expected.length) return null
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i)
  if (diff !== 0) return null
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)))
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null
    return typeof data.sub === 'string' ? data.sub : null
  } catch {
    return null
  }
}

export const ADMIN_COOKIE = 'admin_session'
