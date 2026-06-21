'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function active(href: string) {
    if (href === '/') return pathname === '/'
    if (href === '/employer') return pathname === '/employer' || pathname.startsWith('/employer/')
    return pathname.startsWith(href)
  }

  const linkBase = 'text-sm font-medium px-4 h-full flex items-center transition whitespace-nowrap'
  const activeClass = 'font-semibold text-emerald-700 border-b-2 border-emerald-600'
  const inactiveClass = 'text-gray-500 hover:text-gray-800'

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center h-full">
        <a href="/" className={`${linkBase} ${active('/') ? activeClass : inactiveClass}`}>Jobs</a>
        <a href="/companies" className={`${linkBase} ${active('/companies') ? activeClass : inactiveClass}`}>Companies</a>
        <a href="/community" className={`${linkBase} ${active('/community') ? activeClass : inactiveClass}`}>Community</a>
        <a href="/how-it-works" className={`hidden lg:flex items-center text-sm font-medium px-3 h-full transition whitespace-nowrap ${active('/how-it-works') ? activeClass : inactiveClass}`}>How it works</a>
      </nav>

      <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
        <a href="/saved" className={`text-sm font-medium transition px-3 py-2 flex items-center gap-1.5 ${active('/saved') ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Saved jobs">
          <svg className="w-4 h-4" fill={active('/saved') ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
          Saved
        </a>
        {isLoggedIn ? (
          <a href="/employer" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition px-4 py-2">My listings</a>
        ) : (
          <a href="/auth/login" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition px-4 py-2">Sign in</a>
        )}
        <a href="/employers" className={`text-sm font-medium transition px-4 py-2 border border-gray-200 rounded-lg ${active('/employers') ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}>
          For Employers
        </a>
        <a href="/post-job" className="bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition whitespace-nowrap">
          Post a Job
        </a>
      </div>

      {/* Mobile right side */}
      <div className="flex md:hidden items-center gap-2 ml-auto">
        <a href="/saved" aria-label="Saved jobs" className="p-2 text-gray-500 hover:text-gray-800 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </a>
        <button
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="p-2 text-gray-500 hover:text-gray-800 transition"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="absolute top-[var(--header-height)] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 md:hidden">
          <nav className="flex flex-col px-4 py-4 gap-1.5">
            {[
              { href: '/', label: 'Browse jobs' },
              { href: '/companies', label: 'Companies' },
              { href: '/community', label: 'Community' },
              { href: '/how-it-works', label: 'How it works' },
              { href: '/faq', label: 'FAQ' },
              { href: '/saved', label: 'Saved jobs' },
              isLoggedIn
                ? { href: '/employer', label: 'My listings' }
                : { href: '/auth/login', label: 'Sign in' },
              { href: '/worker/profile', label: 'Worker profile' },
              { href: '/employers', label: 'For Employers' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active(href) ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </a>
            ))}
            <div className="pt-3 pb-2">
              <a
                href="/post-job"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center bg-emerald-600 text-white text-sm font-bold px-4 py-3.5 rounded-xl hover:bg-emerald-700 transition"
              >
                Post a Job
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
