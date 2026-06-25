'use client'

import { usePathname } from 'next/navigation'
import NavLinks from '@/components/NavLinks'
import MobileHeader from '@/components/MobileHeader'
import { isDashboardPath } from '@/lib/is-dashboard'

/** Public header (mobile + desktop). Hidden on dashboard routes. */
export default function SiteHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()
  if (isDashboardPath(pathname)) return null

  return (
    <>
      <MobileHeader isLoggedIn={isLoggedIn} />
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200 h-[var(--header-height)]">
        <div className="max-w-[1440px] mx-auto w-full px-6 h-full flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold">W</span>
            <span className="font-bold text-gray-900 tracking-tight">Waiterstation</span>
          </a>
          <NavLinks isLoggedIn={isLoggedIn} />
        </div>
      </header>
    </>
  )
}
