'use client'

import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/employer', label: 'Dashboard', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  )},
  { href: '/employer/listings', label: 'My Listings', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
    </svg>
  )},
  { href: '/employer/applicants', label: 'Applicants', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ), badge: 5 },
  { href: '/employer/interviews', label: 'Interviews', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  )},
  { href: '/employer/saved', label: 'Saved Candidates', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
    </svg>
  )},
  { href: '/employer/analytics', label: 'Analytics', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  )},
  { href: '/employer/profile', label: 'Company Profile', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
    </svg>
  )},
]

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/employer') return pathname === '/employer'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1280px] mx-auto flex">

        {/* Sidebar – desktop */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 min-h-screen pt-6 pr-4 sticky top-0 self-start">
          <div className="mb-6 px-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Recruitment</p>
          </div>
          <nav className="flex flex-col gap-0.5">
            {NAV.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(item.href)
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                }`}
              >
                <span className={isActive(item.href) ? 'text-emerald-600' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-6 pb-6 px-3 border-t border-gray-200 mt-8">
            <a href="/post-job"
              className="flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Post a Job
            </a>
          </div>
        </aside>

        {/* Mobile top tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 px-1 py-1">
          <div className="flex items-center justify-around">
            {NAV.slice(0, 5).map(item => (
              <a key={item.href} href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition ${
                  isActive(item.href) ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                {item.icon}
                <span className="text-[9px] font-medium leading-none">{item.label.split(' ')[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 lg:px-6 py-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
