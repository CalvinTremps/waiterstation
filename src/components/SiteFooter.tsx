'use client'

import { usePathname } from 'next/navigation'
import MobileBottomNav from '@/components/MobileBottomNav'
import { isDashboardPath } from '@/lib/is-dashboard'

const FOOTER_COLS = [
  {
    title: 'For Workers',
    links: [
      { href: '/', label: 'Browse jobs' },
      { href: '/saved', label: 'Saved jobs' },
      { href: '/cruise-ship-jobs', label: 'Cruise ship jobs' },
      { href: '/guides', label: 'Career guides' },
      { href: '/how-it-works', label: 'How it works' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { href: '/post-job', label: 'Post a job' },
      { href: '/employers', label: 'Why Waiterstation' },
      { href: '/employer', label: 'My listings' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/community', label: 'Community' },
      { href: '/companies', label: 'Company reviews' },
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
    ],
  },
]

/** Public footer + mobile bottom nav. Hidden on dashboard routes. */
export default function SiteFooter() {
  const pathname = usePathname()
  if (isDashboardPath(pathname)) return null

  return (
    <>
      <footer className="hidden md:block mt-24 border-t border-gray-100 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            <div>
              <a href="/" className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center text-white text-xs font-bold">W</span>
                <span className="font-bold text-gray-900 text-sm">Waiterstation</span>
              </a>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hospitality jobs across South Africa. Apply in seconds.
              </p>
            </div>
            {FOOTER_COLS.map(col => (
              <div key={col.title}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{col.title}</p>
                <div className="space-y-2.5">
                  {col.links.map(l => (
                    <a key={l.href} href={l.href} className="block text-sm text-gray-500 hover:text-gray-800 transition">{l.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">© 2026 Waiterstation. All rights reserved.</p>
            <p className="text-xs text-gray-400">Built for South Africa&apos;s hospitality industry.</p>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </>
  )
}
