'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Share the auth session across subdomains (profile./employer.) when
  // NEXT_PUBLIC_COOKIE_DOMAIN is set, e.g. ".waiterstation.co.za". Unset in dev.
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    domain ? { cookieOptions: { domain } } : undefined,
  )
}
