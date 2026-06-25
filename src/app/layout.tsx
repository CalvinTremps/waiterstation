import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { getSession } from '@/lib/supabase-server'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import TopProgressBar from '@/components/TopProgressBar'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Waiterstation | Hospitality Jobs in South Africa',
  description: 'Find waiter, chef, kitchen, and hotel jobs across South Africa. Apply in seconds.',
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

        {/* ── Public header (hidden on dashboards) ── */}
        <SiteHeader isLoggedIn={!!session} />

        {/* Main content, padded bottom on mobile for tab bar */}
        <main className="pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>

        {/* ── Public footer + mobile nav (hidden on dashboards) ── */}
        <SiteFooter />
      </body>
    </html>
  )
}
