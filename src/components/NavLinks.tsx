'use client'

import { usePathname } from 'next/navigation'

export default function NavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()

  function active(href: string) {
    if (href === '/') return pathname === '/'
    if (href === '/employer') return pathname === '/employer' || pathname.startsWith('/employer/')
    return pathname.startsWith(href)
  }

  const linkBase = 'text-sm font-medium px-4 h-full flex items-center transition whitespace-nowrap'
  const activeClass = 'font-semibold text-gray-800 border-b-2 border-gray-900'
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
        <a href="/saved" className={`text-sm font-medium transition px-3 py-2 flex items-center gap-1.5 ${active('/saved') ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800'}`} aria-label="Saved jobs">
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
        <a href="/employers" className={`text-sm font-medium transition px-4 py-2 border border-gray-200 rounded-lg ${active('/employers') ? 'text-gray-800 border-gray-200 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}>
          For Employers
        </a>
        <a href="/post-job" className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition whitespace-nowrap">
          Post a Job
        </a>
      </div>

    </>
  )
}
