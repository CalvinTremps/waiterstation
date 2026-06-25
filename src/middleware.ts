import { NextRequest, NextResponse } from 'next/server'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'

/**
 * Subdomain routing:
 *   profile.waiterstation.co.za  → /worker/*
 *   employer.waiterstation.co.za → /employer/*
 *   control.waiterstation.co.za  → /admin/*
 *
 * Clean-URL strategy:
 *   - Visiting / on a dashboard subdomain serves the dashboard root
 *   - Visiting /applications on profile.* serves /worker/applications
 *   - Visiting /worker/applications on profile.* redirects → /applications (clean)
 *
 * Public-site paths (denylist) are redirected to the apex domain.
 * Everything else gets the prefix prepended and is served normally — this
 * avoids the brittleness of an allowlist that would block legitimate paths.
 *
 * x-on-subdomain is set on the REQUEST so server components can read it
 * via headers() and suppress the public header/footer.
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

// Known public-site first segments that must never be served on a dashboard subdomain.
// Everything NOT in this list is assumed to belong to the dashboard.
const APEX_ONLY = new Set([
  'jobs', 'companies', 'community', 'guides', 'cruise-ship-jobs',
  'saved', 'post-job', 'employers', 'how-it-works', 'faq',
  'about', 'privacy', 'terms', 'applications',
])

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

/** Returns true if the path clearly belongs to the apex public site. */
function isApexPath(path: string): boolean {
  if (path === '/') return false
  const seg = path.split('/')[1]
  return APEX_ONLY.has(seg)
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

    // Full-prefix URL on subdomain (e.g. /worker/profile on profile.*) → strip to clean URL.
    if (path === prefix || path.startsWith(prefix + '/')) {
      const stripped = path.slice(prefix.length) || '/'
      const clean = req.nextUrl.clone()
      clean.pathname = stripped
      return NextResponse.redirect(clean)
    }

    // Known public-site path → send to apex.
    if (isApexPath(path)) {
      const apex = new URL(req.url)
      apex.host = ROOT_DOMAIN
      apex.port = ''
      return NextResponse.redirect(apex)
    }

    // Everything else (dashboard pages, unknown paths) → add prefix and rewrite.
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
      // On the control subdomain, redirect to the clean /login URL (not /admin/login
      // which would trigger another strip-redirect loop).
      login.pathname = dashSub === 'control' ? '/login' : '/admin/login'
      return NextResponse.redirect(login)
    }
  }

  // ── Build response with rewrite or pass-through ───────────────────────────
  // Pass x-on-subdomain on the REQUEST so server components can read it via headers().
  const requestHeaders = new Headers(req.headers)
  if (dashSub) requestHeaders.set('x-on-subdomain', '1')

  const res =
    url.pathname !== req.nextUrl.pathname
      ? NextResponse.rewrite(url, { request: { headers: requestHeaders } })
      : NextResponse.next({ request: { headers: requestHeaders } })

  if (dashSub) res.headers.set('X-Robots-Tag', 'noindex, nofollow')

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
