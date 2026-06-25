import { NextRequest, NextResponse } from 'next/server'
import { verifySession, ADMIN_COOKIE } from '@/lib/admin-session'

/**
 * Subdomain routing for the dashboards:
 *   profile.waiterstation.co.za  -> /worker/*
 *   employer.waiterstation.co.za -> /employer/*
 *   control.waiterstation.co.za  -> /admin/*
 * The public site stays on the apex (waiterstation.co.za).
 *
 * Local dev / preview (any host that isn't a known subdomain) is unaffected,
 * so everything keeps working at localhost:3002 exactly as before.
 *
 * Enforcing the split (redirecting apex /worker|/employer|/admin to the
 * subdomain) is gated behind NEXT_PUBLIC_SUBDOMAIN_SPLIT=on so it can be turned
 * on only AFTER the subdomains + DNS are configured in Vercel.
 */

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

const ROOT_DOMAIN = 'waiterstation.co.za'

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

export async function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase()
  const sub = host.split('.')[0]
  const onRootDomain = host.endsWith(ROOT_DOMAIN)
  const dashSub = onRootDomain && SUB_PREFIX[sub] ? sub : null

  const url = req.nextUrl.clone()
  let path = url.pathname

  // ── On a dashboard subdomain: serve that dashboard with clean URLs ──
  if (dashSub && !isShared(path)) {
    const prefix = SUB_PREFIX[dashSub]
    if (path === prefix || path.startsWith(prefix + '/')) {
      // A hardcoded /worker|/employer|/admin link on the subdomain:
      // strip the prefix so the browser shows a clean path (e.g. /profile).
      const stripped = path.slice(prefix.length) || '/'
      const clean = req.nextUrl.clone()
      clean.pathname = stripped
      return NextResponse.redirect(clean)
    }
    // Clean path -> serve the prefixed route internally.
    path = prefix + (path === '/' ? '' : path)
    url.pathname = path
  }

  // ── Optional: push apex dashboard paths onto their subdomain ──
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

  // ── Admin auth (whether reached via control. subdomain or /admin path) ──
  // Fail-closed: a missing/invalid signed session never grants access.
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminId = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value)
    if (!adminId) {
      const login = req.nextUrl.clone()
      login.pathname = '/admin/login'
      return NextResponse.redirect(login)
    }
  }

  // Apply the rewrite (if the path changed) and keep dashboards out of search.
  const res =
    url.pathname !== req.nextUrl.pathname
      ? NextResponse.rewrite(url)
      : NextResponse.next()
  if (dashSub) res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export const config = {
  // Run on everything except static assets and Next internals.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
