# Dashboard subdomains

The app serves its dashboards on subdomains of `waiterstation.co.za`:

| Subdomain                       | Serves            | Route prefix |
| ------------------------------- | ----------------- | ------------ |
| `profile.waiterstation.co.za`   | Candidate / worker dashboard | `/worker` |
| `employer.waiterstation.co.za`  | Employer dashboard | `/employer` |
| `control.waiterstation.co.za`   | Admin             | `/admin`     |
| `waiterstation.co.za` (apex)    | Public site (jobs, community, SEO) | — |

Routing is handled in `src/middleware.ts` (host-based rewrites). The code is
already deployed-safe: on any non-subdomain host (localhost, preview) nothing
changes.

## What you need to do (account-level — I can't do these)

### 1. Add the domains in Vercel
Project → Settings → Domains, add:
- `profile.waiterstation.co.za`
- `employer.waiterstation.co.za`
- `control.waiterstation.co.za`

### 2. DNS records (at your registrar)
Add a CNAME for each subdomain pointing to Vercel:
```
profile   CNAME  cname.vercel-dns.com
employer  CNAME  cname.vercel-dns.com
control   CNAME  cname.vercel-dns.com
```
(Vercel shows the exact target when you add each domain.)

### 3. Environment variables (Vercel → Settings → Environment Variables, Production)
```
COOKIE_DOMAIN=.waiterstation.co.za              # server: share login across subdomains
NEXT_PUBLIC_COOKIE_DOMAIN=.waiterstation.co.za  # browser: same
NEXT_PUBLIC_SUBDOMAIN_SPLIT=on                  # redirect apex /worker|/employer|/admin to the subdomains
```
Set `NEXT_PUBLIC_SUBDOMAIN_SPLIT=on` **only after** the three subdomains resolve,
otherwise apex dashboard links would redirect to domains that don't exist yet.

## Behaviour
- `profile.waiterstation.co.za` → worker dashboard; `/auth/*` and `/api/*` still
  work (shared). Same for employer/control.
- The dashboard subdomains send `X-Robots-Tag: noindex` so Google only indexes
  the public apex.
- `control.` keeps its own `admin_session` cookie (host-only) — it is **not**
  shared with the other subdomains.
- The worker/employer Supabase session is shared across subdomains via
  `COOKIE_DOMAIN`, so a single login works everywhere.

## Notes / follow-ups
- Inner URLs are clean: the middleware strips the route prefix on the
  subdomain, so `profile.waiterstation.co.za/profile` shows (not `/worker/profile`).
  Hardcoded `/worker|/employer|/admin` links still work — they 307 to the clean
  path, which is then served via an internal rewrite. (Hard loads are always
  clean; client-side `<Link>` navigations rely on Next following that redirect.)
- Auth redirect targets (e.g. after magic-link callback) go to `/worker` etc.;
  with the split on, those resolve on the right subdomain.
