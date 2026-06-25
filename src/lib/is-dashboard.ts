/**
 * Dashboard routes that must NOT show the public header/footer/mobile nav.
 * Exact-segment match so the marketing page /employers (plural) is excluded.
 */
const DASHBOARD_PREFIXES = ['/admin', '/employer', '/worker']

export function isDashboardPath(pathname: string): boolean {
  return DASHBOARD_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
}
