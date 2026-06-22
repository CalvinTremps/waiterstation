'use client'

import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Jobs',
  '/companies': 'Companies',
  '/saved': 'Saved',
  '/community': 'Community',
  '/worker': 'My Profile',
  '/applications': 'Applications',
  '/post-job': 'Post a Job',
  '/how-it-works': 'How it Works',
  '/faq': 'FAQ',
  '/about': 'About',
  '/employers': 'For Employers',
}

function getTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/companies/')) return 'Company'
  if (pathname.startsWith('/jobs/')) return 'Job Details'
  if (pathname.startsWith('/worker/')) return 'Profile'
  return null
}

export default function MobileHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()

  // These pages manage their own top bar
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null
  if (pathname.startsWith('/employer')) return null

  const title = getTitle(pathname)
  const isHome = pathname === '/'

  return (
    <header
      className="md:hidden sticky top-0 z-40 tab-bar-glass"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-4 h-[52px]">
        {/* Left — logo on home, back-feel title on inner pages */}
        {isHome ? (
          <a href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-black">W</span>
            <span className="font-bold text-gray-900 text-base tracking-tight">Waiterstation</span>
          </a>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-black">W</span>
            {title && <span className="font-bold text-gray-900 text-base">{title}</span>}
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {isHome && (
            <a href="/saved" className="p-2 rounded-full" aria-label="Saved jobs">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </a>
          )}
          {isLoggedIn ? (
            <a href="/worker" className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center" aria-label="Profile">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </a>
          ) : (
            <a href="/auth/login"
              className="bg-gray-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
