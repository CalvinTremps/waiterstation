'use client'
import { usePathname } from 'next/navigation'

type Tab = {
  href: string
  label: string
  match: (p: string) => boolean
  icon: (active: boolean) => React.ReactNode
}

const tabs: Tab[] = [
  {
    href: '/',
    label: 'Jobs',
    match: p => p === '/' || p.startsWith('/jobs'),
    icon: active => active ? (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 7H4C2.9 7 2 7.9 2 9v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H4V9h16v10zM15 3H9c-1.1 0-2 .9-2 2v2h2V5h6v2h2V5c0-1.1-.9-2-2-2z"/>
      </svg>
    ) : (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
  },
  {
    href: '/companies',
    label: 'Companies',
    match: p => p.startsWith('/companies'),
    icon: active => active ? (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z"/>
      </svg>
    ) : (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1m-1 4h1m4-4h1m-1 4h1M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4"/>
      </svg>
    ),
  },
  {
    href: '/saved',
    label: 'Saved',
    match: p => p.startsWith('/saved'),
    icon: active => active ? (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
      </svg>
    ) : (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    ),
  },
  {
    href: '/community',
    label: 'Community',
    match: p => p.startsWith('/community'),
    icon: active => active ? (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ) : (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    ),
  },
  {
    href: '/worker',
    label: 'Profile',
    match: p => p.startsWith('/worker') || p.startsWith('/auth'),
    icon: active => active ? (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    ) : (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  // Hide on pages that have their own fixed bottom bars or don't need the nav
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null
  if (pathname.startsWith('/employer') || pathname.startsWith('/worker/')) return null
  if (pathname.startsWith('/jobs/')) return null // job detail has its own apply bar

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 tab-bar-glass"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-14">
        {tabs.map(tab => {
          const active = tab.match(pathname)
          return (
            <a
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 pt-1.5"
              style={{ color: active ? 'var(--ios-blue)' : 'var(--ios-gray)' }}
            >
              {tab.icon(active)}
              <span className="text-[10px] font-medium tracking-tight leading-none pb-0.5">
                {tab.label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
