import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { getSession } from '@/lib/supabase-server'
import NavLinks from '@/components/NavLinks'
import MobileBottomNav from '@/components/MobileBottomNav'
import MobileHeader from '@/components/MobileHeader'
import TopProgressBar from '@/components/TopProgressBar'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Waiterstation | Hospitality Jobs in South Africa',
  description: 'Find waiter, chef, kitchen, and hotel jobs across South Africa. Apply in seconds — no CV required.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Waiterstation',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession().catch(() => null)

  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        {/* ── Route progress bar ── */}
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>

        {/* ── Mobile header (iOS-style, replaces hamburger) ── */}
        <MobileHeader isLoggedIn={!!session} />

        {/* ── Desktop header ── */}
        <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200 h-[var(--header-height)]">
          <div className="max-w-[1440px] mx-auto w-full px-6 h-full flex items-center gap-6">
            <a href="/" className="flex items-center gap-2 shrink-0">
              <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold">W</span>
              <span className="font-bold text-gray-900 tracking-tight">Waiterstation</span>
            </a>
            <NavLinks isLoggedIn={!!session} />
          </div>
        </header>

        {/* Main content — padded bottom on mobile for tab bar */}
        <main className="pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>

        {/* ── Desktop footer (hidden on mobile) ── */}
        <footer className="hidden md:block mt-24 border-t border-gray-100 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
              <div>
                <a href="/" className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center text-white text-xs font-bold">W</span>
                  <span className="font-bold text-gray-900 text-sm">Waiterstation</span>
                </a>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Hospitality jobs across South Africa. Apply in seconds — no CV required.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">For Workers</p>
                <div className="space-y-2.5">
                  {[
                    { href: '/', label: 'Browse jobs' },
                    { href: '/saved', label: 'Saved jobs' },
                    { href: '/cruise-ship-jobs', label: 'Cruise ship jobs' },
                    { href: '/guides', label: 'Career guides' },
                    { href: '/how-it-works', label: 'How it works' },
                  ].map(l => (
                    <a key={l.href} href={l.href} className="block text-sm text-gray-500 hover:text-gray-800 transition">{l.label}</a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">For Employers</p>
                <div className="space-y-2.5">
                  {[
                    { href: '/post-job', label: 'Post a job' },
                    { href: '/employers', label: 'Why Waiterstation' },
                    { href: '/employer', label: 'My listings' },
                    { href: '/faq', label: 'FAQ' },
                  ].map(l => (
                    <a key={l.href} href={l.href} className="block text-sm text-gray-500 hover:text-gray-800 transition">{l.label}</a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Company</p>
                <div className="space-y-2.5">
                  {[
                    { href: '/about', label: 'About' },
                    { href: '/community', label: 'Community' },
                    { href: '/companies', label: 'Company reviews' },
                    { href: '/privacy', label: 'Privacy policy' },
                    { href: '/terms', label: 'Terms of service' },
                  ].map(l => (
                    <a key={l.href} href={l.href} className="block text-sm text-gray-500 hover:text-gray-800 transition">{l.label}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} Waiterstation. All rights reserved.</p>
              <p className="text-xs text-gray-400">Built for South Africa's hospitality industry.</p>
            </div>
          </div>
        </footer>

        <MobileBottomNav />
      </body>
    </html>
  )
}
