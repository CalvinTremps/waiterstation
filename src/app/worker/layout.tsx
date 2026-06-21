'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  {
    href: '/worker',
    exact: true,
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/worker/applications',
    label: 'My Applications',
    badge: 3,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/worker/interviews',
    label: 'Interviews',
    badge: 1,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/worker/messages',
    label: 'Messages',
    badge: 2,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    href: '/worker/profile',
    label: 'My Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    href: '/worker/alerts',
    label: 'Job Alerts',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    href: '/worker/documents',
    label: 'Documents',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/worker/tips',
    label: 'Career Tips',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
]

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(item: typeof NAV[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 sticky top-0 h-screen">
        <div className="px-4 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold text-xl tracking-tight">waiter</span>
            <span className="text-gray-800 font-bold text-xl tracking-tight">station</span>
          </Link>
          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Candidate Portal</p>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group ${
                isActive(item)
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <span className={isActive(item) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="text-[10px] font-bold bg-emerald-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-2">
          <Link href="/jobs"
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Jobs
          </Link>
          <Link href="/" className="block text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition">
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold text-lg">waiter</span>
            <span className="text-gray-800 font-bold text-lg">station</span>
          </Link>
          <Link href="/jobs"
            className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
            Browse Jobs
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 flex z-50">
        {[
          { href: '/worker', exact: true, label: 'Home', badge: undefined, icon: NAV[0].icon },
          { href: '/worker/applications', exact: false, label: 'Applied', badge: 3, icon: NAV[1].icon },
          { href: '/worker/interviews', exact: false, label: 'Interviews', badge: 1, icon: NAV[2].icon },
          { href: '/worker/messages', exact: false, label: 'Messages', badge: 2, icon: NAV[3].icon },
          { href: '/worker/profile', exact: false, label: 'Profile', badge: undefined, icon: NAV[4].icon },
        ].map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition relative ${
                active ? 'text-emerald-600' : 'text-gray-400'
              }`}>
              {item.badge ? (
                <span className="absolute top-1.5 right-1/2 translate-x-3 -translate-y-0.5 text-[9px] font-bold bg-emerald-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
