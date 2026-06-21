'use client'
import { usePathname } from 'next/navigation'

function NavItem({ href, label, active, children }: { href: string; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <a href={href} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition ${active ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>
      {children}
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </a>
  )
}

export default function MobileBottomNav() {
  const pathname = usePathname()

  // Job detail has its own sticky CTA — hide nav there
  if (pathname.startsWith('/jobs/') && pathname !== '/jobs') return null
  // Hide on admin, auth, and section portals (they have their own navbars)
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null
  if (pathname.startsWith('/employer') || pathname.startsWith('/worker')) return null

  function active(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch h-16">
        <NavItem href="/" label="Jobs" active={active('/')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active('/') ? 2.5 : 1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </NavItem>
        <NavItem href="/saved" label="Saved" active={active('/saved')}>
          <svg className="w-5 h-5" fill={active('/saved') ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </NavItem>
        <div className="flex-1 flex items-center justify-center">
          <a href="/post-job" className="bg-emerald-600 text-white rounded-full w-11 h-11 flex items-center justify-center hover:bg-emerald-700 transition shadow-md" aria-label="Post a job">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
          </a>
        </div>
        <NavItem href="/applications" label="Applied" active={active('/applications')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active('/applications') ? 2.5 : 1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        </NavItem>
        <NavItem href="/community" label="Community" active={active('/community')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active('/community') ? 2.5 : 1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </NavItem>
      </div>
    </nav>
  )
}
