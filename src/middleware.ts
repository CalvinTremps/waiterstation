import { NextRequest, NextResponse } from 'next/server'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'

/**
 * Subdomain routing:
 *   profile.waiterstation.co.za  → /worker/*  (clean URLs: /, /applications, …)
 *   employer.waiterstation.co.za → /employer/* (clean URLs: /, /listings, …)
 *   control.waiterstation.co.za  → /admin/*    (clean URLs: /, /jobs, …)
 *
 * Any path on a dashboard subdomain that does NOT belong to that dashboard
 * is redirected to the apex domain at the same path, so nav links to the
 * main site always land in the right place.
 *
 * The middleware also sets the response header `x-on-subdomain: 1` so the
 * server layout can suppress the public header/footer without relying on
 * the client-side pathname (which shows the clean URL, not the internal one).
 */

const ROOT_DOMAIN = 'waiterstation.co.za'

const SUB_PREFIX: Record<string, string> = {
  profile: '/worker',
  employer: '/employer',
  control: '/admin',
}
const PREFIX_SUB: Record<string, string> = {
  '/worker': 'profile',
  '/employer': 'employer',
  '/admin': 'control',
}

// First path segment that is valid on each subdomain.
// Dynamic segments (e.g. /jobs/123) match via prefix — we check the first
// segment only, so /jobs/abc matches the 'jobs' entry.
const VALID_SEGMENTS: Record<string, Set<string>> = {
  profile: new Set([
    'alerts', 'applications', 'availability', 'cv', 'documents',
    'feed', 'history', 'interviews', 'messages', 'profile',
    'references', 'tips',
  ]),
  employer: new Set([
    'analytics', 'applicants', 'candidates', 'employees', 'interviews',
    'jobs', 'leave', 'listings', 'notices', 'payroll', 'performance',
    'pipeline', 'pools', 'profile', 'saved', 'shifts', 'smart-alerts',
    'staff-documents', 'timesheets',
  ]),
  control: new Set([
    'admins', 'applications', 'brand-links', 'brands', 'franchises',
    'jobs', 'login', 'marketing', 'settings', 'users',
  ]),
}

function isShared(path: string) {
  return (
    path.startsWith('/api') ||
    path.startsWith('/auth') ||
    path.startsWith('/_next') ||
    path.startsWith('/sitemap') ||
    path.startsWith('/robots') ||
    path === '/favicon.ico'
  )
}

/** True when the clean path belongs to the given subdomain's dashboard. */
function ownedBySubdomain(path: string, sub: string): boolean {
  if (path === '/') return true
  const firstSegment = path.split('/')[1] // e.g. "applications" from "/applications/123"
  return VALID_SEGMENTS[sub]?.has(firstSegment) ?? false
}

export async function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase()
  const sub = host.split('.')[0]
  const onRootDomain = host.endsWith(ROOT_DOMAIN)
  const dashSub = onRootDomain && SUB_PREFIX[sub] ? sub : null

  const url = req.nextUrl.clone()
  let path = url.pathname

  // ── On a dashboard subdomain ──────────────────────────────────────────────
  if (dashSub && !isShared(path)) {
    const prefix = SUB_PREFIX[dashSub]

    // A hardcoded full-prefix link (e.g. /worker/profile): strip it to clean URL.
    if (path === prefix || path.startsWith(prefix + '/')) {
      const stripped = path.slice(prefix.length) || '/'
      const clean = req.nextUrl.clone()
      clean.pathname = stripped
      return NextResponse.redirect(clean)
    }

    // Path doesn't belong to this subdomain → send to apex domain.
    if (!ownedBySubdomain(path, dashSub)) {
      const apex = new URL(req.url)
      apex.host = ROOT_DOMAIN
      apex.port = ''
      return NextResponse.redirect(apex)
    }

    // Valid dashboard path: rewrite internally to the prefixed route.
    path = prefix + (path === '/' ? '' : path)
    url.pathname = path
  }

  // ── Optional: push apex dashboard paths onto their subdomain ─────────────
  if (!dashSub && onRootDomain && process.env.NEXT_PUBLIC_SUBDOMAIN_SPLIT === 'on') {
    for (const [prefix, target] of Object.entries(PREFIX_SUB)) {
      if (path === prefix || path.startsWith(prefix + '/')) {
        const dest = new URL(req.url)
        dest.host = `${target}.${ROOT_DOMAIN}`
        dest.port = ''
        return NextResponse.redirect(dest)
      }
    }
  }

  // ── Admin auth ────────────────────────────────────────────────────────────
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminId = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value)
    if (!adminId) {
      const login = req.nextUrl.clone()
      login.pathname = '/admin/login'
      return NextResponse.redirect(login)
    }
  }

  // Apply rewrite (if path changed) and tag dashboard responses.
  const res =
    url.pathname !== req.nextUrl.pathname
      ? NextResponse.rewrite(url)
      : NextResponse.next()

  if (dashSub) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    res.headers.set('x-on-subdomain', '1')
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
